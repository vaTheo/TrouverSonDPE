import { Body, Controller, Get } from '@nestjs/common';
import { AddressDTO } from './dto';
import { AddressService } from './fetch-Addresse/address.service';
import { AddressObject } from './fetch-Addresse/address';

@Controller('v2/fetch')
export class FetchDataController {
  constructor(private AddressService: AddressService) {} //Inport the token service so I can use it in the controller

  /**
   * Fetch address from the API
   * @param dataQuery
   * @returns AddressObject
   */
  @Get('address')
  async fetchAddress(@Body() dataQuery: AddressDTO): Promise<AddressObject> {
    return this.AddressService.findAddress(dataQuery);
  }

  @Get('parcCarto')
  async fetchParcCarto(@Body() addressObject: AddressObject): Promise<any> {



    return 
  }
}
