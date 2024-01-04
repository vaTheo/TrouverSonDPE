import { Controller, Get, Body, UseGuards, Req, HttpStatus, HttpException } from '@nestjs/common';
import { AddressObject } from '../fetch-address/address';
import { getDPE } from '../fetch-dpe/getDPE';
import { GeorisqueAllData, RatesGeoRisque } from '../fetch-georisque/Georisque';
import { eauAnalysis } from '../fetch-eau/eauAnalysis';
import { TokenService } from '../token/token.service';
import { RatingsDBService } from './ratingsDB.service';
import { Ratings } from './ratings';
import { Roles, RolesGuard } from '../../midleware/roles.guards';
import { RequestExtendsJWT } from '@server/midleware/JWTValidation';
import { FetchAddressService } from '@server/datarating/fetch-address/address.service';
import { FetchEauService } from '@server/datarating/fetch-eau/fetch-eau.service';
import { FetchGeorisqueService } from '@server/datarating/fetch-georisque/fetch-georisque.service';
import { EauPotableData, RatesEau } from '../fetch-eau/eau';
import { AddressObjectDTO, JsonEauDTO, JsonGeorisqueDTO } from './rating.dto';
import { JsonGeorisqueDB } from './json-Georisque/jsonGeorisque.service';
import { JsonEauDB } from './json-Eau/jsonEau.service';

@Controller('ratingcontroller')
@UseGuards(RolesGuard)
export class RatingController {
  constructor(
    private tokenService: TokenService,
    private RatingsDBService: RatingsDBService,
    private fetchAddressService: FetchAddressService,
    private fetchEauService: FetchEauService,
    private fetchGeorisqueService: FetchGeorisqueService,
    private jsonGeorisqueDB: JsonGeorisqueDB,
    private jsonEauDB: JsonEauDB,
  ) {} //Inport the token service so I can use it in the controller

  @Get('fetchrate')
  @Roles('admin', 'user')
  async fetchRatingOfAnAddress(@Body() dataQuerry: AddressObjectDTO, @Req() req: RequestExtendsJWT) {
    try {
      let dataGeorisque: GeorisqueAllData;
      let dataEau: EauPotableData[];
      //Find the corresponding address
      const addressObject: AddressObject = await this.fetchAddressService.findAddress(dataQuerry);

      const addressID = { addressID: addressObject.properties.id }; //Unique BAN ID of the address

      const resultGaspar: RatesGeoRisque = await this.fetchGeorisqueService
        .callAllApiGasparPromiseAll(addressObject)
        .then((result) => {
          dataGeorisque = result;
          return this.fetchGeorisqueService.analisysGaspar(result);
        });
      const resultDPE = await getDPE(addressObject).then((result) => {});
      const resultEau: RatesEau = await this.fetchEauService.qualiteEau(addressObject).then((res) => {
        dataEau = this.fetchEauService.dataCalculation(res);
        return eauAnalysis(dataEau);
      });
      // Concatenate alle ratings Data
      const allRate = {
        ...addressID,
        ...resultGaspar,
        ...resultEau,
      } as Ratings;

      const dataSourceID = await this.RatingsDBService.createDataSourceAddressID(
        req.user.userId,
        addressObject,
      );

      const dataSourceIDSaved = await this.RatingsDBService.addRating(dataSourceID, allRate);

      await this.jsonGeorisqueDB.addJsonGeorisque(dataSourceID, dataGeorisque);
      const json = await this.RatingsDBService.getAZIDataByAddressID(addressObject.properties.id);

      return allRate;
    } catch (err) {
      throw err;
    }
  }

  @Get('getrate')
  @Roles('admin', 'user')
  async getExistingRate(@Body() dataQuery: AddressObjectDTO, @Req() req: RequestExtendsJWT) {
    try {
      const addressObject = await this.fetchAddressService.findAddress(dataQuery);

      if (!addressObject) {
        throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
      }

      const rate = await this.RatingsDBService.getRatingsByAddressID(addressObject);
      if (!rate) {
        throw new HttpException('Rate not found for the given address', HttpStatus.NOT_FOUND);
      }

      return rate;
    } catch (error) {
      // Log the error for server-side reference
      console.error(error);

      // Throw an HTTP exception with a generic message for client-side
      throw new HttpException(
        'An error occurred while processing your request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getjsongeorisque')
  @Roles('admin', 'user')
  async getJsonGeorisque(@Body() dataQuerry: JsonGeorisqueDTO) {
    return await this.jsonGeorisqueDB.getSpecificJsonDataGeorisque(dataQuerry.addressID, dataQuerry.jsonData);
  }
  @Get('getjsoneau')
  @Roles('admin', 'user')
  async getJsonEau(@Body() dataQuerry: JsonEauDTO) {
    return await this.jsonEauDB.getSpecificJsonDataEau(dataQuerry.addressID, dataQuerry.jsonData);
  }
}
