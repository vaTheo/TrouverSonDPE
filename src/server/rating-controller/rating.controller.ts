import { Controller, Get, Body, Headers, Param } from '@nestjs/common';
import { findAddress } from '../../openDataSources/address/findAddress';
import { inputAddressObject } from 'src/openDataSources/address/interfaceAddress';

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
      const addressObject = await findAddress(data);
      return addressObject 
    } catch (err) {
      console.log(err);
    }
  }
}
