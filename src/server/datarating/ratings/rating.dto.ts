import { IsString, Length } from 'class-validator';
import { jsonGeorisque } from './json-Georisque/jsonGeorisque';
import { jsonEau } from './json-Eau/jsonEau';

export class AddressObjectDTO {
  @Length(5, 5)
  @IsString()
  postCode: string;

  @IsString()
  City?: string;

  @IsString()
  street: string;
}

export class JsonGeorisqueDTO{
  @IsString()
  addressID:string
  
  @IsString()
  jsonData:keyof jsonGeorisque
  
}

export class JsonEauDTO{
  @IsString()
  addressID:string
  
  @IsString()
  jsonData:keyof jsonEau
  
}
