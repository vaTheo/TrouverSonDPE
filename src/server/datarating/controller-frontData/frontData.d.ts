export interface GroupRates {
  globalRate: number;
  eau: number;
  zoneInnondable: number;
  CatastropheNaturelle: number;
  InstallationClassees: number;
  risqueLocaux: number;
  risqueGeneraux: number;
  zoneNaturelle: number;
  parcNaturelle: number;
  DPEBatiment: number;
  polutionSol:number;
}
export interface DataFrontInterface {
  valueCard?: number;
}

export interface FrontGroupDataValue {
  globalRate: number;
  eau: number;
  zoneInnondable: number;
  CatastropheNaturelle: number;
  InstallationClassees: number;
  risqueLocaux: number;
  risqueGeneraux: number;
  zoneNaturelle: number;
  parcNaturelle: number;
  DPEBatiment: number;
  polutionSol:number;

}
