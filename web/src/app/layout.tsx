import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ScribeGov - Sistem Tata Naskah Dinas Elektronik",
  description: "Aplikasi manajemen persuratan dan disposisi elektronik",
  manifest: "/manifest.json",
  themeColor: "#3B9797",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1E3A5F',
              color: '#F0F4F8',
              border: '1px solid #3B9797',
            },
            success: {
              iconTheme: {
                primary: '#3B9797',
                secondary: '#F0F4F8',
              },
            },
            error: {
              iconTheme: {
                primary: '#BF092F',
                secondary: '#F0F4F8',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
