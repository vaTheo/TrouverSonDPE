import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Ratings } from './ratings';
import { AddressObject } from '@server/datarating/fetch-address/address';
import { AllRatings, Prisma, jsonDataGeorisque } from '@prisma/client';
import { eauAllData } from '../fetch-eau/eau';

@Injectable()
export class RatingsDBService {
  constructor(private prisma: PrismaService) {}
  /**
   *
   * @param dataSourceID
   * @param rating
   * @returns
   */
  async addRating(dataSourceID: string, rating: Ratings): Promise<string> {
    try {
      const result = await this.prisma.allRatings.create({
        data: {
          addressID: rating.addressID,
          eauAnalysis: rating.eauPotable,
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
      return result.addressID;
    } catch (err) {
      throw new Error(`Error saving data to database: ${err.message}`);
    }
  }

  async userExist(userId: string): Promise<boolean> {
    // Check if userId exists in User table
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return userExists ? true : false;
  }
  /**
   *
   * @param addressObject
   * @returns boolean
   * - return true if the address exist in the DB
   * - return false if the address does not exist in the DB
   */
  async addresExist(addressObject: AddressObject): Promise<boolean> {
    // Check if addressID already exists in userAddressID table
    const addressExists = await this.prisma.dataSourceAddressID.findUnique({
      where: { addressID: addressObject.properties.id },
    });
    return addressExists ? true : false;
  }
  async createDataSourceAddressID(userId: string, addressObject: AddressObject): Promise<string> {
    const result = await this.prisma.dataSourceAddressID.create({
      data: {
        userId: userId,
        addressID: addressObject.properties.id,
        street: addressObject.properties.name,
        city: addressObject.properties.city,
        postcode: addressObject.properties.postcode,
        citycode: addressObject.properties.citycode,
        longitude: addressObject.geometry.coordinates[0],
        latitude: addressObject.geometry.coordinates[1],
      },
    });
    return result.id;
  }

  /**
   *
   * @param dataSourceID
   * @param dataEau
   * @returns
   */
  async addJsonEau(dataSourceID: string, dataEau: eauAllData): Promise<jsonDataGeorisque> {
    try {
      const createData: any = { DataSourcesID: dataSourceID };
      const fields: Array<keyof eauAllData> = Object.keys(dataEau) as Array<keyof eauAllData>;

      fields.forEach((field) => {
        if (dataEau[field]) {
          createData[field] = JSON.stringify(dataEau[field]);
        }
      });

      return await this.prisma.jsonDataGeorisque.create({ data: createData });
    } catch (err) {
      console.log(`Error in addJsonGeorisque: ${err.message}`);
    }
  }

  /**
   *
   * @param addressID
   * @returns
   */
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
        return jsonDataGeorisqueRecord.AZIData;
      } else {
        console.error('No AZIData found for the provided DataSourcesID.');
        return null;
      }
    } catch (err) {
      throw new Error(`Error retrieving AZIData: ${err.message}`);
    }
  }

  /**
   * Retrieves the ratings for a specific address ID.
   * @param addressID The unique identifier for the address.
   * @returns The ratings associated with the address, or null if not found.
   */
  async getRatingsByAddressID(addressObject: AddressObject): Promise<AllRatings | null> {
    try {
      const ratings = await this.prisma.allRatings.findUnique({
        where: { addressID: addressObject.properties.id },
      });

      if (!ratings) {
        console.error(`No ratings found for addressID: ${addressObject.properties.id}`);
        return null;
      }

      return ratings;
    } catch (err) {
      throw new Error(`Error retrieving ratings: ${err.message}`);
    }
  }
}
