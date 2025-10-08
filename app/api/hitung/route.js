import { NextResponse } from 'next/server';
import { calculateFaraid } from '@/lib/faraid-engine'; // @ adalah alias untuk root direktori

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Contoh validasi sederhana
        if (!body.ahliWaris || Object.keys(body.ahliWaris).length === 0) {
            return NextResponse.json({ error: 'Data ahli waris tidak boleh kosong.' }, { status: 400 });
        }

        const hasilPerhitungan = calculateFaraid(body);

        return NextResponse.json(hasilPerhitungan, { status: 200 });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
    }
}