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

// Initial dataset matching the exact UI mockups with high-quality network images
export const INITIAL_BOOKS: Book[] = [
  {
    _id: "book-1",
    title: "Salt & Paper",
    author: "A. Rahman",
    category: "Fiction",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    description:
      "A quiet novel about two siblings who inherit a failing print shop and uncover letters tucked into its walls.",
    totalCopies: 5,
    availableCopies: 3,
    ownerName: "Shahjalal Ahmed Nishat",
    ownerEmail: "you@example.com",
    createdAt: "2026-10-26T10:00:00.000Z",
  },
  {
    _id: "book-2",
    title: "Small Machines",
    author: "L. Chen",
    category: "Science",
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80",
    description:
      "An exploration of cellular nanotechnology and the micro-scale mechanisms driving modern biological science.",
    totalCopies: 4,
    availableCopies: 4,
    ownerName: "Shahjalal Ahmed Nishat",
    ownerEmail: "you@example.com",
    createdAt: "2026-10-26T12:00:00.000Z",
  },
  {
    _id: "book-3",
    title: "The Delta Years",
    author: "S. Akter",
    category: "History",
    image:
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80",
    description:
      "A multi-generational historical account of riverbank settlements, agrarian reforms, and monsoon resilience.",
    totalCopies: 3,
    availableCopies: 2,
    ownerName: "Shahjalal Ahmed Nishat",
    ownerEmail: "you@example.com",
    createdAt: "2026-10-27T14:00:00.000Z",
  },
  {
    _id: "book-4",
    title: "Moon Library",
    author: "M. Noor",
    category: "Kids",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
    description:
      "An illustrated children's story about a lunar librarian who lends celestial tales to nocturnal dreamers.",
    totalCopies: 4,
    availableCopies: 1,
    ownerName: "David Chen",
    ownerEmail: "david@example.com",
    createdAt: "2026-10-28T09:00:00.000Z",
  },
  {
    _id: "book-5",
    title: "Field Notes",
    author: "T. Islam",
    category: "Others",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
    description:
      "Botanical sketches and field journals cataloging wetland flora, native bird migrations, and rural waterways.",
    totalCopies: 4,
    availableCopies: 4,
    ownerName: "Shahjalal Ahmed Nishat",
    ownerEmail: "you@example.com",
    createdAt: "2026-10-29T11:00:00.000Z",
  },
  {
    _id: "book-6",
    title: "Night Ferry",
    author: "R. Das",
    category: "Fiction",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=80",
    description:
      "Atmospheric noir set aboard the nocturnal river ferries traveling between river ports in southern Bengal.",
    totalCopies: 5,
    availableCopies: 3,
    ownerName: "David Chen",
    ownerEmail: "david@example.com",
    createdAt: "2026-10-30T16:00:00.000Z",
  },
];

const INITIAL_BORROWS: Borrow[] = [
  {
    _id: "borrow-1",
    bookId: "book-4",
    bookTitle: "Moon Library",
    bookImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
    userEmail: "you@example.com",
    userName: "Shahjalal Ahmed Nishat",
    borrowDate: "2026-10-28T10:00:00.000Z",
    returnDate: "2026-11-11T10:00:00.000Z",
  },
  {
    _id: "borrow-2",
    bookId: "book-5",
    bookTitle: "Field Notes",
    bookImage: "",
    userEmail: "you@example.com",
    userName: "Shahjalal Ahmed Nishat",
    borrowDate: "2026-10-29T10:00:00.000Z",
    returnDate: "2026-11-12T10:00:00.000Z",
  },
  {
    _id: "borrow-3",
    bookId: "book-6",
    bookTitle: "Night Ferry",
    bookImage: "",
    userEmail: "you@example.com",
    userName: "Shahjalal Ahmed Nishat",
    borrowDate: "2026-10-30T10:00:00.000Z",
    returnDate: "2026-11-13T10:00:00.000Z",
  },
];

function getMockBooks(): Book[] {
  if (typeof window === "undefined") return INITIAL_BOOKS;
  const stored = localStorage.getItem("booknook_mock_books_v2");
  if (!stored) {
    localStorage.setItem("booknook_mock_books_v2", JSON.stringify(INITIAL_BOOKS));
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
    localStorage.setItem("booknook_mock_books_v2", JSON.stringify(books));
  }
}

function getMockBorrows(): Borrow[] {
  if (typeof window === "undefined") return INITIAL_BORROWS;
  const stored = localStorage.getItem("booknook_mock_borrows_v2");
  if (!stored) {
    localStorage.setItem("booknook_mock_borrows_v2", JSON.stringify(INITIAL_BORROWS));
    return INITIAL_BORROWS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_BORROWS;
  }
}

function saveMockBorrows(borrows: Borrow[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("booknook_mock_borrows_v2", JSON.stringify(borrows));
  }
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getJwtToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now) {
    return cachedToken;
  }
  try {
    const res = await fetch("/api/auth/token", {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.token) {
        cachedToken = data.token;
        tokenExpiresAt = now + 5 * 60 * 1000;
        return cachedToken;
      }
    }
  } catch (err) {
    console.warn("Could not fetch JWT token from /api/auth/token:", err);
  }
  return null;
}

