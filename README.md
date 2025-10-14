# 📚 Kalkulator Faraid - Sistem Perhitungan Waris Islam

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-emerald.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Alat bantu perhitungan waris Islam (Farāʾiḍ) yang akurat, sistematis, dan komprehensif**

[Fitur](#-fitur-utama) • [Demo](#-demo) • [Instalasi](#-instalasi) • [API Docs](#-dokumentasi-api) • [Kontribusi](#-kontribusi)

</div>

---

## 🌟 Tentang Proyek

Kalkulator Faraid adalah aplikasi web modern yang dirancang untuk memudahkan perhitungan pembagian harta waris menurut hukum Islam. Aplikasi ini menggunakan referensi dari kitab **Zahrotul Faridhoh** karya Ust. Arinal Haq Zakiyyat dan dikembangkan oleh tim **Alimta** (Usbatul Lajnah Ilmiyyah Takhossus Pasca Amtsilati).

### ✨ Keunggulan

- ✅ **Perhitungan Akurat** - Berdasarkan kitab rujukan terpercaya dengan algoritma terverifikasi
- 🎓 **Kasus Khusus Lengkap** - Mendukung 7+ kasus khusus yang jarang ditemukan
- 💡 **User-Friendly** - Interface modern dengan panduan step-by-step
- 🔌 **API Terbuka** - Dokumentasi lengkap untuk integrasi sistem
- 📱 **Responsive Design** - Optimal di semua perangkat

---

## 📋 Fitur Utama

### 1. Perhitungan Dasar
- Pembagian waris standar dengan berbagai kombinasi ahli waris
- Deteksi otomatis kasus **'Aul**, **Radd**, dan **'Aṣabah**
- Identifikasi ahli waris yang **Mahjūb** (terhalang)

### 2. Kasus-Kasus Khusus

| Kasus | Deskripsi | Icon |
|-------|-----------|------|
| **Al-Munāsakhah** | Waris berlapis ketika ahli waris meninggal sebelum pembagian | 🔄 |
| **Mirats al-Haml** | Perhitungan dengan janin dalam kandungan | 🤰 |
| **Mirats al-Khuntsā** | Ahli waris dengan jenis kelamin meragukan | ⚧ |
| **Mirats al-Mafqūd** | Ahli waris hilang tidak diketahui nasibnya | 🔍 |
| **Mirats al-Gharqā** | Beberapa orang meninggal bersamaan | ⚰️ |
| **Al-Akdarīyah** | Kasus khusus: Suami, Ibu, Kakek, Saudari | 🎯 |
| **Al-Jadd wal Ikhwah** | Kakek mewarisi bersama saudara | 👴 |

---

## 🚀 Instalasi

### Prasyarat
- Node.js 18+ 
- npm atau yarn

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/alimta/kalkulator-faraid.git

# 2. Masuk ke direktori
cd kalkulator-faraid

# 3. Install dependencies
npm install
# atau
yarn install

# 4. Jalankan development server
npm run dev
# atau
yarn dev

# 5. Buka di browser
# http://localhost:3000
```

### Build untuk Production

```bash
npm run build
npm start
```

---

## 📱 Demo

### Perhitungan Standar
```
Input:
- Suami: 1
- Anak Perempuan: 2
- Tirkah: Rp 120.000.000

Output:
- Suami: 1/4 = Rp 30.000.000
- Anak Perempuan (2): 2/3 = Rp 90.000.000
```

### Kasus Munasakhah (Waris Berlapis)
```
Masalah 1:
- Saudari Kandung: 1 (meninggal sebelum pembagian)
- Ibu: 1
- Paman Kandung: 1
- Tirkah: Rp 24.000.000

Masalah 2 (Ahli waris Saudari):
- Anak Perempuan: 1
- Saudara Laki-laki Seayah: 1

Sistem otomatis menghitung dengan metode Tashih dan KPK
```

---

## 🔌 Dokumentasi API

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Perhitungan Dasar
```http
POST /api/hitung
Content-Type: application/json

{
  "ahliWaris": {
    "suami": 1,
    "anak_pr": 2
  },
  "tirkah": 120000000
}
```

#### 2. Haml (Janin dalam Kandungan)
```http
POST /api/hitung/haml
Content-Type: application/json

{
  "ahliWaris": {
    "suami": 1,
    "ibu": 1
  },
  "tirkah": 120000000,
  "hubunganBayi": "anak"
}
```

#### 3. Khuntsā (Jenis Kelamin Meragukan)
```http
POST /api/hitung/khuntsa
Content-Type: application/json

{
  "ahliWaris": {
    "anak_lk": 1,
    "saudara_lk_kandung": 1
  },
  "tirkah": 100000000,
  "khuntsaKey": "anak_lk"
}
```

#### 4. Mafqūd (Orang Hilang)
```http
POST /api/hitung/mafqud
Content-Type: application/json

{
  "ahliWaris": {
    "istri": 1,
    "ibu": 1,
    "saudara_lk_kandung": 1
  },
  "tirkah": 24000000,
  "mafqudKey": "saudara_lk_kandung"
}
```

#### 5. Gharqā (Mati Bersamaan)
```http
POST /api/hitung/gharqa
Content-Type: application/json

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
```

#### 6. Munāsakhah (Waris Berlapis)
```http
POST /api/hitung/munasakhot
Content-Type: application/json

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
```

### Response Format

```typescript
{
  "input": {
    "ahliWaris": { ... },
    "tirkah": number
  },
  "output": [
    {
      "key": string,
      "nama": string,
      "bagian": string,        // fraksi (1/2, 1/4, dll)
      "sahamAwal": number,
      "sahamAkhir": number,
      "bagianHarta": number,   // nominal rupiah
      "isMahjub": boolean,     // terhalang atau tidak
      "alasan": string         // alasan mahjub (jika ada)
    }
  ],
  "summary": {
    "kasus": string,           // 'Adil, 'Aul, Radd
    "ashlulMasalahAwal": number,
    "ashlulMasalahAkhir": number
  }
}
```

---

## 🏗️ Struktur Proyek

```
kalkulator-faraid/
├── app/
│   ├── page.js                    # Homepage
│   ├── hitung/
│   │   └── page.js               # Perhitungan standar
│   ├── kasus-khusus/
│   │   ├── haml/page.js          # Janin
│   │   ├── khuntsa/page.js       # Intersex
│   │   ├── mafqud/page.js        # Orang hilang
│   │   ├── gharqa/page.js        # Mati bersamaan
│   │   └── munasakhot/page.js    # Waris berlapis
│   ├── tentang/page.js           # About page
│   └── api/
│       ├── hitung/route.js
│       └── hitung/
│           ├── haml/route.js
│           ├── khuntsa/route.js
│           ├── mafqud/route.js
│           ├── gharqa/route.js
│           └── munasakhot/route.js
├── components/
│   ├── HeirSelector.jsx          # Pemilih ahli waris
│   ├── MafqudForm.jsx
│   ├── MafqudResultDisplay.jsx
│   ├── MunasakhotForm.jsx
│   └── MunasakhotResultDisplay.jsx
├── lib/
│   ├── ahliWarisData.js          # Data ahli waris
│   ├── faraid.js                 # Logic perhitungan
│   ├── haml.js
│   ├── khuntsa.js
│   ├── mafqud.js
│   ├── gharqa.js
│   └── munasakhot.js
└── public/
```

---

## 💻 Teknologi

- **Framework**: [Next.js 14](https://nextjs.org/) - React framework dengan App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **Language**: JavaScript - Logic & algoritma perhitungan
- **API**: REST API - Integrasi dan komunikasi data

---

## 📖 Referensi & Metodologi

### Referensi Utama
**Zahrotul Faridhoh**  
Karya: Ust. Arinal Haq Zakiyyat

Kitab ini menjadi rujukan utama untuk:
- Aturan dasar pembagian waris
- Kasus-kasus khusus (Munasakhah, Haml, dll)
- Metode penyelesaian masalah kompleks

### Metodologi Perhitungan

1. **Aṣlul Mas'alah (AM)** - Penyamaan penyebut untuk furūḍ
2. **Tashih** - Koreksi jika ada pembagian tidak habis
3. **'Aul** - Pembesaran AM jika total furūḍ > 1
4. **Radd** - Pengembalian sisa jika tidak ada 'aṣabah
5. **Mahjūb** - Deteksi ahli waris terhalang

---

## 🧪 Testing

### Manual Testing
```bash
# Jalankan dev server
npm run dev

# Akses endpoint di browser atau Postman
# Contoh: http://localhost:3000/api/hitung
```

### Testing dengan cURL

```bash
# Test perhitungan dasar
curl -X POST http://localhost:3000/api/hitung \
  -H "Content-Type: application/json" \
  -d '{"ahliWaris":{"suami":1,"anak_pr":2},"tirkah":120000000}'

# Test Munasakhah
curl -X POST http://localhost:3000/api/hitung/munasakhot \
  -H "Content-Type: application/json" \
  -d '{
    "masalah_pertama": {
      "ahliWaris": {"saudari_kandung":1,"ibu":1,"paman_kandung":1},
      "tirkah": 24000000
    },
    "mayit_kedua_key": "saudari_kandung",
    "masalah_kedua": {
      "ahliWaris": {"anak_pr":1,"saudara_lk_seayah":1}
    }
  }'
```

---

## 🤝 Kontribusi

Kontribusi sangat kami sambut! Berikut cara berkontribusi:

1. **Fork** repository ini
2. Buat **branch** fitur baru (`git checkout -b fitur-baru`)
3. **Commit** perubahan (`git commit -m 'Menambahkan fitur X'`)
4. **Push** ke branch (`git push origin fitur-baru`)
5. Buat **Pull Request**

### Guidelines
- Ikuti code style yang ada
- Tambahkan komentar untuk logic kompleks
- Test se