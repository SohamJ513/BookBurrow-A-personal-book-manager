import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: {
    default: 'BookBurrow',
    template: '%s | BookBurrow'
  },
  description: 'Your cozy reading nook. Track books, set goals, and rediscover your favorite authors.',
  keywords: 'book manager, reading tracker, personal library, book collection, reading goals, book organizer, cozy reading',
  authors: [{ name: 'BookBurrow' }],
  creator: 'BookBurrow',
  publisher: 'BookBurrow',
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: 'BookBurrow',
    description: 'Your cozy reading nook. Track books, set goals, and rediscover your favorite authors.',
    url: 'https://bookburrow.vercel.app',
    siteName: 'BookBurrow',
    images: [
      {
        url: 'https://bookburrow.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BookBurrow - Your Cozy Reading Nook'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BookBurrow',
    description: 'Your cozy reading nook. Track books, set goals, and rediscover your favorite authors.',
    images: ['https://bookburrow.vercel.app/og-image.jpg']
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
                loading: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#3b82f6',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}