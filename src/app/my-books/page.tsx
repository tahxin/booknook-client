import { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/private-route";
import { MyBooksView } from "@/components/books/my-books-view";

export const metadata: Metadata = {
  title: "BookNook | My Books",
  description: "View and manage the books you have added to BookNook.",
};

export default function MyBooksPage() {
  return (
    <PrivateRoute>
      <div className="flex-1 w-full">
        <MyBooksView />
      </div>
    </PrivateRoute>
  );
}
