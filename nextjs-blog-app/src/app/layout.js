import { Geist, Geist_Mono } from "next/font/google";
import Layout from "./components/Layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "博客系统",
  description: "基于Next.js的博客系统",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
