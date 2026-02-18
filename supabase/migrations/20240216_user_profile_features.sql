
-- Tabela de Favoritos
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  "userId" uuid references public.users(id) on delete cascade not null,
  "listingId" uuid references public.listings(id) on delete cascade not null,
  "createdAt" timestamp with time zone default timezone('utc'::text, now()),
  unique("userId", "listingId")
);

alter table public.favorites enable row level security;
create policy "Users can manage their own favorites." on public.favorites
  for all using (auth.uid() = "userId");

-- Tabela de Alertas de Pesquisa
create table public.search_alerts (
  id uuid default gen_random_uuid() primary key,
  "userId" uuid references public.users(id) on delete cascade not null,
  title text not null,
  filters jsonb not null,
  "isActive" boolean default true,
  "lastRunAt" timestamp with time zone,
  "createdAt" timestamp with time zone default timezone('utc'::text, now())
);

alter table public.search_alerts enable row level security;
create policy "Users can manage their own alerts." on public.search_alerts
  for all using (auth.uid() = "userId");

-- Tabela de Agendamentos (Visitas)
create table public.appointments (
  id uuid default gen_random_uuid() primary key,
  "clientId" uuid references public.users(id) not null,
  "ownerId" uuid references public.users(id) not null,
  "listingId" uuid references public.listings(id) on delete cascade not null,
  "date" timestamp with time zone not null,
  status text check (status in ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')) default 'PENDING',
  notes text,
  "createdAt" timestamp with time zone default timezone('utc'::text, now())
);

alter table public.appointments enable row level security;
create policy "Users can see appointments they are part of." on public.appointments
  for select using (auth.uid() = "clientId" or auth.uid() = "ownerId");
create policy "Clients can insert appointments." on public.appointments
  for insert with check (auth.uid() = "clientId");
create policy "Users can update their own appointments." on public.appointments
  for update using (auth.uid() = "clientId" or auth.uid() = "ownerId");

-- Tabela de Documentos do Usuário
create table public.user_documents (
  id uuid default gen_random_uuid() primary key,
  "userId" uuid references public.users(id) on delete cascade not null,
  "type" text not null, -- ex: 'ID_CARD', 'TAX_ID', 'PROOF_ADDRESS'
  "url" text not null,
  status text check (status in ('PENDING', 'VERIFIED', 'REJECTED')) default 'PENDING',
  "verifiedAt" timestamp with time zone,
  "rejectionReason" text,
  "createdAt" timestamp with time zone default timezone('utc'::text, now())
);

alter table public.user_documents enable row level security;
create policy "Users can manage their own documents." on public.user_documents
  for all using (auth.uid() = "userId");
-- Apenas admins podem ver todos os documentos (Isso exigiria uma role de admin no auth.users ou similar)

-- Histórico de Visualizações
create table public.view_history (
  id uuid default gen_random_uuid() primary key,
  "userId" uuid references public.users(id) on delete cascade not null,
  "listingId" uuid references public.listings(id) on delete cascade not null,
  "viewedAt" timestamp with time zone default timezone('utc'::text, now())
);

alter table public.view_history enable row level security;
create policy "Users can see their own view history." on public.view_history
  for select using (auth.uid() = "userId");
create policy "Users can insert their own view history." on public.view_history
  for insert with check (auth.uid() = "userId");

-- Configurar Storage para Documentos
-- Nota: Isso geralmente é feito via Dashboard do Supabase, mas o SQL abaixo cria o bucket
insert into storage.buckets (id, name, public) values ('user-documents', 'user-documents', false)
on conflict (id) do nothing;

create policy "Users can upload their own documents." on storage.objects
  for insert with check (bucket_id = 'user-documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view their own documents." on storage.objects
  for select using (bucket_id = 'user-documents' and auth.uid()::text = (storage.foldername(name))[1]);
