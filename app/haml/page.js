// app/kasus-khusus/haml/page.js

'use client';
import { useState, useEffect } from 'react';
import HeirSelector from '@/components/HeirSelector';
import HamlForm from '@/components/HamlForm'; // Pastikan path ini benar
import HamlResultDisplay from '@/components/HamlResultDisplay'; // Pastikan path ini benar

export default function HamlPage() {
    const [heirs, setHeirs] = useState([]);
    const [selectedHeirs, setSelectedHeirs] = useState([]);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState(1);

    useEffect(() => {
        // Fetch daftar ahli waris saat komponen dimuat
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

    const handleHeirToggle = (heir) => {
        // ... (Fungsi ini sama seperti di HomePage Anda)
        const exists = selectedHeirs.find(h => h.key === heir.key);
        if (exists) {
            setSelectedHeirs(selectedHeirs.filter(h => h.key !== heir.key));
        } else {
            setSelectedHeirs([...selectedHeirs, { ...heir, quantity: 1 }]);
        }
    };

    const handleQuantityChange = (heirKey, quantity) => {
        // ... (Fungsi ini sama seperti di HomePage Anda)
        setSelectedHeirs(selectedHeirs.map(h => h.key === heirKey ? { ...h, quantity: Math.max(1, quantity) } : h));
    };

    // Fungsi khusus untuk memanggil API Haml
    const handleCalculateHaml = async (data) => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            // Panggil endpoint API Haml yang baru
            const response = await fetch('/api/hitung/haml', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data), // Kirim payload yang lengkap
            });
            const resultData = await response.json();
            if (!response.ok) throw new Error(resultData.error || 'Terjadi kesalahan pada server.');
            setResult(resultData);
            setStep(3); // Pindah ke tampilan hasil
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        // ... (Fungsi ini sama seperti di HomePage Anda)
        setSelectedHeirs([]);
        setResult(null);
        setStep(1);
        setError(null);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-center">Kalkulator Waris Janin (Haml)</h1>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

            {step === 1 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-center">Langkah 1: Pilih Ahli Waris yang Ada</h2>
                    <HeirSelector heirs={heirs} selectedHeirs={selectedHeirs} onHeirToggle={handleHeirToggle} onQuantityChange={handleQuantityChange} />
                    {selectedHeirs.length > 0 && (
                        <div className="text-center mt-6">
                            <button onClick={() => setStep(2)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg">
                                Lanjut →
                            </button>
                        </div>
                    )}
                </div>
            )}

            {step === 2 && (
                <div>
                    <button onClick={() => setStep(1)} className="text-green-600 hover:text-green-700 mb-4">← Kembali Pilih Ahli Waris</button>
                    <HamlForm selectedHeirs={selectedHeirs} onCalculate={handleCalculateHaml} isLoading={isLoading} />
                </div>
            )}

            {step === 3 && result && (
                <div>
                    <button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg mb-4">🔄 Hitung Ulang</button>
                    <HamlResultDisplay result={result} />
                </div>
            )}
        </div>
    );
}