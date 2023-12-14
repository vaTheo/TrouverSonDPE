import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RatingController } from './rating-controller/rating.controller';
import { AsToken } from './midleware/asToken';
import { TokenService } from './service/createToken';
import { PrismaService } from './service/prisma.service';
import { AllRatingsDBService } from './service/AllRatingsDB.service';

@Module({
  imports: [],
  controllers: [RatingController],
  providers: [PrismaService,AllRatingsDBService,TokenService], //Service and midlware
})
export class RatingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AsToken)
      .forRoutes(RatingController); // Apply to all routes in RatingController
  }
}
