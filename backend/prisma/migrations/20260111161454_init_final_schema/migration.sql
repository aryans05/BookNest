/*
  Warnings:

  - You are about to drop the column `sourceUrl` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `sourceUrl` on the `Navigation` table. All the data in the column will be lost.
  - The `price` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `productCount` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reviewsCount` on table `ProductDetail` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_productId_fkey";

-- DropIndex
DROP INDEX "Navigation_sourceUrl_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "sourceUrl",
ALTER COLUMN "productCount" SET NOT NULL,
ALTER COLUMN "productCount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Navigation" DROP COLUMN "sourceUrl";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
ADD COLUMN     "price" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ProductDetail" ADD COLUMN     "editorialReviews" JSONB,
ADD COLUMN     "recommendedProducts" JSONB,
ALTER COLUMN "reviewsCount" SET NOT NULL,
ALTER COLUMN "reviewsCount" SET DEFAULT 0;

-- DropTable
DROP TABLE "Review";

-- CreateTable
CREATE TABLE "ScrapeJob" (
    "id" SERIAL NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "errorLog" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrapeJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_sourceId_idx" ON "Product"("sourceId");

-- CreateIndex
CREATE INDEX "Product_lastScrapedAt_idx" ON "Product"("lastScrapedAt");
