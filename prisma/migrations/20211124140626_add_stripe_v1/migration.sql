/*
  Warnings:

  - The primary key for the `Booking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `eventUuid` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventPriceUuid` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeProductId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'FACEBOOK');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_eventUuid_fkey";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_pkey",
DROP COLUMN "eventUuid",
ADD COLUMN     "eventPriceUuid" UUID NOT NULL,
ADD COLUMN     "refunded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refundedAt" TIMESTAMPTZ,
ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Booking_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "price",
ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "stripeProductId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EventCategories" ADD COLUMN     "deletedAt" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "provider" "Provider",
ADD COLUMN     "providerId" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "EventPrices" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventUuid" UUID NOT NULL,
    "stripePriceId" TEXT NOT NULL,

    CONSTRAINT "EventPrices_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_provider_providerId_key" ON "User"("provider", "providerId");

-- AddForeignKey
ALTER TABLE "EventPrices" ADD CONSTRAINT "EventPrices_eventUuid_fkey" FOREIGN KEY ("eventUuid") REFERENCES "Event"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_eventPriceUuid_fkey" FOREIGN KEY ("eventPriceUuid") REFERENCES "EventPrices"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
