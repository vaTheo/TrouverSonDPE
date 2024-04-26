import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RatingsDBService } from './ratingsDB.service';
import { FetchAddressService } from '@server/datarating/fetch-address/address.service';
import { FetchEauService } from '@server/datarating/fetch-eau/fetch-eau.service';
import { FetchGeorisqueService } from '@server/datarating/fetch-georisque/fetch-georisque.service';
import { DBJsonGeorisque } from '../DBjson-Georisque/DBjsonGeorisque.service';
import { DBAddressInfo } from '../DBaddressInfo/DBaddressInfo.service';
import { DBAllRatings } from '../DBallRatings/DBallRatings.service';
import { FetchParcCarto } from '../datarating/fetch-cartoParc/fetch-cartoParc.service';
import { DBJsonEau } from '../DBjson-Eau/DBjsonEau.service';
import { DBJsonParcCarto } from '../DBJson-ParcCarto/DBjsonParcCarto.service';
import { FetchDPE } from '../datarating/fetch-dpe/fetch-DPE.service';
import { DBJsonDPE } from '@server/DBJson-DPE/DBjsonDPE.service';

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
