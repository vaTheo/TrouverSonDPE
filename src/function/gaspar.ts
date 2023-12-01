import { AddressObject } from 'src/interface';
import {
  CatnatApiResponse,
  CaviteApiResponse,
  GasprApiResponseAZI,
  InstallationsClasseesDataItem,
  MVTApiResponse,
  PAPIResponse,
  PCSResponse,
  RGAResponse,
  RadonResponse,
  RisquesResponse,
  SISResponse,
  TIMResponse,
  TRIResponse,
} from 'src/function/utilities/Inetface/GeoRisque';

import { getCoordinatesAsString } from './utilities/addressFunction';
import axios from 'axios';

//API Gaspar management, given any valide endepoint return the response
const apiGaspar = async (addressObject: AddressObject, endpoint: String, rayon: string) => {
  const URL = 'https://www.georisques.gouv.fr';
  const coordone = getCoordinatesAsString(addressObject);
  const response = await axios.get(URL + endpoint + '?latlon=+' + coordone + '&rayon=' + rayon);
  return response.data;
};

/**Ce service permet de lister les Atlas de Zones Inondables (AZI)
 *  recensés sur le territoire concerné, suivant une emprise spatiale
 *  définie, à savoir un rayon de recherche pour un point défini,
 * une ou plusieurs communes. */
export const getAZI = async (addressObject: AddressObject) => {
  const endpoint = '/api/v1/gaspar/azi';
  const rayon = '1';

  const data: GasprApiResponseAZI = await apiGaspar(addressObject, endpoint, rayon);
  console.log(data);
};

/**Ce service permet de lister les arrêtés de catastrophe naturelle,
 * suivant une emprise spatiale définie, à savoir un rayon de recherche
 * pour un point défini, une ou plusieurs communes. */
export const getCatNat = async (addressObject: AddressObject) => {
  const endpoint = '/api/v1/gaspar/catnat';
  const rayon = '100';

  const data: CatnatApiResponse = await apiGaspar(addressObject, endpoint, rayon);
};
/**Ce service permet de lister les arrêtés de catastrophe naturelle,
 * suivant une emprise spatiale définie, à savoir un rayon de recherche
 * pour un point défini, une ou plusieurs communes.
 * Donne notament les carieres */
export const getCavite = async (addressObject: AddressObject) => {
  const endpoint = '/api/v1/cavites';
  const rayon = '10000';
  const data: CaviteApiResponse = await apiGaspar(addressObject, endpoint, rayon);
  console.log(data);
};

/**Ce service permet de lister les Documents d'Information Communal
 * sur les Risques Majeurs (DICRIM) sur le territoire concerné,
 *  suivant une emprise spatiale définie, à savoir un rayon de
 * recherche pour un point défini, une ou plusieurs communes. */
export const getItallationsClassees = async (addressObject: AddressObject) => {
  const endpoint = '/api/v1/installations_classees';
  const rayon = '1000';
  const data: InstallationsClasseesDataItem = await apiGaspar(addressObject, endpoint, rayon);
  console.log(data);
};

/**Cette interface est conçue pour diffuser
 * les données sur le mouvement de terrain.
 */
export const getMVT = async (addressObject: AddressObject) => {
  const endpoint = '/api/v1/mvt';
  const rayon = '1000';
  const data: MVTApiResponse = await apiGaspar(addressObject, endpoint, rayon);
  console.log(data);
};

/**Ce service permet de lister les Programmes d'Actions de Prévention des Inondations (PAPI)
 * recensés sur le territoire concerné, suivant une emprise spatiale définie, à savoir un
 *  rayon de recherche pour un point défini, une ou plusieurs communes.
 */
export const getPAPI = async (addressObject: AddressObject) => {
  const endpoint = '/api/v1/gaspar/papi';
  const rayon = '1000';
  const data: PAPIResponse = await apiGaspar(addressObject, endpoint, rayon);
  console.log(data);
};

/**Ce service permet de lister les Plans Communaux de Sauvegarde (PCS) recensés
 * sur le territoire concerné, suivant une emprise spatiale définie, à savoir un
 * rayon de recherche pour un point défini, une ou plusieurs communes.
 */
export const getPCS = async (addressObject: AddressObject) => {
  const endpoint = '/api/v1/gaspar/pcs';
  const rayon = '1000';
  const data: PCSResponse = await apiGaspar(addressObject, endpoint, rayon);
  console.log(data);
};

/**Ce service permet de recherche le potentiel radon d'une ou plusieurs
 * communes. Attention pour les communes de Paris, Lyon et Marseille,
 * seules les informations à l'arrondissement sont disponibles.
 */
export const getRadon = async (addressObject: AddressObject) => {
  const endpoint = '/api/v1/radon';
  const rayon = '1000';
  const data: RadonResponse = await apiGaspar(addressObject, endpoint, rayon);
  console.log(data);
};

/**Cette interface est conçue pour diffuser les données sur le retrait / gonflement
 *  des sols argileux.
 */
export const getRGA = async (addressObject: AddressObject) => {
  const endpoint = '/api/v1/rga';
  const rayon = '1000';
  const data: RGAResponse = await apiGaspar(addressObject, endpoint, rayon);
  console.log(data);
};

/**Ce service permet de lister les types de risques recensés sur le territoire concerné,
 * suivant une emprise spatiale définie, à savoir un rayon de recherche pour un point défini,
 * une ou plusieurs communes.
 */
export const getRisques = async (addressObject: AddressObject) => {
  const endpoint = '/api/v1/gaspar/risques';
  const rayon = '1000';
  const data: RisquesResponse = await apiGaspar(addressObject, endpoint, rayon);
  console.log(data);
};

/**Ce service permet de lister les différents SIS(Secteurs d'informations sur les sols),
 * suivant une emprise spatiale définie, à savoir un rayon de recherche pour un point défini,
 * une ou plusieurs communes.
 */
export const getSIS = async (addressObject: AddressObject) => {
  const endpoint = '/api/v1/sis';
  const rayon = '1000';
  const data: SISResponse = await apiGaspar(addressObject, endpoint, rayon);
  console.log(data);
};

/**Ce service permet de lister les dossier de Transmission d'Information au Maire (TIM)
 * recensés sur le territoire concerné, suivant une emprise spatiale définie,
 * à savoir un rayon de recherche pour un point défini, une ou plusieurs communes.
 */
export const getTIM = async (addressObject: AddressObject) => {
  const endpoint = '/api/v1/gaspar/tim';
  const rayon = '1000';
  const data: TIMResponse = await apiGaspar(addressObject, endpoint, rayon);
  console.log(data);
};

/**Ce service permet de lister les Territoires à Risques importants d'Inondation (TRI)
 *recensés sur le territoire concerné, suivant une emprise spatiale définie, à savoir
 un rayon de recherche pour un point défini, une ou plusieurs communes.
 */
export const getTRI = async (addressObject: AddressObject) => {
  const endpoint = '/api/v1/gaspar/tri';
  const rayon = '1000';
  const data: TRIResponse = await apiGaspar(addressObject, endpoint, rayon);
  console.log(data);
};

/**Ce service permet de lister le zonage sismique, suivant une emprise spatiale définie,
 * à savoir un rayon de recherche pour un point défini, une ou plusieurs communes.
 */
export const getZonageSismique = async (addressObject: AddressObject) => {
  const endpoint = '/api/v1/zonage_sismique';
  const rayon = '1000';
  const data: TRIResponse = await apiGaspar(addressObject, endpoint, rayon);
  console.log(data);
};