export function clearTokenCache() {
  cachedToken = null;
  tokenExpiresAt = 0;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = await getJwtToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

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
    // Only fall back to local mock when backend is completely offline
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
  let networkFailed = false;

  try {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      headers,
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
    if (res.status === 404) {
      throw new ApiError("Book not found", 404);
    }
    if (res.status === 401) {
      throw new ApiError("Please log in to view book details", 401);
    }
    const errData = await res.json().catch(() => null);
    throw new ApiError(errData?.message || "Failed to load book", res.status);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    networkFailed = true;
  }

  if (networkFailed) {
    const book = getMockBooks().find((b) => b._id === id);
    if (!book) {
      throw new ApiError("Book not found", 404);
    }
    return book;
  }

  throw new ApiError("Book not found", 404);
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
  let networkFailed = false;

  try {
    const res = await fetch(`${API_BASE_URL}/books`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const created: Book = await res.json();
      return created;
    }
    const errData = await res.json().catch(() => null);
    throw new ApiError(
      errData?.message || `Failed to add book (${res.status})`,
      res.status
    );
  } catch (err) {
    if (err instanceof ApiError) throw err;
    networkFailed = true;
  }

  if (networkFailed) {
    console.warn("Backend server unreachable, writing to local mock storage");
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
      ownerName: session?.data?.user?.name || "Shahjalal Ahmed Nishat",
      ownerEmail: session?.data?.user?.email || "you@example.com",
      createdAt: new Date().toISOString(),
    };

    const list = getMockBooks();
    list.unshift(newBook);
    saveMockBooks(list);
    return newBook;
  }

  throw new ApiError("Failed to add book", 500);
}

export async function updateBook(
  id: string,
  data: Partial<
    Pick<
      Book,
      | "title"
      | "author"
      | "category"
      | "image"
      | "description"
      | "totalCopies"
    >
  >
): Promise<Book> {
  const headers = await getAuthHeaders();
  let networkFailed = false;

  try {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => null);
    throw new ApiError(
      errData?.message || `Failed to update book (${res.status})`,
      res.status
    );
  } catch (err) {
    if (err instanceof ApiError) throw err;
    networkFailed = true;
  }

  if (networkFailed) {
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

  throw new ApiError("Failed to update book", 500);
}

export async function deleteBook(id: string): Promise<{ success: boolean }> {
  const headers = await getAuthHeaders();
  let networkFailed = false;

  try {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: "DELETE",
      headers,
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => null);
    throw new ApiError(
      errData?.message || `Failed to delete book (${res.status})`,
      res.status
    );
  } catch (err) {
    if (err instanceof ApiError) throw err;
    networkFailed = true;
  }

  if (networkFailed) {
    const list = getMockBooks();
    const book = list.find((b) => b._id === id);
    if (!book) throw new ApiError("Book not found", 404);

    if (book.availableCopies < book.totalCopies) {
      throw new ApiError("This book has active borrows and cannot be deleted", 409);
    }

    saveMockBooks(list.filter((b) => b._id !== id));
    return { success: true };
  }

  throw new ApiError("Failed to delete book", 500);
}

export async function borrowBook(bookId: string): Promise<Borrow> {
  const headers = await getAuthHeaders();
  let networkFailed = false;

  try {
    const res = await fetch(`${API_BASE_URL}/borrows`, {
      method: "POST",
      headers,
      body: JSON.stringify({ bookId }),
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => null);
    throw new ApiError(
      errData?.message || `Failed to borrow book (${res.status})`,
      res.status
    );
  } catch (err) {
    if (err instanceof ApiError) throw err;
    networkFailed = true;
  }

  if (networkFailed) {
    const books = getMockBooks();
    const book = books.find((b) => b._id === bookId);
    if (!book) throw new ApiError("Book not found", 404);
    if (book.availableCopies <= 0) {
      throw new ApiError("This book is currently not available", 400);
    }

    const session = await authClient.getSession();
    const userEmail = session?.data?.user?.email || "you@example.com";
    const userName = session?.data?.user?.name || "Shahjalal Ahmed Nishat";

    const borrows = getMockBorrows();
    if (borrows.some((b) => b.bookId === bookId && b.userEmail === userEmail)) {
      throw new ApiError("You have already borrowed this book", 409);
    }

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

  throw new ApiError("Failed to borrow book", 500);
}

export async function getMyBorrows(): Promise<Borrow[]> {
  const headers = await getAuthHeaders();
  let networkFailed = false;

  try {
    const res = await fetch(`${API_BASE_URL}/borrows`, {
      headers,
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => null);
    throw new ApiError(
      errData?.message || `Failed to load borrows (${res.status})`,
      res.status
    );
  } catch (err) {
    if (err instanceof ApiError) throw err;
    networkFailed = true;
  }

  if (networkFailed) {
    const session = await authClient.getSession();
    const userEmail = session?.data?.user?.email || "you@example.com";
    return getMockBorrows().filter((b) => b.userEmail === userEmail);
  }

  return [];
}

export async function returnBook(borrowId: string): Promise<{ success: boolean }> {
  const headers = await getAuthHeaders();
  let networkFailed = false;

  try {
    const res = await fetch(`${API_BASE_URL}/borrows/${borrowId}`, {
      method: "DELETE",
      headers,
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => null);
    throw new ApiError(
      errData?.message || `Failed to return book (${res.status})`,
      res.status
    );
  } catch (err) {
    if (err instanceof ApiError) throw err;
    networkFailed = true;
  }

  if (networkFailed) {
    const borrows = getMockBorrows();
    const borrow = borrows.find((b) => b._id === borrowId);
    if (!borrow) throw new ApiError("Borrow record not found", 404);

    const books = getMockBooks();
    const book = books.find((b) => b._id === borrow.bookId);
    if (book) {
      book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
      saveMockBooks(books);
    }

    saveMockBorrows(borrows.filter((b) => b._id !== borrowId));
    return { success: true };
  }

  throw new ApiError("Failed to return book", 500);
}
