import axiosInstanceWithUserAdgent from "src/server/utils/axiosInstance";
import { AddressDTO } from "../dto";
import { AddressObject } from "./address";
import { HttpException, HttpStatus } from "@nestjs/common";


export class AddressService{

    async findAddress(inputAddressObject: AddressDTO): Promise<AddressObject> {
      const URLapi = 'https://api-adresse.data.gouv.fr/search/?q=';
        const querryString = inputAddressObject.address.replace(/\s/g, '+'); //replace space by +
    
        try {
          const response = await axiosInstanceWithUserAdgent.get(`${URLapi}${querryString}`);
          if (!response.data) {
            throw new Error('Error undifined value return by getBANid');
          }
          if (response.data.features.length >> 1) {
            // throw new HttpException('Multiple address find ', HttpStatus.PRECONDITION_FAILED);
            console.error('Multiple address find ' + response.data.features);
          }
          if (!response.data.features[0]) {
            throw new HttpException('No address find', HttpStatus.BAD_REQUEST);
          }
          return response.data.features[0]; //Return the first adresse (Usually there is only one)
        } catch (err) {
          console.error(err);
          throw err;
        }
      }
}