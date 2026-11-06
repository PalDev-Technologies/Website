import Image from "next/image";
import { heroImages, type HeroImageId } from "@/lib/hero-images";

export function HeroArt({
  id,
  alt,
  className,
}: {
  id: HeroImageId;
  alt: string;
  className?: string;
}) {
  const image = heroImages[id];

  return (
    <Image
      src={image.src}
      alt={alt}
      width={image.width}
      height={image.height}
      sizes={image.sizes}
      quality={75}
      priority
      fetchPriority="high"
      className={className}
    />
  );
}
