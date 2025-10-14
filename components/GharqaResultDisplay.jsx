'use client';
import React from 'react';

// =========================================================================
// KOMPONEN UNTUK MENAMPILKAN DETAIL PERHITUNGAN (SEPERTI DI KALKULATOR DASAR)
// =========================================================================
const MiniResultDisplay = ({ result }) => {
    if (!result || !result.summary) return null;

    const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        maximumFractionDigits: 0 
    }).format(value || 0);
    
    // Tentukan kunci saham dan AM yang benar (apakah ada tashih/inkisar atau tidak)
    const sahamAkhirKey = result.summary.ashlulMasalahTashih ? 'sahamTashih' : 'sahamAkhir';
    const amAkhir = result.summary.ashlulMasalahTashih || result.summary.ashlulMasalahAkhir || result.summary.ashlulMasalahAwal;
    const showSahamAkhir = result.summary.ashlulMasalahAwal !== result.summary.ashlulMasalahAkhir;

    // Ambil data jumlah dari input yang digunakan untuk kalkulasi ini
    const heirQuantities = result.input.ahliWaris;

    return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">1</span>
                        </div>
                        <p className="text-sm font-semibold text-blue-700">Ashlul Mas'alah Awal</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-900">{result.summary.ashlulMasalahAwal}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">2</span>
                        </div>
                        <p className="text-sm font-semibold text-purple-700">Ashlul Mas'alah Akhir</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-900">{amAkhir}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">✓</span>
                        </div>
                        <p className="text-sm font-semibold text-green-700">Kasus</p>
                    </div>
                    <p className="text-2xl font-bold text-green-900">{result.summary.kasus}</p>
                </div>
            </div>

            {/* Tabel Rincian */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-3 border-b border-gray-200">
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        Rincian Pembagian
                    </h4>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-3 py-3 text-left font-bold text-gray-700">Ahli Waris</th>
                                <th className="px-3 py-3 text-center font-bold text-gray-700">Jml</th>
                                <th className="px-3 py-3 text-center font-bold text-gray-700">Bagian</th>
                                <th className="px-3 py-3 text-center font-bold text-gray-700">Saham Awal</th>
                                {showSahamAkhir && <th className="px-3 py-3 text-center font-bold text-gray-700">Saham Akhir</th>}
                                {result.summary.ashlulMasalahTashih && <th className="px-3 py-3 text-center font-bold text-gray-700">Saham Tashih</th>}
                                <th className="px-3 py-3 text-right font-bold text-gray-700">Jumlah Harta</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 divide-y divide-gray-100">
                            {result.output.filter(aw => !aw.isMahjub).map((aw, index) => {
                                const jumlahOrang = heirQuantities[aw.key] || 0;
                                const isEven = index % 2 === 0;
                                
                                return (
                                    <tr key={aw.key} className={`hover:bg-green-50 transition-colors ${isEven ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-3 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-sm">{aw.key.includes('lk') ? '👨' : '👩'}</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{aw.nama}</p>
                                                    <p className="font-arabic text-gray-500 text-xs">{aw.namaAr}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-800 rounded-full font-bold text-xs">
                                                {jumlahOrang}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-semibold">
                                                {aw.bagian}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-center font-mono font-semibold text-gray-800 text-sm">
                                            {aw.sahamAwal?.toFixed(2).replace('.00', '') || '-'}
                                        </td>
                                        {showSahamAkhir && (
                                            <td className="px-3 py-3 text-center font-mono font-semibold text-gray-800 text-sm">
                                                {aw.sahamAkhir?.toFixed(2).replace('.00', '') || '-'}
                                            </td>
                                        )}
                                        {result.summary.ashlulMasalahTashih && (
                                            <td className="px-3 py-3 text-center">
                                                <div className="font-mono font-bold text-purple-700 text-sm">
                                                    {aw.sahamTashih?.toFixed(2).replace('.00', '') || '-'}
                                                </div>
                                                {(jumlahOrang > 1 && aw.sahamTashih > 0) && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        (@{(aw.sahamTashih / jumlahOrang).toFixed(2)})
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                        <td className="px-3 py-3 text-right">
                                            <div className="font-bold text-green-700 text-sm">
                                                {formatRupiah(aw.bagianHarta)}
                                            </div>
                                            {(jumlahOrang > 1 && aw.bagianHarta > 0) && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    ({formatRupiah(aw.bagianHarta / jumlahOrang)}/org)
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="bg-gradient-to-r from-gray-100 to-gray-50 border-t-2 border-gray-300">
                            <tr className="font-bold text-gray-900">
                                <td className="px-3 py-3" colSpan={3}>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">TOTAL</span>
                                    </div>
                                </td>
                                <td className="px-3 py-3 text-center font-mono text-sm">{result.summary.ashlulMasalahAwal}</td>
                                {showSahamAkhir && <td className="px-3 py-3 text-center font-mono text-sm">{result.summary.ashlulMasalahAkhir}</td>}
                                {result.summary.ashlulMasalahTashih && <td className="px-3 py-3 text-center font-mono text-sm">{amAkhir}</td>}
                                <td className="px-3 py-3 text-right text-green-700 text-sm">{formatRupiah(result.input.tirkah)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

// =========================================================================
// BAGIAN UTAMA YANG MELAKUKAN LOOPING UNTUK SETIAP MAYIT
// =========================================================================
export default function GharqaResultDisplay({ result }) {
    if (!result || result.length === 0) {
        return (
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📊</span>
                </div>
                <p className="text-gray-600 font-semibold">Tidak ada hasil untuk ditampilkan.</p>
                <p className="text-gray-500 text-sm mt-2">Silakan lengkapi data mayit dan hitung kembali.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Hasil */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">📊</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Hasil Perhitungan Waris</h2>
                            <p className="text-green-100 text-sm mt-1">Setiap mayit dihitung secara terpisah dan tidak saling mewarisi</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loop untuk setiap mayit */}
            {result.map((hasil, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Header per Mayit */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <span className="text-xl">👤</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    {hasil.namaMayit}
                                </h3>
                                <p className="text-blue-100 text-sm">
                                    Total Harta: {new Intl.NumberFormat('id-ID', { 
                                        style: 'currency', 
                                        currency: 'IDR',
                                        maximumFractionDigits: 0 
                                    }).format(hasil.input.tirkah)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Detail Perhitungan */}
                    <div className="p-6">
                        <MiniResultDisplay result={hasil} />
                    </div>
                </div>
            ))}
        </div>
    );
}