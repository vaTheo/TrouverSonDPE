import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../service/token.service';
import { UserService } from '../service/user.service';


@Injectable()
export class AsUUID implements NestMiddleware {
  constructor(
    private tokenService: TokenService,
    private user: UserService,
  ) {}
  // To ensure that user can perform action before creating an account, create a token and create a new user
  async use(req: Request, res: Response, next: NextFunction) {
    // Extract the token from the request's cookies
    let uuidToken = req.cookies['uuidtoken']; // Assuming the token is stored under the key 'uuidtoken'
    if (!uuidToken || !(await this.tokenService.isUUIDExistingInDB(uuidToken))) {
      // If no valid token is found, create a new one
      uuidToken = this.tokenService.createUUID();

      // Create the new user in the DB
      this.user.createUserWithUUID(uuidToken);
      console.log(`UUID and user created in asUUID with UUID : ${uuidToken}`);
      // Set the new token in the response cookies
      res.cookie('uuidtoken', uuidToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 3600000), // Expires in 30 days
      });
    }

    // Proceed with the request
    next();
  }
}
