import { Metadata } from "next";
import { HeroSlider } from "@/components/home/hero-slider";
import { NewArrivals } from "@/components/home/new-arrivals";
import { HowItWorks } from "@/components/home/how-it-works";
import { Categories } from "@/components/home/categories";
import { ClosingNote } from "@/components/home/closing-note";
import { FadeIn } from "@/components/common/motion-wrapper";

export const metadata: Metadata = {
  title: "BookNook | Home",
  description:
    "A small online library. Add a book, borrow a book, return a book. Browse what others shared, borrow for fourteen days, and pass on your own favourites.",
};

export default function HomePage() {
  return (
    <div className="flex-1 w-full">
      <HeroSlider />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="space-y-20 py-16 sm:py-20">
          <FadeIn>
            <NewArrivals />
          </FadeIn>
          <FadeIn>
            <HowItWorks />
          </FadeIn>
          <FadeIn>
            <Categories />
          </FadeIn>
        </div>
      </div>

      <ClosingNote />
    </div>
  );
}
