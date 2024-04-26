import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DBJsonGeorisque } from '../DBjson-Georisque/DBjsonGeorisque.service';
import { DBAddressInfo } from '../DBaddressInfo/DBaddressInfo.service';
import { DBAllRatings } from '../DBallRatings/DBallRatings.service';
import { DBJsonEau } from '../DBjson-Eau/DBjsonEau.service';
import { DBJsonParcCarto } from '../DBJson-ParcCarto/DBjsonParcCarto.service';
import { DBJsonDPE } from '@server/DBJson-DPE/DBjsonDPE.service';
import { FrontData } from './frontData.controller';
import { FrontDataService } from './frontData.service';

@Module({
  imports: [],
  controllers: [FrontData],
  providers: [
    PrismaService,
    DBJsonGeorisque,
    DBJsonEau,
    DBAddressInfo,
    DBAllRatings,
    DBJsonParcCarto,
    DBJsonDPE,
    FrontDataService,
  ], //Service and midlware
})
export class FrontDataModule {}