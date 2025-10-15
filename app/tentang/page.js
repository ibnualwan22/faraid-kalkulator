// app/tentang/page.js

export default function TentangPage() {
    const daftarIsi = [
        {
            "bab": "Mirats al-Jadd wal Ikhwah (المیراث الجد والإخوة)",
            "subtitle": "Waris Kakek & Saudara",
            "penjelasan": "Membahas aturan pembagian waris ketika Kakek (dari pihak ayah) mewarisi bersama dengan saudara-saudari si mayit. Kakek akan memilih bagian yang paling menguntungkan di antara tiga opsi: 1/6 dari total harta, 1/3 dari sisa harta, atau Muqasamah (berbagi sisa dengan para saudara).",
            "icon": "👴"
        },
        {
            "bab": "Al-Munāsakhah (المناسخة)",
            "subtitle": "Waris Berlapis",
            "penjelasan": "Prosedur perhitungan ketika seorang ahli waris meninggal dunia sebelum harta warisan dari pewaris pertama sempat dibagikan. Bagian warisan yang belum terbagi tersebut harus dihitung dan diwariskan lagi kepada ahli warisnya sendiri.",
            "icon": "🔄"
        },
        {
            "bab": "Mirats al-Haml (میراث الحمل)",
            "subtitle": "Waris Janin dalam Kandungan",
            "penjelasan": "Metode perhitungan waris dengan prinsip kehati-hatian ketika ada janin dalam kandungan yang berpotensi menjadi ahli waris. Perhitungan dibuat berdasarkan beberapa skenario kemungkinan (wafat, laki-laki, perempuan, kembar) untuk menentukan bagian yang pasti (yakin) dan menahan sisanya (mauquf).",
            "icon": "🤰"
        },
        {
            "bab": "Mirats al-Khuntsā al-Musykil (میراث الخنثى المشكل)",
            "subtitle": "Waris Banci/Intersex",
            "penjelasan": "Metode perhitungan waris untuk ahli waris yang status jenis kelaminnya meragukan. Perhitungan dilakukan dengan membuat dua skenario (dianggap laki-laki dan dianggap perempuan), lalu memberikan bagian yang paling sedikit (yakin) kepada semua ahli waris.",
            "icon": "⚧"
        },
        {
            "bab": "Mirats al-Mafqūd (میراث المفقود)",
            "subtitle": "Waris Orang Hilang",
            "penjelasan": "Prosedur pembagian waris ketika salah satu ahli waris tidak diketahui keberadaannya. Perhitungan dibuat berdasarkan dua skenario (dianggap hidup dan dianggap wafat) untuk melindungi hak si hilang dan memberikan bagian yang pasti kepada ahli waris yang ada.",
            "icon": "🔍"
        },
        {
            "bab": "Mirats al-Gharqā (میراث الغرقى)",
            "subtitle": "Waris Mati Bersamaan",
            "penjelasan": "Hukum waris untuk dua atau lebih orang yang saling mewarisi meninggal dalam satu peristiwa (misalnya kecelakaan, tenggelam) dan tidak diketahui siapa yang meninggal lebih dulu. Prinsip utamanya adalah mereka dianggap tidak saling mewarisi.",
            "icon": "⚰️"
        },
        {
            "bab": "Al-Mas'alah al-Akdarīyah (المسألة العكدریة)",
            "subtitle": "Masalah Akdariyah",
            "penjelasan": "Sebuah kasus pengecualian yang sangat spesifik dalam Faraid yang hanya terjadi jika ahli warisnya terdiri dari Suami, Ibu, Kakek, dan seorang Saudari. Kasus ini memiliki alur perhitungan khusus yang melibatkan proses 'Aul dan Muqasamah.",
            "icon": "🎯"
        }
    ];

    const fiturUtama = [
        {
            title: "Perhitungan Akurat",
            desc: "Berdasarkan kitab Zahrotul Faridhoh dengan algoritma yang telah diverifikasi",
            icon: "✅"
        },
        {
            title: "Kasus Khusus Lengkap",
            desc: "Mendukung 7+ kasus khusus yang jarang ditemukan di aplikasi lain",
            icon: "🎓"
        },
        {
            title: "Interface User-Friendly",
            desc: "Tampilan modern dan mudah dipahami dengan panduan step-by-step",
            icon: "💡"
        },
        {
            title: "API Terbuka",
            desc: "Dokumentasi API lengkap untuk integrasi dengan sistem lain",
            icon: "🔌"
        }
    ];

    const teknologi = [
        { name: "Next.js 15", desc: "React Framework", color: "bg-black" },
        { name: "Tailwind CSS", desc: "Styling", color: "bg-blue-500" },
        { name: "JavaScript", desc: "Logic & Algorithm", color: "bg-yellow-500" },
        { name: "REST API", desc: "Integration", color: "bg-green-600" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-8">
                        <div className="text-center">
                            <div className="inline-block bg-white/20 rounded-2xl p-4 mb-4">
                                <span className="text-6xl">📚</span>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-3">Tentang Kalkulator Faraid</h1>
                            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
                                Alat bantu perhitungan waris Islam (Farāʾiḍ) yang akurat, sistematis, dan komprehensif
                            </p>
                        </div>
                    </div>
                </div>

                {/* Referensi & Pengembang */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-2xl">📖</span>
                                Referensi Utama
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="text-center space-y-2">
                                <p className="text-2xl font-bold text-gray-900">Zahrotul Faridhoh</p>
                                <p className="text-gray-600">Karya</p>
                                <p className="text-lg font-semibold text-emerald-700">Ust. Arinal Haq Zakiyyat</p>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        Kitab rujukan utama yang komprehensif dalam ilmu Faraid, mencakup kasus standar hingga kasus-kasus khusus yang kompleks.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-2xl">👥</span>
                                Pengembang
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="text-center space-y-2">
                                <p className="text-2xl font-bold text-gray-900">Alimta</p>
                                <p className="text-gray-600">Tim</p>
                                <p className="text-sm font-medium text-emerald-700 leading-relaxed">
                                    Usbatul Lajnah Ilmiyyah<br/>
                                    Takhossus Pasca Amtsilati
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        Tim yang berdedikasi mengembangkan tools untuk memudahkan perhitungan ilmu Faraid dengan teknologi modern.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fitur Utama */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-3xl">⭐</span>
                            Fitur Utama
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            {fiturUtama.map((fitur, index) => (
                                <div key={index} className="bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-5 hover:shadow-md transition-all">
                                    <div className="flex items-start gap-3">
                                        <span className="text-3xl">{fitur.icon}</span>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-1">{fitur.title}</h3>
                                            <p className="text-sm text-gray-600">{fitur.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Penjelasan Bab-Bab Khusus */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-3xl">📑</span>
                            Penjelasan Bab-Bab Khusus
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">Kasus-kasus khusus dalam ilmu Faraid yang didukung oleh sistem</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {daftarIsi.map((item, index) => (
                                <div key={index} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white rounded-lg p-3 shadow-sm">
                                            <span className="text-3xl">{item.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">{item.bab}</h3>
                                            <p className="text-sm font-semibold text-emerald-700 mb-2">{item.subtitle}</p>
                                            <p className="text-sm text-gray-700 leading-relaxed">{item.penjelasan}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Teknologi */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-3xl">⚙️</span>
                            Teknologi yang Digunakan
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {teknologi.map((tech, index) => (
                                <div key={index} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-center hover:border-emerald-300 transition-all">
                                    <div className={`w-12 h-12 ${tech.color} rounded-lg mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg`}>
                                        {tech.name.charAt(0)}
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-sm mb-1">{tech.name}</h3>
                                    <p className="text-xs text-gray-600">{tech.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Tambahan */}
                <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-8 py-6 text-center text-white">
                        <h3 className="text-2xl font-bold mb-2">💬 Ada Pertanyaan atau Saran?</h3>
                        <p className="text-emerald-100 mb-4">
                            Kami terus mengembangkan aplikasi ini untuk memberikan pengalaman terbaik
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
  <a 
    href="https://wa.me/6281227225453" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-sm hover:underline"
  >
    💬 WhatsApp: 0812-2722-5453
  </a>
</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}