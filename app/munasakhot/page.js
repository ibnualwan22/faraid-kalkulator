// app/kasus-khusus/munasakhot/page.js

'use client';
import { useState, useEffect } from 'react';
import MunasakhotForm from '@/components/MunasakhotForm';
import MunasakhotResultDisplay from '@/components/MunasakhotResultDisplay';

export default function MunasakhotPage() {
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
            const response = await fetch('/api/hitung/munasakhot', {
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
            <h1 className="text-3xl font-bold text-center">Kalkulator Waris Berlapis (munasakhot)</h1>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

            {!result ? (
                <MunasakhotForm heirs={heirs} onCalculate={handleCalculate} isLoading={isLoading} />
            ) : (
                <div>
                    <button onClick={() => setResult(null)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg mb-4">
                        🔄 Hitung Ulang
                    </button>
                    <MunasakhotResultDisplay result={result} />
                </div>
            )}
        </div>
    );
}