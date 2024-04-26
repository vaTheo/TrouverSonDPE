import { FetchDPE } from './server/datarating/fetch-dpe/fetch-DPE.service';
import { AddressObject } from './server/datarating/fetch-address/address';

const addrObj: AddressObject = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [4.848834, 45.761274] },
  properties: {
    label: '203 Rue Duguesclin 69003 Lyon',
    score: 0.9763727272727271,
    housenumber: '203',
    id: '69383_2365_00203',
    name: '203 Rue Duguesclin',
    postcode: '69003',
    citycode: '69383',
    x: 843694.31,
    y: 6519645.54,
    city: 'Lyon',
    district: 'Lyon 3e Arrondissement',
    context: '69, Rhône, Auvergne-Rhône-Alpes',
    type: 'housenumber',
    importance: 0.7401,
    street: 'Rue Duguesclin',
  },
};

const result = FetchDPE.prototype.callDPE(addrObj, 'dpe-france').then((res) => {
  console.log(res);
});
