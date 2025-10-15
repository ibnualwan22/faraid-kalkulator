import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Kalkulator Faroid',
  description: 'Aplikasi perhitungan warisan Islam',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gradient-to-br from-green-50 via-white to-green-50`}>
        {/* Modern Navbar */}
        <header className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-green-500">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-700 transition-colors">
                  <span className="text-2xl text-white">🕌</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                    Kalkulator Faraid
                  </h1>
                  <p className="text-xs text-gray-500">Zahrotul Faridhoh</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                <Link 
                  href="/" 
                  className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                >
                  Kalkulator
                </Link>
                <Link 
                  href="/ahli-waris" 
                  className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                >
                  Daftar Ahli Waris
                </Link>
                {/* Dropdown Kasus Khusus */}
                <div className="relative group">
                  <button
                    className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all inline-flex items-center gap-1"
                  >
                    Kasus Khusus
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link href="/munasakhot" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                        Munasakhot
                      </Link>
                      <Link href="/khuntsa" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                        Khuntsa
                      </Link>
                      <Link href="/haml" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                        Haml
                      </Link>
                      <Link href="/gharqa" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                        Gharqa
                      </Link>
                      <Link href="/mafqud" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                        Mafqud
                      </Link>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/tentang" 
                  className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                >
                  Tentang
                </Link>
              </nav>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <details className="relative">
                  <summary className="list-none cursor-pointer p-2 rounded-lg hover:bg-green-50 transition-colors">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </summary>
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
                    <Link href="/" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 border-b border-gray-100 transition-colors">
                      Kalkulator Utama
                    </Link>
                    <Link href="/ahli-waris" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 border-b border-gray-100 transition-colors">
                      Daftar Ahli Waris
                    </Link>
                    <div className="border-b border-gray-100">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                        Kasus Khusus
                      </div>
                      <Link href="/munasakhot" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                        Munasakhot
                      </Link>
                      <Link href="/khuntsa" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                        Khuntsa
                      </Link>
                      <Link href="/haml" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                        Haml
                      </Link>
                      <Link href="/gharqa" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                        Gharqa
                      </Link>
                      <Link href="/mafqud" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                        Mafqud
                      </Link>
                    </div>
                    <Link href="/tentang" className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                      Tentang
                    </Link>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                © 2025 - Dibuat untuk kemudahan perhitungan warisan Islam
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Berdasarkan kitab <span className="font-semibold">Zahrotul Faridhoh</span> karya Ust. Arinal Haq Zakiyyat
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}