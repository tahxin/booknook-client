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

export default async function BookDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <PrivateRoute>
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <Spinner size="lg" label="Loading book details..." />
            </div>
          }
        >
          <BookDetailsView id={id} />
        </Suspense>
      </div>
    </PrivateRoute>
  );
}
