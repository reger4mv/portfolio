"use client";

import { site } from "@/data/site";
import { socials } from "@/data/social";
import { useMagnetic } from "@/hooks/useMagnetic";
import { Angel } from "@/components/system/Angel";
import { Sigil } from "@/components/graphics/Sigil";

interface Channel {
  id: string;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

function ChannelRow({ channel }: { channel: Channel }) {
  const ref = useMagnetic<HTMLAnchorElement>(0.1);

  if (!channel.href) {
    return (
      <div className="channel channel--pending" data-reveal-item>
        <span className="channel__label">{channel.label}</span>
        <span className="channel__value">Not published yet</span>
        <span className="channel__arrow" aria-hidden="true">
          ·
        </span>
      </div>
    );
  }

  return (
    <a
      ref={ref}
      className="channel"
      href={channel.href}
      {...(channel.external
        ? { target: "_blank", rel: "noreferrer noopener" }
        : {})}
      data-reveal-item
      data-cursor="link"
    >
      <span className="channel__label">{channel.label}</span>
      <span className="channel__value">{channel.value}</span>
      <span className="channel__arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

export function Contact() {
  const channels: Channel[] = [
    site.email
      ? { id: "email", label: "Email", value: site.email, href: `mailto:${site.email}` }
      : { id: "email", label: "Email", value: "Not published" },
    ...socials.map((social) =>
      social.href
        ? {
            id: social.id,
            label: social.label,
            value: social.handle || social.label,
            href: social.href,
            external: true,
          }
        : { id: social.id, label: social.label, value: "Not published" },
    ),
  ];

  return (
    <section
      id="contact"
      className="section shell contact"
      aria-labelledby="contact-title"
    >
      <Angel variant="contact" />
      <div className="contact__sigil" aria-hidden="true">
        <Sigil name="halo" strokeWidth={0.6} />
      </div>

      {/* The two lines drift apart as you scroll into the section. */}
      <p className="contact__mark mono">
        <span>06</span> Correspondence
      </p>

      <h2 className="contact__heading" id="contact-title" data-lines>
        <span className="line" data-shift="left">
          <span>Have something</span>
        </span>
        <span className="line" data-shift="right">
          <span>
            interesting in <em>mind?</em>
          </span>
        </span>
      </h2>

      <div className="contact__cols">
        <div>
          <p className="contact__copy" data-mask>
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
            {channels.map((channel) => (
              <ChannelRow channel={channel} key={channel.id} />
            ))}
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
