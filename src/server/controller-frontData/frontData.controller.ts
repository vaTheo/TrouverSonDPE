import { Controller, Get, Req, Param } from '@nestjs/common';
import { DBAllRatings } from '@server/DBallRatings/DBallRatings.service';
import { FrontDataService } from './frontData.service';
import { FrontGroupDataValue } from './frontData';
import { DBJsonDPE } from '@server/DBJson-DPE/DBjsonDPE.service';
import { DBJsonEau } from '@server/DBjson-Eau/DBjsonEau.service';
import { DBJsonGeorisque } from '@server/DBjson-Georisque/DBjsonGeorisque.service';
import { DBJsonParcCarto } from '../DBJson-ParcCarto/DBjsonParcCarto.service';
import {
  frontCatastropheNaturelle,
  frontDPEBatiment,
  frontEau,
  frontInstallationClassees,
  frontParcNaturelle,
  frontpollutionSol,
  frontrisqueLocaux,
  frontzoneInnondable,
  frontzoneNaturelle,
} from './specificInterface';
import { Request } from 'express';

@Controller('frontdata')
export class FrontData {
  constructor(
    private DBAllRatings: DBAllRatings,
    private FrontData: FrontDataService,
    private DBJsonDPE: DBJsonDPE,
    private DBJsonEau: DBJsonEau,
    private DBJsonGeorisque: DBJsonGeorisque,
    private DBJsonParcCarto: DBJsonParcCarto,
  ) {} //Inport the token service so I can use it in the controller

  @Get('getrates/:addressID')
  async getGroupedRates(
    @Param('addressID') addressID: string,
    @Req() req: Request,
  ): Promise<FrontGroupDataValue> {
    let returnedValue: FrontGroupDataValue;
    try {
      const allRatings = await this.DBAllRatings.getRatingByAddressId(addressID);

      const groupedRates = await this.FrontData.groupRates(allRatings);
      returnedValue = {
        globalRate: groupedRates.globalRate,
        eau: groupedRates.eau,
        zoneInnondable: groupedRates.zoneInnondable,
        CatastropheNaturelle: groupedRates.CatastropheNaturelle,
        InstallationClassees: groupedRates.InstallationClassees,
        risqueLocaux: groupedRates.risqueLocaux,
        risqueGeneraux: groupedRates.risqueGeneraux,
        zoneNaturelle: groupedRates.zoneNaturelle,
        parcNaturelle: groupedRates.parcNaturelle,
        DPEBatiment: groupedRates.DPEBatiment,
        polutionSol: groupedRates.polutionSol,
      };
      console.log(returnedValue);
    } catch (err) {
      console.log(err);
    }
    return returnedValue;
  }

  @Get('getdpebatiment/:addressID')
  async getJsonDPEBatiment(
    @Param('addressID') addressID: string,
    @Req() req: Request,
  ): Promise<frontDPEBatiment> {
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    const allData: frontDPEBatiment = {
      DPEBatiment: {
        DPEHabitatExistant: await this.DBJsonDPE.JgetSpecificJson(addressID, 'DPEHabitatExistant'),
        DPEHabitatExistantAvant2021: await this.DBJsonDPE.JgetSpecificJson(
          addressID,
          'DPEHabitatExistantAvant2021',
        ),
        DPEHabitatNeuf: await this.DBJsonDPE.JgetSpecificJson(addressID, 'DPEHabitatNeuf'),
        DPETertiaire: await this.DBJsonDPE.JgetSpecificJson(addressID, 'DPETertiaire'),
        DPETertiaireAvant2021: await this.DBJsonDPE.JgetSpecificJson(addressID, 'DPETertiaireAvant2021'),
      },
    };

    return allData;
  }

