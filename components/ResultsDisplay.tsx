
import React from 'react';
import { TitrationResult } from '../types';
import { Card, CardHeader, CardContent } from './Card';

interface ResultsDisplayProps {
  result: TitrationResult;
}

const formatNumber = (num: number) => {
    if (num === 0) return '0';
    if (Math.abs(num) < 1e-4) {
        return num.toExponential(4);
    }
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const hasMassResults = result.analyteMassInSample !== undefined;
  
  return (
    <Card className="mt-8 animate-fade-in">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Calculation Results for {result.analyteName}</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
            {/* Final Concentrations */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">Analyte Concentration</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formatNumber(result.analyteConcentrationMolL)} mol/L
                </p>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {result.analyteConcentrationGL && (
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-800/30 rounded">
                            <div className="font-bold">{formatNumber(result.analyteConcentrationGL)}</div>
                            <div className="text-xs text-indigo-800 dark:text-indigo-200">g/L</div>
                        </div>
                    )}
                    {result.analytePurity && (
                         <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded">
                            <div className="font-bold">{formatNumber(result.analytePurity)}</div>
                            <div className="text-xs text-green-800 dark:text-green-200">% Purity</div>
                        </div>
                    )}
                     {result.analyteConcentrationNormality && (
                         <div className="p-2 bg-indigo-100 dark:bg-indigo-800/30 rounded">
                            <div className="font-bold">{formatNumber(result.analyteConcentrationNormality)}</div>
                            <div className="text-xs text-indigo-800 dark:text-indigo-200">eq/L (N)</div>
                        </div>
                    )}
                    {result.analyteMassInSample && (
                         <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded">
                            <div className="font-bold">{formatNumber(result.analyteMassInSample)}</div>
                            <div className="text-xs text-purple-800 dark:text-purple-200">g in sample</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Step-by-step breakdown */}
            <div>
                <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Step-by-Step Breakdown</h3>
                <ul className="space-y-2">
                    <li className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md">
                        <span className="font-medium text-sm text-gray-500 dark:text-gray-400">1. Corrected Titrant Volume: </span>
                        <span className="font-semibold text-gray-900 dark:text-white float-right">{formatNumber(result.correctedTitrantVolumeL)} L</span>
                    </li>
                    <li className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md">
                        <p className="font-medium text-sm text-gray-500 dark:text-gray-400">2. Moles of Titrant</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300"><code className="bg-gray-200 dark:bg-gray-700 p-1 rounded text-xs">n_titrant = C_titrant * V_corrected</code></p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(result.molesOfTitrant)} mol</p>
                    </li>
                    {result.equivalentsOfTitrant && (
                        <li className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md">
                            <p className="font-medium text-sm text-gray-500 dark:text-gray-400">3. Equivalents of Titrant</p>
                             <p className="text-xs text-gray-600 dark:text-gray-300"><code className="bg-gray-200 dark:bg-gray-700 p-1 rounded text-xs">eq_titrant = N_titrant * V_corrected</code></p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(result.equivalentsOfTitrant)} eq</p>
                        </li>
                    )}
                    <li className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md">
                        <p className="font-medium text-sm text-gray-500 dark:text-gray-400">4. Moles of Analyte</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300"><code className="bg-gray-200 dark:bg-gray-700 p-1 rounded text-xs">n_analyte = n_titrant * (ratio)</code></p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(result.molesOfAnalyte)} mol</p>
                    </li>
                    <li className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md">
                        <p className="font-medium text-sm text-gray-500 dark:text-gray-400">5. Analyte Concentration (mol/L)</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300"><code className="bg-gray-200 dark:bg-gray-700 p-1 rounded text-xs">C_analyte = n_analyte / V_sample</code></p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(result.analyteConcentrationMolL)} mol/L</p>
                    </li>
                     {hasMassResults && (
                        <>
                            {result.analyteMassInSample && (
                                <li className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md">
                                    <p className="font-medium text-sm text-gray-500 dark:text-gray-400">6. Mass of Analyte</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300"><code className="bg-gray-200 dark:bg-gray-700 p-1 rounded text-xs">mass = n_analyte * MolarMass</code></p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(result.analyteMassInSample)} g</p>
                                </li>
                            )}
                             {result.analytePurity && (
                                <li className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md">
                                    <p className="font-medium text-sm text-gray-500 dark:text-gray-400">7. Sample Purity</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300"><code className="bg-gray-200 dark:bg-gray-700 p-1 rounded text-xs">%Purity = (mass_analyte / mass_sample) * 100</code></p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(result.analytePurity)} %</p>
                                </li>
                            )}
                        </>
                     )}
                </ul>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};
