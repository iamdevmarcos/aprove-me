import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ApiProvider } from '@/src/helpers/providers';
import { AuthProvider } from '@/src/features/auth/context/auth-context';
import { Toaster } from 'sonner';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Aprove-me | Gerenciamento de Recebíveis',
  description: 'Sistema para gerenciamento de recebíveis e cedentes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ApiProvider>
          <AuthProvider>{children}</AuthProvider>
        </ApiProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

