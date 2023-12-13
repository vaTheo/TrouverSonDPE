import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class RateAddress implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Your logic here$
    console.log('I m in the RateAddress INjectable')
    next();
  }
}
