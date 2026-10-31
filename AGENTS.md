# AGENTS.md — BookNook (client)

This file is the single source of truth for any AI coding agent working on the **BookNook client**. Read all of it before writing code. Follow it literally; if something is marked `TODO(owner)`, ask the owner instead of guessing.

> The backend lives in a **separate project/repo**. This repo is the Next.js client only. Section 9 documents the backend contract so the client can be built against it.

---

## 1. Product

**BookNook** is a small online library. Slogan: *"Add a book, borrow a book, return a book."*

Users can browse all books (public), add books, borrow a book for a few days, see their borrowed books, and return them. Users can also edit and delete the books they added.

### Hard rules from the assignment (never break these)
- No Lorem Ipsum anywhere. Write real copy.
- **Never** use `alert()`, `confirm()` or `prompt()`. Use toasts (Sonner) and a custom modal (shadcn `Dialog`/`AlertDialog`).
- Every success and error message is a toast, or an inline form error.
- Show a loading spinner while any data is loading.
- Reloading on **any** route must not error. A logged-in user reloading a private route must **not** be sent to Login (wait for the session to resolve before deciding).
- Custom 404 page with a "Back to Home" button.
- Page title changes per route: `BookNook | All Books`, `BookNook | Add Book`, etc.
- Navbar and Footer appear on every page.
- Use the new **X logo** (not the Twitter bird) in the footer social links.
- Fully responsive: mobile, tablet, desktop.
- Cards in a grid must be equal width and equal height; images uniform.
- Same button style everywhere; same section-heading style everywhere.
- Single-page-app feel; deployable on Vercel (client).

---

## 2. Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| UI | **shadcn/ui** + Tailwind CSS (use the components system; do not hand-roll what shadcn provides) |
| Icons | `lucide-react` (plus an inline SVG for the X logo) |
| Auth | **BetterAuth** with the **MongoDB adapter**, inside Next.js |
| Token for backend | BetterAuth **JWT plugin** (see section 7) |
| Slider | Swiper.js |
| Animation (optional bonus) | Framer Motion |
| Theme | `next-themes` (dark / light toggle in Navbar) |
| Toasts | shadcn `sonner` |
| Image upload | imgbb (client-side upload, store the returned URL) |
| Data fetching | `fetch` wrapped in `lib/api.ts` (no axios needed) |
| Forms | `react-hook-form` + `zod` via shadcn `Form` (optional but preferred) |

---

## 3. Project setup (do in this order)

```bash
npx create-next-app@latest booknook-client --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd booknook-client
npx shadcn@latest init
npx shadcn@latest add button card input label textarea select dialog alert-dialog dropdown-menu table badge avatar sonner skeleton separator form sheet
npm i better-auth mongodb swiper framer-motion next-themes lucide-react react-hook-form zod @hookform/resolvers
```

- Choose the **Neutral** base color during `shadcn init`, then override tokens as in section 4.
- Use the shadcn CLI for every new component (`npx shadcn@latest add ...`). Do not copy components from memory.
- Check the installed Next.js version's docs for route protection naming (`middleware.ts` vs `proxy.ts` in newer versions) and use whichever applies.

### Environment variables (`.env.local`, never commit)
```
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_IMGBB_KEY=
```
Commit a `.env.example` with the same keys and empty values.

---

## 4. Design system

**Aesthetic:** Once UI–inspired. Calm, minimal, dark-first, hairline borders, large radii, generous whitespace, one warm accent. Think "reading room at night": charcoal surfaces, amber lamplight accent. Light theme is warm paper.

### Tokens (put in `src/app/globals.css`; keep the variable names shadcn generated, change the values)

| Token | Dark | Light |
|---|---|---|
| `--background` | `#0e0e10` | `#faf8f4` |
| `--card` / `--popover` | `#16161a` | `#ffffff` |
| `--foreground` | `#f4f4f5` | `#18181b` |
| `--muted-foreground` | `#a1a1aa` | `#52525b` |
| `--border` / `--input` | `rgba(255,255,255,.10)` | `rgba(0,0,0,.10)` |
| `--primary` (amber) | `#f5b942` | `#f5b942` |
| `--primary-foreground` | `#1a1303` | `#1a1303` |
| `--ring` | `#f5b942` | `#d9930d` |
| `--destructive` | `#f87171` | `#dc2626` |
| `--radius` | `1rem` | `1rem` |

