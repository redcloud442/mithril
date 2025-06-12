import QueryProvider from "@/components/QueryProvider/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Omnix Global",
  description: "Step into Omnix Global — Your path to digital prosperity.",
  openGraph: {
    title: "Omnix Global",
    description: "Step into Omnix Global — Your path to digital prosperity.",
    url: "https://www.omnix-global.com",
    siteName: "Omnix Global",
    images: [
      {
        url: "https://www.omnix-global.com/assets/icons/logo.ico",
        width: 1200,
        height: 630,
        alt: "Omnix Global Banner",
      },
    ],
    type: "website",
  },
};

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={roboto.className}>
      <body>
        <main>
          {/* <RouterTransition /> */}
          <QueryProvider>{children}</QueryProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
