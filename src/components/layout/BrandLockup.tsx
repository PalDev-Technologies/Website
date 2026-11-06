import Image from "next/image";
import { brand } from "@/lib/site";
import styles from "./BrandLockup.module.css";

export function BrandLockup({
  size = "md",
  priority = false,
}: {
  size?: "md" | "lg" | "nav";
  priority?: boolean;
}) {
  const dimension = size === "lg" ? 104 : 84;

  return (
    <span className={`${styles.brand} ${styles[size]}`}>
      <Image
        src={brand.icon}
        alt=""
        width={dimension}
        height={dimension}
        priority={priority}
        className={styles.icon}
      />
      <span className={styles.text}>
        <span className={styles.word}>
          <span className={styles.pal}>Pal</span>
          <span className={styles.dev}>Dev</span>
        </span>
        <span className={styles.sub}>Technologies</span>
      </span>
    </span>
  );
}