- Amber **text** on light backgrounds must use a darker amber (`#8a5600`) for contrast. Amber is a fill for buttons/highlights on light.
- Primary button text is always `--primary-foreground` (dark), never white.
- Font: **Geist** via `next/font/google` (fallback Inter, system-ui).
- Headings: section titles (`h2`) are always `text-3xl font-semibold tracking-tight`. Hero `h1` is `text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]`.
- Body text: `text-muted-foreground` for secondary copy, `leading-relaxed`.
- Page container: `max-w-6xl mx-auto px-6`.
- Cards: shadcn `Card`, `rounded-2xl`, 1px border, no heavy shadows. Hover: border brightens, `-translate-y-0.5` transition.
- Buttons: shadcn `Button`, `h-11`, `rounded-xl`. Variants: `default` (amber fill), `outline` (hairline border). Destructive actions use outline with red text, then a solid red button inside the confirm dialog.
- Chips (category / step number): `Badge variant="outline"` pill.
- Focus: amber ring on all inputs and buttons.
- Minimum touch target 44px.
- No emojis in the UI. Icons from lucide only.

### Reusable decorative pattern
Hero panel background: a dotted grid, `radial-gradient(rgba(255,255,255,.09) 1px, transparent 1px)` with `background-size: 24px 24px` (use `rgba(0,0,0,.09)` in light). No gradient washes or glows.

### Book cover placeholder
If a book has no valid image, render a flat colored block with the title in white (colors: `#3b2f5c #1f4d4a #5c2f2f #2f4a5c #4d4a1f #4a2f5c`, chosen by hashing the title).

> Mockups: exported screenshots live in `docs/design/` (Home, Home-Light, Book Details + Borrow modal, Register, All Books, Add Book, My Books + Delete modal, My Borrows). Match them. Sample titles/authors in the mockups are placeholder data only.

---

## 5. Layout components

### Navbar (every page)
- Floating **pill**: `rounded-full`, card background, 1px border, ~20px from top, inside the page container. Not full-bleed.
- Left: logo mark (amber rounded square with a book icon) + wordmark **BookNook**. Same size on every page.
- Center links: **Home, All Books, Add Book, My Books, My Borrows**. Active link has a soft pill highlight.
  - `Add Book`, `My Books`, `My Borrows` render **only when logged in**.
- Right (logged out): theme toggle, **Login** (outline) and **Register** (default) buttons.
- Right (logged in): theme toggle and the **user photo** in an `Avatar`. Click opens `DropdownMenu` with: user name (label), **My Profile**, **Logout**.
- Mobile: collapse links into a shadcn `Sheet` behind a menu button.
- Theme toggle: `next-themes`, sun/moon icon, `aria-label="Toggle theme"`.

### Footer (every page)
Top border hairline. Three groups: logo + one-line description (e.g. "A small online library. Add, borrow, return."), contact info (email + location), social links (X, GitHub, LinkedIn, Facebook) and a copyright line `© 2026 BookNook`. Use real-looking contact details, no lorem.

---

## 6. Routes and screens

| Route | Access | Title |
|---|---|---|
| `/` | public | BookNook \| Home |
| `/books` | public | BookNook \| All Books |
| `/books/[id]` | **private** | BookNook \| Book Details |
| `/add-book` | **private** | BookNook \| Add Book |
| `/my-books` | **private** | BookNook \| My Books |
| `/my-borrows` | **private** | BookNook \| My Borrows |
| `/login` | public | BookNook \| Login |
| `/register` | public | BookNook \| Register |
| `/profile` | **private** | BookNook \| My Profile |
| `not-found.tsx` | — | BookNook \| Page Not Found |

