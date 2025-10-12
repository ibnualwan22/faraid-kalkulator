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

        // --- PERBAIKAN UTAMA DI SINI ---
        // Tentukan ahli waris mana yang akan digantikan oleh janin
        const keysToExclude = hubunganBayi === 'anak' 
            ? ['anak_lk', 'anak_pr'] 
            : ['cucu_lk', 'cucu_pr'];

        // Filter ahli waris yang sudah dipilih, buang anak/cucu yang ada
        const filteredHeirs = selectedHeirs.filter(h => !keysToExclude.includes(h.key));
        
        // Buat payload HANYA dari ahli waris yang sudah difilter
        const ahliWarisPayload = {};
        filteredHeirs.forEach(h => { ahliWarisPayload[h.key] = h.quantity; });
        // --------------------------------

        onCalculate({ 
            ahliWaris: ahliWarisPayload, 
            tirkah: parseFloat(tirkah), 
            hubunganBayi 
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div>
                <label htmlFor="hubunganBayi" className="block text-sm font-medium text-gray-700 mb-2">Hubungan Janin dengan Mayit</label>
                <select 
                    id="hubunganBayi"
                    value={hubunganBayi} 
                    onChange={(e) => setHubunganBayi(e.target.value)} 
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                    <option value="anak">Anak dari Mayit</option>
                    <option value="cucu">Cucu dari Anak Laki-laki Mayit</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                    Catatan: Jika Anda memilih hubungan "Anak", maka pilihan "Anak Laki-laki/Perempuan" dari langkah sebelumnya akan diabaikan.
                </p>
            </div>

            <div>
                <label htmlFor="tirkah" className="block text-sm font-medium text-gray-700 mb-2">Total Harta Waris (Tirkah)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                    <input 
                        id="tirkah"
                        type="text" 
                        value={formatCurrency(tirkah)} 
                        onChange={handleTirkahChange} 
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold" 
                        placeholder="0" 
                    />
                </div>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Ahli Waris yang Dihitung (Selain Janin):</h3>
              <div className="flex flex-wrap gap-2">
                {selectedHeirs.filter(h => !(hubunganBayi === 'anak' ? ['anak_lk', 'anak_pr'] : ['cucu_lk', 'cucu_pr']).includes(h.key)).map(heir => (
                    <span key={heir.key} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">{heir.nama_id} (x{heir.quantity})</span>
                ))}
                 {selectedHeirs.filter(h => !(hubunganBayi === 'anak' ? ['anak_lk', 'anak_pr'] : ['cucu_lk', 'cucu_pr']).includes(h.key)).length === 0 && (
                    <span className="text-sm text-gray-500">Tidak ada (hanya janin yang dihitung sebagai keturunan).</span>
                )}
              </div>
            </div>

            {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
            
            <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full py-3 rounded-lg font-bold text-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition-all shadow-lg"
            >
                {isLoading ? 'Menghitung...' : '🧮 Hitung Warisan Haml'}
            </button>
        </form>
    );
}