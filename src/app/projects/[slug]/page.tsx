import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/projects/CaseStudy";
import { adjacentProject, portfolio, projectBySlug } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return portfolio.filter((project) => project.published).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return { title: "Project" };

  const image = project.clientLogo
    ? [
        {
          url: project.clientLogo.src,
          width: project.clientLogo.width,
          height: project.clientLogo.height,
          alt: project.clientLogo.alt,
        },
      ]
    : undefined;

  return {
    title: { absolute: project.seoTitle },
    description: project.seoDescription,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: project.seoTitle,
      description: project.seoDescription,
      url: `/projects/${project.slug}`,
      images: image,
    },
    twitter: {
      title: project.seoTitle,
      description: project.seoDescription,
      images: image?.map((item) => item.url),
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  return <CaseStudy project={project} next={adjacentProject(project.slug)} />;
}
