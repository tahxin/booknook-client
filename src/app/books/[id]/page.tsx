import { Suspense } from "react";
import { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/private-route";
import { BookDetailsView } from "@/components/books/book-details-view";
import { Spinner } from "@/components/common/spinner";

export const metadata: Metadata = {
  title: "BookNook | Book Details",
  description: "View copies, description, and borrow this book on BookNook.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * The route param is read inside a Suspense boundary so a client navigation
 * can paint immediately instead of waiting on the dynamic segment.
 */
export default function BookDetailsPage({ params }: PageProps) {
  return (
    <PrivateRoute>
      <div className="flex-1 w-full">
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center">
              <Spinner size="lg" label="Fetching the catalogue entry" />
            </div>
          }
        >
          <BookDetailsEntry params={params} />
        </Suspense>
      </div>
    </PrivateRoute>
  );
}

async function BookDetailsEntry({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <BookDetailsView id={id} />
    </div>
  );
}
