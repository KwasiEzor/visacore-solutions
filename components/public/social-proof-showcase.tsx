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
  buildVisiblePaginationIndices,
  buildStoryExcerpt,
  buildStoryReadTime,
  buildTestimonialExcerpt,
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
        scale: isActive ? 1 : 0.96,
        y: isActive ? 0 : 12,
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white/95 p-6 text-visacore-navy shadow-[0_35px_120px_-45px_rgba(10,37,64,0.65)] backdrop-blur-md sm:min-h-[24rem] sm:p-8 lg:min-h-[26rem] lg:p-10"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-visacore-gold/70 to-transparent" />
      <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-visacore-gold/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-visacore-gold sm:px-4 sm:text-xs sm:tracking-[0.26em]">
          <MessageSquare className="size-3.5 sm:size-4" />
          Témoignage
        </div>
        <Quote className="size-8 text-visacore-gold/20 sm:size-10" />
      </div>

      <p className="flex-1 text-lg font-medium leading-relaxed text-visacore-navy/82 sm:text-xl lg:text-[1.6rem]">
        &ldquo;{buildTestimonialExcerpt(item.content, 260)}&rdquo;
      </p>

      <div className="mt-6 flex items-center gap-1 sm:mt-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`size-4 sm:size-5 ${
              index < item.rating
                ? "fill-visacore-gold text-visacore-gold"
                : "text-gray-200"
            }`}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4 border-t border-visacore-navy/10 pt-5 sm:mt-8 sm:pt-6">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-visacore-navy text-base font-black text-visacore-gold sm:size-14 sm:text-lg">
          {item.clientName
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <p className="text-base font-black text-visacore-navy sm:text-lg">{item.clientName}</p>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-visacore-gold sm:text-sm">
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
        scale: isActive ? 1 : 0.96,
        y: isActive ? 0 : 12,
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-[30px] border border-white/12 bg-gradient-to-br from-visacore-navy via-visacore-navy-light to-[#102f50] p-6 text-white shadow-[0_35px_120px_-45px_rgba(10,37,64,0.75)] sm:min-h-[24rem] sm:p-8 lg:min-h-[26rem] lg:p-10"
    >
      <div className="absolute inset-0 bg-noise opacity-[0.06]" />
      <div className="absolute -right-20 -top-20 size-56 rounded-full bg-visacore-gold/15 blur-[90px]" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-visacore-gold/20 bg-visacore-gold/10 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-visacore-gold sm:px-4 sm:text-xs sm:tracking-[0.26em]">
            <Sparkles className="size-3.5 sm:size-4" />
            Success story
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 sm:text-xs">
            <Clock3 className="size-3.5" />
            {buildStoryReadTime(item.content)}
          </div>
        </div>

        <p className="text-xs font-black uppercase tracking-[0.24em] text-visacore-gold/90 sm:text-sm">
          {item.destination}
        </p>
        <h3 className="mt-4 text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
          {item.title}
        </h3>
        <p className="mt-5 flex-1 text-base leading-relaxed text-white/78 sm:mt-6 sm:text-lg">
          {buildStoryExcerpt(item.summary, item.content, 220)}
        </p>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-5 sm:mt-8 sm:gap-6 sm:pt-6">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/45 sm:text-sm">
              Client
            </p>
            <p className="mt-2 text-lg font-black text-white sm:text-xl">{item.clientName}</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 sm:px-4 sm:text-xs">
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
  const mobilePagination = buildVisiblePaginationIndices(
    items.length,
    selectedIndex,
    5
  )

  return (
    <div
      className="space-y-6 sm:space-y-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-visacore-gold sm:text-sm">
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
              <h3 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl md:text-4xl">
                {mode === "testimonials"
                  ? "Des voix réelles, des parcours validés."
                  : "Des trajectoires détaillées, pas des promesses vagues."}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/76 sm:mt-4 sm:text-base md:text-lg">
                {mode === "testimonials"
                  ? "Faites défiler des retours clients bruts, centrés sur la confiance, la préparation et la clarté du processus."
                  : "Chaque carte résume un parcours concret, la destination visée et la transformation obtenue avec l'accompagnement VisaCore."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden items-center gap-3 self-start md:flex md:self-auto">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-all hover:border-visacore-gold/40 hover:bg-visacore-gold hover:text-visacore-navy sm:size-12"
            aria-label="Voir l'élément précédent"
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-all hover:border-visacore-gold/40 hover:bg-visacore-gold hover:text-visacore-navy sm:size-12"
            aria-label="Voir l'élément suivant"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex lg:-ml-6">
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
                className="min-w-0 flex-[0_0_100%] lg:flex-[0_0_72%] lg:pl-6 xl:flex-[0_0_58%]"
              >
                <div
                  className={`transition-all duration-500 ${
                    visualDistance === 0
                      ? "opacity-100"
                      : visualDistance === 1
                        ? "opacity-75"
                        : "opacity-22"
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

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-visacore-gold via-visacore-gold-light to-visacore-gold"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.24em] text-white/58 sm:text-xs">
            <span className="shrink-0">
              {String(selectedIndex + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </span>
            <span className="hidden sm:inline">
              {isPaused ? "Pause" : "Défilement automatique"}
            </span>
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-all hover:border-visacore-gold/40 hover:bg-visacore-gold hover:text-visacore-navy"
                aria-label="Voir l'élément précédent"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-all hover:border-visacore-gold/40 hover:bg-visacore-gold hover:text-visacore-navy"
                aria-label="Voir l'élément suivant"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 md:hidden">
            {mobilePagination.map((index) => (
              <button
                key={items[index]?.id ?? index}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className={`rounded-full transition-all ${
                  selectedIndex === index
                    ? "h-2.5 w-8 bg-visacore-gold"
                    : "size-2.5 bg-white/28 hover:bg-white/50"
                }`}
                aria-label={`Aller à l'élément ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="hidden flex-wrap items-center gap-2 md:flex">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              className={`inline-flex min-w-9 items-center justify-center rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-[0.22em] transition-all ${
                selectedIndex === index
                  ? "bg-visacore-gold text-visacore-navy"
                  : "bg-white/8 text-white/60 hover:bg-white/12 hover:text-white"
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
    <section className="bg-visacore-navy py-16 text-white sm:py-20 lg:py-24">
      <div className="container-custom">
        <div className="mb-10 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-visacore-gold sm:text-sm">
              Témoignages & récits
            </p>
            <h2 className="mt-4 text-3xl font-black leading-[0.95] sm:text-4xl lg:text-5xl">
              Des preuves <span className="serif italic text-visacore-gold">vivantes</span>, pas des slogans.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/78 sm:text-base lg:text-lg">
              Faites défiler les avis clients et les histoires de réussite publiées depuis le back office,
              avec une lecture claire sur mobile comme sur desktop.
            </p>
          </div>

          <div className="grid w-full max-w-md grid-cols-1 gap-2 rounded-[28px] border border-white/10 bg-white/6 p-2 backdrop-blur-sm sm:inline-flex sm:w-auto sm:max-w-none sm:grid-cols-none sm:flex-wrap sm:rounded-full">
            {availableTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMode(tab.key)}
                className={`rounded-full px-4 py-3 text-left text-[13px] font-black uppercase tracking-[0.14em] transition-all sm:px-5 sm:text-center sm:text-sm sm:tracking-[0.2em] ${
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
