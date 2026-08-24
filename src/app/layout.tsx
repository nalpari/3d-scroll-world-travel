import type { Metadata, Viewport } from "next";
import { Nanum_Myeongjo, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// Self-hosted by next/font (no runtime request to Google). Both families ship the
// full Hangul unicode-range chunks, so Windows — where Pretendard/Nanum Myeongjo are
// not installed and the stack fell back to Malgun Gothic — now matches macOS.
const display = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
  variable: "--font-display",
});

const body = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

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
    <html
      lang="ko"
      className={`${display.variable} ${body.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
