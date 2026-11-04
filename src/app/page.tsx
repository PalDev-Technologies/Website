import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { ServiceStrip } from "@/components/home/ServiceStrip";
import { WhyChoose } from "@/components/home/WhyChoose";
import { brand } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "PalDev Technologies | Technology Solutions for Real Impact",
  },
  description: brand.description,
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceStrip />
      <WhyChoose />
      <FeaturedProjects />
      <FinalCta />
    </>
  );
}
