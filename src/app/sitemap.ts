import type { MetadataRoute } from "next";
import { publishedArticles } from "@/lib/insights";
import { publishedProjects } from "@/lib/projects";
import { brand } from "@/lib/site";

const pages = ["", "/about", "/services", "/projects", "/insights", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((path) => ({
      url: `${brand.url}${path || "/"}`,
    })),
    ...publishedProjects().map((project) => ({
      url: `${brand.url}/projects/${project.slug}`,
    })),
    ...publishedArticles().map((article) => ({
      url: `${brand.url}/insights/${article.slug}`,
      lastModified: article.updatedAt ?? article.publishedAt,
    })),
  ];
}
