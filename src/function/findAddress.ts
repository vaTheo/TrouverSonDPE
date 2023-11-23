import axios from 'axios';
import {AddressObject} from '../interface'
const URLapi = 'https://api-adresse.data.gouv.fr/search/?q=';
// https://adresse.data.gouv.fr/api-doc/adresse



export const findAddress = async (postCode: string, adress: string):Promise<AddressObject> => {
  const querryString = adress.replace(/\s/g, '+'); //replace space by +

  try {
    const response = await axios.get(URLapi + querryString + '&postcode=' + postCode);
    if (!response.data) {
      throw new Error('Error undifined value return by getBANid');
    }
    return response.data.features[0]; //Return the first adresse (Usually there is only one)
  } catch (err) {
    console.log(err);
    throw err;
  }
};
