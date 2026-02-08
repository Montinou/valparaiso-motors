import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CTABannerProps {
  title: string;
  description?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  variant?: "default" | "gradient";
  className?: string;
}

export function CTABanner({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  variant = "default",
  className,
}: CTABannerProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-8 md:p-12",
        variant === "gradient"
          ? "bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white"
          : "bg-muted border",
        className
      )}
    >
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2
          className={cn(
            "text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)]",
            variant === "gradient" ? "text-white" : "text-primary"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "text-lg",
              variant === "gradient"
                ? "text-white/90"
                : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className={cn(
              variant === "gradient"
                ? "bg-white text-primary hover:bg-white/90"
                : "bg-accent hover:bg-accent/90 text-white"
            )}
          >
            <Link href={primaryHref} className="flex items-center gap-2">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {secondaryLabel && secondaryHref && (
            <Button
              asChild
              size="lg"
              variant={variant === "gradient" ? "outline" : "outline"}
              className={cn(
                variant === "gradient" &&
                  "border-white text-white hover:bg-white/10"
              )}
            >
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
