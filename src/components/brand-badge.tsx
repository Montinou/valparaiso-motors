import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Brand = "haval" | "gwm" | "mitsubishi" | "changan" | "jmev";

interface BrandBadgeProps {
  brand: Brand;
  className?: string;
}

const brandColors: Record<Brand, string> = {
  haval: "bg-red-600 hover:bg-red-700 text-white",
  gwm: "bg-blue-600 hover:bg-blue-700 text-white",
  mitsubishi: "bg-red-700 hover:bg-red-800 text-white",
  changan: "bg-blue-700 hover:bg-blue-800 text-white",
  jmev: "bg-emerald-600 hover:bg-emerald-700 text-white",
};

const brandNames: Record<Brand, string> = {
  haval: "Haval",
  gwm: "GWM",
  mitsubishi: "Mitsubishi",
  changan: "Changan",
  jmev: "JMEV",
};

export function BrandBadge({ brand, className }: BrandBadgeProps) {
  return (
    <Badge
      className={cn(
        "uppercase font-semibold tracking-wide",
        brandColors[brand],
        className
      )}
    >
      {brandNames[brand]}
    </Badge>
  );
}
