"use client"

import { useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  MessageSquare,
  Quote,
  Sparkles,
  Star,
} from "lucide-react"
import {
  buildStoryExcerpt,
  buildStoryReadTime,
  type ShowcaseStoryItem,
  type ShowcaseTestimonialItem,
  wrapCarouselIndex,
} from "@/lib/social-proof-showcase.shared"

type ShowcaseMode = "testimonials" | "stories"

interface SocialProofShowcaseProps {
  testimonials: ShowcaseTestimonialItem[]
  stories: ShowcaseStoryItem[]
}

interface ShowcaseTab {
  key: ShowcaseMode
  label: string
  count: number
}

function TestimonialSlide({
  item,
  isActive,
}: {
  item: ShowcaseTestimonialItem
  isActive: boolean
}) {
  return (
    <motion.article
      animate={{
        opacity: isActive ? 1 : 0.44,
        scale: isActive ? 1 : 0.92,
        y: isActive ? 0 : 18,
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[38px] border border-white/10 bg-white/95 p-8 text-visacore-navy shadow-[0_35px_120px_-45px_rgba(10,37,64,0.65)] backdrop-blur-md md:p-10"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-visacore-gold/70 to-transparent" />
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-visacore-gold/10 px-4 py-2 text-xs font-black uppercase tracking-[0.26em] text-visacore-gold">
          <MessageSquare className="size-4" />
          Témoignage
        </div>
        <Quote className="size-10 text-visacore-gold/20" />
      </div>

      <p className="flex-1 text-xl font-medium leading-relaxed text-visacore-navy/85 md:text-2xl">
        &ldquo;{item.content}&rdquo;
      </p>

      <div className="mt-8 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`size-5 ${
              index < item.rating
                ? "fill-visacore-gold text-visacore-gold"
                : "text-gray-200"
            }`}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4 border-t border-visacore-navy/10 pt-6">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-visacore-navy text-lg font-black text-visacore-gold">
          {item.clientName
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <p className="text-lg font-black text-visacore-navy">{item.clientName}</p>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-visacore-gold">
            {item.destination || "Projet international"}
          </p>
        </div>
      </div>
    </motion.article>
  )
}

function StorySlide({
  item,
  isActive,
}: {
  item: ShowcaseStoryItem
  isActive: boolean
}) {
  return (
    <motion.article
      animate={{
        opacity: isActive ? 1 : 0.44,
        scale: isActive ? 1 : 0.92,
        y: isActive ? 0 : 18,
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[38px] border border-white/12 bg-gradient-to-br from-visacore-navy via-visacore-navy-light to-[#102f50] p-8 text-white shadow-[0_35px_120px_-45px_rgba(10,37,64,0.75)] md:p-10"
    >
      <div className="absolute inset-0 bg-noise opacity-[0.06]" />
      <div className="absolute -right-20 -top-20 size-56 rounded-full bg-visacore-gold/15 blur-[90px]" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-visacore-gold/20 bg-visacore-gold/10 px-4 py-2 text-xs font-black uppercase tracking-[0.26em] text-visacore-gold">
            <Sparkles className="size-4" />
            Success story
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
            <Clock3 className="size-3.5" />
            {buildStoryReadTime(item.content)}
          </div>
        </div>

        <p className="text-sm font-black uppercase tracking-[0.24em] text-visacore-gold/90">
          {item.destination}
        </p>
        <h3 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
          {item.title}
        </h3>
        <p className="mt-6 flex-1 text-lg leading-relaxed text-white/72">
          {buildStoryExcerpt(item.summary, item.content, 220)}
        </p>

        <div className="mt-8 flex items-center justify-between gap-6 border-t border-white/10 pt-6">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-white/45">
              Client
            </p>
            <p className="mt-2 text-xl font-black text-white">{item.clientName}</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
            {item.slug.replaceAll("-", " ")}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function ShowcaseTrack({
  mode,
  testimonials,
  stories,
}: {
  mode: ShowcaseMode
  testimonials: ShowcaseTestimonialItem[]
  stories: ShowcaseStoryItem[]
}) {
  const items = mode === "testimonials" ? testimonials : stories
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: items.length > 1,
    skipSnaps: false,
    dragFree: false,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!emblaApi) {
      return
    }

    const syncSelection = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    syncSelection()
    emblaApi.on("select", syncSelection)
    emblaApi.on("reInit", syncSelection)

    return () => {
      emblaApi.off("select", syncSelection)
      emblaApi.off("reInit", syncSelection)
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi || isPaused || items.length <= 1) {
      return
    }

    const autoplay = window.setInterval(() => {
      emblaApi.scrollNext()
    }, 6500)

    return () => window.clearInterval(autoplay)
  }, [emblaApi, isPaused, items.length])

  if (items.length === 0) {
    return null
  }

  const progress = ((selectedIndex + 1) / items.length) * 100

  return (
    <div
      className="space-y-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-black uppercase tracking-[0.32em] text-visacore-gold">
            {mode === "testimonials" ? "Social proof" : "Narrative proof"}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="mt-3 text-3xl font-black text-white md:text-4xl">
                {mode === "testimonials"
                  ? "Des voix réelles, des parcours validés."
                  : "Des trajectoires détaillées, pas des promesses vagues."}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-white/55 md:text-lg">
                {mode === "testimonials"
                  ? "Faites défiler des retours clients bruts, centrés sur la confiance, la préparation et la clarté du processus."
                  : "Chaque carte résume un parcours concret, la destination visée et la transformation obtenue avec l'accompagnement VisaCore."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            className="inline-flex size-12 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-all hover:border-visacore-gold/40 hover:bg-visacore-gold hover:text-visacore-navy"
            aria-label="Voir l'élément précédent"
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            className="inline-flex size-12 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-all hover:border-visacore-gold/40 hover:bg-visacore-gold hover:text-visacore-navy"
            aria-label="Voir l'élément suivant"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex md:-ml-6">
          {items.map((item, index) => {
            const distance = Math.abs(
              wrapCarouselIndex(index - selectedIndex, items.length)
            )
            const isActive = index === selectedIndex
            const visualDistance =
              distance > items.length / 2 ? items.length - distance : distance

            return (
              <div
                key={item.id}
                className="min-w-0 flex-[0_0_88%] pl-4 md:flex-[0_0_70%] md:pl-6 xl:flex-[0_0_58%]"
              >
                <div
                  className={`transition-all duration-500 ${
                    visualDistance === 0
                      ? "opacity-100"
                      : visualDistance === 1
                        ? "opacity-80"
                        : "opacity-35"
                  }`}
                >
                  {mode === "testimonials" ? (
                    <TestimonialSlide
                      item={item as ShowcaseTestimonialItem}
                      isActive={isActive}
                    />
                  ) : (
                    <StorySlide
                      item={item as ShowcaseStoryItem}
                      isActive={isActive}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-visacore-gold via-visacore-gold-light to-visacore-gold"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.24em] text-white/42">
            <span>
              {String(selectedIndex + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </span>
            <span>{isPaused ? "Pause" : "Défilement automatique"}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              className={`rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.22em] transition-all ${
                selectedIndex === index
                  ? "bg-visacore-gold text-visacore-navy"
                  : "bg-white/6 text-white/55 hover:bg-white/10 hover:text-white"
              }`}
              aria-label={`Aller à l'élément ${index + 1}`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SocialProofShowcase({
  testimonials,
  stories,
}: SocialProofShowcaseProps) {
  const tabs = [
    {
      key: "testimonials",
      label: "Témoignages",
      count: testimonials.length,
    },
    {
      key: "stories",
      label: "Success stories",
      count: stories.length,
    },
  ] satisfies ShowcaseTab[]

  const [mode, setMode] = useState<ShowcaseMode>(
    testimonials.length > 0 ? "testimonials" : "stories"
  )

  const availableTabs = tabs.filter((tab) => tab.count > 0)

  if (availableTabs.length === 0) {
    return null
  }

  return (
    <section className="section-padding bg-visacore-navy text-white">
      <div className="container-custom">
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.34em] text-visacore-gold">
              Social proof
            </p>
            <h2 className="mt-4 text-4xl font-black leading-none md:text-6xl">
              Des preuves <span className="serif italic text-visacore-gold">vivantes</span>, pas des slogans.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
              Faites défiler les avis clients et les histoires de réussite publiées depuis le back office.
              Le composant reste entièrement dynamique et s&apos;adapte au volume réel de contenu.
            </p>
          </div>

          <div className="inline-flex flex-wrap gap-2 rounded-full border border-white/10 bg-white/6 p-2 backdrop-blur-sm">
            {availableTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMode(tab.key)}
                className={`rounded-full px-5 py-3 text-sm font-black uppercase tracking-[0.2em] transition-all ${
                  tab.key === mode
                    ? "bg-visacore-gold text-visacore-navy"
                    : "text-white/55 hover:bg-white/8 hover:text-white"
                }`}
              >
                {tab.label}
                <span className="ml-2 text-[10px] opacity-70">
                  {String(tab.count).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </div>

        <ShowcaseTrack
          key={mode}
          mode={mode}
          testimonials={testimonials}
          stories={stories}
        />
      </div>
    </section>
  )
}
