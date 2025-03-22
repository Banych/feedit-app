import NavBar from '@/components/nav-bar';
import Providers from '@/components/providers/providers';
import { Toaster } from '@/components/ui/toaster';
import { siteConfig } from '@/config';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: `${siteConfig.title} by Vlad Banykin`,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  authors: [
    {
      name: 'Vlad Banykin',
      url: 'https://github.com/Banych',
    },
  ],
  creator: 'Vlad Banykin',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: `${siteConfig.title} by Vlad Banykin`,
    description: siteConfig.description,
    siteName: `${siteConfig.title} by Vlad Banykin`,
    images: [`${siteConfig.url}/og-image.png`],
  },
  twitter: {
    card: 'summary',
    title: `${siteConfig.title} by Vlad Banykin`,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og-image.png`],
    creator: '@BanykinVlad',
    site: siteConfig.url,
  },
  icons: {
    icon: '/favicon.ico',
  },
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
        className="relative min-h-screen bg-slate-50 antialiased"
        suppressHydrationWarning
      >
        <NextTopLoader showSpinner={false} />
        <Providers>
          <NavBar />

          {authModal}

          <div className="container max-w-7xl pt-6 md:pt-12">{children}</div>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
