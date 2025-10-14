'use client';
import { useState } from 'react';

export default function CalculationForm({ selectedHeirs, onCalculate, isLoading }) {
  const [tirkah, setTirkah] = useState('');
  const [error, setError] = useState('');

  const formatCurrency = (value) => {
    if (!value) return '';
    const number = value.replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const handleTirkahChange = (e) => {
    setTirkah(e.target.value.replace(/\D/g, ''));
    setError('');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tirkah || parseFloat(tirkah) <= 0) {
      setError('Masukkan jumlah harta yang valid.');
      return;
    }
    const ahliWarisPayload = {};
    selectedHeirs.forEach(h => {
      ahliWarisPayload[h.key] = h.quantity;
    });
    onCalculate({ ahliWaris: ahliWarisPayload, tirkah: parseFloat(tirkah) });
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Input Harta Waris</h2>
        <p className="text-green-100 text-sm mt-1">Masukkan total harta yang akan dibagikan</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Input Tirkah */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Total Harta Waris (Tirkah)
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              Rp
            </div>
            <input 
              type="text" 
              value={formatCurrency(tirkah)} 
              onChange={handleTirkahChange} 
              className="w-full pl-14 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xl font-bold text-gray-800 transition-all" 
              placeholder="0"
              disabled={isLoading}
            />
          </div>
          {tirkah && (
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Terbilang:</span> {formatCurrency(tirkah)} Rupiah
            </p>
          )}
        </div>
        
        {/* Selected Heirs Summary */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <h3 className="font-bold text-green-900">Ahli Waris yang Akan Menerima</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {selectedHeirs.map(heir => (
              <div key={heir.key} className="bg-white border border-green-300 rounded-lg px-3 py-2 shadow-sm">
                <div className="font-semibold text-gray-800 text-sm">{heir.nama_id}</div>
                <div className="text-xs text-gray-600 font-arabic">{heir.nama_ar}</div>
                {heir.quantity > 1 && (
                  <div className="text-xs font-bold text-green-600 mt-1">Jumlah: {heir.quantity} orang</div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}
        
        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading || !tirkah} 
          className="w-full py-4 rounded-xl font-bold text-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menghitung...
            </>
          ) : (
            <>
              🧮 Hitung Warisan
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}