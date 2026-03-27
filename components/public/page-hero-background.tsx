import { cn } from "@/lib/utils"
import type { HeroBackgroundAlign } from "@/lib/public-hero-backgrounds"

interface PageHeroBackgroundProps {
  image: string
  position?: string
  align?: HeroBackgroundAlign
  className?: string
}

export function PageHeroBackground({
  image,
  position = "center center",
  align = "left",
  className,
}: PageHeroBackgroundProps) {
  return (
    <div className={cn("absolute inset-0", className)}>
      <div
        className="absolute inset-0 scale-105 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url("${image}")`,
          backgroundPosition: position,
        }}
      />
      <div className="absolute inset-0 bg-visacore-navy/62" />
      <div
        className={cn(
          "absolute inset-0",
          align === "left"
            ? "bg-gradient-to-r from-visacore-navy via-visacore-navy/82 to-visacore-navy/42"
            : "bg-[radial-gradient(circle_at_center,rgba(10,37,64,0.22),rgba(10,37,64,0.74)_58%,rgba(10,37,64,0.94)_100%)]"
        )}
      />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-visacore-navy via-visacore-navy/85 to-transparent" />
      <div
        className={cn(
          "absolute size-[28rem] rounded-full bg-visacore-gold/18 blur-[140px] sm:size-[34rem]",
          align === "left"
            ? "-left-24 top-0"
            : "left-1/2 top-4 -translate-x-1/2"
        )}
      />
      <div className="absolute inset-0 bg-noise opacity-[0.06]" />
    </div>
  )
}
