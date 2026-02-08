"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllVehicles,
  getVehicleBySlug,
  getVehiclesGroupedByBrand,
  getVehicleDisplayName,
  formatPrice,
  formatNumber,
  compareVehicleSpecs,
  getWhatsAppLink,
  getVehicleSuggestionsByCategory,
  type Vehicle,
} from "@/lib/vehicles";
import { Plus, X, Check, MessageCircle, ExternalLink, Users, Mountain, Building2, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MAX_VEHICLES = 3;
const MIN_VEHICLES = 2;

function CompararPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  
  const vehicles = getAllVehicles();
  const groupedVehicles = getVehiclesGroupedByBrand();
  
  // Load from URL params on mount
  useEffect(() => {
    const urlVehicles = searchParams?.getAll("v") || [];
    if (urlVehicles.length > 0) {
      const validSlugs = urlVehicles
        .map(slug => getVehicleBySlug(slug))
        .filter(Boolean)
        .map(v => v!.slug)
        .slice(0, MAX_VEHICLES);
      
      setSelectedSlugs(validSlugs);
    }
  }, [searchParams]);
  
  // Update selected vehicles when slugs change
  useEffect(() => {
    const vehiclesData = selectedSlugs
      .map(slug => getVehicleBySlug(slug))
      .filter(Boolean) as Vehicle[];
    setSelectedVehicles(vehiclesData);
  }, [selectedSlugs]);
  
  // Update URL when selection changes
  const updateURL = (slugs: string[]) => {
    const params = new URLSearchParams();
    slugs.forEach(slug => params.append("v", slug));
    const queryString = params.toString();
    router.push(queryString ? `/comparar?${queryString}` : "/comparar");
  };
  
  const handleAddVehicle = (slug: string) => {
    if (selectedSlugs.includes(slug)) return;
    if (selectedSlugs.length >= MAX_VEHICLES) return;
    
    const newSlugs = [...selectedSlugs, slug];
    setSelectedSlugs(newSlugs);
    updateURL(newSlugs);
  };
  
  const handleRemoveVehicle = (index: number) => {
    const newSlugs = selectedSlugs.filter((_, i) => i !== index);
    setSelectedSlugs(newSlugs);
    updateURL(newSlugs);
  };
  
  const handleSuggestion = (category: "familia" | "aventura" | "ciudad" | "trabajo") => {
    const suggested = getVehicleSuggestionsByCategory(category);
    const slugs = suggested.map(v => v.slug).slice(0, MAX_VEHICLES);
    setSelectedSlugs(slugs);
    updateURL(slugs);
  };
  
  const winners = compareVehicleSpecs(selectedVehicles);
  
  const canCompare = selectedVehicles.length >= MIN_VEHICLES;
  
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <SectionHeader
        title="Comparador Multi-Marca"
        subtitle="Compará hasta 3 vehículos lado a lado para tomar la mejor decisión"
        centered
        className="mx-auto"
      />
      
      {/* Vehicle Selection */}
      <div className="grid gap-4 md:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {Array.from({ length: MAX_VEHICLES }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "relative",
                selectedSlugs[index] && "border-primary"
              )}>
                <CardContent className="p-6">
                  {selectedSlugs[index] ? (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge className="mb-2">
                            {getVehicleBySlug(selectedSlugs[index])?.brandDisplay}
                          </Badge>
                          <h3 className="font-semibold text-lg">
                            {getVehicleBySlug(selectedSlugs[index])?.model}
                          </h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveVehicle(index)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Select onValueChange={handleAddVehicle}>
                      <SelectTrigger>
                        <SelectValue placeholder={`Vehículo ${index + 1}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(groupedVehicles).map(([brand, vehicles]) => (
                          <div key={brand}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                              {vehicles[0].brandDisplay}
                            </div>
                            {vehicles.map(vehicle => (
                              <SelectItem
                                key={vehicle.slug}
                                value={vehicle.slug}
                                disabled={selectedSlugs.includes(vehicle.slug)}
                              >
                                {vehicle.model}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Comparison Table or Empty State */}
      {!canCompare ? (
        <Card className="border-dashed">
          <CardContent className="py-16 space-y-8">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold">
                ¿No sabés cuál elegir? Te ayudamos
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Seleccioná al menos 2 vehículos arriba o elegí una categoría para ver sugerencias personalizadas
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-4 max-w-4xl mx-auto">
              <Card
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleSuggestion("familia")}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold">Familia</h4>
                  <p className="text-sm text-muted-foreground">
                    Outlander vs H6
                  </p>
                </CardContent>
              </Card>
              
              <Card
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleSuggestion("aventura")}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mountain className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold">Aventura</h4>
                  <p className="text-sm text-muted-foreground">
                    Tank 300 vs L200
                  </p>
                </CardContent>
              </Card>
              
              <Card
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleSuggestion("ciudad")}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold">Ciudad</h4>
                  <p className="text-sm text-muted-foreground">
                    Jolion vs ORA 03
                  </p>
                </CardContent>
              </Card>
              
              <Card
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleSuggestion("trabajo")}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold">Trabajo</h4>
                  <p className="text-sm text-muted-foreground">
                    Poer vs L200
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedVehicles.length}, minmax(300px, 1fr))` }}>
                {selectedVehicles.map((vehicle, index) => (
                  <Card key={vehicle.slug}>
                    <CardContent className="p-6 space-y-6">
                      {/* Overview */}
                      <div className="space-y-3">
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">Imagen próximamente</span>
                        </div>
                        <Badge>{vehicle.brandDisplay}</Badge>
                        <h3 className="font-bold text-xl">{vehicle.model}</h3>
                        <p className="text-sm text-muted-foreground">{vehicle.tagline}</p>
                        <div className={cn(
                          "text-2xl font-bold",
                          winners.price === index && "text-green-600"
                        )}>
                          {formatPrice(vehicle.priceUsd)}
                        </div>
                      </div>
                      
                      {/* Motor */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm uppercase text-muted-foreground">Motor</h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-muted-foreground">Motor: </span>
                            <span>{vehicle.specs.engine || "N/A"}</span>
                          </div>
                          <div className={cn(winners.power === index && "bg-green-50 -mx-2 px-2 py-1 rounded")}>
                            <span className="text-muted-foreground">Potencia: </span>
                            <span className="font-semibold">{vehicle.specs.power || "N/A"}</span>
                          </div>
                          <div className={cn(winners.torque === index && "bg-green-50 -mx-2 px-2 py-1 rounded")}>
                            <span className="text-muted-foreground">Torque: </span>
                            <span className="font-semibold">{vehicle.specs.torque || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Transmisión: </span>
                            <span>{vehicle.specs.transmission || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tracción: </span>
                            <span>{vehicle.specs.traction || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Dimensiones */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm uppercase text-muted-foreground">Dimensiones</h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-muted-foreground">Largo: </span>
                            <span>{formatNumber(vehicle.specs.dimensions?.length)} mm</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Ancho: </span>
                            <span>{formatNumber(vehicle.specs.dimensions?.width)} mm</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Alto: </span>
                            <span>{formatNumber(vehicle.specs.dimensions?.height)} mm</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Distancia entre ejes: </span>
                            <span>{formatNumber(vehicle.specs.wheelbase)} mm</span>
                          </div>
                          <div className={cn(winners.weight === index && "bg-green-50 -mx-2 px-2 py-1 rounded")}>
                            <span className="text-muted-foreground">Peso: </span>
                            <span className="font-semibold">{formatNumber(vehicle.specs.weight)} kg</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Economía */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm uppercase text-muted-foreground">Economía</h4>
                        <div className="space-y-1 text-sm">
                          <div className={cn(winners.fuelTank === index && "bg-green-50 -mx-2 px-2 py-1 rounded")}>
                            <span className="text-muted-foreground">Tanque: </span>
                            <span className="font-semibold">{formatNumber(vehicle.specs.fuelTank)} L</span>
                          </div>
                          {vehicle.specs.fuelConsumption && (
                            <div>
                              <span className="text-muted-foreground">Consumo: </span>
                              <span>{vehicle.specs.fuelConsumption}</span>
                            </div>
                          )}
                          {vehicle.specs.autonomy && (
                            <div>
                              <span className="text-muted-foreground">Autonomía: </span>
                              <span>{vehicle.specs.autonomy}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-muted-foreground">Tipo: </span>
                            <span className="capitalize">{vehicle.type === "combustion" ? "Nafta/Diesel" : vehicle.type === "electric" ? "Eléctrico" : "Híbrido"}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Destacados */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm uppercase text-muted-foreground">Destacados</h4>
                        <div className="space-y-1">
                          {vehicle.highlightFeatures.slice(0, 5).map((feature, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* CTAs */}
                      <div className="space-y-2 pt-4 border-t">
                        <Button
                          className="w-full"
                          onClick={() => {
                            const message = `Hola! Me interesa el ${getVehicleDisplayName(vehicle)}. ¿Podrían darme más información?`;
                            window.open(getWhatsAppLink(message), "_blank");
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Consultar
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => window.open(`/vehiculos/${vehicle.slug}`, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver Ficha Completa
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CompararPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-16">
        <div className="text-center">Cargando...</div>
      </div>
    }>
      <CompararPageContent />
    </Suspense>
  );
}
