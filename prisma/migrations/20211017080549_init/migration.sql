-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('DEV', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "price" DOUBLE PRECISION,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "EventCategories" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "EventCategories_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Booking" (
    "eventUuid" UUID NOT NULL,
    "userUuid" UUID NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("eventUuid","userUuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventCategoriesUuid_fkey" FOREIGN KEY ("eventCategoriesUuid") REFERENCES "EventCategories"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_eventUuid_fkey" FOREIGN KEY ("eventUuid") REFERENCES "Event"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
