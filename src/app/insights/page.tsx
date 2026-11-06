import type { Metadata } from "next";
import { FeaturedInsight } from "@/components/insights/FeaturedInsight";
import { InsightLibrary } from "@/components/insights/InsightLibrary";
import { InsightsCta } from "@/components/insights/InsightsCta";
import { InsightsHero } from "@/components/insights/InsightsHero";
import { TopicExplorer } from "@/components/insights/TopicExplorer";

const title = "Insights";
const description =
  "Explore practical insights from PalDev Technologies on software development, AI, data, digital transformation, and modern business technology.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/insights",
  },
  openGraph: {
    title: "Insights | PalDev Technologies",
    description,
    url: "/insights",
  },
  twitter: {
    title: "Insights | PalDev Technologies",
    description,
  },
};

export default function InsightsPage() {
  return (
    <>
      <InsightsHero />
      <FeaturedInsight />
      <InsightLibrary />
      <TopicExplorer />
      <InsightsCta />
    </>
  );
}
