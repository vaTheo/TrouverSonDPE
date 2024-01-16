import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { AsUUID } from '../../midleware/asUUID';
import { TokenService } from '../token/token.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RatingsDBService } from './ratingsDB.service';
import { isConnected } from '../../midleware/isConnected';
import { UserService } from '../../users/user.service';
import { FetchAddressService } from '@server/datarating/fetch-address/address.service';
import { FetchEauService } from '@server/datarating/fetch-eau/fetch-eau.service';
import { FetchGeorisqueService } from '@server/datarating/fetch-georisque/fetch-georisque.service';
import { DBJsonGeorisque } from './DBjson-Georisque/DBjsonGeorisque.service';
import { DBJsonEau } from './DBjson-Eau/DBjsonEau.service';
import { DBUserAddressInfo } from './DBUserAddressInfo/DBUserAddressInfo.service';
import { DBAddressInfo } from './DBaddressInfo/DBaddressInfo.service';
import { DBAllRatings } from './DBallRatings/DBallRatings.service';

@Module({
  imports: [],
  controllers: [RatingController],
  providers: [
    PrismaService,
    RatingsDBService,
    TokenService,
    UserService,
    FetchAddressService,
    FetchEauService,
    FetchGeorisqueService,
    DBJsonGeorisque,
    DBJsonEau,
    DBUserAddressInfo,
    DBAddressInfo,
    DBAllRatings,
  
  ], //Service and midlware
})
export class DataRatingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AsUUID, isConnected).forRoutes(RatingController); // Apply to all routes in RatingController
  }
}
