import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function Github({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 22v-3.4a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.3-3.3 4.4 4.4 0 0 0-.1-3.3S17.2 3.4 15 5a11.3 11.3 0 0 0-6 0C6.8 3.4 5.7 3.7 5.7 3.7A4.4 4.4 0 0 0 5.6 7a4.7 4.7 0 0 0-1.3 3.3c0 4.7 2.8 5.7 5.5 6A3 3 0 0 0 9 18.5V22" />
    </svg>
  );
}

export function Linkedin({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7.5 10v7M11.5 17v-7M11.5 13a3 3 0 0 1 6 0v4" />
      <circle cx="7.5" cy="7.2" r=".5" fill="currentColor" />
    </svg>
  );
}
