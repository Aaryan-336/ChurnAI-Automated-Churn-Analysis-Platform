import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/Toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ChurnAI — Automated Churn Intelligence',
  description: 'Upload your data. Understand your churn. Retain your users.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} bg-background text-foreground antialiased font-sans flex flex-col min-h-screen selection:bg-primary/30 selection:text-primary-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}