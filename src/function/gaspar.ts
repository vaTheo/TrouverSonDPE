import { AddressObject } from 'src/interface';
import {
  CatnatData,
  CaviteData,
  GasprAPIResponse,
  AZIData,
  InstallationsClasseesData,
  MVTData,
  PAPIData,
  PCSData,
  RGAResponse,
  RadonData,
  RisquesData,
  SISData,
  TIMData,
  TRIData,
  ZonageSismiqueData,
} from 'src/function/utilities/Inetface/GeoRisque';

import { getCoordinatesAsString } from './utilities/addressFunction';
import axios, { Axios, AxiosError } from 'axios';
import { delay } from './utilities/utilities';

/*
 *DATASHEET API : https://www.georisques.gouv.fr/doc-api
 */
//API Gaspar management, given any valide endepoint return the response
const apiGaspar = async (addressObject: AddressObject, endpoint: string, rayon: string) => {
  let dataResponse: GasprAPIResponse;
  let data: any = [];
  const URL = 'https://www.georisques.gouv.fr/api/v1/';
  const coordone = getCoordinatesAsString(addressObject);
  let page = 1;

  try {
    do {
      const response = await axios.get(
        endpoint.includes('radon')
          ? `${URL}${endpoint}?code_insee=${addressObject.properties.citycode}&page=${page}`
          : `${URL}${endpoint}?latlon=${coordone}&rayon=${rayon}&page=${page.toString()}`,
      );
      dataResponse = response.data;
      data = [...data, ...dataResponse.data]; //Merge the two array
      if (dataResponse.next) {
        page++;
      }
      await delay(500);
    } while (dataResponse.next != null); //Continue untill response is not NULL
    return data;
  } catch (err) {
    const URLsend = endpoint.includes('radon')
      ? `${URL}${endpoint}?code_insee=${addressObject.properties.citycode}&page=${page}`
      : `${URL}${endpoint}?latlon=${coordone}&rayon=${rayon}&page=${page.toString()}`;
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
    return []; // return an array, maybe later I'll return a error object??
  }
};

//API Gaspar management, given any valide endepoint return the response
export const callAllApiGaspar = async (addressObject: AddressObject) => {
  const results = {
    azi: (await apiGaspar(addressObject, 'gaspar/azi', '10000')) as AZIData,
    catNat: (await apiGaspar(addressObject, 'gaspar/catnat', '10000')) as CatnatData,
    cavite: (await apiGaspar(addressObject, 'cavites', '10000')) as CaviteData,
    installationsClassees: (await apiGaspar(
      addressObject,
      'installations_classees',
      '10000',
    )) as InstallationsClasseesData,
    mvt: (await apiGaspar(addressObject, 'mvt', '10000')) as MVTData,
    papi: (await apiGaspar(addressObject, 'gaspar/papi', '10000')) as PAPIData,
    pcs: (await apiGaspar(addressObject, 'gaspar/pcs', '10000')) as PCSData,
    radon: (await apiGaspar(addressObject, 'radon', '10000')) as RadonData,
    risques: (await apiGaspar(addressObject, 'gaspar/risques', '10000')) as RisquesData,
    sis: (await apiGaspar(addressObject, 'sis', '10000')) as SISData,
    tim: (await apiGaspar(addressObject, 'gaspar/tim', '10000')) as TIMData,
    tri: (await apiGaspar(addressObject, 'gaspar/tri', '10000')) as TRIData,
    zonageSismique: (await apiGaspar(addressObject, 'zonage_sismique', '10000')) as ZonageSismiqueData,
  };
  return results;
};

