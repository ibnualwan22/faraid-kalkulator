'use client';
import { useState, useEffect } from 'react';
import HeirSelector from '@/components/HeirSelector';
import CalculationForm from '@/components/CalculationForm';
import ResultDisplay from '@/components/ResultDisplay';

export default function HomePage() {
  const [heirs, setHeirs] = useState([]);
  const [selectedHeirs, setSelectedHeirs] = useState([]);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchHeirs = async () => {
      try {
        const response = await fetch('/api/heirs');
        if (!response.ok) throw new Error('Gagal memuat daftar ahli waris.');
        const data = await response.json();
        setHeirs(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchHeirs();
  }, []);

  const handleHeirToggle = (heir) => {
    const exists = selectedHeirs.find(h => h.key === heir.key);
    if (exists) {
      setSelectedHeirs(selectedHeirs.filter(h => h.key !== heir.key));
    } else {
      setSelectedHeirs([...selectedHeirs, { ...heir, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (heirKey, quantity) => {
    setSelectedHeirs(selectedHeirs.map(h => h.key === heirKey ? { ...h, quantity: Math.max(1, quantity) } : h));
  };

  const handleCalculate = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('/api/hitung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resultData = await response.json();
      if (!response.ok) throw new Error(resultData.error || 'Terjadi kesalahan.');
      setResult(resultData);
      setStep(3);
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedHeirs([]);
    setResult(null);
    setStep(1);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
          <span className="text-3xl">🕌</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-800">
          Kalkulator Faraid
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Berdasarkan kitab <span className="font-semibold text-green-600">Zahrotul Faridhoh</span> karya Ust. Arinal Haq Zakiyyat
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 font-medium">Sedang Dalam Beta Testing</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Step 1: Heir Selection */}
      {step === 1 && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pilih Ahli Waris</h2>
            <p className="text-gray-600">Pilih ahli waris yang berhak mendapat warisan</p>
          </div>
          
          <HeirSelector 
            heirs={heirs} 
            selectedHeirs={selectedHeirs} 
            onHeirToggle={handleHeirToggle} 
            onQuantityChange={handleQuantityChange} 
          />
          
          {selectedHeirs.length > 0 && (
            <div className="text-center mt-8">
              <button 
                onClick={() => setStep(2)} 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2"
              >
                Lanjut ke Input Harta
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Calculation Form */}
      {step === 2 && (
        <div>
          <button 
            onClick={() => setStep(1)} 
            className="text-green-600 hover:text-green-700 font-semibold mb-6 inline-flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali Pilih Ahli Waris
          </button>
          <CalculationForm 
            selectedHeirs={selectedHeirs} 
            onCalculate={handleCalculate} 
            isLoading={isLoading} 
          />
        </div>
      )}

      {/* Step 3: Result */}
      {step === 3 && result && (
        <div id="result-section">
          <button 
            onClick={handleReset} 
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg mb-6 inline-flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Hitung Ulang
          </button>
          <ResultDisplay result={result} />
        </div>
      )}
    </div>
  );
}