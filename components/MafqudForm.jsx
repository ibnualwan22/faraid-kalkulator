'use client';
import { useState } from 'react';

export default function MafqudForm({ selectedHeirs, onCalculate, isLoading }) {
    const [tirkah, setTirkah] = useState('');
    const [mafqudKey, setmafqudKey] = useState(selectedHeirs[0]?.key || '');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!mafqudKey) { setError('Pilih siapa ahli waris yang mafqud'); return; }
        // ... (validasi tirkah seperti form sebelumnya)

        const ahliWarisPayload = {};
        selectedHeirs.forEach(h => { ahliWarisPayload[h.key] = h.quantity; });

        onCalculate({ ahliWaris: ahliWarisPayload, tirkah: parseFloat(tirkah), mafqudKey });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Ahli Waris yang mafqud</label>
                <select value={mafqudKey} onChange={(e) => setmafqudKey(e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="">-- Pilih Ahli Waris --</option>
                    {selectedHeirs.map(h => (
                        <option key={h.key} value={h.key}>{h.nama_id}</option>
                    ))}
                </select>
            </div>
             {/* ... (Input Tirkah seperti di CalculationForm.jsx) ... */}
            <button type="submit" disabled={isLoading} className="w-full py-3 ...">Hitung</button>
        </form>
    );
}