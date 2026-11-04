/**
 * Published project records.
 * Client identity, links, languages, and technologies are included only when verified.
 */

export type ProjectFeature = {
  title: string;
  description: string;
  items?: readonly string[];
};

export type FeatureGroup = {
  id: string;
  eyebrow: string;
  heading: string;
  description: string;
  features: readonly ProjectFeature[];
};

export type WorkflowStep = {
  title: string;
  description?: string;
};

export type WorkflowTrack = {
  id: string;
  label: string;
  steps: readonly WorkflowStep[];
};

export type SolutionPart = {
  number: string;
  title: string;
  description: string;
};

export type PortfolioProject = {
  id: string;
  slug: string;
  clientName?: string;
  clientLogo?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  projectTitle: string;
  headline: string;
  category: string;
  subtitle: string;
  shortDescription: string;
  cardDescription: string;
  capabilities: readonly string[];
  tags: readonly string[];
  listing: {
    category: string;
    title: string;
    subtitle: string;
    description: string;
    capabilities: readonly string[];
  };
  overview: readonly string[];
  challenge: {
    title: string;
    paragraphs: readonly string[];
  };
  solution: {
    title: string;
    paragraphs: readonly string[];
    parts?: readonly SolutionPart[];
    diagram?: "storefront";
  };
  featureGroups: readonly FeatureGroup[];
  workflow: {
    title: string;
    tracks: readonly WorkflowTrack[];
  };
  businessValue: {
    eyebrow: string;
    heading: string;
    description: string;
    highlights: readonly string[];
  };
  technologies?: readonly string[];
  websiteUrl?: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  featured: boolean;
};

