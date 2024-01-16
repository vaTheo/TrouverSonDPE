import { Injectable } from '@nestjs/common';
import { AllRatings, Prisma } from '@prisma/client';
import { PrismaService } from '@server/prisma/prisma.service';
import { Ratings } from '../ratings';
import { RatesGeoRisque } from '@server/datarating/fetch-georisque/Georisque';
import { RatesEau } from '@server/datarating/fetch-eau/eau';

@Injectable()
export class DBAllRatings {
  constructor(private prisma: PrismaService) {}

  /**
   *
   * @param dataSourceID
   * @param rating
   * @returns
   */
  async addRating(addressID: string, rating: Ratings): Promise<string> {
    try {
      const result = await this.prisma.allRatings.create({
        data: {
          addressID: addressID,
          eauPotable: rating.eauPotable,
          coursEau: rating.coursEau,
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
      return result.addressID;
    } catch (err) {
      throw new Error(`Error saving data to database: ${err.message}`);
    }
  }

  // Method to retrieve a rating by addressID
  async getRatingByAddressId(addressId: string): Promise<AllRatings | null> {
    const rating = await this.prisma.allRatings.findUnique({
      where: { addressID: addressId },
    });
    return rating;
  }

  // Method to retrieve a rating by addressID
  async getRatingGeorisqueByAddressId(addressId: string): Promise<RatesGeoRisque | null> {
    const rating = await this.prisma.allRatings.findUnique({
      where: { addressID: addressId },
    });
    const rateGeorisque = {
      AZIData: rating.AZIData,
      CatnatData: rating.CatnatData,
      InstallationsClasseesData: rating.InstallationsClasseesData,
      MVTData: rating.MVTData,
      RadonData: rating.RadonData,
      RisquesData: rating.RisquesData,
      SISData: rating.SISData,
      TRIData: rating.TRIData,
      ZonageSismiqueData: rating.ZonageSismiqueData,
    };
    return rateGeorisque;
  }

  async getRatingEauByAddressId(addressId: string): Promise<RatesEau | null> {
    const rating = await this.prisma.allRatings.findUnique({
      where: { addressID: addressId },
    });
    const rateGeorisque: RatesEau = {
      coursEau: rating.coursEau,
      eauPotable: rating.eauPotable,
    };
    return rateGeorisque;
  }

  // Method to update a rating
  async updateRating(addressId: string, data: Prisma.AllRatingsUpdateInput): Promise<AllRatings> {
    return this.prisma.allRatings.update({
      where: { addressID: addressId },
      data,
    });
  }

  // Method to delete a rating
  async deleteRating(addressId: string): Promise<AllRatings> {
    return this.prisma.allRatings.delete({
      where: { addressID: addressId },
    });
  }
}
