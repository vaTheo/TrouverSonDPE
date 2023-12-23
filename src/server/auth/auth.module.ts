import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule,
  ],
  controllers: [],
  providers: [AuthService],
})
export class AuthModule {}
