"use client";

import React, { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/effect-fade";

const SLIDES = [
  {
    id: "shelf",
    label: "The shelf",
    note: "Public, no account needed",
    title: "A small library for\ncurious readers.",
    description:
      "Browse what others shared, borrow for a few days, and pass on your own favourites.",
  },
  {
    id: "add",
    label: "Adding a book",
    note: "Two minutes, one form",
    title: "Share a book,\nmake someone's week.",
    description:
      "Have titles resting on your shelf? Put them in the shared catalogue and let others read them.",
  },
  {
    id: "borrow",
    label: "Keeping track",
    note: "Live copy counts",
    title: "Borrow today.\nReturn when you're done.",
    description:
      "Fourteen days per loan, with real-time availability and a one-click return.",
  },
];

export function HeroSlider() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const progress = ((active + 1) / SLIDES.length) * 100;

  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-7">
          {mounted ? (
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              speed={520}
              autoplay={{
                delay: 6500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onRealIndexChange={(swiper) => setActive(swiper.realIndex)}
              className="w-full min-w-0"
            >
              {SLIDES.map((slide, index) => {
                const Heading = index === 0 ? "h1" : "p";
                return (
                  <SwiperSlide key={slide.id}>
                    <div>
                      <Heading className="font-display text-[clamp(2.6rem,6.4vw,4.6rem)] leading-[0.94] tracking-[-0.035em] text-foreground whitespace-pre-line">
                        {slide.title}
                      </Heading>
                      <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
                        {slide.description}
                      </p>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <div>
              <h1 className="font-display text-[clamp(2.6rem,6.4vw,4.6rem)] leading-[0.94] tracking-[-0.035em] text-foreground whitespace-pre-line">
                {SLIDES[0].title}
              </h1>
              <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
                {SLIDES[0].description}
              </p>
            </div>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/books"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Browse books
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/add-book"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Add a book
            </Link>
          </div>

          <p className="label-mono mt-10 text-muted-foreground">
            Fourteen days per loan · live copy counts
          </p>
        </div>

        <div className="min-w-0 lg:col-span-5 lg:border-l lg:border-border lg:pl-12">
          <div className="flex items-center justify-between">
            <p className="label-mono text-muted-foreground">Contents</p>
            <p className="label-mono text-muted-foreground" data-numeric>
              0{active + 1} / 0{SLIDES.length}
            </p>
          </div>

          <ol className="mt-4 border-t border-border">
            {SLIDES.map((slide, index) => {
              const isActive = index === active;
              return (
                <li key={slide.id}>
                  <button
                    type="button"
                    onClick={() => swiperRef.current?.slideTo(index)}
                    aria-current={isActive ? "true" : undefined}
                    className="group grid w-full grid-cols-[1.5rem_1fr_auto] items-baseline gap-4 border-b border-border py-5 text-left"
                  >
                    <span className="label-mono text-muted-foreground">
                      0{index + 1}
                    </span>
                    <span>
                      <span
                        className={cn(
                          "block font-display text-[1.25rem] leading-tight tracking-[-0.01em] transition-colors sm:text-[1.375rem]",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        {isActive ? (
                          <span className="mark">{slide.label}</span>
                        ) : (
                          slide.label
                        )}
                      </span>
                      <span className="mt-1 block text-[12px] text-muted-foreground">
                        {slide.note}
                      </span>
                    </span>
                    <ArrowRight
                      className={cn(
                        "h-4 w-4 transition-all duration-200",
                        isActive
                          ? "translate-x-0 text-primary"
                          : "-translate-x-1 text-muted-foreground opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 h-px w-full bg-border">
            <div
              className="h-px bg-foreground transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
