import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import ChatWidget from "@/components/chat-widget";
import { WhatsAppButton } from "@/components/whatsapp-button";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Valparaíso Motors | Concesionario Oficial Haval, GWM, Mitsubishi, Changan, JMEV en Córdoba",
  description:
    "Concesionario oficial de Haval, GWM, Mitsubishi, Changan y JMEV en Córdoba. Venta de vehículos 0km, financiación flexible, test drive y postventa integral.",
  keywords:
    "valparaiso motors, haval cordoba, gwm cordoba, mitsubishi cordoba, changan cordoba, jmev cordoba, concesionario, autos 0km, financiacion, test drive",
  openGraph: {
    title: "Valparaíso Motors | Concesionario Oficial en Córdoba",
    description:
      "5 marcas oficiales en un solo lugar. Encontrá tu próximo vehículo con financiación flexible y postventa integral.",
    type: "website",
    locale: "es_AR",
    siteName: "Valparaíso Motors",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valparaíso Motors | Concesionario Oficial en Córdoba",
    description:
      "5 marcas oficiales: Haval, GWM, Mitsubishi, Changan, JMEV. Venta de 0km con financiación.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutomotiveBusiness",
              name: "Valparaíso Motors",
              description:
                "Concesionario oficial de Haval, GWM, Mitsubishi, Changan y JMEV en Córdoba",
              url: "https://valparaisomotors.com",
              telephone: "+54-351-309-2154",
              email: "Info@valparaisomotors.com.ar",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Av. Ciudad de Valparaíso 4380",
                addressLocality: "Córdoba",
                addressRegion: "Córdoba",
                postalCode: "X5016",
                addressCountry: "AR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "-31.4201",
                longitude: "-64.1888",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "09:00",
                  closes: "19:30",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "09:00",
                  closes: "14:00",
                },
              ],
              sameAs: [
                "https://www.instagram.com/valparaiso.motors",
                "https://www.facebook.com/valparaisomotorsarg",
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased font-sans`}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <WhatsAppButton />
        <ChatWidget />
      </body>
    </html>
  );
}
