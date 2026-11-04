import Link from "next/link";
import { ServiceGlyph } from "@/components/ui/icons";
import { services, type ServiceIcon } from "@/lib/site";
import styles from "./ServiceStrip.module.css";

function HeadsetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <path d="M4 13v3.5A2.5 2.5 0 0 0 6.5 19H8v-6H6.5A2.5 2.5 0 0 0 4 15.5V13Z" />
      <path d="M20 13v3.5A2.5 2.5 0 0 1 17.5 19H16v-6h1.5A2.5 2.5 0 0 1 20 15.5V13Z" />
    </svg>
  );
}

function StripIcon({ name }: { name: ServiceIcon }) {
  if (name === "consulting") return <HeadsetIcon />;
  return <ServiceGlyph name={name} />;
}

const labels = [
  ["Custom Software", "Development"],
  ["Business", "Digitalization"],
  ["AI & Data", "Solutions"],
  ["Consulting &", "Technical Support"],
] as const;

export function ServiceStrip() {
  return (
    <section className={styles.strip} aria-label="Services">
      <ul className={styles.list}>
        {services.map((service, index) => (
          <li key={service.id}>
            <Link href={`/services#${service.id}`} className={styles.item}>
              <span className={styles.icon}>
                <StripIcon name={service.icon} />
              </span>
              <span className={styles.label}>
                {labels[index][0]}
                <br />
                {labels[index][1]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
