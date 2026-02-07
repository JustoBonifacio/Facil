
-- 1. Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nif TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;

-- 2. Update the trigger function to handle new fields
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, phone, nif, company_name, address)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', 
    (new.raw_user_meta_data->>'role')::user_role,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'nif',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'address'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
