import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type HeroSlide = {
  src: string;
  alt: string;
  label: string;
  title: string;
  accentTitle: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

type HeroSlideshowProps = {
  slides: HeroSlide[];
};

const AUTO_ADVANCE_MS = 5000;

export function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) {
    return null;
  }

  const activeSlide = slides[activeIndex];

  return (
    <div className="relative isolate overflow-hidden bg-velvet text-cream">
      {slides.map((slide, slideIndex) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ${
            slideIndex === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={slideIndex === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,11,11,0.86)_0%,rgba(11,11,11,0.72)_32%,rgba(11,11,11,0.36)_62%,rgba(11,11,11,0.58)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(123,30,58,0.35),transparent_36%)]" />
        </div>
      ))}

      <div className="relative mx-auto flex min-h-[560px] max-w-6xl items-center px-4 py-20 sm:min-h-[620px] sm:px-6 lg:min-h-[700px]">
        <div className="max-w-2xl">
          <p className="inline-flex rounded-full border border-gold/25 bg-gold/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-gold">
            {activeSlide.label}
          </p>
          <div className="mt-6 max-w-xl font-display text-5xl leading-[0.92] text-white sm:text-6xl lg:text-[5.1rem]">
            <span className="block">{activeSlide.title}</span>
            <span className="mt-2 block text-gold">{activeSlide.accentTitle}</span>
          </div>
          <p className="mt-6 max-w-xl text-lg leading-8 text-cream/84 sm:text-xl">
            {activeSlide.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={activeSlide.primaryHref}
              className="rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-[#e4c258]"
            >
              {activeSlide.primaryLabel}
            </Link>
            <Link
              href={activeSlide.secondaryHref}
              className="rounded-full border border-white/28 bg-black/10 px-7 py-3.5 text-sm font-semibold text-cream backdrop-blur-sm transition hover:border-gold/70 hover:text-gold"
            >
              {activeSlide.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() =>
              setActiveIndex((currentIndex) => (currentIndex - 1 + slides.length) % slides.length)
            }
            aria-label="Slide precedente"
            className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition hover:border-gold/60 hover:text-gold sm:left-6 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length)}
            aria-label="Slide suivante"
            className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition hover:border-gold/60 hover:text-gold sm:right-6 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveIndex(slideIndex)}
                aria-label={`Afficher la slide ${slideIndex + 1}`}
                className={`h-3 rounded-full transition-all ${
                  slideIndex === activeIndex
                    ? "w-10 bg-gold"
                    : "w-3 bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}

      <div className="pointer-events-none absolute inset-0 border border-white/6" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/20 to-transparent" />
    </div>
  );
}
