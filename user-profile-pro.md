# Plano de Implementação: Perfil do Utilizador Pro

Este plano detalha a implementação das funcionalidades avançadas para o perfil do utilizador na plataforma Facil, transformando-a em uma ferramenta completa de gestão e busca.

## Visão Geral
Modificar a arquitetura atual para suportar um perfil de cliente/anunciante robusto, incluindo gestão de favoritos, alertas, histórico, agendamento e documentos.

## Project Type
**WEB** (React + Supabase)

## Success Criteria
- [ ] Usuários podem favoritar anúncios e gerenciar listas.
- [ ] Sistema de alertas operante para novos anúncios e mudanças de preço.
- [ ] Dashboard unificado com estatísticas de busca e visualizações recentes.
- [ ] Interface de agendamento de visitas com calendário.
- [ ] Módulo de gestão de documentos com upload e status de verificação.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Lucide Icons (ícones).
- **Backend/DB**: Supabase (PostgreSQL), Edge Functions (para alertas/notificações).
- **Storage**: Supabase Storage (para documentos).

## File Structure Extensions
```plaintext
src/
├── components/
│   ├── dashboard/
│   │   ├── FavoriteList.tsx
│   │   ├── SearchAlerts.tsx
│   │   ├── AppointmentCalendar.tsx
│   │   └── DocumentManager.tsx
│   └── search/
│       └── MapSearch.tsx
├── hooks/
│   ├── useFavorites.ts
│   └── useAppointments.ts
└── pages/
    └── UserProfilePage.tsx
```

## Task Breakdown

### Fase 1: Fundação (Banco de Dados)
- **Task ID**: DB_001
- **Name**: Extensão do Schema Supabase
- **Agent**: `database-architect`
- **Description**: Criar tabelas para `favorites`, `search_alerts`, `appointments`, `user_documents` e `view_history`.
- **INPUT**: `src/schema.sql` atual.
- **OUTPUT**: Script SQL de migração.
- **VERIFY**: Tabelas aparecem no dashboard do Supabase.

### Fase 2: Core Business Logic (Types & Services)
- **Task ID**: LOGIC_001
- **Name**: Atualização de Tipos e Hooks
- **Agent**: `backend-specialist`
- **Description**: Adicionar novas interfaces ao `src/types/index.ts` e criar hooks para gestão de favoritos e alertas.
- **INPUT**: `src/types/index.ts`.
- **OUTPUT**: Tipos atualizados e novos hooks.
- **VERIFY**: Compilação sem erros de tipo.

### Fase 3: UI/UX - Dashboard Pro
- **Task ID**: UI_001
- **Name**: Redesign do Dashboard e Perfil
- **Agent**: `frontend-specialist`
- **Description**: Implementar a nova interface do Dashboard com abas para: Atividade, Anúncios, Favoritos e Documentos.
- **INPUT**: `src/pages/DashboardPage.tsx`.
- **OUTPUT**: DashboardPage refatorada e novos sub-componentes.
- **VERIFY**: Navegação fluida entre abas e visual premium.

### Fase 4: Funcionalidades Específicas
- **Task ID**: FEAT_MAP
- **Name**: Pesquisa por Mapa de longo alcance
- **Agent**: `frontend-specialist`
- **Description**: Implementar visualização Leaflet com raio de busca.
- **VERIFY**: Marcadores aparecem no mapa conforme localização.

- **Task ID**: FEAT_DOCS
- **Name**: Gestão de Documentos e Selo de Confiança
- **Agent**: `frontend-specialist`
- **Description**: UI de upload e indicação visual de perfil verificado.
- **VERIFY**: Upload de arquivo funciona e ícone de verificado aparece no perfil.

## Phase X: Verification
- [ ] `python .agent/scripts/checklist.py .`
- [ ] Teste manual de fluxo: Favoritar -> Ver no Dashboard.
- [ ] Teste de upload de documento.
- [ ] Verificação de responsividade mobile do novo Dashboard.

## ✅ ESTÁGIO: AGUARDANDO APROVAÇÃO DO PLANO
