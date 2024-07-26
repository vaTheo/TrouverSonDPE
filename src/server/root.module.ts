import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { FetchDataModule } from './V2/fetchData/fetchData.module';

@Module({
  imports: [FetchDataModule],
  controllers: [],
  providers: [PrismaService], 
})
export class RootModule {}
