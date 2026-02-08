# Valparaíso Motors — Plataforma Digital

**Next.js 16+ dealership platform** para Valparaíso Motors, concesionario oficial de Haval, GWM, Mitsubishi, Changan y JMEV en Córdoba, Argentina.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🏗️ Tech Stack

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 16.1.6 | Framework React con SSR/SSG |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type-safe development |
| **Tailwind CSS** | 4.x | Utility-first CSS |
| **shadcn/ui** | Latest | Component system |
| **framer-motion** | 12.x | Animations |
| **lucide-react** | Latest | Icon library |
| **Supabase** | 2.95.3 | Backend (DB + Auth) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout con SEO
│   ├── page.tsx                # Landing page
│   ├── vehiculos/              # Vehicle catalog
│   ├── comparar/               # Comparator
│   ├── financiacion/           # Financing calculator
│   ├── test-drive/             # Test drive booking
│   ├── contacto/               # Contact page
│   └── admin/                  # Admin dashboard (protected)
├── components/
│   ├── navbar.tsx              # Main navigation
│   ├── footer.tsx              # Footer with contact info
│   ├── vehicle-card.tsx        # Vehicle display card
│   ├── brand-badge.tsx         # Brand badges (5 colors)
│   ├── whatsapp-button.tsx     # Floating WhatsApp CTA
│   ├── section-header.tsx      # Reusable section title
│   ├── cta-banner.tsx          # Call-to-action banner
│   └── ui/                     # shadcn/ui components
└── lib/
    └── utils.ts                # Utility functions
```

---

## 🎨 Brand Colors

```css
/* Valparaíso Motors Identity */
Primary:   #1a365d  /* Deep Blue - trust, automotive */
Secondary: #d69e2e  /* Gold/Amber - premium, warmth */
Accent:    #059669  /* Emerald - CTAs, positive actions */

/* Brand Badges */
Haval:      Red (#dc2626)
GWM:        Blue (#2563eb)
Mitsubishi: Red/Black (#991b1b)
Changan:    Blue (#1d4ed8)
JMEV:       Green (#059669)
```

---

## 🛠️ Features Implemented

### ✅ MVP Scaffold (Current)

- [x] Next.js 16+ with App Router
- [x] Responsive landing page (7 sections)
- [x] Navigation with mobile menu
- [x] Footer with contact info
- [x] 5 brand showcase cards
- [x] Featured vehicles grid
- [x] WhatsApp integration (navbar + floating button)
- [x] SEO optimized (meta tags, Open Graph, JSON-LD)
- [x] Placeholder pages for all routes
- [x] Brand identity (colors, fonts, components)
- [x] Framer Motion animations

### 🚧 In Development (Next Phase)

- [ ] Vehicle catalog with filters (marca, categoría, precio)
- [ ] Vehicle detail pages with real data
- [ ] Multi-brand comparator (2-3 vehicles)
- [ ] Financing calculator (cuota estimator)
- [ ] Test drive booking form
- [ ] Contact form with lead capture
- [ ] AI chatbot widget (Gemini)
- [ ] Admin dashboard (Supabase Auth)
- [ ] Real vehicle data from Supabase

---

## 📱 Routes

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Landing page | ✅ Complete |
| `/vehiculos` | Vehicle catalog | 🚧 Placeholder |
| `/vehiculos/[slug]` | Vehicle detail | 🚧 Placeholder |
| `/comparar` | Multi-brand comparator | 🚧 Placeholder |
| `/financiacion` | Financing calculator | 🚧 Placeholder |
| `/test-drive` | Test drive booking | 🚧 Placeholder |
| `/contacto` | Contact page | 🚧 Placeholder |
| `/admin` | Admin dashboard | 🔒 Protected |

---

## 🧩 Components

### Core Components

- **Navbar** — Sticky navigation with mobile menu (Sheet)
- **Footer** — Contact info, brand links, social media
- **VehicleCard** — Reusable vehicle display with image, specs, price, CTAs
- **BrandBadge** — 5 color variants for vehicle brands
- **WhatsAppButton** — Floating button (bottom-right) with tooltip
- **SectionHeader** — Title + subtitle for page sections
- **CTABanner** — Call-to-action with gradient variant

### shadcn/ui Components (13)

button, card, badge, input, select, dialog, sheet, tabs, separator, scroll-area, dropdown-menu, avatar, tooltip

---

## 🔗 Contact Info

**Valparaíso Motors**
- **Dirección:** Av. Ciudad de Valparaíso 4380, Córdoba Capital, X5016
- **Teléfono:** (0351) 3092154
- **WhatsApp:** +54 9 351 309-2154
- **Email:** Info@valparaisomotors.com.ar
- **Horarios:** Lun-Vie 9:00-19:30, Sáb 9:00-14:00
- **Instagram:** [@valparaiso.motors](https://instagram.com/valparaiso.motors)
- **Facebook:** [/valparaisomotorsarg](https://facebook.com/valparaisomotorsarg)

---

## 🛠️ Development

### Adding a New Page

```tsx
// src/app/nueva-pagina/page.tsx
import { SectionHeader } from "@/components/section-header";

export default function NuevaPaginaPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <SectionHeader
        title="Tu Título"
        subtitle="Tu subtítulo"
        centered
      />
      {/* Tu contenido aquí */}
    </div>
  );
}
```

### Adding a New Component

```tsx
// src/components/mi-componente.tsx
import { cn } from "@/lib/utils";

interface MiComponenteProps {
  className?: string;
}

export function MiComponente({ className }: MiComponenteProps) {
  return (
    <div className={cn("tu-clase-base", className)}>
      {/* Tu JSX aquí */}
    </div>
  );
}
```

### Using Brand Colors

```tsx
<div className="bg-primary text-primary-foreground">
  Deep Blue background
</div>

<div className="bg-secondary text-secondary-foreground">
  Gold/Amber background
</div>

<Button className="bg-accent hover:bg-accent/90">
  Emerald CTA
</Button>
```

---

## 📚 Architecture

Ver **[ARCHITECTURE.md](../ARCHITECTURE.md)** para la arquitectura completa del MVP, incluyendo:
- Stack tecnológico completo
- Schema de base de datos (Supabase)
- Módulos y funcionalidades
- AI System Prompt para chatbot

Ver **[PROJECT.md](../PROJECT.md)** para información del cliente:
- Marcas representadas
- Contexto de mercado
- Diagnóstico digital
- URLs de specs

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Build Locally

```bash
npm run build
npm start
```

El sitio estará disponible en `http://localhost:3000`.

---

## 📝 License

Propiedad de **Valparaíso Motors**. Todos los derechos reservados.

---

## 👨‍💻 Development Log

Ver **[SESSION-LOG.md](./SESSION-LOG.md)** para el historial detallado de desarrollo.

---

**Built with ❤️ by OpenClaw AI Agent**
