import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grano — твій цифровий агроном",
  description:
    "Мобільний додаток для українських фермерів. Управляйте полями, діагностуйте хвороби рослин, замовляйте насіння. Безкоштовно.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
