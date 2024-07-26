import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { AddressService } from './fetch-Addresse/address.service';
import { AddressObject } from './fetch-Addresse/address';
import { parcCartoService } from './fetch-ParCarto/fetchParcCarto.service';
import { DpeService } from './fetch-DPE/fetchDpe.service';
import { DPEAllData } from './fetch-DPE/DPE';
import { georisqueService } from './fetchGeorisque/fetchGeorisque.service';
import { ParcCartoAllData } from './fetch-ParCarto/parcCarto';
import { GeorisqueAllData } from './fetchGeorisque/georisque';
import { EauAllData, EauPotableData } from './fetch-eau/eau';
import { EauService } from './fetch-eau/fetchEau.service';
// import { AddressDTO } from './dtoFetchData';

@Controller('v2/fetch')
export class FetchDataController {
  constructor(
    private AddressService: AddressService,
    private ParcCarto: parcCartoService,
    private DPE: DpeService,
    private georisque: georisqueService,
    private eau: EauService,
  ) {}

  /**
   * Fetch address from the API
   * @param dataQuery
   * @returns AddressObject
   */
  @Post('address')
  async fetchAddress(@Body() dataQuery: any): Promise<AddressObject> {
    return this.AddressService.findAddress(dataQuery);
  }

  @Post('parcCarto')
  async fetchParcCarto(@Body() addressObject: AddressObject): Promise<ParcCartoAllData> {
    const geoJsonAreaAroundPoint = this.ParcCarto.createGeoJSONCircleString(
      addressObject.geometry.coordinates[1],
      addressObject.geometry.coordinates[0],
      5000, //Rayon
      10, // Number of point
    );
    // Getting the data from the API
    let parcCartoAllData = await this.ParcCarto.getNatureDatas(geoJsonAreaAroundPoint);
    if (!parcCartoAllData) {
      console.error('Error while fetching ParcCarto data');
      return null;
    }
    parcCartoAllData = this.ParcCarto.ratesParcCarto(parcCartoAllData);

    return parcCartoAllData;
  }

  @Post('dpe')
  async fetchDPE(@Body() addressObject: AddressObject): Promise<DPEAllData> {
    const resultDPEHabitat = await this.DPE.getDPEDatas(addressObject);

    if (!resultDPEHabitat) {
      console.error('Error while fetching DPE data');
      return null;
    }
    const ratesDPEHabitat = this.DPE.getDPERates(resultDPEHabitat);

    return ratesDPEHabitat;
  }

  @Post('georisque')
  async fetchGeorisque(@Body() addressObject: AddressObject): Promise<GeorisqueAllData> {
    const georisqueAllData = await this.georisque.callAllApiGasparPromiseAll(addressObject);
    if (!georisqueAllData) {
      console.error('Error while fetching Georisque data');
      return null;
    }
    const ratesGaspar = this.georisque.rateGaspar(georisqueAllData);

    return this.georisque.groupRatesGeorique(georisqueAllData, ratesGaspar);
  }

  @Post('eau')
  async fetchEau(@Body() addressObject: AddressObject): Promise<EauAllData> {
    const rawResultEau = await this.eau.apiEau(addressObject);
    if (!rawResultEau || !rawResultEau.data) {
      console.error('Error while fetching Eau data');
      return null;
    }
    let dataEauPotable = this.eau.dataCalculation(rawResultEau);

    return { eauPotable: dataEauPotable, rateEauPotable: this.eau.eauAnalysis(dataEauPotable) };
  }
 
  @Get('ping')
  async ping() {
    return { success: true, message: 'Pong', status: HttpStatus.OK };
  }
}
