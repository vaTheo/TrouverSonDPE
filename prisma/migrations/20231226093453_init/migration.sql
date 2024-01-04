/*
  Warnings:

  - The primary key for the `AllRatings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DataSourceAddressID` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `jsonDataEau` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `jsonDataGeorisque` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "AllRatings" DROP CONSTRAINT "AllRatings_DataSourcesID_fkey";

-- DropForeignKey
ALTER TABLE "DataSourceAddressID" DROP CONSTRAINT "DataSourceAddressID_userId_fkey";

-- DropForeignKey
ALTER TABLE "jsonDataEau" DROP CONSTRAINT "jsonDataEau_DataSourcesID_fkey";

-- DropForeignKey
ALTER TABLE "jsonDataGeorisque" DROP CONSTRAINT "jsonDataGeorisque_DataSourcesID_fkey";

-- AlterTable
ALTER TABLE "AllRatings" DROP CONSTRAINT "AllRatings_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "DataSourcesID" SET DATA TYPE TEXT,
ADD CONSTRAINT "AllRatings_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AllRatings_id_seq";

-- AlterTable
ALTER TABLE "DataSourceAddressID" DROP CONSTRAINT "DataSourceAddressID_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "DataSourceAddressID_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DataSourceAddressID_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "jsonDataEau" DROP CONSTRAINT "jsonDataEau_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "DataSourcesID" SET DATA TYPE TEXT,
ADD CONSTRAINT "jsonDataEau_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "jsonDataEau_id_seq";

-- AlterTable
ALTER TABLE "jsonDataGeorisque" DROP CONSTRAINT "jsonDataGeorisque_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "DataSourcesID" SET DATA TYPE TEXT,
ADD CONSTRAINT "jsonDataGeorisque_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "jsonDataGeorisque_id_seq";

-- AddForeignKey
ALTER TABLE "DataSourceAddressID" ADD CONSTRAINT "DataSourceAddressID_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jsonDataEau" ADD CONSTRAINT "jsonDataEau_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSourceAddressID"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jsonDataGeorisque" ADD CONSTRAINT "jsonDataGeorisque_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSourceAddressID"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllRatings" ADD CONSTRAINT "AllRatings_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSourceAddressID"("id") ON DELETE SET NULL ON UPDATE CASCADE;