Set titles with `export const metadata` in server `page.tsx` files and keep client logic in child client components. Add `loading.tsx` spinners where useful.

### Home `/`
1. **Hero slider (Swiper)** inside a rounded bordered panel with the dotted grid. Minimum 3 slides. Each slide: small chip, big title, short text, **Browse Books** button (→ `/books`), plus a secondary outline button. Pagination as small bars (active bar is amber and wider). Autoplay with pause on hover; fade or slide transition.
   - Slide ideas: "A small library for curious readers"; "Share a book, make someone's week"; "Borrow today, return when you are done".
2. **New Arrivals**: fetch latest 6 books from the API (`GET /books?sort=newest&limit=6`). 3-column grid (1 on mobile, 2 on tablet). Each card: cover (fixed height, `object-cover`), category badge, title, author, **View Details** button. Below the grid, centered **See All Books** button (→ `/books`).
3. **How Borrowing Works**: three cards numbered 01/02/03 — Add a book, Borrow it, Return it.
4. **Top Categories** (second extra section): bento grid of Fiction, Science, History, Kids, Others with icon + short line; each links to `/books?category=...`.

### All Books `/books`
Heading, subtext, search input (title/author) and category chips (All, Fiction, Science, History, Kids, Others). 3-column grid on desktop, equal-height cards (cover, title, author, category, **View Details**). Show skeletons/spinner while loading and a friendly empty state.

### Book Details `/books/[id]` (private)
Two columns: large cover left; right has category chip, title, author, description, "Added by {name} on {date}", copies available (e.g. "3 of 5") with a thin amber progress bar, then **Borrow This Book** and a **Back to Books** outline button.
- Borrow button opens a `Dialog` titled **Confirm Borrow**: read-only Name and Email (from session), book title shown, **Cancel** and **Confirm Borrow**.
- If `availableCopies === 0`: button disabled and labelled **Not Available**.
- If the user already has this book borrowed: server returns 409; show an error toast ("You have already borrowed this book").
- Logged-out user clicking Borrow, or opening this route, goes to `/login?callbackUrl=/books/{id}` and returns after login.

### Add Book `/add-book` (private)
Centered card form (max-w ~640px): Book Title, Author Name, Category (`Select`: Fiction, Science, History, Kids, Others), **Total Copies** (number, min 1), Book Image (file input/dropzone → upload to imgbb, show preview), Short Description (`Textarea`), Your Name and Your Email (read-only from session), **Add Book**.
On submit: upload image, `POST /books` with `createdAt` handled by the server, toast success, redirect to `/my-books`.

### My Books `/my-books` (private)
Table (cards on mobile): cover thumb, title + category, copies, added date, **Edit** and **Delete**.
- Edit opens a dialog/page form prefilled with old data; save sends `PATCH /books/:id`; success toast; UI updates.
- Delete opens an `AlertDialog` ("Delete this book? This cannot be undone.") with Cancel and a red **Yes, Delete**; then `DELETE /books/:id`, remove from UI, toast.

### My Borrows `/my-borrows` (private)
Table: Image, Title, Borrow Date, Return Date, **Return Book** button. Return → `DELETE /borrows/:id`, remove row, toast, copies restored server-side. Empty state with a link to `/books`.

### Login `/login` and Register `/register`
Centered card, title, form.
- Login: Email, Password, Login button, "Forgot password?" text (visual only, **do not implement**), **Continue with Google**, link to Register. Success → `callbackUrl` or `/`. Failure → toast + inline error.
- Register: Name, Email, Photo URL, Password, Register button, Google button, link to Login. Success → navigate to `/login` (toast success). Failure → toast.
- **Password rules** (client-side, block submit): at least one uppercase, at least one lowercase, length ≥ 6. Show a live checklist under the field (met rules turn amber).
- Do **not** implement email verification or password reset.

### My Profile `/profile` (private)
Card with the user photo, email (read-only), and an editable form for **Name** and **Photo URL**. **Save Changes** calls `authClient.updateUser({ name, image })`, shows a success/error toast, and the Navbar avatar and name update immediately. After saving, refresh the JWT (`authClient.token()`) so the backend sees the new name. Books already added keep the owner name they were saved with (acceptable).

