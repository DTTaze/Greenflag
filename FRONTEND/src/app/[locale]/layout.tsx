import "../../styles/index.css";

import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "sonner";

import { NotificationProvider } from "@/src/components/ui/NotificationProvider";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { routing } from "@/src/i18n/routing";
import QueryProvider from "@/src/providers/QueryProvider";
import { ThemeProvider } from "@/src/providers/ThemeProvider";

const inter = Inter({
  subsets: ["vietnamese", "latin"],
  display: "swap",
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Green Flag",
  description: "Protect the environment",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NotificationProvider>
                <TooltipProvider>{children}</TooltipProvider>
                <Toaster richColors closeButton position="top-right" />
              </NotificationProvider>
            </ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
        <Script
          src="https://unpkg.com/html5-qrcode"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
