/*
  Warnings:

  - You are about to drop the `UserDataSourceAddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserDataSourceAddress" DROP CONSTRAINT "UserDataSourceAddress_dataSourceId_fkey";

-- DropForeignKey
ALTER TABLE "UserDataSourceAddress" DROP CONSTRAINT "UserDataSourceAddress_userId_fkey";

-- DropTable
DROP TABLE "UserDataSourceAddress";

-- CreateTable
CREATE TABLE "UserAddressInfo" (
    "userId" TEXT NOT NULL,
    "addressInfoId" TEXT NOT NULL,

    CONSTRAINT "UserAddressInfo_pkey" PRIMARY KEY ("userId","addressInfoId")
);

-- AddForeignKey
ALTER TABLE "UserAddressInfo" ADD CONSTRAINT "UserAddressInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddressInfo" ADD CONSTRAINT "UserAddressInfo_addressInfoId_fkey" FOREIGN KEY ("addressInfoId") REFERENCES "AddressInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
