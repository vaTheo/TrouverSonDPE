import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AsUUID } from '../../midleware/asUUID';
import { TokenService } from '../token/token.service';
import { PrismaService } from '../../prisma/prisma.service';
import { isConnected } from '../../midleware/isConnected';
import { UserService } from '../../users/user.service';
import { DBJsonGeorisque } from '../../DBjson-Georisque/DBjsonGeorisque.service';
import { DBUserAddressInfo } from '../../DBUserAddressInfo/DBUserAddressInfo.service';
import { DBAddressInfo } from '../../DBaddressInfo/DBaddressInfo.service';
import { DBAllRatings } from '../../DBallRatings/DBallRatings.service';
import { DBJsonEau } from '../../DBjson-Eau/DBjsonEau.service';
import { DBJsonParcCarto } from '../../DBJson-ParcCarto/DBjsonParcCarto.service';
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
    DBUserAddressInfo,
    DBAddressInfo,
    DBAllRatings,
    DBJsonParcCarto,
    DBJsonDPE,
    FrontDataService,
    TokenService,
    UserService
  ], //Service and midlware
})
export class FrontDataModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AsUUID, isConnected).forRoutes(FrontData); // Apply to all routes in RatingController
  }
}
