/**
 * English site content.
 * Arabic copy and RTL routing are not implemented yet.
 * Copy is centralized here so a future locale can be added beside this module.
 */

export const locale = "en" as const;

export const brand = {
  name: "PalDev Technologies",
  url: "https://paldev.tech",
  icon: "/images/Paldev_NewIcon.png",
  logoPoster: "/images/paldev_newLogo.png",
  description:
    "We design and develop reliable digital solutions that help businesses grow, work smarter, and turn ambitious ideas into reality.",
  footerDescription:
    "Digital solutions designed to help businesses work smarter and grow with confidence.",
} as const;

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
] as const;

export const quoteHref = "/contact#quote";

export const companyLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
] as const;

export const serviceLinks = [
  { href: "/services#software-development", label: "Software Development" },
  { href: "/services#business-digitalization", label: "Business Digitalization" },
  { href: "/services#ai-data-solutions", label: "AI & Data Solutions" },
  { href: "/services#it-consulting", label: "IT Consulting" },
] as const;

export const resourceLinks = [
  { href: "/insights", label: "Insights" },
  { href: quoteHref, label: "Get a Quote" },
] as const;

export const socialLinks: ReadonlyArray<{
  id: "linkedin" | "x" | "instagram" | "facebook";
  label: string;
  href: string | null;
}> = [
  { id: "linkedin", label: "LinkedIn", href: null },
  { id: "x", label: "X", href: null },
  { id: "instagram", label: "Instagram", href: null },
  { id: "facebook", label: "Facebook", href: null },
];

export type ServiceIcon = "code" | "workflow" | "data" | "consulting";
export type ValueIcon = "sliders" | "layers" | "chat" | "partnership";
export type ProjectVariant = "operations" | "commerce" | "portal";

export const services = [
  {
    id: "software-development",
    title: "Custom Software Development",
    description: "Tailored software solutions designed around your business needs.",
    icon: "code",
  },
  {
    id: "business-digitalization",
    title: "Business Digitalization",
    description: "Modern tools and streamlined workflows that improve everyday operations.",
    icon: "workflow",
  },
  {
    id: "ai-data-solutions",
    title: "AI & Data Solutions",
    description: "Practical automation and data-driven tools that support smarter decisions.",
    icon: "data",
  },
  {
    id: "it-consulting",
    title: "IT Consulting",
    description: "Technical guidance to help businesses choose and implement the right solutions.",
    icon: "consulting",
  },
] as const satisfies ReadonlyArray<{
  id: string;
  title: string;
  description: string;
  icon: ServiceIcon;
}>;

export const values = [
  {
    title: "Tailored Solutions",
    description: "Every project is designed around your business requirements.",
    icon: "sliders",
  },
  {
    title: "Practical Engineering",
    description: "Reliable, maintainable solutions built with long-term growth in mind.",
    icon: "layers",
  },
  {
    title: "Clear Communication",
    description: "Transparent collaboration from initial planning to delivery.",
    icon: "chat",
  },
  {
    title: "Long-Term Partnership",
    description: "Support and improvements as your business evolves.",
    icon: "partnership",
  },
] as const satisfies ReadonlyArray<{
  title: string;
  description: string;
  icon: ValueIcon;
}>;

export const projects = [
  {
    slug: "enterprise-management-system",
    name: "Enterprise Management System",
    category: "Operations software",
    description:
      "A demonstration workspace for coordinating teams, requests, and everyday operations.",
    variant: "operations",
  },
  {
    slug: "commerce-platform",
    name: "E-Commerce Platform",
    category: "Digital commerce",
    description:
      "A demonstration storefront and order desk for businesses that sell products online.",
    variant: "commerce",
  },
  {
    slug: "customer-portal",
    name: "Customer Portal",
    category: "Client experience",
    description:
      "A demonstration portal where customers can follow requests and shared project updates.",
    variant: "portal",
  },
] as const satisfies ReadonlyArray<{
  slug: string;
  name: string;
  category: string;
  description: string;
  variant: ProjectVariant;
}>;

export function isActivePath(pathname: string, href: string) {
  const path = href.split("#")[0] || "/";
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}
