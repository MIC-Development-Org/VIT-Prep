import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/components/SessionProvider';

export const metadata: Metadata = {
  title: 'VITPrep — Centralized Study Resource Hub | MIC Team 3',
  description:
    'Single, searchable, structured place for VIT students to access module-wise notes, tutorial sheets, and verified previous-year question papers (PYQs).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