  @Get('geteau/:addressID')
  async getJSONeau(@Param('addressID') addressID: string, @Req() req: Request): Promise<frontEau> {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    try {
      const allData: frontEau = {
        eau: {
          coursEau: await this.DBJsonEau.getSpecificJsonDataEau(addressID, 'coursEau'),
          eauPotable: await this.DBJsonEau.getSpecificJsonDataEau(addressID, 'eauPotable'),
        },
      };

      return allData;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  @Get('getzoneinnondable/:addressID')
  async getJSONzoneInnondable(
    @Param('addressID') addressID: string,
    @Req() req: Request,
  ): Promise<frontzoneInnondable> {
    try {
      const allData: frontzoneInnondable = {
        zoneInnondable: await this.DBJsonGeorisque.getSpecificJsonDataGeorisque(addressID, 'AZI'),
      };

      return allData;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  @Get('getcatastrophenaturelle/:addressID')
  async getJSONCatastropheNaturelle(
    @Param('addressID') addressID: string,
    @Req() req: Request,
  ): Promise<frontCatastropheNaturelle> {
    try {
      const allData: frontCatastropheNaturelle = {
        CatastropheNaturelle: await this.DBJsonGeorisque.getSpecificJsonDataGeorisque(addressID, 'Catnat'),
      };

      return allData;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  @Get('getinstallationclassees/:addressID')
  async getJSONInstallationClassees(
    @Param('addressID') addressID: string,
    @Req() req: Request,
  ): Promise<frontInstallationClassees> {
    try {
      const allData: frontInstallationClassees = {
        InstallationClassees: await this.DBJsonGeorisque.getSpecificJsonDataGeorisque(
          addressID,
          'InstallationsClassees',
        ),
      };

      return allData;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  @Get('getrisquelocaux/:addressID')
  async getJSONrisqueLocaux(
    @Param('addressID') addressID: string,
    @Req() req: Request,
  ): Promise<frontrisqueLocaux> {
    try {
      const allData: frontrisqueLocaux = {
        risqueLocaux: {
          MVTData: await this.DBJsonGeorisque.getSpecificJsonDataGeorisque(addressID, 'MVT'),
          RadonData: await this.DBJsonGeorisque.getSpecificJsonDataGeorisque(addressID, 'Radon'),
          ZonageSismiqueData: await this.DBJsonGeorisque.getSpecificJsonDataGeorisque(
            addressID,
            'ZonageSismique',
          ),
        },
      };

      return allData;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  @Get('getzonenaturelle/:addressID')
  async getJSONzoneNaturelle(
    @Param('addressID') addressID: string,
    @Req() req: Request,
  ): Promise<frontzoneNaturelle> {
    try {
      const allData: frontzoneNaturelle = {
        zoneNaturelle: {
          naturaHabitat: await this.DBJsonParcCarto.getSpecificJson(addressID, 'naturaHabitat'),
          naturaOiseaux: await this.DBJsonParcCarto.getSpecificJson(addressID, 'naturaOiseaux'),
          znieff1: await this.DBJsonParcCarto.getSpecificJson(addressID, 'znieff1'),
          znieff2: await this.DBJsonParcCarto.getSpecificJson(addressID, 'znieff2'),
        },
      };

      return allData;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  @Get('getparcnaturelle/:addressID')
  async getJSONParcNaturelle(
    @Param('addressID') addressID: string,
    @Req() req: Request,
  ): Promise<frontParcNaturelle> {
    try {
      const allData: frontParcNaturelle = {
        parcNaturelle: {
          pn: await this.DBJsonParcCarto.getSpecificJson(addressID, 'pn'),
          pnr: await this.DBJsonParcCarto.getSpecificJson(addressID, 'pnr'),
          rnc: await this.DBJsonParcCarto.getSpecificJson(addressID, 'rnc'),
          rncf: await this.DBJsonParcCarto.getSpecificJson(addressID, 'rncf'),
          rnn: await this.DBJsonParcCarto.getSpecificJson(addressID, 'rnn'),
        },
      };

      return allData;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }
  @Get('getpollutionsol/:addressID')
  async getJSONpollutionsol(
    @Param('addressID') addressID: string,
    @Req() req: Request,
  ): Promise<frontpollutionSol> {
    try {
      const allData: frontpollutionSol = {
        pollutionSol: {
          sis: await this.DBJsonGeorisque.getSpecificJsonDataGeorisque(addressID, 'SIS'),
        },
      };

      return allData;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }
}
