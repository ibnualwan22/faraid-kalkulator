'use client';
import { useState, useEffect } from 'react';
import GharqaProblemCard from '@/components/GharqaProblemCard';
import ResultDisplay from '@/components/ResultDisplay';

const createNewProblem = (id) => ({
    id,
    namaMayit: `Mayit ${String.fromCharCode(65 + id)}`,
    tirkah: '',
    selectedHeirs: [],
    result: null,
});

export default function GharqaPage() {
    const [heirs, setHeirs] = useState([]);
    const [masalahList, setMasalahList] = useState([createNewProblem(0), createNewProblem(1)]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHeirs = async () => {
            try {
                const response = await fetch('/api/heirs');
                if (!response.ok) throw new Error('Gagal memuat daftar ahli waris.');
                const data = await response.json();
                setHeirs(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };
        fetchHeirs();
    }, []);

    const updateMasalah = (id, updatedData) => {
        setMasalahList(prev => prev.map(m => m.id === id ? { ...m, ...updatedData } : m));
    };

    const addProblem = () => {
        setMasalahList(prev => [...prev, createNewProblem(prev.length)]);
    };

    const removeProblem = (id) => {
        setMasalahList(prev => prev.filter(m => m.id !== id));
    };

    const handleCalculateAll = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const promises = masalahList.map(masalah => {
                const payload = {
                    tirkah: parseFloat(masalah.tirkah.replace(/\D/g, '')) || 0,
                    ahliWaris: masalah.selectedHeirs.reduce((acc, h) => ({ ...acc, [h.key]: h.quantity }), {})
                };
                return fetch('/api/hitung', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).then(res => {
                    if (!res.ok) return res.json().then(err => { throw new Error(`Perhitungan untuk ${masalah.namaMayit} gagal: ${err.error}`) });
                    return res.json();
                });
            });

            const results = await Promise.all(promises);

            setMasalahList(prev => prev.map((m, index) => ({ ...m, result: results[index] })));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Perhitungan Waris Gharqa (الغرقى)</h1>
            <p className="text-gray-600">Gunakan halaman ini jika ada beberapa ahli waris yang meninggal bersamaan dan tidak diketahui urutannya. Mereka tidak saling mewarisi.</p>

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
            </div>

            <div className="flex justify-between items-center mt-8">
                <button onClick={addProblem} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
                    + Tambah Mayit
                </button>
                <button onClick={handleCalculateAll} disabled={isLoading || heirs.length === 0} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg disabled:bg-gray-400">
                    {isLoading ? 'Menghitung...' : '🧮 Hitung Semua Masalah'}
                </button>
            </div>

            {error && <div className="bg-red-100 p-4 rounded-md text-red-700 text-center">{error}</div>}
            
            {masalahList.some(m => m.result) && (
                <div className="mt-12 space-y-12">
                    {masalahList.map(masalah => (
                        masalah.result && (
                            <div key={masalah.id}>
                                <h2 className="text-2xl font-bold mb-4 p-3 bg-gray-100 rounded-t-lg border-b-4 border-blue-500">
                                    Hasil Perhitungan untuk {masalah.namaMayit}
                                </h2>
                                <ResultDisplay result={masalah.result} />
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}