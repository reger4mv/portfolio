"use client";

import { site } from "@/data/site";
import { publishedSocials } from "@/data/social";
import { BackToTop } from "@/components/footer/BackToTop";
import { useMagnetic } from "@/hooks/useMagnetic";
import { SplitText } from "@/components/ui/SplitText";
import { Angel } from "@/components/system/Angel";
import { Sigil } from "@/components/graphics/Sigil";

function SocialLink({ label, href }: { label: string; href: string }) {
  const ref = useMagnetic<HTMLAnchorElement>(0.3);

  return (
    <a ref={ref} href={href} target="_blank" rel="noreferrer noopener">
      {label}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer shell reg--ink">
      <Angel variant="footer" />
      <div className="footer__sigil" aria-hidden="true">
        <Sigil name="knot" strokeWidth={0.6} />
      </div>
      <div className="footer__top">
        <p className="footer__mark">
          <span className="footer__mark-line">
            <span className="sr-only">{site.firstName}</span>
            <SplitText text={site.firstName} />
          </span>
          <span className="footer__sub">
            <SplitText text={site.lastName.toLowerCase()} />
          </span>
        </p>
        <p className="footer__note">
          {site.footerNote[0]}
          <br />
          {site.footerNote[1]}
        </p>
      </div>

      <div className="footer__bottom">
        <p className="mono">
          © {year} {site.fullName} — Nepal
        </p>

        <div className="footer__socials">
          {publishedSocials.map((social) => (
            <SocialLink
              key={social.id}
              label={social.label}
              href={social.href}
            />
          ))}
          <BackToTop />
        </div>

        <p className="mono">Built with Next.js, Three.js, GSAP</p>
      </div>
    </footer>
  );
}
