"use client";

import { useState, useEffect, useMemo } from "react";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllVehicles, getVehicleBySlug, formatNumber, getWhatsAppLink, type Vehicle } from "@/lib/vehicles";
import { Calculator, MessageCircle, Phone, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LOAN_TERMS = [12, 18, 24, 36, 48, 60];
const DEFAULT_RATE = 45; // 45% annual interest (typical Argentina)

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function FinanciacionPage() {
  const vehicles = getAllVehicles();
  
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [price, setPrice] = useState<number>(20000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTerm, setLoanTerm] = useState<number>(36);
  const [interestRate, setInterestRate] = useState<number>(DEFAULT_RATE);
  
  // Update price when vehicle changes
  useEffect(() => {
    if (selectedVehicle && selectedVehicle.priceUsd) {
      setPrice(selectedVehicle.priceUsd);
    } else if (!selectedVehicle) {
      setPrice(customPrice || 20000);
    }
  }, [selectedVehicle, customPrice]);
  
  // Calculate financing
  const financing = useMemo(() => {
    const downPayment = price * (downPaymentPercent / 100);
    const loanAmount = price - downPayment;
    
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    
    // Monthly payment using amortization formula
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    
    const totalAmount = monthlyPayment * loanTerm;
    const totalInterest = totalAmount - loanAmount;
    
    // Amortization schedule
    const schedule: AmortizationRow[] = [];
    let remainingBalance = loanAmount;
    
    for (let month = 1; month <= loanTerm; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      
      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance),
      });
    }
    
    return {
      price,
      downPayment,
      loanAmount,
      monthlyPayment,
      totalAmount,
      totalInterest,
      schedule,
    };
  }, [price, downPaymentPercent, loanTerm, interestRate]);
  
  const handleVehicleSelect = (value: string) => {
    if (value === "custom") {
      setSelectedVehicle(null);
      setPrice(customPrice || 20000);
    } else {
      const vehicle = getVehicleBySlug(value);
      setSelectedVehicle(vehicle || null);
    }
  };
  
  const handleWhatsApp = () => {
    const vehicleName = selectedVehicle ? `${selectedVehicle.brandDisplay} ${selectedVehicle.model}` : "vehículo personalizado";
    const message = `Hola! Me interesa financiar un ${vehicleName}.

💵 Precio: USD ${formatNumber(price)}
📊 Anticipo: USD ${formatNumber(financing.downPayment)} (${downPaymentPercent}%)
📅 Plazo: ${loanTerm} meses
💳 Cuota mensual estimada: USD ${formatNumber(Math.round(financing.monthlyPayment))}

¿Podrían confirmarme las condiciones actuales?`;
    
    window.open(getWhatsAppLink(message), "_blank");
  };
  
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <SectionHeader
        title="Calculadora de Financiación"
        subtitle="Calculá tu cuota y llevate tu 0km hoy con planes a medida"
        centered
        className="mx-auto"
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Configurá tu financiación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Vehicle Selector */}
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehículo</Label>
              <Select onValueChange={handleVehicleSelect}>
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Seleccioná un modelo o ingresá monto personalizado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">💵 Otro monto (personalizado)</SelectItem>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.slug} value={vehicle.slug}>
                      {vehicle.brandDisplay} {vehicle.model} {vehicle.priceUsd ? `- USD ${formatNumber(vehicle.priceUsd)}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Price Input */}
            <div className="space-y-2">
              <Label htmlFor="price">Precio del Vehículo (USD)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setPrice(value);
                  if (!selectedVehicle) {
                    setCustomPrice(value);
                  }
                }}
                min={1000}
                step={1000}
              />
            </div>
            
            {/* Down Payment */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Anticipo</Label>
                <span className="text-sm font-semibold">
                  {downPaymentPercent}% (USD {formatNumber(financing.downPayment)})
                </span>
              </div>
              <Slider
                value={[downPaymentPercent]}
                onValueChange={(values) => setDownPaymentPercent(values[0])}
                min={0}
                max={80}
                step={5}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>80%</span>
              </div>
            </div>
            
            {/* Loan Term */}
            <div className="space-y-3">
              <Label>Plazo (meses)</Label>
              <div className="grid grid-cols-3 gap-2">
                {LOAN_TERMS.map((term) => (
                  <Button
                    key={term}
                    variant={loanTerm === term ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLoanTerm(term)}
                    className="w-full"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Interest Rate */}
            <div className="space-y-2">
              <Label htmlFor="rate">Tasa de Interés Anual (%)</Label>
              <Input
                id="rate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || DEFAULT_RATE)}
                min={0}
                max={100}
                step={0.5}
              />
              <p className="text-xs text-muted-foreground">
                Tasa estimada. Puede variar según tu perfil crediticio.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Results Section */}
        <div className="space-y-6">
          {/* Monthly Payment - Highlighted */}
          <Card className="border-primary bg-primary/5">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Tu cuota mensual
                </p>
                <motion.div
                  key={financing.monthlyPayment}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-bold text-primary"
                >
                  USD {formatNumber(Math.round(financing.monthlyPayment))}
                </motion.div>
                <p className="text-xs text-muted-foreground">
                  por {loanTerm} meses
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen de Financiación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precio del vehículo:</span>
                <span className="font-semibold">USD {formatNumber(price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Anticipo ({downPaymentPercent}%):</span>
                <span className="font-semibold">USD {formatNumber(financing.downPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monto a financiar:</span>
                <span className="font-semibold">USD {formatNumber(financing.loanAmount)}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total a pagar:</span>
                <span className="font-bold text-lg">USD {formatNumber(Math.round(financing.totalAmount))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total intereses:</span>
                <span className="text-orange-600 font-semibold">USD {formatNumber(Math.round(financing.totalInterest))}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Visual Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribución del Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Capital</span>
                    <span className="font-semibold">USD {formatNumber(Math.round(financing.loanAmount))}</span>
                  </div>
                  <div className="h-8 bg-green-100 rounded-lg overflow-hidden flex">
                    <div
                      className="bg-green-600 flex items-center justify-center text-white text-xs font-semibold"
                      style={{ width: `${(financing.loanAmount / financing.totalAmount) * 100}%` }}
                    >
                      {Math.round((financing.loanAmount / financing.totalAmount) * 100)}%
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Intereses</span>
                    <span className="font-semibold">USD {formatNumber(Math.round(financing.totalInterest))}</span>
                  </div>
                  <div className="h-8 bg-orange-100 rounded-lg overflow-hidden flex">
                    <div
                      className="bg-orange-600 flex items-center justify-center text-white text-xs font-semibold"
                      style={{ width: `${(financing.totalInterest / financing.totalAmount) * 100}%` }}
                    >
                      {Math.round((financing.totalInterest / financing.totalAmount) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* CTAs */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <Button className="w-full" size="lg" onClick={handleWhatsApp}>
                <MessageCircle className="h-5 w-5 mr-2" />
                Quiero esta financiación
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(getWhatsAppLink("Hola! Necesito hablar con un asesor sobre financiación."), "_blank")}
              >
                <Phone className="h-5 w-5 mr-2" />
                Hablar con un asesor
              </Button>
              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  Los valores son estimativos y pueden variar según tu perfil crediticio y las condiciones vigentes. Consultá por las condiciones actuales.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Amortization Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tabla de Amortización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Mes</th>
                  <th className="text-right py-2 px-3">Cuota</th>
                  <th className="text-right py-2 px-3">Capital</th>
                  <th className="text-right py-2 px-3">Interés</th>
                  <th className="text-right py-2 px-3">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {financing.schedule.map((row) => (
                  <tr key={row.month} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-3 font-medium">{row.month}</td>
                    <td className="text-right py-2 px-3">{formatNumber(Math.round(row.payment))}</td>
                    <td className="text-right py-2 px-3 text-green-600">{formatNumber(Math.round(row.principal))}</td>
                    <td className="text-right py-2 px-3 text-orange-600">{formatNumber(Math.round(row.interest))}</td>
                    <td className="text-right py-2 px-3">{formatNumber(Math.round(row.balance))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
