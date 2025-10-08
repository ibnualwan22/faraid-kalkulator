'use client';
import { useState } from 'react';
import HeirSelector from './HeirSelector';

export default function MunasakhotForm({ 
    heirs,
    selectedHeirs1, onHeirToggle1, onQuantityChange1,
    selectedHeirs2, onHeirToggle2, onQuantityChange2,
    onCalculate, 
    isLoading 
}) {
    const [tirkah, setTirkah] = useState('');
    const [mayitKeduaKey, setMayitKeduaKey] = useState('');
    const [error, setError] = useState('');

    const formatCurrency = (value) => {
        if (!value) return '';
        return new Intl.NumberFormat('id-ID').format(value.replace(/\D/g, ''));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (selectedHeirs1.length === 0 || !tirkah || parseFloat(tirkah) <= 0 || !mayitKeduaKey || selectedHeirs2.length === 0) {
            setError('⚠️ Semua kolom wajib diisi dengan benar.');
            return;
        }
        
        const payload = {
            masalah_pertama: {
                tirkah: parseFloat(tirkah.replace(/\D/g, '')),
                ahliWaris: selectedHeirs1.reduce((acc, h) => ({ ...acc, [h.key]: h.quantity }), {})
            },
            mayit_kedua_key: mayitKeduaKey,
            masalah_kedua: {
                ahliWaris: selectedHeirs2.reduce((acc, h) => ({ ...acc, [h.key]: h.quantity }), {})
            }
        };
        onCalculate(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Masalah Pertama */}
                <div className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-bold border-b pb-2 text-gray-800">1. Masalah Pertama (Mayit Awal)</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Harta Awal (Tirkah)</label>
                        <input type="text" value={formatCurrency(tirkah)} onChange={(e) => setTirkah(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Rp 0" />
                    </div>
                    <HeirSelector title="Ahli Waris Mayit Awal" heirs={heirs} selectedHeirs={selectedHeirs1} onHeirToggle={onHeirToggle1} onQuantityChange={onQuantityChange1} />
                </div>

                {/* Masalah Kedua */}
                <div className={`space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-opacity ${selectedHeirs1.length > 0 ? 'opacity-100' : 'opacity-50'}`}>
                    <h2 className="text-xl font-bold border-b pb-2 text-gray-800">2. Masalah Kedua (Mayit Berikutnya)</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Siapa yang Meninggal dari Masalah Pertama?</label>
                        <select value={mayitKeduaKey} onChange={(e) => setMayitKeduaKey(e.target.value)} className="w-full p-2 border rounded-md" disabled={selectedHeirs1.length === 0}>
                            <option value="">-- Pilih Ahli Waris --</option>
                            {selectedHeirs1.filter(h => !h.isMahjub).map(h => <option key={h.key} value={h.key}>{h.nama_id}</option>)}
                        </select>
                    </div>
                    <HeirSelector title="Ahli Waris dari Mayit Berikutnya" heirs={heirs} selectedHeirs={selectedHeirs2} onHeirToggle={onHeirToggle2} onQuantityChange={onQuantityChange2} />
                </div>
            </div>

            {error && <div className="text-red-600 text-center">{error}</div>}

            <div className="text-center pt-4">
                <button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all disabled:bg-gray-400">
                    {isLoading ? 'Menghitung...' : '🧮 Hitung Munasakhot'}
                </button>
            </div>
        </form>
    );
}