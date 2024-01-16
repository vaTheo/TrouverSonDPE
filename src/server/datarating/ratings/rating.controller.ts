import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  HttpStatus,
  HttpException,
  Post,
  Param,
} from '@nestjs/common';
import { AddressObject } from '../fetch-address/address';
import { getDPE } from '../fetch-dpe/getDPE';
import { GeorisqueAllData, RatesGeoRisque } from '../fetch-georisque/Georisque';
import { eauAnalysis } from '../fetch-eau/eauAnalysis';
import { TokenService } from '../token/token.service';
import { RatingsDBService } from './ratingsDB.service';
import { Ratings } from './ratings';
import { RolesGuard } from '../../midleware/roles.guards';
import { RequestExtendsJWT } from '@server/midleware/JWTValidation';
import { FetchAddressService } from '@server/datarating/fetch-address/address.service';
import { FetchEauService } from '@server/datarating/fetch-eau/fetch-eau.service';
import { FetchGeorisqueService } from '@server/datarating/fetch-georisque/fetch-georisque.service';
import { EauPotableData, RatesEau, eauAllData } from '../fetch-eau/eau';
import { AddressObjectDTO, JsonEauDTO, JsonGeorisqueDTO } from './rating.dto';
import { DBJsonGeorisque } from './DBjson-Georisque/DBjsonGeorisque.service';
import { DBJsonEau } from './DBjson-Eau/DBjsonEau.service';
import { DBUserAddressInfo } from './DBUserAddressInfo/DBUserAddressInfo.service';
import { DBAddressInfo } from './DBaddressInfo/DBaddressInfo.service';
import { DBAllRatings } from './DBallRatings/DBallRatings.service';
import axios from 'axios';

@Controller('ratingcontroller')
@UseGuards(RolesGuard)
export class RatingController {
  constructor(
    private tokenService: TokenService,
    private RatingsDBService: RatingsDBService,
    private fetchAddressService: FetchAddressService,
    private fetchEauService: FetchEauService,
    private fetchGeorisqueService: FetchGeorisqueService,
    private DBjsonGeorisque: DBJsonGeorisque,
    private DBjsonEau: DBJsonEau,
    private DBAddressInfo: DBAddressInfo,
    private DBUserAddressInfo: DBUserAddressInfo,
    private DBAllRatings: DBAllRatings,
  ) {} //Inport the token service so I can use it in the controller

  @Get('fetchrate')
  // @Roles('admin', 'user')
  async fetchRatingOfAnAddress(@Body() dataQuerry: AddressObjectDTO, @Req() req: RequestExtendsJWT) {
    try {
      let dataGeorisque: GeorisqueAllData;
      //Find the corresponding address
      const addressObject: AddressObject = await this.fetchAddressService.findAddress(dataQuerry);

      const addressID = { addressID: addressObject.properties.id }; //Unique BAN ID of the address

      const resultDPE = await getDPE(addressObject).then((result) => {});
      // Concatenate alle ratings Data
      const allRate = {
        ...addressID,
      } as Ratings;
      //TODO:
      // const dataSourceID = await this.dataSourceAddresseID.createEntry(
      //   req.user.userId,
      //   addressObject,
      // );

      // const dataSourceIDSaved = await this.RatingsDBService.addRating(dataSourceID, allRate);

      const json = await this.RatingsDBService.getAZIDataByAddressID(addressObject.properties.id);

      return allRate;
    } catch (err) {
      throw err;
    }
  }

