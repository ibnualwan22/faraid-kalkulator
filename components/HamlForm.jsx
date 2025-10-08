'use client';
import { useState } from 'react';

export default function HamlForm({ selectedHeirs, onCalculate, isLoading }) {
    const [tirkah, setTirkah] = useState('');
    const [hubunganBayi, setHubunganBayi] = useState('anak');
    // ... (state lain & fungsi handleSubmit seperti KhuntsaForm)

    const handleSubmit = (e) => {
        // ... validasi
        const ahliWarisPayload = {};
        selectedHeirs.forEach(h => { ahliWarisPayload[h.key] = h.quantity; });

        onCalculate({ ahliWaris: ahliWarisPayload, tirkah: parseFloat(tirkah), hubunganBayi });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hubungan Janin dengan Mayit</label>
                <select value={hubunganBayi} onChange={(e) => setHubunganBayi(e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="anak">Anak</option>
                    <option value="cucu">Cucu (dari Anak Laki-laki)</option>
                    {/* Tambahkan opsi lain jika diperlukan */}
                </select>
            </div>
            {/* ... (Input Tirkah seperti form sebelumnya) ... */}
            <button type="submit" disabled={isLoading} className="w-full py-3 ...">Hitung</button>
        </form>
    );
}