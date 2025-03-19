import NavBar from '@/components/nav-bar';
import Providers from '@/components/providers/providers';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';

export const metadata = {
  title: 'Feedit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        'bg-white text-slate-900 antialiased light',
        inter.className
      )}
    >
      <body
        className="min-h-screen bg-slate-50 pt-12 antialiased"
        suppressHydrationWarning
      >
        <Providers>
          <NavBar />

          {authModal}

          <div className="container mx-auto h-full max-w-7xl pt-12">
            {children}
          </div>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
