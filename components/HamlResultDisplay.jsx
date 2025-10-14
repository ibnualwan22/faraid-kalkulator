// components/HamlResultDisplay.jsx

'use client';

// Komponen kecil untuk menampilkan hasil dasar (reusable)
const MiniResultDisplay = ({ result }) => {
    const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
    const sahamAkhirKey = result.summary.ashlulMasalahTashih ? 'sahamTashih' : 'sahamAkhir';
    const amAkhir = result.summary.ashlulMasalahTashih || result.summary.ashlulMasalahAkhir;
    const showSahamAkhir = result.summary.ashlulMasalahAwal !== result.summary.ashlulMasalahAkhir;

    // Ambil data jumlah dari input yang digunakan untuk kalkulasi ini
    const heirQuantities = result.input.ahliWaris;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-4">
            <div className="grid grid-cols-3 gap-4 p-4">
                <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">1</span>
                        </div>
                        <p className="text-sm font-semibold text-blue-700">AM Awal</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{result.summary.ashlulMasalahAwal}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">2</span>
                        </div>
                        <p className="text-sm font-semibold text-purple-700">AM Akhir</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">{amAkhir}</p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">✓</span>
                        </div>
                        <p className="text-sm font-semibold text-emerald-700">Kasus</p>
                    </div>
                    <p className="text-xl font-bold text-emerald-900">{result.summary.kasus}</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                            <th className="px-4 py-4 text-left font-bold text-gray-700">Ahli Waris</th>
                            <th className="px-4 py-4 text-center font-bold text-gray-700">Jml</th>
                            <th className="px-4 py-4 text-center font-bold text-gray-700">Bagian</th>
                            <th className="px-4 py-4 text-center font-bold text-gray-700">Saham Awal</th>
                            {showSahamAkhir && <th className="px-4 py-4 text-center font-bold text-gray-700">Saham Akhir</th>}
                            {result.summary.ashlulMasalahTashih && <th className="px-4 py-4 text-center font-bold text-gray-700">Saham Tashih</th>}
                            <th className="px-4 py-4 text-right font-bold text-gray-700">Jumlah Harta</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 divide-y divide-gray-100">
                        {result.output.filter(aw => !aw.isMahjub).map((aw, idx) => {
                            const jumlahOrang = heirQuantities[aw.key] || 0;
                            const isEven = idx % 2 === 0;
                            
                            return (
                                <tr key={aw.key} className={`hover:bg-emerald-50 transition-colors ${isEven ? 'bg-white' : 'bg-gray-50/50'}`}>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <span className="text-lg">{aw.key.includes('lk') ? '👨' : '👩'}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{aw.nama}</p>
                                                <p className="text-gray-500 text-xs">{aw.namaAr}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-bold text-sm">
                                            {jumlahOrang}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="inline-block px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-semibold">
                                            {aw.bagian}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center font-mono font-semibold text-gray-800">
                                        {aw.sahamAwal ?? '-'}
                                    </td>
                                    {showSahamAkhir && (
                                        <td className="px-4 py-4 text-center font-mono font-semibold text-gray-800">
                                            {aw.sahamAkhir ?? '-'}
                                        </td>
                                    )}
                                    {result.summary.ashlulMasalahTashih && (
                                        <td className="px-4 py-4 text-center">
                                            <div className="font-mono font-bold text-purple-700">
                                                {aw.sahamTashih ?? '-'}
                                            </div>
                                            {(jumlahOrang > 1 && aw.sahamTashih > 0) && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    (@{(aw.sahamTashih / jumlahOrang).toFixed(2)})
                                                </div>
                                            )}
                                        </td>
                                    )}
                                    <td className="px-4 py-4 text-right">
                                        <div className="font-bold text-emerald-700 text-base">
                                            {formatRupiah(aw.bagianHarta)}
                                        </div>
                                        {(jumlahOrang > 1 && aw.bagianHarta > 0) && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                ({formatRupiah(aw.bagianHarta / jumlahOrang)}/orang)
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Komponen Utama (HamlResultDisplay)
export default function HamlResultDisplay({ result }) {
    if (!result || !result.hasilAkhir) return <p className="text-gray-700 text-center">Memuat hasil...</p>;

    const { detailPerSkenario, hasilAkhir } = result;
    const { perbandingan, ashlulMasalahJamiah, mauqufHarta } = hasilAkhir;
    const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
    const tirkah = detailPerSkenario[0]?.input.tirkah || 0;

    return (
        <div className="space-y-6">
            {/* Header - Mauquf */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-green-600 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">⏸️</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Total Harta yang Ditahan (Mauquf)</h2>
                            <p className="text-purple-100 text-sm mt-1">Menunggu kelahiran janin</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 text-center">
                    <p className="text-5xl font-bold text-purple-700">{formatRupiah(mauqufHarta)}</p>
                    <p className="text-gray-600 mt-2">dari total {formatRupiah(tirkah)}</p>
                </div>
            </div>

            {/* Hasil Akhir - Bagian Pasti */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-emerald-600 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Bagian yang Pasti Diterima</h2>
                            <p className="text-emerald-100 text-sm mt-1">Berdasarkan perbandingan minimum dari semua skenario</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left font-bold text-gray-700">Ahli Waris</th>
                                <th className="px-6 py-4 text-center font-bold text-gray-700">Saham Terkecil</th>
                                <th className="px-6 py-4 text-center font-bold text-gray-700">AM Jamiah</th>
                                <th className="px-6 py-4 text-right font-bold text-gray-700">Jumlah Harta Diterima</th>
                                <th className="px-6 py-4 text-center font-bold text-gray-700">Persentase</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {Object.values(perbandingan).map((item, idx) => {
                                const jumlahHarta = (tirkah / ashlulMasalahJamiah) * item.sahamTerkecil;
                                const persentase = (jumlahHarta / tirkah) * 100;
                                const isEven = idx % 2 === 0;
                                
                                return (
                                    <tr key={item.nama} className={`hover:bg-emerald-50 transition-colors ${isEven ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-lg">{item.nama.includes('Laki') || item.nama.includes('Ayah') || item.nama.includes('Suami') ? '👨' : '👩'}</span>
                                                </div>
                                                <p className="font-bold text-gray-900">{item.nama}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono font-semibold text-gray-800">
                                            {item.sahamTerkecil}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono font-semibold text-gray-800">
                                            {ashlulMasalahJamiah}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-emerald-700 text-lg">
                                            {formatRupiah(jumlahHarta)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center gap-1">
                                                <div className="w-12 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                    <div 
                                                        className="bg-emerald-600 h-2 rounded-full" 
                                                        style={{ width: `${persentase}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-mono text-xs font-semibold text-gray-700">
                                                    {persentase.toFixed(1)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                            <tr className="font-bold text-gray-900">
                                <td className="px-6 py-4" colSpan={3}>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                        </svg>
                                        TOTAL YANG PASTI DIBAGIKAN
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right text-emerald-700 text-lg">
                                    {formatRupiah(tirkah - mauqufHarta)}
                                </td>
                                <td className="px-6 py-4 text-center font-mono text-base">
                                    {((tirkah - mauqufHarta) / tirkah * 100).toFixed(1)}%
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            
            {/* Rincian Per Skenario */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Rincian Perhitungan Setiap Skenario
                    </h3>
                </div>

                <div className="p-6 space-y-6">
                    {detailPerSkenario.map((skenario, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">{index + 1}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Skenario {index + 1}: Janin Dianggap <span className="text-emerald-700">{skenario.namaSkenario}</span>
                                </h3>
                            </div>
                            <MiniResultDisplay result={skenario} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}