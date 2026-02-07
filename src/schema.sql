
-- Tabela de Perfis de Usuários (Public Users)
-- Supabase gerencia autenticação em auth.users, mas precisamos de dados extras
create table public.users (
  id uuid references auth.users not null primary key,
  name text,
  email text,
  role text check (role in ('OWNER', 'CLIENT', 'ADMIN')),
  "isVerified" boolean default false,
  avatar text,
  rating float default 0,
  "reviewCount" int default 0,
  "joinedAt" timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar RLS
alter table public.users enable row level security;

-- Políticas de acesso para Users
create policy "Public profiles are viewable by everyone." on public.users for select using (true);
create policy "Users can insert their own profile." on public.users for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.users for update using (auth.uid() = id);

-- Tabela de Anúncios (Listings)
create table public.listings (
  id uuid default gen_random_uuid() primary key,
  "ownerId" uuid references public.users(id) not null,
  title text not null,
  description text,
  price numeric,
  currency text default 'AOA',
  category text,
  "transactionType" text,
  status text default 'AVAILABLE',
  images text[],
  location jsonb,
  views int default 0,
  "createdAt" timestamp with time zone default timezone('utc'::text, now()),
  features text[],
  "updatedAt" timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar RLS
alter table public.listings enable row level security;

-- Políticas de acesso para Listings
create policy "Listings are viewable by everyone." on public.listings for select using (true);
create policy "Users can insert their own listings." on public.listings for insert with check (auth.uid() = "ownerId");
create policy "Users can update own listings." on public.listings for update using (auth.uid() = "ownerId");
create policy "Users can delete own listings." on public.listings for delete using (auth.uid() = "ownerId");

-- Tabela de Mensagens
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  "listingId" uuid references public.listings(id),
  "senderId" uuid references public.users(id),
  "receiverId" uuid references public.users(id),
  content text,
  timestamp timestamp with time zone default timezone('utc'::text, now()),
  read boolean default false
);

-- Habilitar RLS
alter table public.messages enable row level security;

-- Políticas de acesso para Mensagens
create policy "Users can see messages sent to or by them." on public.messages for select using (auth.uid() = "senderId" or auth.uid() = "receiverId");
create policy "Users can insert messages." on public.messages for insert with check (auth.uid() = "senderId");

-- Trigger para criar perfil automaticamente ao cadastrar usuário (Opcional, mas útil)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, name, role, avatar)
  values (new.id, new.email, new.raw_user_meta_data->>'name', coalesce(new.raw_user_meta_data->>'role', 'CLIENT'), new.raw_user_meta_data->>'avatar');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
