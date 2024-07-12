import { Module } from '@nestjs/common';
import { FetchDataController } from './fetchData.controller';
import { parcCartoService } from './fetch-ParCarto/fetchParcCarto.service';
import { AddressService } from './fetch-Addresse/address.service';
import { DpeService } from './fetch-DPE/fetchDpe.service';
import { georisqueService } from './fetchGeorisque/fetchGeorisque.service';

@Module({
  imports: [],
  controllers: [FetchDataController],
  providers: [AddressService, parcCartoService, DpeService, georisqueService], //Service and midlware
})
export class FetchDataModule {}
