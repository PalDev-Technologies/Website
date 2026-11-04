import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import banner from "@/components/home/FinalCta.module.css";
import { quoteHref } from "@/lib/site";
import styles from "./insights.module.css";

type InsightsCtaProps = {
  titleId?: string;
  title?: string;
  description?: string;
};

export function InsightsCta({
  titleId = "insights-cta-title",
  title = "Have a Technology Challenge in Mind?",
  description = "Let's explore how the right digital solution can support your business.",
}: InsightsCtaProps) {
  return (
    <section className={styles.ctaBand} aria-labelledby={titleId}>
      <div className={banner.banner}>
        <BannerArt />
        <div className={banner.content}>
          <div className={banner.copy}>
            <h2 id={titleId}>{title}</h2>
            <p>{description}</p>
          </div>
          <Link href={quoteHref} className={banner.button}>
            Talk to PalDev
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

function BannerArt() {
  return (
    <svg className={banner.art} viewBox="0 0 1200 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="insights-cta-glow" cx="74%" cy="46%" r="48%">
          <stop offset="0%" stopColor="#087CF5" stopOpacity="0.55" />
          <stop offset="42%" stopColor="#062C62" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#03142C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="insights-cta-core" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#087CF5" stopOpacity="0" />
          <stop offset="72%" stopColor="#4DB7FF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#00CFEF" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="insights-cta-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#03142C" stopOpacity="0.72" />
          <stop offset="58%" stopColor="#03142C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1200" height="210" fill="#03142C" />
      <ellipse cx="860" cy="108" rx="420" ry="140" fill="url(#insights-cta-glow)" />
      <path
        fill="none"
        stroke="url(#insights-cta-core)"
        strokeWidth="3"
        strokeLinecap="round"
        d="M240 150C400 176 540 118 720 108C880 100 1000 74 1140 82C1240 88 1300 66 1360 52"
      />
      <rect width="1200" height="210" fill="url(#insights-cta-shade)" />
    </svg>
  );
}
