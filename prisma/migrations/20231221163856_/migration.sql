/*
  Warnings:

  - You are about to drop the `jsonDataGaspar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "jsonDataGaspar" DROP CONSTRAINT "jsonDataGaspar_DataSourcesID_fkey";

-- DropTable
DROP TABLE "jsonDataGaspar";

-- CreateTable
CREATE TABLE "jsonDataGeorisque" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
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

    CONSTRAINT "jsonDataGeorisque_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jsonDataGeorisque_addressID_key" ON "jsonDataGeorisque"("addressID");

-- AddForeignKey
ALTER TABLE "jsonDataGeorisque" ADD CONSTRAINT "jsonDataGeorisque_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSourceAddressID"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
