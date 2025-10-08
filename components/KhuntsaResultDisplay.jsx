'use client';

export default function KhuntsaResultDisplay({ result }) {
    // ... (fungsi formatRupiah)
    return (
        <div className="space-y-6">
            <div className="bg-purple-100 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-purple-800">Harta yang Ditahan (Mauquf)</h3>
                <p className="text-4xl font-bold text-purple-900">{formatRupiah(result.mauquf)}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Tabel Perbandingan Skenario</h3>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 text-left">Ahli Waris</th>
                            <th className="p-2 text-center">Saham (Jika Laki-laki)</th>
                            <th className="p-2 text-center">Saham (Jika Perempuan)</th>
                            <th className="p-2 text-center font-bold">Saham Terkecil</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(result.hasilPerbandingan).map(item => (
                            <tr key={item.nama} className="border-t">
                                <td className="p-2 font-semibold">{item.nama}</td>
                                <td className="p-2 text-center">{item.sahamLaki}</td>
                                <td className="p-2 text-center">{item.sahamPerempuan}</td>
                                <td className="p-2 text-center font-bold">{item.sahamTerkecil}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Hasil Akhir (Bagian yang Pasti Diterima)</h3>
                {/* ... Tampilkan tabel hasil akhir yang menunjukkan bagianYakin untuk setiap ahli waris ... */}
            </div>
        </div>
    );
}