### 404
Large faint "404", line "This page isn't on our shelf.", **Back to Home** button.

---

## 7. Authentication (BetterAuth + MongoDB adapter)

- Server config in `src/lib/auth.ts` using `betterAuth({ database: mongodbAdapter(db), emailAndPassword: { enabled: true }, socialProviders: { google: {...} }, plugins: [jwt()] })`. Add `user.additionalFields` only if needed for photo; BetterAuth already supports `image`.
- Registration passes `name`, `email`, `password`, `image` (Photo URL).
- Route handler: `src/app/api/auth/[...all]/route.ts` using `toNextJsHandler(auth)`.
- Client in `src/lib/auth-client.ts` with `createAuthClient` and `jwtClient()`.
- Use `authClient.useSession()` for UI. While `isPending`, render a spinner, **never** redirect. Redirect to login only when pending is false and there is no session.
- **Route protection (two layers):**
  1. Edge/middleware (or `proxy.ts`): optimistic check using `getSessionCookie` from `better-auth/cookies`; if missing on a private route, redirect to `/login?callbackUrl=<path>`.
  2. A client `<PrivateRoute>` wrapper or server-side `auth.api.getSession` check inside private pages for the real validation.
- Reload on private routes must keep the user logged in (cookie-based session handles this).
- Google OAuth: set authorized redirect URIs for local and production (`{BETTER_AUTH_URL}/api/auth/callback/google`).
- Set `trustedOrigins` to include the deployed URL.

### JWT for the Express backend
The backend validates JWTs issued by BetterAuth's **JWT plugin**.
- Client gets a token with `authClient.token()` (jwt client plugin) and sends `Authorization: Bearer <token>` on protected API calls.
- Backend verifies the token against BetterAuth's JWKS endpoint: `{BETTER_AUTH_URL}/api/auth/jwks` (using `jose` `createRemoteJWKSet` + `jwtVerify`).
- Cache the token briefly in memory; refresh on 401.
- Profile edits use `authClient.updateUser({ name, image })`; the next JWT then carries the new name.
- Check the current BetterAuth docs for exact plugin option names before wiring; they may change between versions.

---

## 8. Data layer in the client

`src/lib/api.ts` exposes typed functions: `getBooks(params)`, `getBook(id)`, `createBook(data)`, `updateBook(id, data)`, `deleteBook(id)`, `borrowBook(data)`, `getMyBorrows()`, `returnBook(id)`.
- Base URL from `NEXT_PUBLIC_API_URL`.
- Attach the Bearer JWT automatically for protected calls.
- Throw an `ApiError` with `status` and `message`; UI maps it to a toast.
- Image upload helper `uploadToImgbb(file)` → `POST https://api.imgbb.com/1/upload?key=...` with `FormData`; return `data.url`.
- Configure `next.config.ts` `images.remotePatterns` for `i.ibb.co` and `lh3.googleusercontent.com`, or use plain `<img>` with fixed aspect ratio.

### Types
```ts
type Category = "Fiction" | "Science" | "History" | "Kids" | "Others";
interface Book {
  _id: string; title: string; author: string; category: Category;
  image: string; description: string;
  totalCopies: number; availableCopies: number;
  ownerName: string; ownerEmail: string; createdAt: string;
}
interface Borrow {
  _id: string; bookId: string; bookTitle: string; bookImage: string;
  userEmail: string; userName: string; borrowDate: string; returnDate: string;
}
```

---

## 9. Backend contract (separate project — for context)

**Stack:** Express.js + MongoDB (native driver), JavaScript or TypeScript. Deployed separately on **Vercel** (its own Vercel project). Must enable **CORS** for the client origin(s) and local dev.

### Collections
- `books`: fields as `Book` above (`_id` ObjectId, `createdAt` Date set by server, `availableCopies` initialised to `totalCopies`).
- `borrows`: fields as `Borrow` above. Create a **unique compound index** on `{ bookId, userEmail }` to prevent double borrow.

