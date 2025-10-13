// components/MunasakhatResultDisplay.jsx

'use client';

// Komponen Tampilan Hasil yang Telah Disesuaikan
const ResultTable = ({ result, title, amFinal, mayitKeduaKey = null }) => {
    if (!result || !result.summary) return null;
    const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);

    return (
        <div className="p-4 border rounded-lg bg-gray-50 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">Total Harta: {formatRupiah(result.input.tirkah)}</p>
            
            <div className="bg-white rounded-lg p-4 mt-2 border">
                <div className="grid grid-cols-2 gap-4 text-center mb-4">
                    <div className="p-2 bg-blue-50 rounded-md"><div className="text-sm text-blue-700">AM Awal</div><div className="font-bold text-xl text-blue-800">{result.summary.ashlulMasalahAwal}</div></div>
                    <div className="p-2 bg-green-100 rounded-md"><div className="text-sm text-green-700">AM Final (Jami'ah)</div><div className="font-bold text-2xl text-green-800">{amFinal}</div></div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr><th className="p-2 text-left">Ahli Waris</th><th className="p-2 text-center">Bagian</th><th className="p-2 text-center">Saham Awal</th><th className="p-2 text-center font-bold">Saham Final</th><th className="p-2 text-right font-bold">Harta Final</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {result.output.map(aw => {
                                const isMayitKedua = aw.key === mayitKeduaKey;

                                if (aw.isMahjub) {
                                    return ( <tr key={aw.key} className="bg-gray-50 text-gray-400 italic"><td className="p-2">{aw.nama}</td><td className="p-2 text-center" colSpan="4">Mahjub: {aw.alasan}</td></tr> );
                                }

                                return (
                                    <tr key={aw.key} className={`${isMayitKedua ? 'bg-yellow-100' : 'bg-white'}`}>
                                        <td className="p-2 font-semibold text-gray-900">{aw.nama}{isMayitKedua && <span className="text-xs text-yellow-600 ml-2">(Meninggal)</span>}</td>
                                        <td className="p-2 text-center text-gray-700">{aw.bagian}</td>
                                        <td className="p-2 text-center font-mono text-gray-700">{aw.sahamAwal}</td>
                                        <td className={`p-2 text-center font-mono font-bold ${isMayitKedua ? 'text-yellow-700' : 'text-green-800'}`}>{aw.sahamFinal}</td>
                                        <td className={`p-2 text-right font-mono font-bold ${isMayitKedua ? 'text-yellow-700' : 'text-gray-900'}`}>
                                            {formatRupiah(aw.bagianHarta)}
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
    const { hasil_akhir_1, hasil_akhir_2, proses_tashih, namaMayitKedua, mayit_kedua_key } = result;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center text-white">Rincian Perhitungan Munasakhat</h2>
            <div className="text-center p-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg"><p className="text-sm text-yellow-800">Ahli waris yang meninggal kedua adalah:</p><p className="font-bold text-2xl text-yellow-900">{namaMayitKedua}</p></div>

            <ResultTable 
                result={hasil_akhir_1} 
                title="Masalah Pertama" 
                amFinal={proses_tashih.amFinal}
                mayitKeduaKey={mayit_kedua_key}
            />
            {hasil_akhir_2 && (
                <ResultTable 
                    result={hasil_akhir_2} 
                    title={`Masalah Kedua (Ahli Waris dari ${namaMayitKedua})`} 
                    amFinal={proses_tashih.amFinal}
                />
            )}
        </div>
    );
}