import { site } from "@/data/site";
import { publishedSocials } from "@/data/social";
import { BackToTop } from "@/components/footer/BackToTop";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer shell">
      <div className="footer__top">
        <p className="footer__mark">
          {site.firstName}
          <span>{site.lastName.toLowerCase()}</span>
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
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {social.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
          <BackToTop />
        </div>

        <p className="mono">Built with Next.js, Three.js, GSAP</p>
      </div>
    </footer>
  );
}
