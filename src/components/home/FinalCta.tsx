import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import { quoteHref } from "@/lib/site";
import styles from "./FinalCta.module.css";

export function FinalCta() {
  return (
    <section className={styles.section} aria-labelledby="cta-title">
      <div className={styles.banner}>
        <BannerArt />
        <div className={styles.content}>
          <div className={styles.copy}>
            <h2 id="cta-title">
              Ready to Digitalize
              <br />
              Your Business?
            </h2>
            <p>Let&apos;s build something remarkable.</p>
          </div>
          <Link href={quoteHref} className={styles.button}>
            Get in Touch
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

function BannerArt() {
  return (
    <svg className={styles.art} viewBox="0 0 1200 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="cta-glow" cx="74%" cy="46%" r="48%">
          <stop offset="0%" stopColor="#087CF5" stopOpacity="0.55" />
          <stop offset="42%" stopColor="#062C62" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#03142C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cta-cyan" cx="88%" cy="38%" r="32%">
          <stop offset="0%" stopColor="#00CFEF" stopOpacity="0.42" />
          <stop offset="55%" stopColor="#087CF5" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#03142C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cta-band" x1="0" y1="0.5" x2="1" y2="0.35">
          <stop offset="0%" stopColor="#062C62" stopOpacity="0" />
          <stop offset="28%" stopColor="#062C62" stopOpacity="0.15" />
          <stop offset="52%" stopColor="#087CF5" stopOpacity="0.45" />
          <stop offset="78%" stopColor="#087CF5" stopOpacity="0.82" />
          <stop offset="100%" stopColor="#00CFEF" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="cta-band-deep" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#03142C" stopOpacity="0" />
          <stop offset="40%" stopColor="#062C62" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#087CF5" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="cta-core" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#087CF5" stopOpacity="0" />
          <stop offset="46%" stopColor="#087CF5" stopOpacity="0.15" />
          <stop offset="72%" stopColor="#4DB7FF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#00CFEF" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="cta-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#03142C" stopOpacity="0.72" />
          <stop offset="34%" stopColor="#03142C" stopOpacity="0.28" />
          <stop offset="58%" stopColor="#03142C" stopOpacity="0" />
        </linearGradient>
        <filter id="cta-blur" x="-15%" y="-60%" width="130%" height="220%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="cta-soft" x="-10%" y="-40%" width="120%" height="180%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>
      <rect width="1200" height="210" fill="#03142C" />
      <ellipse cx="860" cy="108" rx="420" ry="140" fill="url(#cta-glow)" />
      <ellipse cx="1020" cy="72" rx="220" ry="90" fill="url(#cta-cyan)" />
      <path
        filter="url(#cta-blur)"
        fill="url(#cta-band-deep)"
        d="M120 176C300 150 460 198 660 168C860 138 980 168 1160 142C1240 130 1300 146 1320 138L1320 188C1180 206 1000 176 820 196C620 220 400 188 220 206C160 212 120 198 120 198Z"
      />
      <path
        fill="url(#cta-band)"
        d="M220 158C380 186 520 124 700 112C860 102 980 78 1120 86C1220 92 1280 70 1340 58L1340 108C1240 124 1140 112 1000 124C840 138 720 150 560 156C400 162 300 186 220 198Z"
      />
      <path
        fill="url(#cta-band)"
        opacity="0.72"
        d="M620 34C790 8 940 62 1100 34C1200 16 1280 40 1340 22L1340 58C1220 80 1100 48 960 68C820 88 700 56 620 74Z"
      />
      <path
        fill="none"
        stroke="url(#cta-core)"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#cta-soft)"
        d="M240 150C400 176 540 118 720 108C880 100 1000 74 1140 82C1240 88 1300 66 1360 52"
      />
      <path
        fill="none"
        stroke="url(#cta-core)"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.8"
        d="M640 46C800 22 960 70 1120 42C1220 24 1300 46 1360 30"
      />
      <rect width="1200" height="210" fill="url(#cta-shade)" />
    </svg>
  );
}
