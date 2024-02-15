import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { jsonDPE } from './jsonDPE';
import { jsonDPEMapping } from './jsonDPE.const';
import { DPEAllData } from '@server/datarating/fetch-dpe/DPE';
@Injectable()
export class DBJsonDPE {
  constructor(private prisma: PrismaService) {}
  /**
   *
   * @param addressID
   * @param jsonToGet
   * @returns
   */
  async JgetSpecificJson(addressID: string, jsonToGet: keyof jsonDPE): Promise<any | null> {
    // Convert jsonToGet to actual database field
    const dbField = jsonDPEMapping[jsonToGet];
    if (!dbField) {
      throw new NotFoundException(`Invalid field name: ${jsonToGet}`);
    }

    const dataSourceWithJsonData = await this.prisma.addressInfo.findUnique({
      where: { addressID: addressID },
      include: {
        jsonDataDPE: {
          select: { [dbField]: true },
          take: 1, // Assuming one-to-one relation or taking the first entry
        },
      },
    });
    if (
      !dataSourceWithJsonData ||
      !dataSourceWithJsonData.jsonDataDPE ||
      dataSourceWithJsonData.jsonDataDPE.length === 0
    ) {
      throw new NotFoundException(`No JSON data found for addressID: ${addressID}`);
    }

    const jsonData = dataSourceWithJsonData.jsonDataDPE[0][dbField] as string;
    if (jsonData === null || jsonData === undefined) {
      throw new NotFoundException(`No JSON data found for addressID: ${addressID} and field: ${jsonToGet}`);
    }
    return await JSON.parse(jsonData);
  }

  /**
   *
   * @param dataSourceID
   *
   */
  async addJson(addressID: string, dataDPE: DPEAllData) {
    try {
      const createData: any = { addressID: addressID };
      const fields: Array<keyof DPEAllData> = Object.keys(dataDPE) as Array<keyof DPEAllData>;

      fields.forEach((field) => {
        if (dataDPE[field]) {
          createData[field] = JSON.stringify(dataDPE[field]);
        }
      });

      await this.prisma.jsonDataDPE.create({ data: createData });
    } catch (err) {
      console.error(`Error in addJsonDPE: ${err.message}`);
    }
  }
  async isFilled(addressID: string): Promise<boolean> {
    try {
      const count = await this.prisma.jsonDataDPE.count({
        where: {
          addressID: addressID,
        },
      });

      return count > 0 || false;
    } catch (err) {
      return false;
    }
  }

  /**
   * Retrieves all JSON fields for a given addressID.
   *
   * @param addressID The unique identifier for the address.
   * @returns A promise that resolves with an object containing all JSON data.
   */
  async getAllJson(addressID: string){
    const prismaWithJsonData = await this.prisma.jsonDataDPE.findUnique({
      where: { addressID: addressID },
    });

    if (!prismaWithJsonData) {
      throw new NotFoundException(`No JSON data found for addressID: ${addressID}`);
    }

    const JSONDPE:DPEAllData = {DPETertiaireAvant2021:JSON.parse(prismaWithJsonData.DPETertiaireAvant2021 as string),
      DPEHabitatExistant:JSON.parse(prismaWithJsonData.DPEHabitatExistant as string),
      DPEHabitatExistantAvant2021:JSON.parse(prismaWithJsonData.DPEHabitatExistantAvant2021 as string),
      DPEHabitatNeuf:JSON.parse(prismaWithJsonData.DPEHabitatNeuf as string),
      DPETertiaire:JSON.parse(prismaWithJsonData.DPETertiaire as string),}

  return JSONDPE;
  }
}
