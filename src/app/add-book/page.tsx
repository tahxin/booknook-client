import { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/private-route";
import { AddBookForm } from "@/components/books/add-book-form";

export const metadata: Metadata = {
  title: "BookNook | Add Book",
  description: "Add a new book to the BookNook community library catalog.",
};

export default function AddBookPage() {
  return (
    <PrivateRoute>
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <AddBookForm />
      </div>
    </PrivateRoute>
  );
}

