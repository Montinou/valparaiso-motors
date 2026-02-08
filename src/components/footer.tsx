import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">
              Valparaíso Motors
            </h3>
            <p className="text-sm text-muted-foreground">
              Concesionario oficial de Haval, GWM, Mitsubishi, Changan y JMEV
              en Córdoba. Tu próximo vehículo te espera.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                <span>
                  Av. Ciudad de Valparaíso 4380
                  <br />
                  Córdoba Capital, X5016
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href="tel:+5493513092154"
                  className="hover:text-primary transition-colors"
                >
                  (0351) 3092154
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href="mailto:Info@valparaisomotors.com.ar"
                  className="hover:text-primary transition-colors"
                >
                  Info@valparaisomotors.com.ar
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p>Lun-Vie: 9:00-19:30</p>
                  <p>Sáb: 9:00-14:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-4">
            <h4 className="font-semibold">Nuestras Marcas</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/vehiculos?marca=haval" className="hover:text-primary transition-colors">
                  Haval
                </Link>
              </li>
              <li>
                <Link href="/vehiculos?marca=gwm" className="hover:text-primary transition-colors">
                  GWM
                </Link>
              </li>
              <li>
                <Link href="/vehiculos?marca=mitsubishi" className="hover:text-primary transition-colors">
                  Mitsubishi
                </Link>
              </li>
              <li>
                <Link href="/vehiculos?marca=changan" className="hover:text-primary transition-colors">
                  Changan
                </Link>
              </li>
              <li>
                <Link href="/vehiculos?marca=jmev" className="hover:text-primary transition-colors">
                  JMEV
                </Link>
              </li>
            </ul>
          </div>

          {/* Links & Social */}
          <div className="space-y-4">
            <h4 className="font-semibold">Seguinos</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/valparaiso.motors"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/valparaisomotorsarg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
            <div className="mt-6">
              <h5 className="text-sm font-medium mb-2">Ubicación</h5>
              <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                Mapa aquí
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Valparaíso Motors. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
