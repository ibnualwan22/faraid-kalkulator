'use client';

export default function JaddWalIkhwahDisplay({ data, ahliWaris }) {
    if (!data || !data.simulasi) return null;

    const { simulasi, pilihanTerbaik, jami_ah, isAlAdd } = data;
    const skenarioKeys = Object.keys(simulasi);

    // Semua ahli waris yang terlibat (termasuk yang mahjub)
    const semuaAhliWaris = [...new Set([
        ...ahliWaris.map(aw => aw.key),
        ...Object.values(simulasi).flatMap(s => Object.keys(s.pembagian))
    ])];

    // Ambil data nama dari ahliWaris
    const namaMap = new Map(ahliWaris.map(aw => [aw.key, { nama: aw.nama, namaAr: aw.namaAr }]));

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-600 to-amber-600 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📊</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Simulasi Perhitungan Kakek & Saudara</h2>
                        <p className="text-yellow-100 text-sm mt-1 font-arabic">جَدّ والإخوة</p>
                    </div>
                </div>
            </div>

            {/* Alert Kasus Al-Add */}
            {isAlAdd && (
                <div className="mx-6 mt-6 bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-lg">⚠️</span>
                        </div>
                        <div>
                            <p className="font-bold text-orange-900 mb-1">Kasus Al-'Ad (العد)</p>
                            <p className="text-sm text-orange-800">
                                Saudara seayah ikut dihitung untuk memperkecil bagian kakek, namun tidak mendapat bagian.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabel Simulasi */}
            <div className="p-6">
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border border-gray-200 rounded-t-xl">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        Perbandingan Metode Perhitungan
                    </h3>
                </div>

                <div className="overflow-x-auto border-x border-b border-gray-200 rounded-b-xl">
                    <table className="w-full text-sm">
                        {/* Header Utama */}
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-4 py-4 text-left font-bold text-gray-700 border-r border-gray-200" rowSpan={2}>
                                    Ahli Waris
                                </th>
                                {skenarioKeys.map(key => (
                                    <th key={key} className="px-4 py-3 text-center font-bold text-gray-700 border-r border-gray-200" colSpan={2}>
                                        <div className="mb-1">{simulasi[key].nama}</div>
                                        <div className="text-xs font-normal text-gray-500">AM: {simulasi[key].am}</div>
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-center font-bold text-green-700 bg-green-50" colSpan={2}>
                                    <div className="mb-1">Mas'alatul Jāmi'ah</div>
                                    <div className="text-xs font-normal text-green-600">AM: {jami_ah}</div>
                                </th>
                            </tr>
                            {/* Sub-Header */}
                            <tr className="bg-gray-100">
                                {skenarioKeys.map(key => (
                                    <>
                                        <th key={`${key}-f`} className="px-4 py-3 text-center text-xs font-semibold text-gray-600 border-r border-gray-100">
                                            Furudh
                                        </th>
                                        <th key={`${key}-s`} className="px-4 py-3 text-center text-xs font-semibold text-gray-600 border-r border-gray-200">
                                            Saham
                                        </th>
                                    </>
                                ))}
                                <th className="px-4 py-3 text-center text-xs font-semibold text-green-700 bg-green-50">
                                    Saham
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-green-700 bg-green-50">
                                    Terbaik
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 divide-y divide-gray-100">
                            {semuaAhliWaris.map((key, index) => {
                                const info = namaMap.get(key) || { nama: key, namaAr: '-' };
                                const isKakek = key === 'kakek';
                                const isEven = index % 2 === 0;
                                
                                return (
                                    <tr key={key} className={`hover:bg-yellow-50 transition-colors ${isEven ? 'bg-white' : 'bg-gray-50/50'} ${isKakek ? 'bg-blue-50/50' : ''}`}>
                                        <td className="px-4 py-4 border-r border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 ${isKakek ? 'bg-blue-100' : 'bg-yellow-100'} rounded-lg flex items-center justify-center`}>
                                                    <span className="text-lg">{isKakek ? '👴' : (key.includes('lk') ? '👨' : '👩')}</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{info.nama}</p>
                                                    <p className="font-arabic text-gray-500 text-xs">{info.namaAr}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {skenarioKeys.map(skey => {
                                            const bagian = simulasi[skey].pembagian[key];
                                            return (
                                                <>
                                                    <td key={`${skey}-f`} className="px-4 py-4 text-center border-r border-gray-100">
                                                        {bagian ? (
                                                            <span className="inline-block px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-semibold">
                                                                {bagian.furudh}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td key={`${skey}-s`} className="px-4 py-4 text-center font-mono font-semibold text-gray-800 border-r border-gray-200">
                                                        {bagian ? bagian.saham.toFixed(2).replace('.00', '') : '-'}
                                                    </td>
                                                </>
                                            );
                                        })}
                                        {/* Kolom Jami'ah */}
                                        <td className="px-4 py-4 text-center bg-green-50">
                                            {isKakek ? (
                                                <span className="font-mono font-bold text-green-700 text-base">
                                                    {simulasi[pilihanTerbaik.key].sahamKakekNormalized.toFixed(2).replace('.00', '')}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-center bg-green-50">
                                            {isKakek && (
                                                <div className="inline-flex items-center justify-center w-8 h-8 bg-green-600 rounded-full">
                                                    <span className="text-white text-lg">✓</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {/* Baris Total */}
                            <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-t-2 border-gray-300 font-bold text-gray-900">
                                <td className="px-4 py-4 border-r border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                        </svg>
                                        TOTAL
                                    </div>
                                </td>
                                {skenarioKeys.map(key => (
                                    <>
                                        <td key={`${key}-tf`} className="px-4 py-4 text-center border-r border-gray-100">-</td>
                                        <td key={`${key}-ts`} className="px-4 py-4 text-center font-mono text-base border-r border-gray-200">
                                            {simulasi[key].am}
                                        </td>
                                    </>
                                ))}
                                <td className="px-4 py-4 text-center font-mono font-bold text-green-700 text-base bg-green-100">
                                    {jami_ah}
                                </td>
                                <td className="px-4 py-4 bg-green-100"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Info Pilihan Terbaik */}
            <div className="mx-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-2xl">✓</span>
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-green-900 text-lg mb-1">
                            Pilihan Terbaik untuk Kakek: {pilihanTerbaik.nama}
                        </p>
                        <p className="text-sm text-green-700">
                            Saham: <span className="font-mono font-bold">{pilihanTerbaik.sahamNormalized}</span> dari <span className="font-mono font-bold">{jami_ah}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}