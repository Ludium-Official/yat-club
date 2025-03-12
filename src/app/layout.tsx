import "@/styles/globals.css";
import type { Metadata } from "next";
import { Provider } from "./provider";

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
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
