# BookNook — A Small Online Library

> *"Add a book, borrow a book, return a book."*

Welcome to **BookNook**, a minimal, community-driven online library platform. BookNook allows readers to browse shared books, contribute titles from their personal collections, borrow books for up to 14 days with real-time copy tracking, and return them seamlessly with one click.

---

## 🌐 Live Website

- **Production Client URL**: `https://booknook-client.vercel.app` *(update with your live Vercel URL upon deployment)*
- **Backend API URL**: `https://booknook-server.vercel.app` *(update with your live Vercel backend URL)*

---

## ✨ Key Features

1. **Authentication & Authorization**:
   - Integrated with **BetterAuth** supporting Email/Password and Google OAuth.
   - Real-time client-side password verification rules (uppercase, lowercase, minimum 6 characters).
   - **Smart Redirection**: Redirects back to the origin page when prompted to log in (e.g. from `/books/[id]`, `/add-book`, etc.) or to the homepage (`/`) upon direct login or register.
   - Cross-form redirect parameter preservation between Login and Register views.
   - Secure JWT token generation for protected backend API requests.
   - Route protection with zero redirect flickering on page refresh for authenticated readers.

2. **Full CRUD Book Management**:
   - Readers can add books with title, author, category, total copies, cover image, and description.
   - Direct image uploads to **ImgBB** with live preview and hash-based fallback cover palettes.
   - Edit book details with prefilled values.
   - Safe book deletion protected by custom confirmation dialogs and active-borrow verification (deletions are blocked if copies are currently borrowed).

3. **Intelligent Borrow & Return System**:
   - One-click borrow modal with read-only borrower credentials and 14-day return date estimation.
   - Real-time copy tracking: decrement copies on borrow and restore on return.
   - **No Double Borrow**: Prevents borrowing the same book twice simultaneously.
   - "Not Available" badge and disabled buttons when copies reach zero.

4. **Curated Reading Experience**:
   - **Hero Banner Slider** built with Swiper.js, auto-play pause-on-hover, and custom bar pagination.
   - **Dynamic New Arrivals** showcasing the newest catalog additions.
   - **Top Categories** bento grid (Fiction, Science, History, Kids, Others).
   - **Interactive All Books Catalog** with debounced instant search and filter pills.

5. **Design System & Polish**:
   - Once UI-inspired "reading room at night" aesthetic: Charcoal surfaces (`#0e0e10`), amber lamplight accent (`#f5b942`), and warm paper light mode (`#faf8f4`).
   - Seamless dark/light theme toggle via `next-themes`.
   - Rich notifications powered by `sonner` toasts (no browser `alert()`, `confirm()`, or `prompt()`).
   - Rebranded modern X social icon and custom 404 page with "Back to Home" navigation.
   - Fully responsive design crafted for mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

| Area | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling & UI** | Tailwind CSS v4, shadcn/ui, Radix / Base UI |
| **Icons** | Lucide React + custom inline SVGs |
| **Auth** | BetterAuth (MongoDB Adapter & JWT Plugin) |
| **Slider** | Swiper.js |
| **Theming** | next-themes |
| **Notifications** | Sonner |
| **Image Hosting** | ImgBB API |
| **Forms & Validation** | React Hook Form & Zod |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.18+ or 20+
- MongoDB database (local or MongoDB Atlas)

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd booknook-client

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and populate your secrets:
```bash
cp .env.example .env.local
```

Key environment variables:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/booknook?retryWrites=true&w=majority
BETTER_AUTH_SECRET=your_better_auth_secret_32_characters_minimum
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
NEXT_PUBLIC_IMGBB_KEY=your_imgbb_api_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx            # Home page (Hero, New Arrivals, How it works, Categories)
│   │   ├── books/page.tsx      # All books catalog with search & filters
│   │   ├── login/page.tsx      # Login form & social authentication
│   │   └── register/page.tsx   # Register form with password checklist
│   ├── (private)/
│   │   ├── books/[id]/page.tsx # Book details & borrow modal
│   │   ├── add-book/page.tsx   # Add book form with ImgBB upload
│   │   ├── my-books/page.tsx   # User books table (edit/delete)
│   │   ├── my-borrows/page.tsx # Borrowed books table with return action
│   │   └── profile/page.tsx    # User profile & photo update
│   ├── api/auth/[...all]/      # BetterAuth Next.js route handler
│   ├── globals.css             # Design tokens & dark/light theme CSS variables
│   ├── layout.tsx              # Root layout with ThemeProvider, Navbar, Footer & Toaster
│   ├── loading.tsx             # Global loading state
│   └── not-found.tsx           # Custom 404 page
├── components/
│   ├── auth/                   # PrivateRoute, PasswordChecklist, GoogleButton
│   ├── books/                  # BookCard, BookDetails, BorrowDialog, EditDialog, DeleteDialog
│   ├── common/                 # BookCover, Spinner, SocialIcons, XIcon
│   ├── home/                   # HeroSlider, NewArrivals, HowItWorks, Categories
│   ├── layout/                 # Navbar, Footer, ThemeToggle
│   └── ui/                     # shadcn UI components
├── lib/
│   ├── api.ts                  # Typed API fetch wrapper with JWT injection & fallback
│   ├── auth.ts                 # BetterAuth server instance
│   ├── auth-client.ts          # BetterAuth client instance with JWT plugin
│   ├── imgbb.ts                # Image upload handler
│   ├── mongodb.ts              # Cached MongoDB connection promise
│   └── utils.ts                # Styling utilities (cn)
└── types/                      # TypeScript definitions (Book, Borrow, Category)
```

---

## 📜 License & Acknowledgements

Created for the BookNook community library assignment. Built with Next.js, shadcn/ui, and BetterAuth.
