import { Controller, Get, Body, Headers, Param, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { findAddress } from '../../openDataSources/address/findAddress';
import { inputAddressObject, AddressObject } from '../../openDataSources/address/interfaceAddress';
import { analisysGaspar, callAllApiGasparPromiseAll } from '../../openDataSources/geoRisque/Georisque';
import { getDPE } from '../../openDataSources/DPE/getDPE';
import { dataCalculation, qualiteEau } from '../../openDataSources/Eau/qualiteEau';
import { GeorisqueAllData, RateArrayGeoRisque } from '../../openDataSources/geoRisque/interfaceGeoRisque';
import { EauPotableData } from '../../openDataSources/Eau/interfaceEau';
import { eauAnalysis } from '../../openDataSources/Eau/eauAnalysis';
import { TokenService } from '../service/token.service';
import { RatingsDBService } from '../service/ratingsDB.service';
import { Ratings } from '../../openDataSources/interfaceRatings';
import { PrismaService } from '../service/prisma.service';
import { Roles, RolesGuard } from '../service/roles.guards';
import { RequestExtendsJWT } from '@server/midleware/JWTValidation';
import { response } from 'express';


@Controller('ratingcontroller')
@UseGuards(RolesGuard)
export class RatingController {
  constructor(
    private tokenService: TokenService,
    private RatingsDBService: RatingsDBService,
  ) {} //Inport the token service so I can use it in the controller

  @Get('fetchrate')
  @Roles('admin', 'user')
  async fetchRatingOfAnAddress(@Body() data: inputAddressObject, @Req() req: RequestExtendsJWT) {
    try {
      let dataGeorisque: GeorisqueAllData;
      let dataEau: EauPotableData[];
      //Find the corresponding address
      const addressObject: AddressObject = await findAddress(data);
      const addressID = { addressID: addressObject.properties.id }; //Unique ID of the address

      if (this.RatingsDBService.addresExist(addressObject)) {
      }

      console.log(addressObject);
      const resultGaspar: RateArrayGeoRisque = await callAllApiGasparPromiseAll(addressObject).then(
        (result) => {
          dataGeorisque = result;
          return analisysGaspar(result);
        },
      );
      const resultDPE = await getDPE(addressObject).then((result) => {});
      const resultEau = await qualiteEau(addressObject).then((res) => {
        dataEau = dataCalculation(res);
        return eauAnalysis(dataEau);
      });
      // Concatenate alle ratings Data
      const allRate = {
        ...addressID,
        ...resultGaspar,
        ...resultEau,
      } as Ratings;

      if (await this.RatingsDBService.userExist(req.user.userId)) {
      }
      if (!(await this.RatingsDBService.addresExist(addressObject))) {
      }
      const dataSourceID = await this.RatingsDBService.createDataSourceAddressID(
        req.user.userId,
        addressObject,
      );

      const dataSourceIDSaved = await this.RatingsDBService.addRating(dataSourceID, allRate);

      await this.RatingsDBService.addJsonGeorisque(dataSourceID, dataGeorisque);
      const json = await this.RatingsDBService.getAZIDataByAddressID(addressObject.properties.id);

      return { dataSourceIDSaved };
      // Link addressID with user ID
      // return response
      // .status(HttpStatus.OK)
      // .send({ success: true, message: `Data saved successfully` });;
    } catch (err) {
      console.log(err);
    }
  }

  @Get('getchrate')
  @Roles('admin', 'user')
  async getExistingRate(@Body() data: inputAddressObject, @Req() req: RequestExtendsJWT) {}
}
