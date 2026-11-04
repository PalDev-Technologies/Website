import { ServiceDetail } from "./ServiceDetail";
import { AnalyticsVisual, ArchitectureVisual, SoftwareDashboardVisual, WorkflowVisual } from "./visuals";

export function ServiceSections() {
  return (
    <>
      <ServiceDetail
        id="custom-software-development"
        alias="software-development"
        eyebrow="01 / Software Engineering"
        title="Software Built Around Your Business."
        description="Every business operates differently. We design and develop custom software that fits your workflows, solves your challenges, and supports your growth."
        subheading="What We Can Build"
        solutions={[
          "Custom Web Applications",
          "Business Management Systems",
          "E-Commerce Platforms",
          "Customer & Employee Portals",
          "Admin Dashboards",
          "API & System Integrations",
        ]}
        benefit="Purpose-built software gives your business the flexibility to work the way it needs to."
        cta="Discuss Your Software Project"
        visualSide="right"
        tone="light"
      >
        <SoftwareDashboardVisual />
      </ServiceDetail>

      <ServiceDetail
        id="business-digitalization"
        eyebrow="02 / Digital Transformation"
        title="Turn Manual Work Into Smarter Workflows."
        description="Replace repetitive tasks, disconnected processes, and inefficient workflows with connected digital experiences that make everyday operations easier."
        subheading="What We Can Help Improve"
        solutions={[
          "Workflow Automation",
          "Digital Forms & Approvals",
          "Internal Business Platforms",
          "Operational Dashboards",
          "Process Modernization",
          "System Integrations",
        ]}
        benefit="Spend less time managing repetitive processes and more time focusing on your business."
        cta="Explore Digitalization Solutions"
        visualSide="left"
        tone="white"
      >
        <WorkflowVisual />
      </ServiceDetail>

      <ServiceDetail
        id="ai-data-solutions"
        eyebrow="03 / Intelligent Technology"
        title="Make Better Decisions With Data."
        description="We help businesses explore practical ways to use data, analytics, automation, and AI-assisted tools to improve visibility and support better decisions."
        subheading="Our Capabilities"
        solutions={[
          "Business Analytics Dashboards",
          "Reporting Automation",
          "Data Visualization",
          "AI-Assisted Workflows",
          "Intelligent Data Processing",
          "Custom Automation Tools",
        ]}
        benefit="Transform scattered information into clearer insights and more efficient decisions."
        cta="Discuss an AI or Data Project"
        visualSide="right"
        tone="light"
      >
        <AnalyticsVisual />
      </ServiceDetail>

      <ServiceDetail
        id="it-consulting-support"
        alias="it-consulting"
        eyebrow="04 / Technology Advisory"
        title="Reliable Technology. Confident Decisions."
        description="From selecting the right technology to improving existing systems, we provide practical technical guidance to help businesses move forward."
        subheading="How We Can Help"
        solutions={[
          "Technology Assessments",
          "Software Architecture Guidance",
          "System Improvements",
          "Technical Troubleshooting",
          "Integration Planning",
          "Ongoing Support Arrangements",
        ]}
        benefit="Make informed technology decisions with a practical approach to reliability, maintainability, and growth."
        cta="Talk to PalDev"
        visualSide="left"
        tone="white"
      >
        <ArchitectureVisual />
      </ServiceDetail>
    </>
  );
}
