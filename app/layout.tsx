import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const publicSans = Public_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "CV Analyzer",
  description: "Analyze your CV with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${publicSans.className} antialiased relative`}
        suppressHydrationWarning
      >
        <main>
          {children}
        </main>
        <div className="absolute top-0 left-0 right-0">
          <Navbar />
        </div>
      </body>
    </html>
  );
}
