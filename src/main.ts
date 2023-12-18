import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { RootModule } from './server/root/root.module';
import cookieParser from 'cookie-parser';

//Nest server management
async function bootstrap() {
  try {
    const app = await NestFactory.create(RootModule);
    app.enableCors(); // Enables CORS for all origins
    app.use(cookieParser());


    const port = 3000;
    await app.listen(port);
    console.log(`Server is running on http://localhost:${port}`); // Log when the server starts
  } catch (error) {
    console.error('Error during Nest application startup', error); // Log if there's an error
  }
}
bootstrap();
