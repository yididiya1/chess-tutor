import type { Metadata } from "next";
import { Cinzel, Rajdhani } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import SessionProvider from "./components/SessionProvider";
import Navbar from "./components/Navbar";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chess Tutor",
  description: "Improve your chess skills with interactive practice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${rajdhani.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <div className="pt-16">
              {children}
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
