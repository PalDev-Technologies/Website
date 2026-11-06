"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowIcon } from "@/components/ui/icons";
import { isActivePath, mainNav, quoteHref } from "@/lib/site";
import { BrandLockup } from "./BrandLockup";
import { prefetchHero } from "./prefetchHero";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const panelId = useId();

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    const hrefs = mainNav.map((item) => item.href).filter((href) => href !== pathname);
    const step = (index: number) => {
      if (cancelled || index >= hrefs.length) return;
      prefetchHero(hrefs[index]);
      timer = window.setTimeout(() => step(index + 1), 120);
    };
    timer = window.setTimeout(() => step(0), 600);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const panel = document.getElementById(panelId);
    const media = window.matchMedia("(max-width: 959px)");

    const focusable = () => {
      const links = panel
        ? Array.from(panel.querySelectorAll<HTMLElement>("a, button"))
        : [];
      return [buttonRef.current, ...links].filter((node): node is HTMLElement => Boolean(node));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;
      const nodes = focusable();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const lockScroll = () => {
      document.body.style.overflow = media.matches ? "hidden" : "";
    };

    lockScroll();
    firstLinkRef.current?.focus();
    window.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", lockScroll);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", lockScroll);
    };
  }, [open, panelId]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brandLink} aria-label="PalDev Technologies, home">
          <BrandLockup priority size="nav" />
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          <ul className={styles.links}>
            {mainNav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.link} ${active ? styles.active : ""}`}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={() => prefetchHero(item.href)}
                    onFocus={() => prefetchHero(item.href)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.end}>
          <Link href={quoteHref} className={`btn btn-primary btn-sm ${styles.cta}`}>
            Get a Quote
            <ArrowIcon />
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className={`${styles.bars} ${open ? styles.openBars : ""}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div
        id={panelId}
        className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ""}`}
        inert={!open}
        aria-hidden={!open}
      >
        <div className={styles.panelInner}>
          <nav aria-label="Mobile">
            <ul className={styles.mobileList}>
              {mainNav.map((item, index) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      className={`${styles.mobileLink} ${active ? styles.mobileActive : ""}`}
                      aria-current={active ? "page" : undefined}
                      onMouseEnter={() => prefetchHero(item.href)}
                      onFocus={() => prefetchHero(item.href)}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href={quoteHref}
              className={`btn btn-primary ${styles.mobileCta}`}
              onClick={() => setOpen(false)}
            >
              Get a Quote
              <ArrowIcon />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
