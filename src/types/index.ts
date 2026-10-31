export type Category = "Fiction" | "Science" | "History" | "Kids" | "Others";

export const CATEGORIES: Category[] = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: Category;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
}

export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
}

export interface ApiErrorResponse {
  message: string;
  status?: number;
}
