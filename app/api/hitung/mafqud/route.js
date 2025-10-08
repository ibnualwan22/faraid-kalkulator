import { NextResponse } from 'next/server';
import { calculateFaraid } from '@/lib/faraid-engine';
import { ahliWarisData } from '@/lib/rules/ahliWarisData';

export async function POST(request) {
    try {
        const body = await request.json();
        const { ahliWaris, tirkah, mafqudKey } = body;

        if (!mafqudKey || !ahliWaris[mafqudKey]) {
            return NextResponse.json({ error: 'Ahli waris Mafqud harus ditentukan.' }, { status: 400 });
        }

        // --- Skenario 1: Mafqud dianggap HIDUP ---
        const inputHidup = { tirkah, ahliWaris };
        const hasilHidup = calculateFaraid(inputHidup);

        // --- Skenario 2: Mafqud dianggap WAFAT ---
        const ahliWarisWafat = { ...ahliWaris };
        delete ahliWarisWafat[mafqudKey]; // Hapus si Mafqud dari daftar ahli waris
        const inputWafat = { tirkah, ahliWaris: ahliWarisWafat };
        const hasilWafat = calculateFaraid(inputWafat);

        // --- Tahap 3: Perbandingan (Muqaranah) & Mauquf ---
        const perbandingan = {};
        let totalBagianYakin = 0;

        const semuaAhliWarisUnik = new Set(Object.keys(ahliWaris).filter(key => key !== mafqudKey));

        semuaAhliWarisUnik.forEach(key => {
            if (!ahliWarisData[key]) return;

            // Fungsi untuk mendapatkan proporsi saham
            const getProporsi = (hasil, aKey) => {
                const aw = hasil.output.find(a => a.key === aKey);
                if (!aw || aw.isMahjub) return 0;
                const am = hasil.summary.ashlulMasalahTashih || hasil.summary.ashlulMasalahAkhir;
                const saham = (hasil.summary.ashlulMasalahTashih ? aw.sahamTashih : aw.sahamAkhir) || 0;
                return am > 0 ? saham / am : 0;
            };

            const proporsiHidup = getProporsi(hasilHidup, key);
            const proporsiWafat = getProporsi(hasilWafat, key);
            const proporsiTerkecil = Math.min(proporsiHidup, proporsiWafat);

            perbandingan[key] = {
                nama: ahliWarisData[key].name,
                proporsiHidup,
                proporsiWafat,
                proporsiTerkecil,
                bagianYakin: tirkah * proporsiTerkecil,
            };
            totalBagianYakin += perbandingan[key].bagianYakin;
        });

        const mauquf = tirkah - totalBagianYakin;

        // --- Finalisasi Output ---
        const response = {
            skenarioHidup: hasilHidup,
            skenarioWafat: hasilWafat,
            hasilPerbandingan: perbandingan,
            mauquf,
            tirkah
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("API Mafqud Error:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server saat menghitung Mafqud.' }, { status: 500 });
    }
}