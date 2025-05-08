/*
  Warnings:

  - You are about to drop the column `telephone` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_telephone_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "telephone";
