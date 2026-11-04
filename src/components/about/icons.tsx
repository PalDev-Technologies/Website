import type { ReactNode, SVGProps } from "react";

function Glyph({ children, ...props }: SVGProps<SVGSVGElement>) {
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

const paths: Record<string, ReactNode> = {
  target: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v2.2M12 19.3V21.5M2.5 12h2.2M19.3 12H21.5" />
    </>
  ),
  telescope: (
    <>
      <path d="m4 16 7-9 2.2 1.6L8.2 18" />
      <path d="m13.2 8.6 2.4-3.1 4.2 3.2-2.4 3.1" />
      <path d="M8 18.5h5.5M10.2 18.5 9 21" />
    </>
  ),
  code: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M8 10.5 6 12l2 1.5M16 10.5 18 12l-2 1.5M13 9.5l-2 5" />
    </>
  ),
  workflow: (
    <>
      <rect x="3" y="4" width="6" height="6" rx="1.5" />
      <rect x="15" y="4" width="6" height="6" rx="1.5" />
      <rect x="9" y="14" width="6" height="6" rx="1.5" />
      <path d="M6 10v2.5A1.5 1.5 0 0 0 7.5 14H9M18 10v2.5A1.5 1.5 0 0 1 16.5 14H15" />
    </>
  ),
  brain: (
    <>
      <path d="M9 7.5a2.5 2.5 0 0 1 4.6-1.3A2.4 2.4 0 0 1 17 8.2 2.6 2.6 0 0 1 17.2 13 2.7 2.7 0 0 1 15 16.2V18H9.2v-1.6A2.8 2.8 0 0 1 6.8 13 2.6 2.6 0 0 1 7 8.2 2.4 2.4 0 0 1 9 7.5Z" />
      <path d="M12 8.2V18M9.4 11.2H12M14.6 13.4H12" />
    </>
  ),
  headset: (
    <>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <path d="M4 13v3.5A2.5 2.5 0 0 0 6.5 19H8v-6H6.5A2.5 2.5 0 0 0 4 15.5V13Z" />
      <path d="M20 13v3.5A2.5 2.5 0 0 1 17.5 19H16v-6h1.5A2.5 2.5 0 0 1 20 15.5V13Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 19 6.2v5.2c0 3.6-2.6 6.4-7 8.1-4.4-1.7-7-4.5-7-8.1V6.2L12 3.5Z" />
      <path d="m9 12 2 2 4-4.2" />
    </>
  ),
  messages: (
    <>
      <path d="M7 16.5 5 19v-4.6A5.4 5.4 0 0 1 8 8.2h5.2" />
      <path d="M9.5 7.2h6.3A5.2 5.2 0 0 1 21 12.2 4.6 4.6 0 0 1 16.4 17H12l-2.5-.5" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M9 17.5h6M9.8 20h4.4" />
      <path d="M8 13.2a4.2 4.2 0 1 1 6.8 3.3c-.6.5-1 1.2-1.1 2H10.3c-.1-.8-.5-1.5-1.1-2A4.2 4.2 0 0 1 8 13.2Z" />
    </>
  ),
  trend: (
    <>
      <path d="M4 16.5 9.2 11l3.2 3.1L20 7" />
      <path d="M14.5 7H20v5.5" />
    </>
  ),
};

export function AboutIcon({ name }: { name: keyof typeof paths }) {
  return <Glyph>{paths[name]}</Glyph>;
}
