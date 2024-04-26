-- CreateTable
CREATE TABLE "AddressInfo" (
    "addressID" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "citycode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "jsonDataEau" (
    "addressID" TEXT NOT NULL,
    "eauPotable" JSONB,
    "coursEau" JSONB
);

-- CreateTable
CREATE TABLE "jsonDataGeorisque" (
    "addressID" TEXT NOT NULL,
    "AZIData" JSONB,
    "CatnatData" JSONB,
    "InstallationsClasseesData" JSONB,
    "MVTData" JSONB,
    "RadonData" JSONB,
    "RisquesData" JSONB,
    "SISData" JSONB,
    "TRIData" JSONB,
    "ZonageSismiqueData" JSONB
);

-- CreateTable
CREATE TABLE "jsonDataParcCarto" (
    "addressID" TEXT NOT NULL,
    "naturaHabitat" JSONB,
    "naturaOiseaux" JSONB,
    "rnc" JSONB,
    "rnn" JSONB,
    "znieff1" JSONB,
    "znieff2" JSONB,
    "pn" JSONB,
    "pnr" JSONB,
    "rncf" JSONB
);

-- CreateTable
CREATE TABLE "jsonDataDPE" (
    "addressID" TEXT NOT NULL,
    "DPEHabitatExistant" JSONB,
    "DPEHabitatExistantAvant2021" JSONB,
    "DPEHabitatNeuf" JSONB,
    "DPETertiaire" JSONB,
    "DPETertiaireAvant2021" JSONB
);

-- CreateTable
CREATE TABLE "AllRatings" (
    "addressID" TEXT NOT NULL,
    "eauPotable" INTEGER,
    "coursEau" INTEGER,
    "AZIData" INTEGER,
    "CatnatData" INTEGER,
    "InstallationsClasseesData" INTEGER,
    "MVTData" INTEGER,
    "RadonData" INTEGER,
    "RisquesData" INTEGER,
    "SISData" INTEGER,
    "TRIData" INTEGER,
    "ZonageSismiqueData" INTEGER,
    "naturaHabitat" INTEGER,
    "naturaOiseaux" INTEGER,
    "rnc" INTEGER,
    "rnn" INTEGER,
    "znieff1" INTEGER,
    "znieff2" INTEGER,
    "pn" INTEGER,
    "pnr" INTEGER,
    "rncf" INTEGER,
    "DPEHabitatExistant" INTEGER,
    "DPEHabitatExistantAvant2021" INTEGER,
    "DPEHabitatNeuf" INTEGER,
    "DPETertiaire" INTEGER,
    "DPETertiaireAvant2021" INTEGER,
    "reatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "AddressInfo_addressID_key" ON "AddressInfo"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "jsonDataEau_addressID_key" ON "jsonDataEau"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "jsonDataGeorisque_addressID_key" ON "jsonDataGeorisque"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "jsonDataParcCarto_addressID_key" ON "jsonDataParcCarto"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "jsonDataDPE_addressID_key" ON "jsonDataDPE"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "AllRatings_addressID_key" ON "AllRatings"("addressID");

-- AddForeignKey
ALTER TABLE "jsonDataEau" ADD CONSTRAINT "jsonDataEau_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "AddressInfo"("addressID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jsonDataGeorisque" ADD CONSTRAINT "jsonDataGeorisque_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "AddressInfo"("addressID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jsonDataParcCarto" ADD CONSTRAINT "jsonDataParcCarto_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "AddressInfo"("addressID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jsonDataDPE" ADD CONSTRAINT "jsonDataDPE_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "AddressInfo"("addressID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllRatings" ADD CONSTRAINT "AllRatings_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "AddressInfo"("addressID") ON DELETE RESTRICT ON UPDATE CASCADE;
