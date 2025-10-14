// components/HamlForm.jsx

'use client';
import { useState } from 'react';

export default function HamlForm({ selectedHeirs, onCalculate, isLoading }) {
    const [tirkah, setTirkah] = useState('');
    const [hubunganBayi, setHubunganBayi] = useState('anak');
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

        if (!tirkah || parseFloat(tirkah) <= 0) {
            setError('Masukkan jumlah harta (Tirkah) yang valid.');
            return;
        }

        // Tentukan ahli waris mana yang akan digantikan oleh janin
        const keysToExclude = hubunganBayi === 'anak' 
            ? ['anak_lk', 'anak_pr'] 
            : ['cucu_lk', 'cucu_pr'];

        // Filter ahli waris yang sudah dipilih, buang anak/cucu yang ada
        const filteredHeirs = selectedHeirs.filter(h => !keysToExclude.includes(h.key));
        
        // Buat payload HANYA dari ahli waris yang sudah difilter
        const ahliWarisPayload = {};
        filteredHeirs.forEach(h => { ahliWarisPayload[h.key] = h.quantity; });

        onCalculate({ 
            ahliWaris: ahliWarisPayload, 
            tirkah: parseFloat(tirkah), 
            hubunganBayi 
        });
    };

    const keysToExclude = hubunganBayi === 'anak' 
        ? ['anak_lk', 'anak_pr'] 
        : ['cucu_lk', 'cucu_pr'];
    
    const filteredSelectedHeirs = selectedHeirs.filter(h => !keysToExclude.includes(h.key));

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Langkah 2: Input Data Warisan
                </h2>
                <p className="text-sm text-gray-600 mt-1">Masukkan informasi hubungan janin dan jumlah harta</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Hubungan Janin */}
                <div className="space-y-2">
                    <label htmlFor="hubunganBayi" className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                        </svg>
                        Hubungan Janin dengan Mayit
                    </label>
                    <select 
                        id="hubunganBayi"
                        value={hubunganBayi} 
                        onChange={(e) => setHubunganBayi(e.target.value)} 
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-700 font-semibold"
                    >
                        <option value="anak">Anak dari Mayit</option>
                        <option value="cucu">Cucu dari Anak Laki-laki Mayit</option>
                    </select>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs text-blue-700">
                            <span className="font-bold">Catatan:</span> Jika Anda memilih hubungan <span className="font-semibold">"{hubunganBayi === 'anak' ? 'Anak' : 'Cucu'}"</span>, maka pilihan "{hubunganBayi === 'anak' ? 'Anak Laki-laki/Perempuan' : 'Cucu Laki-laki/Perempuan'}" dari langkah sebelumnya akan diabaikan dan digantikan oleh janin.
                        </p>
                    </div>
                </div>

                {/* Total Harta */}
                <div className="space-y-2">
                    <label htmlFor="tirkah" className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        Total Harta Waris (Tirkah)
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">Rp</span>
                        <input 
                            id="tirkah"
                            type="text" 
                            value={formatCurrency(tirkah)} 
                            onChange={handleTirkahChange} 
                            className="w-full pl-14 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-xl font-bold text-gray-800" 
                            placeholder="0" 
                        />
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Masukkan total harta yang akan dibagikan
                    </p>
                </div>
                
                {/* Summary Ahli Waris */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-amber-900">Ahli Waris yang Dihitung (Selain Janin):</h3>
                    </div>
                    
                    {filteredSelectedHeirs.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {filteredSelectedHeirs.map(heir => (
                                <div key={heir.key} className="bg-white border-2 border-amber-300 rounded-lg px-3 py-2 flex items-center gap-2">
                                    <span className="text-lg">{heir.key.includes('lk') ? '👨' : '👩'}</span>
                                    <span className="font-semibold text-amber-900">{heir.nama_id}</span>
                                    <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">×{heir.quantity}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border-2 border-amber-200 rounded-lg p-3 text-center">
                            <span className="text-sm text-amber-700">Tidak ada ahli waris lain (hanya janin yang dihitung sebagai keturunan)</span>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-700 font-semibold text-sm">{error}</p>
                    </div>
                )}
                
                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full py-4 rounded-xl font-bold text-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
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
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                            </svg>
                            Hitung Warisan Haml
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}