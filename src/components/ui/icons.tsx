import type { SVGProps } from "react";
import type { ServiceIcon, ValueIcon } from "@/lib/site";

type IconProps = SVGProps<SVGSVGElement>;

function Glyph({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ServiceGlyph({ name }: { name: ServiceIcon }) {
  if (name === "code") {
    return (
      <Glyph>
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <path d="M8 10.5 6 12l2 1.5M16 10.5 18 12l-2 1.5M13 9.5l-2 5" />
      </Glyph>
    );
  }

  if (name === "workflow") {
    return (
      <Glyph>
        <rect x="3" y="4" width="6" height="6" rx="1.5" />
        <rect x="15" y="4" width="6" height="6" rx="1.5" />
        <rect x="9" y="14" width="6" height="6" rx="1.5" />
        <path d="M6 10v2.5A1.5 1.5 0 0 0 7.5 14H9M18 10v2.5A1.5 1.5 0 0 1 16.5 14H15" />
      </Glyph>
    );
  }

  if (name === "data") {
    return (
      <Glyph>
        <path d="M4 19V10M10 19V5M16 19v-7M21 19H3" />
        <path d="M16.5 5.5h3.5V9" />
        <path d="M20 5.5 15 10.5" />
      </Glyph>
    );
  }

  return (
    <Glyph>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 4v2.5M12 17.5V20M4 12h2.5M17.5 12H20" />
    </Glyph>
  );
}

export function ValueGlyph({ name }: { name: ValueIcon }) {
  if (name === "sliders") {
    return (
      <Glyph>
        <path d="M4 8h16M4 16h16" />
        <circle cx="9" cy="8" r="2.2" fill="var(--icon-hole, #fff)" />
        <circle cx="15" cy="16" r="2.2" fill="var(--icon-hole, #fff)" />
      </Glyph>
    );
  }

  if (name === "layers") {
    return (
      <Glyph>
        <path d="m12 4 8 4-8 4-8-4 8-4Z" />
        <path d="m4 12 8 4 8-4M4 16l8 4 8-4" />
      </Glyph>
    );
  }

  if (name === "chat") {
    return (
      <Glyph>
        <path d="M6 16.5 4 19v-5.2A6.8 6.8 0 0 1 7.2 6h9.6A6.8 6.8 0 0 1 20 12.2 5.3 5.3 0 0 1 14.7 17H8.2L6 16.5Z" />
        <path d="M8.5 11h7M8.5 13.5h4" />
      </Glyph>
    );
  }

  return (
    <Glyph>
      <path d="M8 12h8" />
      <circle cx="7" cy="12" r="3" />
      <circle cx="17" cy="12" r="3" />
    </Glyph>
  );
}

export function SocialGlyph({ name }: { name: "linkedin" | "x" | "instagram" | "facebook" }) {
  if (name === "linkedin") {
    return (
      <Glyph>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 11v5M8 8h.01M12 16v-3.2a1.8 1.8 0 0 1 3.6 0V16M12 11.2V16" />
      </Glyph>
    );
  }

  if (name === "x") {
    return (
      <Glyph>
        <path d="M6 6l12 12M18 6 6 18" />
      </Glyph>
    );
  }

  if (name === "instagram") {
    return (
      <Glyph>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
      </Glyph>
    );
  }

  return (
    <Glyph>
      <path d="M14 8h2.2A3.8 3.8 0 0 1 20 11.8V18h-3.2v-4.2a1.4 1.4 0 0 0-2.8 0V18H10.8V8H14Z" />
      <path d="M7 10.5V18M7 7h.01" />
    </Glyph>
  );
}

export function ArrowIcon() {
  return (
    <Glyph width={16} height={16}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Glyph>
  );
}
