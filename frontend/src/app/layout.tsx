import type { Metadata } from "next";
import "./globals.css";
import { ApolloProviderWrapper } from "@/lib/apollo-provider";
import { AuthProvider } from "@/lib/auth-context";

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
      <body className="antialiased">
        <ApolloProviderWrapper>
          <AuthProvider>{children}</AuthProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
