// app/api/hitung/route.js

import { NextResponse } from 'next/server';
import { calculateFaraid } from '@/lib/faraid-engine';

export async function POST(request) {
    try {
        const body = await request.json();
        const { ahliWaris, tirkah } = body;

        // --- PERBAIKAN UTAMA: LOGIKA VALIDASI YANG ROBUST ---
        if (
            !ahliWaris || typeof ahliWaris !== 'object' || Object.keys(ahliWaris).length === 0 ||
            !tirkah || typeof tirkah !== 'number' || tirkah <= 0
        ) {
            return NextResponse.json({ error: 'Data input tidak lengkap atau tidak valid. Pastikan ahli waris telah dipilih dan tirkah telah diisi dengan benar.' }, { status: 400 });
        }
        // ----------------------------------------------------

        // Jika validasi lolos, panggil mesin utama
        const hasilPerhitungan = calculateFaraid({ ahliWaris, tirkah });

        // Kembalikan hasil yang sukses
        return NextResponse.json(hasilPerhitungan, { status: 200 });

    } catch (error) {
        console.error("API Hitung Utama Error:", error);
        // Tangani error jika body JSON tidak valid atau ada masalah lain
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Gagal memproses data. Format JSON tidak valid.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
    }
}