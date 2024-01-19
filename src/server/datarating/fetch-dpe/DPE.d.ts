import { ResultItemDPE } from './api-DPE';

export interface RatesDPE {
  DPEHabitat?: number;
  DPETertiaire?: number;
}
export interface DPEAllData {
  DPEHabitat?: ResultItemDPE[];
  DPETertiaire?: ResultItemDPE[];
}
