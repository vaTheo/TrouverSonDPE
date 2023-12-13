import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { RatingModule } from './server/app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(RatingModule);
    app.enableCors(); // Enables CORS for all origins

    const port = 3000;
    await app.listen(port);
    console.log(`Server is running on http://localhost:${port}`); // Log when the server starts
  } catch (error) {
    console.error('Error during Nest application startup', error); // Log if there's an error
  }
}
bootstrap();
