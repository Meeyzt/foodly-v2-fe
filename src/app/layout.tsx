import type { Metadata } from "next";
import { MockProvider } from "./mock-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foodly v2 FE",
  description: "Greenfield frontend for Foodly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MockProvider>
          <main>{children}</main>
        </MockProvider>
      </body>
    </html>
  );
}
