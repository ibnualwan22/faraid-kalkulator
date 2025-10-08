'use client';

export default function HamlResultDisplay({ result }) {
    // ... (fungsi formatRupiah)
    return (
        <div className="space-y-6">
            <div className="bg-purple-100 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-purple-800">Harta yang Ditahan (Mauquf)</h3>
                <p className="text-4xl font-bold text-purple-900">{formatRupiah(result.mauquf)}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Tabel Perbandingan Skenario (Proporsi Saham)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-2 text-left">Ahli Waris</th>
                                {result.detail_skenario.map(s => <th key={s.nama} className="p-2 text-center">{s.nama}</th>)}
                                <th className="p-2 text-center font-bold bg-green-50">Proporsi Terkecil</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(result.hasil_perbandingan).map(key => {
                                const item = result.hasil_perbandingan[key];
                                return (
                                    <tr key={key} className="border-t">
                                        <td className="p-2 font-semibold">{item.nama}</td>
                                        {item.proporsiPerSkenario.map((p, i) => <td key={i} className="p-2 text-center">{(p * 100).toFixed(1)}%</td>)}
                                        <td className="p-2 text-center font-bold bg-green-50">{(item.proporsiTerkecil * 100).toFixed(1)}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Hasil Akhir (Bagian yang Pasti Diterima Saat Ini)</h3>
                <table className="w-full text-sm">
                    {/* ... Tampilkan tabel sederhana: Ahli Waris | Bagian Yakin (Rp) ... */}
                </table>
            </div>
        </div>
    );
}