### The 8 routes (exactly these)

| Method & path | Auth | Behavior |
|---|---|---|
| `GET /books` | public | Returns all books. Supports query: `sort=newest` (sort by `createdAt` desc), `limit=N`, `category`, `search` (title/author, case-insensitive), `ownerEmail` (used by My Books). |
| `GET /books/:id` | JWT | One book. 404 if not found, 400 on invalid id. |
| `POST /books` | JWT | Create book. Takes owner name/email from the **token**, not the body. Sets `createdAt = new Date()`, `availableCopies = totalCopies`. |
| `PATCH /books/:id` | JWT | Update allowed fields only (title, author, category, image, description, totalCopies). Only the owner may update (403 otherwise). Keep `availableCopies` consistent when `totalCopies` changes (never negative). |
| `DELETE /books/:id` | JWT | Only the owner (403 otherwise). **Blocked while any copy is borrowed**: if `availableCopies < totalCopies` (or an active borrow exists for the book) return **409** `{ "message": "This book has active borrows and cannot be deleted" }`. Otherwise removes the book. |
| `POST /borrows` | JWT | Borrow a book (see rules below). |
| `GET /borrows` | JWT | Returns borrows where `userEmail` equals the email in the token. |
| `DELETE /borrows/:id` | JWT | Return a book: only the borrower; deletes the borrow and does `$inc: { availableCopies: +1 }` on the book. |

### Business rules (enforce on the server)
- **Borrow:** atomically `findOneAndUpdate({ _id: bookId, availableCopies: { $gt: 0 } }, { $inc: { availableCopies: -1 } })`. If no match → 400 "Not available".
- **No double borrow:** if the user already has this book borrowed → **409** with a clear message. (Check before decrementing, or roll back the decrement if the insert fails on the unique index.)
- **Return date:** `borrowDate = now`, `returnDate = now + 14 days` (default).
- **Return:** increments copies by 1.
- **No cap** on how many different books one user can borrow at once (only the same book twice is blocked).
- **Delete is blocked** while the book has borrowed copies (see `DELETE /books/:id`). The client shows the 409 message as a toast.
- Never trust owner/user identity from the request body; always use the verified JWT claims (`email`, `name`).
- Standard JSON errors: `{ "message": "..." }` with proper status codes (400, 401, 403, 404, 409).
- Env: `MONGODB_URI`, `CLIENT_ORIGIN`, `BETTER_AUTH_URL` (for JWKS), `PORT`.

### Deploying Express on Vercel (backend project)
- Export the Express `app` (`export default app` / `module.exports = app`) from the entry file; call `app.listen()` **only** when not running on Vercel (local dev).
- Add `vercel.json` rewriting all paths to the entry (e.g. `{ "rewrites": [{ "source": "/(.*)", "destination": "/api/index" }] }` with the entry at `api/index.js`, or follow the current Vercel Express guide).
- Cache the `MongoClient` promise in a module-level variable so serverless invocations reuse connections.
- Set env vars in the Vercel project: `MONGODB_URI`, `CLIENT_ORIGIN` (the client's Vercel URL), `BETTER_AUTH_URL` (the client's Vercel URL, used for JWKS).
- CORS must allow the client's production URL and `http://localhost:3000`, including the `Authorization` header and `PATCH`/`DELETE` methods, and answer preflight `OPTIONS`.
- Cache the fetched JWKS in memory between requests.

### Backend commit target
Minimum **8 notable commits** on the server repo. Client repo: minimum **15 notable commits**.

---

## 10. Suggested folder structure

