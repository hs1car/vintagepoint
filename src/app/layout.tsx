import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloating } from "@/components/WhatsAppFloating";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "فينتج بوينت – سيارات كلاسيك في دبي | Vintage Point – Classic Cars in Dubai",
  description: "اكتشف مجموعتنا المختارة بعناية من السيارات الكلاسيكية النادرة في دبي، الإمارات. سيارات أصلية مع ضمان شامل وخدمة متميزة. | Discover our carefully curated collection of rare classic cars in Dubai, UAE. Authentic cars with full warranty and premium service.",
  keywords: ["سيارات كلاسيك", "دبي", "الإمارات", "فينتج بوينت", "قطع غيار", "سيارات نادرة", "سيارات فينتج", "classic cars", "Dubai", "UAE", "Vintage Point", "vintage cars", "rare cars", "spare parts", "classic car dealership", "classic car for sale"],
  authors: [{ name: "Vintage Point L.L.C" }],
  creator: "Vintage Point L.L.C",
  publisher: "Vintage Point L.L.C",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "فينتج بوينت – سيارات كلاسيك في دبي",
    description: "اكتشف مجموعتنا المختارة بعناية من السيارات الكلاسيكية النادرة في دبي، الإمارات | Discover our carefully curated collection of rare classic cars in Dubai, UAE",
    url: "https://vintagepoint.ae",
    siteName: "Vintage Point L.L.C",
    type: "website",
    locale: "ar_AE",
    images: [
      {
        url: "https://vintagepoint.ae/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "فينتج بوينت - سيارات كلاسيك في دبي",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vintagepoint",
    creator: "@vintagepoint",
    title: "فينتج بوينت – سيارات كلاسيك في دبي",
    description: "اكتشف مجموعتنا المختارة بعناية من السيارات الكلاسيكية النادرة",
    images: ["https://vintagepoint.ae/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <WishlistProvider>
            <LanguageProvider>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <WhatsAppFloating />
              <Toaster />
            </LanguageProvider>
          </WishlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
