import { FeatureCarto } from '../fetch-cartoParc/api-cartoParc';
import { ParcCartoAllData } from '../fetch-cartoParc/cartoParc';
import { DPEAllData } from '../fetch-dpe/DPE';
import { eauAllData } from '../fetch-eau/eau';
import {
  AZIData,
  CatnatData,
  InstallationsClasseesData,
  MVTData,
  RadonData,
  SISData,
  ZonageSismiqueData,
} from '../fetch-georisque/api-georisque';

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
    pollutionSol: {sis?:SISData[]
  };
}
