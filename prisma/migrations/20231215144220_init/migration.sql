/*
  Warnings:

  - You are about to drop the `USER` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[addressID]` on the table `AllRatings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
DROP TABLE "USER";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "tokenID" TEXT NOT NULL,
    "userName" TEXT,
    "password" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userAddressID" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "userAddressID_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userAddressID_addressID_key" ON "userAddressID"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "AllRatings_addressID_key" ON "AllRatings"("addressID");

-- AddForeignKey
ALTER TABLE "userAddressID" ADD CONSTRAINT "userAddressID_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userAddressID" ADD CONSTRAINT "userAddressID_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "AllRatings"("addressID") ON DELETE RESTRICT ON UPDATE CASCADE;
