📘 API Kalkulator Faraid

API untuk menghitung pembagian waris Islam (Farāʾiḍ) mencakup kasus standar hingga kasus khusus seperti Haml, Khuntsā, Mafqūd, Gharqā, dan Munāsakhat.

Base URL (default dev): http://localhost:3000

Metode HTTP: POST

Format: application/json

Auth: — (tidak diperlukan untuk pengembangan lokal)

Daftar Isi

Struktur Dasar Input

Konvensi & Catatan Teknis

Endpoint

/api/hitung — Perhitungan Dasar

/api/hitung/haml — Haml (Janin)

/api/hitung/khuntsa — Khuntsa

/api/hitung/mafqud — Mafqud

/api/hitung/gharqa — Gharqa (Mati Bersamaan)

/api/hitung/munasakhot — Munasakhat (Waris Berlapis)

Struktur Respons Umum

Penanganan Error

Glosarium Istilah

Contoh Uji Cepat (cURL)

Struktur Dasar Input
1) Objek ahliWaris

Gunakan key (ID unik ahli waris, lihat ahliWarisData.js) dan value jumlahnya (integer ≥ 0).

{
  "ahliWaris": {
    "istri": 1,
    "anak_lk": 2,
    "anak_pr": 3
  }
}

2) Properti tirkah

Total harta peninggalan (dalam angka, tanpa format mata uang).

{
  "tirkah": 24000000
}


Tips: Satuan rupiah murni (number). Pembulatan nominal pada respons dapat memakai kebijakan internal (mis. Math.floor).

Konvensi & Catatan Teknis

Furūḍ, ‘Aul, Radd, ‘Aṣabah ditangani otomatis pada endpoint dasar.

Mahjūb ditandai pada keluaran; ahli waris yang terhalang akan diberi penjelasan alasan.

Saham & AM (Aṣlul Mas’alah):

ashlulMasalahAwal, ashlulMasalahAkhir, ashlulMasalahTashih ditampilkan pada summary.

sahamAwal, sahamTashih, sahamAkhir per ahli waris ditampilkan pada output.

Munasakhat (tanpa Mas’alatul Jam’iyyah):

Disamakan saham Mayit #2 (di Masalah 1) dengan AM Masalah 2 menggunakan KPK/LCM.

Skala ulang keduanya sehingga unit saham & AM kompatibel, tanpa mengubah tirkah uang.

Tirkah Masalah 2 selalu diambil dari nominal bagian Mayit #2 di Masalah 1.

Klasifikasi Mumātsalah/Muwāfaqah/Mudākhalah/Mubāyanah tercakup melalui relasi FPB/KPK.

Endpoint
1) Perhitungan Dasar

Perhitungan standar (termasuk ‘Aul, Radd, ‘Aṣabah).

URL: /api/hitung

Method: POST

Request Body
{
  "ahliWaris": {
    "suami": 1,
    "anak_pr": 2
  },
  "tirkah": 120000000
}

Success Response (contoh ringkas)
{
  "input": { "...": "..." },
  "output": [
    {
      "key": "suami",
      "nama": "Suami",
      "bagian": "1/4",
      "sahamAkhir": 3,
      "bagianHarta": 30000000
    },
    {
      "key": "anak_pr",
      "nama": "Anak Perempuan",
      "bagian": "2/3",
      "sahamAkhir": 8,
      "bagianHarta": 80000000
    }
  ],
  "summary": {
    "kasus": "'Adil",
    "ashlulMasalahAkhir": 12
  }
}

2a) Haml (Janin dalam Kandungan)

Menghitung 6 skenario kondisi janin.

URL: /api/hitung/haml

Method: POST

Request Body

Tambahkan hubunganBayi: "anak" atau "cucu".

{
  "ahliWaris": { "suami": 1, "ibu": 1 },
  "tirkah": 120000000,
  "hubunganBayi": "anak"
}

Success Response (skema ringkas)
{
  "detailPerSkenario": [
    { "namaSkenario": "Wafat", "summary": { "..." }, "output": [ ... ] },
    { "namaSkenario": "1 Laki-laki", "summary": { "..." }, "output": [ ... ] }
  ],
  "hasilAkhir": {
    "perbandingan": {
      "suami": { "nama": "Suami", "sahamTerkecil": 3 },
      "ibu": { "nama": "Ibu", "sahamTerkecil": 2 }
    },
    "ashlulMasalahJamiah": 12,
    "mauqufHarta": 70000000
  }
}

2b) Khuntsa (Jenis Kelamin Meragukan)

Dihitung 2 skenario: laki-laki & perempuan.

URL: /api/hitung/khuntsa

Method: POST

Request Body

