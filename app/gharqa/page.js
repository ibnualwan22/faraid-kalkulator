'use client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import GharqaProblemCard from '@/components/GharqaProblemCard';
import GharqaResultDisplay from '@/components/GharqaResultDisplay';

// Komponen Form Utama
const GharqaForm = ({ heirs, onCalculate, isLoading }) => {
    const [masalahList, setMasalahList] = useState([
        { id: uuidv4(), namaMayit: 'Mayit Pertama', tirkah: '', selectedHeirs: [] },
        { id: uuidv4(), namaMayit: 'Mayit Kedua', tirkah: '', selectedHeirs: [] }
    ]);

    const addProblem = () => {
        setMasalahList([...masalahList, { 
            id: uuidv4(), 
            namaMayit: `Mayit ke-${masalahList.length + 1}`, 
            tirkah: '', 
            selectedHeirs: [] 
        }]);
    };

    const removeProblem = (id) => {
        setMasalahList(masalahList.filter(m => m.id !== id));
    };

    const updateMasalah = (id, updates) => {
        setMasalahList(masalahList.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const handleSubmit = () => {
        const payload = masalahList.map(m => ({
            namaMayit: m.namaMayit,
            tirkah: m.tirkah,
            ahliWaris: m.selectedHeirs.reduce((acc, h) => {
                acc[h.key] = h.quantity;
                return acc;
            }, {})
        }));
        onCalculate({ daftarMasalah: payload });
    };

    return (
        <div className="space-y-6">
            {/* Cards untuk setiap mayit */}
            {masalahList.map((masalah, index) => (
                <GharqaProblemCard 
                    key={masalah.id} 
                    index={index} 
                    masalah={masalah} 
                    heirs={heirs} 
                    updateMasalah={updateMasalah} 
                    removeProblem={removeProblem} 
                    canRemove={masalahList.length > 2} 
                />
            ))}

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <button 
                        onClick={addProblem} 
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Tambah Mayit
                    </button>
                    
                    <button 
                        onClick={handleSubmit} 
                        disabled={isLoading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Menghitung...
                            </>
                        ) : (
                            <>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                Hitung Warisan Gharqa
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};


// Halaman Utama
export default function GharqaPage() {
    const [heirs, setHeirs] = useState([]);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHeirs = async () => {
            const response = await fetch('/api/heirs');
            const data = await response.json();
            setHeirs(data);
        };
        fetchHeirs();
    }, []);

    const handleCalculate = async (data) => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await fetch('/api/hitung/gharqa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const resultData = await response.json();
            if (!response.ok) throw new Error(resultData.error || 'Terjadi kesalahan.');
            setResult(resultData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-green py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-green-700 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                <span className="text-4xl">⚖️</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Kalkulator Mati Bersamaan</h1>
                                <p className="text-green-100 text-lg mt-1 font-arabic">الغرقى - Al-Gharqā</p>
                                <p className="text-green-200 text-sm mt-2">
                                    Perhitungan warisan untuk kasus beberapa orang meninggal bersamaan
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Catatan Penting:</h3>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• Setiap mayit dihitung secara terpisah dan <strong>tidak saling mewarisi</strong></li>
                                    <li>• Minimal ada 2 mayit untuk kasus gharqa</li>
                                    <li>• Pastikan data ahli waris setiap mayit sudah benar</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-red-900">Terjadi Kesalahan</p>
                                <p className="text-sm text-red-800 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form atau Result */}
                {!result ? (
                    <GharqaForm heirs={heirs} onCalculate={handleCalculate} isLoading={isLoading} />
                ) : (
                    <div className="space-y-6">
                        {/* Reset Button */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                            <button 
                                onClick={() => setResult(null)} 
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                                Hitung Ulang
                            </button>
                        </div>

                        {/* Result Display */}
                        <GharqaResultDisplay result={result.hasilPerhitungan} />
                    </div>
                )}
            </div>
        </div>
    );
}