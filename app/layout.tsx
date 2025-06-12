import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeSwitcher from "./components/ThemeSwitcher";
import SessionProvider from "./components/SessionProvider";
import Navbar from "./components/Navbar";

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
      <body
        className={`${exo2.variable} font-exo2 antialiased`}
      >
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            {/* Theme Switcher positioned in top right */}
            <div className="fixed top-20 right-4 z-40">
              <ThemeSwitcher />
            </div>
            <div className="pt-16">
              {children}
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
