# BookNest Backend

## Description

Backend service for managing products scraped from external sources,
structured using Navigation, Category, and Product modules.

## Tech Stack

- NestJS
- Prisma ORM
- PostgreSQL

## Modules

- Navigation
- Category
- Product

## Setup Instructions

1. npm install
2. Create .env file and set DATABASE_URL
3. npx prisma migrate dev
4. npm run start:dev

## API Endpoints

- /navigations
- /categories
- /products
