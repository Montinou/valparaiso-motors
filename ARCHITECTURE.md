# Arquitectura MVP — Valparaíso Digital

## Stack
| Componente | Tecnología |
|------------|------------|
| Framework | Next.js 16+ (App Router, RSC) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (para dashboard admin) |
| AI | Gemini Flash vía Vercel AI Gateway |
| Hosting | Vercel |
| Storage | Supabase Storage |

## Estructura del Proyecto
```
valparaiso-app/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing principal
│   │   ├── layout.tsx                  # Root layout
│   │   ├── vehiculos/
│   │   │   ├── page.tsx                # Catálogo general
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Ficha de vehículo
│   │   ├── comparar/
│   │   │   └── page.tsx                # Comparador multi-marca
│   │   ├── financiacion/
│   │   │   └── page.tsx                # Calculadora de cuotas
│   │   ├── contacto/
│   │   │   └── page.tsx                # Formulario + WhatsApp
│   │   ├── test-drive/
│   │   │   └── page.tsx                # Agendar test drive
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts            # AI chat endpoint
│   │   │   ├── leads/
│   │   │   │   └── route.ts            # Lead capture
│   │   │   └── contact/
│   │   │       └── route.ts            # Contact form
│   │   └── admin/
│   │       ├── page.tsx                # Dashboard admin
│   │       ├── leads/
│   │       │   └── page.tsx            # Gestión de leads
│   │       └── analytics/
│   │           └── page.tsx            # Analytics
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components
│   │   ├── vehicle-card.tsx            # Card de vehículo
│   │   ├── vehicle-comparator.tsx      # Tabla comparativa
│   │   ├── financing-calculator.tsx    # Calculadora
│   │   ├── chat-widget.tsx             # Chat AI widget
│   │   ├── hero-section.tsx            # Hero landing
│   │   ├── brand-showcase.tsx          # Showcase de marcas
│   │   ├── test-drive-form.tsx         # Form test drive
│   │   └── whatsapp-button.tsx         # Botón WA flotante
│   ├── lib/
│   │   ├── supabase.ts                 # Supabase client
│   │   ├── vehicles.ts                 # Data de vehículos
│   │   ├── ai.ts                       # AI chat logic
│   │   └── utils.ts                    # Utilities
│   └── data/
│       └── vehicles.json               # Catálogo completo (specs + precios)
├── supabase/
│   └── schema.sql                      # DB schema
├── public/
│   └── vehicles/                       # Imágenes de vehículos
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

## Schema de Base de Datos (Supabase)

```sql
-- Vehículos
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,          -- 'haval', 'gwm', 'mitsubishi', 'changan', 'jmev'
  model TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  category TEXT NOT NULL,       -- 'suv', 'pickup', 'commercial', 'electric'
  year INTEGER NOT NULL,
  price_usd DECIMAL,
  price_ars DECIMAL,
  currency TEXT DEFAULT 'USD',
  specs JSONB NOT NULL,         -- All technical specs
  features JSONB,               -- Feature list
  images TEXT[],                -- Image URLs
  highlight_features TEXT[],    -- Top 3-5 selling points
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  phone TEXT,
  email TEXT,
  source TEXT NOT NULL,         -- 'web', 'whatsapp', 'chat', 'test-drive', 'mercadolibre'
  vehicle_interest UUID REFERENCES vehicles(id),
  vehicle_slug TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',    -- 'new', 'contacted', 'test-drive', 'quoted', 'sold', 'lost'
  ai_score INTEGER,             -- 0-100 probability
  assigned_to TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat conversations
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,            -- 'user', 'assistant'
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Test drive appointments
CREATE TABLE test_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  vehicle_id UUID REFERENCES vehicles(id),
  preferred_date DATE,
  preferred_time TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,     -- 'page_view', 'vehicle_view', 'compare', 'chat_start', 'lead_created'
  vehicle_slug TEXT,
  metadata JSONB,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Módulos MVP

### 1. Catálogo Digital (público)
- Grid de vehículos filtrable por marca/categoría/precio
- Ficha detallada por vehículo con specs, gallery, features
- Mobile-first responsive design
- SEO optimizado

### 2. Comparador Multi-Marca (público)
- Seleccionar 2-3 vehículos de cualquier marca
- Tabla comparativa lado a lado
- Highlights automáticos (mejor en X, mejor en Y)
- CTA contextual al final

### 3. Chat AI (público, widget)
- Widget flotante en toda la web
- Conoce todos los modelos, specs, precios
- Recomienda según necesidades del usuario
- Captura datos de contacto naturalmente
- Agenda test drives desde el chat

### 4. Calculadora de Financiación (público)
- Input: precio del vehículo, anticipo, plazo
- Output: cuota estimada
- Tasas configurables desde admin
- CTA: "Quiero esta financiación" → lead

### 5. Dashboard Admin (privado)
- Login con Supabase Auth
- Lista de leads con filtros y búsqueda
- Pipeline visual (kanban o tabla)
- Analytics básicos: leads/día, por fuente, por modelo
- Gestión de test drives

## AI System Prompt (para el chatbot)
El chatbot debe:
- Hablar en español argentino casual pero profesional
- Conocer TODOS los modelos, specs y precios
- Hacer preguntas para entender la necesidad (familia, trabajo, ciudad, aventura)
- Recomendar modelos comparando entre marcas
- Capturar nombre + teléfono de forma natural
- Nunca inventar datos — si no sabe, derivar a un asesor humano
- Mencionar beneficios de comprar en Valparaíso Motors (garantía oficial, financiación, postventa)
