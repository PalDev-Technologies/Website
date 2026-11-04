import type { Metadata } from "next";
import { AboutCta } from "@/components/about/AboutCta";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutServices } from "@/components/about/AboutServices";
import { MissionVision } from "@/components/about/MissionVision";
import { OurPrinciples } from "@/components/about/OurPrinciples";
import { OurProcess } from "@/components/about/OurProcess";
import { WhoWeAre } from "@/components/about/WhoWeAre";

const title = "About PalDev Technologies | Software & Digital Solutions";
const description =
  "Discover PalDev Technologies, a software development company focused on practical digital solutions, business digitalization, AI, and technology consulting.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title,
    description,
    url: "/about",
  },
  twitter: {
    title,
    description,
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <WhoWeAre />
      <MissionVision />
      <AboutServices />
      <OurProcess />
      <OurPrinciples />
      <AboutCta />
    </>
  );
}
