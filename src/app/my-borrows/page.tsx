import { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/private-route";
import { MyBorrowsView } from "@/components/books/my-borrows-view";

export const metadata: Metadata = {
  title: "BookNook | My Borrows",
  description: "Track and manage your borrowed books on BookNook.",
};

export default function MyBorrowsPage() {
  return (
    <PrivateRoute>
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <MyBorrowsView />
      </div>
    </PrivateRoute>
  );
}
