import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PrismaService } from '../service/prisma.service';
import { TokenService } from '../service/token.service';
import { UserService } from '../service/user.service';
import { UsersController } from '../users/users.controller';
import { AsUUID } from '@server/midleware/asUUID';

@Module({
    imports: [],
    controllers: [UsersController],
    providers: [PrismaService,TokenService,UserService], //Service and midlware  
})
export class UserModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(AsUUID)
          .forRoutes(UsersController); // Apply to all routes in RatingController
      }
}
