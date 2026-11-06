import type { Metadata } from "next";
import { DevelopmentProcess } from "@/components/services/DevelopmentProcess";
import { ServiceSections } from "@/components/services/ServiceSections";
import { ServicesCta } from "@/components/services/ServicesCta";
import { ServicesFaq } from "@/components/services/ServicesFaq";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesOverview } from "@/components/services/ServicesOverview";
import { SolutionsGrid } from "@/components/services/SolutionsGrid";

const title = "Services";
const description =
  "Explore PalDev Technologies' custom software development, business digitalization, AI and data solutions, and IT consulting services for modern businesses.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services | PalDev Technologies",
    description,
    url: "/services",
  },
  twitter: {
    title: "Services | PalDev Technologies",
    description,
  },
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesOverview />
      <ServiceSections />
      <SolutionsGrid />
      <DevelopmentProcess />
      <ServicesFaq />
      <ServicesCta />
    </>
  );
}
