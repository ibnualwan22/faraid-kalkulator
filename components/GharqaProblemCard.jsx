// components/GharqaProblemCard.jsx

'use client';
import HeirSelector from './HeirSelector';

export default function GharqaProblemCard({ index, masalah, heirs, updateMasalah, removeProblem, canRemove }) {
    const formatCurrency = (value) => {
        if (!value) return '';
        return new Intl.NumberFormat('id-ID').format(value.replace(/\D/g, ''));
    };

    // Filter ahli waris agar tidak bisa memilih mayit lain
    const filteredHeirs = heirs.filter(h => !masalah.otherMayitKeys?.includes(h.key));

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 relative">
            {canRemove && (
                <button onClick={() => removeProblem(masalah.id)} className="absolute top-4 right-4 text-sm text-gray-500 hover:text-red-600">
                    &times; Hapus
                </button>
            )}

            <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mayit (untuk identifikasi)</label>
                    <input 
                        type="text" 
                        value={masalah.namaMayit} 
                        onChange={(e) => updateMasalah(masalah.id, { namaMayit: e.target.value })}
                        className="w-full p-2 border rounded-md font-bold"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Harta {masalah.namaMayit}</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                        <input 
                            type="text" 
                            value={formatCurrency(masalah.tirkah)} 
                            onChange={(e) => updateMasalah(masalah.id, { tirkah: e.target.value.replace(/\D/g, '') })}
                            className="w-full p-2 pl-10 border rounded-md" 
                            placeholder="0"
                        />
                    </div>
                </div>
                <HeirSelector 
                    title={`Ahli Waris ${masalah.namaMayit} yang Masih Hidup`}
                    heirs={filteredHeirs} // Gunakan ahli waris yang sudah difilter
                    selectedHeirs={masalah.selectedHeirs} 
                    onHeirToggle={(heir) => {
                        const newHeirs = masalah.selectedHeirs.find(h => h.key === heir.key)
                            ? masalah.selectedHeirs.filter(h => h.key !== heir.key)
                            : [...masalah.selectedHeirs, { ...heir, quantity: 1 }];
                        updateMasalah(masalah.id, { selectedHeirs: newHeirs });
                    }} 
                    onQuantityChange={(heirKey, quantity) => {
                        const newHeirs = masalah.selectedHeirs.map(h => h.key === heirKey ? { ...h, quantity: Math.max(1, quantity) } : h);
                        updateMasalah(masalah.id, { selectedHeirs: newHeirs });
                    }} 
                />
            </div>
        </div>
    );
}