export const portfolio: readonly PortfolioProject[] = [
  {
    id: "home-and-office",
    slug: "home-and-office",
    clientName: "Home & Office",
    clientLogo: {
      src: "/images/home-and-office-logo.png",
      alt: "Home & Office company logo",
      width: 1402,
      height: 1122,
    },
    projectTitle: "Home & Office",
    headline: "Transforming Furniture Shopping Through a Complete Digital Platform.",
    category: "E-Commerce / Web Development / Business Management",
    subtitle: "Furniture E-Commerce Platform",
    shortDescription:
      "PalDev Technologies developed a complete furniture e-commerce platform for Home & Office, combining a modern online shopping experience with a centralized administrative dashboard for managing products, inventory, orders, and business analytics.",
    cardDescription:
      "A custom-built furniture e-commerce experience with an integrated administrative dashboard for managing products, inventory, orders, and business analytics.",
    capabilities: [
      "Product catalog",
      "Shopping cart and orders",
      "Inventory management",
      "Business analytics",
    ],
    tags: ["E-Commerce", "Admin Dashboard", "Inventory", "Analytics"],
    listing: {
      category: "E-Commerce Development",
      title: "Home & Office",
      subtitle: "Furniture E-Commerce Platform",
      description:
        "A custom furniture e-commerce platform with an integrated administrative dashboard for managing products, inventory, customer orders, and business analytics.",
      capabilities: ["Online Store", "Admin Dashboard", "Order Management"],
    },
    overview: [
      "Home & Office is a furniture retail platform designed to make browsing and ordering home and office furniture simple and accessible.",
      "The website presents a wide range of furniture, including desks, chairs, closets, cabinets, vanity tables, and other furnishings.",
      "PalDev developed both the customer-facing e-commerce experience and a dedicated administrative dashboard. The storefront enables customers to explore products and place orders, while the administrative system provides tools for managing the online business.",
      "The result is an integrated platform that connects the shopping experience with day-to-day store operations.",
    ],
    challenge: {
      title: "The Challenge",
      paragraphs: [
        "Running an online furniture business requires more than displaying products on a website.",
        "Retailers need to organize their product catalog, maintain inventory information, manage incoming orders, and monitor business activity.",
        "Without a centralized digital platform, these processes can become disconnected and difficult to manage efficiently.",
        "Home & Office required a solution that would bring the customer shopping experience and essential administrative operations together into one connected system.",
      ],
    },
    solution: {
      title: "The Solution",
      paragraphs: [
        "PalDev Technologies developed a custom e-commerce solution built around two connected components. The platform was designed to support both customer convenience and operational control.",
      ],
      parts: [
        {
          number: "01",
          title: "Customer Storefront",
          description:
            "A modern, responsive online shopping experience that allows customers to browse furniture collections, explore product information, manage their cart, and submit orders.",
        },
        {
          number: "02",
          title: "Administrative Dashboard",
          description:
            "An administrative interface for authorized users, designed to manage products, categories, inventory, customer orders, and business reporting from one location.",
        },
      ],
      diagram: "storefront",
    },
    featureGroups: [
      {
        id: "storefront",
        eyebrow: "Customer Experience",
        heading: "A Modern Way to Shop for Furniture.",
        description:
          "The customer-facing website provides a clear and intuitive shopping experience, allowing visitors to explore furniture collections and place orders.",
        features: [
          {
            title: "Product Catalog",
            description: "Products are organized into furniture collections to simplify browsing.",
          },
          {
            title: "Furniture Categories",
            description: "The catalog includes furniture grouped for easier discovery.",
            items: ["Chairs", "Desks", "Closets", "Cabinets", "Vanity Tables", "Other furniture items"],
          },
          {
            title: "Product Details",
            description: "Individual product pages present relevant product information and imagery.",
          },
          {
            title: "Shopping Cart",
            description: "Customers can add products to their cart and review their selections before checkout.",
          },
          {
            title: "Order Placement",
            description: "Customers can submit orders through a straightforward checkout process.",
          },
          {
            title: "Responsive Design",
            description: "The storefront is designed to adapt to desktop, tablet, and mobile devices.",
          },
          {
            title: "Multilingual Experience",
            description: "The storefront supports Arabic, English, and Hebrew.",
          },
        ],
      },
      {
        id: "administration",
        eyebrow: "Business Management",
        heading: "One Dashboard. Complete Operational Control.",
        description:
          "Beyond the storefront, PalDev developed a dedicated administrative dashboard that brings essential store management functions into one interface.",
        features: [
          {
            title: "Product Management",
            description: "Administrators can add, edit, organize, and manage the products displayed on the website.",
          },
          {
            title: "Category Management",
            description: "Administrators can manage the structure of furniture categories.",
          },
          {
            title: "Inventory Management",
            description: "Administrators can monitor and update product stock information.",
          },
          {
            title: "Order Management",
            description: "Administrators can review customer orders and update their processing status.",
          },
          {
            title: "Business Analytics",
            description: "The dashboard provides access to business activity information and relevant performance indicators.",
          },
          {
            title: "Sales Reporting",
            description: "Administrators can review sales activity and export sales-related reports.",
          },
          {
            title: "Administrative Access",
            description: "Administrative functionality is available to authorized users.",
          },
        ],
      },
    ],
    workflow: {
      title: "How the Platform Works.",
      tracks: [
        {
          id: "customer",
          label: "Customer Journey",
          steps: [
            { title: "Browse Furniture" },
            { title: "Explore Product Details" },
            { title: "Add Items to Cart" },
            { title: "Submit Order" },
          ],
        },
        {
          id: "admin",
          label: "Administrative Journey",
          steps: [
            { title: "Receive Order" },
            { title: "Review Order Details" },
            { title: "Manage Order Status" },
            { title: "Monitor Store Activity" },
          ],
        },
      ],
    },
    businessValue: {
      eyebrow: "Project Value",
      heading: "Built for Customers. Designed for Business.",
      description:
        "Home & Office combines a convenient online furniture shopping experience with centralized management tools. Customers benefit from a structured product catalog and straightforward ordering process. Administrators benefit from tools that bring product management, inventory, orders, and reporting into a connected environment.",
      highlights: [
        "Organized product discovery",
        "Centralized store management",
        "Inventory visibility",
        "Structured order processing",
        "Business analytics",
        "Responsive shopping experience",
      ],
    },
    technologies: ["React", "Vite"],
    websiteUrl: "https://homeandofficestore.com",
    seoTitle: "Home & Office E-Commerce Project | PalDev",
    seoDescription:
      "A furniture e-commerce platform PalDev built for Home & Office, with a customer storefront and an administrative dashboard for products, inventory, orders, and reporting.",
    published: true,
    featured: true,
  },
  {
    id: "employee-attendance-payroll",
    slug: "employee-attendance-payroll",
    clientName: "Baladna",
    clientLogo: {
      src: "/images/logo_Baladna.png",
      alt: "Baladna company logo",
      width: 1072,
      height: 526,
    },
    projectTitle: "Employee Attendance & Payroll Management System",
    headline: "Simplifying Employee Tracking and Payroll Administration.",
    category: "Custom Business Software / HR Administration",
    subtitle: "Custom HR Administration Software",
    shortDescription:
      "PalDev Technologies developed a focused HR administration system that allows administrators to track employee absence and overtime hours and prepare individual printable payslips.",
    cardDescription:
      "A streamlined HR administration solution for recording employee absence and overtime hours and generating printable payslips.",
    capabilities: [
      "Employee records",
      "Absence tracking",
      "Overtime tracking",
      "Printable payslips",
    ],
    tags: ["HR Software", "Employee Tracking", "Overtime", "Payslips"],
    listing: {
      category: "Custom HR Software",
      title: "Baladna HR System",
      subtitle: "Employee Attendance & Payroll",
      description:
        "A custom HR administration solution designed to track employee absence and overtime hours and generate printable payslips through a centralized interface.",
      capabilities: ["Employee Tracking", "Overtime & Absences", "Payslip Generation"],
    },
    overview: [
      "The Employee Attendance & Payroll Management System was developed to simplify routine HR administration.",
      "The application provides a centralized interface where administrators can manage relevant employee information, record absence hours, enter overtime hours, and prepare payroll-related documents.",
      "The system focuses on the essential tasks required for employee tracking and payslip preparation. Its straightforward design helps administrators organize information and carry out recurring HR tasks through a dedicated digital workflow.",
    ],
    challenge: {
      title: "The Challenge",
      paragraphs: [
        "Tracking employee absence and overtime hours can become repetitive and difficult to organize when handled manually.",
        "Administrators need a consistent way to record employee working-hour adjustments and prepare individual payroll documents.",
        "The objective was to create a practical digital tool that simplifies these tasks without unnecessary complexity.",
      ],
    },
    solution: {
      title: "The Solution",
      paragraphs: [
        "PalDev developed a streamlined employee administration application that brings attendance adjustments and payslip preparation into one centralized interface.",
        "Administrators can enter relevant employee information, record absence and overtime hours, and generate printable payslips.",
        "The solution was designed to make routine HR administration clearer and more organized.",
      ],
    },
    featureGroups: [
      {
        id: "capabilities",
        eyebrow: "Core Capabilities",
        heading: "Essential HR Tools in One Place.",
        description:
          "The application concentrates on the records and documents administrators need for attendance adjustments and payslip preparation.",
        features: [
          {
            title: "Employee Records",
            description: "An organized interface for accessing and managing relevant employee details.",
          },
          {
            title: "Absence Tracking",
            description: "Administrators can record the number of hours an employee was absent.",
          },
          {
            title: "Overtime Tracking",
            description: "Administrators can enter extra hours worked by individual employees.",
          },
          {
            title: "Payroll Reporting",
            description: "The system organizes employee working-hour information for payroll-related reporting.",
          },
          {
            title: "Payslip Generation",
            description:
              "Administrators can prepare individual employee payslips using the available employee and payroll information.",
          },
          {
            title: "Printable Payslips",
            description: "Payslips can be printed for administrative use or distribution.",
          },
        ],
      },
    ],
    workflow: {
      title: "A Simpler Payroll Preparation Workflow.",
      tracks: [
        {
          id: "payroll",
          label: "Payroll Preparation",
          steps: [
            {
              title: "Select Employee",
              description: "The administrator selects the employee record.",
            },
            {
              title: "Enter Attendance Adjustments",
              description: "The administrator records absence hours and overtime hours.",
            },
            {
              title: "Prepare Payroll Information",
              description: "The system uses the entered information to support payslip preparation.",
            },
            {
              title: "Generate Payslip",
              description: "The administrator generates the employee payslip.",
            },
            {
              title: "Print Payslip",
              description: "The document can be printed.",
            },
          ],
        },
      ],
    },
    businessValue: {
      eyebrow: "Project Value",
      heading: "Clearer Records. Simpler Administration.",
      description:
        "The system brings essential employee tracking and payroll document preparation into one organized workflow. Administrators can maintain working-hour records and prepare individual payslips through a focused interface.",
      highlights: [
        "Centralized employee information",
        "Organized absence records",
        "Overtime tracking",
        "Consistent payslip preparation",
        "Printable employee documents",
        "Simplified administrative workflow",
      ],
    },
    seoTitle: "Employee Attendance & Payroll System | PalDev",
    seoDescription:
      "An HR administration system PalDev developed for recording employee absence and overtime hours and preparing individual printable payslips.",
    published: true,
    featured: true,
  },
];

export function publishedProjects() {
  return portfolio.filter((project) => project.published);
}

export function featuredProjects() {
  return publishedProjects().filter((project) => project.featured);
}

export function projectBySlug(slug: string) {
  return publishedProjects().find((project) => project.slug === slug) ?? null;
}

export function adjacentProject(slug: string) {
  const projects = publishedProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0 || projects.length < 2) return null;
  return projects[(index + 1) % projects.length];
}

export const cardTitle: Record<string, string> = {
  "home-and-office": "Home & Office",
  "employee-attendance-payroll": "Employee Attendance & Payroll System",
};
