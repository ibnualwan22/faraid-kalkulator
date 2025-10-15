"use client";

import React, { useState } from 'react';
import { Users, Filter } from 'lucide-react';

export default function DaftarAhliWarisPage() {
    const [filterGender, setFilterGender] = useState('semua'); // 'semua', 'laki', 'perempuan'

    const ahliWarisData = {
        pasangan: {
            laki: [{ nama: "Suami", arab: "الزَّوْج" }],
            perempuan: [{ nama: "Istri", arab: "الزَّوْجَة" }]
        },
        generasiAtas: {
            laki: [
                { nama: "Ayah", arab: "الأَب" },
                { nama: "Kakek (dari Ayah)", arab: "الجَدّ" }
            ],
            perempuan: [
                { nama: "Ibu", arab: "الأُمّ" },
                { nama: "Nenek dari Pihak Ibu", arab: "الجَدَّة مِن الأُمّ" },
                { nama: "Nenek dari Pihak Ayah", arab: "الجَدَّة مِن الأَب" }
            ]
        },
        generasiBawah: {
            laki: [
                { nama: "Anak Laki-laki", arab: "الإِبْن" },
                { nama: "Cucu Laki-laki (dari Anak Lk)", arab: "إِبْن الإِبْن" }
            ],
            perempuan: [
                { nama: "Anak Perempuan", arab: "البِنْت" },
                { nama: "Cucu Perempuan (dari Anak Lk)", arab: "بِنْت الإِبْن" }
            ]
        },
        saudara: {
            laki: [
                { nama: "Saudara Laki-laki Kandung", arab: "الأَخ الشَّقِيْق" },
                { nama: "Saudara Laki-laki Seayah", arab: "الأَخ لِأَب" },
                { nama: "Saudara Laki-laki Seibu", arab: "الأَخ لِأُمّ" }
            ],
            perempuan: [
                { nama: "Saudari Kandung", arab: "الأُخْت الشَّقِيْقَة" },
                { nama: "Saudari Seayah", arab: "الأُخْت لِأَب" },
                { nama: "Saudari Seibu", arab: "الأُخْت لِأُمّ" }
            ]
        },
        keponakan: {
            laki: [
                { nama: "Keponakan Laki-laki (dari Saudara Lk Kandung)", arab: "إِبْن الأَخ الشَّقِيْق" },
                { nama: "Keponakan Laki-laki (dari Saudara Lk Seayah)", arab: "إِبْن الأَخ لِأَب" }
            ],
            perempuan: []
        },
        paman: {
            laki: [
                { nama: "Paman Kandung (Saudara Ayah)", arab: "العَمّ الشَّقِيْق" },
                { nama: "Paman Seayah (Saudara Ayah)", arab: "العَمّ لِأَب" }
            ],
            perempuan: []
        },
        sepupu: {
            laki: [
                { nama: "Sepupu Laki-laki (dari Paman Kandung)", arab: "إِبْن العَمّ الشَّقِيْق" },
                { nama: "Sepupu Laki-laki (dari Paman Seayah)", arab: "إِبْن العَمّ لِأَب" }
            ],
            perempuan: []
        },
        lainnya: {
            laki: [{ nama: "Laki-laki yang Memerdekakan Budak", arab: "المُعْتِق" }],
            perempuan: [{ nama: "Perempuan yang Memerdekakan Budak", arab: "المُعْتِقَة" }]
        }
    };

    const dzawilArhamData = [
        {
            kategori: "من جهة البنوة",
            judul: "Dari Arah Anak",
            items: [
                { nama: "Anak laki-laki dari anak perempuan", arab: "بنات الأعمام" },
                { nama: "Anak perempuan dari anak perempuan", arab: "بنات الأخوة" },
                { nama: "Cucu dari anak perempuan", arab: "أولاد بنات" }
            ]
        },
        {
            kategori: "من جهة الأبوة",
            judul: "Dari Arah Ayah",
            items: [
                { nama: "Kakek dari pihak Ibu", arab: "جد ساقط" },
                { nama: "Saudara perempuan dari Ayah", arab: "عمات" },
                { nama: "Anak dari saudara perempuan", arab: "أولاد أخوات" }
            ]
        },
        {
            kategori: "من جهة الأمومة",
            judul: "Dari Arah Ibu",
            items: [
                { nama: "Saudara laki-laki dari Ibu (Paman dari Ibu)", arab: "أخوال" },
                { nama: "Saudara perempuan dari Ibu (Bibi dari Ibu)", arab: "خالات" },
                { nama: "Bapak dari Ibu (Kakek dari Ibu)", arab: "أبو أخوة لأم" },
                { nama: "Keluarga dari pihak Ibu", arab: "بنو أخوة لأم" }
            ]
        }
    ];

    const penghalangWaris = [
        {
            judul: "Perbudakan",
            arab: "الرِّقُّ",
            deskripsi: "Seorang budak tidak dapat mewarisi atau diwarisi karena ia dan seluruh hartanya adalah milik tuannya. Status perbudakan menghilangkan hak kepemilikan pribadi."
        },
        {
            judul: "Pembunuhan",
            arab: "الْقَتْلُ",
            deskripsi: "Seseorang yang membunuh pewaris (baik disengaja maupun tidak) tidak berhak mendapatkan warisan darinya. Kaidah ini bertujuan untuk mencegah tindakan kejahatan demi memperoleh harta warisan."
        },
        {
            judul: "Perbedaan Agama",
            arab: "اخْتِلَافُ الدِّيْنِ",
            deskripsi: "Seorang Muslim tidak mewarisi dari orang non-Muslim, dan sebaliknya, seorang non-Muslim tidak mewarisi dari orang Muslim. Ini didasarkan pada hadits Nabi Muhammad SAW."
        }
    ];

    const renderAhliWaris = (data, gender) => {
        if (!data || data.length === 0) return null;
        return data.map((ahli, idx) => (
            <div key={idx} className="bg-white border-2 border-emerald-600 rounded-lg p-3 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-sm font-semibold text-gray-800">{ahli.nama}</div>
                <div className="text-xs text-emerald-700 mt-1 font-arabic">{ahli.arab}</div>
            </div>
        ));
    };

    const shouldShowCategory = (kategori) => {
        const hasLaki = kategori.laki && kategori.laki.length > 0;
        const hasPerempuan = kategori.perempuan && kategori.perempuan.length > 0;
        
        if (filterGender === 'semua') return hasLaki || hasPerempuan;
        if (filterGender === 'laki') return hasLaki;
        if (filterGender === 'perempuan') return hasPerempuan;
        return false;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
                
                {/* Header */}
                <div className="text-center bg-emerald-600 text-white rounded-2xl p-8 shadow-xl">
                    <div className="flex justify-center mb-4">
                        <Users className="w-16 h-16" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-3">دفتر أهل الوارث</h1>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Daftar Ahli Waris</h2>
                    <p className="text-emerald-100 text-sm md:text-base max-w-2xl mx-auto">
                        Referensi mengenai siapa saja yang berhak dan terhalang menerima warisan dalam Islam
                    </p>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-emerald-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Filter className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-lg text-gray-800">Filter Ahli Waris</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setFilterGender('semua')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                filterGender === 'semua'
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => setFilterGender('laki')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                filterGender === 'laki'
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Laki-laki (15)
                        </button>
                        <button
                            onClick={() => setFilterGender('perempuan')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                filterGender === 'perempuan'
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Perempuan (10)
                        </button>
                    </div>
                </div>

                {/* Family Tree */}
<div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 rounded-xl shadow-2xl p-6 md:p-10 border-2 border-emerald-300">
    <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            25 Ahli Waris Utama
        </h2>
        <p className="text-gray-600 text-sm">Struktur Hierarki Keluarga dalam Hukum Waris Islam</p>
    </div>

    <div className="relative overflow-x-auto pb-8">
        <div className="min-w-[900px] mx-auto" style={{ width: 'fit-content' }}>
            
            {/* Level 1: Kakek Nenek */}
            {(filterGender === 'semua' || filterGender === 'laki' || filterGender === 'perempuan') && (
                <div className="flex justify-center gap-6 mb-6">
                    <div className="flex gap-6">
                        {/* Nenek dari Ibu */}
                        {(filterGender === 'semua' || filterGender === 'perempuan') && (
                            <div className="flex flex-col items-center group">
                                <div className="relative">
                                    <div className="w-28 h-28 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl">
                                        <div className="text-center">
                                            <div className="text-sm text-white font-bold">Nenek</div>
                                            <div className="text-xs text-pink-100">(dari Ibu)</div>
                                        </div>
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                        Gen 1
                                    </div>
                                </div>
                                <div className="text-sm mt-2 text-pink-700 font-arabic font-semibold">الجَدَّة</div>
                                <div className="text-xs text-gray-600 mt-1 bg-pink-100 px-2 py-1 rounded-full">Generasi Atas</div>
                            </div>
                        )}
                        {/* Kakek dari Ayah */}
                        {(filterGender === 'semua' || filterGender === 'laki') && (
                            <div className="flex flex-col items-center group">
                                <div className="relative">
                                    <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl">
                                        <div className="text-center">
                                            <div className="text-sm text-white font-bold">Kakek</div>
                                            <div className="text-xs text-blue-100">(dari Ayah)</div>
                                        </div>
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                        Gen 1
                                    </div>
                                </div>
                                <div className="text-sm mt-2 text-blue-700 font-arabic font-semibold">الجَدّ</div>
                                <div className="text-xs text-gray-600 mt-1 bg-blue-100 px-2 py-1 rounded-full">Generasi Atas</div>
                            </div>
                        )}
                        {/* Nenek dari Ayah */}
                        {(filterGender === 'semua' || filterGender === 'perempuan') && (
                            <div className="flex flex-col items-center group">
                                <div className="relative">
                                    <div className="w-28 h-28 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl">
                                        <div className="text-center">
                                            <div className="text-sm text-white font-bold">Nenek</div>
                                            <div className="text-xs text-pink-100">(dari Ayah)</div>
                                        </div>
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                        Gen 1
                                    </div>
                                </div>
                                <div className="text-sm mt-2 text-pink-700 font-arabic font-semibold">الجَدَّة</div>
                                <div className="text-xs text-gray-600 mt-1 bg-pink-100 px-2 py-1 rounded-full">Generasi Atas</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Connecting Line Level 1 to 2 */}
            {(filterGender === 'semua' || filterGender === 'laki' || filterGender === 'perempuan') && (
                <div className="flex justify-center mb-6">
                    <div className="w-1 h-12 bg-gradient-to-b from-emerald-600 to-emerald-400 rounded-full shadow-md"></div>
                </div>
            )}

            {/* Level 2: Orang Tua & Paman */}
            <div className="flex justify-center gap-10 mb-6">
                {/* Paman Kandung & Seayah */}
                {(filterGender === 'semua' || filterGender === 'laki') && (
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center group">
                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                                    <div className="text-center">
                                        <div className="text-xs text-white font-bold">Paman</div>
                                        <div className="text-xs text-cyan-100">Seayah</div>
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-orange-400 text-orange-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    Gen 2
                                </div>
                            </div>
                            <div className="text-xs mt-2 text-cyan-700 font-arabic font-semibold">العَمّ</div>
                            <div className="text-xs text-gray-600 mt-1 bg-cyan-100 px-2 py-0.5 rounded-full">Paman</div>
                        </div>
                        <div className="flex flex-col items-center group">
                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                                    <div className="text-center">
                                        <div className="text-xs text-white font-bold">Paman</div>
                                        <div className="text-xs text-cyan-100">Kandung</div>
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-orange-400 text-orange-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    Gen 2
                                </div>
                            </div>
                            <div className="text-xs mt-2 text-cyan-700 font-arabic font-semibold">العَمّ</div>
                            <div className="text-xs text-gray-600 mt-1 bg-cyan-100 px-2 py-0.5 rounded-full">Paman</div>
                        </div>
                    </div>
                )}

                {/* Ibu & Ayah */}
                <div className="flex gap-5">
                    {(filterGender === 'semua' || filterGender === 'perempuan') && (
                        <div className="flex flex-col items-center group">
                            <div className="relative">
                                <div className="w-32 h-32 bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                                    <div className="text-center">
                                        <div className="text-lg text-white font-bold">Ibu</div>
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-orange-400 text-orange-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    Gen 2
                                </div>
                            </div>
                            <div className="text-sm mt-2 text-pink-700 font-arabic font-bold">الأُمّ</div>
                            <div className="text-xs text-gray-600 mt-1 bg-pink-100 px-3 py-1 rounded-full font-semibold">Orang Tua</div>
                        </div>
                    )}
                    {(filterGender === 'semua' || filterGender === 'laki') && (
                        <div className="flex flex-col items-center group">
                            <div className="relative">
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                                    <div className="text-center">
                                        <div className="text-lg text-white font-bold">Ayah</div>
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-orange-400 text-orange-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    Gen 2
                                </div>
                            </div>
                            <div className="text-sm mt-2 text-blue-700 font-arabic font-bold">الأَب</div>
                            <div className="text-xs text-gray-600 mt-1 bg-blue-100 px-3 py-1 rounded-full font-semibold">Orang Tua</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Connecting Line Level 2 to 3 */}
            <div className="flex justify-center mb-6">
                <div className="w-1 h-12 bg-gradient-to-b from-emerald-400 to-red-400 rounded-full shadow-md"></div>
            </div>

            {/* Level 3: Saudara & SI MAYIT dengan Pasangan */}
            <div className="flex justify-center items-center gap-10 mb-6">
                {/* Saudara Kandung/Seayah/Seibu */}
                {(filterGender === 'semua' || filterGender === 'laki' || filterGender === 'perempuan') && (
                    <div className="flex gap-2">
                        {(filterGender === 'semua' || filterGender === 'perempuan') && (
                            <>
                                <div className="flex flex-col items-center group">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg border-3 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                            <div className="text-center">
                                                <div className="text-xs text-white font-bold">Saudari</div>
                                                <div className="text-xs text-purple-100">Seibu</div>
                                            </div>
                                        </div>
                                        <div className="absolute -top-2 -right-2 bg-green-400 text-green-900 text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                                            3
                                        </div>
                                    </div>
                                    <div className="text-xs mt-1 text-purple-700 font-arabic">الأُخْت</div>
                                </div>
                                <div className="flex flex-col items-center group">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border-3 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                            <div className="text-center">
                                                <div className="text-xs text-white font-bold">Saudari</div>
                                                <div className="text-xs text-purple-100">Seayah</div>
                                            </div>
                                        </div>
                                        <div className="absolute -top-2 -right-2 bg-green-400 text-green-900 text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                                            3
                                        </div>
                                    </div>
                                    <div className="text-xs mt-1 text-purple-700 font-arabic">الأُخْت</div>
                                </div>
                                <div className="flex flex-col items-center group">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg border-3 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                            <div className="text-center">
                                                <div className="text-xs text-white font-bold">Saudari</div>
                                                <div className="text-xs text-purple-100">Kandung</div>
                                            </div>
                                        </div>
                                        <div className="absolute -top-2 -right-2 bg-green-400 text-green-900 text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                                            3
                                        </div>
                                    </div>
                                    <div className="text-xs mt-1 text-purple-700 font-arabic">الأُخْت</div>
                                </div>
                            </>
                        )}
                        {(filterGender === 'semua' || filterGender === 'laki') && (
                            <>
                                <div className="flex flex-col items-center group">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg border-3 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                            <div className="text-center">
                                                <div className="text-xs text-white font-bold">Saudara</div>
                                                <div className="text-xs text-indigo-100">Seibu</div>
                                            </div>
                                        </div>
                                        <div className="absolute -top-2 -right-2 bg-green-400 text-green-900 text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                                            3
                                        </div>
                                    </div>
                                    <div className="text-xs mt-1 text-indigo-700 font-arabic">الأَخ</div>
                                </div>
                                <div className="flex flex-col items-center group">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg border-3 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                            <div className="text-center">
                                                <div className="text-xs text-white font-bold">Saudara</div>
                                                <div className="text-xs text-indigo-100">Seayah</div>
                                            </div>
                                        </div>
                                        <div className="absolute -top-2 -right-2 bg-green-400 text-green-900 text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                                            3
                                        </div>
                                    </div>
                                    <div className="text-xs mt-1 text-indigo-700 font-arabic">الأَخ</div>
                                </div>
                                <div className="flex flex-col items-center group">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg border-3 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                            <div className="text-center">
                                                <div className="text-xs text-white font-bold">Saudara</div>
                                                <div className="text-xs text-indigo-100">Kandung</div>
                                            </div>
                                        </div>
                                        <div className="absolute -top-2 -right-2 bg-green-400 text-green-900 text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                                            3
                                        </div>
                                    </div>
                                    <div className="text-xs mt-1 text-indigo-700 font-arabic">الأَخ</div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* SI MAYIT dengan SUAMI/ISTRI */}
                <div className="flex items-center gap-6">
                    {(filterGender === 'semua' || filterGender === 'perempuan') && (
                        <div className="flex flex-col items-center group">
                            <div className="relative">
                                <div className="w-28 h-28 bg-gradient-to-br from-pink-600 to-pink-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-300 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                                    <div className="text-center">
                                        <div className="text-base text-white font-bold">Istri</div>
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    Pasangan
                                </div>
                            </div>
                            <div className="text-sm mt-2 text-pink-700 font-arabic font-bold">الزَّوْجَة</div>
                        </div>
                    )}
                    
                    <div className="flex flex-col items-center relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative w-40 h-40 bg-gradient-to-br from-red-600 via-red-500 to-red-700 rounded-full flex items-center justify-center shadow-2xl border-8 border-yellow-400 transform transition-all duration-300 hover:scale-110 hover:rotate-6">
                            <div className="text-center">
                                <div className="text-xl text-white font-bold mb-1">SI MAYIT</div>
                                <div className="text-sm text-yellow-200 font-semibold">المَيِّت</div>
                            </div>
                        </div>
                        <div className="text-sm mt-3 text-red-700 font-arabic font-bold bg-yellow-100 px-4 py-2 rounded-full shadow-md">
                            الميت
                        </div>
                    </div>

                    {(filterGender === 'semua' || filterGender === 'laki') && (
                        <div className="flex flex-col items-center group">
                            <div className="relative">
                                <div className="w-28 h-28 bg-gradient-to-br from-blue-700 to-blue-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-300 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                                    <div className="text-center">
                                        <div className="text-base text-white font-bold">Suami</div>
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    Pasangan
                                </div>
                            </div>
                            <div className="text-sm mt-2 text-blue-700 font-arabic font-bold">الزَّوْج</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Connecting Line Level 3 to 4 */}
            <div className="flex justify-center mb-6">
                <div className="w-1 h-12 bg-gradient-to-b from-red-400 to-emerald-400 rounded-full shadow-md"></div>
            </div>

            {/* Level 4: Anak & Keponakan */}
            <div className="flex justify-center gap-10 mb-6">
                {/* Keponakan */}
                {(filterGender === 'semua' || filterGender === 'laki') && (
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center group">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg border-3 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                    <div className="text-center">
                                        <div className="text-xs text-white font-bold">Keponakan</div>
                                        <div className="text-xs text-teal-100">Seayah</div>
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-purple-400 text-purple-900 text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                                    4
                                </div>
                            </div>
                            <div className="text-xs mt-1 text-teal-700 font-arabic">إِبْن الأَخ</div>
                        </div>
                        <div className="flex flex-col items-center group">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg border-3 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                    <div className="text-center">
                                        <div className="text-xs text-white font-bold">Keponakan</div>
                                        <div className="text-xs text-teal-100">Kandung</div>
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-purple-400 text-purple-900 text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                                    4
                                </div>
                            </div>
                            <div className="text-xs mt-1 text-teal-700 font-arabic">إِبْن الأَخ</div>
                        </div>
                    </div>
                )}

                {/* Anak Laki & Perempuan */}
                <div className="flex gap-5">
                    {(filterGender === 'semua' || filterGender === 'perempuan') && (
                        <div className="flex flex-col items-center group">
                            <div className="relative">
                                <div className="w-28 h-28 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                                    <div className="text-center">
                                        <div className="text-sm text-white font-bold">Anak</div>
                                        <div className="text-xs text-rose-100">Perempuan</div>
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-purple-400 text-purple-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    Gen 4
                                </div>
                            </div>
                            <div className="text-sm mt-2 text-rose-700 font-arabic font-bold">البِنْت</div>
                            <div className="text-xs text-gray-600 mt-1 bg-rose-100 px-3 py-1 rounded-full font-semibold">Anak</div>
                        </div>
                    )}
                    {(filterGender === 'semua' || filterGender === 'laki') && (
                        <div className="flex flex-col items-center group">
                            <div className="relative">
                                <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                                    <div className="text-center">
                                        <div className="text-sm text-white font-bold">Anak</div>
                                        <div className="text-xs text-blue-100">Laki-laki</div>
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-purple-400 text-purple-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    Gen 4
                                </div>
                            </div>
                            <div className="text-sm mt-2 text-blue-700 font-arabic font-bold">الإِبْن</div>
                            <div className="text-xs text-gray-600 mt-1 bg-blue-100 px-3 py-1 rounded-full font-semibold">Anak</div>
                        </div>
                    )}
                </div>

                {/* Sepupu */}
                {(filterGender === 'semua' || filterGender === 'laki') && (
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center group">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center shadow-lg border-3 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                    <div className="text-center">
                                        <div className="text-xs text-white font-bold">Sepupu</div>
                                        <div className="text-xs text-lime-100">Seayah</div>
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-purple-400 text-purple-900 text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                                    4
                                </div>
                            </div>
                            <div className="text-xs mt-1 text-lime-700 font-arabic">إِبْن العَمّ</div>
                        </div>
                        <div className="flex flex-col items-center group">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-lime-500 to-lime-600 rounded-xl flex items-center justify-center shadow-lg border-3 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                    <div className="text-center">
                                        <div className="text-xs text-white font-bold">Sepupu</div>
                                        <div className="text-xs text-lime-100">Kandung</div>
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-purple-400 text-purple-900 text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                                    4
                                </div>
                            </div>
                            <div className="text-xs mt-1 text-lime-700 font-arabic">إِبْن العَمّ</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Connecting Line Level 4 to 5 */}
            <div className="flex justify-center mb-6">
                <div className="w-1 h-12 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full shadow-md"></div>
            </div>

            {/* Level 5: Cucu */}
            <div className="flex justify-center gap-5">
                {(filterGender === 'semua' || filterGender === 'perempuan') && (
                    <div className="flex flex-col items-center group">
                        <div className="relative">
                            <div className="w-28 h-28 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                                <div className="text-center">
                                    <div className="text-sm text-white font-bold">Cucu</div>
                                    <div className="text-xs text-pink-100">Perempuan</div>
                                </div>
                            </div>
                            <div className="absolute -top-2 -right-2 bg-red-400 text-red-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                Gen 5
                            </div>
                        </div>
                        <div className="text-sm mt-2 text-pink-700 font-arabic font-semibold">بِنْت الإِبْن</div>
                        <div className="text-xs text-gray-600 mt-1 bg-pink-100 px-2 py-1 rounded-full">Generasi Bawah</div>
                    </div>
                )}
                {(filterGender === 'semua' || filterGender === 'laki') && (
                    <div className="flex flex-col items-center group">
                        <div className="relative">
                            <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                                <div className="text-center">
                                    <div className="text-sm text-white font-bold">Cucu</div>
                                    <div className="text-xs text-blue-100">Laki-laki</div>
                                </div>
                            </div>
                            <div className="absolute -top-2 -right-2 bg-red-400 text-red-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                Gen 5
                            </div>
                        </div>
                        <div className="text-sm mt-2 text-blue-700 font-arabic font-semibold">إِبْن الإِبْن</div>
                        <div className="text-xs text-gray-600 mt-1 bg-blue-100 px-2 py-1 rounded-full">Generasi Bawah</div>
                    </div>
                )}
            </div>

            {/* Lainnya - Memerdekakan Budak */}
            {(filterGender === 'semua' || filterGender === 'laki' || filterGender === 'perempuan') && (
                <div className="mt-16 pt-8 border-t-4 border-emerald-300 border-dashed">
                    <div className="text-center mb-6">
                        <div className="inline-block bg-gradient-to-r from-emerald-100 to-emerald-200 px-6 py-3 rounded-2xl shadow-lg border-2 border-emerald-400">
                            <h3 className="font-bold text-emerald-800 text-lg mb-1">المعتق</h3>
                            <p className="text-sm text-emerald-700">Yang Memerdekakan Budak</p>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6">
                        {(filterGender === 'semua' || filterGender === 'laki') && (
                            <div className="flex flex-col items-center group">
                                <div className="relative">
                                    <div className="w-28 h-28 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                                        <div className="text-center">
                                            <div className="text-sm text-white font-bold">Laki-laki</div>
                                            <div className="text-xs text-green-100">Memerdekakan</div>
                                        </div>
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                        Khusus
                                    </div>
                                </div>
                                <div className="text-sm mt-2 text-green-700 font-arabic font-bold">المُعْتِق</div>
                                <div className="text-xs text-gray-600 mt-1 bg-green-100 px-3 py-1 rounded-full">Al-Mutiq</div>
                            </div>
                        )}
                        {(filterGender === 'semua' || filterGender === 'perempuan') && (
                            <div className="flex flex-col items-center group">
                                <div className="relative">
                                    <div className="w-28 h-28 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                                        <div className="text-center">
                                            <div className="text-sm text-white font-bold">Perempuan</div>
                                            <div className="text-xs text-emerald-100">Memerdekakan</div>
                                        </div>
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                        Khusus
                                    </div>
                                </div>
                                <div className="text-sm mt-2 text-emerald-700 font-arabic font-bold">المُعْتِقَة</div>
                                <div className="text-xs text-gray-600 mt-1 bg-emerald-100 px-3 py-1 rounded-full">Al-Mutiqah</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    </div>
    
    {/* Legend */}
    <div className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border-2 border-emerald-300">
        <h3 className="font-bold text-center text-emerald-800 mb-4 text-lg">Keterangan Warna & Badge</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full border-2 border-white shadow"></div>
                <span className="text-gray-700">Laki-laki</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full border-2 border-white shadow"></div>
                <span className="text-gray-700">Perempuan</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-red-600 to-red-700 rounded-full border-2 border-yellow-400 shadow"></div>
                <span className="text-gray-700">Si Mayit</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow">Gen</div>
                <span className="text-gray-700">Generasi</span>
            </div>
        </div>
    </div>
</div>

                

                {/* Dzawil Arham */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-emerald-200">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-2">ذَوُو الأَرْحَامِ</h2>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800">Dzawil Arham</h3>
                    </div>
                    
                    <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-6 mb-6">
                        <p className="text-gray-700 leading-relaxed text-center">
                            Jika tidak ada <span className="font-bold">ذوي الفروض</span> atau ahli waris <span className="font-bold">عصبة</span> maka harta warisan 
                            dibagikan kepada <span className="font-bold text-emerald-700">ذوي الأرحام</span> dengan menyamakan bagian kerabatnya yang 
                            menjadi <span className="font-bold">ذوي الفروض</span>.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {dzawilArhamData.map((kategori, idx) => (
                            <div key={idx} className="border-2 border-emerald-300 rounded-lg p-5 bg-gradient-to-br from-emerald-50 to-white">
                                <div className="text-center mb-4 pb-3 border-b-2 border-emerald-300">
                                    <div className="text-lg font-bold text-emerald-800 font-arabic mb-1">{kategori.kategori}</div>
                                    <div className="text-sm font-semibold text-gray-700">{kategori.judul}</div>
                                </div>
                                <div className="space-y-3">
                                    {kategori.items.map((item, itemIdx) => (
                                        <div key={itemIdx} className="bg-white rounded-lg p-3 shadow-sm border border-emerald-200">
                                            <div className="text-xs text-emerald-700 font-arabic mb-1">{item.arab}</div>
                                            <div className="text-sm text-gray-800">{item.nama}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Penghalang Warisan */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-emerald-200">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-2">مَوَانِعُ الإِرْثِ</h2>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800">Penghalang Warisan</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        {penghalangWaris.map((item, idx) => (
                            <div key={idx} className="border-2 border-red-300 rounded-lg p-6 bg-gradient-to-br from-red-50 to-white hover:shadow-xl transition-shadow">
                                <div className="text-center mb-4">
                                    <div className="text-xl font-bold text-red-700 font-arabic mb-1">{item.arab}</div>
                                    <h4 className="text-lg font-bold text-red-600">{item.judul}</h4>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{item.deskripsi}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-600 text-sm py-6">
                    <p>Referensi: Kitab Fiqih Mawaris - Hukum Waris Islam</p>
                </div>

            </div>
        </div>
    );
}