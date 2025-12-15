import type { Metadata } from "next";
import "./globals.css";
import { ApolloProviderWrapper } from "@/lib/apollo-provider";
import { ThemeProvider } from "@/lib/theme-context";
import { Red_Hat_Display } from "next/font/google";

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Project Management System",
  description: "Multi-tenant project management tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${redHatDisplay.className} antialiased h-dvh`}>
        <ThemeProvider>
          <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
