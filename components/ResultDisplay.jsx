'use client';
import JaddWalIkhwahDisplay from './JaddWalIkhwahDisplay'; // <-- TAMBAHKAN INI


export default function ResultDisplay({ result }) {
  if (!result) return null;

  // ==================================================================
  // PERBAIKAN: Semua variabel dan fungsi bantuan dideklarasikan di sini
  // ==================================================================
  const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);

  const formatNotes = (notes) => {
    let formatted = [];
    notes.forEach(langkah => {
      formatted.push(`=== LANGKAH ${langkah.langkah}: ${langkah.deskripsi} ===`);
      langkah.detail.forEach(d => formatted.push(`  ${d}`));
    });
    return formatted;
  };

  const amFinal = result.summary.ashlulMasalahTashih || result.summary.ashlulMasalahAkhir;
  const sahamFinalKey = result.summary.ashlulMasalahTashih ? 'sahamTashih' : 'sahamAkhir';
  const showSahamAkhir = result.summary.ashlulMasalahAwal !== result.summary.ashlulMasalahAkhir;
  const totalSahamAwal = result.output.reduce((sum, aw) => sum + (aw.sahamAwal || 0), 0);
  // ==================================================================

  return (
    <div className="space-y-6">
      {/* Bagian Header Hasil */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800">📊 Hasil Perhitungan</h2>
        <p className="text-gray-600 mt-1">Total Harta: {formatRupiah(result.input.tirkah)}</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex-1 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-700">Ashlul Mas'alah Awal</p>
                <p className="text-2xl font-bold text-blue-900">{result.summary.ashlulMasalahAwal}</p>
            </div>
            <div className="flex-1 bg-purple-50 p-3 rounded-lg border border-purple-200">
                <p className="text-sm font-semibold text-purple-700">Ashlul Mas'alah Akhir</p>
                <p className="text-2xl font-bold text-purple-900">{amFinal}</p>
            </div>
            <div className="flex-1 bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm font-semibold text-green-700">Kasus</p>
                <p className="text-2xl font-bold text-green-900">{result.summary.kasus}</p>
            </div>
        </div>
      </div>
      {result.detailKasus?.jadd_wal_ikhwah?.simulasi && (
    <JaddWalIkhwahDisplay 
        data={result.detailKasus.jadd_wal_ikhwah}
        ahliWaris={result.output.filter(aw => !aw.isMahjub)}
    />
)}
      
      {/* Bagian Tabel */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                      <th className="p-3 text-left font-semibold">Ahli Waris</th>
                      <th className="p-3 text-center font-semibold">Jml</th>
                      <th className="p-3 text-center font-semibold">Bagian</th>
                      <th className="p-3 text-center font-semibold">Saham Awal</th>
                      {showSahamAkhir && <th className="p-3 text-center font-semibold">Saham Akhir</th>}
                      {result.summary.ashlulMasalahTashih && <th className="p-3 text-center font-semibold">Saham Tashih</th>}
                      <th className="p-3 text-right font-semibold">Jumlah Harta</th>
                      <th className="p-3 text-center font-semibold">%</th>
                  </tr>
              </thead>
              <tbody className="text-gray-700">
                  {result.output.map((share, index) => {
                      const jumlahOrang = result.input.ahliWaris[share.key];
                      return (
                          <tr key={index} className="border-t hover:bg-gray-50">
                              <td className="p-3">
                                  <p className="font-semibold text-gray-900">{share.nama}</p>
                                  <p className="font-arabic text-gray-500">{share.namaAr}</p>
                              </td>
                              <td className="p-3 text-center font-mono">{jumlahOrang}</td>
                              <td className="p-3 text-center">
                                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">{share.bagian}</span>
                              </td>
                              <td className="p-3 text-center font-mono">{share.sahamAwal ?? '-'}</td>
                              {showSahamAkhir && <td className="p-3 text-center font-mono">{share.sahamAkhir ?? '-'}</td>}
                              {result.summary.ashlulMasalahTashih && (
                                  <td className="p-3 text-center font-mono font-bold text-purple-700">
                                      {share.sahamTashih ?? '-'}
                                      {(jumlahOrang > 1 && share.sahamTashih > 0) && (
                                          <span className="text-xs font-normal text-gray-500 block">(@{share.sahamTashih / jumlahOrang})</span>
                                      )}
                                  </td>
                              )}
                              <td className="p-3 text-right font-semibold text-green-700">
                                  {formatRupiah(share.bagianHarta)}
                                  {(jumlahOrang > 1 && share.bagianHarta > 0) && (
                                      <span className="text-xs font-normal text-gray-500 block">({formatRupiah(share.bagianHarta / jumlahOrang)}/org)</span>
                                  )}
                              </td>
                              <td className="p-3 text-center font-mono text-xs">{share.persentase ? share.persentase.toFixed(1) : '0.0'}%</td>
                          </tr>
                      );
                  })}
              </tbody>
              <tfoot className="bg-gray-100 font-bold text-gray-800">
                  <tr className="border-t-2 border-gray-300">
                      <td className="p-3" colSpan={3}>TOTAL</td>
                      <td className="p-3 text-center font-mono">{totalSahamAwal}</td>
                      {showSahamAkhir && <td className="p-3 text-center font-mono">{result.summary.totalSahamAwal}</td>}
                      {result.summary.ashlulMasalahTashih && <td className="p-3 text-center font-mono">{amFinal}</td>}
                      <td className="p-3 text-right">{formatRupiah(result.input.tirkah)}</td>
                      <td className="p-3 text-center font-mono">100%</td>
                  </tr>
              </tfoot>
          </table>
      </div>

      {/* Bagian Langkah Perhitungan */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-3 text-gray-800">📝 Langkah-langkah Perhitungan</h3>
        <div className="space-y-2 font-mono text-xs bg-gray-50 p-4 rounded-md overflow-x-auto">
            {formatNotes(result.langkah_perhitungan).map((note, index) => (
                <p key={index} className={`${note.includes('===') ? 'font-bold text-purple-800 mt-2' : ''}`}>{note.replace(/===/g, '')}</p>
            ))}
        </div>
      </div>
    </div>
  );
}