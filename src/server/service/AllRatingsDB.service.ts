import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Ratings } from '../../openDataSources/interfaceRatings';

@Injectable()
export class RatingsDBService {
  constructor(private prisma: PrismaService) {}

  async addRating(rating: Ratings): Promise<any> {
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
        },
      });
      console.log('...Value send without error to AllRating');
      return result.addressID;
    } catch (err) {
      throw new Error(`Error saving data to database: ${err.message}`);
    }
  }

  async linkUserIDToAddressID(userId: number, addressID: string): Promise<any> {
    console.log('userid : ' + userId);
    console.log('addressID : ' + addressID);
    // Check if userId exists in User table
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    console.log('userExists  '+ userExists)
    if (!userExists) {
      throw new Error('User not found');
    }

    // Check if addressID already exists in userAddressID table
    const addressExists = await this.prisma.userAddressID.findUnique({
      where: { addressID: addressID },
    });

    console.log('addressExists  '+ addressExists)

    if (addressExists) {
      throw new Error('AddressID already linked to another user');
    }

    return await this.prisma.userAddressID.create({
      data: {
        userId: userId,
        addressID: addressID,
      },
    });
  }
  // Add more methods as needed for different types of database operations
}
