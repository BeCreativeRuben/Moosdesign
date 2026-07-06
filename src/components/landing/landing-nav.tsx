"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";

const links = [
  { key: "gallery", href: "/gallery" },
  { key: "shop", href: "/shop" },
  { key: "custom", href: "/custom-prints" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

export function LandingNav() {
  const t = useTranslations("landing");
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const localePath = pathname.replace(/^\/(nl|en)/, "") || "/";
  const currentLocale = pathname.startsWith("/en") ? "en" : "nl";
  const otherLocale = currentLocale === "nl" ? "en" : "nl";
  const pathWithoutLocale = pathname.replace(/^\/(nl|en)/, "") || "/";
  const isHome = localePath === "/";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = (
    <>
      {!isHome && (
        <Link
          href="/"
          className={cn(
            "landing-nav__link",
            localePath === "/" && "landing-nav__link--active",
          )}
          onClick={() => setMenuOpen(false)}
        >
          {tNav("home")}
        </Link>
      )}
      {links.map(({ key, href }) => {
        const active = localePath.startsWith(href);
        return (
          <Link
            key={key}
            href={href}
            className={cn("landing-nav__link", active && "landing-nav__link--active")}
            onClick={() => setMenuOpen(false)}
          >
            {t(`nav.${key}`)}
          </Link>
        );
      })}
    </>
  );

  const utilLinks = session?.user ? (
    <>
      {session.user.role === "admin" && (
        <Link
          href="/admin"
          className="landing-nav__util landing-nav__util--wide"
          onClick={() => setMenuOpen(false)}
        >
          {tNav("admin")}
        </Link>
      )}
      <button
        type="button"
        onClick={() => {
          setMenuOpen(false);
          signOut({ callbackUrl: "/" });
        }}
        className="landing-nav__util landing-nav__util--wide"
      >
        {tNav("signOut")}
      </button>
    </>
  ) : (
    <Link
      href="/auth/sign-in"
      className="landing-nav__util landing-nav__util--wide"
      onClick={() => setMenuOpen(false)}
    >
      {tNav("signIn")}
    </Link>
  );

  return (
    <header className={cn("landing-nav", menuOpen && "landing-nav--open")}>
      <Link href="/" className="landing-nav__logo" data-secret="logo">
        <Image
          src="/images/logo-long.jpg"
          alt="Moosdesign"
          width={160}
          height={42}
          className="h-8 w-auto object-contain brightness-0 invert sm:h-9"
          priority
        />
      </Link>

      <nav className="landing-nav__links landing-nav__links--desktop" aria-label="Main">
        {navLinks}
      </nav>

      <div className="landing-nav__utils landing-nav__utils--desktop">
        <Link
          href={pathWithoutLocale}
          locale={otherLocale}
          className="landing-nav__util"
          aria-label={otherLocale === "nl" ? "Nederlands" : "English"}
        >
          {otherLocale}
        </Link>
        {utilLinks}
      </div>

      <div className="landing-nav__mobile-actions">
        <Link
          href={pathWithoutLocale}
          locale={otherLocale}
          className="landing-nav__util"
          aria-label={otherLocale === "nl" ? "Nederlands" : "English"}
        >
          {otherLocale}
        </Link>
        <button
          type="button"
          className="landing-nav__toggle"
          aria-expanded={menuOpen}
          aria-controls="landing-nav-drawer"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      <div
        id="landing-nav-drawer"
        className="landing-nav__drawer"
        hidden={!menuOpen}
        aria-hidden={!menuOpen}
      >
        <nav className="landing-nav__drawer-links" aria-label="Main mobile">
          {navLinks}
        </nav>
        <div className="landing-nav__drawer-utils">{utilLinks}</div>
      </div>
    </header>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={cn("landing-nav__toggle-icon", open && "landing-nav__toggle-icon--open")}
    >
      <path
        className="landing-nav__toggle-line landing-nav__toggle-line--a"
        d="M3 5h14"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        className="landing-nav__toggle-line landing-nav__toggle-line--b"
        d="M3 10h14"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        className="landing-nav__toggle-line landing-nav__toggle-line--c"
        d="M3 15h14"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
