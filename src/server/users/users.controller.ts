import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Roles, RolesGuard } from '../service/roles.guards';
import { TokenService } from '../service/token.service';
import { UserService } from '../service/user.service';
import { User } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import { Request, Response } from 'express';

@Controller('user')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(
    private tokenService: TokenService,
    private user: UserService,
  ) {} //Inport the token service so I can use it in the controller

  @Get('login')
  async loginUser(@Body() data: any) {
    console.log(data);
  }

  @Post('register')
  async registerUser(@Body() data: User, @Req() request: Request, @Res() response: Response) {
    // Verify if the email does not exist ?
    const user = await this.user.findUserByEmail(data.email);
    if (user) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT); // 409 Conflict
    }
    // Verify if the UUID store in the browser is not allready associated with an user
    let uuidToken = request.cookies['uuidtoken']; //Find cookie with name uuidtoken
    if (this.user.findUserByUUID(uuidToken)){
        console.log('UUID allready associated with user, generate a new one and create user')
        uuidToken = this.tokenService.createUUID()
        response.cookie('uuidtoken', uuidToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 30 * 24 * 3600000), // Expires in 30 days
          });
          this.user.createUserWithUUID(uuidToken)
    }    
    // Verify email 
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
     if (!emailRegex.test(data.email) && data.email) {
        throw new HttpException('Email not valid', HttpStatus.BAD_REQUEST); // 400 Bad Request
    }
    // hash the password
    const passwordRegex = /^.{9,}$/;;
    if (!passwordRegex.test(data.password) && data.password) {
       throw new HttpException('Password not valid, should contain more than 8 characters', HttpStatus.BAD_REQUEST); // 400 Bad Request
   }
    const hashedPassword = await this.user.hashPassword(data.password);
    
    
    // Create the user in the DB
    await this.user.updateUserByUUID(uuidToken,data.email,hashedPassword)
    return 'userCreated'
  }
}
