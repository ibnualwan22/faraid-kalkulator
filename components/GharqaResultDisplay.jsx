// components/GharqaResultDisplay.jsx

'use client';

// =========================================================================
// KOMPONEN UNTUK MENAMPILKAN DETAIL PERHITUNGAN (SEPERTI DI KALKULATOR DASAR)
// =========================================================================
const MiniResultDisplay = ({ result }) => {
    if (!result || !result.summary) return null; // Tambahkan penjagaan jika result tidak valid

    const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
    
    // Tentukan kunci saham dan AM yang benar (apakah ada tashih/inkisar atau tidak)
    const sahamAkhirKey = result.summary.ashlulMasalahTashih ? 'sahamTashih' : 'sahamAkhir';
    const amAkhir = result.summary.ashlulMasalahTashih || result.summary.ashlulMasalahAkhir || result.summary.ashlulMasalahAwal;

    // Ambil data jumlah dari input yang digunakan untuk kalkulasi ini
    const heirQuantities = result.input.ahliWaris;

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mt-4 border">
            {/* Kartu Summary (Ashlul Mas'alah & Kasus) */}
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div className="p-2 bg-blue-50 rounded-md">
                    <div className="text-sm text-gray-600">AM Awal</div>
                    <div className="font-bold text-xl text-blue-800">{result.summary.ashlulMasalahAwal}</div>
                </div>
                <div className="p-2 bg-purple-50 rounded-md">
                    <div className="text-sm text-gray-600">AM Akhir</div>
                    <div className="font-bold text-xl text-purple-800">{amAkhir}</div>
                </div>
                <div className="p-2 bg-green-50 rounded-md">
                    <div className="text-sm text-gray-600">Kasus</div>
                    <div className="font-bold text-xl text-green-800">{result.summary.kasus}</div>
                </div>
            </div>

            {/* Tabel Rincian */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left font-semibold text-gray-700">Ahli Waris</th>
                            <th className="p-2 text-center font-semibold text-gray-700">Jml</th>
                            <th className="p-2 text-center font-semibold text-gray-700">Bagian</th>
                            <th className="p-2 text-center font-semibold text-gray-700">Saham Awal</th>
                            <th className="p-2 text-center font-semibold text-gray-700">Saham Akhir</th>
                            <th className="p-2 text-right font-semibold text-gray-700">Jumlah Harta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.output.filter(aw => !aw.isMahjub).map(aw => (
                            <tr key={aw.key} className="border-t">
                                <td className="p-2 font-semibold text-gray-800">{aw.nama}</td>
                                <td className="p-2 text-center font-mono text-gray-600">{heirQuantities[aw.key] || 0}</td>
                                <td className="p-2 text-center text-gray-600">{aw.bagian}</td>
                                <td className="p-2 text-center font-mono text-gray-600">{aw.sahamAwal?.toFixed(2).replace('.00', '') || '-'}</td>
                                <td className="p-2 text-center font-mono text-gray-600">{aw[sahamAkhirKey]?.toFixed(2).replace('.00', '') || '-'}</td>
                                <td className="p-2 text-right font-mono font-semibold text-gray-800">{formatRupiah(aw.bagianHarta)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// =========================================================================
// BAGIAN UTAMA YANG MELAKUKAN LOOPING UNTUK SETIAP MAYIT
// =========================================================================
export default function GharqaResultDisplay({ result }) {
    if (!result || result.length === 0) return <p>Tidak ada hasil untuk ditampilkan.</p>;

    return (
        <div className="space-y-8">
             <h2 className="text-2xl font-bold text-center">Hasil Perhitungan Waris</h2>
             <p className="text-center text-gray-600 -mt-6">Setiap mayit dihitung secara terpisah dan tidak saling mewarisi.</p>

            {result.map((hasil, index) => (
                <div key={index} className="p-4 border-2 rounded-lg bg-gray-50 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Hasil untuk: <span className="text-blue-600">{hasil.namaMayit}</span>
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Total Harta (Tirkah): {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(hasil.input.tirkah)}
                    </p>
                    {/* PANGGIL KOMPONEN MINI DISPLAY UNTUK MERENDER DETAIL */}
                    <MiniResultDisplay result={hasil} />
                </div>
            ))}
        </div>
    );
}