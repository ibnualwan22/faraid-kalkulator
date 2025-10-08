import { NextResponse } from 'next/server';
import { calculateFaraid } from '@/lib/faraid-engine';
import { ahliWarisData } from '@/lib/rules/ahliWarisData';

export async function POST(request) {
    try {
        const body = await request.json();
        const { ahliWaris, tirkah, hubunganBayi } = body;

        if (!hubunganBayi) {
            return NextResponse.json({ error: 'Hubungan janin dengan mayit harus ditentukan.' }, { status: 400 });
        }

        // --- 1. Definisikan Semua Skenario ---
        const scenarios = [
            { nama: 'Janin Dianggap Wafat', modifikasi: {} },
            { nama: '1 Laki-laki', modifikasi: { [`${hubunganBayi}_lk`]: 1 } },
            { nama: '1 Perempuan', modifikasi: { [`${hubunganBayi}_pr`]: 1 } },
            { nama: '2 Laki-laki', modifikasi: { [`${hubunganBayi}_lk`]: 2 } },
            { nama: '2 Perempuan', modifikasi: { [`${hubunganBayi}_pr`]: 2 } },
            { nama: '1 Lk & 1 Pr', modifikasi: { [`${hubunganBayi}_lk`]: 1, [`${hubunganBayi}_pr`]: 1 } },
        ];

        // --- 2. Jalankan Perhitungan untuk Setiap Skenario ---
        const hasilSkenario = scenarios.map(s => {
            const inputSkenario = {
                tirkah,
                ahliWaris: { ...ahliWaris, ...s.modifikasi },
            };
            // Hapus properti yg jumlahnya 0, jika ada
            for(const key in inputSkenario.ahliWaris) {
                if (inputSkenario.ahliWaris[key] === 0) {
                    delete inputSkenario.ahliWaris[key];
                }
            }
            return { nama: s.nama, hasil: calculateFaraid(inputSkenario) };
        });

        // --- 3. Lakukan Perbandingan (Muqaranah) ---
        const perbandingan = {};
        const semuaAhliWarisUnik = new Set();
        hasilSkenario.forEach(s => {
            s.hasil.output.forEach(aw => semuaAhliWarisUnik.add(aw.key));
        });

        semuaAhliWarisUnik.forEach(key => {
            if (!ahliWarisData[key]) return; // Lewati jika key tidak valid

            const proporsiTerkecil = Math.min(...hasilSkenario.map(s => {
                const aw = s.hasil.output.find(a => a.key === key);
                if (!aw || aw.isMahjub) return 0;
                
                const am = s.hasil.summary.ashlulMasalahTashih || s.hasil.summary.ashlulMasalahAkhir;
                const saham = (s.hasil.summary.ashlulMasalahTashih ? aw.sahamTashih : aw.sahamAkhir) || 0;
                return saham / am;
            }));

            perbandingan[key] = {
                nama: ahliWarisData[key].name,
                proporsiTerkecil,
                bagianYakin: tirkah * proporsiTerkecil,
                // Simpan juga proporsi di setiap skenario untuk ditampilkan
                proporsiPerSkenario: hasilSkenario.map(s => {
                    const aw = s.hasil.output.find(a => a.key === key);
                     if (!aw || aw.isMahjub) return 0;
                    const am = s.hasil.summary.ashlulMasalahTashih || s.hasil.summary.ashlulMasalahAkhir;
                    const saham = (s.hasil.summary.ashlulMasalahTashih ? aw.sahamTashih : aw.sahamAkhir) || 0;
                    return saham / am;
                })
            };
        });

        // --- 4. Hitung Mauquf ---
        const totalBagianYakin = Object.values(perbandingan).reduce((sum, p) => sum + p.bagianYakin, 0);
        const mauquf = tirkah - totalBagianYakin;

        // --- 5. Siapkan Respons Final ---
        const response = {
            detail_skenario: hasilSkenario,
            hasil_perbandingan: perbandingan,
            mauquf,
            tirkah
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("API Haml Error:", error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server saat menghitung Haml.' }, { status: 500 });
    }
}