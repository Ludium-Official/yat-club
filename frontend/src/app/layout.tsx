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
      <script
        defer
        src="https://static.moonpay.com/web-sdk/v1/moonpay-web-sdk.min.js"
      ></script>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
