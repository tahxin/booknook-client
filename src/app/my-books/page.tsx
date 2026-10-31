import { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/private-route";
import { MyBooksView } from "@/components/books/my-books-view";

export const metadata: Metadata = {
  title: "BookNook | My Books",
  description: "View and manage books you have contributed to the BookNook catalog.",
};

export default function MyBooksPage() {
  return (
    <PrivateRoute>
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <MyBooksView />
      </div>
    </PrivateRoute>
  );
}
