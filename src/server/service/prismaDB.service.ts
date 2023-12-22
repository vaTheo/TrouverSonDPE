import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AllRatings } from '@prisma/client';


@Injectable()
export class PrismaCallDBService {
  constructor(private prisma: PrismaService) {}

  async findAddressIDsByID(id: number): Promise<string[]> {
    const userWithAddresseIDs = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        DataSourceAddressID: true, // Includes the related userAddressID records
      },
    });
    if (!userWithAddresseIDs) {
      throw new Error('User not found');
    }
    // Map the userAddressID records to their addressID
    const addressIDs = userWithAddresseIDs.DataSourceAddressID.map((uAddress) => uAddress.addressID);

    return addressIDs;
  }

  async findRatingsByAddressID(addressID: string): Promise<AllRatings> {
    const ratings = await this.prisma.allRatings.findUnique({
      where: {
        addressID: addressID,
      },
    });
    return ratings;
  }
}
