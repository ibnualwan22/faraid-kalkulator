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
      <body className={`${inter.className} bg-gray-50`}>
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              <Link href="/">🕌 Kalkulator Faroid</Link>
            </h1>

            {/* NAV DESKTOP */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-green-600 transition">
                Kalkulator Utama
              </Link>

              {/* Dropdown Kasus Khusus */}
              <div className="relative group">
                <button
                  className="text-gray-600 hover:text-green-600 transition inline-flex items-center"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Kasus Khusus ▾
                </button>
                <div className="absolute left-0 hidden group-hover:block bg-white shadow-lg rounded-md mt-2 py-2 w-44">
                  <Link href="/munasakhot" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                    Munasakhot
                  </Link>
                  <Link href="/khuntsa" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                    Khuntsa
                  </Link>
                  <Link href="/haml" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                    Haml
                  </Link>
                  <Link href="/mafqud" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                    Mafqud
                  </Link>
                </div>
              </div>

              <Link href="/tentang" className="text-gray-600 hover:text-green-600 transition">
                Tentang
              </Link>
            </nav>

            {/* NAV MOBILE (simple) */}
            <nav className="md:hidden">
              <details className="relative">
                <summary className="list-none cursor-pointer px-3 py-2 rounded-md border text-gray-700 hover:border-gray-300">
                  Menu
                </summary>
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md overflow-hidden">
                  <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Kalkulator Utama
                  </Link>
                  <div className="border-t">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500">
                      Kasus Khusus
                    </div>
                    <Link href="/munasakhot" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Munasakhot
                    </Link>
                    <Link href="/khuntsa" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Khuntsa
                    </Link>
                    <Link href="/haml" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Haml
                    </Link>
                    <Link href="/mafqud" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Mafqud
                    </Link>
                    <Link href="/gharqa" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Gharqa  
                    </Link>
                  </div>
                  <div className="border-t">
                    <Link href="/tentang" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Tentang
                    </Link>
                  </div>
                </div>
              </details>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="text-center py-6 mt-8">
          <p className="text-sm text-gray-500">
            © 2025 - Dibuat untuk kemudahan perhitungan warisan Islam.
          </p>
        </footer>
      </body>
    </html>
  );
}
