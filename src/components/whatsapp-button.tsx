"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function WhatsAppButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] shadow-lg z-50 transition-all hover:scale-110"
          >
            <a
              href="https://wa.me/5493513092154?text=Hola! Quiero consultar por un vehículo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
            >
              <MessageCircle className="h-7 w-7 text-white" />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="text-sm">
          <p>¿Consultas? ¡Escribinos!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
