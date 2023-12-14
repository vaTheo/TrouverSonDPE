import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AllRatings } from 'src/openDataSources/interfaceRatings';

@Injectable()
export class AllRatingsDBService {
  constructor(private prisma: PrismaService) {}

  async addRating(rating: AllRatings): Promise<any> {
    console.log('...Sending value to database');
    try {
      const result = await this.prisma.allRatings.create({
        data: {
          addressID: rating.addressID,
          eauAnalysis: rating.eauAnalysis,
          AZIData: rating.AZIData,
          CatnatData: rating.CatnatData,
          InstallationsClasseesData: rating.InstallationsClasseesData,
          MVTData: rating.MVTData,
          RadonData: rating.RadonData,
          RisquesData: rating.RisquesData,
          SISData: rating.SISData,
          TRIData: rating.TRIData,
          ZonageSismiqueData: rating.ZonageSismiqueData,
        } ,
      });
      console.log('...Value send without error');
      console.log(result)
      return result;
    } catch (err) {
      throw new Error(`Error saving data to database: ${err.message}`);
    }
  }

  // Add more methods as needed for different types of database operations
}
