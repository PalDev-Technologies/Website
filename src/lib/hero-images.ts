export const heroImages = {
  home: {
    href: "/",
    src: "/images/Hero_pal.webp",
    width: 1672,
    height: 941,
    sizes: "(max-width: 1024px) 1px, 100vw",
    cssPx: null,
  },
  about: {
    href: "/about",
    src: "/images/PalDev_about.webp",
    width: 1657,
    height: 949,
    sizes: "(max-width: 1024px) 1px, 720px",
    cssPx: 720,
  },
  services: {
    href: "/services",
    src: "/images/services_Paldev.webp",
    width: 1672,
    height: 941,
    sizes: "(max-width: 1024px) 1px, 900px",
    cssPx: 900,
  },
  projects: {
    href: "/projects",
    src: "/images/project_Paldev.webp",
    width: 1671,
    height: 941,
    sizes: "(max-width: 1024px) 1px, 900px",
    cssPx: 900,
  },
  insights: {
    href: "/insights",
    src: "/images/insights_Paldev.webp",
    width: 1671,
    height: 941,
    sizes: "(max-width: 1024px) 1px, 900px",
    cssPx: 900,
  },
  contact: {
    href: "/contact",
    src: "/images/PalDev_LogoNB.webp",
    width: 1535,
    height: 1024,
    sizes: "(max-width: 1024px) 1px, 520px",
    cssPx: 520,
  },
} as const;

export type HeroImageId = keyof typeof heroImages;
