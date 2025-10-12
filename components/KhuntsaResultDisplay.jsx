// components/KhuntsaResultDisplay.jsx

'use client';

// Impor komponen MiniResultDisplay yang sudah kita buat untuk Haml
// Jika belum ada, salin dari kode Haml sebelumnya.
const MiniResultDisplay = ({ result }) => {
    if (!result) return null;
    const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
    const sahamAkhirKey = result.summary.ashlulMasalahTashih ? 'sahamTashih' : 'sahamAkhir';
    const amAkhir = result.summary.ashlulMasalahTashih || result.summary.ashlulMasalahAkhir;
    const heirQuantities = result.input.ahliWaris;

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mt-4 border">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div className="p-2 bg-blue-50 rounded-md"><div className="text-sm">AM Awal</div><div className="font-bold text-xl">{result.summary.ashlulMasalahAwal}</div></div>
                <div className="p-2 bg-purple-50 rounded-md"><div className="text-sm">AM Akhir</div><div className="font-bold text-xl">{amAkhir}</div></div>
                <div className="p-2 bg-green-50 rounded-md"><div className="text-sm">Kasus</div><div className="font-bold text-xl">{result.summary.kasus}</div></div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">Ahli Waris</th><th className="p-2 text-center">Jml</th><th className="p-2 text-center">Bagian</th><th className="p-2 text-center">Saham Awal</th><th className="p-2 text-center">Saham Akhir</th><th className="p-2 text-right">Jumlah Harta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.output.filter(aw => !aw.isMahjub).map(aw => (
                            <tr key={aw.key} className="border-t">
                                <td className="p-2 font-semibold">{aw.nama}</td>
                                <td className="p-2 text-center font-mono">{heirQuantities[aw.key] || 0}</td>
                                <td className="p-2 text-center">{aw.bagian}</td>
                                <td className="p-2 text-center font-mono">{aw.sahamAwal?.toFixed(2).replace('.00', '') || '-'}</td>
                                <td className="p-2 text-center font-mono">{aw[sahamAkhirKey]?.toFixed(2).replace('.00', '') || '-'}</td>
                                <td className="p-2 text-right font-mono font-semibold">{formatRupiah(aw.bagianHarta)}</td>
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
            {/* Bagian 1: Mauquf & Tabel Jami'ah */}
            <div className="bg-purple-100 border-2 border-purple-300 p-6 rounded-lg text-center shadow-lg">
                <h3 className="text-lg font-semibold text-purple-800">Total Harta yang Ditahan (Mauquf)</h3>
                <p className="text-4xl font-bold text-purple-900 mt-2">{formatRupiah(mauqufHarta)}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Tabel Mas'alatul Jami'ah (AM: {ashlulMasalahJamiah})</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left font-semibold">Ahli Waris</th>
                                <th className="p-3 text-center font-semibold">Saham (Jika Laki-laki)</th>
                                <th className="p-3 text-center font-semibold">Saham (Jika Perempuan)</th>
                                <th className="p-3 text-center font-bold bg-green-100 text-green-800">Saham Yakin (Terkecil)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {Object.values(perbandingan).map(item => (
                                <tr key={item.nama}>
                                    <td className="p-3 font-semibold">{item.nama}</td>
                                    <td className="p-3 text-center font-mono">{item.sahamPerSkenario[0]}</td>
                                    <td className="p-3 text-center font-mono">{item.sahamPerSkenario[1]}</td>
                                    <td className="p-3 text-center font-bold bg-green-50 text-green-900 font-mono">{item.sahamTerkecil}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Bagian 2: Rincian Per Skenario */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center border-t pt-8">Rincian Perhitungan Setiap Skenario</h2>
                <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800">Skenario 1: Khuntsa Dianggap Laki-laki</h3>
                    <MiniResultDisplay result={skenarioLaki} />
                </div>
                <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800">Skenario 2: Khuntsa Dianggap Perempuan</h3>
                    <MiniResultDisplay result={skenarioPerempuan} />
                </div>
            </div>
        </div>
    );
}