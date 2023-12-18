/*
  Warnings:

  - You are about to drop the column `tokenID` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_tokenID_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "tokenID",
ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");
