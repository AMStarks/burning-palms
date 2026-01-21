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
  const baseUrl = process.env.NEXTAUTH_URL || "https://burningpalms.au"
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: siteSettings.title,
      template: `%s | ${siteSettings.title}`,
    },
    description: siteSettings.description || siteSettings.tagline,
    icons: {
      icon: [{ url: "/icon", type: "image/png" }],
      shortcut: ["/favicon.ico"],
    },
    openGraph: {
      type: "website",
      url: baseUrl,
      title: siteSettings.title,
      description: siteSettings.description || siteSettings.tagline,
      siteName: siteSettings.title,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${siteSettings.title} preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteSettings.title,
      description: siteSettings.description || siteSettings.tagline,
      images: ["/opengraph-image"],
    },
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
