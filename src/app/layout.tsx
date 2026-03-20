import type { Metadata } from "next";
import { Space_Grotesk, Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CrossFit Nord BVS",
    template: "%s | CrossFit Nord BVS",
  },
  description:
    "CrossFit Nord BVS - Sala de CrossFit din Bucuresti. Antrenamente de grup, antrenori certificati, abonamente flexibile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`dark ${spaceGrotesk.variable} ${roboto.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
