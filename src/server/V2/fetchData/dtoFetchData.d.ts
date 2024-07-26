import { IsString } from "class-validator";

export class AddressDTO{
    @IsString()
    address:string;
  }