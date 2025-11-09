// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "言间 · AI沟通伴侣",
  description: "让AI帮你把话说得更好",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      {/* 用全局的系统字体，不再从 Google 拉 */}
      <body className="antialiased">{children}</body>
    </html>
  );
}