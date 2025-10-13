// app/tentang/page.js

export default function TentangPage() {
    // Data konten disimpan dalam sebuah array untuk kemudahan pengelolaan
    const daftarIsi = [
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
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-10 text-white">
            {/* --- Bagian Header --- */}
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">Tentang Kalkulator Faraid</h1>
                <p className="text-lg text-gray-300">
                    Sebuah alat bantu untuk melakukan perhitungan waris Islam (Faraid) secara akurat dan sistematis.
                </p>
            </div>

            <hr className="border-gray-700" />

            {/* --- Bagian Referensi & Pengembang --- */}
            <div className="grid md:grid-cols-2 gap-8 text-center">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-3 text-green-400">Referensi Utama</h2>
                    <div className="space-y-1">
                        <p className="text-lg font-medium">Zahrotul Faridhoh</p>
                        <p className="text-sm text-gray-400">karya Ust. Arinal Haq Zakiyyat</p>
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-3 text-green-400">Pengembang</h2>
                     <div className="space-y-1">
                        <p className="text-lg font-medium">Alimta</p>
                        <p className="text-sm text-gray-400">(Usbatul Lajnah Ilmiyyah Takhossus Pasca Amtsilati)</p>
                    </div>
                </div>
            </div>

            <hr className="border-gray-700" />

            {/* --- Bagian Daftar Isi --- */}
            <div>
                <h2 className="text-3xl font-bold text-center mb-8">Penjelasan Bab-Bab Khusus</h2>
                <div className="space-y-6">
                    {daftarIsi.map((item, index) => (
                        <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-xl font-semibold text-green-400 mb-2">{item.bab}</h3>
                            <p className="text-gray-300 leading-relaxed">{item.penjelasan}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}