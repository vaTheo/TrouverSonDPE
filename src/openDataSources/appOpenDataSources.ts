import axios from 'axios';
import { findAddress } from './address/findAddress';
import { getDPE } from './DPE/getDPE';
import { dataCalculation, qualiteEau } from './Eau/qualiteEau';
import { analisysGaspar, callAllApiGasparPromiseAll } from './geoRisque/Georisque';
import { saveDataToFile } from './function/utilities';
import { inputAddressObject } from './address/interfaceAddress';
import { eauAnalysis } from './Eau/eauAnalysis';
const BANid = '';

// Toutes tes open data sources devraient être des services avec leur module à mon avis !

const address = {
  postalCode: '38430',
  City: 'St jean de moirans',
  street: '49 sentier du pressoir', // <= ça ça régale monfffz l'adresse des bitcoins
} as inputAddressObject;

//  findAddress('38430', '49 sentier du pressoir')
//  findAddress('59310', '20 Av. de la Libération')
//  findAddress('69003', '20B RUE clos suiphon')
// findAddress('38210', '5 Contaminé S')
//  findAddress('17400', '15 Rue Lachevalle')
// findAddress('59680', '150 La Place')
// findAddress('29870', '6 place des Cormorans')
//  findAddress('38430', '209 Chemin de l Archat')
// findAddress('62720', '65 Rue Roger Salengro')
// findAddress('38114', '3 chemin des tournants')
// findAddress('14600', '6 Chem. des Buis')
// findAddress('67000', '12 rue des dentelles')

// findAddress('38118', '2 Rue des Balcons du Rhône') //Central nucleaire à coté
findAddress(address)
  .then((addressObject) => {
    console.log(addressObject);
    // getDPE(addressObject).then((res) => {
    //   console.log(res);
    // });
    qualiteEau(addressObject).then((res) => {
      const result = dataCalculation(res);
      const resultAnalysis = eauAnalysis(result);
      console.log(resultAnalysis);
    });
    // callAllApiGasparPromiseAll(addressObject).then((result) =>{
    //   saveDataToFile(result, `${addressObject.properties.city}.json`),
    //   analisysGaspar(result)})
  })
  .catch((error) => {
    console.error(error);
  });
