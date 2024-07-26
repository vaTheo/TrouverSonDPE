import { Injectable } from '@nestjs/common';
import { AddressObject } from '../fetch-Addresse/address';
import { GasprAPIResponse, InstallationsClasseesData } from './externalApi';
import axiosInstanceWithUserAdgent from 'src/server/utils/axiosInstance';
import { delay, filterObjectKeys, getCoordinatesAsString, getDistanceBetweenTwoPoint, sortObject } from 'src/server/utils/utilities';
import { KEYSTOKEEPGEORISQUE } from './keysToKeep';
import { GeorisqueAllData, RatesGeoRisque } from './georisque';
import {
  AZIAnalysis,
  CATNATAnalysis,
  installationClasseAnalysis,
  mvtAnalysis,
  radonAnalysis,
  risqueAnalysis,
  sisAnalysis,
  sysmiqueAnalysis,
  TRIAnalysis,
} from './georisqueAnalysis';
import axios from 'axios';

@Injectable()
export class georisqueService {
  /*
   *DATASHEET API : https://www.georisques.gouv.fr/doc-api
   * V1.9.0 OAS 3.0
   * 1000call/min
   */

  //API Gaspar management, given any valide endepoint return the response
  async apiGaspar(addressObject: AddressObject, endpoint: string, rayon: string) {
    let dataResponse: GasprAPIResponse;
    let data: any = [];
    const URL = 'https://georisques.gouv.fr/api/v1/';

    const coordone = getCoordinatesAsString(addressObject);
    let page = 1;

    try {
      do {
        const sentURL = endpoint.includes('radon')
          ? `${URL}${endpoint}?code_insee=${addressObject.properties.citycode}&page=${page}`
          : `${URL}${endpoint}?latlon=${coordone}&rayon=${rayon}&page=${page.toString()}`;
        const response = await axiosInstanceWithUserAdgent.get(sentURL);
        dataResponse = response.data;
        data = [...data, ...dataResponse.data]; //Merge the two array
        if (dataResponse.next) {
          page++;
        }
        await delay(50);
      } while (dataResponse.next != null && page <= 15); //Continue untill response is not NULL
      const yearsToInclude = [
        '2024',
        '2023',
        '2022',
        '2021',
        '2020',
        '2019',
        '2018',
        '2017',
        '2016',
        '2015',
        '2014',
        '2013',
        '2012',
        '2011',
        '2010',
      ];
      //Filter the data
      let filteredObjects = filterObjectKeys(data, KEYSTOKEEPGEORISQUE);
      if (endpoint == 'gaspar/catnat') {
        filteredObjects = sortObject(filteredObjects, 'date_debut_evt');
        // Filter oldest years
        filteredObjects = filteredObjects.filter((item) => {
          return yearsToInclude.some((year) => item.date_debut_evt.includes(year));
        });
      } else if (endpoint == 'mvt') {
        filteredObjects = sortObject(filteredObjects, 'date_debut');
        // Filter oldest years
        filteredObjects = filteredObjects.filter((item) => {
          return yearsToInclude.some((year) => item.date_debut.includes(year));
        });
      } else if (endpoint == 'installations_classees') {
        // Get distance btw addresse and installation + sort by distence ascending order
        filteredObjects.forEach((e) => {
          // getDistanceBetweenTwoPoint(e.latitude, e.longitude, addressObject.geometry.coordinates[1], addressObject.geometry.coordinates[0])
          if (
            e.latitude &&
            e.longitude &&
            addressObject.geometry.coordinates[1] &&
            addressObject.geometry.coordinates[0]
          ) {
            e.distance = getDistanceBetweenTwoPoint(
              e.latitude,
              addressObject.geometry.coordinates[1], //Latitude
              addressObject.geometry.coordinates[0], //Longitude
              e.longitude,
            );
          }
        });
        filteredObjects.sort(
          (a: InstallationsClasseesData, b: InstallationsClasseesData) => a.distance - b.distance,
        );
      }
      console.log('Finished getting : ' + endpoint + ', at page ' + page);

      return filteredObjects;
    } catch (err) {
      const URLsend = endpoint.includes('radon')
        ? `${URL}${endpoint}?code_insee=${addressObject.properties.citycode}&page=${page}`
        : `${URL}${endpoint}?latlon=${coordone}&rayon=${rayon}&page=${page.toString()}`;
      const urlErr = `-- URL= ${URLsend}`;
      if (axios.isAxiosError(err) && err.response?.data) {
        const responseData = err.response.data;
        // Check for known status codes
        if (err.response?.status === 404) {
          console.error(`Resource not found: ${responseData.message} ${urlErr}`);
        } else if (err.response?.status === 410) {
          console.error(`Resource no longer available: ${responseData.message} ${urlErr}`);
        } else if (err.response?.status === 403) {
          console.error(`Access FORBIDEN: ${responseData.message} ${urlErr}`);
        } else {
          console.error(`Unexpected error: ${responseData.message} ${urlErr}`);
        }
      } else {
        console.error(`Non-HTTP error occurred: ${err.message} ${urlErr}`);
      }
      return []; // return an array, maybe later I'll return a error object??
    }
  }

