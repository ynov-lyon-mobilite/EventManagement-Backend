-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'FACEBOOK');

-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripeCustomerId" TEXT,
    "provider" "Provider",
    "providerId" TEXT,
    "roles" "RoleEnum"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Event" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "eventCategoriesUuid" UUID NOT NULL,
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ,
    "description" TEXT,
    "deletedAt" TIMESTAMPTZ,
    "stripeProductId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "EventPrices" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventUuid" UUID NOT NULL,
    "stripePriceId" TEXT NOT NULL,

    CONSTRAINT "EventPrices_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "EventCategories" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "EventCategories_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Booking" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "refunded" BOOLEAN NOT NULL DEFAULT false,
    "refundedAt" TIMESTAMPTZ,
    "eventPriceUuid" UUID NOT NULL,
    "userUuid" UUID NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_provider_providerId_key" ON "User"("provider", "providerId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventCategoriesUuid_fkey" FOREIGN KEY ("eventCategoriesUuid") REFERENCES "EventCategories"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPrices" ADD CONSTRAINT "EventPrices_eventUuid_fkey" FOREIGN KEY ("eventUuid") REFERENCES "Event"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_eventPriceUuid_fkey" FOREIGN KEY ("eventPriceUuid") REFERENCES "EventPrices"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
