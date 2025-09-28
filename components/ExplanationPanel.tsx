import React from 'react';

// This helper function takes a string like "H2O" and returns React elements like <>H<sub>2</sub>O</>
const formatFormula = (formula: string): React.ReactNode => {
  // Regex to split by numbers, charges, or parentheses while keeping them
  const parts = formula.split(/(\d+|[2-9]?[+-]|\(|\))/);
  
  return parts.map((part, index) => {
    if (!part) return null;
    // Style numbers as subscripts
    if (/^\d+$/.test(part)) {
      return <sub key={index}>{part}</sub>;
    }
    // Style charges (e.g., 2+, +, 3-) as superscripts
    if (/^[2-9]?[+-]$/.test(part)) {
        return <sup key={index}>{part}</sup>
    }
    return part;
  });
};

// This function takes a full equation string and formats each chemical formula within it
const formatEquation = (equation: string): React.ReactNode[] => {
    return equation.split(' ').map((part, index) => {
        // Only apply formula formatting to parts that look like formulas/ions
        if (/[A-Za-z]/.test(part)) {
            return <span key={index}>{formatFormula(part)} </span>;
        }
        // Return other parts (like +, →) as they are
        return <span key={index}>{part} </span>;
    });
};

interface TitrationInfo {
  mechanism: string;
  principle: string;
  exampleEquation: string;
}

interface ExplanationPanelProps {
  info: TitrationInfo;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ info }) => {
  return (
    <div className="my-2 p-4 border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-gray-800/50 rounded-lg animate-fade-in">
      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">Chemical Context</h3>
      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Reaction Mechanism</h4>
          <p className="text-gray-600 dark:text-gray-400">{info.mechanism}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Titration Principle</h4>
          <p className="text-gray-600 dark:text-gray-400">{info.principle}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300">Example Balanced Equation</h4>
          <p className="text-gray-800 dark:text-gray-200 font-mono bg-gray-100 dark:bg-gray-700/50 p-2 rounded text-center text-base tracking-wide">
            <code>{formatEquation(info.exampleEquation)}</code>
          </p>
        </div>
      </div>
    </div>
  );
};