  //API Gaspar management, given any valide endepoint return the response
  async callAllApiGasparPromiseAll(addressObject: AddressObject): Promise<GeorisqueAllData> {
    const endpoints = [
      { endpoint: 'gaspar/azi', type: 'AZIData', rayon: '1' },
      { endpoint: 'gaspar/catnat', type: 'CatnatData', rayon: '1' },
      { endpoint: 'installations_classees', type: 'InstallationsClasseesData', rayon: '2000' },
      { endpoint: 'mvt', type: 'MVTData', rayon: '2000' },
      { endpoint: 'radon', type: 'RadonData', rayon: '1' },
      { endpoint: 'gaspar/risques', type: 'RisquesData', rayon: '1' },
      { endpoint: 'sis', type: 'SISData', rayon: '2000' },
      { endpoint: 'gaspar/tri', type: 'TRIData', rayon: '1' },
      { endpoint: 'zonage_sismique', type: 'ZonageSismiqueData', rayon: '1' },
    ];

    // Create an array of API call promises
    const apiCalls = endpoints.map(({ endpoint, type, rayon }) =>
      // Call apiGaspar function for each endpoint
      this.apiGaspar(addressObject, endpoint, rayon).then((data) => ({ [type]: data })),
    );
    // Await the resolution of all API call promises using Promise.all
    const resultsArray = await Promise.all(apiCalls);
    // Combine all resolved objects into a single object

    const results = Object.assign({}, ...resultsArray);

    return results;
  }

  rateGaspar(dataObject: GeorisqueAllData): RatesGeoRisque {
    const gasparSizes: Record<string, number | undefined> = {};
    const gasparPoints: Record<string, number | undefined> = {};
    for (const key in dataObject) {
      if (dataObject.hasOwnProperty(key)) {
        const element = dataObject[key as keyof GeorisqueAllData];
        gasparSizes[key] = Array.isArray(element) ? element.length : undefined;
        gasparPoints[key] = undefined; //Construc gasparPoints structure for future usage
      }
    }
    // Function call for note managements of each parameters
    gasparPoints.RadonData = radonAnalysis(dataObject.RadonData);
    gasparPoints.MVTData = mvtAnalysis(dataObject.MVTData);
    gasparPoints.SISData = sisAnalysis(dataObject.SISData);
    gasparPoints.TRIData = TRIAnalysis(dataObject.TRIData);
    gasparPoints.AZIData = AZIAnalysis(dataObject.AZIData);
    gasparPoints.RisquesData = risqueAnalysis(dataObject.RisquesData);
    gasparPoints.CatnatData = CATNATAnalysis(dataObject.CatnatData);
    gasparPoints.ZonageSismiqueData = sysmiqueAnalysis(dataObject.ZonageSismiqueData);
    gasparPoints.InstallationsClasseesData = installationClasseAnalysis(dataObject.InstallationsClasseesData);

    console.log('gasparPoints : ', gasparPoints);
    return gasparPoints;
  }

  async groupRatesGeorique(
    georisqueAllData: GeorisqueAllData,
    ratesGeorisque: RatesGeoRisque,
  ): Promise<GeorisqueAllData> {
    georisqueAllData.ratesZoneInnondable = this.zoneInnondable(
      ratesGeorisque.AZIData,
      ratesGeorisque.TRIData,
    );
    georisqueAllData.ratesCatastropheNaturelle = this.CatastropheNaturelle(ratesGeorisque.CatnatData);
    georisqueAllData.ratesInstallationClassees = this.InstallationClassees(
      ratesGeorisque.InstallationsClasseesData,
    );
    georisqueAllData.ratesRisqueLocaux = this.risqueLocaux(
      ratesGeorisque.MVTData,
      ratesGeorisque.RadonData,
      ratesGeorisque.ZonageSismiqueData,
    );
    georisqueAllData.ratesRisqueGeneraux = this.risqueGeneraux(ratesGeorisque.RisquesData);

    georisqueAllData.ratesPolutionSol = this.pollutionSol(ratesGeorisque.SISData);

    return georisqueAllData
  }

  private average(...nums: Array<number | null>): number {
    let sum = 0;
    let count = 0;

    nums.forEach((num) => {
      if (num !== null) {
        sum += num;
        count++;
      }
    });

    return count === 0 ? 0 : Math.round(sum / count);
  }

  private eau(num1: number | null, num2: number | null): number {
    return this.average(num1, num2);
  }

  private zoneInnondable(num1: number | null, num2: number | null): number {
    return this.average(num1, num2);
  }

  private CatastropheNaturelle(num1: number | null): number {
    return this.average(num1);
  }

  private InstallationClassees(num1: number | null): number {
    return this.average(num1);
  }
  private pollutionSol(num1: number | null): number {
    return this.average(num1);
  }

  private risqueLocaux(num1: number | null, num2: number | null, num3: number | null): number {
    return this.average(num1, num2, num3);
  }

  private risqueGeneraux(num1: number | null): number {
    return this.average(num1);
  }
}
