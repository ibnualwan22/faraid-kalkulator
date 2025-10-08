'use client';
import { useState, useEffect } from 'react';
import MunasakhotForm from '@/components/MunasakhotForm';
import MunasakhotResultDisplay from '@/components/MunasakhotResultDisplay';

export default function MunasakhotPage() {
    // State untuk daftar ahli waris dari API
    const [heirs, setHeirs] = useState([]);
    
    // State untuk Masalah Pertama
    const [selectedHeirs1, setSelectedHeirs1] = useState([]);
    
    // State untuk Masalah Kedua
    const [selectedHeirs2, setSelectedHeirs2] = useState([]);

    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Mengambil daftar ahli waris saat komponen dimuat
    useEffect(() => {
        const fetchHeirs = async () => {
            try {
                const response = await fetch('/api/heirs');
                if (!response.ok) throw new Error('Gagal memuat daftar ahli waris.');
                const data = await response.json();
                setHeirs(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchHeirs();
    }, []);

    // --- HANDLER UNTUK MASALAH PERTAMA ---
    const handleHeirToggle1 = (heir) => {
        setSelectedHeirs1(prev => 
            prev.find(h => h.key === heir.key) 
            ? prev.filter(h => h.key !== heir.key) 
            : [...prev, { ...heir, quantity: 1 }]
        );
    };
    const handleQuantityChange1 = (heirKey, quantity) => {
        setSelectedHeirs1(prev => 
            prev.map(h => h.key === heirKey ? { ...h, quantity: Math.max(1, quantity) } : h)
        );
    };
    
    // --- HANDLER UNTUK MASALAH KEDUA ---
    const handleHeirToggle2 = (heir) => {
        setSelectedHeirs2(prev => 
            prev.find(h => h.key === heir.key) 
            ? prev.filter(h => h.key !== heir.key) 
            : [...prev, { ...heir, quantity: 1 }]
        );
    };
    const handleQuantityChange2 = (heirKey, quantity) => {
        setSelectedHeirs2(prev => 
            prev.map(h => h.key === heirKey ? { ...h, quantity: Math.max(1, quantity) } : h)
        );
    };

    // Fungsi untuk memanggil API Munasakhot
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
            <h1 className="text-3xl font-bold">Perhitungan Waris Munasakhot (المناسخات)</h1>
            <p className="text-gray-600">Gunakan halaman ini jika ada ahli waris yang meninggal sebelum harta warisan sempat dibagikan.</p>
            
            <MunasakhotForm 
                heirs={heirs}
                selectedHeirs1={selectedHeirs1}
                onHeirToggle1={handleHeirToggle1}
                onQuantityChange1={handleQuantityChange1}
                selectedHeirs2={selectedHeirs2}
                onHeirToggle2={handleHeirToggle2}
                onQuantityChange2={handleQuantityChange2}
                onCalculate={handleCalculate}
                isLoading={isLoading}
            />
            
            {error && <div className="bg-red-100 p-4 rounded-md text-red-700 text-center">{error}</div>}
            
            {result && (
                <div className="mt-8">
                    <MunasakhotResultDisplay result={result} />
                </div>
            )}
        </div>
    );
}