-- Valparaíso Motors Database Schema
-- PostgreSQL / Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vehículos
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,          -- 'haval', 'gwm', 'mitsubishi', 'changan', 'ora'
  model TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  category TEXT NOT NULL,       -- 'suv', 'pickup', 'hatchback', 'commercial'
  type TEXT NOT NULL,            -- 'combustion', 'diesel', 'electric', 'hybrid', 'hybrid-plugin'
  year INTEGER NOT NULL,
  price_usd DECIMAL,
  price_ars DECIMAL,
  currency TEXT DEFAULT 'USD',
  specs JSONB NOT NULL,         -- All technical specs
  features JSONB,               -- Feature list
  highlight_features TEXT[],    -- Top 3-5 selling points
  images TEXT[],                -- Image URLs
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para búsqueda
CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_vehicles_category ON vehicles(category);
CREATE INDEX idx_vehicles_slug ON vehicles(slug);
CREATE INDEX idx_vehicles_available ON vehicles(is_available);

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
  metadata JSONB,               -- Additional data
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para leads
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_phone ON leads(phone);

-- Chat conversations
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL,            -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para chat
CREATE INDEX idx_chat_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_lead_id ON chat_messages(lead_id);
CREATE INDEX idx_chat_created_at ON chat_messages(created_at DESC);

-- Test drive appointments
CREATE TABLE test_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id),
  vehicle_slug TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'
  notes TEXT,
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para test drives
CREATE INDEX idx_test_drives_status ON test_drives(status);
CREATE INDEX idx_test_drives_date ON test_drives(preferred_date);
CREATE INDEX idx_test_drives_lead_id ON test_drives(lead_id);

-- Analytics events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,     -- 'page_view', 'vehicle_view', 'compare', 'chat_start', 'lead_created', etc.
  vehicle_slug TEXT,
  session_id TEXT,
  user_agent TEXT,
  ip_address TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para analytics
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_vehicle_slug ON analytics_events(vehicle_slug);
CREATE INDEX idx_analytics_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at DESC);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_drives_updated_at BEFORE UPDATE ON test_drives
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - opcional para MVP, habilitar después
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE test_drives ENABLE ROW LEVEL SECURITY;

-- Comentarios para documentación
COMMENT ON TABLE vehicles IS 'Catálogo de vehículos disponibles';
COMMENT ON TABLE leads IS 'Leads capturados desde web, chat, WhatsApp, etc.';
COMMENT ON TABLE chat_messages IS 'Conversaciones del chatbot AI con visitantes';
COMMENT ON TABLE test_drives IS 'Agendamiento de test drives';
COMMENT ON TABLE analytics_events IS 'Eventos de analytics para tracking de comportamiento';
