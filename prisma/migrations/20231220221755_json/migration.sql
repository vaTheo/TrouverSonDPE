/*
  Warnings:

  - You are about to drop the column `json` on the `DataSources` table. All the data in the column will be lost.
  - You are about to drop the `AZIData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CatnatData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InstallationsClasseesData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MVTData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RadonData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RisquesData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SISData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TRIData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZonageSismiqueData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eauAnalysis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AZIData" DROP CONSTRAINT "AZIData_DataSourcesID_fkey";

-- DropForeignKey
ALTER TABLE "CatnatData" DROP CONSTRAINT "CatnatData_DataSourcesID_fkey";

-- DropForeignKey
ALTER TABLE "InstallationsClasseesData" DROP CONSTRAINT "InstallationsClasseesData_DataSourcesID_fkey";

-- DropForeignKey
ALTER TABLE "MVTData" DROP CONSTRAINT "MVTData_DataSourcesID_fkey";

-- DropForeignKey
ALTER TABLE "RadonData" DROP CONSTRAINT "RadonData_DataSourcesID_fkey";

-- DropForeignKey
ALTER TABLE "RisquesData" DROP CONSTRAINT "RisquesData_DataSourcesID_fkey";

-- DropForeignKey
ALTER TABLE "SISData" DROP CONSTRAINT "SISData_DataSourcesID_fkey";

-- DropForeignKey
ALTER TABLE "TRIData" DROP CONSTRAINT "TRIData_DataSourcesID_fkey";

-- DropForeignKey
ALTER TABLE "ZonageSismiqueData" DROP CONSTRAINT "ZonageSismiqueData_DataSourcesID_fkey";

-- DropForeignKey
ALTER TABLE "eauAnalysis" DROP CONSTRAINT "eauAnalysis_DataSourcesID_fkey";

-- AlterTable
ALTER TABLE "DataSources" DROP COLUMN "json";

-- DropTable
DROP TABLE "AZIData";

-- DropTable
DROP TABLE "CatnatData";

-- DropTable
DROP TABLE "InstallationsClasseesData";

-- DropTable
DROP TABLE "MVTData";

-- DropTable
DROP TABLE "RadonData";

-- DropTable
DROP TABLE "RisquesData";

-- DropTable
DROP TABLE "SISData";

-- DropTable
DROP TABLE "TRIData";

-- DropTable
DROP TABLE "ZonageSismiqueData";

-- DropTable
DROP TABLE "eauAnalysis";

-- CreateTable
CREATE TABLE "jsonDataGaspar" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "eauAnalysis" JSONB NOT NULL,
    "allRatings" JSONB NOT NULL,
    "AZIData" JSONB NOT NULL,
    "CatnatData" JSONB NOT NULL,
    "InstallationsClasseesData" JSONB NOT NULL,
    "MVTData" JSONB NOT NULL,
    "RadonData" JSONB NOT NULL,
    "RisquesData" JSONB NOT NULL,
    "SISData" JSONB NOT NULL,
    "TRIData" JSONB NOT NULL,
    "ZonageSismiqueData" JSONB NOT NULL,
    "DataSourcesID" INTEGER NOT NULL,

    CONSTRAINT "jsonDataGaspar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jsonDataGaspar_addressID_key" ON "jsonDataGaspar"("addressID");

-- AddForeignKey
ALTER TABLE "jsonDataGaspar" ADD CONSTRAINT "jsonDataGaspar_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
