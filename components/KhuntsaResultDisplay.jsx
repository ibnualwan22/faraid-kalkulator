// components/KhuntsaResultDisplay.jsx

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

export default function KhuntsaResultDisplay({ result }) {
    if (!result || !result.hasilAkhir) return <p>Memuat hasil...</p>;

    const { skenarioLaki, skenarioPerempuan, hasilAkhir } = result;
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
                                    <th className="p-4 text-center font-bold text-gray-800">Saham (Jika Laki-laki)</th>
                                    <th className="p-4 text-center font-bold text-gray-800">Saham (Jika Perempuan)</th>
                                    <th className="p-4 text-center font-bold bg-emerald-100 text-emerald-900 rounded-lg">Saham Yakin (Terkecil)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {Object.values(perbandingan).map(item => (
                                    <tr key={item.nama} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-semibold text-gray-800">{item.nama}</td>
                                        <td className="p-4 text-center font-mono font-semibold text-gray-700">{item.sahamPerSkenario[0]}</td>
                                        <td className="p-4 text-center font-mono font-semibold text-gray-700">{item.sahamPerSkenario[1]}</td>
                                        <td className="p-4 text-center bg-emerald-50 font-mono font-bold text-emerald-700">{item.sahamTerkecil}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            Skenario 1: Khuntsa Dianggap Laki-laki
                        </h3>
                    </div>
                    <div className="p-6">
                        <MiniResultDisplay result={skenarioLaki} />
                    </div>
                </div>

                {/* Skenario 2 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-emerald-600 px-6 py-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.5 1.5H5.75A2.75 2.75 0 003 4.25v11.5A2.75 2.75 0 005.75 18.5h8.5a2.75 2.75 0 002.75-2.75V6.5m-11-4v3.25m6.5-3.25v3.25M3 9.5h14" />
                            </svg>
                            Skenario 2: Khuntsa Dianggap Perempuan
                        </h3>
                    </div>
                    <div className="p-6">
                        <MiniResultDisplay result={skenarioPerempuan} />
                    </div>
                </div>
            </div>
        </div>
    );
}