"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export function HeroSlider() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const slides = [
    {
      id: 1,
      badge: "Add a book, borrow a book, return a book",
      title: "A small library for\ncurious readers",
      description:
        "Browse what others shared, borrow for a few days, and pass on your own favorites.",
      primaryAction: { label: "Browse Books", href: "/books" },
      secondaryAction: { label: "Add a Book", href: "/add-book" },
    },
    {
      id: 2,
      badge: "Community-driven borrowing",
      title: "Share a book, make\nsomeone's week",
      description:
        "Have books resting on your shelf? Put them in the shared catalog and let others read them.",
      primaryAction: { label: "Browse Books", href: "/books" },
      secondaryAction: { label: "Add a Book", href: "/add-book" },
    },
    {
      id: 3,
      badge: "Simple and transparent",
      title: "Borrow today, return\nwhen you are done",
      description:
        "Check out up to 14 days with real-time copy tracking and instant one-click returns.",
      primaryAction: { label: "Browse Books", href: "/books" },
      secondaryAction: { label: "Add a Book", href: "/add-book" },
    },
  ];

  if (!mounted) {
    const slide = slides[0];
    return (
      <div className="relative w-full rounded-3xl border border-border/80 bg-card/90 hero-dotted-grid p-8 sm:p-12 md:p-16 overflow-hidden">
        <div className="w-full relative pb-8">
          <div className="max-w-2xl flex flex-col items-start gap-6 select-none">
            <div className="rounded-full px-3.5 py-1 text-xs text-muted-foreground border border-border/80 bg-background/40">
              {slide.badge}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.08] whitespace-pre-line text-left">
              {slide.title}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl text-left">
              {slide.description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href={slide.primaryAction.href}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                )}
              >
                {slide.primaryAction.label}
              </Link>
              <Link
                href={slide.secondaryAction.href}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-6 rounded-xl border-border bg-card/60 hover:bg-muted font-medium text-foreground"
                )}
              >
                {slide.secondaryAction.label}
              </Link>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2">
            <span className="w-8 h-1 rounded-full bg-[#f5b942]" />
            <span className="w-4 h-1 rounded-full bg-muted-foreground/30" />
            <span className="w-4 h-1 rounded-full bg-muted-foreground/30" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-3xl border border-border/80 bg-card/90 hero-dotted-grid p-8 sm:p-12 md:p-16 overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          renderBullet: function (_index, className) {
            return `<span class="${className} hero-bullet"></span>`;
          },
        }}
        className="w-full relative pb-8"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="max-w-2xl flex flex-col items-start gap-6 select-none">
              {/* Top pill */}
              <div className="rounded-full px-3.5 py-1 text-xs text-muted-foreground border border-border/80 bg-background/40">
                {slide.badge}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.08] whitespace-pre-line text-left">
                {slide.title}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl text-left">
                {slide.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={slide.primaryAction.href}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                  )}
                >
                  {slide.primaryAction.label}
                </Link>

                <Link
                  href={slide.secondaryAction.href}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 px-6 rounded-xl border-border bg-card/60 hover:bg-muted font-medium text-foreground"
                  )}
                >
                  {slide.secondaryAction.label}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination {
          position: relative !important;
          margin-top: 2rem !important;
          text-align: left !important;
        }
        .hero-bullet {
          display: inline-block;
          width: 16px;
          height: 4px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.2);
          margin-right: 8px !important;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        :root:not(.dark) .hero-bullet {
          background: rgba(0, 0, 0, 0.2);
        }
        .swiper-pagination-bullet-active.hero-bullet {
          width: 32px;
          background: #f5b942 !important;
        }
      `}</style>
    </div>
  );
}
