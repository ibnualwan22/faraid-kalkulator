import { NextResponse } from 'next/server';
import { ahliWarisData } from '@/lib/rules/ahliWarisData';

export async function GET() {
    try {
        // Transformasi data agar lebih mudah digunakan di frontend
        const heirsArray = Object.keys(ahliWarisData).map(key => ({
            id: key, // Menggunakan key sebagai ID unik
            key: key,
            nama_id: ahliWarisData[key].name,
            nama_ar: ahliWarisData[key].nameAr,
            gender: ahliWarisData[key].gender,
            category: ahliWarisData[key].category || 'Lainnya', // Default category
            type: ahliWarisData[key].type,
        }));

        return NextResponse.json(heirsArray, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Gagal memuat daftar ahli waris.' }, { status: 500 });
    }
}