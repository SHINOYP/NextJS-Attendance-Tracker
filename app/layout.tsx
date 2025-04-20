import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";
import ProtectedRoute from "../components/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AlertProvider } from "@/context/AlertContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: " NSS PULSE – Track the Heartbeat of Campus Clubs  ",
  description: "Smart attendance tracking for NSS sports clubs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>
          <AuthProvider>
            <ProtectedRoute>
              <AlertProvider>
                <SidebarProvider>
                  {children}
                </SidebarProvider>
              </AlertProvider>
            </ProtectedRoute>
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
