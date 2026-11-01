import { Suspense } from "react";
import { Metadata } from "next";
import { AllBooksView } from "@/components/books/all-books-view";
import { Spinner } from "@/components/common/spinner";

export const metadata: Metadata = {
  title: "BookNook | All Books",
  description:
    "Every book currently on the BookNook shelf, filterable by category and searchable by title or author.",
};

export default function AllBooksPage() {
  return (
    <div className="flex-1 w-full">
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            <Spinner label="Loading the catalogue" />
          </div>
        }
      >
        <AllBooksView />
      </Suspense>
    </div>
  );
}
