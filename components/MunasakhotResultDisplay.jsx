// components/MunasakhatResultDisplay.jsx

'use client';

// Komponen Tampilan Hasil yang Telah Disesuaikan
const EnhancedResultDisplay = ({ result, title, pengali, amFinal, hasilGabungan, mayitKeduaKey, isMasalahPertama, amAkhirCustom = null }) => {
    if (!result || !result.summary) return null;
    const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
    const amAwal = result.summary.ashlulMasalahTashih || result.summary.ashlulMasalahAkhir;

    return (
        <div className="p-4 border rounded-lg bg-gray-50 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            {isMasalahPertama && <p className="text-sm text-gray-500 mb-4">Total Harta Awal: {formatRupiah(result.input.tirkah)}</p>}
            
            <div className="bg-white rounded-lg p-4 mt-2 border">
                <div className="grid grid-cols-2 gap-4 text-center mb-4">
                    <div className="p-2 bg-blue-50 rounded-md"><div className="text-sm text-blue-700">AM Awal</div><div className="font-bold text-xl text-blue-800">{amAwal}</div></div>
                    <div className="p-2 bg-green-100 rounded-md"><div className="text-sm text-green-700">AM Akhir</div><div className="font-bold text-2xl text-green-800">{amAkhirCustom || amFinal}</div></div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left font-semibold text-gray-700">Ahli Waris</th>
                                <th className="p-2 text-center font-semibold text-gray-700">Bagian</th>
                                <th className="p-2 text-center font-semibold text-gray-700">Saham Awal</th>
                                <th className="p-2 text-center font-bold text-gray-700">Saham Akhir</th>
                                {/* --- PERBAIKAN #1: HILANGKAN KONDISI, TAMPILKAN SELALU --- */}
                                <th className="p-2 text-right font-bold text-gray-700">Harta Final</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {result.output.map(aw => {
                                const sahamAwalKey = result.summary.ashlulMasalahTashih ? 'sahamTashih' : 'sahamAkhir';
                                const sahamAwal = aw[sahamAwalKey] || 0;
                                const sahamFinal = sahamAwal * pengali;
                                const isMayitKedua = isMasalahPertama && aw.key === mayitKeduaKey;

                                // --- PERBAIKAN #2: AMBIL HARTA DARI HASIL GABUNGAN ---
                                const finalData = hasilGabungan.find(h => h.key === aw.key);
                                const hartaFinal = finalData ? finalData.bagianHarta : (isMayitKedua ? aw.bagianHarta : 0);

                                if (aw.isMahjub) {
                                    return ( <tr key={aw.key} className="bg-gray-50 text-gray-400 italic"><td className="p-2 font-semibold">{aw.nama}</td><td className="p-2 text-center" colSpan="4">Mahjub: {aw.alasan}</td></tr> );
                                }

                                return (
                                    <tr key={aw.key} className={`${isMayitKedua ? 'bg-yellow-100' : 'bg-white'}`}>
                                        <td className="p-2 font-semibold text-gray-900">{aw.nama}{isMayitKedua && <span className="text-xs text-yellow-600 ml-2">(Meninggal)</span>}</td>
                                        <td className="p-2 text-center text-gray-700">{aw.bagian}</td>
                                        <td className="p-2 text-center font-mono text-gray-700">{sahamAwal}</td>
                                        <td className={`p-2 text-center font-mono font-bold ${isMayitKedua ? 'text-yellow-700' : 'text-green-800'}`}>{sahamFinal}</td>
                                        {/* --- PERBAIKAN #3: LOGIKA TAMPILAN HARTA --- */}
                                        <td className={`p-2 text-right font-mono font-bold ${isMayitKedua ? 'text-yellow-700' : 'text-gray-900'}`}>
                                            {formatRupiah(hartaFinal)}
                                            {isMayitKedua && <span className="text-xs text-yellow-600 ml-1">(Diteruskan)</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default function MunasakhatResultDisplay({ result }) {
    if (!result) return null;
    const { hasilMasalahPertama, hasilMasalahKedua, proses_tashih, namaMayitKedua, mayit_kedua_key } = result;

    const amAkhirMasalahKedua = proses_tashih.sihamMayitKedua * proses_tashih.pengaliMasalahPertama;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center text-white">Rincian Perhitungan Munasakhat</h2>
            <div className="text-center p-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg"><p className="text-sm text-yellow-800">Ahli waris yang meninggal kedua adalah:</p><p className="font-bold text-2xl text-yellow-900">{namaMayitKedua}</p></div>

            <EnhancedResultDisplay 
                result={hasilMasalahPertama} 
                title="Masalah Pertama" 
                amFinal={proses_tashih.amFinal}
                pengali={proses_tashih.pengaliMasalahPertama}
                mayitKeduaKey={mayit_kedua_key}
                isMasalahPertama={true}
                hasilGabungan={result.hasilGabungan}
            />
            <EnhancedResultDisplay 
                result={hasilMasalahKedua} 
                title={`Masalah Kedua (Ahli Waris dari ${namaMayitKedua})`} 
                amFinal={null} // Tidak relevan untuk tabel kedua
                amAkhirCustom={amAkhirMasalahKedua} 
                pengali={proses_tashih.pengaliMasalahKedua}
                mayitKeduaKey={null}
                isMasalahPertama={false}
                hasilGabungan={result.hasilGabungan} // Kirim juga ke sini untuk lookup harta
            />
        </div>
    );
}