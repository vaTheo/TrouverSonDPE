import { RatesEau } from "@server/datarating/fetch-eau/eau";
import { RatesGeoRisque } from "@server/datarating/fetch-georisque/Georisque";
import { RatesParcCarto } from "../fetch-cartoParc/cartoParc";

export interface Ratings extends RatesGeoRisque, RatesEau,RatesParcCarto {
    addressID? : string;

}
