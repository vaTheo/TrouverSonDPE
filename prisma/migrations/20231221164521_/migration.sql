/*
  Warnings:

  - You are about to drop the column `addressID` on the `jsonDataGeorisque` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "jsonDataGeorisque_addressID_key";

-- AlterTable
ALTER TABLE "jsonDataGeorisque" DROP COLUMN "addressID";