```
src/
  app/
    (public)/ page.tsx, books/page.tsx, login/, register/
    (private)/ books/[id]/, add-book/, my-books/, my-borrows/, profile/
    api/auth/[...all]/route.ts
    layout.tsx, globals.css, not-found.tsx, loading.tsx
  components/
    ui/            (shadcn, generated)
    layout/        navbar.tsx, footer.tsx, theme-toggle.tsx, user-menu.tsx
    home/          hero-slider.tsx, new-arrivals.tsx, how-it-works.tsx, categories.tsx
    books/         book-card.tsx, book-grid.tsx, book-form.tsx, borrow-dialog.tsx, delete-dialog.tsx
    auth/          login-form.tsx, register-form.tsx, google-button.tsx, private-route.tsx, password-checklist.tsx
    common/        spinner.tsx, empty-state.tsx, x-icon.tsx
  lib/             auth.ts, auth-client.ts, api.ts, imgbb.ts, utils.ts, mongodb.ts
  types/           index.ts
docs/design/       exported mockup screenshots
```

---

## 11. Coding conventions
- TypeScript strict; no `any` unless justified.
- Server Components by default; add `"use client"` only where hooks/events are needed.
- One component per file, named exports, kebab-case file names.
- Use Tailwind utility classes and shadcn tokens (`bg-background`, `text-muted-foreground`, `border-border`). **No hard-coded hex in components** (hex only lives in `globals.css`).
- Accessible: real `<button>`/`<a>`, labels on inputs, `aria-label` on icon-only buttons, visible focus.
- Animations (optional): Framer Motion fade-up on sections, staggered cards, subtle tap scale. Respect `prefers-reduced-motion`.
- Commit messages: conventional style (`feat: add hero slider`, `fix: private route reload`). Make small, meaningful commits.

## 12. README requirements (client repo)
Must include: project name **BookNook**, the **live site URL**, and at least **5 feature bullet points** (e.g. Google + email login, add/edit/delete books, borrow & return with copy tracking, no double borrow, dark/light theme, JWT-protected API, fully responsive). Also list tech stack and setup steps.

## 13. Deployment checklist
- Client and backend are **both on Vercel**, as two separate projects. Set env vars in each. Deploy the backend first, then put its URL in the client's `NEXT_PUBLIC_API_URL`.
- Google OAuth redirect URIs updated for the production domain.
- `BETTER_AUTH_URL`, `trustedOrigins` and backend CORS use the production URL.
- Test direct URL load and reload on **every** route, logged in and logged out.
- Test private route redirect → login → return to original page.

## 14. Definition of done (acceptance checklist)
- [ ] Navbar/Footer on every page; private links hidden when logged out; avatar dropdown works
- [ ] Hero slider with ≥3 slides; New Arrivals shows latest 6 from DB, newest first
- [ ] Two extra home sections present
- [ ] Register validation (upper, lower, ≥6) blocks invalid passwords
- [ ] Email/password and Google login work; callback redirect works
- [ ] Add, edit (prefilled), delete (custom confirm) all work and persist
- [ ] Borrow modal works; copies decrement/increment; "Not Available" at 0; double borrow blocked with toast
- [ ] My Borrows table with Return button
- [ ] JWT required on protected API routes
- [ ] 404 page, per-route titles, loading spinners, toasts for every success/error
- [ ] No alert/confirm, no lorem text, X logo used
- [ ] Reload works on every route; logged-in reload stays logged in
- [ ] Responsive at 375px, 768px, 1280px; light and dark themes both polished

## 15. Do not
- Do not add routes to the backend beyond the 8 listed.
- Do not implement email verification or forgot-password.
- Do not store secrets in the repo.
- Do not use browser `alert`/`confirm`/`prompt`.
- Do not invent features outside this file without asking the owner.

---

## 16. Decisions and open items

### Decided by the owner
- Hosting: **Vercel for both** client and backend.
- **No limit** on simultaneous borrows per user (same book twice is still blocked).
- Deleting a book is **blocked** while any copy is borrowed.
- `GET /books/:id` **requires JWT**.
- `/profile` lets users **edit name and photo**.
- Footer contact details are **placeholders for now**: use `hello@booknook.example`, "Bangladesh", and social links pointing to `#`. They must look intentional (no lorem). Replace later.

### Still open (ask the owner before assuming)
- `TODO(owner)`: Live client and backend URLs (known only after the first Vercel deploy). Put the client URL in the README.
- `TODO(owner)`: Borrow period is **14 days** by default; confirm or change.
