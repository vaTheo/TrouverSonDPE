import { FeatureCarto } from '../datarating/fetch-cartoParc/api-cartoParc';
import { DPEAllData } from '../datarating/fetch-dpe/DPE';
import { eauAllData } from '../datarating/fetch-eau/eau';
import {
  AZIData,
  CatnatData,
  InstallationsClasseesData,
  MVTData,
  RadonData,
  RisquesData,
  SISData,
  ZonageSismiqueData,
} from '../datarating/fetch-georisque/api-georisque';

interface frontzoneInnondable {
  zoneInnondable: AZIData[];
}

export interface frontCatastropheNaturelle {
  CatastropheNaturelle: CatnatData[];
}
export interface frontInstallationClassees {
  InstallationClassees: InstallationsClasseesData[];
}

export interface frontrisqueLocaux {
  risqueLocaux: { MVTData?: MVTData[]; RadonData?: RadonData[]; ZonageSismiqueData?: ZonageSismiqueData[] };
}
export interface frontEau {
  eau: eauAllData;
}

export interface frontDPEBatiment {
  DPEBatiment: DPEAllData;
}
export interface frontzoneNaturelle {
  zoneNaturelle: {
    naturaHabitat?: FeatureCarto[];
    naturaOiseaux?: FeatureCarto[];
    znieff1?: FeatureCarto[];
    znieff2?: FeatureCarto[];
  };
}

export interface frontParcNaturelle {
  parcNaturelle: {
    rnc?: FeatureCarto[];
    rnn?: FeatureCarto[];
    pn?: FeatureCarto[];
    pnr?: FeatureCarto[];
    rncf?: FeatureCarto[];
  };
}
export interface frontpollutionSol {
  pollutionSol: { sis?: SISData[] };
}

export interface FrontRisqueInformation {
  risqueInformation: {
    risqueInformation: RisquesData[];
  };
}
