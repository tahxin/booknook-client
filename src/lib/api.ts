import { Book, Borrow, Category } from "@/types";
import { authClient } from "./auth-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// Initial mock dataset for offline / client-first development
const INITIAL_BOOKS: Book[] = [
  {
    _id: "book-1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
    totalCopies: 5,
    availableCopies: 3,
    ownerName: "Sarah Jenkins",
    ownerEmail: "sarah@example.com",
    createdAt: "2026-10-25T10:00:00.000Z",
  },
  {
    _id: "book-2",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=600&auto=format&fit=crop&q=80",
    description: "A landmark volume in science writing by one of the great minds of our time, exploring black holes and time travel.",
    totalCopies: 4,
    availableCopies: 4,
    ownerName: "David Chen",
    ownerEmail: "david@example.com",
    createdAt: "2026-10-26T12:30:00.000Z",
  },
  {
    _id: "book-3",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    description: "A fascinating narrative of human creation and evolution that explores the ways biology and history have defined us.",
    totalCopies: 6,
    availableCopies: 2,
    ownerName: "Elena Rostova",
    ownerEmail: "elena@example.com",
    createdAt: "2026-10-27T09:15:00.000Z",
  },
  {
    _id: "book-4",
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    category: "Kids",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
    description: "A poetic tale illustrated with watercolors by the author, where a pilot stranded in the desert meets a young prince.",
    totalCopies: 3,
    availableCopies: 1,
    ownerName: "Marcus Bell",
    ownerEmail: "marcus@example.com",
    createdAt: "2026-10-28T14:20:00.000Z",
  },
  {
    _id: "book-5",
    title: "Cosmos",
    author: "Carl Sagan",
    category: "Science",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    description: "The story of cosmic evolution, science, and civilization in which Sagan retells fifteen billion years of cosmic history.",
    totalCopies: 4,
    availableCopies: 4,
    ownerName: "Sarah Jenkins",
    ownerEmail: "sarah@example.com",
    createdAt: "2026-10-29T16:00:00.000Z",
  },
  {
    _id: "book-6",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80",
    description: "A portrait of the Jazz Age that has been acclaimed by generations of readers, depicting Jay Gatsby's pursuit of Daisy.",
    totalCopies: 5,
    availableCopies: 0,
    ownerName: "David Chen",
    ownerEmail: "david@example.com",
    createdAt: "2026-10-30T11:45:00.000Z",
  },
];

// Helper to access fallback mock store in browser localStorage
function getMockBooks(): Book[] {
  if (typeof window === "undefined") return INITIAL_BOOKS;
  const stored = localStorage.getItem("booknook_mock_books");
  if (!stored) {
    localStorage.setItem("booknook_mock_books", JSON.stringify(INITIAL_BOOKS));
    return INITIAL_BOOKS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_BOOKS;
  }
}

function saveMockBooks(books: Book[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("booknook_mock_books", JSON.stringify(books));
  }
}

function getMockBorrows(): Borrow[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("booknook_mock_borrows");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveMockBorrows(borrows: Borrow[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("booknook_mock_borrows", JSON.stringify(borrows));
  }
}

// Token helper
async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  try {
    if (typeof window !== "undefined" && authClient?.token) {
      const token = await authClient.token();
      if (token?.data?.token) {
        headers["Authorization"] = `Bearer ${token.data.token}`;
      }
    }
  } catch {
    // Ignore token acquisition error in dev
  }
  return headers;
}

// Core API Methods

export interface GetBooksParams {
  sort?: "newest";
  limit?: number;
  category?: string;
  search?: string;
  ownerEmail?: string;
}

