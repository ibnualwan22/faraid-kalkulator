// components/MafqudForm.jsx

'use client';
import { useState } from 'react';

export default function MafqudForm({ selectedHeirs, onCalculate, isLoading }) {
    const [tirkah, setTirkah] = useState('');
    const [mafqudKey, setMafqudKey] = useState(selectedHeirs[0]?.key || '');
    const [error, setError] = useState('');

    const formatCurrency = (value) => {
        if (!value) return '';
        const number = value.replace(/\D/g, '');
        return new Intl.NumberFormat('id-ID').format(number);
    };

    const handleTirkahChange = (e) => {
        setTirkah(e.target.value.replace(/\D/g, ''));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!mafqudKey) { 
            setError('Pilih siapa ahli waris yang hilang (Mafqud).'); 
            return; 
        }
        if (!tirkah || parseFloat(tirkah) <= 0) {
            setError('Masukkan jumlah harta (Tirkah) yang valid.');
            return;
        }

        const ahliWarisPayload = {};
        selectedHeirs.forEach(h => { ahliWarisPayload[h.key] = h.quantity; });

        onCalculate({ ahliWaris: ahliWarisPayload, tirkah: parseFloat(tirkah), mafqudKey });
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-emerald-600 px-6 py-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Langkah 2: Input Data Harta
                </h2>
                <p className="text-emerald-100 text-sm mt-1">Masukkan detail ahli waris yang hilang dan jumlah harta waris</p>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Pilih Mafqud */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">
                        <svg className="w-4 h-4 inline mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Pilih Ahli Waris yang Hilang (Mafqud)
                    </label>
                    <select 
                        value={mafqudKey} 
                        onChange={(e) => setMafqudKey(e.target.value)} 
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all"
                    >
                        <option value="">-- Pilih Ahli Waris --</option>
                        {selectedHeirs.map(h => (
                            <option key={h.key} value={h.key}>{h.nama_id}</option>
                        ))}
                    </select>
                </div>

                {/* Input Tirkah */}
                <div>
                    <label htmlFor="tirkah" className="block text-sm font-bold text-gray-800 mb-3">
                        <svg className="w-4 h-4 inline mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.16 5.314l4.897 1.348c.22.061.484.055.703-.02l4.71-1.494a1 1 0 01.707 1.886l-4.71 1.495c-.696.22-1.49.228-2.204.02l-4.897-1.348a1 1 0 01-.707-1.186 1 1 0 011.186-.707zM2 10a1 1 0 011-1h13.586L14 8.414a1 1 0 111.414-1.414l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 11H3a1 1 0 01-1-1z" />
                        </svg>
                        Total Harta Waris (Tirkah)
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-lg">Rp</span>
                        <input 
                            id="tirkah"
                            type="text" 
                            value={formatCurrency(tirkah)} 
                            onChange={handleTirkahChange} 
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-bold text-gray-800 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all" 
                            placeholder="0"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Masukkan jumlah harta dalam rupiah</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-base">⚠️</span>
                            </div>
                            <p className="text-red-700 font-medium text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full py-4 rounded-xl font-bold text-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Menghitung...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0V6H3a1 1 0 110-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM16 2a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6h-1a1 1 0 110-2h1V3a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Hitung Warisan Mafqud
                        </span>
                    )}
                </button>
            </form>
        </div>
    );
}