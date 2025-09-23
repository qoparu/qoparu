// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Optimize fonts for better performance and support for Cyrillic
const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Спортивная инфраструктура Алматы',
    template: '%s | Алматы Спорт Аналитика'
  },
  description: 'Аналитическая панель для анализа развития спортивной инфраструктуры города Алматы на основе опроса 391 респондента из 8 районов города.',
  keywords: [
    'Алматы',
    'спорт',
    'инфраструктура', 
    'аналитика',
    'опрос',
    'статистика',
    'районы',
    'развитие',
    'панель управления'
  ],
  authors: [
    { name: 'Алматы Спорт Аналитика' }
  ],
  creator: 'Алматы Спорт Аналитика',
  publisher: 'Алматы Спорт Аналитика',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'), // Change to your production URL
  alternates: {
    canonical: '/',
    languages: {
      'ru-RU': '/ru',
      'kk-KZ': '/kk',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    alternateLocale: ['kk_KZ', 'en_US'],
    title: 'Спортивная инфраструктура Алматы - Аналитическая панель',
    description: 'Комплексный анализ результатов опроса населения по развитию спортивной инфраструктуры города Алматы',
    siteName: 'Алматы Спорт Аналитика',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Спортивная инфраструктура Алматы',
    description: 'Аналитика развития спортивной инфраструктуры города Алматы',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when deploying
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <title>Спортивная инфраструктура Алматы</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* <link rel="icon" href="/icon.svg" type="image/svg+xml" /> */}
        {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <meta name="theme-color" content="#4c1d95" />
        <meta name="color-scheme" content="light" />
      </head>
      <body 
        className={`${inter.className} antialiased bg-gray-100 text-gray-900`}
        suppressHydrationWarning={true}
      >
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded-md z-50"
        >
          Перейти к основному содержанию
        </a>
        
        {/* Main content */}
        <div id="main-content" role="main">
          {children}
        </div>

        {/* Analytics scripts would go here */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            {/* <Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
            <Script id="google-analytics">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'GA_MEASUREMENT_ID');
              `}
            </Script> */}
            
            {/* Yandex Metrica */}
            {/* <Script id="yandex-metrica">
              {`
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                ym(YANDEX_METRICA_ID, "init", {
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true
                });
              `}
            </Script> */}
          </>
        )}
      </body>
    </html>
  );
}