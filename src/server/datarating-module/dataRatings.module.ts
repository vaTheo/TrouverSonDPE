import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RatingController } from '../datarating-controller/rating.controller';
import { AsUUID } from '../midleware/asUUID';
import { TokenService } from '../service/token.service';
import { PrismaService } from '../service/prisma.service';
import { RatingsDBService } from '../service/ratingsDB.service';
import { isConnected } from '../midleware/isConnected';
import { UserService } from '../service/user.service';

@Module({
  imports: [],
  controllers: [RatingController],
  providers: [PrismaService,RatingsDBService,TokenService,UserService], //Service and midlware
})
export class DataRatingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AsUUID,isConnected)
      .forRoutes(RatingController); // Apply to all routes in RatingController
  }
}

