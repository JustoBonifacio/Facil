
-- 1. Tabelas para Novas Funcionalidades

-- Listas Personalizadas (Coleções)
CREATE TABLE IF NOT EXISTS public.user_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  listings UUID[] DEFAULT '{}', -- Array de IDs de anúncios
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own lists" ON public.user_lists FOR ALL USING (auth.uid() = "userId");

-- Avaliações (Reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "reviewerId" UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  "targetId" UUID NOT NULL, -- Pode ser ID de perfil ou ID de listing
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = "reviewerId");

-- Histórico de Pesquisas
CREATE TABLE IF NOT EXISTS public.search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  query TEXT,
  filters JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own search history" ON public.search_history FOR SELECT USING (auth.uid() = "userId");
CREATE POLICY "Users can insert their own search history" ON public.search_history FOR INSERT WITH CHECK (auth.uid() = "userId");

-- 2. Atualizar Tabela de Anúncios com Histórico de Preços e Área
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS area NUMERIC;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS price_history JSONB DEFAULT '[]';

-- 3. Função para detetar baixa de preço e gerar alerta/notificação
CREATE OR REPLACE FUNCTION public.check_price_drop() 
RETURNS TRIGGER AS $$
DECLARE
    old_price NUMERIC;
BEGIN
    IF (OLD.price > NEW.price) THEN
        -- Adicionar ao histórico de preços
        NEW.price_history = COALESCE(OLD.price_history, '[]'::jsonb) || jsonb_build_object('price', OLD.price, 'date', OLD.updated_at);
        
        -- Aqui poderíamos disparar uma notificação real para quem tem o imóvel em favoritos
        -- Por agora, apenas preparamos o dado para o frontend
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_listing_price_update ON public.listings;
CREATE TRIGGER on_listing_price_update
  BEFORE UPDATE OF price ON public.listings
  FOR EACH ROW EXECUTE PROCEDURE public.check_price_drop();
