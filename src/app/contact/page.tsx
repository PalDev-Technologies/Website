import type { Metadata } from "next";
import { ConnectSection } from "@/components/contact/ConnectSection";
import { ContactCta } from "@/components/contact/ContactCta";
import { ContactFaq } from "@/components/contact/ContactFaq";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactMethods } from "@/components/contact/ContactMethods";
import { GeneralContact } from "@/components/contact/GeneralContact";
import { NextSteps } from "@/components/contact/NextSteps";
import { QuoteWizard } from "@/components/contact/QuoteWizard";

const title = "Contact Us";
const description =
  "Contact PalDev Technologies to discuss custom software development, digital solutions, AI, and technology consulting, or request a tailored technical project quotation.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | PalDev Technologies",
    description,
    url: "/contact",
  },
  twitter: {
    title: "Contact Us | PalDev Technologies",
    description,
  },
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactMethods />
      <GeneralContact />
      <QuoteWizard />
      <NextSteps />
      <ConnectSection />
      <ContactFaq />
      <ContactCta />
    </>
  );
}
