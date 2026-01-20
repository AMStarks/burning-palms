import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { GlobalTypography } from "./components/GlobalTypography";
import { GlobalColors } from "./components/GlobalColors";
import { CustomCSS } from "./components/CustomCSS";
import { getSiteSettings } from "@/lib/settings";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  return {
    title: `${siteSettings.title} | ${siteSettings.tagline}`,
    description: siteSettings.description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bebasNeue.variable} antialiased`}
      >
        <GlobalTypography />
        <GlobalColors />
        <CustomCSS />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
