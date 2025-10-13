Dokumentasi API Kalkulator Faraid
Selamat datang di dokumentasi API Kalkulator Faraid. API ini menyediakan serangkaian endpoint untuk melakukan perhitungan waris Islam (Faraid) yang kompleks. Semua endpoint diakses melalui metode POST dan menggunakan format JSON.

Struktur Dasar
1. Objek ahliWaris
Semua permintaan API yang memerlukan daftar ahli waris menggunakan format objek key-value berikut. key adalah ID unik ahli waris (lihat ahliWarisData.js) dan value adalah jumlahnya.

Contoh:

JSON

{
  "ahliWaris": {
    "istri": 1,
    "anak_lk": 2,
    "anak_pr": 3
  }
}
2. Properti tirkah
Properti ini adalah total harta peninggalan dalam bentuk angka (numerik), tanpa format mata uang.

Contoh:

JSON

{
  "tirkah": 24000000
}
Endpoint API
1. Perhitungan Dasar
Endpoint ini digunakan untuk semua kasus waris standar, termasuk yang melibatkan 'Aul, Rodd, dan 'Ashabah.

URL: /api/hitung

Method: POST

Request Body
JSON

{
  "ahliWaris": {
    "suami": 1,
    "anak_pr": 2
  },
  "tirkah": 120000000
}
Success Response (Contoh)
Respons akan berisi objek hasil perhitungan yang lengkap, termasuk summary dan output yang merinci bagian setiap ahli waris.

JSON

{
  "input": { "..." },
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
2. Kasus Khusus
a. Haml (Janin dalam Kandungan)
Menghitung warisan dengan memperhitungkan 6 skenario kemungkinan kondisi janin.

URL: /api/hitung/haml

Method: POST

Request Body
Tambahkan properti hubunganBayi ("anak" atau "cucu").

JSON

{
  "ahliWaris": {
    "suami": 1,
    "ibu": 1
  },
  "tirkah": 120000000,
  "hubunganBayi": "anak"
}
Success Response (Contoh)
Respons berisi hasilAkhir (bagian yang pasti diterima dan harta mauquf) serta detailPerSkenario yang berisi hasil perhitungan lengkap untuk setiap skenario.

JSON

{
  "detailPerSkenario": [
    { "namaSkenario": "Wafat", "summary": { "..."}, "output": [...] },
    { "namaSkenario": "1 Laki-laki", "summary": { "..."}, "output": [...] }
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
b. Khuntsa (Jenis Kelamin Meragukan)
Menghitung warisan dengan memperhitungkan 2 skenario (laki-laki dan perempuan).

URL: /api/hitung/khuntsa

Method: POST

Request Body
Tambahkan khuntsaKey, yaitu key dari ahli waris yang berstatus khuntsa.

JSON

{
  "ahliWaris": {
    "anak_lk": 1,
    "saudara_lk_kandung": 1
  },
  "tirkah": 100000000,
  "khuntsaKey": "anak_lk"
}
Success Response (Contoh)
Respons berisi hasil perhitungan lengkap untuk skenarioLaki dan skenarioPerempuan, serta hasilAkhir yang merinci perbandingan dan harta mauquf.

JSON

{
  "skenarioLaki": { "summary": { "..."}, "output": [...] },
  "skenarioPerempuan": { "summary": { "..."}, "output": [...] },
  "hasilAkhir": {
    "perbandingan": { "..."},
    "ashlulMasalahJamiah": 6,
    "mauqufHarta": 16666666.67
  }
}
c. Mafqud (Orang Hilang)
Menghitung warisan dengan memperhitungkan 2 skenario (dianggap hidup dan wafat).

URL: /api/hitung/mafqud

Method: POST

Request Body
Tambahkan mafqudKey, yaitu key dari ahli waris yang hilang.

JSON

{
  "ahliWaris": {
    "istri": 1,
    "ibu": 1,
    "saudara_lk_kandung": 1
  },
  "tirkah": 24000000,
  "mafqudKey": "saudara_lk_kandung"
}
Success Response (Contoh)
Respons berisi hasil perhitungan lengkap untuk skenarioHidup dan skenarioWafat, serta hasilAkhir yang merinci perbandingan dan harta mauquf.

JSON

{
  "skenarioHidup": { "summary": { "..."}, "output": [...] },
  "skenarioWafat": { "summary": { "..."}, "output": [...] },
  "hasilAkhir": {
    "perbandingan": { "..."},
    "ashlulMasalahJamiah": 12,
    "mauqufHarta": 6000000
  }
}
d. Gharqa (Mati Bersamaan)
Menghitung beberapa masalah waris secara terpisah untuk orang-orang yang meninggal bersamaan dan tidak saling mewarisi.

URL: /api/hitung/gharqa

Method: POST

Request Body
Kirim sebuah array daftarMasalah, di mana setiap objek di dalamnya adalah satu kasus waris yang independen.

JSON

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
Success Response (Contoh)
Respons berisi array hasilPerhitungan, di mana setiap objek adalah hasil kalkulasi lengkap untuk satu mayit.

JSON

{
  "hasilPerhitungan": [
    {
      "namaMayit": "Suami",
      "summary": { "..."},
      "output": [...]
    },
    {
      "namaMayit": "Istri",
      "summary": { "..."},
      "output": [...]
    }
  ]
}
e. Munasakhat (Waris Berlapis)
Menghitung warisan di mana seorang ahli waris (Mayit #2) meninggal sebelum harta dari Mayit #1 dibagikan.

URL: /api/hitung/munasakhot

Method: POST

Request Body
Kirim tiga properti utama: masalah_pertama, mayit_kedua_key, dan masalah_kedua. Tirkah untuk masalah kedua tidak diperlukan.

JSON

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
Success Response (Contoh)
Respons berisi hasil perhitungan terpisah untuk hasilMasalahPertama dan hasilMasalahKedua, lengkap dengan namaMayitKedua. Tampilan hasil di frontend akan menggabungkan informasi ini.

JSON

{
  "hasilMasalahPertama": { "summary": { "..."}, "output": [...] },
  "hasilMasalahKedua": { "summary": { "..."}, "output": [...] },
  "namaMayitKedua": "Saudari Kandung",
  "mayit_kedua_key": "saudari_kandung"
}