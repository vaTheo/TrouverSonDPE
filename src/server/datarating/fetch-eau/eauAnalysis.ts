import { EauPotableData, RatesEau } from "./eau";

export const eauAnalysis = (eauPotableData: EauPotableData[]): number => {
  let numberFail = 0;
  eauPotableData.forEach((element) => {
    if (!element.good) {
      numberFail += 1;
      console.log(element);
    }
  });

  if (!eauPotableData.length) {
    return null;
  }

  let rate = 100 - (20 * numberFail);
  return rate > 0 ? rate : 0;
};
