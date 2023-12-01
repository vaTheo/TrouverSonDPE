import axios from 'axios';
import { findAddress } from './function/findAddress';
import { getDPE } from './function/getDPE';
import { qualiteEau } from './function/qualiteEau';
import { getAZI, getCatNat, getCavite, getItallationsClassees } from './function/gaspar';
const BANid = '';

// findAddress('38430', '49 sentier du pressoir')
// findAddress('59310', '20 Av. de la Libération')
//  findAddress('69003', '20B RUE clos suiphon')
// findAddress('38210', '5 Contaminé S')
//  findAddress('17400', '15 Rue Lachevalle')
// findAddress('59680', '150 La Place')
// findAddress('29870', '6 place des Cormorans')
//  findAddress('38430', '209 Chemin de l Archat')
// findAddress('62720', '65 Rue Roger Salengro')
findAddress('38118', '2 Rue des Balcons du Rhône') //Central nucleaire à coté
  .then((addressObject) => {
    // console.log(addressObject);
    getDPE(addressObject);
    // qualiteEau(addressObject);
    getItallationsClassees(addressObject);
  })
  .catch((error) => {
    console.error(error);
  });
