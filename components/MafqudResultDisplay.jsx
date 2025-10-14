// components/MafqudResultDisplay.jsx

'use client';

const MiniResultDisplay = ({ result }) => {
    if (!result) return null;
    
    const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
    const sahamAkhirKey = result.summary.ashlulMasalahTashih ? 'sahamTashih' : 'sahamAkhir';
    const amAkhir = result.summary.ashlulMasalahTashih || result.summary.ashlulMasalahAkhir;
    const heirQuantities = result.input.ahliWaris;

    return (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mt-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="text-xs font-semibold text-gray-600 mb-1">AM Awal</div>
                    <div className="text-2xl font-bold text-emerald-700">{result.summary.ashlulMasalahAwal}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="text-xs font-semibold text-gray-600 mb-1">AM Akhir</div>
                    <div className="text-2xl font-bold text-emerald-700">{amAkhir}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="text-xs font-semibold text-gray-600 mb-1">Kasus</div>
                    <div className="text-2xl font-bold text-emerald-700">{result.summary.kasus}</div>
                </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-white border-b-2 border-gray-300">
                        <tr>
                            <th className="p-3 text-left font-bold text-gray-800">Ahli Waris</th>
                            <th className="p-3 text-center font-bold text-gray-800">Jml</th>
                            <th className="p-3 text-center font-bold text-gray-800">Bagian</th>
                            <th className="p-3 text-center font-bold text-gray-800">Saham Awal</th>
                            <th className="p-3 text-center font-bold text-gray-800">Saham Akhir</th>
                            <th className="p-3 text-right font-bold text-gray-800">Jumlah Harta</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {result.output.filter(aw => !aw.isMahjub).map(aw => (
                            <tr key={aw.key} className="hover:bg-white transition-colors">
                                <td className="p-3 font-semibold text-gray-800">{aw.nama}</td>
                                <td className="p-3 text-center font-mono text-gray-700">{heirQuantities[aw.key] || 0}</td>
                                <td className="p-3 text-center font-mono font-semibold text-gray-700">{aw.bagian}</td>
                                <td className="p-3 text-center font-mono text-gray-700">{aw.sahamAwal?.toFixed(2).replace('.00', '') || '-'}</td>
                                <td className="p-3 text-center font-mono font-semibold text-gray-700">{aw[sahamAkhirKey]?.toFixed(2).replace('.00', '') || '-'}</td>
                                <td className="p-3 text-right font-mono font-bold text-emerald-700">{formatRupiah(aw.bagianHarta)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default function MafqudResultDisplay({ result }) {
    if (!result || !result.hasilAkhir) return <p>Memuat hasil...</p>;

    const { skenarioHidup, skenarioWafat, hasilAkhir, mafqudKey } = result;
    const { perbandingan, ashlulMasalahJamiah, mauqufHarta } = hasilAkhir;
    const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);

    return (
        <div className="space-y-8">
            {/* Mauquf Harta */}
            <div className="bg-emerald-50 border-2 border-emerald-200 p-6 rounded-2xl shadow-md">
                <div className="text-center">
                    <h3 className="text-lg font-bold text-emerald-900 mb-3">Total Harta yang Ditahan (Mauquf)</h3>
                    <p className="text-5xl font-bold text-emerald-700">{formatRupiah(mauqufHarta)}</p>
                </div>
            </div>

            {/* Tabel Jami'ah */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-emerald-600 px-6 py-4">
                    <h3 className="text-lg font-bold text-white">Tabel Mas'alatul Jami'ah (AM: {ashlulMasalahJamiah})</h3>
                    <p className="text-emerald-100 text-sm mt-1">Perhitungan saham untuk kedua skenario dan saham yakin yang didapat</p>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-300">
                                    <th className="p-4 text-left font-bold text-gray-800">Ahli Waris</th>
                                    <th className="p-4 text-center font-bold text-gray-800">Saham (Jika Hidup)</th>
                                    <th className="p-4 text-center font-bold text-gray-800">Saham (Jika Wafat)</th>
                                    <th className="p-4 text-center font-bold bg-emerald-100 text-emerald-900 rounded-lg">Saham Yakin (Terkecil)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {Object.entries(perbandingan).map(([key, item]) => {
                                    const isMafqud = key === mafqudKey;
                                    return (
                                        <tr key={key} className={isMafqud ? 'bg-yellow-50' : 'hover:bg-gray-50 transition-colors'}>
                                            <td className="p-4 font-semibold text-gray-800">
                                                {item.nama}
                                                {isMafqud && <span className="ml-2 text-xs font-normal text-yellow-700 bg-yellow-100 px-2 py-1 rounded">(Mafqud)</span>}
                                            </td>
                                            <td className="p-4 text-center font-mono font-semibold text-gray-700">{item.sahamPerSkenario[0]}</td>
                                            <td className="p-4 text-center font-mono font-semibold text-gray-700">{item.sahamPerSkenario[1]}</td>
                                            <td className="p-4 text-center bg-emerald-50 font-mono font-bold text-emerald-700">{item.sahamTerkecil}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 italic flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Bagian yakin untuk ahli waris yang hilang (Mafqud) selalu 0. Seluruh bagian potensialnya dimasukkan ke dalam harta yang ditahan (Mauquf).
                    </p>
                </div>
            </div>

            {/* Rincian Per Skenario */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 border-t pt-8">Rincian Perhitungan Setiap Skenario</h2>
                
                {/* Skenario 1 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-emerald-600 px-6 py-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 7H7v6h6V7z" />
                                <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2V2a1 1 0 112 0v1h1a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v1a2 2 0 01-2 2h-1v1a1 1 0 11-2 0v-1h-2v1a1 1 0 11-2 0v-1H7a2 2 0 01-2-2v-1H4a1 1 0 110-2h1V9H4a1 1 0 110-2h1V5a2 2 0 012-2h1V2z" clipRule="evenodd" />
                            </svg>
                            Skenario 1: Mafqud Dianggap Hidup
                        </h3>
                    </div>
                    <div className="p-6">
                        <MiniResultDisplay result={skenarioHidup} />
                    </div>
                </div>

                {/* Skenario 2 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-emerald-600 px-6 py-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            Skenario 2: Mafqud Dianggap Wafat
                        </h3>
                    </div>
                    <div className="p-6">
                        <MiniResultDisplay result={skenarioWafat} />
                    </div>
                </div>
            </div>
        </div>
    );
}