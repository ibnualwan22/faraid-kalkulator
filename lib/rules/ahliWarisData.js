/**
 * Basis Data Aturan Faraid Lengkap (25 Ahli Waris).
 * Setiap ahli waris memiliki properti yang menjelaskan bagian, syarat, dan logika pengecekan.
 * 'state' yang diterima fungsi check memiliki properti:
 * - state.has(key): Cek keberadaan seorang ahli waris (e.g., state.has('anak_lk')).
 * - state.count.nama_ahli_waris: Menghitung jumlah ahli waris (e.g., state.count.anak_pr).
 * - state.hasFuru(), state.hasFuruLaki(), state.hasFuruPerempuan(): Cek keberadaan keturunan.
 * - state.hasUshulLaki(): Cek keberadaan Ayah/Kakek.
 * - state.isAshabahMaalGhair(key): Cek apakah saudari menjadi ashabah ma'al ghair.
 */

// =================================================================================
// ⚜️ DATABASE UTAMA ATURAN AHLI WARIS
// =================================================================================
export const ahliWarisData = {
    // ================== GOLONGAN LAKI-LAKI ==================
    'suami': {
        name: 'Suami', nameAr: 'زوج', gender: 'L', type: 'dzawil_furudh',
        category: 'Suami/Istri',
        conditions: [
            { bagian: '1/4', syarat: "Mayit memiliki Furu' (keturunan: anak/cucu).", check: (state) => state.hasFuru() },
            { bagian: '1/2', syarat: "Mayit tidak memiliki Furu'.", check: (state) => !state.hasFuru() }
        ]
    },
   'anak_lk': {
    name: 'Anak Laki-laki', nameAr: 'ابن', gender: 'L', type: 'ashabah',
    category: 'Keturunan',
    conditions: [
        { bagian: 'ashabah_bilghair', syarat: "Menjadi Ashabah بالغير bersama Anak Perempuan.", check: (state) => state.has('anak_pr') },
        { bagian: 'ashabah_binafsih', syarat: "Menjadi Ashabah بنفسه karena tidak ada Anak Perempuan.", check: (state) => !state.has('anak_pr') }
    ]
},
    'cucu_lk': {
        name: 'Cucu Laki-laki (dari Anak Lk)', nameAr: 'ابن الإبن', gender: 'L', type: 'ashabah',
        category: 'Keturunan',
        conditions: [
        { bagian: 'mahjub', syarat: "Terhalang oleh Anak Laki-laki.", check: (state) => state.has('anak_lk') },
        { bagian: 'ashabah_bilghair', syarat: "Menjadi Ashabah بالغير bersama Cucu Perempuan.", check: (state) => state.has('cucu_pr') },
        { bagian: 'ashabah_binafsih', syarat: "Menjadi Ashabah بنفسه.", check: (state) => !state.has('cucu_pr') }
    ]
},
    'ayah': {
        name: 'Ayah', nameAr: 'أب', gender: 'L', type: 'dzawil_furudh_ashabah',
        category: 'Orang Tua',
        conditions: [
            { bagian: '1/6', syarat: "Ada Furu' laki-laki (anak/cucu lk).", check: (state) => state.hasFuruLaki() },
            { bagian: '1/6 + ashabah', syarat: "Hanya ada Furu' perempuan (anak/cucu pr).", check: (state) => state.hasFuruPerempuan() && !state.hasFuruLaki() },
            { bagian: 'ashabah_binafsih', syarat: "Tidak ada Furu' sama sekali.", check: (state) => !state.hasFuru() }
        ]
    },
    'kakek': {
        name: 'Kakek (dari Ayah)', nameAr: 'أب الأب', gender: 'L', type: 'dzawil_furudh_ashabah',
        category: 'Orang Tua',
        conditions: [
            { bagian: 'mahjub', syarat: "Terhalang oleh Ayah.", check: (state) => state.has('ayah') },
            { bagian: 'jadd_ikhwah_case', syarat: "Bersama saudara/i, perhitungannya masuk kasus khusus Jadd wal Ikhwah.", check: (state) => !state.has('ayah') && !state.hasFuruLaki() && state.hasSaudara() },
            { bagian: '1/6', syarat: "Ada Furu' laki-laki dan tidak ada Ayah.", check: (state) => !state.has('ayah') && state.hasFuruLaki() },
            { bagian: '1/6 + ashabah', syarat: "Hanya ada Furu' perempuan, tidak ada Ayah.", check: (state) => !state.has('ayah') && state.hasFuruPerempuan() && !state.hasFuruLaki() },
            { bagian: 'ashabah_binafsih', syarat: "Tidak ada Furu' dan Ayah. (Akan diperhitungkan bersama saudara jika ada).", check: (state) => !state.has('ayah') && !state.hasFuru() }
        ]
    },
    'saudara_lk_kandung': {
        name: 'Saudara Laki-laki Kandung', nameAr: 'أخ لأبوين', gender: 'L', type: 'ashabah',
        category: 'Saudara',
        conditions: [
            { 
                bagian: 'musytarakah', 
                syarat: "Menjadi ahli waris Musytarakah, ikut berbagi 1/3 dengan saudara/i seibu.", 
                check: (state) => state.isMusytarakah 
            },
                { bagian: 'mahjub', syarat: "Terhalang oleh Ayah atau Furu' lk (Anak/Cucu lk).", check: (state) => state.has('ayah') || state.hasFuruLaki() },
                    { bagian: 'jadd_ikhwah_case', syarat: "Bersama kakek, masuk kasus khusus Jadd wal Ikhwah.", check: (state) => state.isJaddWalIkhwah() },

            { bagian: 'jadd_ikhwah_case', syarat: "Bersama kakek, perhitungannya masuk kasus khusus Jadd wal Ikhwah.", check: (state) => state.has('kakek') && !state.has('ayah') && !state.hasFuruLaki() },
            { 
                bagian: 'ashabah_binafsih', 
                syarat: "Menjadi Ashabah بنفسه.", 
                check: (state) => true 
            },
            { bagian: 'ashabah_bilghair', syarat: "Menjadi Ashabah بالغير bersama Saudari Kandung.", check: (state) => state.has('saudari_kandung') },
        ]
    },
    'saudara_lk_seayah': {
        name: 'Saudara Laki-laki Seayah', nameAr: 'أخ لأب', gender: 'L', type: 'ashabah',
        category: 'Saudara',
        conditions: [
            { bagian: 'mahjub', syarat: "Terhalang oleh Ayah, Furu' lk, atau Saudara Lk Kandung.", check: (state) => state.has('ayah') || state.hasFuruLaki() || state.has('saudara_lk_kandung') },
            { bagian: 'mahjub', syarat: "Terhalang oleh Saudari Kandung yang menjadi Ashabah ma'al ghair.", check: (state) => state.isAshabahMaalGhair('saudari_kandung') },
            { bagian: 'ashabah_binafsih', syarat: "Menjadi Ashabah بنفسه.", check: (state) => true },
                    { bagian: 'ashabah_bilghair', syarat: "Menjadi Ashabah بالغير bersama Saudari Seayah.", check: (state) => state.has('saudari_seayah') },

        ]
    },
    'saudara_lk_seibu': {
        name: 'Saudara Laki-laki Seibu', nameAr: 'أخ لأم', gender: 'L', type: 'dzawil_furudh',
        category: 'Saudara',
        conditions: [
            { bagian: 'mahjub', syarat: "Terhalang oleh Ayah, Furu' lk, atau Saudara Lk Kandung.", check: (state) => state.has('ayah') || state.hasFuruLaki() || state.has('saudara_lk_kandung') },
            { bagian: 'mahjub', syarat: "Terhalang oleh Saudari Kandung yang menjadi Ashabah ma'al ghair.", check: (state) => state.isAshabahMaalGhair('saudari_kandung') },
            { bagian: 'jadd_ikhwah_case', syarat: "Bersama kakek, masuk kasus khusus Jadd wal Ikhwah.", check: (state) => state.isJaddWalIkhwah() },            { bagian: 'musytarakah', syarat: "Menjadi ahli waris Musytarakah, berbagi 1/3 dengan Saudara Kandung.", check: (state) => state.isMusytarakah },
            { bagian: '1/3', syarat: "Berjumlah 2 atau lebih (berbagi).", check: (state) => state.count.saudara_seibu >= 2 },
            { bagian: '1/6', syarat: "Hanya satu orang.", check: (state) => true }
        ]
    },
    'anak_lk_saudara_kandung': {
        name: 'Keponakan Lk (dari Sdr Lk Kandung)', nameAr: 'ابن أخ لأبوين', gender: 'L', type: 'ashabah',
        category: 'Keponakan',
        conditions: [
            { bagian: 'mahjub', syarat: "Terhalang oleh ahli waris Ashabah yang lebih dekat (Ushul lk, Furu' lk, Saudara lk).", check: (state) => state.hasUshulLaki() || state.hasFuruLaki() || state.has('saudara_lk_kandung') || state.has('saudara_lk_seayah') },
            { bagian: 'ashabah_binafsih', syarat: "Menjadi Ashabah بنفسه.", check: (state) => true }
        ]
    },
    'anak_lk_saudara_seayah': {
        name: 'Keponakan Lk (dari Sdr Lk Seayah)', nameAr: 'ابن أخ لأب', gender: 'L', type: 'ashabah',
        category: 'Keponakan',
        conditions: [
            { bagian: 'mahjub', syarat: "Terhalang oleh ahli waris Ashabah yang lebih dekat (termasuk Keponakan Kandung).", check: (state) => state.hasUshulLaki() || state.hasFuruLaki() || state.has('saudara_lk_kandung') || state.has('saudara_lk_seayah') || state.has('anak_lk_saudara_kandung') },
            { bagian: 'ashabah_binafsih', syarat: "Menjadi Ashabah بنفسه.", check: (state) => true }
        ]
    },
    'paman_kandung': {
        name: 'Paman Kandung (Sdr Ayah Kandung)', nameAr: 'عم لأبوين', gender: 'L', type: 'ashabah',
        category: 'Paman',
        conditions: [
{ 
                bagian: 'mahjub', 
                syarat: "Terhalang oleh ahli waris Ashabah yang lebih dekat (Abak/cucu lk, Ayah/Kakek lk, Saudara lk, Keponakan lk).", 
                check: (state) => state.hasUshulLaki() || state.hasFuruLaki() || state.has('saudara_lk_kandung') || state.has('saudara_lk_seayah') || state.hasKeponakan() 
            },
                        { bagian: 'ashabah_binafsih', syarat: "Menjadi Ashabah بنفسه.", check: (state) => true }
        ]
    },
    'paman_seayah': {
        name: 'Paman Seayah (Sdr Ayah Seayah)', nameAr: 'عم لأب', gender: 'L', type: 'ashabah',
        category: 'Paman',
        conditions: [
            { bagian: 'mahjub', syarat: "Terhalang oleh ahli waris Ashabah yang lebih dekat (termasuk Paman Kandung).", check: (state) => state.hasUshulLaki() || state.hasFuruLaki() || state.hasSaudara() || state.hasKeponakan() || state.has('paman_kandung') },
            { bagian: 'ashabah_binafsih', syarat: "Menjadi Ashabah بنفسه.", check: (state) => true }
        ]
    },
    'anak_lk_paman_kandung': {
        name: 'Sepupu Lk (dari Paman Kandung)', nameAr: 'ابن عم لأبوين', gender: 'L', type: 'ashabah',
        category: 'Sepupu',
        conditions: [
            { bagian: 'mahjub', syarat: "Terhalang oleh ahli waris Ashabah yang lebih dekat (Ushul lk, Furu' lk, Saudara, Keponakan, Paman).", check: (state) => state.hasUshulLaki() || state.hasFuruLaki() || state.hasSaudara() || state.hasKeponakan() || state.hasPaman() },
            { bagian: 'ashabah_binafsih', syarat: "Menjadi Ashabah بنفسه.", check: (state) => true }
        ]
    },
    'anak_lk_paman_seayah': {
        name: 'Sepupu Lk (dari Paman Seayah)', nameAr: 'ابن عم لأب', gender: 'L', type: 'ashabah',
        category: 'Sepupu',
        conditions: [
            { bagian: 'mahjub', syarat: "Terhalang oleh ahli waris Ashabah yang lebih dekat (termasuk Sepupu Kandung).", check: (state) => state.hasUshulLaki() || state.hasFuruLaki() || state.hasSaudara() || state.hasKeponakan() || state.hasPaman() || state.has('anak_lk_paman_kandung') },
            { bagian: 'ashabah_binafsih', syarat: "Menjadi Ashabah بنفسه.", check: (state) => true }
        ]
    },
    'mutiq': {
        name: "Laki-laki yang Memerdekakan", nameAr: "معتق", gender: 'L', type: 'ashabah_sababi',
        category: 'Wala',
        conditions: [
             { bagian: 'mahjub', syarat: "Terhalang jika masih ada Ashabah Nasab (keturunan).", check: (state) => state.hasAshabahNasab() },
             { bagian: 'ashabah_sababi', syarat: "Mendapat sisa jika tidak ada Ashabah Nasab.", check: (state) => true }
        ]
    },

    // ================== GOLONGAN PEREMPUAN ==================
    'istri': {
        name: 'Istri', nameAr: 'زوجة', gender: 'P', type: 'dzawil_furudh',
        category: 'Suami/Istri',
        conditions: [
            { bagian: '1/8', syarat: "Mayit memiliki Furu'.", check: (state) => state.hasFuru() },
            { bagian: '1/4', syarat: "Mayit tidak memiliki Furu'.", check: (state) => !state.hasFuru() }
        ]
    },
    'anak_pr': {
        name: 'Anak Perempuan', nameAr: 'بنت', gender: 'P', type: 'dzawil_furudh',
        category: 'Keturunan',
        conditions: [
            { bagian: 'ashabah_bilghair', syarat: "Menjadi Ashabah بالغير karena bersama Anak Laki-laki.", check: (state) => state.has('anak_lk') },
            { bagian: '2/3', syarat: "Berjumlah 2 orang atau lebih dan tidak ada Anak Laki-laki.", check: (state) => state.count.anak_pr >= 2 && !state.has('anak_lk') },
            { bagian: '1/2', syarat: "Hanya satu orang dan tidak ada Anak Laki-laki.", check: (state) => state.count.anak_pr === 1 && !state.has('anak_lk') }
        ]
    },
    'cucu_pr': {
        name: 'Cucu Perempuan (dari Anak Lk)', nameAr: 'بنت الإبن', gender: 'P', type: 'dzawil_furudh',
        category: 'Keturunan',
        conditions: [
            { bagian: 'mahjub', syarat: "Terhalang oleh Anak Lk atau oleh 2 Anak Pr atau lebih (kecuali ada 'ashabah).", check: (state) => state.has('anak_lk') || (state.count.anak_pr >= 2 && !state.has('cucu_lk')) },
            { bagian: 'ashabah_bilghair', syarat: "Menjadi Ashabah بالغير karena bersama Cucu Laki-laki.", check: (state) => state.has('cucu_lk') },
            { bagian: '1/6', syarat: "Bersama satu orang Anak Perempuan (penyempurna 2/3).", check: (state) => state.count.anak_pr === 1 },
            { bagian: '2/3', syarat: "Berjumlah 2 atau lebih (tidak ada Anak Pr).", check: (state) => state.count.cucu_pr >= 2 && state.count.anak_pr === 0 },
            { bagian: '1/2', syarat: "Hanya satu orang (tidak ada Anak Pr).", check: (state) => state.count.cucu_pr === 1 && state.count.anak_pr === 0 }
        ]
    },
    'ibu': {
        name: 'Ibu',
        nameAr: 'أم',
        gender: 'P',
        type: 'dzawil_furudh',
        category: 'Orang Tua',
        conditions: [
            { 
                bagian: '1/3 sisa', 
                syarat: "Mendapat 1/3 dari sisa harta karena termasuk dalam kasus Gharawain.", 
                check: (state) => state.isGharawain 
            },
            { 
                bagian: '1/6', 
                syarat: "Ada Furu' (anak/cucu) ATAU ada 2 saudara/i atau lebih.", 
                check: (state) => state.hasFuru() || state.count.saudara >= 2 
            },
            { 
                bagian: '1/3', 
                syarat: "Tidak ada Furu' dan jumlah saudara kurang dari 2.", 
                check: (state) => !state.hasFuru() && state.count.saudara < 2 
            }
        ]
    },
    'nenek_dari_ibu': {
        name: 'Nenek (dari Ibu)', nameAr: 'أم الأم', gender: 'P', type: 'dzawil_furudh',
        category: 'Orang Tua',
        conditions: [
            { bagian: 'mahjub', syarat: "Terhalang oleh Ibu.", check: (state) => state.has('ibu') },
            { bagian: '1/6', syarat: "Mendapat 1/6 (berbagi jika ada nenek lain).", check: (state) => true }
        ]
    },
    'nenek_dari_ayah': {
        name: 'Nenek (dari Ayah)', nameAr: 'أم الأب', gender: 'P', type: 'dzawil_furudh',
        category: 'Orang Tua',
        conditions: [
            { bagian: 'mahjub', syarat: "Terhalang oleh Ibu atau Ayah.", check: (state) => state.has('ibu') || state.has('ayah') },
            { bagian: '1/6', syarat: "Mendapat 1/6 (berbagi jika ada nenek lain).", check: (state) => true }
        ]
    },
    'saudari_kandung': {
        name: 'Saudari Kandung', nameAr: 'أخت لأبوينة', gender: 'P', type: 'dzawil_furudh',
        category: 'Saudara',
        conditions: [
            { bagian: 'mahjub', syarat: "Terhalang oleh Ayah atau Furu' lk.", check: (state) => state.has('ayah') || state.hasFuruLaki() },
            { bagian: 'jadd_ikhwah_case', syarat: "Bersama kakek, masuk kasus khusus Jadd wal Ikhwah.", check: (state) => state.isJaddWalIkhwah() },            { bagian: 'ashabah_bilghair', syarat: "Menjadi Ashabah بالغير karena bersama Saudara Lk Kandung.", check: (state) => state.has('saudara_lk_kandung') },
            { bagian: 'ashabah_maalghair', syarat: "Menjadi Ashabah مع الغير karena bersama Furu' perempuan.", check: (state) => state.hasFuruPerempuan() },
            { bagian: '2/3', syarat: "Berjumlah 2 orang atau lebih.", check: (state) => state.count.saudari_kandung >= 2 },
            { bagian: '1/2', syarat: "Hanya satu orang.", check: (state) => true }
        ]
    },
    'saudari_seayah': {
        name: 'Saudari Seayah', nameAr: 'أخت لأب', gender: 'P', type: 'dzawil_furudh',
        category: 'Saudara',
        conditions: [
            { bagian: 'mahjub', syarat: "Terhalang oleh Ushul lk, Furu' lk, atau Saudara Lk Kandung.", check: (state) => state.hasUshulLaki() || state.hasFuruLaki() || state.has('saudara_lk_kandung') },
            { bagian: 'mahjub', syarat: "Terhalang oleh Saudari Kandung (jika jadi Ashabah) atau oleh 2 Saudari Kandung (kecuali ada 'ashabah).", check: (state) => state.isAshabahMaalGhair('saudari_kandung') || (state.count.saudari_kandung >= 2 && !state.has('saudara_lk_seayah')) },
            { bagian: 'ashabah_bilghair', syarat: "Menjadi Ashabah بالغير karena bersama Saudara Laki-laki Seayah.", check: (state) => state.has('saudara_lk_seayah') },
            { bagian: 'ashabah_maalghair', syarat: "Menjadi Ashabah مع الغير karena bersama Furu' perempuan.", check: (state) => state.hasFuruPerempuan() },
            { bagian: '1/6', syarat: "Bersama satu orang Saudari Kandung (penyempurna 2/3).", check: (state) => state.count.saudari_kandung === 1 },
            { bagian: '2/3', syarat: "Berjumlah 2 atau lebih (tidak ada Sdr/i Kandung).", check: (state) => state.count.saudari_seayah >= 2 && !state.has('saudari_kandung') && !state.has('saudara_lk_kandung') },
            { bagian: '1/2', syarat: "Hanya satu orang (tidak ada Sdr/i Kandung).", check: (state) => true }
        ]
    },
    'saudari_seibu': {
        name: 'Saudari Seibu', nameAr: 'أخت لأم', gender: 'P', type: 'dzawil_furudh',
        category: 'Saudara',
        conditions: [
            { bagian: 'mahjub', syarat: "Terhalang oleh Ayah, Furu' lk, atau Saudara Lk Kandung.", check: (state) => state.has('ayah') || state.hasFuruLaki() || state.has('saudara_lk_kandung') },
            { bagian: 'mahjub', syarat: "Terhalang oleh Saudari Kandung (jika jadi Ashabah) atau oleh 2 Saudari Kandung.", check: (state) => state.isAshabahMaalGhair('saudari_kandung') || (state.count.saudari_kandung >= 2 && !state.has('saudara_lk_seayah')) },
            { bagian: 'jadd_ikhwah_case', syarat: "Bersama kakek, masuk kasus khusus Jadd wal Ikhwah.", check: (state) => state.isJaddWalIkhwah() },            { bagian: 'musytarakah', syarat: "Menjadi ahli waris Musytarakah, berbagi 1/3 dengan Saudara Kandung.", check: (state) => state.isMusytarakah },
            { bagian: '1/3', syarat: "Berjumlah 2 atau lebih (berbagi).", check: (state) => state.count.saudara_seibu >= 2 },
            { bagian: '1/6', syarat: "Hanya satu orang.", check: (state) => true }
        ]
    },
    'mutiqah': {
        name: "Perempuan yang Memerdekakan", nameAr: "معتقة", gender: 'P', type: 'ashabah_sababi',
        category: 'Wala',
        conditions: [
             { bagian: 'mahjub', syarat: "Terhalang jika masih ada Ashabah Nasab (keturunan).", check: (state) => state.hasAshabahNasab() },
             { bagian: 'ashabah_sababi', syarat: "Mendapat sisa jika tidak ada Ashabah Nasab.", check: (state) => true }
        ]
    }
};

// =================================================================================
// ⚜️ URUTAN PRIORITAS ASHABAH (Binafsih)
// =================================================================================
export const urutanAshabah = [
    // Tingkat Anak
    'anak_lk',
    // Tingkat Cucu
    'cucu_lk',
    // Tingkat Ayah
    'ayah',
    // Tingkat Kakek
    'kakek',
    // Tingkat Saudara
    'saudara_lk_kandung',
    'saudara_lk_seayah',
    // Tingkat Keponakan
    'anak_lk_saudara_kandung',
    'anak_lk_saudara_seayah',
    // Tingkat Paman
    'paman_kandung',
    'paman_seayah',
    // Tingkat Sepupu
    'anak_lk_paman_kandung',
    'anak_lk_paman_seayah'
];