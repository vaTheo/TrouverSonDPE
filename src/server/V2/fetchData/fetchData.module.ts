import { Module } from '@nestjs/common';
import { FetchDataController } from './fetchData.controller';

@Module({
  imports: [],
  controllers: [FetchDataController],
  providers: [
  ], //Service and midlware
})
export class DataRatingModule {}
