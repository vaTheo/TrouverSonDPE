/*
  Warnings:

  - You are about to drop the `Ratings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "userAddressID" DROP CONSTRAINT "userAddressID_addressID_fkey";

-- DropTable
DROP TABLE "Ratings";

-- CreateTable
CREATE TABLE "AllRatings" (
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

    CONSTRAINT "AllRatings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AllRatings_addressID_key" ON "AllRatings"("addressID");

-- AddForeignKey
ALTER TABLE "userAddressID" ADD CONSTRAINT "userAddressID_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "AllRatings"("addressID") ON DELETE RESTRICT ON UPDATE CASCADE;
