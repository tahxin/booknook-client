import { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/private-route";
import { AddBookForm } from "@/components/books/add-book-form";

export const metadata: Metadata = {
  title: "BookNook | Add Book",
  description: "Add a new book to the BookNook shared shelf.",
};

export default function AddBookPage() {
  return (
    <PrivateRoute>
      <div className="flex-1 w-full">
        <AddBookForm />
      </div>
    </PrivateRoute>
  );
}
