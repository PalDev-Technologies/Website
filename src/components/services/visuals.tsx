import Image from "next/image";
import styles from "./services.module.css";

export function SoftwareDashboardVisual() {
  return (
    <figure className={styles.serviceArt}>
      <Image
        src="/images/service-1.png"
        alt="Illustration of a project dashboard with activity, reviews, and reports"
        width={1672}
        height={941}
        sizes="(min-width: 1024px) 900px, 100vw"
        className={styles.serviceArtImage}
      />
    </figure>
  );
}

export function WorkflowVisual() {
  return (
    <figure className={styles.serviceArt}>
      <Image
        src="/images/service-2.png"
        alt="Illustration of a digital workflow with forms, approvals, and connected steps"
        width={1672}
        height={941}
        sizes="(min-width: 1024px) 620px, 100vw"
        className={styles.serviceArtImage}
      />
    </figure>
  );
}

export function AnalyticsVisual() {
  return (
    <figure className={styles.serviceArt}>
      <Image
        src="/images/services-3.png?v=2"
        alt="Illustration of a connected system with a web application, API, database, monitoring, security, and support"
        width={1670}
        height={941}
        sizes="(min-width: 1024px) 620px, 100vw"
        className={styles.serviceArtImage}
      />
    </figure>
  );
}

export function ArchitectureVisual() {
  return (
    <figure className={styles.serviceArt}>
      <Image
        src="/images/services-4.png?v=2"
        alt="Illustration of connected technology services, including strategy, architecture, optimization, troubleshooting, and support"
        width={1670}
        height={941}
        sizes="(min-width: 1024px) 620px, 100vw"
        className={styles.serviceArtImage}
      />
    </figure>
  );
}
