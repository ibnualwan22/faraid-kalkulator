import { NextResponse } from 'next/server';

export async function GET() {
    const data = {
        "judul": "Tentang Kalkulator Faraid",
        "deskripsi": "Sebuah alat bantu untuk melakukan perhitungan waris Islam (Faraid) secara akurat dan sistematis.",
        "referensi_utama": {
            "kitab": "Zahrotul Faridhoh",
            "penulis": "Ust. Arinal Haq Zakiyyat"
        },
        "pengembang": {
            "nama": "Alimta",
            "kepanjangan": "Usbatul Lajnah Ilmiyyah Takhossus Pasca Amtsilati"
        },
        "daftar_isi": [
            {
                "bab": "Mirats al-Jadd wal Ikhwah (Waris Kakek & Saudara)",
                "penjelasan": "Membahas aturan pembagian waris ketika Kakek (dari pihak ayah) mewarisi bersama dengan saudara-saudari si mayit. Kakek akan memilih bagian yang paling menguntungkan di antara tiga opsi: 1/6 dari total harta, 1/3 dari sisa harta, atau Muqasamah (berbagi sisa dengan para saudara)."
            },
            {
                "bab": "Al-Munasakhat (Waris Berlapis)",
                "penjelasan": "Prosedur perhitungan ketika seorang ahli waris meninggal dunia sebelum harta warisan dari pewaris pertama sempat dibagikan. Bagian warisan yang belum terbagi tersebut harus dihitung dan diwariskan lagi kepada ahli warisnya sendiri."
            },
            {
                "bab": "Mirats al-Haml (Waris Janin dalam Kandungan)",
                "penjelasan": "Metode perhitungan waris dengan prinsip kehati-hatian ketika ada janin dalam kandungan yang berpotensi menjadi ahli waris. Perhitungan dibuat berdasarkan beberapa skenario kemungkinan (wafat, laki-laki, perempuan, kembar) untuk menentukan bagian yang pasti (yakin) dan menahan sisanya (mauquf)."
            },
            {
                "bab": "Mirats al-Khuntsa al-Musykil (Waris Banci/Intersex)",
                "penjelasan": "Metode perhitungan waris untuk ahli waris yang status jenis kelaminnya meragukan. Perhitungan dilakukan dengan membuat dua skenario (dianggap laki-laki dan dianggap perempuan), lalu memberikan bagian yang paling sedikit (yakin) kepada semua ahli waris."
            },
            {
                "bab": "Mirats al-Mafqud (Waris Orang Hilang)",
                "penjelasan": "Prosedur pembagian waris ketika salah satu ahli waris tidak diketahui keberadaannya. Perhitungan dibuat berdasarkan dua skenario (dianggap hidup dan dianggap wafat) untuk melindungi hak si hilang dan memberikan bagian yang pasti kepada ahli waris yang ada."
            },
            {
                "bab": "Mirats al-Gharqa (Waris Mati Bersamaan)",
                "penjelasan": "Hukum waris untuk dua atau lebih orang yang saling mewarisi meninggal dalam satu peristiwa (misalnya kecelakaan, tenggelam) dan tidak diketahui siapa yang meninggal lebih dulu. Prinsip utamanya adalah mereka dianggap tidak saling mewarisi."
            },
            {
                "bab": "Al-Mas'alah al-Akdariyah (Masalah Akdariyah)",
                "penjelasan": "Sebuah kasus pengecualian yang sangat spesifik dalam Faraid yang hanya terjadi jika ahli warisnya terdiri dari Suami, Ibu, Kakek, dan seorang Saudari. Kasus ini memiliki alur perhitungan khusus yang melibatkan proses 'Aul dan Muqasamah."
            }
        ]
    };

    return NextResponse.json(data);
}