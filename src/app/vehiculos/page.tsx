"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { VehicleCard } from "@/components/vehicle-card";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  getAllVehicles,
  filterVehicles,
  sortVehicles,
  getBrands,
  getCategories,
  getTypes,
  brandLabels,
  categoryLabels,
  typeLabels,
  type Brand,
  type Category,
  type VehicleType,
  type SortOption,
} from "@/lib/vehicles";
import { Filter, X, SlidersHorizontal } from "lucide-react";

function VehiculosPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get filters from URL
  const brandParam = searchParams.get("marca") as Brand | null;
  const categoryParam = searchParams.get("categoria") as Category | null;
  const typeParam = searchParams.get("tipo") as VehicleType | null;
  const sortParam = (searchParams.get("orden") || "name") as SortOption;

  const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>(
    brandParam || undefined
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(
    categoryParam || undefined
  );
  const [selectedType, setSelectedType] = useState<VehicleType | undefined>(
    typeParam || undefined
  );
  const [sortBy, setSortBy] = useState<SortOption>(sortParam);

  // Get all vehicles and apply filters
  const allVehicles = getAllVehicles();
  const brands = getBrands();
  const categories = getCategories();
  const types = getTypes();

  const filteredAndSorted = useMemo(() => {
    const filtered = filterVehicles(allVehicles, {
      brand: selectedBrand,
      category: selectedCategory,
      type: selectedType,
    });
    return sortVehicles(filtered, sortBy);
  }, [selectedBrand, selectedCategory, selectedType, sortBy, allVehicles]);

  // Update URL when filters change
  const updateURL = (
    brand?: Brand,
    category?: Category,
    type?: VehicleType,
    sort?: SortOption
  ) => {
    const params = new URLSearchParams();
    if (brand) params.set("marca", brand);
    if (category) params.set("categoria", category);
    if (type) params.set("tipo", type);
    if (sort && sort !== "name") params.set("orden", sort);

    const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newURL, { scroll: false });
  };

  const handleBrandChange = (brand: Brand | "all") => {
    const newBrand = brand === "all" ? undefined : brand;
    setSelectedBrand(newBrand);
    updateURL(newBrand, selectedCategory, selectedType, sortBy);
  };

  const handleCategoryChange = (category: Category | "all") => {
    const newCategory = category === "all" ? undefined : category;
    setSelectedCategory(newCategory);
    updateURL(selectedBrand, newCategory, selectedType, sortBy);
  };

  const handleTypeChange = (type: VehicleType | "all") => {
    const newType = type === "all" ? undefined : type;
    setSelectedType(newType);
    updateURL(selectedBrand, selectedCategory, newType, sortBy);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    updateURL(selectedBrand, selectedCategory, selectedType, sort);
  };

  const clearFilters = () => {
    setSelectedBrand(undefined);
    setSelectedCategory(undefined);
    setSelectedType(undefined);
    setSortBy("name");
    router.push(pathname);
  };

  const hasActiveFilters = selectedBrand || selectedCategory || selectedType;
  const activeFilterCount =
    (selectedBrand ? 1 : 0) + (selectedCategory ? 1 : 0) + (selectedType ? 1 : 0);

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4 space-y-8">
        {/* Header */}
        <SectionHeader
          title="Catálogo de Vehículos"
          subtitle="Explorá nuestra selección completa de vehículos 0km"
          centered
          className="mx-auto"
        />

        {/* Filters & Sort Bar */}
        <Card className="p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filtros y ordenamiento</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount} activo{activeFilterCount > 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Marca</label>
              <Select
                value={selectedBrand || "all"}
                onValueChange={handleBrandChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las marcas</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brandLabels[brand]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select
                value={selectedCategory || "all"}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {categoryLabels[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select
                value={selectedType || "all"}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {typeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ordenar por</label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="brand">Marca</SelectItem>
                  <SelectItem value="price">Precio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters & Clear */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">Filtros activos:</span>
              {selectedBrand && (
                <Badge variant="secondary" className="gap-1">
                  {brandLabels[selectedBrand]}
                  <button
                    onClick={() => handleBrandChange("all")}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1">
                  {categoryLabels[selectedCategory]}
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedType && (
                <Badge variant="secondary" className="gap-1">
                  {typeLabels[selectedType]}
                  <button
                    onClick={() => handleTypeChange("all")}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                Limpiar todo
              </Button>
            </div>
          )}
        </Card>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredAndSorted.length} vehículo
          {filteredAndSorted.length !== 1 ? "s" : ""} encontrado
          {filteredAndSorted.length !== 1 ? "s" : ""}
        </div>

        {/* Vehicle Grid */}
        {filteredAndSorted.length > 0 ? (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSorted.map((vehicle) => (
                <motion.div
                  key={vehicle.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <VehicleCard
                    slug={vehicle.slug}
                    brand={vehicle.brand}
                    model={vehicle.model}
                    tagline={vehicle.tagline}
                    price={vehicle.priceUsd || undefined}
                    currency="USD"
                    specs={{
                      fuel: typeLabels[vehicle.type],
                      transmission: vehicle.specs.transmission,
                    }}
                    features={vehicle.highlightFeatures.slice(0, 3)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <Card className="p-12 text-center">
            <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              No se encontraron vehículos
            </h3>
            <p className="text-muted-foreground mb-6">
              Intentá ajustar los filtros para ver más resultados
            </p>
            <Button onClick={clearFilters} variant="outline">
              Limpiar filtros
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function VehiculosPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-16">
        <div className="text-center">Cargando...</div>
      </div>
    }>
      <VehiculosPageContent />
    </Suspense>
  );
}
