import { FeatureCarto } from "./externalApiParcCarto";

  export interface RatesParcCarto {
    naturaHabitat?: number;
    naturaOiseaux?: number;
    rnc?: number;
    rnn?: number;
    znieff1?: number;
    znieff2?: number;
    pn?: number;
    pnr?: number;
    rncf?: number;
  }
  export interface ParcCartoAllData {
    rate?: number;
    naturaHabitat?: FeatureCarto[];
    naturaOiseaux?: FeatureCarto[];
    rnc?: FeatureCarto[];
    rnn?: FeatureCarto[];
    znieff1?: FeatureCarto[];
    znieff2?: FeatureCarto[];
    pn?: FeatureCarto[];
    pnr?: FeatureCarto[];
    rncf?: FeatureCarto[];
  }
  
  

