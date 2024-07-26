import { computeDestinationPoint } from 'geolib';
import { Injectable } from '@nestjs/common';
import { GeolibInputCoordinates } from 'geolib/es/types';
import { filterObjectKeys } from '../../../utils/utilities';
import * as turf from '@turf/turf';
import axiosInstanceWithUserAdgent from '../../../utils/axiosInstance';
import { CartoParcResponse, FeatureCarto } from './externalApiParcCarto';
import { KEYSTOKEEPCARTO } from './keysToKeep';
import { ParcCartoAllData, RatesParcCarto } from './parcCarto';

@Injectable()
export class parcCartoService {
  createGeoJSONCircleString(
    latitude: number,
    longitude: number,
    radius: number,
    numPoints: number = 100,
  ): string {
    const points: Array<[number, number]> = [];
    const deltaAngle: number = 360 / numPoints;

    for (let i = 0; i < numPoints; i++) {
      const angle: number = deltaAngle * i;
      const point: GeolibInputCoordinates = computeDestinationPoint({ latitude, longitude }, radius, angle);

      // Convert longitude and latitude to numbers
      const lng: number = +point.longitude;
      const lat: number = +point.latitude;

      points.push([lng, lat]);
    }

    // Ensure the polygon is closed by repeating the first point at the end
    points.push(points[0]);
    // Structure that apicarto take into account
    const string: string = JSON.stringify({
      type: 'Polygon',
      coordinates: [points],
    });
    return string;
  }

  async callNatureData(endpoint: string, stringGEOJSON: string): Promise<FeatureCarto> {
    try {
      const response = await axiosInstanceWithUserAdgent.get(
        `https://apicarto.ign.fr/api${endpoint}?geom=${stringGEOJSON}`,
      );
      const data: CartoParcResponse = response.data;
      // calculate area

      data.features.forEach((feature) => {
        try {
          const area = turf.area(feature.geometry);
          feature['area'] = area; // Add area to the properties
        } catch (error) {
          console.error('Error calculating area for feature:', error);
        }
      });
      let filteredObjects = filterObjectKeys(data.features, KEYSTOKEEPCARTO) as FeatureCarto;
      return filteredObjects;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  async getNatureDatas(circleGeoJson: string): Promise<ParcCartoAllData> {
    const endpoints = [
      '/nature/natura-habitat',
      '/nature/natura-oiseaux',
      '/nature/rnc',
      '/nature/rnn',
      '/nature/znieff1',
      '/nature/znieff2',
      '/nature/pn',
      '/nature/pnr',
      '/nature/rncf',
    ];

    const natureDataPromises = endpoints.map((endpoint) => this.callNatureData(endpoint, circleGeoJson));

    try {
      const results = await Promise.all(natureDataPromises);

      return {
        rate: 0,
        naturaHabitat: results[0],
        naturaOiseaux: results[1],
        rnc: results[2],
        rnn: results[3],
        znieff1: results[4],
        znieff2: results[5],
        pn: results[6],
        pnr: results[7],
        rncf: results[8],
      } as ParcCartoAllData;
    } catch (error) {
      console.error('Error fetching nature data:', error);
      return {};
    }
  }

  ratesParcCarto(cartoAllData: ParcCartoAllData): ParcCartoAllData {
    let rate: number = 0;
    const offsetParc = 5;
    const offsetZone = 3;

    rate =
      cartoAllData.rnc.length * offsetParc +
      cartoAllData.rnn.length * offsetParc +
      cartoAllData.pn.length * offsetParc +
      cartoAllData.pnr.length * offsetParc +
      cartoAllData.rncf.length * offsetParc +
      cartoAllData.naturaHabitat.length * offsetZone +
      cartoAllData.naturaOiseaux.length * offsetZone +
      cartoAllData.znieff1.length * offsetZone +
      cartoAllData.znieff2.length * offsetZone;
      cartoAllData.rate = rate;

    return cartoAllData;
  }
}
