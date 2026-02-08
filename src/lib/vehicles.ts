import vehiclesData from "@/data/vehicles.json";

export interface VehicleSpecs {
  engine?: string;
  power?: string;
  torque?: string;
  transmission?: string;
  traction?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  wheelbase?: number;
  groundClearance?: number;
  fuelTank?: number;
  weight?: number;
  weightGross?: number;
  payload?: number;
  consumption?: string;
  fuelConsumption?: string;
  autonomy?: string;
  battery?: string;
  chargingPort?: string;
  fastCharging?: string;
  topSpeed?: number | string;
  acceleration?: string;
  tires?: string;
  attackAngle?: number;
  departureAngle?: number;
  cargo?: string;
  trunk?: number;
  seats?: number;
  drivingModes?: string;
  suspension?: string;
  differentials?: string;
}

// Type definitions
export type Brand = "haval" | "gwm" | "mitsubishi" | "changan" | "jmev";
export type Category = "suv" | "pickup" | "hatchback" | "commercial";
export type VehicleType = "combustion" | "hybrid" | "hybrid-plugin" | "electric" | "diesel";
export type SortOption = "name" | "price" | "brand";

export interface VehicleFeatures {
  safety: string[];
  comfort: string[];
  technology: string[];
  driving: string[];
}

export interface Vehicle {
  brand: Brand;
  brandDisplay: string;
  model: string;
  slug: string;
  tagline: string;
  category: Category;
  type: VehicleType;
  year: number;
  priceUsd: number | null;
  specs: VehicleSpecs;
  highlightFeatures: string[];
  features: VehicleFeatures;
  images: string[];
  isAvailable: boolean;
}

// Display labels
export const brandLabels: Record<Brand, string> = {
  haval: "Haval",
  gwm: "GWM",
  mitsubishi: "Mitsubishi",
  changan: "Changan",
  jmev: "JMEV",
};

export const categoryLabels: Record<Category, string> = {
  suv: "SUV",
  pickup: "Pickup",
  hatchback: "Hatchback",
  commercial: "Comercial",
};

export const typeLabels: Record<VehicleType, string> = {
  combustion: "Combustión",
  hybrid: "Híbrido",
  "hybrid-plugin": "Híbrido Enchufable",
  electric: "Eléctrico",
  diesel: "Diesel",
};

export const vehicles: Vehicle[] = vehiclesData as Vehicle[];

// Get all vehicles
export function getAllVehicles(): Vehicle[] {
  return vehicles.filter((v) => v.isAvailable);
}

// Get vehicle by slug
export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}

// Get vehicles by brand
export function getVehiclesByBrand(brand: string): Vehicle[] {
  return vehicles.filter((v) => v.brand === brand && v.isAvailable);
}

// Get all brands
export function getAllBrands(): string[] {
  const brands = [...new Set(vehicles.map((v) => v.brand))];
  return brands;
}

// Get brands with type safety
export function getBrands(): Brand[] {
  return Array.from(new Set(vehicles.map((v) => v.brand))) as Brand[];
}

// Get categories
export function getCategories(): Category[] {
  return Array.from(new Set(vehicles.map((v) => v.category))) as Category[];
}

// Get vehicle types
export function getTypes(): VehicleType[] {
  return Array.from(new Set(vehicles.map((v) => v.type))) as VehicleType[];
}

// Filter vehicles
export interface VehicleFilters {
  brand?: Brand;
  category?: Category;
  type?: VehicleType;
}

export function filterVehicles(vehicleList: Vehicle[], filters: VehicleFilters): Vehicle[] {
  let filtered = [...vehicleList];

  if (filters.brand) {
    filtered = filtered.filter((v) => v.brand === filters.brand);
  }

  if (filters.category) {
    filtered = filtered.filter((v) => v.category === filters.category);
  }

  if (filters.type) {
    filtered = filtered.filter((v) => v.type === filters.type);
  }

  return filtered;
}

// Sort vehicles
export function sortVehicles(vehicleList: Vehicle[], sortBy: SortOption): Vehicle[] {
  const sorted = [...vehicleList];
  
  switch (sortBy) {
    case "name":
      return sorted.sort((a, b) => a.model.localeCompare(b.model));
    case "price":
      return sorted.sort((a, b) => {
        // Vehicles without price go last
        if (a.priceUsd === null) return 1;
        if (b.priceUsd === null) return -1;
        return a.priceUsd - b.priceUsd;
      });
    case "brand":
      return sorted.sort((a, b) => a.brand.localeCompare(b.brand));
    default:
      return sorted;
  }
}

