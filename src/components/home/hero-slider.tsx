"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { ArrowRight, BookOpen, Sparkles, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export function HeroSlider() {
  const slides = [
    {
      id: 1,
      chip: "COMMUNITY ARCHIVE",
      icon: BookOpen,
      title: "A small library for curious readers",
      description:
        "Borrow hand-curated classics, deep scientific treatises, and everyday stories. No late fees, no clutter, just thoughtful reading.",
      primaryAction: { label: "Browse Books", href: "/books" },
      secondaryAction: { label: "How It Works", href: "#how-it-works" },
    },
    {
      id: 2,
      chip: "SHARE & CONTRIBUTE",
      icon: Sparkles,
      title: "Share a book, make someone's week",
      description:
        "Have books resting on your shelf? Add them to BookNook and let fellow bibliophiles borrow and cherish them with full tracking.",
      primaryAction: { label: "Add to Catalog", href: "/add-book" },
      secondaryAction: { label: "View Collection", href: "/books" },
    },
    {
      id: 3,
      chip: "SEAMLESS CIRCULATION",
      icon: RefreshCw,
      title: "Borrow today, return when you are done",
      description:
        "Check out up to 14 days with real-time copy tracking and instant one-click returns. Simple library science made effortless.",
      primaryAction: { label: "Explore Books", href: "/books" },
      secondaryAction: { label: "My Borrowed Books", href: "/my-borrows" },
    },
  ];

  return (
    <div className="relative w-full rounded-3xl border border-border bg-card/60 backdrop-blur-sm hero-dotted-grid p-6 sm:p-10 md:p-16 overflow-hidden shadow-sm">
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
            return `<span class="${className} custom-bullet"></span>`;
          },
        }}
        className="w-full relative pb-10"
      >
        {slides.map((slide) => {
          const Icon = slide.icon;
          return (
            <SwiperSlide key={slide.id}>
              <div className="max-w-3xl flex flex-col items-start gap-6 select-none">
                <Badge
                  variant="outline"
                  className="rounded-full px-3.5 py-1 text-xs font-semibold tracking-wider text-primary border-primary/30 bg-primary/10 flex items-center gap-1.5"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{slide.chip}</span>
                </Badge>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.08] text-foreground text-left">
                  {slide.title}
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl text-left">
                  {slide.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={slide.primaryAction.href}
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium flex items-center gap-2"
                    )}
                  >
                    <span>{slide.primaryAction.label}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href={slide.secondaryAction.href}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-11 px-6 rounded-xl border-border hover:bg-muted font-medium"
                    )}
                  >
                    {slide.secondaryAction.label}
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination {
          position: relative !important;
          margin-top: 2rem !important;
          text-align: left !important;
        }
        .custom-bullet {
          display: inline-block;
          width: 24px;
          height: 4px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.2);
          margin-right: 8px !important;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        :root:not(.dark) .custom-bullet {
          background: rgba(0, 0, 0, 0.2);
        }
        .swiper-pagination-bullet-active.custom-bullet {
          width: 48px;
          background: var(--primary) !important;
        }
      `}</style>
    </div>
  );
}
