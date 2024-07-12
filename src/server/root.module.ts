import { Module } from '@nestjs/common';
import { DataRatingModule } from './V1/controller-ratings/ratings.module';
import { PrismaService } from './prisma/prisma.service';
import { FrontDataModule } from './V1/controller-frontData/frontData.module';
import { FetchDataModule } from './V2/fetchData/fetchData.module';

@Module({
  imports: [DataRatingModule, FrontDataModule,FetchDataModule],
  controllers: [],
  providers: [PrismaService], 
})
export class RootModule {}
