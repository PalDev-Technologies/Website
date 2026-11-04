import banner from "@/components/home/FinalCta.module.css";
import styles from "./contact.module.css";

export function ContactCta() {
  return (
    <section className={styles.ctaBand} aria-labelledby="contact-cta-title">
      <div className={banner.banner}>
        <BannerArt />
        <div className={banner.content}>
          <div className={banner.copy}>
            <h2 id="contact-cta-title">Ready to Bring Your Idea to Life?</h2>
            <p>Let&apos;s explore how the right technology can turn your vision into a practical solution.</p>
          </div>
          <a href="#technical-quote" className={banner.button}>
            Get a Technical Quote
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BannerArt() {
  return (
    <svg className={banner.art} viewBox="0 0 1200 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="contact-cta-glow" cx="74%" cy="46%" r="48%">
          <stop offset="0%" stopColor="#087CF5" stopOpacity="0.55" />
          <stop offset="42%" stopColor="#062C62" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#03142C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="contact-cta-core" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#087CF5" stopOpacity="0" />
          <stop offset="72%" stopColor="#4DB7FF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#00CFEF" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="contact-cta-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#03142C" stopOpacity="0.72" />
          <stop offset="58%" stopColor="#03142C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1200" height="210" fill="#03142C" />
      <ellipse cx="860" cy="108" rx="420" ry="140" fill="url(#contact-cta-glow)" />
      <path
        fill="none"
        stroke="url(#contact-cta-core)"
        strokeWidth="3"
        strokeLinecap="round"
        d="M240 150C400 176 540 118 720 108C880 100 1000 74 1140 82C1240 88 1300 66 1360 52"
      />
      <rect width="1200" height="210" fill="url(#contact-cta-shade)" />
    </svg>
  );
}
