/**
 * ODD — 한국 자연 여행 스크롤 월드
 *
 * 카메라는 씬 안으로 내려갔다가(dive) 하늘로 빠져나와 미니어처 지도 위를 날아
 * 다음 씬으로 들어갑니다(connector). 순서는 지리 순(강원 → 경북 → 전남 → 제주)이라
 * 지도 위 비행 경로가 실제 국토를 따라갑니다.
 *
 * connectors[i] 는 sections[i] 와 sections[i+1] 사이에 놓입니다 → 길이는 항상 N-1.
 * 커넥터의 양 끝점은 이웃 다이브의 "실제 렌더된 프레임"이어야 합니다 (seam 법칙).
 */

export type Section = {
  id: string;
  label: string;
  still: string;
  stillMobile?: string;
  clip: string;
  clipMobile?: string;
  accent: string;
  scroll?: number;
  linger?: number;
  eyebrow: string;
  title: string;
  body: string;
  tags?: string[];
  cta?: {
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
};

export const BRAND = { name: "ODD", href: "#top" };

/** 씬 배경색 계열 — 포스터가 페이지 배경에 자연스럽게 얹히도록 맞춰둡니다. */
export const PAGE_BG = "#F8EBD8";

export const SECTIONS: Section[] = [
  {
    id: "seorak",
    label: "설악산",
    still: "/sw/seorak.webp",
    stillMobile: "/sw/seorak-m.webp",
    clip: "/sw/vid/seorak.mp4",
    clipMobile: "/sw/vid/seorak-m.mp4",
    accent: "#C4552F",
    scroll: 1.7,
    linger: 0.45,
    eyebrow: "ODD · 한국 자연 여행",
    title: "한국을, 조금 이상한 각도에서.",
    body: "익숙한 이름의 산과 바다를 아무도 서지 않는 자리에서 봅니다.",
    tags: ["6개 여정", "소수 인원"],
  },
  {
    id: "jeongdongjin",
    label: "정동진",
    still: "/sw/jeongdongjin.webp",
    stillMobile: "/sw/jeongdongjin-m.webp",
    clip: "/sw/vid/jeongdongjin.mp4",
    clipMobile: "/sw/vid/jeongdongjin-m.mp4",
    accent: "#E9B949",
    eyebrow: "첫 번째 아침",
    title: "기차가 바다에 가장 가까워지는 곳",
    body: "플랫폼에서 모래까지 열 걸음, 해는 선로 끝에서 올라옵니다.",
    tags: ["동해", "일출"],
  },
  {
    id: "hahoe",
    label: "하회마을",
    still: "/sw/hahoe.webp",
    stillMobile: "/sw/hahoe-m.webp",
    clip: "/sw/vid/hahoe.mp4",
    clipMobile: "/sw/vid/hahoe-m.mp4",
    accent: "#1B3A34",
    eyebrow: "물이 감아 도는 마을",
    title: "강이 마을을 한 바퀴 돌아 나갑니다",
    body: "600년 동안 자리를 옮기지 않은 기와지붕 아래로 걸어 들어갑니다.",
    tags: ["안동", "고택 숙박"],
  },
  {
    id: "boseong",
    label: "보성 녹차밭",
    still: "/sw/boseong.webp",
    stillMobile: "/sw/boseong-m.webp",
    clip: "/sw/vid/boseong.mp4",
    clipMobile: "/sw/vid/boseong-m.mp4",
    accent: "#4F7A5B",
    eyebrow: "초록이 계단이 될 때",
    title: "산등성이를 따라 그은 초록 등고선",
    body: "새벽 안개가 걷히는 시간에 맞춰 계단 맨 위까지 올라갑니다.",
    tags: ["보성", "다원 산책"],
  },
  {
    id: "suncheon",
    label: "순천만",
    still: "/sw/suncheon.webp",
    stillMobile: "/sw/suncheon-m.webp",
    clip: "/sw/vid/suncheon.mp4",
    clipMobile: "/sw/vid/suncheon-m.mp4",
    accent: "#7FA6B8",
    eyebrow: "갈대와 갯벌 사이",
    title: "물길이 S자로 누워 있습니다",
    body: "해질녘 나무 데크 끝에 서면 새 떼가 한 번에 날아오릅니다.",
    tags: ["순천", "철새"],
  },
  {
    id: "seongsan",
    label: "성산일출봉",
    still: "/sw/seongsan.webp",
    stillMobile: "/sw/seongsan-m.webp",
    clip: "/sw/vid/seongsan.mp4",
    clipMobile: "/sw/vid/seongsan-m.mp4",
    accent: "#E9B949",
    scroll: 1.8,
    linger: 0.5,
    eyebrow: "여정의 끝",
    title: "바다에서 솟은 분화구 위에서",
    body: "유채밭을 지나 능선 계단을 오르면, 여기서 여정이 끝납니다.",
    tags: ["제주", "성산일출봉"],
    cta: {
      primary: { label: "여정 예약하기", href: "#book" },
      secondary: { label: "일정 자세히 보기", href: "#itinerary" },
    },
  },
];

/** length === SECTIONS.length - 1 */
export const CONNECTORS: string[] = [
  "/sw/vid/conn1.mp4",
  "/sw/vid/conn2.mp4",
  "/sw/vid/conn3.mp4",
  "/sw/vid/conn4.mp4",
  "/sw/vid/conn5.mp4",
];

export const CONNECTORS_MOBILE: string[] = [
  "/sw/vid/conn1-m.mp4",
  "/sw/vid/conn2-m.mp4",
  "/sw/vid/conn3-m.mp4",
  "/sw/vid/conn4-m.mp4",
  "/sw/vid/conn5-m.mp4",
];
