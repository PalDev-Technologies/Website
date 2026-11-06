import type { InsightCategoryId } from "@/lib/insight-catalog";

export function TopicArt({ category }: { category: InsightCategoryId }) {
  const shift = {
    "software-development": 0,
    "ai-data": 36,
    "digital-transformation": 72,
    "technology-security": 18,
    "business-innovation": 54,
  }[category];

  return (
    <svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="640" height="400" fill="#EEF4FA" />
      <circle cx={220 + shift} cy="190" r="120" fill="#087CF5" fillOpacity="0.08" />
      <circle cx={420 - shift / 3} cy="210" r="86" stroke="#087CF5" strokeOpacity="0.35" />
      <rect x={250 + shift / 4} y="118" width="180" height="120" rx="20" fill="#FFFFFF" stroke="#08D8ED" strokeOpacity="0.8" />
      <path d="M120 280C210 230 250 210 320 188" stroke="#087CF5" strokeWidth="1.6" />
      <path d="M430 160C500 120 540 100 590 78" stroke="#087CF5" strokeWidth="1.6" />
      <path d="M250 250C200 300 170 320 120 340" stroke="#08D8ED" strokeWidth="1.6" />
      <circle cx="120" cy="280" r="5" fill="#087CF5" />
      <circle cx="320" cy="188" r="5" fill="#08D8ED" />
      <circle cx="430" cy="160" r="5" fill="#087CF5" />
      <circle cx="590" cy="78" r="5" fill="#08D8ED" />
      <circle cx="120" cy="340" r="5" fill="#087CF5" />
    </svg>
  );
}
