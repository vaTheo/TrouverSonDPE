/*
  Warnings:

  - You are about to drop the column `eauAnalysis` on the `jsonDataGaspar` table. All the data in the column will be lost.
  - You are about to drop the column `json` on the `jsonDataGaspar` table. All the data in the column will be lost.
  - You are about to drop the `DataSources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userAddressID` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AllRatings" DROP CONSTRAINT "AllRatings_DataSourcesID_fkey";

-- DropForeignKey
ALTER TABLE "jsonDataGaspar" DROP CONSTRAINT "jsonDataGaspar_DataSourcesID_fkey";

-- DropForeignKey
ALTER TABLE "userAddressID" DROP CONSTRAINT "userAddressID_userId_fkey";

-- AlterTable
ALTER TABLE "jsonDataGaspar" DROP COLUMN "eauAnalysis",
DROP COLUMN "json";

-- DropTable
DROP TABLE "DataSources";

-- DropTable
DROP TABLE "userAddressID";

-- CreateTable
CREATE TABLE "DataSourceAddressID" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "citycode" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "DataSourceAddressID_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jsonDataEau" (
    "id" SERIAL NOT NULL,
    "addressID" INTEGER NOT NULL,
    "eauPotable" JSONB NOT NULL,
    "DataSourcesID" INTEGER NOT NULL,

    CONSTRAINT "jsonDataEau_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DataSourceAddressID_addressID_key" ON "DataSourceAddressID"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "jsonDataEau_addressID_key" ON "jsonDataEau"("addressID");

-- AddForeignKey
ALTER TABLE "DataSourceAddressID" ADD CONSTRAINT "DataSourceAddressID_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jsonDataEau" ADD CONSTRAINT "jsonDataEau_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSourceAddressID"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jsonDataGaspar" ADD CONSTRAINT "jsonDataGaspar_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSourceAddressID"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllRatings" ADD CONSTRAINT "AllRatings_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSourceAddressID"("id") ON DELETE SET NULL ON UPDATE CASCADE;
