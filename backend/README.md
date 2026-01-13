📁 backend/README.md

# BookNest Backend 🛠️

BookNest backend is built using **NestJS** with **Prisma ORM** and is responsible for:

- Scraping book data
- Managing navigation, categories, and products
- Serving APIs consumed by the frontend

---

## 🚀 Tech Stack

- **NestJS**
- **Prisma ORM**
- **PostgreSQL**
- **Axios / Cheerio (Scraping)**
- **Postman (API testing)**

---

## 📂 Project Structure

backend/
├── prisma/
│ └── schema.prisma
├── src/
│ ├── navigation/
│ ├── category/
│ ├── product/
│ ├── app.module.ts
│ └── main.ts
├── .env
└── package.json

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/booknest"
PORT=4000

🧩 Install & Run
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev


Server runs on:

http://localhost:4000

📡 API Modules
Navigation

POST /navigation/scrape

GET /navigation

Categories

POST /categories/scrape

GET /categories/sub-headings

GET /categories/:slug

Products

POST /products/scrape

GET /products/category/:categoryId

GET /products/:id

🧪 API Testing

Postman collection included in /postman

Supports Collection Runner

Tests are saved at request / folder / collection level

🔒 Important Design Decisions (Locked)

Scraping is done from collection pages, not navbar

Prisma schema is finalized

ProductController & ProductService logic is fixed

Limits aligned for product list and detail

🚀 Deployment

Recommended platforms:

Railway

Render

Fly.io

After deployment, update frontend API base URL.
```

📌 Notes

This backend is designed to be stateless

Scraping endpoints can be triggered manually or via refresh

Ready for background jobs & caching if needed
