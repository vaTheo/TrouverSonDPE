import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Patch,
    Post,
    Req,
    Res,
    UseGuards,
  } from '@nestjs/common';
  import { Roles, RolesGuard } from '../service/roles.guards';
  import { TokenService } from '../service/token.service';
  import { UserService } from '../service/user.service';
  import { User } from '@prisma/client';
  import { Request, Response, response } from 'express';
  import { CreateUserDto, LoginUserDto, serRoleUserDto } from '@server/users/userDTO';
  import { RequestExtendsJWT } from '@server/midleware/JWTValidation';
  import { PrismaCallDBService } from '@server/service/prismaDB.service';
import { AuthService } from '@server/auth/auth.service';
  
  @Controller('user')
  @UseGuards(RolesGuard)
  export class UsersController {
    constructor(
      private authService: AuthService,
      private userService: UserService,
    ) {} //Inport the token service so I can use it in the controller
  
    @Post('login')
    async loginUser(@Body() data: CreateUserDto, @Res() response: Response) {
      const user = await this.userService.findUserByEmail(data.email);
      if (!user) throw new HttpException('User does not exist ', HttpStatus.UNAUTHORIZED);
      //Verify password
      if (!this.authService.verifyPassword(data.password, user.password))
        throw new HttpException('Password incorect ', HttpStatus.UNAUTHORIZED);
  
      const signedJWT = this.authService.createJWT(user.id, user.role);
      // Set authorization header and send response
      response.cookie('authorization', `Bearer ${signedJWT}`, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000), // Expires in 1 hour
      });
      return response.status(HttpStatus.OK).send({ success: true, message: 'Login successfull' });
    }
  
    @Post('register')
    async registerUser(@Body() data: LoginUserDto, @Req() request: Request, @Res() response: Response) {
      // Verify if the email does not exist ?
      let user = await this.userService.findUserByEmail(data.email);
      if (user) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT); // 409 Conflict
      }
      // Verify if the UUID store in the browser is not allready associated with an user
      // Ce truc de uuid dans les cookies c'est vraiment étrange... Je suis pas sur de comprendre à quoi ça sert
      let uuidToken = request.cookies['uuidtoken']; //Find cookie with name uuidtoken
      if (await this.userService.findUserByUUID(uuidToken)) {
        console.log('UUID allready associated with user, generate a new one and create user');
        uuidToken = this.tokenService.createUUID(); // <= ça t'en a pas 
        response.cookie('uuidtoken', uuidToken, {
          httpOnly: true,
          expires: new Date(Date.now() + 30 * 24 * 3600000), // Expires in 30 days
        });
        await this.userService.createUser(); // <= le uuid sera crée par defaut par prisma il te restera plusqu'à récupere l'user
      }
      // hash the password
      // Le password doit déjà être hashé lorsqu'il est envoyé sinon il navigue en clair et c'est dangereux
    // hash password devrait plus être dans un utils pck il peut être utilisé partout
      const hashedPassword = await this.userService.hashPassword(data.password);
  
      // Update the user with UUID in the DB whith ashed password
      user = await this.userService.updateUserByUUID(uuidToken, data.email, hashedPassword);
      return response
        .status(HttpStatus.OK)
        .send({ success: true, message: `User created successfully ${user}` });
    }

    // C'est plus un POST ça, ça trigger une action du côté de ton serveur
    @Get('logout')
    async logout() {
      try {
        response.clearCookie('authorization');
        return response.status(HttpStatus.OK).send({ success: true, message: 'Logged out successfully' });
      } catch (err) {
        throw new HttpException(`Logout failled with ${err}`, HttpStatus.CONFLICT);
      }
    }
  
    @Post('setrole')
    @Roles('admin')
    async setUserRole(@Body() data: serRoleUserDto) {
      try {
        let user = await this.userService.findUserByEmail(data.email);
        if (!user) throw new HttpException('User does not exist ', HttpStatus.UNAUTHORIZED);
        // Au lieux de passer plein d'argument undefined mieux vaut passer un Object {} ou tu defini que ce que t'as
        // user = await this.userService.updateUserByUUID({id: user.uuid, role: data.role})
        user = await this.userService.updateUserByUUID(user.uuid, undefined, undefined, undefined, data.role);
        
        // Nest fait automatiquement le taff du statut ect.
        return {
            success: true,
            message: `Role successfully changed ${user}`
        }
        return response
          .status(HttpStatus.OK)
          .send({ success: true, message: `Role successfully changed ${user}` });
      } catch (err) {
        throw new HttpException(`Role change error ${err}`, HttpStatus.CONFLICT);
      }
    }
  
    @Get('list')
    @Roles('admin')
    async getListUser(@Body() data: any) {}
  
    @Get('listaddress')
    @Roles('admin')
    async getListAddressIDsOfUser(@Body() data: any, @Req() request: RequestExtendsJWT) {
        // ça a plus sa place dans le user service
        // await this.userService.findAddressIDsByID(request?.user.userId)
      console.log(await this.PrismaCallDBService.findAddressIDsByID(request?.user.userId));
    }
  
    @Delete('delet')
    @Roles('user')
    async deletUser(@Body() data: any) {}
  
    @Get('user/:id')
    async getProfileByID(@Body() data: any) {}
  
    @Patch('user/:id')
    async patchProfileByID(@Body() data: any) {}
  }
  