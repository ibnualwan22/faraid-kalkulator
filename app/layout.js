import { Inter } from 'next/font/google';
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
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold text-gray-800">🕌 Kalkulator Faroid</h1>
            </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="text-center py-6 mt-8">
          <p className="text-sm text-gray-500">© 2025 - Dibuat untuk kemudahan perhitungan warisan Islam.</p>
        </footer>
      </body>
    </html>
  );
}