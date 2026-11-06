import type { ProjectVariant } from "@/lib/site";

export function ProjectPreview({
  variant,
  label,
}: {
  variant: ProjectVariant;
  label: string;
}) {
  return (
    <svg viewBox="0 0 640 400" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <title>{label}</title>
      <defs>
        <linearGradient id={`${variant}-wash`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7fafc" />
          <stop offset="100%" stopColor="#e4eef8" />
        </linearGradient>
        <linearGradient id={`${variant}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#087cf5" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#087cf5" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${variant}-clip`}>
          <rect x="48" y="40" width="544" height="320" rx="16" />
        </clipPath>
      </defs>
      <rect width="640" height="400" fill={`url(#${variant}-wash)`} />
      <rect x="48" y="40" width="544" height="320" rx="16" fill="#ffffff" />
      <g clipPath={`url(#${variant}-clip)`}>
        {variant === "operations" ? <OperationsScreen /> : null}
        {variant === "commerce" ? <CommerceScreen /> : null}
        {variant === "portal" ? <PortalScreen /> : null}
      </g>
      <rect x="48.5" y="40.5" width="543" height="319" rx="16" fill="none" stroke="#e2eaf5" />
    </svg>
  );
}

function OperationsScreen() {
  return (
    <g>
      <rect x="48" y="40" width="124" height="320" fill="#06152f" />
      <rect x="70" y="62" width="28" height="28" rx="8" fill="#087cf5" />
      <rect x="78" y="70" width="12" height="12" rx="3" fill="#08d8ed" />
      <rect x="66" y="112" width="88" height="28" rx="8" fill="#12315c" />
      <rect x="78" y="123" width="46" height="6" rx="3" fill="#9ec9fb" />
      <rect x="78" y="156" width="52" height="6" rx="3" fill="#1d456f" />
      <rect x="78" y="184" width="64" height="6" rx="3" fill="#1d456f" />
      <rect x="78" y="212" width="40" height="6" rx="3" fill="#1d456f" />
      <rect x="78" y="240" width="58" height="6" rx="3" fill="#1d456f" />
      <rect x="196" y="64" width="156" height="12" rx="6" fill="#0a1a35" />
      <rect x="196" y="86" width="92" height="7" rx="3.5" fill="#d5e1ee" />
      <Metric x={196} y={114} tone="#0a1a35" width={58} />
      <Metric x={322} y={114} tone="#087cf5" width={44} />
      <Metric x={448} y={114} tone="#08d8ed" width={64} />
      <rect x="196" y="196" width="240" height="140" rx="12" fill="#f8fbfe" />
      <path
        d="M214 300 C246 300 252 246 286 242 C318 238 326 268 356 252 C386 236 392 214 418 206 L418 312 L214 312 Z"
        fill="url(#operations-area)"
      />
      <path
        d="M214 300 C246 300 252 246 286 242 C318 238 326 268 356 252 C386 236 392 214 418 206"
        fill="none"
        stroke="#087cf5"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x="452" y="196" width="116" height="140" rx="12" fill="#06152f" />
      <rect x="468" y="216" width="72" height="7" rx="3.5" fill="#ffffff" />
      <rect x="468" y="240" width="84" height="18" rx="6" fill="#12315c" />
      <rect x="468" y="268" width="84" height="18" rx="6" fill="#12315c" />
      <rect x="468" y="296" width="84" height="18" rx="6" fill="#0e4e86" />
    </g>
  );
}

function Metric({ x, y, tone, width }: { x: number; y: number; tone: string; width: number }) {
  return (
    <g>
      <rect x={x} y={y} width="114" height="66" rx="12" fill="#f7fafc" />
      <rect x={x + 14} y={y + 16} width="42" height="6" rx="3" fill="#d3deea" />
      <rect x={x + 14} y={y + 34} width={width} height="12" rx="4" fill={tone} />
    </g>
  );
}

function CommerceScreen() {
  return (
    <g>
      <rect x="68" y="58" width="250" height="30" rx="9" fill="#f3f7fb" />
      <rect x="82" y="70" width="92" height="6" rx="3" fill="#c5d4e4" />
      <rect x="334" y="58" width="58" height="30" rx="9" fill="#087cf5" />
      <rect x="402" y="58" width="58" height="30" rx="9" fill="#e8f3ff" />
      <rect x="470" y="58" width="98" height="30" rx="9" fill="#e8f3ff" />
      <ProductTile x={68} y={106} tone="#087cf5" />
      <ProductTile x={230} y={106} tone="#0b3a78" />
      <ProductTile x={68} y={236} tone="#d7f6fb" />
      <ProductTile x={230} y={236} tone="#16355f" />
      <rect x="400" y="106" width="168" height="230" rx="14" fill="#06152f" />
      <rect x="418" y="126" width="86" height="8" rx="4" fill="#ffffff" />
      <rect x="418" y="154" width="132" height="36" rx="8" fill="#12315c" />
      <rect x="418" y="200" width="132" height="36" rx="8" fill="#12315c" />
      <rect x="418" y="246" width="132" height="36" rx="8" fill="#12315c" />
      <rect x="430" y="166" width="64" height="6" rx="3" fill="#8ec4fb" />
      <rect x="430" y="212" width="78" height="6" rx="3" fill="#8ec4fb" />
      <rect x="430" y="258" width="52" height="6" rx="3" fill="#7ae7ff" />
      <rect x="418" y="296" width="132" height="22" rx="8" fill="#087cf5" />
    </g>
  );
}

function ProductTile({ x, y, tone }: { x: number; y: number; tone: string }) {
  return (
    <g>
      <rect x={x} y={y} width="150" height="116" rx="12" fill="#f7fafc" />
      <rect x={x} y={y} width="150" height="72" rx="12" fill={tone} />
      <rect x={x} y={y + 60} width="150" height="12" fill={tone} />
      <rect x={x + 12} y={y + 84} width="72" height="7" rx="3.5" fill="#0a1a35" />
      <rect x={x + 12} y={y + 98} width="46" height="6" rx="3" fill="#c5d4e4" />
    </g>
  );
}

function PortalScreen() {
  return (
    <g>
      <rect x="48" y="40" width="544" height="108" fill="#06152f" />
      <circle cx="96" cy="94" r="22" fill="#087cf5" />
      <circle cx="96" cy="94" r="8" fill="#ffffff" />
      <rect x="132" y="78" width="168" height="12" rx="6" fill="#ffffff" />
      <rect x="132" y="100" width="220" height="7" rx="3.5" fill="#8eabcf" />
      <rect x="470" y="78" width="96" height="32" rx="16" fill="#087cf5" />
      <RequestRow y={168} chip="#e7f8fb" mark="#087cf5" />
      <RequestRow y={228} chip="#e8f3ff" mark="#0757d6" />
      <RequestRow y={288} chip="#06152f" mark="#08d8ed" />
    </g>
  );
}

function RequestRow({ y, chip, mark }: { y: number; chip: string; mark: string }) {
  return (
    <g>
      <rect x="68" y={y} width="504" height="48" rx="12" fill="#f7fafc" />
      <rect x="86" y={y + 12} width="180" height="8" rx="4" fill="#0a1a35" />
      <rect x="86" y={y + 28} width="120" height="6" rx="3" fill="#c5d4e4" />
      <rect x="456" y={y + 12} width="92" height="24" rx="12" fill={chip} />
      <rect x="474" y={y + 21} width="56" height="6" rx="3" fill={mark} />
    </g>
  );
}
