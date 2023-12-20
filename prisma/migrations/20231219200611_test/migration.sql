/*
  Warnings:

  - You are about to drop the `AllRatings` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "userAddressID" DROP CONSTRAINT "userAddressID_addressID_fkey";

-- DropTable
DROP TABLE "AllRatings";

-- CreateTable
CREATE TABLE "Ratings" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "eauAnalysis" INTEGER NOT NULL,
    "AZIData" INTEGER NOT NULL,
    "CatnatData" INTEGER NOT NULL,
    "InstallationsClasseesData" INTEGER NOT NULL,
    "MVTData" INTEGER NOT NULL,
    "RadonData" INTEGER NOT NULL,
    "RisquesData" INTEGER NOT NULL,
    "SISData" INTEGER NOT NULL,
    "TRIData" INTEGER NOT NULL,
    "ZonageSismiqueData" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ratings_addressID_key" ON "Ratings"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "userAddressID" ADD CONSTRAINT "userAddressID_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "Ratings"("addressID") ON DELETE RESTRICT ON UPDATE CASCADE;
