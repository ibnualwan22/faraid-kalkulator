// app/kasus-khusus/gharqa/page.js

'use client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Perlu install: npm install uuid
import GharqaProblemCard from '@/components/GharqaProblemCard';
import GharqaResultDisplay from '@/components/GharqaResultDisplay';

// Komponen Form Utama
const GharqaForm = ({ heirs, onCalculate, isLoading }) => {
    const [masalahList, setMasalahList] = useState([
        { id: uuidv4(), namaMayit: 'Mayit Pertama', tirkah: '', selectedHeirs: [] },
        { id: uuidv4(), namaMayit: 'Mayit Kedua', tirkah: '', selectedHeirs: [] }
    ]);

    const addProblem = () => {
        setMasalahList([...masalahList, { id: uuidv4(), namaMayit: `Mayit ke-${masalahList.length + 1}`, tirkah: '', selectedHeirs: [] }]);
    };

    const removeProblem = (id) => {
        setMasalahList(masalahList.filter(m => m.id !== id));
    };

    const updateMasalah = (id, updates) => {
        setMasalahList(masalahList.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const handleSubmit = () => {
        const payload = masalahList.map(m => ({
            namaMayit: m.namaMayit,
            tirkah: m.tirkah,
            ahliWaris: m.selectedHeirs.reduce((acc, h) => {
                acc[h.key] = h.quantity;
                return acc;
            }, {})
        }));
        onCalculate({ daftarMasalah: payload });
    };

    return (
        <div className="space-y-6">
            {masalahList.map((masalah, index) => (
                <GharqaProblemCard 
                    key={masalah.id} 
                    index={index} 
                    masalah={masalah} 
                    heirs={heirs} 
                    updateMasalah={updateMasalah} 
                    removeProblem={removeProblem} 
                    canRemove={masalahList.length > 2} 
                />
            ))}
            <div className="flex justify-between items-center">
                <button onClick={addProblem} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                    + Tambah Mayit
                </button>
                <button onClick={handleSubmit} disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    {isLoading ? 'Menghitung...' : 'Hitung Warisan Gharqa'}
                </button>
            </div>
        </div>
    );
};


// Halaman Utama
export default function GharqaPage() {
    const [heirs, setHeirs] = useState([]);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHeirs = async () => {
            const response = await fetch('/api/heirs');
            const data = await response.json();
            setHeirs(data);
        };
        fetchHeirs();
    }, []);

    const handleCalculate = async (data) => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await fetch('/api/hitung/gharqa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const resultData = await response.json();
            if (!response.ok) throw new Error(resultData.error || 'Terjadi kesalahan.');
            setResult(resultData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-center">Kalkulator Mati Bersamaan (Gharqa)</h1>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

            {!result ? (
                <GharqaForm heirs={heirs} onCalculate={handleCalculate} isLoading={isLoading} />
            ) : (
                <div>
                    <button onClick={() => setResult(null)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg mb-4">
                        🔄 Hitung Ulang
                    </button>
                    <GharqaResultDisplay result={result.hasilPerhitungan} />
                </div>
            )}
        </div>
    );
}