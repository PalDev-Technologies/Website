import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import { AboutIcon } from "./icons";
import styles from "./about.module.css";

const services = [
  {
    icon: "code",
    title: "Custom Software Development",
    description:
      "We design and build tailored web applications, business systems, and digital platforms that support your unique goals.",
  },
  {
    icon: "workflow",
    title: "Business Digitalization",
    description:
      "We help businesses simplify workflows, modernize operations, and improve efficiency through technology.",
  },
  {
    icon: "brain",
    title: "AI & Data Solutions",
    description:
      "We explore practical opportunities to use data, automation, and intelligent tools to support better decisions.",
  },
  {
    icon: "headset",
    title: "IT Consulting & Technical Support",
    description:
      "We help businesses make informed technology decisions and maintain reliable digital systems.",
  },
] as const;

export function AboutServices() {
  return (
    <section className={styles.expertise} aria-labelledby="expertise-title">
      <div className={styles.inner}>
        <header className={styles.sectionHead}>
          <p className={styles.eyebrow}>Our Expertise</p>
          <h2 id="expertise-title">Technology That Solves Real Problems.</h2>
          <p>
            We combine technical expertise with a practical understanding of business needs to build
            solutions that make a difference.
          </p>
        </header>
        <div className={styles.serviceGrid}>
          {services.map((service) => (
            <article key={service.title} className={styles.serviceCard}>
              <span className={styles.serviceIcon}>
                <AboutIcon name={service.icon} />
              </span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
        <Link href="/services" className={styles.textLink}>
          Explore All Services
          <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}
