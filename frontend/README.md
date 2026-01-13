---

# 📁 `frontend/README.md`

```md
# BookNest Frontend 🌐

BookNest frontend is built with **Next.js (App Router)** and consumes APIs from the BookNest backend.

---

## 🚀 Tech Stack

- **Next.js 14+**
- **React**
- **TypeScript**
- **React Query (TanStack Query)**
- **Tailwind CSS**

---

## 📂 Project Structure

frontend/
├── app/
│ ├── page.tsx
│ ├── category/[slug]/
│ ├── product/[id]/
│ └── layout.tsx
├── components/
│ ├── Navbar.tsx
│ ├── ProductCard.tsx
│ └── SpecsTable.tsx
├── lib/
│ └── api/
│ ├── navigation.ts
│ └── products.ts
└── package.json

yaml
Copy code

---

## ⚙️ Environment Variables

Create `.env.local`:

````env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
🧩 Install & Run
bash
Copy code
cd frontend
npm install
npm run dev
Frontend runs on:

arduino
Copy code
http://localhost:3000
🔄 Data Fetching Strategy
React Query handles:

Caching

Pagination

Refetch on refresh

APIs are abstracted in:

bash
Copy code
lib/api/
🧭 Navigation Flow
On app load → fetch navigation headings

Hover on heading → fetch sub-headings

Click sub-heading → category page

Category page → paginated products

Click product → product detail page

🔁 Refresh Behavior
Refresh triggers:

Product list fetch

Product detail fetch (if on detail page)

Loaders are used where scraping takes time

🚀 Deployment
Recommended:

Vercel

Set environment variable in Vercel:

ini
Copy code
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url
📌 Notes
UI is backend-driven

No hardcoded categories or products

Built to scale with backend enhancements

yaml
Copy code

---

# 📁 Root README – Connecting Frontend & Backend

```md
# BookNest 📚

BookNest is a full-stack book discovery platform built using:

- **NestJS + Prisma (Backend)**
- **Next.js + React Query (Frontend)**

---

## 🧠 Architecture Overview

Frontend (Next.js)
↓ API calls
Backend (NestJS)
↓
Database (PostgreSQL)
↓
Web Scraping (Collection Pages)

yaml
Copy code

---

## 🔗 Connecting Frontend & Backend

### 1. Backend
Run backend first:
```bash
cd backend
npm run start:dev
Backend URL:

arduino
Copy code
http://localhost:4000
2. Frontend
Set API base URL:

env
Copy code
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
Run frontend:

bash
Copy code
cd frontend
npm run dev
🔁 Data Flow Example
Frontend loads navigation

Backend returns headings from DB

If data missing → scrape endpoint triggered

Data stored via Prisma

Frontend re-fetches updated data

🧪 Testing
Postman collection included

Collection Runner supported

Newman compatible for CI/CD

🚀 Deployment Strategy
Backend → Railway / Render

Frontend → Vercel

Update frontend env with backend URL

🔒 Project Status
Core backend: ✅ Complete

Frontend integration: ✅ Complete

Scraping logic: ✅ Locked

Ready for optimization & deployment

````
