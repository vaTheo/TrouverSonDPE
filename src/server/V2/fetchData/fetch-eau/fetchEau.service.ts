import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { EauPotableData } from './eau';
import axiosInstanceWithUserAdgent from '../../../utils/axiosInstance';
import { LyonCityCodes, MarseilleCityCodes, ParisCityCodes } from './arrondisment';
import { getFormattedDateYearsAgoAsString, saveDataToFile } from '../../../utils/utilities';
import { paramAnalyseEau } from './eau.limits';
import { AddressObject } from '../fetch-Addresse/address';
import { ResultatDis } from './api-eau';

/**
 * Doc: https://hubeau.eaufrance.fr/page/api-qualite-eau-potable
 */
@Injectable()
export class EauService {
  async apiEau(adressObject: AddressObject): Promise<ResultatDis> {
    let uniqueCodeReseau: string[] = [];
    let uniqueTypeAnalysis: string[] = [];
    const basURL = 'https://hubeau.eaufrance.fr/api/v1/qualite_eau_potable/';
    const endpoint = 'resultats_dis';
    //City code managment it appear Hub eau do not manage disctrict
    let cityCode = adressObject.properties.citycode;
    // TODO: Manage city conde des arrondissements des grandes villes
    if (LyonCityCodes.includes(cityCode)) {
      cityCode = '69123';
    }
    if (ParisCityCodes.includes(cityCode)) {
      cityCode = '75056';
    }
    if (MarseilleCityCodes.includes(cityCode)) {
      cityCode = '13055';
    }
    const codeCommune = `?code_commune=${cityCode}`;
    const dateMinPrelevement = `&date_min_prelevement=${getFormattedDateYearsAgoAsString(10)}`;

    // Get resultat Dis
    try {
      const response = await axiosInstanceWithUserAdgent.get(
        basURL + endpoint + codeCommune + dateMinPrelevement,
      );
      const resultatDis: ResultatDis = response.data;

      resultatDis.data.forEach((item) => {
        // regroup every code reseau for the city in one array
        if (!uniqueTypeAnalysis.includes(item.libelle_parametre)) {
          uniqueTypeAnalysis.push(item.libelle_parametre);
        }
      });
      type DataItem = {
        libelle_parametre: string;
      };

      const counts: Record<string, number> = {};

      resultatDis.data.forEach((item: DataItem) => {
        const libelle = item.libelle_parametre;

        if (!counts[libelle]) {
          counts[libelle] = 1;
        } else {
          counts[libelle]++;
        }
      });
      console.log('Finished getting : ' + endpoint + ' for ' + cityCode);
      return resultatDis;
    } catch (err) {
      const URLsend = basURL + endpoint + codeCommune + dateMinPrelevement;
      const urlErr = `-- URL= ${URL}${URLsend}`;
      if (axios.isAxiosError(err) && err.response?.data) {
        const responseData = err.response.data;
        // Check for known status codes
        if (err.response?.status === 404) {
          console.error(`Resource not found: ${responseData.message} ${urlErr}`);
        } else if (err.response?.status === 410) {
          console.error(`Resource no longer available: ${responseData.message} ${urlErr}`);
        } else {
          console.error(`Unexpected error: ${responseData.message} ${urlErr}`);
        }
      } else {
        console.error(`Non-HTTP error occurred: ${err.message} ${urlErr}`);
      }
    }
  }

  dataCalculation(resultatDis: ResultatDis): EauPotableData[] {
    try {
      //Object to keep track of total values and counts for each parameter
      const totals: Record<string, { total: number; count: number }> = {};
      resultatDis.data.forEach((item) => {
        const param = item.libelle_parametre;
        const value: number = item?.resultat_numerique || 0;

        // const value = item.resultat_numerique === 0: item.resultat_alphanumerique : item.resultat_numerique;

        // const test:number = item.resultat_alphanumerique.replace(/[<>=]/g, '')
        // Initialize the accumulator for this parameter if it's not already there
        if (!totals[param]) {
          totals[param] = { total: 0, count: 0 };
        }

        // Accumulate totals and counts
        totals[param].total += value;
        totals[param].count += 1;
      });

      // Calculate averages and check if they are within the range
      paramAnalyseEau.forEach((param) => {
        const data = totals[param.libelle_parametre];
        if (data) {
          const avg = data.total / data.count;
          param.totalAverage = avg;
          param.good = avg >= param.min && avg <= param.max;
          param.countValue = data.count; // Assigning countValue
        } else {
          param.totalAverage = 0;
          param.good = null;
          param.countValue = 0; // No occurrences found
        }
      });
      return paramAnalyseEau;
    } catch (err) {
      console.log('______________', err);
    }
  }

  eauAnalysis(eauPotableData: EauPotableData[]): number {
    let numberFail = 0;
    eauPotableData.forEach((element) => {
      if (!element.good) {
        numberFail += 1;
      }
    });

    if (!eauPotableData.length) {
      return null;
    }

    let rate = 100 - 20 * numberFail;
    return rate > 0 ? rate : 0;
  }
}
