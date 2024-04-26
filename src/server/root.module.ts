import { Module } from '@nestjs/common';
import { DataRatingModule } from './controller-ratings/ratings.module';
import { PrismaService } from '@server/prisma/prisma.service';
import { FrontDataModule } from './controller-frontData/frontData.module';

@Module({
  imports: [DataRatingModule, FrontDataModule],
  controllers: [],
  providers: [PrismaService], 
})
export class RootModule {}
