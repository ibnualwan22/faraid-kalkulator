// app/kasus-khusus/haml/page.js

'use client';
import { useState, useEffect } from 'react';
import HeirSelector from '@/components/HeirSelector';
import HamlForm from '@/components/HamlForm';
import HamlResultDisplay from '@/components/HamlResultDisplay';

export default function HamlPage() {
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

    const handleCalculateHaml = async (data) => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await fetch('/api/hitung/haml', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const resultData = await response.json();
            if (!response.ok) throw new Error(resultData.error || 'Terjadi kesalahan pada server.');
            setResult(resultData);
            setStep(3);
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
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
                    <div className="bg-emerald-600 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🤰</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Kalkulator Waris Janin (Haml)</h1>
                                <p className="text-emerald-100 text-sm mt-1">Perhitungan warisan dengan keberadaan janin dalam kandungan</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                    {step > 1 ? '✓' : '1'}
                                </div>
                                <span className={`font-semibold ${step >= 1 ? 'text-emerald-700' : 'text-gray-500'}`}>Pilih Ahli Waris</span>
                            </div>
                            <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-emerald-600' : 'bg-gray-300'}`}></div>
                            <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                    {step > 2 ? '✓' : '2'}
                                </div>
                                <span className={`font-semibold ${step >= 2 ? 'text-emerald-700' : 'text-gray-500'}`}>Input Data</span>
                            </div>
                            <div className={`w-16 h-1 rounded ${step >= 3 ? 'bg-emerald-600' : 'bg-gray-300'}`}></div>
                            <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                    3
                                </div>
                                <span className={`font-semibold ${step >= 3 ? 'text-emerald-700' : 'text-gray-500'}`}>Hasil</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <span className="text-xl">⚠️</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-red-800">Terjadi Kesalahan</h3>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 1: Heir Selection */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                    Langkah 1: Pilih Ahli Waris yang Ada
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">Pilih ahli waris selain janin yang akan diperhitungkan</p>
                            </div>
                            <div className="p-6">
                                <HeirSelector 
                                    heirs={heirs} 
                                    selectedHeirs={selectedHeirs} 
                                    onHeirToggle={handleHeirToggle} 
                                    onQuantityChange={handleQuantityChange} 
                                />
                            </div>
                        </div>

                        {selectedHeirs.length > 0 && (
                            <div className="flex justify-center">
                                <button 
                                    onClick={() => setStep(2)} 
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-all flex items-center gap-2 text-lg"
                                >
                                    Lanjut ke Input Data
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Form Input */}
                {step === 2 && (
                    <div className="space-y-6">
                        <button 
                            onClick={() => setStep(1)} 
                            className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Kembali Pilih Ahli Waris
                        </button>
                        <HamlForm 
                            selectedHeirs={selectedHeirs} 
                            onCalculate={handleCalculateHaml} 
                            isLoading={isLoading} 
                        />
                    </div>
                )}

                {/* Step 3: Results */}
                {step === 3 && result && (
                    <div className="space-y-6">
                        <button 
                            onClick={handleReset} 
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                            Hitung Ulang
                        </button>
                        <HamlResultDisplay result={result} />
                    </div>
                )}
            </div>
        </div>
    );
}