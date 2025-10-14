// app/kasus-khusus/munasakhot/page.js

'use client';
import { useState, useEffect } from 'react';
import MunasakhotForm from '@/components/MunasakhotForm';
import MunasakhotResultDisplay from '@/components/MunasakhotResultDisplay';

export default function MunasakhotPage() {
    const [heirs, setHeirs] = useState([]);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const handleCalculate = async (data) => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await fetch('/api/hitung/munasakhot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const resultData = await response.json();
            if (!response.ok) throw new Error(resultData.error || 'Terjadi kesalahan.');
            setResult(resultData);
            setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
                    <div className="bg-emerald-600 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl">🔄</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Kalkulator Waris Munasakhah (المناسخة)</h1>
                                <p className="text-emerald-100 text-sm mt-1">Perhitungan warisan berlapis jika ahli waris meninggal sebelum harta dibagi</p>
                            </div>
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="bg-blue-50 border-t border-blue-200 px-6 py-4">
                        <div className="flex gap-3">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h4 className="font-bold text-blue-900 mb-1">Tentang Munasakhah</h4>
                                <p className="text-sm text-blue-800">
                                    Munasakhah terjadi ketika salah satu ahli waris dari pembagian pertama meninggal dunia sebelum harta dibagi. Bagiannya akan diteruskan kepada ahli warisnya sendiri.
                                </p>
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

                {/* Form or Results */}
                {!result ? (
                    <MunasakhotForm heirs={heirs} onCalculate={handleCalculate} isLoading={isLoading} />
                ) : (
                    <div id="result-section" className="space-y-6">
                        <button 
                            onClick={handleReset} 
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                            Hitung Ulang
                        </button>
                        <MunasakhotResultDisplay result={result} />
                    </div>
                )}
            </div>
        </div>
    );
}