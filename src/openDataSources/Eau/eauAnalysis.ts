import { EauPotableData, RateEauAnalysis } from './interfaceEau';

export const eauAnalysis = (result: EauPotableData[]): RateEauAnalysis => {
  let numberFail = 0;
  result.forEach((element) => {
    if (!element.good) {
      numberFail += 1;
      console.log(element);
    }
  });
  console.log(numberFail);
  if (numberFail == 0) {
    return { eauAnalysis: 0 };
  } else if (numberFail <= 1) {
    return { eauAnalysis: 1 };
  } else if (numberFail <= 2) {
    return { eauAnalysis: 2 };
  } else if (numberFail >= 3) {
    return { eauAnalysis: 3 };
  } else {
    console.log('ERROR in eauAnalysis');
  }
};
