import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { RootModule } from './server/root.module';
import cookieParser from 'cookie-parser';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

//Dotenv for environment variables
dotenv.config();
//Nest server management
async function bootstrap() {
  try {
    const app = await NestFactory.create(RootModule);
    app.enableCors({
      origin: ['https://geonote.fly.dev','http://localhost:3000'],
      credentials: true,
    });
    app.use(cookieParser());
    app.useGlobalPipes(
      // use to validate types on HTTP requests
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => new BadRequestException(errors),
      }),
    );
    const port = 3001;
    await app.listen(port);
    console.log(`Server is running on port ${port}`); // Log when the server starts
  } catch (error) {
    console.error('Error during Nest application startup', error); // Log if there's an error
  }
}
bootstrap();
