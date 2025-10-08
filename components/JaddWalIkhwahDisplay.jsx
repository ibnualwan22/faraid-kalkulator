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
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 my-6">
            <h3 className="text-xl font-bold text-yellow-900 mb-2">
                📊 Simulasi Perhitungan Kakek & Saudara (جَدّ والإخوة)
            </h3>
            {isAlAdd && (
                <p className="text-sm bg-orange-100 border border-orange-300 rounded p-2 mb-4 text-orange-800">
                    ⚠️ <strong>Kasus Al-'Ad (العد)</strong>: Saudara seayah ikut dihitung untuk memperkecil bagian kakek, namun tidak mendapat bagian.
                </p>
            )}
            
            <div className="overflow-x-auto rounded-lg border border-yellow-200 shadow-sm">
                <table className="w-full text-sm">
                    {/* Header Utama */}
                    <thead className="bg-yellow-100 text-yellow-800 uppercase text-xs">
                        <tr>
                            <th className="p-3 text-left font-semibold border-r border-yellow-300" rowSpan={2}>
                                Ahli Waris
                            </th>
                            {skenarioKeys.map(key => (
                                <th key={key} className="p-3 text-center font-semibold border-r border-yellow-300" colSpan={2}>
                                    {simulasi[key].nama}
                                    <br />
                                    <span className="text-xs font-normal">(AM: {simulasi[key].am})</span>
                                </th>
                            ))}
                            <th className="p-3 text-center font-semibold border-l border-green-400 bg-green-100" colSpan={2}>
                                Mas'alatul Jāmi'ah
                                <br />
                                <span className="text-xs font-normal">(AM: {jami_ah})</span>
                            </th>
                        </tr>
                        {/* Sub-Header */}
                        <tr>
                            {skenarioKeys.map(key => (
                                <>
                                    <th key={`${key}-f`} className="p-2 text-center font-semibold border-r border-yellow-200">Furudh</th>
                                    <th key={`${key}-s`} className="p-2 text-center font-semibold border-r border-yellow-300">Saham</th>
                                </>
                            ))}
                            <th className="p-2 text-center font-semibold border-l border-green-400 bg-green-100">Saham</th>
                            <th className="p-2 text-center font-semibold border-l border-green-200 bg-green-100">Terbaik</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {semuaAhliWaris.map(key => {
                            const info = namaMap.get(key) || { nama: key, namaAr: '-' };
                            const isKakek = key === 'kakek';
                            
                            return (
                                <tr key={key} className={`border-t border-yellow-200 ${isKakek ? 'bg-blue-50' : ''}`}>
                                    <td className="p-3 font-semibold bg-gray-50 border-r border-yellow-300">
                                        {info.nama}
                                        <br />
                                        <span className="text-xs font-arabic text-gray-500">{info.namaAr}</span>
                                    </td>
                                    {skenarioKeys.map(skey => {
                                        const bagian = simulasi[skey].pembagian[key];
                                        return (
                                            <>
                                                <td key={`${skey}-f`} className="p-2 text-center text-xs border-r border-yellow-200">
                                                    {bagian ? bagian.furudh : '-'}
                                                </td>
                                                <td key={`${skey}-s`} className="p-2 text-center font-mono border-r border-yellow-300">
                                                    {bagian ? bagian.saham.toFixed(2).replace('.00', '') : '-'}
                                                </td>
                                            </>
                                        );
                                    })}
                                    {/* Kolom Jami'ah */}
                                    <td className="p-2 text-center font-mono font-bold border-l border-green-400 bg-green-50">
                                        {isKakek ? simulasi[pilihanTerbaik.key].sahamKakekNormalized.toFixed(2).replace('.00', '') : '-'}
                                    </td>
                                    <td className="p-2 text-center border-l border-green-200 bg-green-50">
                                        {isKakek ? '✅' : ''}
                                    </td>
                                </tr>
                            );
                        })}
                        {/* Baris Total */}
                        <tr className="border-t-2 border-yellow-400 bg-yellow-200 font-bold">
                            <td className="p-3 text-right border-r border-yellow-300">TOTAL</td>
                            {skenarioKeys.map(key => (
                                <>
                                    <td key={`${key}-tf`} className="p-2 text-center border-r border-yellow-200">-</td>
                                    <td key={`${key}-ts`} className="p-2 text-center font-mono border-r border-yellow-300">
                                        {simulasi[key].am}
                                    </td>
                                </>
                            ))}
                            <td className="p-2 text-center font-mono font-bold border-l border-green-400 bg-green-200">
                                {jami_ah}
                            </td>
                            <td className="p-2 border-l border-green-200 bg-green-200"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-center">
                <p className="font-semibold text-green-800">
                    ✅ Pilihan Terbaik untuk Kakek: <span className="font-bold text-lg">{pilihanTerbaik.nama}</span>
                    <br />
                    <span className="text-sm">Saham: {pilihanTerbaik.sahamNormalized} dari {jami_ah}</span>
                </p>
            </div>
        </div>
    );
}