export async function getBooks(params?: GetBooksParams): Promise<Book[]> {
  const query = new URLSearchParams();
  if (params?.sort) query.set("sort", params.sort);
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.category && params.category !== "All")
    query.set("category", params.category);
  if (params?.search) query.set("search", params.search);
  if (params?.ownerEmail) query.set("ownerEmail", params.ownerEmail);

  try {
    const res = await fetch(`${API_BASE_URL}/books?${query.toString()}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline: use mock fallback
  }

  let list = [...getMockBooks()];
  if (params?.category && params.category !== "All") {
    list = list.filter(
      (b) => b.category.toLowerCase() === params.category!.toLowerCase()
    );
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    list = list.filter(
      (b) =>
        b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s)
    );
  }
  if (params?.ownerEmail) {
    list = list.filter((b) => b.ownerEmail === params.ownerEmail);
  }
  if (params?.sort === "newest") {
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  if (params?.limit) {
    list = list.slice(0, params.limit);
  }
  return list;
}

export async function getBook(id: string): Promise<Book> {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      headers,
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  const book = getMockBooks().find((b) => b._id === id);
  if (!book) {
    throw new ApiError("Book not found", 404);
  }
  return book;
}

export async function createBook(data: {
  title: string;
  author: string;
  category: Category;
  image: string;
  description: string;
  totalCopies: number;
}): Promise<Book> {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE_URL}/books`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  const session = await authClient.getSession();
  const newBook: Book = {
    _id: "book-" + Date.now(),
    title: data.title,
    author: data.author,
    category: data.category,
    image: data.image,
    description: data.description,
    totalCopies: data.totalCopies,
    availableCopies: data.totalCopies,
    ownerName: session?.data?.user?.name || "BookNook Reader",
    ownerEmail: session?.data?.user?.email || "reader@example.com",
    createdAt: new Date().toISOString(),
  };

  const list = getMockBooks();
  list.unshift(newBook);
  saveMockBooks(list);
  return newBook;
}

export async function updateBook(
  id: string,
  data: Partial<Pick<Book, "title" | "author" | "category" | "image" | "description" | "totalCopies">>
): Promise<Book> {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  const list = getMockBooks();
  const index = list.findIndex((b) => b._id === id);
  if (index === -1) throw new ApiError("Book not found", 404);

  const prev = list[index];
  const updated: Book = {
    ...prev,
    ...data,
    availableCopies:
      data.totalCopies !== undefined
        ? Math.max(0, data.totalCopies - (prev.totalCopies - prev.availableCopies))
        : prev.availableCopies,
  };
  list[index] = updated;
  saveMockBooks(list);
  return updated;
}

export async function deleteBook(id: string): Promise<{ success: boolean }> {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: "DELETE",
      headers,
    });
    if (res.ok) {
      return await res.json();
    }
    if (res.status === 409) {
      const err = await res.json();
      throw new ApiError(
        err.message || "This book has active borrows and cannot be deleted",
        409
      );
    }
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
  }

  const list = getMockBooks();
  const book = list.find((b) => b._id === id);
  if (!book) throw new ApiError("Book not found", 404);

  if (book.availableCopies < book.totalCopies) {
    throw new ApiError("This book has active borrows and cannot be deleted", 409);
  }

  saveMockBooks(list.filter((b) => b._id !== id));
  return { success: true };
}

export async function borrowBook(bookId: string): Promise<Borrow> {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE_URL}/borrows`, {
      method: "POST",
      headers,
      body: JSON.stringify({ bookId }),
    });
    if (res.ok) {
      return await res.json();
    }
    if (res.status === 409) {
      throw new ApiError("You have already borrowed this book", 409);
    }
    if (res.status === 400) {
      throw new ApiError("This book is currently not available", 400);
    }
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
  }

  const books = getMockBooks();
  const book = books.find((b) => b._id === bookId);
  if (!book) throw new ApiError("Book not found", 404);
  if (book.availableCopies <= 0) {
    throw new ApiError("This book is currently not available", 400);
  }

  const session = await authClient.getSession();
  const userEmail = session?.data?.user?.email || "reader@example.com";
  const userName = session?.data?.user?.name || "BookNook Reader";

  const borrows = getMockBorrows();
  if (borrows.some((b) => b.bookId === bookId && b.userEmail === userEmail)) {
    throw new ApiError("You have already borrowed this book", 409);
  }

  // Decrement copy
  book.availableCopies -= 1;
  saveMockBooks(books);

  const now = new Date();
  const returnDate = new Date();
  returnDate.setDate(now.getDate() + 14);

  const newBorrow: Borrow = {
    _id: "borrow-" + Date.now(),
    bookId,
    bookTitle: book.title,
    bookImage: book.image,
    userEmail,
    userName,
    borrowDate: now.toISOString(),
    returnDate: returnDate.toISOString(),
  };

  borrows.unshift(newBorrow);
  saveMockBorrows(borrows);
  return newBorrow;
}

export async function getMyBorrows(): Promise<Borrow[]> {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE_URL}/borrows`, {
      headers,
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  const session = await authClient.getSession();
  const userEmail = session?.data?.user?.email || "reader@example.com";
  return getMockBorrows().filter((b) => b.userEmail === userEmail);
}

export async function returnBook(borrowId: string): Promise<{ success: boolean }> {
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE_URL}/borrows/${borrowId}`, {
      method: "DELETE",
      headers,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  const borrows = getMockBorrows();
  const borrow = borrows.find((b) => b._id === borrowId);
  if (!borrow) throw new ApiError("Borrow record not found", 404);

  // Increment availableCopies
  const books = getMockBooks();
  const book = books.find((b) => b._id === borrow.bookId);
  if (book) {
    book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
    saveMockBooks(books);
  }

  saveMockBorrows(borrows.filter((b) => b._id !== borrowId));
  return { success: true };
}
