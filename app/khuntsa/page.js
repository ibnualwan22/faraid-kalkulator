'use client';
import { useState, useEffect } from 'react';
import HeirSelector from '@/components/HeirSelector'; // Kita gunakan lagi komponen yang ada
import KhuntsaForm from '@/components/KhuntsaForm'; // Komponen form baru
import KhuntsaResultDisplay from '@/components/KhuntsaResultDisplay'; // Komponen hasil baru

export default function KhuntsaPage() {
  const [heirs, setHeirs] = useState([]);
  const [selectedHeirs, setSelectedHeirs] = useState([]);
  const [result, setResult] = useState(null);
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
        setError(err.message);
      }
    };
    fetchHeirs();
  }, []);

  const handleHeirToggle = (heir) => {
    const exists = selectedHeirs.find(h => h.key === heir.key);
    if (exists) {
      setSelectedHeirs(selectedHeirs.filter(h => h.key !== heir.key));
    } else {
      setSelectedHeirs([...selectedHeirs, { ...heir, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (heirKey, quantity) => {
    setSelectedHeirs(selectedHeirs.map(h => h.key === heirKey ? { ...h, quantity: Math.max(1, quantity) } : h));
  };

  const handleCalculate = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('/api/hitung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resultData = await response.json();
      if (!response.ok) throw new Error(resultData.error || 'Terjadi kesalahan.');
      setResult(resultData);
      setStep(3);
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedHeirs([]);
    setResult(null);
    setStep(1);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCalculateKhuntsa = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('/api/hitung/khuntsa', {
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
      <h1 className="text-3xl font-bold">Perhitungan Waris Khuntsa (الخنثى)</h1>
      <p>Gunakan halaman ini untuk menghitung warisan jika salah satu ahli waris memiliki jenis kelamin yang tidak pasti (Khuntsa).</p>
      
      {/* Heir Selector */}
      <HeirSelector heirs={heirs} selectedHeirs={selectedHeirs} onHeirToggle={handleHeirToggle} onQuantityChange={handleQuantityChange} />

      {/* Form Input Khuntsa */}
      {selectedHeirs.length > 0 && (
        <KhuntsaForm 
            selectedHeirs={selectedHeirs} 
            onCalculate={handleCalculateKhuntsa} 
            isLoading={isLoading} 
        />
      )}

      {error && <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>}
      
      {/* Tampilan Hasil */}
      {result && <KhuntsaResultDisplay result={result} />}
    </div>
  );
}