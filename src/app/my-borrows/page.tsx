import { Metadata } from "next";
import { PrivateRoute } from "@/components/auth/private-route";
import { MyBorrowsView } from "@/components/books/my-borrows-view";

export const metadata: Metadata = {
  title: "BookNook | My Borrows",
  description: "Track and return the books you have borrowed from BookNook.",
};

export default function MyBorrowsPage() {
  return (
    <PrivateRoute>
      <div className="flex-1 w-full">
        <MyBorrowsView />
      </div>
    </PrivateRoute>
  );
}
