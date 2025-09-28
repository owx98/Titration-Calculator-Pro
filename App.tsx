
import React, { useState } from 'react';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { HistoryPanel } from './components/HistoryPanel';
import { TitrationRecord, TitrationResult, TitrationInput } from './types';
import { useDarkMode } from './hooks/useDarkMode';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [history, setHistory] = useLocalStorage<TitrationRecord[]>('titrationHistory', []);
  const [currentResult, setCurrentResult] = useState<TitrationResult | null>(null);

  const handleCalculation = (input: TitrationInput, result: TitrationResult) => {
    setCurrentResult(result);
    const newRecord: TitrationRecord = {
      id: Date.now(),
      input,
      result,
    };
    setHistory([newRecord, ...history]);
  };
  
  const clearHistory = () => {
    setHistory([]);
    setCurrentResult(null);
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CalculatorForm onCalculate={handleCalculation} />
            {currentResult && <ResultsDisplay result={currentResult} />}
          </div>
          <div>
            <HistoryPanel history={history} clearHistory={clearHistory} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
