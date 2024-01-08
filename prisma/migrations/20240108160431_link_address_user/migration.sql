/*
  Warnings:

  - You are about to drop the `DataSourceAddressID` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AllRatings" DROP CONSTRAINT "AllRatings_DataSourcesID_fkey";

-- DropForeignKey
ALTER TABLE "DataSourceAddressID" DROP CONSTRAINT "DataSourceAddressID_userId_fkey";

-- DropForeignKey
ALTER TABLE "jsonDataEau" DROP CONSTRAINT "jsonDataEau_DataSourcesID_fkey";

-- DropForeignKey
ALTER TABLE "jsonDataGeorisque" DROP CONSTRAINT "jsonDataGeorisque_DataSourcesID_fkey";

-- DropTable
DROP TABLE "DataSourceAddressID";

-- CreateTable
CREATE TABLE "AddressInfo" (
    "id" TEXT NOT NULL,
    "addressID" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "citycode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AddressInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDataSourceAddress" (
    "userId" TEXT NOT NULL,
    "dataSourceId" TEXT NOT NULL,

    CONSTRAINT "UserDataSourceAddress_pkey" PRIMARY KEY ("userId","dataSourceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AddressInfo_addressID_key" ON "AddressInfo"("addressID");

-- AddForeignKey
ALTER TABLE "UserDataSourceAddress" ADD CONSTRAINT "UserDataSourceAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDataSourceAddress" ADD CONSTRAINT "UserDataSourceAddress_dataSourceId_fkey" FOREIGN KEY ("dataSourceId") REFERENCES "AddressInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jsonDataEau" ADD CONSTRAINT "jsonDataEau_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "AddressInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jsonDataGeorisque" ADD CONSTRAINT "jsonDataGeorisque_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "AddressInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllRatings" ADD CONSTRAINT "AllRatings_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "AddressInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
