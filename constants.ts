import { TitrationType } from './types';

interface TitrationLabels {
  titrant: string;
  analyte: string;
}

interface TitrationInfo {
  mechanism: string;
  principle: string;
  exampleEquation: string;
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

export const TITRATION_INFO: Record<TitrationType, TitrationInfo> = {
    [TitrationType.AcidBase]: {
        mechanism: "This reaction involves the transfer of a proton (H⁺) from an acid to a base, resulting in the formation of a salt and water. It's a neutralization reaction.",
        principle: "The endpoint is typically detected using a pH indicator that changes color at a specific pH, or by monitoring the pH change with a pH meter (potentiometric titration).",
        exampleEquation: "HCl (aq) + NaOH (aq) → H2O (l) + NaCl (aq)"
    },
    [TitrationType.Redox]: {
        mechanism: "A reaction involving the transfer of electrons from one species (the reducing agent) to another (the oxidizing agent). Oxidation states of the atoms are changed.",
        principle: "The endpoint can be detected by a sharp change in the solution's electrode potential (potentiometry) or by a color change, which may be inherent to one of the reactants (e.g., KMnO4) or from a redox indicator.",
        exampleEquation: "5Fe2+ (aq) + MnO4- (aq) + 8H+ (aq) → 5Fe3+ (aq) + Mn2+ (aq) + 4H2O (l)"
    },
    [TitrationType.Complexometric]: {
        mechanism: "This titration is based on the formation of a stable, soluble complex between the analyte (usually a metal ion) and the titrant (a complexing agent like EDTA).",
        principle: "A metallochromic indicator is often used, which forms a colored complex with the metal ion. At the endpoint, the titrant displaces the indicator, causing a distinct color change.",
        exampleEquation: "Ca2+ (aq) + EDTA4- (aq) → [Ca(EDTA)]2- (aq)"
    },
    [TitrationType.Precipitation]: {
        mechanism: "A reaction where the titrant and analyte combine to form an insoluble solid, called a precipitate. The titration continues until all of the analyte has precipitated.",
        principle: "The endpoint can be detected by the formation of a second, colored precipitate (Mohr's method), the adsorption of a colored indicator onto the precipitate's surface (Fajan's method), or by monitoring ion concentration with an ion-selective electrode.",
        exampleEquation: "Ag+ (aq) + Cl- (aq) → AgCl (s)"
    }
};