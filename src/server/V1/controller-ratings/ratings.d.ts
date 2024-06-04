import { RatesEau } from '../datarating/fetch-eau/eau';
import { RatesGeoRisque } from '../datarating/fetch-georisque/Georisque';
import { RatesParcCarto } from '../datarating/fetch-cartoParc/cartoParc';
import { RatesDPE } from '../datarating/fetch-dpe/DPE';

export interface Ratings extends RatesGeoRisque, RatesEau, RatesParcCarto, RatesDPE {
  addressID?: string;
}
