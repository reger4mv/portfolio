"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Monogram } from "@/components/navigation/Monogram";
import { NavClock } from "@/components/navigation/NavClock";
import { ScrollProgress } from "@/components/interaction/ScrollProgress";
import { navItems, site } from "@/data/site";
import { publishedSocials } from "@/data/social";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useMagnetic } from "@/hooks/useMagnetic";
import { scrollToId, startScroll, stopScroll } from "@/lib/scroll";

const ids = navItems.map((item) => item.id);

function NavLink({
  item,
  active,
  onClick,
}: {
  item: (typeof navItems)[number];
  active: boolean;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  const ref = useMagnetic<HTMLAnchorElement>(0.3);

  return (
    <li>
      <a
        ref={ref}
        className="nav__link"
        href={`#${item.id}`}
        data-nav-item={item.id}
        aria-current={active ? "true" : undefined}
        onClick={(event) => onClick(event, item.id)}
      >
        {item.label}
      </a>
    </li>
  );
}

export function Navigation() {
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => setPinned(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* One indicator slides between links instead of five underlines flickering. */
  useEffect(() => {
    const place = () => {
      const list = listRef.current;
      const indicator = indicatorRef.current;
      if (!list || !indicator) return;
      const link = list.querySelector<HTMLElement>(`[data-nav-item="${active}"]`);
      // The list is display:none below 980px — nothing to point at.
      if (!link || link.offsetWidth === 0) {
        indicator.style.opacity = "0";
        return;
      }
      indicator.style.opacity = "1";
      indicator.style.width = `${link.offsetWidth}px`;
      indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    };

    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

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

      if (event.key === "Tab" && menuRef.current) {
        const focusable = Array.from(
          menuRef.current.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
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

        <nav aria-label="Primary" className="nav__nav">
          <span className="nav__indicator" ref={indicatorRef} aria-hidden="true" />
          <ul className="nav__list" ref={listRef}>
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                active={active === item.id}
                onClick={go}
              />
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

        <ScrollProgress />
      </header>

      <div
        id="site-menu"
        ref={menuRef}
        className={`menu ${open ? "is-open" : ""}`}
        aria-hidden={!open}
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