// Get related vehicles (same brand or category, exclude current)
export function getRelatedVehicles(vehicle: Vehicle, limit: number = 3): Vehicle[] {
  const all = getAllVehicles();
  
  // First, try same brand
  let related = all.filter(
    (v) => v.slug !== vehicle.slug && v.brand === vehicle.brand
  );
  
  // If not enough, add from same category
  if (related.length < limit) {
    const fromCategory = all.filter(
      (v) =>
        v.slug !== vehicle.slug &&
        v.brand !== vehicle.brand &&
        v.category === vehicle.category
    );
    related = [...related, ...fromCategory];
  }
  
  // If still not enough, add any others
  if (related.length < limit) {
    const others = all.filter(
      (v) =>
        v.slug !== vehicle.slug &&
        !related.some((r) => r.slug === v.slug)
    );
    related = [...related, ...others];
  }
  
  return related.slice(0, limit);
}

// Get all brand display names
export function getAllBrandDisplayNames(): { brand: string; display: string }[] {
  const brandMap = new Map<string, string>();
  vehicles.forEach((v) => {
    if (!brandMap.has(v.brand)) {
      brandMap.set(v.brand, v.brandDisplay);
    }
  });
  return Array.from(brandMap.entries()).map(([brand, display]) => ({
    brand,
    display,
  }));
}

// Group vehicles by brand
export function getVehiclesGroupedByBrand(): Record<string, Vehicle[]> {
  const grouped: Record<string, Vehicle[]> = {};
  vehicles.forEach((v) => {
    if (!v.isAvailable) return;
    if (!grouped[v.brand]) {
      grouped[v.brand] = [];
    }
    grouped[v.brand].push(v);
  });
  return grouped;
}

// Format price in Argentine style
export function formatPrice(price: number | null | undefined, currency: string = "USD"): string {
  if (!price) return "Consultar";
  
  // Argentine formatting: . for thousands, , for decimals
  const formatted = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  
  return formatted;
}

// Format numbers in Argentine style (. for thousands)
export function formatNumber(num: number | string | undefined | null): string {
  if (!num) return "N/A";
  const numValue = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(numValue)) return "N/A";
  
  return new Intl.NumberFormat("es-AR").format(numValue);
}

// Get vehicle display name
export function getVehicleDisplayName(vehicle: Vehicle): string {
  return `${vehicle.brandDisplay} ${vehicle.model}`;
}

// Compare vehicles - returns "winner" for each spec
export function compareVehicleSpecs(vehicles: Vehicle[]): Record<string, number | null> {
  if (vehicles.length < 2) return {};
  
  const winners: Record<string, number | null> = {};
  
  // Helper to extract numeric value
  const extractNumber = (value: string | number | undefined | null): number | null => {
    if (!value) return null;
    if (typeof value === "number") return value;
    const match = value.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
  };
  
  // Power (more is better)
  const powers = vehicles.map((v) => extractNumber(v.specs.power));
  if (powers.some((p) => p !== null)) {
    const maxPower = Math.max(...powers.filter((p) => p !== null) as number[]);
    winners.power = powers.findIndex((p) => p === maxPower);
  }
  
  // Torque (more is better)
  const torques = vehicles.map((v) => extractNumber(v.specs.torque));
  if (torques.some((t) => t !== null)) {
    const maxTorque = Math.max(...torques.filter((t) => t !== null) as number[]);
    winners.torque = torques.findIndex((t) => t === maxTorque);
  }
  
  // Weight (less is better)
  const weights = vehicles.map((v) => v.specs.weight);
  if (weights.some((w) => w !== null && w !== undefined)) {
    const minWeight = Math.min(...weights.filter((w) => w !== null && w !== undefined) as number[]);
    winners.weight = weights.findIndex((w) => w === minWeight);
  }
  
  // Fuel tank (more is better)
  const tanks = vehicles.map((v) => v.specs.fuelTank);
  if (tanks.some((t) => t !== null && t !== undefined)) {
    const maxTank = Math.max(...tanks.filter((t) => t !== null && t !== undefined) as number[]);
    winners.fuelTank = tanks.findIndex((t) => t === maxTank);
  }
  
  // Price (less is better, but only if available)
  const prices = vehicles.map((v) => v.priceUsd);
  if (prices.some((p) => p !== null && p !== undefined)) {
    const minPrice = Math.min(...prices.filter((p) => p !== null && p !== undefined) as number[]);
    winners.price = prices.findIndex((p) => p === minPrice);
  }
  
  return winners;
}

// Get WhatsApp link
export function getWhatsAppLink(message: string): string {
  const phone = "5493513092154";
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

// Vehicle suggestions by category
export const vehicleSuggestions = {
  familia: ["mitsubishi-outlander", "haval-h6-gt"],
  aventura: ["gwm-tank-300", "mitsubishi-l200"],
  ciudad: ["haval-jolion", "ora-03"],
  trabajo: ["gwm-poer", "mitsubishi-l200"],
};

export function getVehicleSuggestionsByCategory(category: keyof typeof vehicleSuggestions): Vehicle[] {
  const slugs = vehicleSuggestions[category];
  return slugs.map(slug => getVehicleBySlug(slug)).filter(Boolean) as Vehicle[];
}
