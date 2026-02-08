"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/section-header";
import { CTABanner } from "@/components/cta-banner";
import { VehicleCard } from "@/components/vehicle-card";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { BrandBadge } from "@/components/brand-badge";
import {
  ArrowRight,
  Shield,
  CreditCard,
  Wrench,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
} from "lucide-react";

const brands = [
  {
    name: "haval" as const,
    description: "SUVs premium con tecnología híbrida y diseño sofisticado",
    models: "Jolion, H6, H6 GT",
  },
  {
    name: "gwm" as const,
    description: "Pickups robustas y SUVs de alto rendimiento para aventureros",
    models: "Poer, Poer Elite, Tank",
  },
  {
    name: "mitsubishi" as const,
    description: "Legendaria confiabilidad japonesa para trabajo y familia",
    models: "L200, Outlander",
  },
  {
    name: "changan" as const,
    description: "Comerciales versátiles para tu negocio",
    models: "MD201, Cargo Van",
  },
  {
    name: "jmev" as const,
    description: "Eléctricos urbanos, el futuro de la movilidad sostenible",
    models: "Easy 3",
  },
];

// Import real vehicle data
import { getAllVehicles, typeLabels } from "@/lib/vehicles";

// Get featured vehicles from real data
const allVehicles = getAllVehicles();
const featuredVehicles = [
  // ORA 03 - Electric hatchback
  allVehicles.find((v) => v.slug === "ora-03"),
  // GWM Poer - Pickup
  allVehicles.find((v) => v.slug === "gwm-poer"),
  // Haval Jolion PRO HEV - Hybrid SUV
  allVehicles.find((v) => v.slug === "haval-jolion-pro-hev"),
]
  .filter(Boolean)
  .map((vehicle) => ({
    slug: vehicle!.slug,
    brand: vehicle!.brand,
    model: vehicle!.model,
    tagline: vehicle!.tagline,
    price: vehicle!.priceUsd || undefined,
    specs: {
      fuel: typeLabels[vehicle!.type],
      transmission: vehicle!.specs.transmission,
    },
    features: vehicle!.highlightFeatures.slice(0, 3),
    isNew: vehicle!.type === "electric" || vehicle!.type === "hybrid",
  }));

const benefits = [
  {
    icon: Shield,
    title: "Concesionario Oficial",
    description:
      "Representantes autorizados con garantía de fábrica y repuestos originales.",
  },
  {
    icon: CreditCard,
    title: "Financiación Flexible",
    description:
      "Planes a medida con tasas competitivas. Hasta 60 cuotas para tu 0km.",
  },
  {
    icon: Wrench,
    title: "Postventa Integral",
    description:
      "Service oficial, repuestos originales y garantía extendida. Siempre a tu lado.",
  },
  {
    icon: Star,
    title: "5 Marcas en 1",
    description:
      "Comparás, elegís y llevás tu vehículo en un solo lugar. Fácil y rápido.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 font-[family-name:var(--font-montserrat)]">
              Tu próximo vehículo
              <br />
              te espera
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              5 marcas oficiales. Un solo lugar.
              <br />
              Haval, GWM, Mitsubishi, Changan, JMEV en Córdoba
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
            >
              <Link href="/vehiculos" className="flex items-center gap-2">
                Ver Vehículos
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              <Link href="/test-drive">Agendar Test Drive</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 space-y-12">
          <SectionHeader
            title="Nuestras Marcas"
            subtitle="5 fabricantes oficiales unidos para ofrecerte la mejor experiencia"
            centered
            className="mx-auto"
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand, idx) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <BrandBadge brand={brand.name} />
                    </div>
                    <CardTitle className="font-[family-name:var(--font-montserrat)]">
                      {brand.models}
                    </CardTitle>
                    <CardDescription>{brand.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/vehiculos?marca=${brand.name}`}>
                        Ver modelos
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 space-y-12">
          <SectionHeader
            title="Destacados"
            subtitle="Los modelos más buscados de nuestro catálogo"
            centered
            className="mx-auto"
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredVehicles.map((vehicle) => (
              <motion.div
                key={vehicle.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <VehicleCard {...vehicle} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/vehiculos">Ver catálogo completo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 space-y-12">
          <SectionHeader
            title="¿Por qué elegirnos?"
            subtitle="Más que un concesionario, tu partner en movilidad"
            centered
            className="mx-auto"
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <benefit.icon className="h-7 w-7 text-accent" />
                    </div>
                    <CardTitle className="font-[family-name:var(--font-montserrat)]">
                      {benefit.title}
                    </CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <CTABanner
            variant="gradient"
            title="Financiación a tu medida"
            description="Calculá tu cuota online y llevate tu 0km hoy. Planes hasta 60 cuotas con tasas competitivas."
            primaryLabel="Calcular cuota"
            primaryHref="/financiacion"
            secondaryLabel="Más info"
            secondaryHref="/contacto"
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 space-y-12">
          <SectionHeader
            title="Visitanos"
            subtitle="Estamos en Córdoba para ayudarte a elegir tu próximo vehículo"
            centered
            className="mx-auto"
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="text-lg">Ubicación</CardTitle>
                <CardDescription>
                  Av. Ciudad de Valparaíso 4380
                  <br />
                  Córdoba Capital, X5016
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Phone className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="text-lg">Teléfono</CardTitle>
                <CardDescription>
                  <a
                    href="tel:+5493513092154"
                    className="hover:text-primary transition-colors"
                  >
                    (0351) 3092154
                  </a>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Mail className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="text-lg">Email</CardTitle>
                <CardDescription>
                  <a
                    href="mailto:Info@valparaisomotors.com.ar"
                    className="hover:text-primary transition-colors"
                  >
                    Info@valparaisomotors.com.ar
                  </a>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="text-lg">Horarios</CardTitle>
                <CardDescription>
                  Lun-Vie: 9:00-19:30
                  <br />
                  Sáb: 9:00-14:00
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="bg-muted rounded-lg p-8 flex items-center justify-center h-64">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-3" />
              <p>Mapa interactivo aquí</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Teaser */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-accent/10 via-accent/5 to-background border-accent/20">
            <CardHeader className="text-center space-y-4 p-8 md:p-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-3xl font-[family-name:var(--font-montserrat)]">
                ¿No sabés qué vehículo elegir?
              </CardTitle>
              <CardDescription className="text-lg">
                Nuestro asistente con inteligencia artificial te ayuda a
                encontrar el auto perfecto según tu estilo de vida, presupuesto
                y necesidades.
              </CardDescription>
              <div className="pt-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90">
                  Hablar con el asistente
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </>
  );
}