Tambahkan khuntsaKey (key ahli waris yang berstatus khuntsa).

{
  "ahliWaris": { "anak_lk": 1, "saudara_lk_kandung": 1 },
  "tirkah": 100000000,
  "khuntsaKey": "anak_lk"
}

Success Response (skema ringkas)
{
  "skenarioLaki": { "summary": { "..." }, "output": [ ... ] },
  "skenarioPerempuan": { "summary": { "..." }, "output": [ ... ] },
  "hasilAkhir": {
    "perbandingan": { "..." },
    "ashlulMasalahJamiah": 6,
    "mauqufHarta": 16666666.67
  }
}

2c) Mafqud (Orang Hilang)

Dihitung 2 skenario: dianggap hidup & wafat.

URL: /api/hitung/mafqud

Method: POST

Request Body

Tambahkan mafqudKey.

{
  "ahliWaris": {
    "istri": 1,
    "ibu": 1,
    "saudara_lk_kandung": 1
  },
  "tirkah": 24000000,
  "mafqudKey": "saudara_lk_kandung"
}

Success Response (skema ringkas)
{
  "skenarioHidup": { "summary": { "..." }, "output": [ ... ] },
  "skenarioWafat": { "summary": { "..." }, "output": [ ... ] },
  "hasilAkhir": {
    "perbandingan": { "..." },
    "ashlulMasalahJamiah": 12,
    "mauqufHarta": 6000000
  }
}

2d) Gharqa (Mati Bersamaan)

Beberapa masalah berdiri sendiri, tidak saling mewarisi.

URL: /api/hitung/gharqa

Method: POST

Request Body

Berikan daftarMasalah (array masalah independen).

{
  "daftarMasalah": [
    {
      "namaMayit": "Suami",
      "ahliWaris": { "saudara_lk_kandung": 1 },
      "tirkah": 100000000
    },
    {
      "namaMayit": "Istri",
      "ahliWaris": { "ayah": 1 },
      "tirkah": 50000000
    }
  ]
}

Success Response (skema ringkas)
{
  "hasilPerhitungan": [
    { "namaMayit": "Suami", "summary": { "..." }, "output": [ ... ] },
    { "namaMayit": "Istri", "summary": { "..." }, "output": [ ... ] }
  ]
}

2e) Munasakhat (Waris Berlapis)

