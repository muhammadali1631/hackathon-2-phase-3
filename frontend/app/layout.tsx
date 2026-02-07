import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { ChatProvider } from '@/providers/chat-provider';
import { LayoutProvider } from '@/providers/layout-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App - Modern Task Management',
  description: 'A premium, modern todo application with beautiful UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ChatProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              forcedTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <LayoutProvider>
                {children}
              </LayoutProvider>
            </ThemeProvider>
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}