  @Get('getrate')
  // @Roles('admin', 'user')
  async getExistingRate(@Body() dataQuery: any /*AddressObjectDTO*/, @Req() req: RequestExtendsJWT) {
    console.log('on va la ou pas ??????????');
    console.log(dataQuery);
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
  /**
   * Retrieves Georisque data for a specific address based on the provided address ID.
   *
   * This function handles a GET request to the 'fetchGeorisque/:addressID' endpoint. It checks
   * whether the Georisque data related to the given address ID is present in the database. If the
   * data exists, it fetches and returns the associated Georisque ratings. If not, it returns null.
   *
   * @param param The address ID extracted from the URL parameter. It is used to identify the
   *              specific address for which Georisque data is being requested.
   * @param req   The extended request object of type RequestExtendsJWT, which includes additional
   *              user information such as user ID and UUID.
   *
   * @returns     A Promise resolving to the Georisque rates associated with the address ID if found,
   *              or null if no data is available.
   */
  @Get('fetchgeorisque/:addressID')
  async fetchGerosiqueByAddressID(
    @Param('addressID') param: string,
    @Req() req: RequestExtendsJWT,
  ): Promise<RatesGeoRisque | null> {
    if (await this.DBjsonGeorisque.isFilled(param)) {
      return this.DBAllRatings.getRatingGeorisqueByAddressId(param);
    } else {
      return null;
    }
  }
  /**
   * Handles a POST request to fetch Georisque data for a specific address and analyze it.
   *
   * This endpoint, accessible at 'fetchGeorisque', accepts an address object in the request body.
   * It first logs the received data for debugging purposes. Then, it initiates a series of API
   * calls (via the `fetchGeorisqueService`) to gather comprehensive Georisque data related to the
   * provided address. After receiving this data, it is analyzed to produce Georisque rates.
   * The collected data is also stored in the database for future reference. Finally, the analyzed
   * Georisque rates are returned as the response.
   *
   * @param dataQuerry The address object received in the request body, used to fetch and analyze
   *                   Georisque data.
   * @param req        The extended request object of type RequestExtendsJWT, which includes additional
   *                   user information such as user ID and UUID.
   *
   * @returns          A Promise resolving to the analyzed Georisque rates for the provided address.
   */
  @Post('fetchgeorisque')
  async postGerosique(
    @Body() addressObject: AddressObject,
    @Req() req: RequestExtendsJWT,
  ): Promise<RatesGeoRisque> {
    console.log('fetchGeorisque');
    console.log(addressObject);
    let dataGeorisque: GeorisqueAllData;
    const resultGaspar: RatesGeoRisque = await this.fetchGeorisqueService
      .callAllApiGasparPromiseAll(addressObject)
      .then((result) => {
        dataGeorisque = result;
        return this.fetchGeorisqueService.analisysGaspar(result);
      });
    await this.DBjsonGeorisque.addJsonGeorisque(addressObject.properties.id, dataGeorisque);
    await this.DBAllRatings.updateRating(addressObject.properties.id, resultGaspar);
    return resultGaspar;
  }

  @Get('fetcheau/:addressID')
  async fetchEauByAddressID(
    @Param('addressID') param: string,
    @Req() req: RequestExtendsJWT,
  ): Promise<RatesEau | null> {
    if (await this.DBjsonEau.isFilled(param)) {
      return this.DBAllRatings.getRatingEauByAddressId(param);
    } else {
      return null;
    }
  }
  @Post('fetcheau')
  async postEau(@Body() addressObject: AddressObject, @Req() req: RequestExtendsJWT): Promise<RatesEau> {
    let dataEauPotable: EauPotableData[];
    let eauAllData: eauAllData;
    const resultEau: RatesEau = await this.fetchEauService.qualiteEau(addressObject).then((res) => {
      dataEauPotable = this.fetchEauService.dataCalculation(res);
      console.log(dataEauPotable);
      return eauAnalysis(dataEauPotable);
    });
    eauAllData = { eauPotable: dataEauPotable };
    await this.DBjsonEau.addJsonEau(addressObject.properties.id, eauAllData);
    await this.DBAllRatings.updateRating(addressObject.properties.id, resultEau);

    return resultEau;
  }

  /**
   * Handles a POST request to obtain rate information for a specified address.
   *
   * This endpoint, accessible at 'getrate', takes an address object DTO as input and performs
   * several operations to fetch and associate address information with a user. It first
   * retrieves the address ID based on the provided address details. If the address information
   * is not already in the database, it creates a new entry. Then, it associates this address
   * with the current user's ID. The function ultimately returns the processed address object.
   *
   * @param dataQuery The address details provided in the request body. It should be an instance
   *                  of AddressObjectDTO, which includes city, postcode, and street.
   * @param req       The extended request object, which includes additional user information such
   *                  as user ID and UUID. It should be an instance of RequestExtendsJWT.
   *
   * @returns         A Promise that resolves to an AddressObject containing the address details.
   *
   * @throws HttpException with a status of BAD_REQUEST if any error occurs during the process.
   */
  @Post('getrate')
  // @Roles('admin', 'user')
  async postAskForRate(
    @Body() dataQuery: AddressObjectDTO,
    @Req() req: RequestExtendsJWT,
  ): Promise<AddressObject> {
    try {
      // Get address ID of the specific address
      let inputaddressObject: AddressObjectDTO = {
        city: dataQuery.city,
        postCode: dataQuery.postCode,
        street: dataQuery.street,
      };
      const addressObject: AddressObject = await this.fetchAddressService.findAddress(inputaddressObject);
      let addressInfo = await this.DBAddressInfo.findAddressInfo(addressObject.properties.id);
      // Fill address info DB
      if (!addressInfo) {
        addressInfo = await this.DBAddressInfo.createEntry(req.user.userUUID, addressObject);
      }
      // link user with addressID
      const result = await this.DBUserAddressInfo.associatAddresseToUser(
        req.user.userUUID,
        addressInfo.addressID,
      );
      if (!(await this.DBAllRatings.entryExists(addressObject.properties.id))) {
        await this.DBAllRatings.createEntry(addressObject.properties.id);
      }
      // Return the address object
      return addressObject;
    } catch (err) {
      throw new HttpException('error in Post getrate' + err, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('getjsongeorisque')
  // @Roles('admin', 'user')
  async getJsonGeorisque(@Body() dataQuerry: JsonGeorisqueDTO) {
    return await this.DBjsonGeorisque.getSpecificJsonDataGeorisque(dataQuerry.addressID, dataQuerry.jsonData);
  }
  @Get('getjsoneau')
  // @Roles('admin', 'user')
  async getJsonEau(@Body() dataQuerry: JsonEauDTO) {
    return await this.DBjsonEau.getSpecificJsonDataEau(dataQuerry.addressID, dataQuerry.jsonData);
  }
  @Get('testnewapi')
  // @Roles('admin', 'user')
  async testnewapi(@Body() dataQuerry: any) {
    try {
      const response = await axios.get(
        `https://api.vigieau.beta.gouv.fr/reglementation?commune=38430`,
      );
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
    // const response = await axios.get(`https://api.vigieau.beta.gouv.fr/reglementation?commune=${dataQuerry}&profil={profil}`)
  }
}
