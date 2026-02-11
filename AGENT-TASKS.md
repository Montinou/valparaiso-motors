# Agent Tasks — Swarm Breakdown

## Agent 1: Data Scraper
**Task**: Scrapear specs y datos de todos los vehículos
**Output**: `/valparaiso-motors/data/vehicles.json`
**Sources**:
- valparaisomotors.com (11 model pages)
- haval.com.ar (precios)
- gwm.com.ar (precios)
- changan.com.ar (Changan specs)
**Deliverable**: JSON array con todos los vehículos, specs completos, precios, categorías, imágenes

## Agent 2: Frontend — Scaffold + Layout + Landing
**Task**: Crear Next.js 16 app, layout, landing page, navbar, footer, brand showcase
**Input**: ARCHITECTURE.md, brand colors/identity
**Output**: App funcional con landing page, layout responsive, navegación
**Depends on**: Nothing (can start immediately)

## Agent 3: Frontend — Vehicle Catalog + Detail Pages
**Task**: Páginas de catálogo y fichas de vehículo
**Input**: vehicles.json (from Agent 1), ARCHITECTURE.md
**Output**: /vehiculos grid page + /vehiculos/[slug] detail page
**Depends on**: Agent 1 (vehicles.json), Agent 2 (layout)

## Agent 4: Frontend — Comparator + Financing Calculator
**Task**: Comparador multi-marca + calculadora de financiación
**Input**: vehicles.json, ARCHITECTURE.md
**Output**: /comparar page + /financiacion page
**Depends on**: Agent 1 (vehicles.json), Agent 2 (layout)

## Agent 5: Backend — Supabase + API Routes + AI Chat
**Task**: Setup Supabase schema, API routes for leads/chat, AI chat widget
**Input**: ARCHITECTURE.md (schema SQL + AI system prompt)
**Output**: Supabase tables, API routes, chat-widget component
**Depends on**: Agent 2 (app scaffold)

## Agent 6: Frontend — Admin Dashboard
**Task**: Dashboard de leads, analytics, gestión de test drives
**Input**: ARCHITECTURE.md, Supabase schema
**Output**: /admin pages with lead management
**Depends on**: Agent 5 (Supabase schema + API)

## Execution Order
```
Agent 1 (data) ──────────────────────────────→ vehicles.json
Agent 2 (scaffold) ──────────────────────────→ base app
                    ├─→ Agent 3 (catalog)    → vehicle pages
                    ├─→ Agent 4 (comparator) → compare + finance pages
                    └─→ Agent 5 (backend)    → supabase + api + chat
                                └─→ Agent 6 (admin) → dashboard
```

Phase 1 parallel: Agent 1 + Agent 2
Phase 2 parallel: Agent 3 + Agent 4 + Agent 5 (once Agent 1 + 2 done)
Phase 3: Agent 6 (once Agent 5 done)
