
import { TitrationType } from './types';

interface TitrationLabels {
  titrant: string;
  analyte: string;
}

export const TITRATION_TYPE_OPTIONS = [
  { value: TitrationType.AcidBase, label: 'Acid–Base Titration' },
  { value: TitrationType.Redox, label: 'Redox Titration' },
  { value: TitrationType.Complexometric, label: 'Complexometric Titration' },
  { value: TitrationType.Precipitation, label: 'Precipitation Titration' },
];

export const TITRATION_LABELS: Record<TitrationType, TitrationLabels> = {
  [TitrationType.AcidBase]: { titrant: 'Titrant (e.g., Base)', analyte: 'Analyte (e.g., Acid)' },
  [TitrationType.Redox]: { titrant: 'Oxidizing Agent', analyte: 'Reducing Agent' },
  [TitrationType.Complexometric]: { titrant: 'Complexing Agent (Titrant)', analyte: 'Analyte' },
  [TitrationType.Precipitation]: { titrant: 'Precipitating Agent (Titrant)', analyte: 'Analyte' },
};
