
export enum TitrationType {
  AcidBase = 'Acid–Base',
  Redox = 'Redox',
  Complexometric = 'Complexometric',
  Precipitation = 'Precipitation',
}

export enum VolumeUnit {
  mL = 'mL',
  L = 'L',
}

export enum ConcentrationUnit {
  Molarity = 'mol/L',
  Normality = 'eq/L',
}

export interface TitrationInput {
  titrationType: TitrationType;
  titrantName: string;
  titrantConcentration: number;
  titrantConcentrationUnit: ConcentrationUnit;
  titrantNFactor?: number;
  analyteName: string;
  analyteMolarMass?: number;
  sampleMass?: number;
  titrationVolume: number;
  titrationVolumeUnit: VolumeUnit;
  blankVolume: number;
  blankVolumeUnit: VolumeUnit;
  sampleVolume: number;
  sampleVolumeUnit: VolumeUnit;
  titrantStoichiometry: number;
  analyteStoichiometry: number;
}

export interface TitrationResult {
  correctedTitrantVolumeL: number;
  molesOfTitrant: number;
  equivalentsOfTitrant?: number;
  molesOfAnalyte: number;
  analyteConcentrationMolL: number;
  analyteConcentrationNormality?: number;
  analyteConcentrationGL?: number;
  analyteMassInSample?: number;
  analytePurity?: number;
  analyteName: string;
  analyteMolarMass?: number;
}

export interface TitrationRecord {
  id: number;
  input: TitrationInput;
  result: TitrationResult;
}
