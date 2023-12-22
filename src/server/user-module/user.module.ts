import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PrismaService } from '../service/prisma.service';
import { TokenService } from '../service/token.service';
import { UserService } from '../service/user.service';
import { UsersController } from '../users/users.controller';
import { AsUUID } from '@server/midleware/asUUID';
import { PrismaCallDBService } from '@server/service/prismaDB.service';

@Module({
    imports: [],
    controllers: [UsersController],
    providers: [PrismaService,TokenService,UserService,PrismaCallDBService], //Service and midlware  
})
export class UserModule {}

