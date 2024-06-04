import { Module } from '@nestjs/common';
import { DataRatingModule } from './V1/controller-ratings/ratings.module';
import { PrismaService } from './prisma/prisma.service';
import { FrontDataModule } from './V1/controller-frontData/frontData.module';

@Module({
  imports: [DataRatingModule, FrontDataModule],
  controllers: [],
  providers: [PrismaService], 
})
export class RootModule {}
