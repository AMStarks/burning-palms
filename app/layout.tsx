import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { GlobalTypography } from "./components/GlobalTypography";
import { GlobalColors } from "./components/GlobalColors";
import { CustomCSS } from "./components/CustomCSS";
import { getSiteSettings } from "@/lib/settings";

function simpleHash(input: string) {
  let h = 5381
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i)
  }
  return (h >>> 0).toString(16)
}

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
  // Use the admin-provided favicon URL (when set) and add cache-busting.
  // Browsers cache favicons aggressively; this forces updates when the favicon setting changes.
  const rawFavicon = (siteSettings.faviconUrl || "/icon").trim()
  const faviconVersion = simpleHash(rawFavicon)
  const favicon = `${rawFavicon}${rawFavicon.includes("?") ? "&" : "?"}v=${faviconVersion}`
  const shareTitle = siteSettings.shareTitle || siteSettings.title
  const shareDescription = siteSettings.shareDescription || siteSettings.description || siteSettings.tagline
  const shareImage = siteSettings.shareImageUrl || "/opengraph-image"
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: siteSettings.title,
      template: `%s | ${siteSettings.title}`,
    },
    description: shareDescription,
    icons: {
      icon: [{ url: favicon }],
      shortcut: [{ url: favicon }],
    },
    openGraph: {
      type: "website",
      url: baseUrl,
      title: shareTitle,
      description: shareDescription,
      siteName: siteSettings.title,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: `${siteSettings.title} preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: shareDescription,
      images: [shareImage],
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
