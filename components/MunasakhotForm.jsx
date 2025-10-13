// components/MunasakhatForm.jsx

'use client';
import { useState } from 'react';
import HeirSelector from './HeirSelector';

// Sub-komponen LENGKAP untuk menangani input per masalah
const ProblemCard = ({ title, problem, setProblem, heirs, showTirkah = true }) => {
    const formatCurrency = (value) => {
        if (!value) return '';
        const number = value.replace(/\D/g, '');
        return new Intl.NumberFormat('id-ID').format(number);
    };

    const handleTirkahChange = (e) => {
        setProblem({ ...problem, tirkah: e.target.value.replace(/\D/g, '') });
    };

    const onHeirToggle = (heir) => {
        const newHeirs = problem.selectedHeirs.find(h => h.key === heir.key)
            ? problem.selectedHeirs.filter(h => h.key !== heir.key)
            : [...problem.selectedHeirs, { ...heir, quantity: 1 }];
        setProblem({ ...problem, selectedHeirs: newHeirs });
    };

    const onQuantityChange = (heirKey, quantity) => {
        const newHeirs = problem.selectedHeirs.map(h => 
            h.key === heirKey ? { ...h, quantity: Math.max(1, quantity) } : h
        );
        setProblem({ ...problem, selectedHeirs: newHeirs });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border space-y-4">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">{title}</h3>
            
            {showTirkah && (
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Harta Waris (Tirkah)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                        <input 
                            type="text" 
                            value={formatCurrency(problem.tirkah)} 
                            onChange={handleTirkahChange} 
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-semibold text-gray-900" 
                            placeholder="0" 
                        />
                    </div>
                </div>
            )}

            <HeirSelector 
                heirs={heirs} 
                selectedHeirs={problem.selectedHeirs} 
                onHeirToggle={onHeirToggle} 
                onQuantityChange={onQuantityChange} 
            />
        </div>
    );
};


// Komponen Form Utama (Lengkap)
export default function MunasakhatForm({ heirs, onCalculate, isLoading }) {
    const [masalah1, setMasalah1] = useState({ tirkah: '', selectedHeirs: [] });
    const [masalah2, setMasalah2] = useState({ selectedHeirs: [] });
    const [mayitKeduaKey, setMayitKeduaKey] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        setError('');
        if (!masalah1.tirkah || parseFloat(masalah1.tirkah) <= 0) {
            setError('Masukkan Tirkah yang valid untuk Masalah Pertama.');
            return;
        }
        if (masalah1.selectedHeirs.length === 0) {
            setError('Pilih minimal satu ahli waris untuk Masalah Pertama.');
            return;
        }
        if (!mayitKeduaKey) {
            setError('Pilih siapa ahli waris dari Masalah Pertama yang meninggal dunia.');
            return;
        }
        if (masalah2.selectedHeirs.length === 0) {
            setError('Pilih minimal satu ahli waris untuk Masalah Kedua.');
            return;
        }

        const payload = {
            masalah_pertama: {
                tirkah: masalah1.tirkah,
                ahliWaris: masalah1.selectedHeirs.reduce((acc, h) => ({ ...acc, [h.key]: h.quantity }), {})
            },
            mayit_kedua_key: mayitKeduaKey,
            masalah_kedua: {
                ahliWaris: masalah2.selectedHeirs.reduce((acc, h) => ({ ...acc, [h.key]: h.quantity }), {})
            }
        };
        onCalculate(payload);
    };

    return (
        <div className="space-y-6">
            <ProblemCard title="Masalah #1 (Mayit Pertama)" problem={masalah1} setProblem={setMasalah1} heirs={heirs} showTirkah={true} />
            
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Ahli Waris dari Masalah #1 yang Meninggal Dunia (Mayit Kedua)</label>
                <select value={mayitKeduaKey} onChange={e => setMayitKeduaKey(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900">
                    <option value="">-- Pilih Mayit Kedua --</option>
                    {masalah1.selectedHeirs.filter(h => !h.isMahjub).map(h => <option key={h.key} value={h.key}>{h.nama_id}</option>)}
                </select>
            </div>

            <ProblemCard title="Masalah #2 (Ahli Waris dari Mayit Kedua)" problem={masalah2} setProblem={setMasalah2} heirs={heirs} showTirkah={false} />

            {error && <p className="text-red-600 text-sm font-semibold text-center">{error}</p>}

            <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg disabled:bg-gray-400">
                {isLoading ? 'Menghitung...' : 'Hitung Warisan Munasakhat'}
            </button>
        </div>
    );
}