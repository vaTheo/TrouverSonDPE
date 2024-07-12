import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { RatingsDBService } from './ratingsDB.service';
import { DBJsonGeorisque } from '../DBjson-Georisque/DBjsonGeorisque.service';
import { DBAddressInfo } from '../DBaddressInfo/DBaddressInfo.service';
import { DBAllRatings } from '../DBallRatings/DBallRatings.service';
import { FetchParcCarto } from '../datarating/fetch-cartoParc/fetch-cartoParc.service';
import { DBJsonEau } from '../DBjson-Eau/DBjsonEau.service';
import { DBJsonParcCarto } from '../DBJson-ParcCarto/DBjsonParcCarto.service';
import { FetchDPE } from '../datarating/fetch-dpe/fetchDPE.service';
import { FetchAddressService } from '../datarating/fetch-address/address.service';
import { FetchEauService } from '../datarating/fetch-eau/fetch-eau.service';
import { FetchGeorisqueService } from '../datarating/fetch-georisque/fetch-georisque.service';
import { DBJsonDPE } from '../DBJson-DPE/DBjsonDPE.service';

@Module({
  imports: [],
  controllers: [RatingController],
  providers: [
    PrismaService,
    RatingsDBService,
    FetchAddressService,
    FetchEauService,
    FetchGeorisqueService,
    DBJsonGeorisque,
    DBJsonEau,
    DBAddressInfo,
    DBAllRatings,
    FetchParcCarto,
    DBJsonParcCarto,
    FetchDPE,
    DBJsonDPE,
  ], //Service and midlware
})
export class DataRatingModule {}
