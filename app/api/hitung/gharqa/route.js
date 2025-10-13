// app/api/hitung/gharqa/route.js

import { NextResponse } from 'next/server';
import { calculateFaraid } from '@/lib/faraid-engine';

export async function POST(request) {
    try {
        const body = await request.json();
        const { daftarMasalah } = body;

        if (!daftarMasalah || !Array.isArray(daftarMasalah) || daftarMasalah.length === 0) {
            return NextResponse.json({ error: 'Data input tidak valid. Diharapkan sebuah array masalah.' }, { status: 400 });
        }

        // Jalankan perhitungan untuk setiap masalah secara independen
        const hasilPerhitungan = daftarMasalah.map(masalah => {
            const { tirkah, ahliWaris, namaMayit } = masalah;
            
            // Panggil mesin faraid utama untuk satu masalah ini
            const hasil = calculateFaraid({ ahliWaris, tirkah: parseFloat(tirkah) });
            
            // Kembalikan hasil lengkap beserta nama mayit untuk identifikasi
            return {
                namaMayit,
                ...hasil
            };
        });

        return NextResponse.json({ hasilPerhitungan }, { status: 200 });

    } catch (error) {
        console.error("API Gharqa Error:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server saat menghitung Gharqa.' }, { status: 500 });
    }
}