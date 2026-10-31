import { Suspense } from "react";
import { Metadata } from "next";
import { AllBooksView } from "@/components/books/all-books-view";
import { Spinner } from "@/components/common/spinner";

export const metadata: Metadata = {
  title: "BookNook | All Books",
  description:
    "Explore our complete collection of fiction, science, history, kids, and general interest books.",
};

export default function AllBooksPage() {
  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center">
            <Spinner label="Loading library collection..." />
          </div>
        }
      >
        <AllBooksView />
      </Suspense>
    </div>
  );
}
