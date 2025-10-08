'use client';

export default function MafqudResultDisplay({ result }) {
    if (!result) return null;

    const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);

    return (
        <div className="space-y-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-800">📊 Hasil Perhitungan Mafqud</h2>

            {/* Bagian Utama: Mauquf */}
            <div className="bg-purple-100 border-2 border-purple-300 p-6 rounded-lg text-center shadow-lg">
                <h3 className="text-lg font-semibold text-purple-800">Total Harta yang Ditahan (Mauquf)</h3>
                <p className="text-4xl font-bold text-purple-900 mt-2">{formatRupiah(result.mauquf)}</p>
                <p className="text-sm text-purple-700 mt-1">Harta ini ditahan hingga status ahli waris yang hilang menjadi jelas.</p>
            </div>

            {/* Tabel Perbandingan Skenario */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Tabel Perbandingan Skenario (Proporsi Saham)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left font-semibold text-gray-600">Ahli Waris</th>
                                <th className="p-3 text-center font-semibold text-gray-600">Proporsi (Jika Hidup)</th>
                                <th className="p-3 text-center font-semibold text-gray-600">Proporsi (Jika Wafat)</th>
                                <th className="p-3 text-center font-bold bg-green-50 text-green-700">Proporsi Terkecil (Yakin)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {Object.keys(result.hasilPerbandingan).map(key => {
                                const item = result.hasilPerbandingan[key];
                                return (
                                    <tr key={key}>
                                        <td className="p-3 font-semibold text-gray-800">{item.nama}</td>
                                        <td className="p-3 text-center font-mono">{item.proporsiHidup ? (item.proporsiHidup * 100).toFixed(2) : '0.00'}%</td>
                                        <td className="p-3 text-center font-mono">{item.proporsiWafat ? (item.proporsiWafat * 100).toFixed(2) : '0.00'}%</td>
                                        <td className="p-3 text-center font-bold bg-green-50 text-green-800 font-mono">
                                            {item.proporsiTerkecil ? (item.proporsiTerkecil * 100).toFixed(2) : '0.00'}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tabel Hasil Akhir */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Hasil Akhir (Bagian yang Pasti Diterima Saat Ini)</h3>
                <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                        <thead className="bg-green-100">
                            <tr>
                                <th className="p-3 text-left font-semibold text-green-800">Ahli Waris</th>
                                <th className="p-3 text-right font-semibold text-green-800">Jumlah Harta Diterima (Yakin)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {Object.values(result.hasilPerbandingan).map(item => (
                                <tr key={item.nama}>
                                    <td className="p-3 font-semibold text-gray-800">{item.nama}</td>
                                    <td className="p-3 text-right font-bold text-green-700 font-mono">{formatRupiah(item.bagianYakin)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-100 font-bold">
                            <tr className="border-t-2">
                                <td className="p-3 text-right">Total Dibagikan:</td>
                                <td className="p-3 text-right font-mono">{formatRupiah(result.tirkah - result.mauquf)}</td>
                            </tr>
                            <tr className="bg-purple-100 text-purple-800">
                                <td className="p-3 text-right">Total Ditahan (Mauquf):</td>
                                <td className="p-3 text-right font-mono">{formatRupiah(result.mauquf)}</td>
                            </tr>
                            <tr className="bg-gray-200">
                                <td className="p-3 text-right">Total Harta:</td>
                                <td className="p-3 text-right font-mono">{formatRupiah(result.tirkah)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}