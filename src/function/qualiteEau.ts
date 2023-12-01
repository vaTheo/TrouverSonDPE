import axios from 'axios';
import { AddressObject, ResultatDis, communes_udi } from '../interface';
import { getFormattedDateYearsAgoAsString } from './utilities/addressFunction';

export const qualiteEau = async (adressObject: AddressObject) => {
  let uniqueCodeReseau: string[] = [];
  let uniqueTypeAnalysis: string[] = [];
  const basURL = 'https://hubeau.eaufrance.fr/api/v1/qualite_eau_potable/';
  // Get resultat Dis
  try {
    const uniqueCodeReseauString = uniqueCodeReseau.join(','); //Make the array a string to use it with the following api call
    const endpoint = 'resultats_dis';
    //City code managment it appear Hub eau do not manage disctrict
    let cityCode = adressObject.properties.citycode;
    const lyonCityCodes = ['69381', '69382', '69383', '69384', '69385', '69386', '69387', '69388', '69389'];
    if (lyonCityCodes.includes(cityCode)) {
      cityCode = '69123';
    }
    const codeCommune = '?code_commune=' + cityCode;
    const dateMinPrelevement = '&date_min_prelevement=' + getFormattedDateYearsAgoAsString(10);

    const response = await axios.get(basURL + endpoint + codeCommune + dateMinPrelevement);
    const resultatDis: ResultatDis = response.data;

    resultatDis.data.forEach((item) => {
      // regroup every code reseau for the city in one array
      if (!uniqueTypeAnalysis.includes(item.libelle_parametre)) {
        uniqueTypeAnalysis.push(item.libelle_parametre);
      }
    });
    type DataItem = {
      libelle_parametre: string;
      // Include other properties as needed
    };

    // Assuming resultatDis.data is an array of DataItem
    const counts: Record<string, number> = {};

    resultatDis.data.forEach((item: DataItem) => {
      const libelle = item.libelle_parametre;

      if (!counts[libelle]) {
        counts[libelle] = 1;
      } else {
        counts[libelle]++;
      }
    });
    // console.log(counts);
    analyseDataEauVille(resultatDis);
    // console.log(uniqueTypeAnalysis);
    // console.log(uniqueTypeAnalysis.length);
  } catch (err) {
    console.log(err);
  }
};



type ParamAnalyse = {
  libelle_parametre: string;
  min: number;
  max: number;
  totalAverage: number;
  countValue: number;
  good: boolean | null;
};

const analyseDataEauVille = async (resultatDis: ResultatDis) => {
  let paramAnalyse: ParamAnalyse[] = [
    {
      libelle_parametre: 'Escherichia coli /100ml - MF',
      min: 0,
      max: 0,
      totalAverage: 0,
      countValue: 0,
      good: false,
    },
    {
      libelle_parametre: 'Entérocoques /100ml-MS',
      min: 0,
      max: 0,
      totalAverage: 0,
      countValue: 0,
      good: false,
    },
    {
      libelle_parametre: 'Nitrates (en NO3)',
      min: 0,
      max: 50,
      totalAverage: 0,
      countValue: 0,
      good: false,
    },
    {
      libelle_parametre: 'Turbidité néphélométrique NFU',
      min: 0,
      max: 1.0,
      totalAverage: 0,
      countValue: 0,
      good: false,
    },
    {
      libelle_parametre: 'Conductivité à 25°C',
      min: 200,
      max: 1100,
      totalAverage: 0,
      countValue: 0,
      good: false,
    },
    {
      libelle_parametre: 'Ammonium (en NH4)',
      min: 0,
      max: 0.1,
      totalAverage: 0,
      countValue: 0,
      good: false,
    },
    {
      libelle_parametre: 'pH',
      min: 6.5,
      max: 9.0,
      totalAverage: 0,
      countValue: 0,
      good: false,
    },
    {
      libelle_parametre: 'Bact. aér. revivifiables à 36°-44h',
      min: 0,
      max: 0,
      totalAverage: 0,
      countValue: 0,
      good: false,
    },
    {
      libelle_parametre: 'Plomb',
      min: 0,
      max: 10,
      totalAverage: 0,
      countValue: 0,
      good: false,
    },
  ];
  //Object to keep track of total values and counts for each parameter
  const totals: Record<string, { total: number; count: number }> = {};

  resultatDis.data.forEach((item) => {
    const param = item.libelle_parametre;
    const value = item.resultat_numerique;

    // Initialize the accumulator for this parameter if it's not already there
    if (!totals[param]) {
      totals[param] = { total: 0, count: 0 };
    }

    // Accumulate totals and counts
    totals[param].total += value;
    totals[param].count += 1;
  });

  // Calculate averages and check if they are within the range
  paramAnalyse.forEach((param) => {
    const data = totals[param.libelle_parametre];
    if (data) {
      const avg = data.total / data.count;
      param.totalAverage = avg;
      param.good = avg >= param.min && avg <= param.max;
      param.countValue = data.count; // Assigning countValue
    } else {
      param.totalAverage = 0;
      param.good = null;
      param.countValue = 0; // No occurrences found
    }
  });
  console.log(paramAnalyse);

  // return averages;
};
