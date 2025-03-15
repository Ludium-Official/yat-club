import "@/styles/globals.css";
import type { Metadata } from "next";
import { StoreProvider } from "./StoreProvider";

export const metadata: Metadata = {
  title: "Yat Club",
  description: "Yat Club is a community of Yat enthusiasts.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
