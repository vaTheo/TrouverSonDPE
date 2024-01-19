import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AddressObject } from '../fetch-address/address';
import { ApiResponse, ResultItemDPE } from './api-DPE';
import { filterObjectKeys } from '../utilities';
import { KEYSTOKEEDPE } from './api-keysToKeep';
import { DPEAllData, RatesDPE } from './DPE';

@Injectable()
export class FetchDPE {
  // 100 requêtes/ 5 secondes
  async getDPE(addressObject: AddressObject): Promise<ResultItemDPE[] | null> {
    try {
      const agg_size = '64'; //Max result in the response
      const URLAPI = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/';
      const response = await axios.get(
        `${URLAPI}geo_agg?q=${addressObject.properties.id}&q_fields=Identifiant__BAN&size=50`,
      );
      const data: ApiResponse = response.data;
      let filteredObjects = filterObjectKeys(data.aggs[0].results, KEYSTOKEEDPE) as ResultItemDPE[];
      return filteredObjects;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  getRate(DPEAllData: DPEAllData): RatesDPE {
    // Convert letters to numbers
    const letterToNumber = (letter: string): number => {
      switch (letter) {
        case 'A':
          return 6;
        case 'B':
          return 5;
        case 'C':
          return 4;
        case 'D':
          return 3;
        case 'E':
          return 2;
        case 'F':
          return 1;
        case 'G':
          return 0;
        default:
          return 0; // Adjust default case as needed
      }
    };

    // Calculate average
    const num1 = letterToNumber(DPEAllData.DPEHabitat[0].Etiquette_GES);
    const num2 = letterToNumber(DPEAllData.DPEHabitat[0].Etiquette_DPE);
    const average = (num1 + num2) / 2;

    // Map average to a value between 0 and 3
    let rate;
    if (average >= 5) rate = 3; // Closer to 'A'
    else if (average >= 3) rate = 2; // Closer to 'C'
    else if (average >= 1) rate = 1; // Closer to 'E'
    else rate = 0; // Closer to 'G'

    return { DPEHabitat: rate };
  }
}
