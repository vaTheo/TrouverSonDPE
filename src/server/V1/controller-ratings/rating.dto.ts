import { IsString, Length } from 'class-validator';
import { EnumEau } from '../DBjson-Eau/jsonEau';
import { EnumGeorisque } from '../DBjson-Georisque/jsonGeorisque';

export class AddressObjectThreeValueDTO {
  @Length(5, 5)
  @IsString()
  postCode: string;

  @IsString()
  city?: string;

  @IsString()
  street: string;
}
export class AddressObjectDTO{
  @IsString()
  address:string;
}
export class JsonGeorisqueDTO{
  @IsString()
  addressID:string
  
  @IsString()
  jsonData:EnumGeorisque
  
}

export class JsonEauDTO{
  @IsString()
  addressID:string
  
  @IsString()
  jsonData: EnumEau
  
}