//API Gaspar management, given any valide endepoint return the response
export const callAllApiGasparPromiseAll = async (addressObject: AddressObject) => {
  const endpoints = [
    { endpoint: 'gaspar/azi', type: 'AZIData', rayon: '10000' },
    { endpoint: 'gaspar/catnat', type: 'CatnatData', rayon: '10000' },
    { endpoint: 'cavites', type: 'CaviteData', rayon: '10000' },
    { endpoint: 'installations_classees', type: 'InstallationsClasseesData', rayon: '10000' },
    { endpoint: 'mvt', type: 'MVTData', rayon: '10000' },
    { endpoint: 'gaspar/papi', type: 'PAPIData', rayon: '10000' },
    { endpoint: 'gaspar/pcs', type: 'PCSData', rayon: '10000' },
    { endpoint: 'radon', type: 'RadonData', rayon: '10000' },
    { endpoint: 'gaspar/risques', type: 'RisquesData', rayon: '10000' },
    { endpoint: 'sis', type: 'SISData', rayon: '10000' },
    { endpoint: 'gaspar/tim', type: 'TIMData', rayon: '10000' },
    { endpoint: 'gaspar/tri', type: 'TRIData', rayon: '10000' },
    { endpoint: 'zonage_sismique', type: 'ZonageSismiqueData', rayon: '10000' },
  ];

  // Create an array of API call promises
  const apiCalls = endpoints.map(({ endpoint, type, rayon }) =>
    // Call apiGaspar function for each endpoint
    apiGaspar(addressObject, endpoint, rayon).then((data) => ({ [type]: data })),
  );
  // Await the resolution of all API call promises using Promise.all
  const resultsArray = await Promise.all(apiCalls);
  // Combine all resolved objects into a single object
  const results = Object.assign({}, ...resultsArray);

  return results;
};

/**Ce service permet de lister les Atlas de Zones Inondables (AZI)
 *  recensés sur le territoire concerné, suivant une emprise spatiale
 *  définie, à savoir un rayon de recherche pour un point défini,
 * une ou plusieurs communes. */
export const getAZI = async (addressObject: AddressObject) => {
  // const endpoint = '/api/v1/gaspar/azi';
  // const rayon = '1';
  // const data: GasprAPIResponse = await apiGaspar(addressObject, endpoint, rayon);
  // console.log(data);
};

/**Ce service permet de lister les arrêtés de catastrophe naturelle,
 * suivant une emprise spatiale définie, à savoir un rayon de recherche
 * pour un point défini, une ou plusieurs communes. */
export const getCatNat = async (addressObject: AddressObject) => {
  // const endpoint = '/api/v1/gaspar/catnat';
  // const rayon = '100';
  // const data: GasprAPIResponse = await apiGaspar(addressObject, endpoint, rayon);
};
/**Ce service permet de lister les arrêtés de catastrophe naturelle,
 * suivant une emprise spatiale définie, à savoir un rayon de recherche
 * pour un point défini, une ou plusieurs communes.
 * Donne notament les carieres */
export const getCavite = async (addressObject: AddressObject) => {
  // const endpoint = '/api/v1/cavites';
  // const rayon = '10000';
  // const data: GasprAPIResponse = await apiGaspar(addressObject, endpoint, rayon);
  // console.log(data);
};

/**Ce service permet de lister les Documents d'Information Communal
 * sur les Risques Majeurs (DICRIM) sur le territoire concerné,
 *  suivant une emprise spatiale définie, à savoir un rayon de
 * recherche pour un point défini, une ou plusieurs communes. */
export const getItallationsClassees = async (addressObject: AddressObject) => {
  // const endpoint = '/api/v1/installations_classees';
  // const rayon = '1000';
  // const data: GasprAPIResponse = await apiGaspar(addressObject, endpoint, rayon);
  // console.log(data);
};

/**Cette interface est conçue pour diffuser
 * les données sur le mouvement de terrain.
 */
export const getMVT = async (addressObject: AddressObject) => {
  // const endpoint = '/api/v1/mvt';
  // const rayon = '1000';
  // const data: GasprAPIResponse = await apiGaspar(addressObject, endpoint, rayon);
  // console.log(data);
};

/**Ce service permet de lister les Programmes d'Actions de Prévention des Inondations (PAPI)
 * recensés sur le territoire concerné, suivant une emprise spatiale définie, à savoir un
 *  rayon de recherche pour un point défini, une ou plusieurs communes.
 */
