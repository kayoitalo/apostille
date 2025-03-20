import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Notifications } from '@/components/ui/notification';
import { ThemeProvider } from "@/components/theme-provider"

interface RootLayoutProps {
  children: React.ReactNode;
}

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Apostilamento',
  description: 'Sistema de gerenciamento de documentos para apostilamento',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Notifications />
          </ThemeProvider>
      </body>
    </html>
  );
}