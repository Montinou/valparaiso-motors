"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllVehicles, getVehicleBySlug, getWhatsAppLink, type Vehicle } from "@/lib/vehicles";
import { CheckCircle2, Clock, MapPin, Shield, Star, ThumbsUp, CarFront } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  { value: "morning", label: "Mañana (9:00 - 12:00)" },
  { value: "afternoon", label: "Tarde (12:00 - 16:00)" },
  { value: "evening", label: "Tarde/Noche (16:00 - 19:00)" },
];

interface FormData {
  name: string;
  phone: string;
  email: string;
  vehicleSlug: string;
  date: string;
  timeSlot: string;
  message: string;
}

export default function TestDrivePage() {
  const vehicles = getAllVehicles();
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    vehicleSlug: "",
    date: "",
    timeSlot: "",
    message: "",
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    
    // Update selected vehicle for preview
    if (field === "vehicleSlug") {
      setSelectedVehicle(getVehicleBySlug(value) || null);
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\s|-/g, ""))) {
      newErrors.phone = "Ingresá un teléfono válido (mín. 10 dígitos)";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresá un email válido";
    }
    
    if (!formData.vehicleSlug) {
      newErrors.vehicleSlug = "Seleccioná un vehículo";
    }
    
    if (!formData.date) {
      newErrors.date = "Seleccioná una fecha";
    } else {
      const selectedDate = new Date(formData.date);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      
      if (selectedDate < tomorrow) {
        newErrors.date = "La fecha debe ser al menos mañana";
      } else if (selectedDate > maxDate) {
        newErrors.date = "La fecha no puede ser más de 30 días";
      }
    }
    
    if (!formData.timeSlot) {
      newErrors.timeSlot = "Seleccioná un horario";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    // Save to localStorage for future Supabase integration
    const testDriveRequest = {
      ...formData,
      timestamp: new Date().toISOString(),
    };
    
    const existing = JSON.parse(localStorage.getItem("test-drive-requests") || "[]");
    localStorage.setItem("test-drive-requests", JSON.stringify([...existing, testDriveRequest]));
    
    // Format WhatsApp message
    const vehicle = getVehicleBySlug(formData.vehicleSlug);
    const timeSlotLabel = TIME_SLOTS.find(t => t.value === formData.timeSlot)?.label || formData.timeSlot;
    
    const message = `🚗 *Solicitud de Test Drive*

👤 *Datos del solicitante:*
• Nombre: ${formData.name}
• Teléfono: ${formData.phone}
${formData.email ? `• Email: ${formData.email}` : ""}

🚙 *Vehículo de interés:*
${vehicle ? `${vehicle.brandDisplay} ${vehicle.model}` : ""}

📅 *Fecha y horario preferido:*
• Fecha: ${new Date(formData.date).toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
• Horario: ${timeSlotLabel}

${formData.message ? `💬 *Comentarios:*\n${formData.message}` : ""}

¡Espero su confirmación!`;
    
    // Open WhatsApp
    window.open(getWhatsAppLink(message), "_blank");
    
    // Show success message
    setSubmitted(true);
  };
  
  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      vehicleSlug: "",
      date: "",
      timeSlot: "",
      message: "",
    });
    setErrors({});
    setSubmitted(false);
    setSelectedVehicle(null);
  };
  
  // Calculate min and max dates
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 30);
  const maxDate = maxDateObj.toISOString().split("T")[0];
  
  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-12 text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-green-900">
                  ¡Genial! Tu solicitud fue enviada
                </h2>
                <p className="text-lg text-green-800">
                  Te contactaremos pronto para confirmar tu test drive
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 space-y-3 text-left">
                <p className="text-sm text-muted-foreground">
                  <strong>Próximos pasos:</strong>
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Revisaremos tu solicitud</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Te contactaremos por WhatsApp o teléfono</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Confirmaremos fecha y hora</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>¡Disfrutá tu test drive!</span>
                  </li>
                </ul>
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleReset}>
                  Agendar otro test drive
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                  Volver al inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <SectionHeader
        title="Agendá tu Test Drive"
        subtitle="Probá el vehículo que te interesa antes de decidir. Sin compromiso."
        centered
        className="mx-auto"
      />
      
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Completá tus datos</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Juan Pérez"
                  className={cn(errors.name && "border-red-500")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              
              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Teléfono <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="351 123 4567"
                  className={cn(errors.phone && "border-red-500")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="juan@email.com"
                  className={cn(errors.email && "border-red-500")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              {/* Vehicle */}
              <div className="space-y-2">
                <Label htmlFor="vehicle">
                  Vehículo de interés <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.vehicleSlug}
                  onValueChange={(value) => handleChange("vehicleSlug", value)}
                >
                  <SelectTrigger
                    id="vehicle"
                    className={cn(errors.vehicleSlug && "border-red-500")}
                  >
                    <SelectValue placeholder="Seleccioná el modelo que querés probar" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.slug} value={vehicle.slug}>
                        {vehicle.brandDisplay} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicleSlug && (
                  <p className="text-sm text-red-500">{errors.vehicleSlug}</p>
                )}
              </div>
              
              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">
                  Fecha preferida <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  min={minDate}
                  max={maxDate}
                  className={cn(errors.date && "border-red-500")}
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Entre mañana y los próximos 30 días
                </p>
              </div>
              
              {/* Time Slot */}
              <div className="space-y-2">
                <Label htmlFor="timeSlot">
                  Horario preferido <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.timeSlot}
                  onValueChange={(value) => handleChange("timeSlot", value)}
                >
                  <SelectTrigger
                    id="timeSlot"
                    className={cn(errors.timeSlot && "border-red-500")}
                  >
                    <SelectValue placeholder="Seleccioná un horario" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.timeSlot && (
                  <p className="text-sm text-red-500">{errors.timeSlot}</p>
                )}
              </div>
              
              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Comentarios o consultas (opcional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="¿Algo que quieras que sepamos?"
                  rows={4}
                />
              </div>
              
              <Button type="submit" size="lg" className="w-full">
                <CarFront className="h-5 w-5 mr-2" />
                Agendar Test Drive
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Benefits & Preview Section */}
        <div className="space-y-6">
          {/* Vehicle Preview */}
          <AnimatePresence mode="wait">
            {selectedVehicle && (
              <motion.div
                key={selectedVehicle.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-primary">
                  <CardContent className="p-6 space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">Imagen próximamente</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {selectedVehicle.brandDisplay}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold">{selectedVehicle.model}</h3>
                      <p className="text-sm text-muted-foreground">{selectedVehicle.tagline}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Motor:</span>
                        <p className="font-medium">{selectedVehicle.specs.power}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Transmisión:</span>
                        <p className="font-medium">{selectedVehicle.specs.transmission}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>¿Por qué probar antes de comprar?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ThumbsUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Sentí la experiencia real</h4>
                  <p className="text-sm text-muted-foreground">
                    Probá el confort, la tecnología y el desempeño en la calle
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Compará en vivo</h4>
                  <p className="text-sm text-muted-foreground">
                    Podés probar varios modelos el mismo día para decidir mejor
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Sin compromiso</h4>
                  <p className="text-sm text-muted-foreground">
                    Test drive 100% gratuito y sin obligación de compra
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Asesoramiento experto</h4>
                  <p className="text-sm text-muted-foreground">
                    Nuestro equipo te acompaña y resuelve todas tus dudas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-6 space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong>Duración:</strong> Aproximadamente 30-45 minutos
                </p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong>Ubicación:</strong> Valparaíso Motors, Córdoba Capital
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong>Requisitos:</strong> DNI vigente y registro de conducir
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
