"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowIcon, SocialGlyph } from "@/components/ui/icons";
import { socialLinks } from "@/lib/site";
import styles from "./Footer.module.css";

const companyLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/projects", label: "Our Projects" },
  { href: "/contact", label: "Contact Us" },
] as const;

const serviceLinks = [
  { href: "/services", label: "Custom Software Development" },
  { href: "/services", label: "Business Digitalization" },
  { href: "/services", label: "AI & Data Solutions" },
  { href: "/services", label: "IT Consulting & Support" },
] as const;

const verifiedSocial = socialLinks.filter(
  (item): item is (typeof socialLinks)[number] & { href: string } =>
    typeof item.href === "string" && item.href.length > 0,
);

function subscribeToYear() {
  return () => {};
}

function readYear() {
  return new Date().getFullYear();
}

function readPrerenderYear() {
  return 2026;
}

export function Footer() {
  const year = useSyncExternalStore(subscribeToYear, readYear, readPrerenderYear);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logoLink}>
              <Image
                src="/images/PalDev_LogoNB.png"
                alt="PalDev Technologies"
                width={1535}
                height={1024}
                sizes="200px"
                className={styles.logo}
              />
            </Link>
            <p className={styles.blurb}>
              We build smart, reliable digital solutions that help businesses grow, innovate, and
              succeed in a connected world.
            </p>
          </div>

          <nav aria-label="Company">
            <p className={styles.heading}>Company</p>
            <ul className={styles.list}>
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Our services">
            <p className={styles.heading}>Our Services</p>
            <ul className={styles.list}>
              {serviceLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.contact}>
            <p className={styles.heading}>Get in Touch</p>
            <p className={styles.contactCopy}>
              Have a project in mind?
              <br />
              Let&apos;s build something great together.
            </p>
            <Link href="/contact" className={styles.talk}>
              Let&apos;s Talk
              <ArrowIcon />
            </Link>
            {verifiedSocial.length > 0 ? (
              <ul className={styles.social} aria-label="Social media">
                {verifiedSocial.map((item) => (
                  <li key={item.id}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
                      <SocialGlyph name={item.id} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className={styles.bar}>
          <p>© {year} PalDev Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
