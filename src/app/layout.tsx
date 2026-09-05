import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import SmoothScroll from '@/components/ui/SmoothScroll';
import { InstrumentProvider } from '@/context/InstrumentContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'MSIR INDIA | Next-Gen Industrial Calibration & Testing Experience (2026)',
  description: 'Awwwards-level interactive web experience for MSIR INDIA - NABL ISO/IEC 17025 accredited calibration, testing, & industrial metrology laboratory in Chennai.',
  keywords: ['MSIR INDIA', 'Calibration Chennai', 'NABL Calibration Lab', 'Electrical Calibration', 'Pressure Testing', 'Thermal Metrology', 'Industrial Testing'],
  openGraph: {
    title: 'MSIR INDIA | Next-Gen Calibration & Testing',
    description: 'Cinematic, interactive web application for MSIR INDIA Precision Calibration Laboratories.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-900 text-white min-h-screen relative antialiased selection:bg-amber-500/30 selection:text-amber-400">
        <AuthProvider>
          <InstrumentProvider>
            <SmoothScroll>
              <Navbar />
              <main className="relative z-10 w-full overflow-hidden">
                {children}
              </main>
              <Footer />
            </SmoothScroll>
          </InstrumentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

