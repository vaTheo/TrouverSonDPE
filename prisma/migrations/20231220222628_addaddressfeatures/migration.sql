/*
  Warnings:

  - Added the required column `city` to the `userAddressID` table without a default value. This is not possible if the table is not empty.
  - Added the required column `citycode` to the `userAddressID` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postcode` to the `userAddressID` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `userAddressID` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userAddressID" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "citycode" TEXT NOT NULL,
ADD COLUMN     "postcode" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;
