import { NextResponse } from 'next/server';
import { calculateFaraid } from '@/lib/faraid-engine';
import { ahliWarisData } from '@/lib/rules/ahliWarisData';

/**
 * Fungsi untuk mengubah key ahli waris (misal: dari anak_pr ke anak_lk)
 */
function gantiJenisKelamin(ahliWaris, khuntsaKey) {
    const newAhliWaris = { ...ahliWaris };
    const jumlah = newAhliWaris[khuntsaKey];
    delete newAhliWaris[khuntsaKey];

    // Logika sederhana untuk mengganti pasangan gender
    let lawanJenisKey = '';
    if (khuntsaKey === 'anak_pr') lawanJenisKey = 'anak_lk';
    if (khuntsaKey === 'anak_lk') lawanJenisKey = 'anak_pr';
    // ... tambahkan pasangan lain jika perlu (cucu_pr -> cucu_lk, dll)

    if (lawanJenisKey) {
        newAhliWaris[lawanJenisKey] = jumlah;
    } else {
        // Jika tidak ada pasangan, anggap saja tetap (kasus error atau ahli waris tunggal)
        newAhliWaris[khuntsaKey] = jumlah;
    }
    return newAhliWaris;
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { ahliWaris, tirkah, khuntsaKey } = body;

        if (!khuntsaKey || !ahliWaris[khuntsaKey]) {
            return NextResponse.json({ error: 'Ahli waris Khuntsa harus ditentukan.' }, { status: 400 });
        }

        // --- Skenario 1: Khuntsa dianggap LAKI-LAKI ---
        const inputLaki = {
            tirkah,
            ahliWaris: gantiJenisKelamin(ahliWaris, khuntsaKey)
        };
        const hasilLaki = calculateFaraid(inputLaki);

        // --- Skenario 2: Khuntsa dianggap PEREMPUAN ---
        const inputPerempuan = { tirkah, ahliWaris };
        const hasilPerempuan = calculateFaraid(inputPerempuan);

        // --- Tahap 3: Perbandingan (Muqaranah) & Mauquf ---
        const perbandingan = {};
        let totalBagianYakin = 0;

        // Kumpulkan semua ahli waris unik dari kedua skenario
        const semuaAhliWarisUnik = [...new Set([...Object.keys(hasilLaki.summary.saham), ...Object.keys(hasilPerempuan.summary.saham)])];

        semuaAhliWarisUnik.forEach(key => {
            const sahamLaki = hasilLaki.summary.saham[key] || 0;
            const sahamPerempuan = hasilPerempuan.summary.saham[key] || 0;
            const sahamTerkecil = Math.min(sahamLaki, sahamPerempuan);

            const bagianYakin = (tirkah / hasilLaki.summary.ashlulMasalahAkhir) * sahamTerkecil; // Asumsi AM sama, perlu disempurnakan jika AM beda
            
            perbandingan[key] = {
                nama: ahliWarisData[key]?.name,
                sahamLaki,
                sahamPerempuan,
                sahamTerkecil,
                bagianYakin
            };
            totalBagianYakin += bagianYakin;
        });

        const mauquf = tirkah - totalBagianYakin;

        // --- Finalisasi Output ---
        const response = {
            skenarioLaki: hasilLaki,
            skenarioPerempuan: hasilPerempuan,
            hasilPerbandingan: perbandingan,
            mauquf: mauquf,
            bagianYakin: totalBagianYakin
        };

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error("API Khuntsa Error:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server saat menghitung Khuntsa.' }, { status: 500 });
    }
}