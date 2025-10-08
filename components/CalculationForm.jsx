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

  const handleTirkahChange = (e) => setTirkah(e.target.value.replace(/\D/g, ''));
  
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Harta Waris (Tirkah) dalam Rupiah</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
            <input type="text" value={formatCurrency(tirkah)} onChange={handleTirkahChange} className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold" placeholder="0" />
          </div>
        </div>
        
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">✅ Ahli Waris Terpilih:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedHeirs.map(heir => <span key={heir.key} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{heir.nama_id} (x{heir.quantity})</span>)}
          </div>
        </div>
        
        {error && <p className="text-red-600 text-sm">{error}</p>}
        
        <button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg font-bold text-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition-all shadow-lg hover:shadow-xl">
          {isLoading ? 'Menghitung...' : '🧮 Hitung Warisan'}
        </button>
      </form>
    </div>
  );
}