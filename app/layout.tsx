import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tridiagonal AI 2025',
  description: 'Discover the power of Aivee with Tridiagonal Solutions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen">
            <Navbar />
            <main className="container mx-auto px-4 py-8">{children}</main>
            {/* <Footer />     Footer Close */}
          </div>
        </Providers>
      </body>
    </html>
  );
}