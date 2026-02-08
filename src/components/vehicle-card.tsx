import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrandBadge } from "@/components/brand-badge";
import { Badge } from "@/components/ui/badge";
import { Fuel, Users, Gauge, DollarSign } from "lucide-react";

type Brand = "haval" | "gwm" | "mitsubishi" | "changan" | "jmev";

interface VehicleCardProps {
  slug: string;
  brand: Brand;
  model: string;
  tagline?: string;
  price?: number;
  currency?: string;
  image?: string;
  specs?: {
    fuel?: string;
    passengers?: number;
    transmission?: string;
  };
  features?: string[];
  isNew?: boolean;
}

export function VehicleCard({
  slug,
  brand,
  model,
  tagline,
  price,
  currency = "USD",
  image,
  specs = {},
  features = [],
  isNew = false,
}: VehicleCardProps) {
  const defaultImage = "/vehicles/placeholder.jpg";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      <Link href={`/vehiculos/${slug}`}>
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={image || defaultImage}
            alt={`${brand} ${model}`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <BrandBadge brand={brand} />
            {isNew && (
              <Badge className="bg-accent text-white">Nuevo</Badge>
            )}
          </div>
        </div>
      </Link>

      <CardContent className="p-4 space-y-3">
        <Link href={`/vehiculos/${slug}`} className="block">
          <h3 className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors font-[family-name:var(--font-montserrat)]">
            {model}
          </h3>
          {tagline && (
            <p className="text-sm text-muted-foreground mt-1">{tagline}</p>
          )}
        </Link>

        {/* Key Specs */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {specs.fuel && (
            <div className="flex items-center gap-1">
              <Fuel className="h-4 w-4" />
              <span>{specs.fuel}</span>
            </div>
          )}
          {specs.passengers && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{specs.passengers}</span>
            </div>
          )}
          {specs.transmission && (
            <div className="flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              <span>{specs.transmission}</span>
            </div>
          )}
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {features.slice(0, 3).map((feature, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        )}

        {/* Price */}
        {price && (
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-sm text-muted-foreground">Desde</span>
            <div className="flex items-center gap-1">
              <DollarSign className="h-5 w-5 text-secondary" />
              <span className="text-2xl font-bold text-primary">
                {price.toLocaleString("es-AR")}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{currency}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button asChild className="flex-1" variant="outline">
          <Link href={`/vehiculos/${slug}`}>Ver más</Link>
        </Button>
        <Button asChild className="flex-1 bg-accent hover:bg-accent/90">
          <a
            href={`https://wa.me/5493513092154?text=Hola! Me interesa el ${brand.toUpperCase()} ${model}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
