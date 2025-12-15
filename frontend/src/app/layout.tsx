import type { Metadata } from "next";
import "./globals.css";
import { ApolloProviderWrapper } from "@/lib/apollo-provider";

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
    <html lang="en">
      <body className="antialiased h-dvh">
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
      </body>
    </html>
  );
}
