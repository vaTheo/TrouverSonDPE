import { Controller, Get, Body, Headers, Param } from '@nestjs/common';
import { findAddress } from '../../openDataSources/address/findAddress';
import { inputAddressObject, AddressObject } from '../../openDataSources/address/interfaceAddress';
import { analisysGaspar, callAllApiGasparPromiseAll } from '../../openDataSources/geoRisque/Georisque';
import { getDPE } from '../../openDataSources/DPE/getDPE';
import { dataCalculation, qualiteEau } from '../../openDataSources/Eau/qualiteEau';
import { GasparAllObject, ResultArrayGeoRisque } from '../../openDataSources/geoRisque/interfaceGeoRisque';
import { ParamAnalyseEau } from '../../openDataSources/Eau/interfaceEau';
import { eauAnalysis } from '../../openDataSources/Eau/eauAnalysis';

@Controller('ratingcontroller')
export class RatingController {
  @Get('')
  async getRatingOfAnAddress(
    @Body() data: inputAddressObject,
    @Headers('authorization') authorization: string,
    @Headers('userid') userid: string,
  ) {
    console.log('Received data: ', data);
    console.log('Authorization: ', authorization);
    console.log('UserID: ', userid);
    // Your logic here
    try {
      let dataGaspar: GasparAllObject;
      let dataEau: ParamAnalyseEau[];
      //Find the corresponding address
      const addressObject: AddressObject = await findAddress(data);
      const resultGaspar: ResultArrayGeoRisque = await callAllApiGasparPromiseAll(addressObject).then(
        (res) => {
          dataGaspar = res;
          return analisysGaspar(res);
        },
      );
      const resultDPE = await getDPE(addressObject).then((result) => {});
      const resultEau = await qualiteEau(addressObject).then((res) => {
        dataEau = dataCalculation(res);
        return eauAnalysis(dataEau);
      });

      return { ...resultGaspar, ...resultEau };
    } catch (err) {
      console.log(err);
    }
  }
}
