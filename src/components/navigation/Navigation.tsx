"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Monogram } from "@/components/navigation/Monogram";
import { NavClock } from "@/components/navigation/NavClock";
import { navItems, site } from "@/data/site";
import { publishedSocials } from "@/data/social";
import { useActiveSection } from "@/hooks/useActiveSection";
import { scrollToId, startScroll, stopScroll } from "@/lib/scroll";

const ids = navItems.map((item) => item.id);

export function Navigation() {
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setPinned(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    stopScroll();
    const firstLink = menuRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus({ preventScroll: true });
        return;
      }

      // Simple focus trap: the overlay owns the keyboard while it is open.
      if (event.key === "Tab" && menuRef.current) {
        const focusable = Array.from(
          menuRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled])',
          ),
        ).concat(toggleRef.current ? [toggleRef.current] : []);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus({ preventScroll: true });
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      startScroll();
    };
  }, [open]);

  const go = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      setOpen(false);
      // let the overlay begin closing before the scroll starts
      window.setTimeout(() => scrollToId(id), open ? 260 : 0);
      if (window.history.replaceState) {
        window.history.replaceState(null, "", `#${id}`);
      }
    },
    [open],
  );

  return (
    <>
      <header className={`nav ${pinned ? "is-pinned" : ""} ${open ? "is-open" : ""}`}>
        <a
          className="nav__brand"
          href="#home"
          aria-label={`${site.fullName} — back to top`}
          onClick={(event) => go(event, "home")}
        >
          <Monogram className="nav__brand-mark" />
          <span className="nav__wordmark">
            A—V
            <span>Portfolio 2026</span>
          </span>
        </a>

        <nav aria-label="Primary">
          <ul className="nav__list">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  className="nav__link"
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "true" : undefined}
                  onClick={(event) => go(event, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__aside">
          <NavClock />
          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="nav__toggle-bars" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        ref={menuRef}
        className={`menu ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        // Keeps the hidden overlay out of the tab order entirely.
        inert={!open}
      >
        <nav aria-label="Sections">
          <ul className="menu__list">
            {navItems.map((item, index) => (
              <li key={item.id} style={{ "--i": index } as React.CSSProperties}>
                <a
                  className="menu__item"
                  href={`#${item.id}`}
                  tabIndex={open ? 0 : -1}
                  onClick={(event) => go(event, item.id)}
                >
                  <span>{item.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu__foot">
          <p className="mono">{site.availability}</p>
          <div className="mono">
            {publishedSocials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                tabIndex={open ? 0 : -1}
              >
                {social.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
