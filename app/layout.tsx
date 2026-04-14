import "./globals.css";
import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import ChatWidget from "./components/ChatWidget";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nhanh Travel",
  description: "Landing page Nhanh Travel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={beVietnamPro.className}>
        {children}

        {/* CHAT GLOBAL – LUÔN HIỆN Ở MỌI PAGE */}
        <ChatWidget />
      </body>
    </html>
  );
}