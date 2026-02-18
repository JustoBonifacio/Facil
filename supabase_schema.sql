-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('CLIENT', 'OWNER', 'ADMIN');
CREATE TYPE listing_category AS ENUM ('HOUSE', 'APARTMENT', 'LAND', 'OFFICE', 'SHOP', 'WAREHOUSE', 'CAR', 'MOTORCYCLE', 'TRUCK', 'BOAT', 'OTHER');
CREATE TYPE transaction_type AS ENUM ('RENT', 'SALE');
CREATE TYPE listing_status AS ENUM ('DRAFT', 'PENDING', 'AVAILABLE', 'SOLD', 'RENTED', 'REJECTED', 'ARCHIVED');

-- 2. PROFILES TABLE (Linked to auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT,
  role user_role DEFAULT 'CLIENT',
  phone TEXT,
  nif TEXT,
  company_name TEXT,
  address TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. LISTINGS TABLE
CREATE TABLE public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'AOA',
  category listing_category NOT NULL,
  transaction_type transaction_type NOT NULL,
  status listing_status DEFAULT 'PENDING',
  images TEXT[] DEFAULT '{}',
  city TEXT NOT NULL,
  neighborhood TEXT,
  latitude FLOAT,
  longitude FLOAT,
  features TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. MESSAGES TABLE
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id),
  sender_id UUID REFERENCES public.profiles(id) NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CONTRACTS TABLE (New!)
CREATE TABLE public.contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) NOT NULL,
  client_id UUID REFERENCES public.profiles(id) NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  status TEXT DEFAULT 'PENDING_SIGNATURE', -- PENDING, ACTIVE, COMPLETED, CANCELLED
  terms_accepted BOOLEAN DEFAULT FALSE,
  client_signed_at TIMESTAMP WITH TIME ZONE,
  owner_signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. SECURITY POLICIES (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, User update own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: Public read (available), Owners update own
CREATE POLICY "Listings are viewable by everyone" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Owners can create listings" ON public.listings FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update own listings" ON public.listings FOR UPDATE USING (auth.uid() = owner_id);

-- Messages: Participants read/write
CREATE POLICY "Users can see their messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Contracts: Participants read/write
CREATE POLICY "Users can see their contracts" ON public.contracts FOR SELECT USING (auth.uid() = client_id OR auth.uid() = owner_id);
CREATE POLICY "Users can create contracts" ON public.contracts FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can update own contracts" ON public.contracts FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = owner_id);

-- 7. TRIGGER FOR NEW USER (Sync Auth -> Profile)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, created_at, updated_at)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', 'New User'),
    new.email,
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'CLIENT'),
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. STORAGE BUCKETS (Need to create 'listings-images' and 'avatars' in Storage panel)
-- (SQL for storage buckets is not standard across all Supabase versions, best done via UI)
