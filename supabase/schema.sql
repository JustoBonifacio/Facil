
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geospatial queries

-- ==========================================
-- ENUMS
-- ==========================================
CREATE TYPE user_role AS ENUM ('OWNER', 'CLIENT', 'ADMIN');
CREATE TYPE listing_category AS ENUM ('HOUSE', 'APARTMENT', 'LAND', 'SHOP', 'WAREHOUSE', 'CAR');
CREATE TYPE transaction_type AS ENUM ('RENT', 'BUY');
CREATE TYPE listing_status AS ENUM ('AVAILABLE', 'RENTED', 'SOLD', 'PAUSED', 'PENDING_REVIEW');
CREATE TYPE notification_type AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR');

-- ==========================================
-- PROFILES (Public user data)
-- ==========================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'CLIENT',
  is_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  rating NUMERIC(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Secure the table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ==========================================
-- LISTINGS
-- ==========================================
CREATE TABLE listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'AOA',
  category listing_category NOT NULL,
  transaction_type transaction_type NOT NULL,
  status listing_status DEFAULT 'PENDING_REVIEW',
  images TEXT[] DEFAULT '{}',
  
  -- Location (Simplified for JSON storage + PostGIS later if needed)
  city TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  
  features TEXT[] DEFAULT '{}',
  views BIGINT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for search performance
CREATE INDEX listings_location_idx ON listings(city, neighborhood);
CREATE INDEX listings_category_idx ON listings(category);
CREATE INDEX listings_price_idx ON listings(price);

-- RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listings are viewable by everyone" 
  ON listings FOR SELECT USING (status = 'AVAILABLE' OR auth.uid() = owner_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'ADMIN');

CREATE POLICY "Owners can insert listings" 
  ON listings FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own listings" 
  ON listings FOR UPDATE USING (auth.uid() = owner_id);

-- ==========================================
-- MESSAGES
-- ==========================================
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id),
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  receiver_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own messages" 
  ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" 
  ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ==========================================
-- NOTIFICATIONS
-- ==========================================
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type DEFAULT 'INFO',
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own notifications" 
  ON notifications FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', (new.raw_user_meta_data->>'role')::user_role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
