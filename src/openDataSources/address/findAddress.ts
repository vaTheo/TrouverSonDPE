import axios from 'axios';
import { AddressObject, inputAddressObject } from './interfaceAddress';
const URLapi = 'https://api-adresse.data.gouv.fr/search/?q=';

// Documentation API : https://adresse.data.gouv.fr/api-doc/adresse
export const findAddress = async (inputAddressObject: inputAddressObject): Promise<AddressObject> => {
  const querryString = inputAddressObject.street.replace(/\s/g, '+'); //replace space by +

  try {
    const response = await axios.get(URLapi + querryString + '&postcode=' + inputAddressObject.postalCode);
    if (!response.data) {
      throw new Error('Error undifined value return by getBANid');
    }
    return response.data.features[0]; //Return the first adresse (Usually there is only one)
  } catch (err) {
    console.log(err);
    throw err;
  }
};

