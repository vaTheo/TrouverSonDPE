-- DropForeignKey
ALTER TABLE "userAddressID" DROP CONSTRAINT "userAddressID_addressID_fkey";

-- AlterTable
ALTER TABLE "AllRatings" ADD COLUMN     "DataSourcesID" INTEGER;

-- CreateTable
CREATE TABLE "DataSources" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "json" JSONB NOT NULL,

    CONSTRAINT "DataSources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eauAnalysis" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "DataSourcesID" INTEGER,

    CONSTRAINT "eauAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AZIData" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "DataSourcesID" INTEGER,

    CONSTRAINT "AZIData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatnatData" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "DataSourcesID" INTEGER,

    CONSTRAINT "CatnatData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallationsClasseesData" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "DataSourcesID" INTEGER,

    CONSTRAINT "InstallationsClasseesData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MVTData" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "DataSourcesID" INTEGER,

    CONSTRAINT "MVTData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadonData" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "DataSourcesID" INTEGER,

    CONSTRAINT "RadonData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RisquesData" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "DataSourcesID" INTEGER,

    CONSTRAINT "RisquesData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SISData" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "DataSourcesID" INTEGER,

    CONSTRAINT "SISData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TRIData" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "DataSourcesID" INTEGER,

    CONSTRAINT "TRIData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZonageSismiqueData" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "json" JSONB NOT NULL,
    "DataSourcesID" INTEGER,

    CONSTRAINT "ZonageSismiqueData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DataSources_addressID_key" ON "DataSources"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "eauAnalysis_addressID_key" ON "eauAnalysis"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "AZIData_addressID_key" ON "AZIData"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "CatnatData_addressID_key" ON "CatnatData"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "InstallationsClasseesData_addressID_key" ON "InstallationsClasseesData"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "MVTData_addressID_key" ON "MVTData"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "RadonData_addressID_key" ON "RadonData"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "RisquesData_addressID_key" ON "RisquesData"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "SISData_addressID_key" ON "SISData"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "TRIData_addressID_key" ON "TRIData"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "ZonageSismiqueData_addressID_key" ON "ZonageSismiqueData"("addressID");

-- AddForeignKey
ALTER TABLE "eauAnalysis" ADD CONSTRAINT "eauAnalysis_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AZIData" ADD CONSTRAINT "AZIData_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatnatData" ADD CONSTRAINT "CatnatData_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallationsClasseesData" ADD CONSTRAINT "InstallationsClasseesData_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MVTData" ADD CONSTRAINT "MVTData_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadonData" ADD CONSTRAINT "RadonData_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RisquesData" ADD CONSTRAINT "RisquesData_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SISData" ADD CONSTRAINT "SISData_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TRIData" ADD CONSTRAINT "TRIData_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZonageSismiqueData" ADD CONSTRAINT "ZonageSismiqueData_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllRatings" ADD CONSTRAINT "AllRatings_DataSourcesID_fkey" FOREIGN KEY ("DataSourcesID") REFERENCES "DataSources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
