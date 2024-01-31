import {
  AZIData,
  CatnatData,
  InstallationsClasseesData,
  MVTData,
  RadonData,
  RisquesData,
  SISData,
  TRIData,
  ZonageSismiqueData,
} from './api-georisque';

/**
 * AZI data Analysis of Georisque API
 * @param {arrayAZI} - array of AZI data
 * @returns {number} - note calculate with the input
 */
export const AZIAnalysis = (arrayAZI: AZIData[]): number => {
  //Atlas des zones inondable
  //Find all Num risque
  let rates = 100;
  let allRisqueNumber = arrayAZI.map((item) => {
    return item.liste_libelle_risque[0].num_risque;
  });
  const uniqueRisqueAZI = allRisqueNumber.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
  return rates - 10 * allRisqueNumber.length;
};

export const sysmiqueAnalysis = (arraySismique: ZonageSismiqueData[]): number => {
  // Zonage Sismique Data Risque = 1-Très faible 2-faible 3-Moderée 4-Moyen 5-Fort
  const risqueLieu = parseInt(arraySismique[0].code_zone);
  if (risqueLieu <= 2) {
    return 0;
  } else if (risqueLieu > 2 && risqueLieu <= 3) {
    return 1;
  } else if (risqueLieu == 4) {
    return 2;
  } else if (risqueLieu == 5) {
    return 3;
  } else {
    console.log('SysmiqueAnalysis unknown error with code : ' + arraySismique[0].code_zone);
  }
};

export const CATNATAnalysis = (arrayCATNAT: CatnatData[]): number | null => {
  let rate = 100;
  if (!arrayCATNAT.length) {
    return null;
  }
  rate = 100 - (20 * arrayCATNAT.length);
  return rate > 0 ? rate : 0;
};

export const installationClasseAnalysis = (arrayInstallationClasse: InstallationsClasseesData[]): number => {
  const arrayStatusSeveso = arrayInstallationClasse.map((item) => {
    return item.statutSeveso;
  });
  let rate = 100;
  if (!arrayInstallationClasse.length) {
    return null;
  }
  arrayStatusSeveso.forEach((item) => {
    if (item == 'Non Seveso') {
      rate -= 0.5;
    } else if (item == 'Seveso seuil bas') {
      rate -= 1;
    } else if (item == 'Seveso seuil haut') {
      rate -= 5;
    } else {
      console.log('Err installationClasseAnalysis, seveso name not taken into account :' + item);
    }
  });
  if (rate <= 0) {
    rate = 0;
  }
  return rate;
};
export const radonAnalysis = (arrayRadon: RadonData[]): number => {
  if (!arrayRadon.length) {
    return null;
  }
  if (arrayRadon[0].classe_potentiel == '1') {
    return 100;
  } else if (arrayRadon[0].classe_potentiel == '2') {
    return 85;
  } else if (arrayRadon[0].classe_potentiel == '3') {
    return 60;
  } else {
    console.log('Error, radonAnalysis unknown class');
    return null
  }
};

export const risqueAnalysis = (arrayRisque: RisquesData[]): number => {
  const arrayAllNumRisque = arrayRisque.map((item) => {
    return item.risques_detail.map((item) => {
      return parseInt(item.num_risque);
    });
  });
  if (!arrayRisque.length) {
    return null;
  }

  let rate = 100 - (10 * arrayAllNumRisque.length);
  return rate > 0 ? rate : 0;
};

export const mvtAnalysis = (arrayMvt: MVTData[]): number => {
  // This type of data are not very useful
  if (!arrayMvt.length) {
    return null;
  }

  let rate = 100 - (10 * arrayMvt.length);
  return rate > 0 ? rate : 0;
};

export const sisAnalysis = (arraySIS: SISData[]): number => {
  if (!arraySIS.length) {
    return null;
  }

  let rate = 100 - (10 * arraySIS.length);
  return rate > 0 ? rate : 0;
};

export const TRIAnalysis = (arrayTRI: TRIData[]): number => {
  const arrayRisqueAvere = arrayTRI.map((item) => {
    if (item.date_arrete_pcb && !item.date_arrete_approbation) {
      return item.liste_libelle_risque;
    }
  });

  if (!arrayTRI.length) {
    return null;
  }

  let rate = 100 - (10 * arrayTRI.length);
  return rate > 0 ? rate : 0;
  
};
