import axios from 'axios';
import { AddressObject } from '../address/interfaceAddress';

export const getDPE = async (addressObject: AddressObject) => {
  try {
    const agg_size = '64'; //Max result in the response
    const urlWithBANid =
      'https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/values_agg?field=Identifiant__BAN&format=json&metric=avg&metric_field=Score_BAN&agg_size=' +
      agg_size +
      '&q=' +
      addressObject.properties.id +
      '&q_mode=complete';
    const response = await axios.get(urlWithBANid);
    return response.data.aggs;
  } catch (err) {
    console.log(err);
  }
};

