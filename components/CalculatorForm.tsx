import React, { useState, useEffect, FormEvent } from 'react';
import { TitrationType, VolumeUnit, TitrationInput, TitrationResult, ConcentrationUnit } from '../types';
import { TITRATION_TYPE_OPTIONS, TITRATION_LABELS, TITRATION_INFO } from '../constants';
import { Card, CardHeader, CardContent } from './Card';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';
import { ExplanationPanel } from './ExplanationPanel';

interface CalculatorFormProps {
  onCalculate: (input: TitrationInput, result: TitrationResult) => void;
}

const initialFormState: TitrationInput = {
    titrationType: TitrationType.AcidBase,
    titrantName: '',
    titrantConcentration: 0.1,
    titrantConcentrationUnit: ConcentrationUnit.Molarity,
    titrantNFactor: 1,
    analyteName: '',
    analyteMolarMass: undefined,
    sampleMass: undefined,
    titrationVolume: 0,
    titrationVolumeUnit: VolumeUnit.mL,
    blankVolume: 0,
    blankVolumeUnit: VolumeUnit.mL,
    sampleVolume: 0,
    sampleVolumeUnit: VolumeUnit.mL,
    titrantStoichiometry: 1,
    analyteStoichiometry: 1,
};

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate }) => {
  const [formData, setFormData] = useState<TitrationInput>(initialFormState);
  const [labels, setLabels] = useState(TITRATION_LABELS[TitrationType.AcidBase]);
  const [showMassCalc, setShowMassCalc] = useState(false);

  useEffect(() => {
    setLabels(TITRATION_LABELS[formData.titrationType]);
  }, [formData.titrationType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({
      ...prev,
      [name]: isNumber ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };
  
  const convertToLiters = (value: number, unit: VolumeUnit): number => {
    return unit === VolumeUnit.mL ? value / 1000 : value;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const titrantVolumeL = convertToLiters(formData.titrationVolume, formData.titrationVolumeUnit);
    const blankVolumeL = convertToLiters(formData.blankVolume, formData.blankVolumeUnit);
    const sampleVolumeL = convertToLiters(formData.sampleVolume, formData.sampleVolumeUnit);

    const correctedTitrantVolumeL = titrantVolumeL - blankVolumeL;
    
    // Step 1: Determine effective molarity of the titrant
    let effectiveTitrantMolarity = formData.titrantConcentration;
    if (formData.titrantConcentrationUnit === ConcentrationUnit.Normality) {
        effectiveTitrantMolarity = formData.titrantConcentration / (formData.titrantNFactor || 1);
    }
    
    // Step 2: Calculate moles & equivalents
    const molesOfTitrant = effectiveTitrantMolarity * correctedTitrantVolumeL;
    const molesOfAnalyte = molesOfTitrant * (formData.analyteStoichiometry / formData.titrantStoichiometry);
    const equivalentsOfTitrant = formData.titrantConcentrationUnit === ConcentrationUnit.Normality 
        ? formData.titrantConcentration * correctedTitrantVolumeL
        : molesOfTitrant * (formData.titrantNFactor || (formData.analyteStoichiometry / formData.titrantStoichiometry)); // Best guess for n-factor if not provided

    // Step 3: Calculate analyte concentrations
    const analyteConcentrationMolL = sampleVolumeL > 0 ? molesOfAnalyte / sampleVolumeL : 0;
    
    let analyteNFactor = (formData.titrantNFactor || 1) * (formData.titrantStoichiometry / formData.analyteStoichiometry);
    let analyteConcentrationNormality = analyteConcentrationMolL * analyteNFactor;
    
    // Step 4: Calculate mass and purity if applicable
    let analyteConcentrationGL: number | undefined;
    let analyteMassInSample: number | undefined;
    let analytePurity: number | undefined;

    if (showMassCalc && formData.analyteMolarMass && formData.analyteMolarMass > 0) {
        analyteConcentrationGL = analyteConcentrationMolL * formData.analyteMolarMass;
        analyteMassInSample = molesOfAnalyte * formData.analyteMolarMass;
        if (formData.sampleMass && formData.sampleMass > 0) {
            analytePurity = (analyteMassInSample / formData.sampleMass) * 100;
        }
    }

    const result: TitrationResult = {
        correctedTitrantVolumeL,
        molesOfTitrant,
        equivalentsOfTitrant,
        molesOfAnalyte,
        analyteConcentrationMolL,
        analyteConcentrationNormality,
        analyteConcentrationGL,
        analyteMassInSample,
        analytePurity,
        analyteName: formData.analyteName,
        analyteMolarMass: formData.analyteMolarMass
    };

    onCalculate(formData, result);
  };
  
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Calculation Setup</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Enter the details of your titration.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Select id="titrationType" name="titrationType" label="Titration Type" value={formData.titrationType} onChange={handleChange}>
            {TITRATION_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </Select>
          
          <ExplanationPanel info={TITRATION_INFO[formData.titrationType]} />

          {/* Titrant Section */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">{labels.titrant} Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="titrantName" name="titrantName" label={`${labels.titrant} Name`} type="text" value={formData.titrantName} onChange={handleChange} placeholder="e.g., NaOH" required />
                <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Concentration</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input type="number" name="titrantConcentration" step="any" min="0" value={formData.titrantConcentration} onChange={handleChange} className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500" required/>
                        <select name="titrantConcentrationUnit" value={formData.titrantConcentrationUnit} onChange={handleChange} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm">
                            <option value={ConcentrationUnit.Molarity}>mol/L (M)</option>
                            <option value={ConcentrationUnit.Normality}>eq/L (N)</option>
                        </select>
                    </div>
                </div>
              </div>
              {formData.titrantConcentrationUnit === ConcentrationUnit.Normality && (
                <div className="mt-4">
                    <Input id="titrantNFactor" name="titrantNFactor" label="Titrant n-factor (equivalents per mole)" type="number" step="1" min="1" value={formData.titrantNFactor || ''} onChange={handleChange} placeholder="e.g., 1 for NaOH, 2 for H₂SO₄" required />
                </div>
              )}
          </div>
          
          {/* Analyte Section */}
           <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{labels.analyte} Details</h3>
              <div className="space-y-4">
                <Input id="analyteName" name="analyteName" label={`${labels.analyte} Name`} type="text" value={formData.analyteName} onChange={handleChange} placeholder="e.g., Acetic Acid" required />
                <div className="flex items-center">
                    <input type="checkbox" id="showMassCalc" checked={showMassCalc} onChange={e => setShowMassCalc(e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                    <label htmlFor="showMassCalc" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Calculate mass and purity (optional)</label>
                </div>
                {showMassCalc && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <Input id="analyteMolarMass" name="analyteMolarMass" label="Molar Mass (g/mol)" type="number" step="any" min="0" value={formData.analyteMolarMass || ''} onChange={handleChange} placeholder="e.g., 60.05" required={showMassCalc}/>
                        <Input id="sampleMass" name="sampleMass" label="Sample Mass (g)" type="number" step="any" min="0" value={formData.sampleMass || ''} onChange={handleChange} placeholder="Total mass of sample" />
                    </div>
                )}
              </div>
          </div>

          {/* Volume Section */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Volume & Stoichiometry</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Titration Volume</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input type="number" name="titrationVolume" step="any" min="0" value={formData.titrationVolume} onChange={handleChange} className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500" required/>
                        <select name="titrationVolumeUnit" value={formData.titrationVolumeUnit} onChange={handleChange} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm">
                            <option value={VolumeUnit.mL}>mL</option>
                            <option value={VolumeUnit.L}>L</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Blank Volume (optional)</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input type="number" name="blankVolume" step="any" min="0" value={formData.blankVolume} onChange={handleChange} className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500"/>
                        <select name="blankVolumeUnit" value={formData.blankVolumeUnit} onChange={handleChange} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm">
                            <option value={VolumeUnit.mL}>mL</option>
                            <option value={VolumeUnit.L}>L</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sample Volume</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input type="number" name="sampleVolume" step="any" min="0" value={formData.sampleVolume} onChange={handleChange} className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500" required/>
                        <select name="sampleVolumeUnit" value={formData.sampleVolumeUnit} onChange={handleChange} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm">
                            <option value={VolumeUnit.mL}>mL</option>
                            <option value={VolumeUnit.L}>L</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-end space-x-2">
                    <Input id="titrantStoichiometry" name="titrantStoichiometry" label="Molar Ratio" type="number" min="1" step="1" value={formData.titrantStoichiometry} onChange={handleChange} required />
                    <span className="pt-6 font-bold">:</span>
                    <Input id="analyteStoichiometry" name="analyteStoichiometry" label="(Titrant : Analyte)" type="number" min="1" step="1" value={formData.analyteStoichiometry} onChange={handleChange} required />
                </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Calculate Concentration</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};