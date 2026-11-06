"use client";

import { getImageProps } from "next/image";
import { heroImages } from "@/lib/hero-images";

const prefetched = new Set<string>();

function urlForViewport(srcSet: string, cssPx: number) {
  const target = Math.ceil(cssPx * (window.devicePixelRatio || 1));
  const candidates = srcSet
    .split(",")
    .map((part) => {
      const [url, descriptor] = part.trim().split(/\s+/);
      return { url, width: Number.parseInt(descriptor, 10) };
    })
    .filter((item) => item.url && Number.isFinite(item.width))
    .sort((a, b) => a.width - b.width);

  return (candidates.find((item) => item.width >= target) ?? candidates[candidates.length - 1])?.url;
}

export function prefetchHero(href: string) {
  if (!window.matchMedia("(min-width: 1025px)").matches) return;

  const image = Object.values(heroImages).find((item) => item.href === href);
  if (!image) return;

  const cssPx = image.cssPx ?? window.innerWidth;
  const { props } = getImageProps({
    alt: "",
    src: image.src,
    width: image.width,
    height: image.height,
    sizes: `${cssPx}px`,
    quality: 75,
  });
  const url = props.srcSet ? urlForViewport(props.srcSet, cssPx) : props.src;
  if (!url || prefetched.has(url)) return;

  prefetched.add(url);
  const img = new Image();
  img.decoding = "async";
  img.src = url;
}
