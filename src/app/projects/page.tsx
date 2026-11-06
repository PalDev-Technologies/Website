import type { Metadata } from "next";
import { ProjectsCta } from "@/components/projects/ProjectsCta";
import { ProjectsHero } from "@/components/projects/ProjectsHero";
import { SelectedWork } from "@/components/projects/SelectedWork";
import { publishedProjects } from "@/lib/projects";

const title = "Projects";
const description =
  "Explore selected digital solutions developed by PalDev Technologies, including a furniture e-commerce platform and an employee attendance and payroll system.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | PalDev Technologies",
    description,
    url: "/projects",
  },
  twitter: {
    title: "Projects | PalDev Technologies",
    description,
  },
};

export default function ProjectsPage() {
  return (
    <>
      <ProjectsHero />
      <SelectedWork projects={publishedProjects()} />
      <ProjectsCta />
    </>
  );
}
