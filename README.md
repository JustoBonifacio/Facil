<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1-xrBQX_bWRC6T2-6Zmyjh56ibIZRxub7

### 🗄️ Backend (Opcional)

Este projeto usa **Supabase** como backend, mas funciona totalmente em **Modo Mock** se não forem fornecidas chaves de API.

#### Para ligar ao Supabase Real:

1. Crie um projeto em [Supabase.com](https://supabase.com)
2. Vá ao **SQL Editor** e execute o script em `supabase/schema.sql`
3. Copie a URL e ANON KEY do projeto
4. Renomeie `.env.example` para `.env` e preencha as variáveis:
   ```env
   VITE_SUPABASE_URL=sua_url_aqui
   VITE_SUPABASE_ANON_KEY=sua_key_aqui
   ```
5. Reinicie o servidor: `npm run dev`

Se as chaves não forem fornecidas, a aplicação usará dados fictícios automaticamente.

### 🚀 Execução

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
