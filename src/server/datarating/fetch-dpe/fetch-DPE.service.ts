import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { AddressObject } from '../fetch-address/address';
import { ApiResponse, ResultItemDPE } from './api-DPE';
import { filterObjectKeys } from '../utilities';
import { KEYSTOKEEDPE } from './api-keysToKeep';
import { DPEAllData, RatesDPE } from './DPE';

@Injectable()
export class FetchDPE {
  // 100 requêtes/ 5 secondes
  async callDPE(addressObject: AddressObject, endpoint: string): Promise<ResultItemDPE[] | null> {
    try {
      const agg_size = '64'; //Max result in the response
      const URLAPI = `https://data.ademe.fr/data-fair/api/v1/datasets/${endpoint}/`;
    //  TODO:
      // if (endpoint == 'dpe-france' || endpoint == 'dpe-tertiaire') {
      // const response = await axios.get(
      //   `${URLAPI}geo_agg?q=${addressObject.properties.id}&q_fields=Identifiant__BAN&size=50&geo_distance=5`,
      // );
      
      // }
      const response = await axios.get(
        `${URLAPI}geo_agg?q=${addressObject.properties.id}&q_fields=Identifiant__BAN&size=50`,
      );
      // presque bon call pour dpe-france : https://data.ademe.fr/data-fair/api/v1/datasets/dpe-france/lines?q=3%20Impasse%20du%20Foyer%20Rural%2001160%20Varambon&q_fields=geo_adresse
      // Peut être qu'il faudrait mieux creer une box de 10m/10m autour pour avoir par coordonnées
      console.log(`${endpoint} -- callDPE`);
      const data: ApiResponse = response.data;
      if (data.total === 0) {
        return [];
      }
      let filteredObjects = filterObjectKeys(data.aggs[0].results, KEYSTOKEEDPE) as ResultItemDPE[];
      return filteredObjects;
    } catch (error) {
      console.error(`Error fetching data endpoint ${endpoint}`, error);
      throw new HttpException(`Error fetching data endpoint ${endpoint}`, HttpStatus.NOT_FOUND);
    }
  }

  async getDPEDatas(addressObject: AddressObject): Promise<DPEAllData> {
    const endpoints = [
      'dpe-v2-logements-existants',
      'dpe-v2-tertiaire-2',
      'dpe-v2-logements-neufs',
      'dpe-tertiaire',
      'dpe-france',
    ];
    const DPEDataPromise = endpoints.map((endpoint) => this.callDPE(addressObject, endpoint));
    try {
      const results = await Promise.all(DPEDataPromise);
      return {
        DPEHabitatExistant: results[0],
        DPEHabitatNeuf: results[1],
        DPETertiaire: results[2],
        DPETertiaireAvant2021: results[3],
        DPEHabitatExistantAvant2021: results[4],
      } as DPEAllData;
    } catch (error) {
      console.error('Error fetching nature data:', error);
      // Return an empty object or handle the error as per your application's needs
      return {};
    }
  }

  RateDPE(DPE: ResultItemDPE[]): number {
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

    if (!DPE || DPE.length === 0) {
      return 0;
    }

    let totalScore = 0;
    DPE.forEach((item) => {
      // Use Etiquette_GES or classe_estimation_ges, whichever is present
      const gesScore = item.Etiquette_GES
        ? letterToNumber(item.Etiquette_GES)
        : letterToNumber(item.classe_estimation_ges);

      // Use Etiquette_DPE or classe_consommation_energie, whichever is present
      const dpeScore = item.Etiquette_DPE
        ? letterToNumber(item.Etiquette_DPE)
        : letterToNumber(item.classe_consommation_energie);

      totalScore += gesScore + dpeScore;
    });

    const average = totalScore / (DPE.length * 2);
    const rate = (average / 6) * 100;

    return rate;
  }

  getDPERates(DPEAllData: DPEAllData): RatesDPE {
    return {
      DPEHabitatExistant: this.RateDPE(DPEAllData.DPEHabitatExistant),
      DPEHabitatNeuf: this.RateDPE(DPEAllData.DPEHabitatNeuf),
      DPETertiaire: this.RateDPE(DPEAllData.DPETertiaire),
      DPETertiaireAvant2021: this.RateDPE(DPEAllData.DPETertiaireAvant2021),
      DPEHabitatExistantAvant2021: this.RateDPE(DPEAllData.DPEHabitatExistantAvant2021),
    };
  }
}
