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
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Kalkulator Faraid</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      {/* Step 1: Heir Selection */}
      {step === 1 && (
        <div>
          <HeirSelector heirs={heirs} selectedHeirs={selectedHeirs} onHeirToggle={handleHeirToggle} onQuantityChange={handleQuantityChange} />
          {selectedHeirs.length > 0 && (
            <div className="text-center mt-6">
              <button onClick={() => setStep(2)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all">
                Lanjut ke Input Harta →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Calculation Form */}
      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} className="text-green-600 hover:text-green-700 font-bold mb-4">← Kembali Pilih Ahli Waris</button>
          <CalculationForm selectedHeirs={selectedHeirs} onCalculate={handleCalculate} isLoading={isLoading} />
        </div>
      )}

      {/* Step 3: Result */}
      {step === 3 && result && (
        <div id="result-section">
          <button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg mb-4">🔄 Hitung Ulang</button>
          <ResultDisplay result={result} />
        </div>
      )}
    </div>
  );
}