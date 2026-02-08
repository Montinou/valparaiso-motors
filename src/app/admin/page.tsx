import { SectionHeader } from "@/components/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <SectionHeader
        title="Dashboard Admin"
        subtitle="Panel de administración protegido"
        centered
        className="mx-auto"
      />

      <Card className="border-dashed border-destructive/50">
        <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="relative">
            <Shield className="h-16 w-16 text-muted-foreground" />
            <Lock className="h-6 w-6 text-destructive absolute -bottom-1 -right-1" />
          </div>
          <h3 className="text-xl font-semibold text-muted-foreground">
            Área Protegida
          </h3>
          <p className="text-muted-foreground text-center max-w-2xl">
            Esta sección requiere autenticación. Incluirá:
          </p>
          <div className="bg-muted/50 rounded-lg p-6 space-y-2 text-sm max-w-md">
            <p>📊 Dashboard con métricas de leads y ventas</p>
            <p>👥 Gestión de leads (CRM básico)</p>
            <p>📅 Administración de test drives</p>
            <p>📈 Analytics (fuentes, conversiones, modelos más vistos)</p>
            <p>🚗 ABM de vehículos (agregar, editar, pausar)</p>
          </div>
          <p className="text-xs text-muted-foreground pt-4">
            Autenticación con Supabase Auth
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
