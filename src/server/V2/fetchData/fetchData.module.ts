import { Module } from '@nestjs/common';
import { FetchDataController } from './fetchData.controller';
import { parcCartoService as ParcCartoService } from './fetch-ParCarto/fetchParcCarto.service';
import { AddressService } from './fetch-Addresse/address.service';
import { DpeService } from './fetch-DPE/fetchDpe.service';
import { georisqueService as GeorisqueService } from './fetchGeorisque/fetchGeorisque.service';
import { EauService } from './fetch-eau/fetch-eau.service';

@Module({
  imports: [],
  controllers: [FetchDataController],
  providers: [AddressService, ParcCartoService, DpeService, GeorisqueService,EauService], //Service and midlware
})
export class FetchDataModule {}
