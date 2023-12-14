-- CreateTable
CREATE TABLE "AllRatings" (
    "id" SERIAL NOT NULL,
    "addressID" TEXT NOT NULL,
    "eauAnalysis" INTEGER NOT NULL,
    "AZIData" INTEGER NOT NULL,
    "CatnatData" INTEGER NOT NULL,
    "InstallationsClasseesData" INTEGER NOT NULL,
    "MVTData" INTEGER NOT NULL,
    "RadonData" INTEGER NOT NULL,
    "RisquesData" INTEGER NOT NULL,
    "SISData" INTEGER NOT NULL,
    "TRIData" INTEGER NOT NULL,
    "ZonageSismiqueData" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllRatings_pkey" PRIMARY KEY ("id")
);
