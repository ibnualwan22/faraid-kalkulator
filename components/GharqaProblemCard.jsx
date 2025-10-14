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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative">
            {/* Header Card */}
<div className="bg-green-700 px-6 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <span className="text-xl">👤</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Mayit #{index + 1}</h3>
                            <p className="text-indigo-100 text-xs">Data Pewaris</p>
                        </div>
                    </div>
                    {canRemove && (
                        <button 
                            onClick={() => removeProblem(masalah.id)} 
                            className="w-8 h-8 bg-white/20 hover:bg-red-500 rounded-lg flex items-center justify-center text-white transition-colors"
                            title="Hapus Mayit"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
                {/* Nama Mayit */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Nama Mayit (untuk identifikasi)
                    </label>
                    <input 
                        type="text" 
                        value={masalah.namaMayit} 
                        onChange={(e) => updateMasalah(masalah.id, { namaMayit: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                        placeholder="Contoh: Ahmad bin Abdullah"
                    />
                </div>

                {/* Total Harta */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        Total Harta {masalah.namaMayit}
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">Rp</span>
                        <input 
                            type="text" 
                            value={formatCurrency(masalah.tirkah)} 
                            onChange={(e) => updateMasalah(masalah.id, { tirkah: e.target.value.replace(/\D/g, '') })}
                            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl text-gray-800 font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Heir Selector */}
                <div className="pt-2">
                    <HeirSelector 
                        title={`Ahli Waris ${masalah.namaMayit} yang Masih Hidup`}
                        heirs={filteredHeirs}
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
        </div>
    );
}