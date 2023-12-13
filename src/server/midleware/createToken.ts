import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class CreateToken implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Your logic here$
    console.log('I m in the CreateToken INjectable')
    next();
  }
}
