import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RatingController } from './rating-controller/rating.controller';
import { AsToken } from './midleware/asToken';
import { CreateToken } from './midleware/createToken';

@Module({
  imports: [],
  controllers: [RatingController],
  providers: [CreateToken],
})
export class RatingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AsToken,CreateToken)
      .forRoutes(RatingController); // Apply to all routes in RatingController
  }
}
