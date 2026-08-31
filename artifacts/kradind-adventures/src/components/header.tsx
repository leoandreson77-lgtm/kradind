import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, TentTree, X } from 'lucide-react';

export function Header() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '/treks', label: 'Explore Treks', id: 'escapes' },
    { href: '/packages', label: 'Packages', id: 'packages' },
    { href: '/#match', label: 'Trek Matcher', id: 'match' },
    { href: '/#radar', label: 'Trail Radar', id: 'radar' },
    { href: '/about', label: 'Our Story', id: 'about' },
    { href: '/contact', label: 'Contact Us', id: 'contact' },
    { href: '/admin', label: 'Admin', id: 'admin' },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-full border border-white/20 bg-primary/90 px-5 py-3 shadow-xl backdrop-blur-md">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group" data-testid="link-header-logo">
            <span className="grid size-10 place-items-center rounded-full bg-accent text-accent-foreground shadow-md transition-transform duration-300 group-hover:rotate-12">
              <TentTree className="size-5" />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight text-white">
              KRADIND<span className="text-accent">.</span>
            </span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden items-center gap-8 text-sm font-semibold text-white/85 md:flex">
            {navLinks.map((link) => {
              const isActive =
                location === link.href || (link.href !== '/' && location.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-all duration-200 hover:text-white ${
                    isActive ? 'text-accent font-bold scale-105' : 'text-white/80'
                  }`}
                  data-testid={`link-nav-${link.id}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ACTION BUTTON & MOBILE TOGGLE */}
          <div className="flex items-center gap-3">
            <Link
              href="/treks"
              className="hidden rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground shadow-lg transition-all duration-300 hover:bg-accent/90 hover:scale-105 sm:block"
              data-testid="link-plan-expedition"
            >
              Plan Expedition
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="grid size-10 place-items-center rounded-full border border-white/30 text-white md:hidden"
              aria-label="Toggle navigation"
              data-testid="button-toggle-navigation"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mx-4 mt-2 rounded-2xl border border-white/20 bg-primary/95 p-6 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="grid gap-4 text-sm font-semibold text-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="transition hover:text-accent"
                data-testid={`link-mobile-${link.id}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
