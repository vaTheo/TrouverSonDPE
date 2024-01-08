import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@server/prisma/prisma.service';
@Injectable()
export class DBUserAddressInfo {
  constructor(private prisma: PrismaService) {}

  async associatAddresseToUser(userID: string, addressInfoId: string) {
    console.log(userID)
    console.log(addressInfoId)
    try {
      const userAddressInfo = await this.prisma.userAddressInfo.create({
        data: {
          userId: userID,
          addressInfoId: addressInfoId,
        },
      });
      return userAddressInfo;
    } catch (err) {
      console.error(err);
    }
  }

  async findUsersAddressIDsByID(userID: string): Promise<string[]> {
    const userAddresses = await this.prisma.userAddressInfo.findMany({
      where: {
        userId: userID,
      },
      select: {
        addressInfoId: true, // Only select the dataSourceId (address ID)
      },
    });

    // Extract the address IDs from the query result
    const addressIDs = userAddresses.map((ua) => ua.addressInfoId);

    return addressIDs;
  }
}
