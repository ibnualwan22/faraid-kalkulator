// components/MunasakhotForm.jsx

'use client';
import { useState } from 'react';
import HeirSelector from './HeirSelector';

// Sub-komponen untuk menangani input per masalah
const ProblemCard = ({ title, problem, setProblem, heirs, showTirkah = true, icon }) => {
    const formatCurrency = (value) => {
        if (!value) return '';
        const number = value.replace(/\D/g, '');
        return new Intl.NumberFormat('id-ID').format(number);
    };

    const handleTirkahChange = (e) => {
        setProblem({ ...problem, tirkah: e.target.value.replace(/\D/g, '') });
    };

    const onHeirToggle = (heir) => {
        const newHeirs = problem.selectedHeirs.find(h => h.key === heir.key)
            ? problem.selectedHeirs.filter(h => h.key !== heir.key)
            : [...problem.selectedHeirs, { ...heir, quantity: 1 }];
        setProblem({ ...problem, selectedHeirs: newHeirs });
    };

    const onQuantityChange = (heirKey, quantity) => {
        const newHeirs = problem.selectedHeirs.map(h => 
            h.key === heirKey ? { ...h, quantity: Math.max(1, quantity) } : h
        );
        setProblem({ ...problem, selectedHeirs: newHeirs });
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    {title}
                </h3>
            </div>
            <div className="p-6 space-y-6">
                {showTirkah && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Total Harta Waris (Tirkah)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">Rp</span>
                            <input 
                                type="text" 
                                value={formatCurrency(problem.tirkah)} 
                                onChange={handleTirkahChange} 
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-semibold text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all" 
                                placeholder="0" 
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Pilih Ahli Waris
                    </label>
                    <HeirSelector 
                        heirs={heirs} 
                        selectedHeirs={problem.selectedHeirs} 
                        onHeirToggle={onHeirToggle} 
                        onQuantityChange={onQuantityChange} 
                    />
                </div>
            </div>
        </div>
    );
};


// Komponen Form Utama
export default function MunasakhotForm({ heirs, onCalculate, isLoading }) {
    const [masalah1, setMasalah1] = useState({ tirkah: '', selectedHeirs: [] });
    const [masalah2, setMasalah2] = useState({ selectedHeirs: [] });
    const [mayitKeduaKey, setMayitKeduaKey] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        setError('');
        if (!masalah1.tirkah || parseFloat(masalah1.tirkah) <= 0) {
            setError('Masukkan Tirkah yang valid untuk Masalah Pertama.');
            return;
        }
        if (masalah1.selectedHeirs.length === 0) {
            setError('Pilih minimal satu ahli waris untuk Masalah Pertama.');
            return;
        }
        if (!mayitKeduaKey) {
            setError('Pilih siapa ahli waris dari Masalah Pertama yang meninggal dunia.');
            return;
        }
        if (masalah2.selectedHeirs.length === 0) {
            setError('Pilih minimal satu ahli waris untuk Masalah Kedua.');
            return;
        }

        const payload = {
            masalah_pertama: {
                tirkah: masalah1.tirkah,
                ahliWaris: masalah1.selectedHeirs.reduce((acc, h) => ({ ...acc, [h.key]: h.quantity }), {})
            },
            mayit_kedua_key: mayitKeduaKey,
            masalah_kedua: {
                ahliWaris: masalah2.selectedHeirs.reduce((acc, h) => ({ ...acc, [h.key]: h.quantity }), {})
            }
        };
        onCalculate(payload);
    };

    return (
        <div className="space-y-6">
            <ProblemCard 
                title="Masalah #1 (Mayit Pertama)" 
                problem={masalah1} 
                setProblem={setMasalah1} 
                heirs={heirs} 
                showTirkah={true}
                icon="①"
            />
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-xl">⚰️</span>
                        Pilih Mayit Kedua
                    </h3>
                </div>
                <div className="p-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ahli Waris dari Masalah #1 yang Meninggal Dunia (Mayit Kedua)
                    </label>
                    <select 
                        value={mayitKeduaKey} 
                        onChange={e => setMayitKeduaKey(e.target.value)} 
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 font-semibold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    >
                        <option value="">-- Pilih Mayit Kedua --</option>
                        {masalah1.selectedHeirs.filter(h => !h.isMahjub).map(h => (
                            <option key={h.key} value={h.key}>{h.nama_id}</option>
                        ))}
                    </select>
                    {mayitKeduaKey && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                ℹ️ Bagian dari ahli waris ini akan diteruskan kepada ahli warisnya sendiri
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <ProblemCard 
                title="Masalah #2 (Ahli Waris dari Mayit Kedua)" 
                problem={masalah2} 
                setProblem={setMasalah2} 
                heirs={heirs} 
                showTirkah={false}
                icon="②"
            />

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">⚠️</span>
                        <p className="text-red-700 font-semibold">{error}</p>
                    </div>
                </div>
            )}

            <button 
                onClick={handleSubmit} 
                disabled={isLoading} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg text-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Menghitung...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Hitung Warisan Munasakhah
                    </>
                )}
            </button>
        </div>
    );
}