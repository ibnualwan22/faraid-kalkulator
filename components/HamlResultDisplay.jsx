// components/HamlResultDisplay.jsx

'use client';

// Komponen kecil untuk menampilkan hasil dasar (reusable)
const MiniResultDisplay = ({ result }) => {
    const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
    const sahamAkhirKey = result.summary.ashlulMasalahTashih ? 'sahamTashih' : 'sahamAkhir';
    const amAkhir = result.summary.ashlulMasalahTashih || result.summary.ashlulMasalahAkhir;

    // Ambil data jumlah dari input yang digunakan untuk kalkulasi ini
    const heirQuantities = result.input.ahliWaris;

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mt-4 border-2 border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div className="p-3 bg-blue-600 text-white rounded-md">
                    <div className="text-xs font-semibold mb-1">Ashlul Mas'alah Awal</div>
                    <div className="font-bold text-2xl">{result.summary.ashlulMasalahAwal}</div>
                </div>
                <div className="p-3 bg-purple-600 text-white rounded-md">
                    <div className="text-xs font-semibold mb-1">Ashlul Mas'alah Akhir</div>
                    <div className="font-bold text-2xl">{amAkhir}</div>
                </div>
                <div className="p-3 bg-green-600 text-white rounded-md">
                    <div className="text-xs font-semibold mb-1">Kasus</div>
                    <div className="font-bold text-2xl">{result.summary.kasus}</div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-300">
                    <thead className="bg-gray-700 text-white">
                        <tr>
                            <th className="p-3 text-left font-bold">Ahli Waris</th>
                            <th className="p-3 text-center font-bold">Jml</th>
                            <th className="p-3 text-center font-bold">Bagian</th>
                            <th className="p-3 text-center font-bold">Saham Awal</th>
                            <th className="p-3 text-center font-bold">Saham Akhir</th>
                            <th className="p-3 text-right font-bold">Jumlah Harta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.output.filter(aw => !aw.isMahjub).map((aw, idx) => (
                            <tr key={aw.key} className={`border-t border-gray-300 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                <td className="p-3 font-bold text-gray-800">{aw.nama}</td>
                                <td className="p-3 text-center font-mono font-semibold text-gray-800">{heirQuantities[aw.key] || 0}</td>
                                <td className="p-3 text-center font-semibold text-gray-800">{aw.bagian}</td>
                                <td className="p-3 text-center font-mono font-semibold text-gray-800">{aw.sahamAwal?.toFixed(2).replace('.00', '') || '-'}</td>
                                <td className="p-3 text-center font-mono font-semibold text-gray-800">{aw[sahamAkhirKey]?.toFixed(2).replace('.00', '') || '-'}</td>
                                <td className="p-3 text-right font-mono font-bold text-green-700">{formatRupiah(aw.bagianHarta)}</td>
                            </tr>
                        ))}
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
        <div className="space-y-8">
            {/* Bagian 1: Hasil Akhir dan Mauquf */}
            <div className="bg-purple-600 border-4 border-purple-700 p-6 rounded-lg text-center shadow-lg">
                <h3 className="text-xl font-bold text-white mb-2">Total Harta yang Ditahan (Mauquf)</h3>
                <p className="text-5xl font-bold text-white mt-3">{formatRupiah(mauqufHarta)}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-300">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b-2 border-green-600 pb-3">
                    Hasil Akhir (Bagian yang Pasti Diterima)
                </h3>
                <table className="w-full text-sm border border-gray-300">
                    <thead className="bg-green-600 text-white">
                        <tr>
                            <th className="p-4 text-left font-bold text-base">Ahli Waris</th>
                            <th className="p-4 text-right font-bold text-base">Jumlah Harta Diterima</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                        {Object.values(perbandingan).map((item, idx) => (
                            <tr key={item.nama} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="p-4 font-bold text-gray-800 text-base">{item.nama}</td>
                                <td className="p-4 text-right font-bold text-green-700 font-mono text-lg">
                                    {formatRupiah((tirkah / ashlulMasalahJamiah) * item.sahamTerkecil)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Bagian 2: Rincian Per Skenario */}
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center border-t-4 border-gray-300 pt-8 text-gray-800">
                    Rincian Perhitungan Setiap Skenario
                </h2>
                {detailPerSkenario.map((skenario, index) => (
                    <div key={index} className="p-6 border-2 border-gray-300 rounded-lg bg-gray-50 shadow-md">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Skenario {index + 1}: Janin Dianggap {skenario.namaSkenario}
                        </h3>
                        <MiniResultDisplay result={skenario} />
                    </div>
                ))}
            </div>
        </div>
    );
}