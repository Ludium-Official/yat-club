import "@/styles/globals.css";
import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import { Toaster } from "sonner";
import { StoreProvider } from "./StoreProvider";

export const metadata: Metadata = {
  title: "Yat Club",
  description: "Yat Club is a community of Yat enthusiasts.",
  manifest: "/manifest.json",
};

const alexandria = Alexandria({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={alexandria.className}>
      <body>
        <StoreProvider>{children}</StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
