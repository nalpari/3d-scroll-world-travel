import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ODD — 한국을, 조금 이상한 각도에서",
  description:
    "설악산에서 성산일출봉까지. 스크롤하면 카메라가 미니어처 한국 위를 날아 여섯 개의 풍경 속으로 들어갑니다.",
};

// viewport-fit=cover is required for the engine's safe-area handling on notched phones.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F8EBD8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