export const getPAPI = async (addressObject: AddressObject) => {
  // const endpoint = '/api/v1/gaspar/papi';
  // const rayon = '1000';
  // const data: GasprAPIResponse = await apiGaspar(addressObject, endpoint, rayon);
  // console.log(data);
};

/**Ce service permet de lister les Plans Communaux de Sauvegarde (PCS) recensés
 * sur le territoire concerné, suivant une emprise spatiale définie, à savoir un
 * rayon de recherche pour un point défini, une ou plusieurs communes.
 */
export const getPCS = async (addressObject: AddressObject) => {
  // const endpoint = '/api/v1/gaspar/pcs';
  // const rayon = '1000';
  // const data: GasprAPIResponse = await apiGaspar(addressObject, endpoint, rayon);
  // console.log(data);
};

/**Ce service permet de recherche le potentiel radon d'une ou plusieurs
 * communes. Attention pour les communes de Paris, Lyon et Marseille,
 * seules les informations à l'arrondissement sont disponibles.
 */
export const getRadon = async (addressObject: AddressObject) => {
  // const endpoint = '/api/v1/radon';
  // const rayon = '1000';
  // const data: GasprAPIResponse = await apiGaspar(addressObject, endpoint, rayon);
  // console.log(data);
};

/**Cette interface est conçue pour diffuser les données sur le retrait / gonflement
 *  des sols argileux.
 */
export const getRGA = async (addressObject: AddressObject) => {
  // const endpoint = '/api/v1/rga';
  // const rayon = '1000';
  // const data: GasprAPIResponse = await apiGaspar(addressObject, endpoint, rayon);
  // console.log(data);
};

/**Ce service permet de lister les types de risques recensés sur le territoire concerné,
 * suivant une emprise spatiale définie, à savoir un rayon de recherche pour un point défini,
 * une ou plusieurs communes.
 */
export const getRisques = async (addressObject: AddressObject) => {
  // const endpoint = '/api/v1/gaspar/risques';
  // const rayon = '1000';
  // const data: GasprAPIResponse = await apiGaspar(addressObject, endpoint, rayon);
  // console.log(data);
};

/**Ce service permet de lister les différents SIS(Secteurs d'informations sur les sols),
 * suivant une emprise spatiale définie, à savoir un rayon de recherche pour un point défini,
 * une ou plusieurs communes.
 */
export const getSIS = async (addressObject: AddressObject) => {
  // const endpoint = '/api/v1/sis';
  // const rayon = '1000';
  // const data: GasprAPIResponse = await apiGaspar(addressObject, endpoint, rayon);
  // console.log(data);
};

/**Ce service permet de lister les dossier de Transmission d'Information au Maire (TIM)
 * recensés sur le territoire concerné, suivant une emprise spatiale définie,
 * à savoir un rayon de recherche pour un point défini, une ou plusieurs communes.
 */
export const getTIM = async (addressObject: AddressObject) => {
  // const endpoint = '/api/v1/gaspar/tim';
  // const rayon = '1000';
  // const data: GasprAPIResponse = await apiGaspar(addressObject, endpoint, rayon);
  // console.log(data);
};

/**Ce service permet de lister les Territoires à Risques importants d'Inondation (TRI)
 *recensés sur le territoire concerné, suivant une emprise spatiale définie, à savoir
 un rayon de recherche pour un point défini, une ou plusieurs communes.
 */
export const getTRI = async (addressObject: AddressObject) => {
  // const endpoint = '/api/v1/gaspar/tri';
  // const rayon = '1000';
  // const data: GasprAPIResponse = await apiGaspar(addressObject, endpoint, rayon);
  // console.log(data);
};

/**Ce service permet de lister le zonage sismique, suivant une emprise spatiale définie,
 * à savoir un rayon de recherche pour un point défini, une ou plusieurs communes.
 */
export const getZonageSismique = async (addressObject: AddressObject) => {
  // const endpoint = '/api/v1/zonage_sismique';
  // const rayon = '1000';
  // const data: TRIResponse = await apiGaspar(addressObject, endpoint, rayon);
  // console.log(data);
};
