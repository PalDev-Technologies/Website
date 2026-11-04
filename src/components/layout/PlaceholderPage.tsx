import Link from "next/link";
import styles from "./PlaceholderPage.module.css";

export function PlaceholderPage({
  title,
  lede,
  anchor,
}: {
  title: string;
  lede: string;
  anchor?: string;
}) {
  return (
    <section id={anchor} className={styles.page}>
      <div className={`container ${styles.panel}`}>
        <p className={styles.kicker}>Under construction</p>
        <h1>{title}</h1>
        <p>{lede}</p>
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </section>
  );
}
