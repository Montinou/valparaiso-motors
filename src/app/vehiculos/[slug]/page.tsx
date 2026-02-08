import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrandBadge } from "@/components/brand-badge";
import { VehicleCard } from "@/components/vehicle-card";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/section-header";
import {
  getAllVehicles,
  getVehicleBySlug,
  getRelatedVehicles,
  typeLabels,
} from "@/lib/vehicles";
import {
  Check,
  MessageCircle,
  Calendar,
  ArrowLeft,
  DollarSign,
  Zap,
  Shield,
  Settings,
  Gauge,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate static params for all vehicles
export async function generateStaticParams() {
  const vehicles = getAllVehicles();
  return vehicles.map((vehicle) => ({
    slug: vehicle.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);

  if (!vehicle) {
    return {
      title: "Vehículo no encontrado | Valparaíso Motors",
    };
  }

  const title = `${vehicle.brandDisplay} ${vehicle.model} ${vehicle.year} | Valparaíso Motors`;
  const description =
    vehicle.tagline ||
    `${vehicle.brandDisplay} ${vehicle.model} - ${vehicle.specs.power}, ${vehicle.specs.transmission}. Concesionario oficial en Córdoba.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function VehiculoDetailPage({ params }: Props) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const relatedVehicles = getRelatedVehicles(vehicle, 3);

  // WhatsApp message
  const whatsappMessage = `Hola! Me interesa el ${vehicle.brandDisplay} ${vehicle.model} y me gustaría recibir más información.`;
  const whatsappLink = `https://wa.me/5493513092154?text=${encodeURIComponent(whatsappMessage)}`;

  // Group specs by category
  const specsCategories = {
    Motor: [
      { label: "Motor", value: vehicle.specs.engine },
      { label: "Potencia", value: vehicle.specs.power },
      { label: "Torque", value: vehicle.specs.torque },
      { label: "Transmisión", value: vehicle.specs.transmission },
      { label: "Tracción", value: vehicle.specs.traction },
    ],
    Dimensiones: [
      vehicle.specs.dimensions && {
        label: "Largo x Ancho x Alto",
        value: `${vehicle.specs.dimensions.length} x ${vehicle.specs.dimensions.width} x ${vehicle.specs.dimensions.height} mm`,
      },
      vehicle.specs.wheelbase && {
        label: "Distancia entre ejes",
        value: `${vehicle.specs.wheelbase} mm`,
      },
      vehicle.specs.groundClearance && {
        label: "Despeje al piso",
        value: `${vehicle.specs.groundClearance} mm`,
      },
      vehicle.specs.weight && {
        label: "Peso",
        value: `${vehicle.specs.weight} kg`,
      },
    ].filter(Boolean),
    Rendimiento: [
      vehicle.specs.topSpeed && {
        label: "Velocidad máxima",
        value: `${vehicle.specs.topSpeed} km/h`,
      },
      vehicle.specs.acceleration && {
        label: "Aceleración",
        value: vehicle.specs.acceleration,
      },
      vehicle.specs.fuelConsumption && {
        label: "Consumo",
        value: vehicle.specs.fuelConsumption,
      },
      vehicle.specs.autonomy && {
        label: "Autonomía",
        value: vehicle.specs.autonomy,
      },
    ].filter(Boolean),
    Capacidades: [
      vehicle.specs.fuelTank && {
        label: "Tanque de combustible",
        value: `${vehicle.specs.fuelTank} litros`,
      },
      vehicle.specs.payload && {
        label: "Carga útil",
        value: `${vehicle.specs.payload} kg`,
      },
      vehicle.specs.trunk && {
        label: "Maletero",
        value: `${vehicle.specs.trunk} litros`,
      },
      vehicle.specs.seats && {
        label: "Asientos",
        value: vehicle.specs.seats,
      },
    ].filter(Boolean),
  };

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/vehiculos" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al catálogo
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-muted/50 to-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Brand & Type Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <BrandBadge brand={vehicle.brand} />
              <Badge variant="outline">{typeLabels[vehicle.type]}</Badge>
              <Badge variant="outline">{vehicle.category.toUpperCase()}</Badge>
              {vehicle.year && (
                <Badge variant="secondary">{vehicle.year}</Badge>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 font-[family-name:var(--font-montserrat)]">
                {vehicle.brandDisplay} {vehicle.model}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                {vehicle.tagline}
              </p>
            </div>

            {/* Price */}
            {vehicle.priceUsd && (
              <div className="flex items-baseline gap-3 pt-4">
                <span className="text-lg text-muted-foreground">Desde</span>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-secondary" />
                  <span className="text-5xl font-bold text-primary">
                    {vehicle.priceUsd.toLocaleString("es-AR")}
                  </span>
                </div>
                <span className="text-lg text-muted-foreground">USD</span>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90"
                asChild
              >
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Consultar por este modelo
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/test-drive" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Agendar Test Drive
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/comparar">Comparar con otro</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Placeholder */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="h-16 w-16 mb-4" />
                <p className="text-lg font-medium">Imágenes próximamente</p>
                <p className="text-sm">
                  Galería de fotos en alta resolución del {vehicle.model}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Highlight Features */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <SectionHeader
              title="Características Destacadas"
              subtitle="Los puntos fuertes que hacen único a este modelo"
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vehicle.highlightFeatures.map((feature, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-5 w-5 text-accent" />
                      </div>
                      <p className="text-sm leading-relaxed">{feature}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full Specs */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <SectionHeader
              title="Especificaciones Técnicas"
              subtitle="Todos los detalles técnicos del vehículo"
            />

            <div className="space-y-6">
              {Object.entries(specsCategories).map(([category, specs]) => {
                if (specs.length === 0) return null;
                return (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-accent" />
                        {category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {specs.map((spec, idx) => {
                          if (typeof spec !== "object") return null;
                          return (
                            <div
                              key={idx}
                              className="flex justify-between py-2 border-b last:border-0"
                            >
                              <span className="text-muted-foreground">
                                {spec.label}
                              </span>
                              <span className="font-medium text-right">
                                {spec.value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Lists */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <SectionHeader
              title="Equipamiento Completo"
              subtitle="Todo lo que incluye este vehículo organizado por categoría"
            />

            <div className="grid gap-6 md:grid-cols-2">
              {/* Safety */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-accent" />
                    Seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {vehicle.features.safety.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Comfort */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-accent" />
                    Confort
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {vehicle.features.comfort.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Technology */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    Tecnología
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {vehicle.features.technology.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Driving */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-accent" />
                    Conducción
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {vehicle.features.driving.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-accent/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)]">
              ¿Te interesa este modelo?
            </h2>
            <p className="text-lg text-muted-foreground">
              Contactanos para recibir más información, cotización personalizada
              o agendar un test drive.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90"
                asChild
              >
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Consultar por WhatsApp
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/test-drive" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Agendar Test Drive
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/financiacion" className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Ver Financiación
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Vehicles */}
      {relatedVehicles.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="space-y-8">
              <SectionHeader
                title="También te puede interesar"
                subtitle="Modelos relacionados de nuestra selección"
                centered
                className="mx-auto"
              />

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {relatedVehicles.map((related) => (
                  <VehicleCard
                    key={related.slug}
                    slug={related.slug}
                    brand={related.brand}
                    model={related.model}
                    tagline={related.tagline}
                    price={related.priceUsd || undefined}
                    currency="USD"
                    specs={{
                      fuel: typeLabels[related.type],
                      transmission: related.specs.transmission,
                    }}
                    features={related.highlightFeatures.slice(0, 3)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
