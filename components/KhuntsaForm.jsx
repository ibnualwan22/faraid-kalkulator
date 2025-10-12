// components/KhuntsaForm.jsx

'use client';
import { useState } from 'react';

export default function KhuntsaForm({ selectedHeirs, onCalculate, isLoading }) {
    // --- TAMBAHKAN STATE UNTUK TIRKAH ---
    const [tirkah, setTirkah] = useState('');
    const [khuntsaKey, setKhuntsaKey] = useState(selectedHeirs[0]?.key || '');
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
        
        // --- TAMBAHKAN VALIDASI ---
        if (!khuntsaKey) { setError('Pilih siapa ahli waris yang Khuntsa.'); return; }
        if (!tirkah || parseFloat(tirkah) <= 0) {
            setError('Masukkan jumlah harta (Tirkah) yang valid.');
            return;
        }

        const ahliWarisPayload = {};
        selectedHeirs.forEach(h => { ahliWarisPayload[h.key] = h.quantity; });

        // --- KIRIM PAYLOAD LENGKAP ---
        onCalculate({ ahliWaris: ahliWarisPayload, tirkah: parseFloat(tirkah), khuntsaKey });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Ahli Waris yang Khuntsa</label>
                <select value={khuntsaKey} onChange={(e) => setKhuntsaKey(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg">
                    <option value="">-- Pilih Ahli Waris --</option>
                    {selectedHeirs.map(h => (
                        <option key={h.key} value={h.key}>{h.nama_id}</option>
                    ))}
                </select>
            </div>
            
            {/* --- TAMBAHKAN INPUT FIELD TIRKAH --- */}
            <div>
                <label htmlFor="tirkah" className="block text-sm font-medium text-gray-700 mb-2">Total Harta Waris (Tirkah)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                    <input 
                        id="tirkah"
                        type="text" 
                        value={formatCurrency(tirkah)} 
                        onChange={handleTirkahChange} 
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-semibold" 
                        placeholder="0" 
                    />
                </div>
            </div>

            {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
            
            <button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg font-bold text-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400">
                {isLoading ? 'Menghitung...' : 'Hitung Warisan Khuntsa'}
            </button>
        </form>
    );
}