import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Roles, RolesGuard } from '../service/roles.guards';
import { TokenService } from '../service/token.service';
import { UserService } from '../service/user.service';
import { User } from '@prisma/client';
import { Request, Response, response } from 'express';
import { CreateUserDto, LoginUserDto, serRoleUserDto } from '@server/users/userDTO';

@Controller('user')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
  ) {} //Inport the token service so I can use it in the controller

  @Get('login')
  async loginUser(@Body() data: CreateUserDto, @Res() response: Response) {
    const user = await this.userService.findUserByEmail(data.email);
    if (!user) throw new HttpException('User does not exist ', HttpStatus.UNAUTHORIZED);
    //Verify password
    if ( !this.userService.verifyPassword(data.password, user.password))
      throw new HttpException('Password incorect ', HttpStatus.UNAUTHORIZED);

    const signedJWT = this.tokenService.createJWT(user.id, user.role);
    // Set authorization header and send response
    response.cookie('authorization',`Bearer ${signedJWT}`, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000), // Expires in 1 hour
    });
    return response.status(HttpStatus.OK).send({ success: true, message: 'Login successfull' });
  }

  @Post('register')
  async registerUser(@Body() data: LoginUserDto, @Req() request: Request, @Res() response: Response) {
    // Verify if the email does not exist ?
    let  user = await this.userService.findUserByEmail(data.email);
    if (user) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT); // 409 Conflict
    }
    // Verify if the UUID store in the browser is not allready associated with an user
    let uuidToken = request.cookies['uuidtoken']; //Find cookie with name uuidtoken
    if (await this.userService.findUserByUUID(uuidToken)) {
      console.log('UUID allready associated with user, generate a new one and create user');
      uuidToken = this.tokenService.createUUID();
      response.cookie('uuidtoken', uuidToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 3600000), // Expires in 30 days
      });
      await this.userService.createUserWithUUID(uuidToken);
    }
    // Verify email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(data.email) && data.email) {
      throw new HttpException('Email not valid', HttpStatus.BAD_REQUEST); // 400 Bad Request
    }
    // hash the password
    const passwordRegex = /^.{9,}$/; //at least 8 char
    if (!passwordRegex.test(data.password) && data.password) {
      throw new HttpException(
        'Password not valid, should contain more than 8 characters',
        HttpStatus.BAD_REQUEST,
      ); // 400 Bad Request
    }
    const hashedPassword = await this.userService.hashPassword(data.password);

    // Update the user with UUID in the DB whith ashed password
    user = await this.userService.updateUserByUUID(uuidToken, data.email, hashedPassword);
    return response.status(HttpStatus.OK).send({ success: true, message: `User created successfully ${user}` });
  }
  @Get('logout')
  async logout(@Body() data: User) {
    try {
      response.clearCookie('authorization');
      return response.status(HttpStatus.OK).send({ success: true, message: 'Logged out successfully' });
    } catch (err) {
      throw new HttpException(`Logout failled with ${err}`, HttpStatus.CONFLICT);
    }
  }

  @Post('setrole')
  @Roles('lol')
  async setUserRole(@Body() data: serRoleUserDto) {
    let user = await this.userService.findUserByEmail(data.email);
    if (!user) throw new HttpException('User does not exist ', HttpStatus.UNAUTHORIZED);
    user = await this.userService.updateUserByUUID(user.uuid,undefined,undefined,undefined,data.role)

      console.log(user)
  }

}
