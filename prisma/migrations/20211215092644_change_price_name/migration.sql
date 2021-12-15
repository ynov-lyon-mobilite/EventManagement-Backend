/*
  Warnings:

  - The values [DEV] on the enum `RoleEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `price` on the `EventPrices` table. All the data in the column will be lost.
  - Added the required column `amount` to the `EventPrices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoleEnum_new" AS ENUM ('ADMIN');
ALTER TABLE "User" ALTER COLUMN "roles" TYPE "RoleEnum_new"[] USING ("roles"::text::"RoleEnum_new"[]);
ALTER TYPE "RoleEnum" RENAME TO "RoleEnum_old";
ALTER TYPE "RoleEnum_new" RENAME TO "RoleEnum";
DROP TYPE "RoleEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "EventPrices" DROP COLUMN "price",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;
