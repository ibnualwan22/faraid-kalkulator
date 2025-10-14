'use client';
import JaddWalIkhwahDisplay from './JaddWalIkhwahDisplay';

export default function ResultDisplay({ result }) {
  if (!result) return null;

  const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(value || 0);

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

  return (
    <div className="space-y-6">
      {/* Header Hasil */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Hasil Perhitungan Warisan</h2>
              <p className="text-green-100 text-sm mt-1">Total Harta: {formatRupiah(result.input.tirkah)}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <p className="text-sm font-semibold text-blue-700">Ashlul Mas'alah Awal</p>
              </div>
              <p className="text-3xl font-bold text-blue-900">{result.summary.ashlulMasalahAwal}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <p className="text-sm font-semibold text-purple-700">Ashlul Mas'alah Akhir</p>
              </div>
              <p className="text-3xl font-bold text-purple-900">{amFinal}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <p className="text-sm font-semibold text-green-700">Kasus</p>
              </div>
              <p className="text-2xl font-bold text-green-900">{result.summary.kasus}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jadd Wal Ikhwah Display */}
      {result.detailKasus?.jadd_wal_ikhwah?.simulasi && (
        <JaddWalIkhwahDisplay 
          data={result.detailKasus.jadd_wal_ikhwah}
          ahliWaris={result.output.filter(aw => !aw.isMahjub)}
        />
      )}
      
      {/* Tabel Hasil */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Rincian Pembagian Warisan
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-4 text-left font-bold text-gray-700">Ahli Waris</th>
                <th className="px-4 py-4 text-center font-bold text-gray-700">Jml</th>
                <th className="px-4 py-4 text-center font-bold text-gray-700">Bagian</th>
                <th className="px-4 py-4 text-center font-bold text-gray-700">Saham Awal</th>
                {showSahamAkhir && <th className="px-4 py-4 text-center font-bold text-gray-700">Saham Akhir</th>}
                {result.summary.ashlulMasalahTashih && <th className="px-4 py-4 text-center font-bold text-gray-700">Saham Tashih</th>}
                <th className="px-4 py-4 text-right font-bold text-gray-700">Jumlah Harta</th>
                <th className="px-4 py-4 text-center font-bold text-gray-700">Persentase</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {result.output.map((share, index) => {
                const jumlahOrang = result.input.ahliWaris[share.key];
                const isEven = index % 2 === 0;
                
                return (
                  <tr key={index} className={`hover:bg-green-50 transition-colors ${isEven ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">{share.key.includes('lk') ? '👨' : '👩'}</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{share.nama}</p>
                          <p className="font-arabic text-gray-500 text-xs">{share.namaAr}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-bold text-sm">
                        {jumlahOrang}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-block px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-semibold">
                        {share.bagian}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center font-mono font-semibold text-gray-800">
                      {share.sahamAwal ?? '-'}
                    </td>
                    {showSahamAkhir && (
                      <td className="px-4 py-4 text-center font-mono font-semibold text-gray-800">
                        {share.sahamAkhir ?? '-'}
                      </td>
                    )}
                    {result.summary.ashlulMasalahTashih && (
                      <td className="px-4 py-4 text-center">
                        <div className="font-mono font-bold text-purple-700">
                          {share.sahamTashih ?? '-'}
                        </div>
                        {(jumlahOrang > 1 && share.sahamTashih > 0) && (
                          <div className="text-xs text-gray-500 mt-1">
                            (@{(share.sahamTashih / jumlahOrang).toFixed(2)})
                          </div>
                        )}
                      </td>
                    )}
                    <td className="px-4 py-4 text-right">
                      <div className="font-bold text-green-700 text-base">
                        {formatRupiah(share.bagianHarta)}
                      </div>
                      {(jumlahOrang > 1 && share.bagianHarta > 0) && (
                        <div className="text-xs text-gray-500 mt-1">
                          ({formatRupiah(share.bagianHarta / jumlahOrang)}/orang)
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <div className="w-12 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${share.persentase || 0}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-xs font-semibold text-gray-700">
                          {share.persentase ? share.persentase.toFixed(1) : '0.0'}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gradient-to-r from-gray-100 to-gray-50 border-t-2 border-gray-300">
              <tr className="font-bold text-gray-900">
                <td className="px-4 py-4" colSpan={3}>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    TOTAL
                  </div>
                </td>
                <td className="px-4 py-4 text-center font-mono text-base">{totalSahamAwal}</td>
                {showSahamAkhir && <td className="px-4 py-4 text-center font-mono text-base">{result.summary.totalSahamAwal}</td>}
                {result.summary.ashlulMasalahTashih && <td className="px-4 py-4 text-center font-mono text-base">{amFinal}</td>}
                <td className="px-4 py-4 text-right text-green-700 text-lg">{formatRupiah(result.input.tirkah)}</td>
                <td className="px-4 py-4 text-center font-mono text-base">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Langkah-langkah Perhitungan */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-white px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Langkah-langkah Perhitungan
          </h3>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="space-y-3 font-mono text-xs overflow-x-auto">
              {formatNotes(result.langkah_perhitungan).map((note, index) => (
                <div key={index}>
                  {note.includes('LANGKAH') ? (
                    <div className="flex items-center gap-2 mt-4 mb-2">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {note.match(/LANGKAH (\d+)/)?.[1] || '?'}
                      </div>
                      <p className="font-bold text-purple-800 text-sm">
                        {note.replace(/LANGKAH \d+: /, '')}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-700 pl-8 leading-relaxed">
                      {note.startsWith('  ') ? '• ' + note.trim() : note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}