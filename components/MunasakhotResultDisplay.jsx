// components/MunasakhotResultDisplay.jsx

'use client';

// Komponen Tampilan Hasil
const ResultTable = ({ result, title, amFinal, mayitKeduaKey = null, icon }) => {
    if (!result || !result.summary) return null;
    const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">{icon}</span>
                    {title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Total Harta: {formatRupiah(result.input.tirkah)}</p>
            </div>
            
            <div className="p-6">
                {/* Summary AM */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                        <div className="text-sm font-semibold text-blue-700 mb-1">Asal Masalah Awal</div>
                        <div className="text-3xl font-bold text-blue-800">{result.summary.ashlulMasalahAwal}</div>
                    </div>
                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center">
                        <div className="text-sm font-semibold text-emerald-700 mb-1">AM Final (Jami'ah)</div>
                        <div className="text-3xl font-bold text-emerald-800">{amFinal}</div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="p-3 text-left font-bold text-gray-700">Ahli Waris</th>
                                <th className="p-3 text-center font-bold text-gray-700">Bagian</th>
                                <th className="p-3 text-center font-bold text-gray-700">Saham Awal</th>
                                <th className="p-3 text-center font-bold text-gray-700">Saham Final</th>
                                <th className="p-3 text-right font-bold text-gray-700">Harta Final</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {result.output.map(aw => {
                                const isMayitKedua = aw.key === mayitKeduaKey;

                                if (aw.isMahjub) {
                                    return ( 
                                        <tr key={aw.key} className="bg-gray-50">
                                            <td className="p-3 text-gray-500 italic">{aw.nama}</td>
                                            <td className="p-3 text-center text-gray-500 italic" colSpan="4">
                                                Mahjub: {aw.alasan}
                                            </td>
                                        </tr> 
                                    );
                                }

                                return (
                                    <tr key={aw.key} className={`${isMayitKedua ? 'bg-yellow-50' : 'hover:bg-gray-50'} transition-colors`}>
                                        <td className="p-3">
                                            <div className="font-semibold text-gray-900">{aw.nama}</div>
                                            {isMayitKedua && (
                                                <span className="inline-flex items-center gap-1 text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full mt-1">
                                                    ⚰️ Meninggal dunia
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3 text-center text-gray-700">{aw.bagian}</td>
                                        <td className="p-3 text-center font-mono text-gray-700">{aw.sahamAwal}</td>
                                        <td className={`p-3 text-center font-mono font-bold ${isMayitKedua ? 'text-yellow-700' : 'text-emerald-700'}`}>
                                            {aw.sahamFinal}
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className={`font-mono font-bold ${isMayitKedua ? 'text-yellow-700' : 'text-gray-900'}`}>
                                                {formatRupiah(aw.bagianHarta)}
                                            </div>
                                            {isMayitKedua && (
                                                <span className="text-xs text-yellow-600 italic">Diteruskan ke ahli waris</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default function MunasakhotResultDisplay({ result }) {
    if (!result) return null;
    const { hasil_akhir_1, hasil_akhir_2, proses_tashih, namaMayitKedua, mayit_kedua_key } = result;

    return (
        <div className="space-y-6">
            {/* Header Result */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-emerald-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-3xl">📊</span>
                        Hasil Perhitungan Munasakhah
                    </h2>
                </div>
                <div className="bg-yellow-50 border-t-2 border-yellow-300 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">⚰️</span>
                        </div>
                        <div>
                            <p className="text-sm text-yellow-700 font-semibold">Ahli Waris yang Meninggal Kedua:</p>
                            <p className="text-xl font-bold text-yellow-900">{namaMayitKedua}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Masalah Pertama */}
            <ResultTable 
                result={hasil_akhir_1} 
                title="Masalah Pertama (Pembagian Awal)" 
                amFinal={proses_tashih.amFinal}
                mayitKeduaKey={mayit_kedua_key}
                icon="①"
            />

            {/* Masalah Kedua */}
            {hasil_akhir_2 && (
                <ResultTable 
                    result={hasil_akhir_2} 
                    title={`Masalah Kedua (Ahli Waris dari ${namaMayitKedua})`} 
                    amFinal={proses_tashih.amFinal}
                    icon="②"
                />
            )}

            {/* Info Tashih */}
            {proses_tashih && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            Informasi Tashih (Penyatuan AM)
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="text-sm text-blue-700 font-semibold">AM Masalah 1</div>
                                <div className="text-2xl font-bold text-blue-800 mt-1">{proses_tashih.am1}</div>
                            </div>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="text-sm text-purple-700 font-semibold">AM Masalah 2</div>
                                <div className="text-2xl font-bold text-purple-800 mt-1">{proses_tashih.am2}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}