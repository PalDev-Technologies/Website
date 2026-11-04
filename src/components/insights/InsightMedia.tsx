import Image from "next/image";
import type { InsightCategoryId } from "@/lib/insight-catalog";
import { TopicArt } from "./art";
import styles from "./insights.module.css";

type InsightMediaProps = {
  category: InsightCategoryId;
  coverImage: string | null;
  coverAlt: string;
  priority?: boolean;
  sizes: string;
};

export function InsightMedia({ category, coverImage, coverAlt, priority = false, sizes }: InsightMediaProps) {
  return (
    <div className={styles.media}>
      {coverImage ? (
        <Image
          src={coverImage}
          alt={coverAlt}
          fill
          priority={priority}
          sizes={sizes}
          className={styles.cover}
        />
      ) : (
        <TopicArt category={category} />
      )}
    </div>
  );
}