Seorang ahli waris (Mayit #2) wafat sebelum harta Mayit #1 dibagikan.

URL: /api/hitung/munasakhot

Method: POST

Konsep & Alur (sesuai kitab, tanpa Mas’alatul Jam’iyyah)

Selesaikan Masalah 1 sepenuhnya → dapat saham Mayit #2 (S) & AM_1.

Susun Masalah 2 (dari furūḍ) → dapat AM_2.

Samakan unit: cari LCM/KPK dari S dan AM_2 ⇒ L.

Faktor skala masalah 1: f1 = L / S → kalikan semua saham & AM_1.

Faktor skala masalah 2: f2 = L / AM_2 → kalikan semua saham & **AM_2`.

Tirkah Masalah 2 = bagian rupiah Mayit #2 di Masalah 1 (tetap uang, tidak dipengaruhi skala).

Klasifikasi hubungan: Mumātsalah / Muwāfaqah / Mudākhalah / Mubāyanah (otomatis oleh relasi FPB/KPK).

Request Body

Tidak perlu mengirim tirkah pada masalah_kedua.

{
  "masalah_pertama": {
    "ahliWaris": {
      "saudari_kandung": 1,
      "ibu": 1,
      "paman_kandung": 1
    },
    "tirkah": 24000000
  },
  "mayit_kedua_key": "saudari_kandung",
  "masalah_kedua": {
    "ahliWaris": {
      "anak_pr": 1,
      "saudara_lk_seayah": 1
    }
  }
}

Success Response (skema ringkas)
{
  "hasilMasalahPertama": { "summary": { "..." }, "output": [ ... ] },
  "hasilMasalahKedua": { "summary": { "..." }, "output": [ ... ] },
  "namaMayitKedua": "Saudari Kandung",
  "mayit_kedua_key": "saudari_kandung"
}


Catatan: Respons telah menyertakan AM akhir & saham akhir yang sudah disekalakan pada kedua masalah agar konsisten (Munasakhat “tanpa jam’iyyah”).

Struktur Respons Umum

Bidang yang lazim muncul pada hasil kalkulasi (contoh):

type HasilPerhitungan = {
  input: {
    ahliWaris: Record<string, number>;
    tirkah: number;
  };
  output: Array<{
    key: string;
    nama: string;
    bagian?: string;        // fraksi furudh (jika ada)
    isMahjub?: boolean;
    alasan?: string;        // alasan mahjub (jika mahjub)
    sahamAwal?: number;
    sahamTashih?: number;
    sahamAkhir?: number;
    bagianHarta?: number;   // rupiah
  }>;
  summary: {
    kasus?: string;
    ashlulMasalahAwal?: number;
    ashlulMasalahAkhir?: number;
    ashlulMasalahTashih?: number;
    // opsional:
    keteranganRekonsiliasi?: {
      relation: 'Mumatsalah' | 'Muwafaqoh' | 'Mudakholah' | 'Mubayanah';
      L: number;
      fMasalah1: number;
      fMasalah2: number;
      sahamMayit2_M1: number;
      AM_M2_awal: number;
      AM_M1_akhir: number;
      AM_M2_akhir: number;
    };
  };
};

Penanganan Error

400 Bad Request

Input tidak lengkap / tidak valid (mis. mayit_kedua_key tidak ada atau mahjub pada Munasakhat).

Contoh:

{ "error": "Data input tidak lengkap." }


500 Internal Server Error

Gangguan server saat kalkulasi.

Contoh:

{ "error": "Terjadi kesalahan pada server saat menghitung Munasakhot." }


Debug tip: Periksa log server dev (Next.js) dan pastikan modul utilitas (lib/munasakhot.js, dll.) mengekspor fungsi bernama yang benar.

Glosarium Istilah

Aṣlul Mas’alah (AM): Bilangan dasar untuk mengonversi furūḍ ke saham bulat.

Saham: Unit bagian proporsional per ahli waris.

‘Aul: Pembesaran AM ketika total furūḍ > 1.

Radd: Pengembalian sisa kepada ahli furūḍ saat tidak ada ‘aṣabah.

Mahjūb: Ahli waris yang terhalang karena ada ahli yang lebih berhak.

Munasakhat: Waris berlapis ketika ahli waris meninggal sebelum distribusi; diselesaikan dengan menyamakan saham Mayit #2 (M1) dan AM (M2).

Contoh Uji Cepat (cURL)

Jalankan dari terminal untuk menguji endpoint secara cepat.

Perhitungan Dasar
curl -s -X POST http://localhost:3000/api/hitung \
  -H "Content-Type: application/json" \
  -d '{
    "ahliWaris": { "suami": 1, "anak_pr": 2 },
    "tirkah": 120000000
  }' | jq

Haml
curl -s -X POST http://localhost:3000/api/hitung/haml \
  -H "Content-Type: application/json" \
  -d '{
    "ahliWaris": { "suami": 1, "ibu": 1 },
    "tirkah": 120000000,
    "hubunganBayi": "anak"
  }' | jq

Khuntsa
curl -s -X POST http://localhost:3000/api/hitung/khuntsa \
  -H "Content-Type: application/json" \
  -d '{
    "ahliWaris": { "anak_lk": 1, "saudara_lk_kandung": 1 },
    "tirkah": 100000000,
    "khuntsaKey": "anak_lk"
  }' | jq

Mafqud
curl -s -X POST http://localhost:3000/api/hitung/mafqud \
  -H "Content-Type: application/json" \
  -d '{
    "ahliWaris": { "istri": 1, "ibu": 1, "saudara_lk_kandung": 1 },
    "tirkah": 24000000,
    "mafqudKey": "saudara_lk_kandung"
  }' | jq

Gharqa
curl -s -X POST http://localhost:3000/api/hitung/gharqa \
  -H "Content-Type: application/json" \
  -d '{
    "daftarMasalah": [
      { "namaMayit": "Suami", "ahliWaris": { "saudara_lk_kandung": 1 }, "tirkah": 100000000 },
      { "namaMayit": "Istri", "ahliWaris": { "ayah": 1 }, "tirkah": 50000000 }
    ]
  }' | jq

Munasakhat
curl -s -X POST http://localhost:3000/api/hitung/munasakhot \
  -H "Content-Type: application/json" \
  -d '{
    "masalah_pertama": {
      "ahliWaris": { "saudari_kandung": 1, "ibu": 1, "paman_kandung": 1 },
      "tirkah": 24000000
    },
    "mayit_kedua_key": "saudari_kandung",
    "masalah_kedua": {
      "ahliWaris": { "anak_pr": 1, "saudara_lk_seayah": 1 }
    }
  }' | jq

Lisensi

Tentukan lisensi proyekmu (mis. MIT) di sini.

Catatan Akhir

Pastikan ID ahli waris yang dipakai pada input merujuk ke definisi di ahliWarisData.js.

Untuk tampilan frontend, komponen seperti MunasakhatResultDisplay membaca sahamAkhir/sahamTashih dan ashlulMasalahAkhir/Tashih yang telah disekalakan agar sesuai kaidah.

