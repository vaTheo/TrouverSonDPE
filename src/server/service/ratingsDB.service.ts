import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Ratings } from '../../openDataSources/interfaceRatings';
import { AddressObject } from '@openDataSources/address/interfaceAddress';
import { AllRatings, Prisma } from '@prisma/client';
import { GeorisqueAllData, RateArrayGeoRisque } from '@openDataSources/geoRisque/interfaceGeoRisque';
import { eauAllData } from '@openDataSources/Eau/interfaceEau';


@Injectable()
export class RatingsDBService {
  constructor(private prisma: PrismaService) {}

  async addRating(dataSourceID: number, rating: Ratings): Promise<any> {
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
          DataSourcesID: dataSourceID,
        },
      });
      console.log('...Value send without error to AllRating');
      return result.addressID;
    } catch (err) {
      throw new Error(`Error saving data to database: ${err.message}`);
    }
  }

  async userExist(userId: number): Promise<boolean> {
    // Check if userId exists in User table
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return userExists ? true : false;
  }
  async addresExist(addressObject: AddressObject): Promise<boolean> {
    // Check if addressID already exists in userAddressID table
    const addressExists = await this.prisma.dataSourceAddressID.findUnique({
      where: { addressID: addressObject.properties.id },
    });
    return addressExists ? true : false;
  }
  async createDataSourceAddressID(userId: number, addressObject: AddressObject): Promise<number> {
    const result = await this.prisma.dataSourceAddressID.create({
      data: {
        userId: userId,
        addressID: addressObject.properties.id,
        street: addressObject.properties.name,
        city: addressObject.properties.city,
        postcode: addressObject.properties.postcode,
        citycode: addressObject.properties.citycode,
      },
    });
    return result.id;
  }

  async addJsonGeorisque(dataSourceID: number, dataGeorisque: GeorisqueAllData) {
    try {
      const createData: any = { DataSourcesID: dataSourceID };
      const fields: Array<keyof GeorisqueAllData> = Object.keys(dataGeorisque) as Array<
        keyof GeorisqueAllData
      >;

      fields.forEach((field) => {
        if (dataGeorisque[field]) {
          createData[field] = JSON.stringify(dataGeorisque[field]);
        }
      });

      await this.prisma.jsonDataGeorisque.create({ data: createData });
    } catch (err) {
      console.log(`Error in addJsonGeorisque: ${err.message}`);
    }
  }

  async addJsonEau(dataSourceID: number, dataEau: eauAllData) {
    try {
      const createData: any = { DataSourcesID: dataSourceID };
      const fields: Array<keyof eauAllData> = Object.keys(dataEau) as Array<keyof eauAllData>;

      fields.forEach((field) => {
        if (dataEau[field]) {
          createData[field] = JSON.stringify(dataEau[field]);
        }
      });

      await this.prisma.jsonDataGeorisque.create({ data: createData });
    } catch (err) {
      console.log(`Error in addJsonGeorisque: ${err.message}`);
    }
  }
  async getAZIDataByAddressID(addressID: string): Promise<Prisma.JsonValue | null> {
    console.log(`Retrieving AZIData for addressID: ${addressID}`);
    try {
      // First, find the DataSourcesID associated with the addressID
      const dataSourceRecord = await this.prisma.dataSourceAddressID.findUnique({
        where: { addressID: addressID },
      });

      if (!dataSourceRecord) {
        console.log('No DataSourceRecord found for the provided addressID.');
        return null;
      }

      // Then, use that DataSourcesID to retrieve the AZIData
      const jsonDataGeorisqueRecord = await this.prisma.jsonDataGeorisque.findFirst({
        where: { DataSourcesID: dataSourceRecord.id },
      });

      if (jsonDataGeorisqueRecord) {
        console.log('AZIData found:', jsonDataGeorisqueRecord.AZIData);
        return jsonDataGeorisqueRecord.AZIData;
      } else {
        console.log('No AZIData found for the provided DataSourcesID.');
        return null;
      }
    } catch (err) {
      throw new Error(`Error retrieving AZIData: ${err.message}`);
    }
  }
  // Add more methods as needed for different types of database operations
}
