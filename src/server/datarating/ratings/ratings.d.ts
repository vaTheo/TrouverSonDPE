import { RatesEau } from "@server/datarating/fetch-eau/eau";
import { RatesGeoRisque } from "@server/datarating/fetch-georisque/Georisque";

export interface Ratings extends RatesGeoRisque, RatesEau {
    addressID? : string;

}
