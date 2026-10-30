"use client";

import { useMagnetic } from "@/hooks/useMagnetic";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  /** Fraction of the pointer offset the element follows. 0.15–0.35 reads as crafted. */
  strength?: number;
  as?: "span" | "div";
}

/**
 * Wrapper form of the magnetic pull, for elements where a ref cannot be
 * forwarded directly. Behaviour and fallbacks live in `useMagnetic`.
 */
export function Magnetic({ children, className, strength = 0.22, as = "span" }: MagneticProps) {
  const ref = useMagnetic<HTMLSpanElement & HTMLDivElement>(strength);
  const Tag = as;

  return (
    <Tag ref={ref as never} className={className} data-magnetic="">
      {children}
    </Tag>
  );
}
