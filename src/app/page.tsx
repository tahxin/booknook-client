import { Metadata } from "next";
import { HeroSlider } from "@/components/home/hero-slider";
import { NewArrivals } from "@/components/home/new-arrivals";
import { HowItWorks } from "@/components/home/how-it-works";
import { Categories } from "@/components/home/categories";
import { FadeIn } from "@/components/common/motion-wrapper";

export const metadata: Metadata = {
  title: "BookNook | Home",
  description:
    "A small online library. Add a book, borrow a book, return a book. Free and accessible community borrowing.",
};

export default function HomePage() {
  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-16 sm:space-y-24">
      <FadeIn delay={0.1}>
        <HeroSlider />
      </FadeIn>
      <FadeIn delay={0.2}>
        <NewArrivals />
      </FadeIn>
      <FadeIn delay={0.25}>
        <HowItWorks />
      </FadeIn>
      <FadeIn delay={0.3}>
        <Categories />
      </FadeIn>
    </div>
  );
}
