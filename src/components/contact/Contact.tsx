import { site } from "@/data/site";
import { socials } from "@/data/social";
import { SectionHeading } from "@/components/sections/SectionHeading";

type Channel = {
  id: string;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

export function Contact() {
  const channels: Channel[] = [];

  channels.push(
    site.email
      ? {
          id: "email",
          label: "Email",
          value: site.email,
          href: `mailto:${site.email}`,
        }
      : { id: "email", label: "Email", value: "Not published" },
  );

  socials.forEach((social) => {
    channels.push(
      social.href
        ? {
            id: social.id,
            label: social.label,
            value: social.handle || social.label,
            href: social.href,
            external: true,
          }
        : { id: social.id, label: social.label, value: "Not published" },
    );
  });

  return (
    <section id="contact" className="section shell contact" aria-labelledby="contact-title">
      <SectionHeading index="06" label="Contact" note="Open to good ideas" />

      <h2 className="contact__heading" id="contact-title" data-lines>
        <span className="line">
          <span>Have something</span>
        </span>
        <span className="line">
          <span>
            interesting in <em>mind?</em>
          </span>
        </span>
      </h2>

      <div className="contact__cols">
        <div>
          <p className="contact__copy" data-reveal>
            {site.contact.copy}
          </p>
          <div className="contact__aside">
            <p>{site.availability}</p>
            <p>
              I answer everything that isn&apos;t automated. Expect a real reply,
              not a template.
            </p>
          </div>
        </div>

        <div>
          <div className="channels" data-reveal-group>
            {channels.map((channel) =>
              channel.href ? (
                <a
                  key={channel.id}
                  className="channel"
                  href={channel.href}
                  {...(channel.external
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                  data-reveal-item
                >
                  <span className="channel__label">{channel.label}</span>
                  <span className="channel__value">{channel.value}</span>
                  <span className="channel__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ) : (
                <div
                  key={channel.id}
                  className="channel channel--pending"
                  data-reveal-item
                >
                  <span className="channel__label">{channel.label}</span>
                  <span className="channel__value">Not published yet</span>
                  <span className="channel__arrow" aria-hidden="true">
                    ·
                  </span>
                </div>
              ),
            )}
          </div>

          <p className="contact__note">
            Only channels that actually exist are listed. No contact form, no
            autoresponder — anything you send reaches a person.
          </p>
        </div>
      </div>
    </section>
  );
}
