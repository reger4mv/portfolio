/**
 * ─────────────────────────────────────────────────────────────
 *  SOCIAL / CONTACT
 *  Only add a row when the link is real. Rows with an empty
 *  `href` are rendered as "not published" rather than a dead link,
 *  so the contact section never points somewhere that doesn't exist.
 * ─────────────────────────────────────────────────────────────
 */

export interface SocialLink {
  id: string;
  label: string;
  handle: string;
  href: string;
}

export const socials: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    handle: "reger4mv",
    href: "https://github.com/reger4mv",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@regeramv",
    href: "https://www.instagram.com/regeramv/",
  },
];

export const publishedSocials = socials.filter((s) => s.href.length > 0);
