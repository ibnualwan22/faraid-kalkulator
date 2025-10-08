'use client';
import ResultDisplay from './ResultDisplay'; // Kita gunakan ulang komponen hasil utama

export default function MunasakhotResultDisplay({ result }) {
    if (!result) return null;

    const { hasilMasalahPertama, hasilMasalahKedua, proses_tashih, hasilGabungan } = result;
    const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);

    return (
        <div className="space-y-8">
            {/* Bagian 1: Hasil Masalah Pertama */}
            <div>
                <h2 className="text-2xl font-bold mb-4 p-3 bg-gray-100 rounded-t-lg border-b-4 border-blue-500">Hasil Masalah Pertama</h2>
                <ResultDisplay result={hasilMasalahPertama} />
            </div>
            
            {/* Bagian 2: Hasil Masalah Kedua */}
            <div>
                <h2 className="text-2xl font-bold mb-4 p-3 bg-gray-100 rounded-t-lg border-b-4 border-purple-500">Hasil Masalah Kedua</h2>
                <ResultDisplay result={hasilMasalahKedua} />
            </div>

            {/* Bagian 3: Proses Tashih */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
                <h3 className="text-xl font-bold text-yellow-900 mb-4">Proses Tashih (Penggabungan)</h3>
                <div className="space-y-2 text-center">
                    <p>Saham Mayit Kedua (dari Masalah 1): <strong className="text-lg">{proses_tashih.sihamMayitKedua}</strong></p>
                    <p>Ashlul Mas'alah Kedua: <strong className="text-lg">{proses_tashih.amKedua}</strong></p>
                    <hr className="my-2" />
                    <p>Angka Pengali untuk Masalah 1: <strong className="text-lg text-blue-700">{proses_tashih.pengaliMasalahPertama}</strong></p>
                    <p>Angka Pengali untuk Masalah 2: <strong className="text-lg text-purple-700">{proses_tashih.pengaliMasalahKedua}</strong></p>
                    <hr className="my-2" />
                    <p className="font-bold">Ashlul Mas'alah Gabungan (Final): <span className="text-2xl text-green-700">{proses_tashih.amFinal}</span></p>
                </div>
            </div>

            {/* Bagian 4: Hasil Akhir Gabungan */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <h2 className="text-2xl font-bold p-4 bg-green-600 text-white">Hasil Akhir Gabungan</h2>
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase">
                        <tr>
                            <th className="p-3 text-left font-semibold">Ahli Waris Akhir</th>
                            <th className="p-3 text-center font-semibold">Saham Final</th>
                            <th className="p-3 text-right font-semibold">Jumlah Harta</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {hasilGabungan.map((aw, index) => (
                            <tr key={index} className="border-t hover:bg-gray-50">
                                <td className="p-3 font-semibold">{aw.nama}</td>
                                <td className="p-3 text-center font-mono">{aw.saham}</td>
                                <td className="p-3 text-right font-semibold text-green-700">{formatRupiah(aw.bagianHarta)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-100 font-bold text-gray-800">
                        <tr className="border-t-2 border-gray-300">
                            <td className="p-3">TOTAL</td>
                            <td className="p-3 text-center font-mono">{proses_tashih.amFinal}</td>
                            <td className="p-3 text-right">{formatRupiah(masalah_pertama.tirkah)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}