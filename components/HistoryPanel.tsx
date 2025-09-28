
import React from 'react';
import { TitrationRecord } from '../types';
import { Card, CardHeader, CardContent } from './Card';
import { TrashIcon } from './icons';
import { Button } from './Button';

interface HistoryPanelProps {
  history: TitrationRecord[];
  clearHistory: () => void;
}

const formatNumber = (num: number) => {
    if (Math.abs(num) < 1e-3 && num !== 0) {
        return num.toExponential(2);
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: 3 });
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, clearHistory }) => {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">History</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your recent calculations.</p>
        </div>
        {history.length > 0 && (
            <Button variant="secondary" onClick={clearHistory} aria-label="Clear history">
                <TrashIcon className="h-5 w-5"/>
            </Button>
        )}
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No calculations yet.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Your results will appear here.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {history.map((record) => (
              <li key={record.id} className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{record.input.analyteName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(record.id).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-indigo-600 dark:text-indigo-400">{formatNumber(record.result.analyteConcentrationMolL)} mol/L</p>
                        {record.result.analytePurity && <p className="text-sm font-semibold text-green-600 dark:text-green-400">{formatNumber(record.result.analytePurity)}% pure</p>}
                    </div>
                </div>
                 <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-600 pt-2">
                    {record.input.titrantName} ({formatNumber(record.input.titrantConcentration)} M) &rarr; {record.input.analyteName} ({formatNumber(record.input.sampleVolume)} {record.input.sampleVolumeUnit})
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
