import { Injectable } from '@nestjs/common';
import { AllRatings } from '@prisma/client';
import { PrismaService } from '@server/prisma/prisma.service';
import { GroupRates } from './frontData';

@Injectable()
export class FrontDataService {
  constructor(private prisma: PrismaService) {}

  async groupRates(allRatings: AllRatings): Promise<GroupRates> {
    return {
      globalRate: this.average(
        allRatings.eauPotable,
        allRatings.coursEau,
        allRatings.AZIData,
        allRatings.TRIData,
        allRatings.CatnatData,
        allRatings.InstallationsClasseesData,
        allRatings.SISData,
        allRatings.MVTData,
        allRatings.RadonData,
        allRatings.ZonageSismiqueData,
        allRatings.naturaHabitat,
        allRatings.naturaOiseaux,
        allRatings.znieff1,
        allRatings.znieff2,
        allRatings.pn,
        allRatings.pnr,
        allRatings.rnc,
        allRatings.rncf,
        allRatings.rnn,
        allRatings.DPETertiaire,
        allRatings.DPEHabitatExistant,
        allRatings.DPEHabitatNeuf,
        allRatings.DPEHabitatExistantAvant2021,
        allRatings.DPETertiaireAvant2021,
      ),
      eau: this.eau(allRatings.eauPotable, allRatings.coursEau),
      zoneInnondable: this.zoneInnondable(allRatings.AZIData, allRatings.TRIData),
      CatastropheNaturelle: this.CatastropheNaturelle(allRatings.CatnatData),
      InstallationClassees: this.InstallationClassees(allRatings.InstallationsClasseesData),
      risqueLocaux: this.risqueLocaux(
        allRatings.MVTData,
        allRatings.RadonData,
        allRatings.ZonageSismiqueData,
      ),
      risqueGeneraux: this.risqueGeneraux(allRatings.RisquesData),
      zoneNaturelle: this.zoneNaturelle(
        allRatings.naturaHabitat,
        allRatings.naturaOiseaux,
        allRatings.znieff1,
        allRatings.znieff2,
      ),
      parcNaturelle: this.parcNaturelle(
        allRatings.pn,
        allRatings.pnr,
        allRatings.rnc,
        allRatings.rncf,
        allRatings.rnn,
      ),
      DPEBatiment: this.DPEBatiment(
        allRatings.DPETertiaire,
        allRatings.DPEHabitatExistant,
        allRatings.DPEHabitatNeuf,
        allRatings.DPEHabitatExistantAvant2021,
        allRatings.DPETertiaireAvant2021,
      ),
      polutionSol: this.pollutionSol(allRatings.SISData),
    };
  }

  private average(...nums: Array<number | null>): number {
    let sum = 0;
    let count = 0;

    nums.forEach((num) => {
      if (num !== null) {
        sum += num;
        count++;
      }
    });

    return count === 0 ? 0 : Math.round(sum / count);
  }

  private eau(num1: number | null, num2: number | null): number {
    return this.average(num1, num2);
  }

  private zoneInnondable(num1: number | null, num2: number | null): number {
    return this.average(num1, num2);
  }

  private CatastropheNaturelle(num1: number | null): number {
    return this.average(num1);
  }

  private InstallationClassees(num1: number | null): number {
    return this.average(num1);
  }
  private pollutionSol(num1: number | null): number {
    return this.average(num1);
  }

  private risqueLocaux(num1: number | null, num2: number | null, num3: number | null): number {
    return this.average(num1, num2, num3);
  }

  private risqueGeneraux(num1: number | null): number {
    return this.average(num1);
  }

  private zoneNaturelle(
    num1: number | null,
    num2: number | null,
    num3: number | null,
    num4: number | null,
  ): number {
    return this.average(num1, num2, num3, num4);
  }

  private parcNaturelle(
    num1: number | null,
    num2: number | null,
    num3: number | null,
    num4: number | null,
    num5: number | null,
  ): number {
    return this.average(num1, num2, num3, num4, num5);
  }

  private DPEBatiment(
    num1: number | null,
    num2: number | null,
    num3: number | null,
    num4: number | null,
    num5: number | null,
  ): number {
    return this.average(num1, num2, num3, num4, num5);
  }
}
