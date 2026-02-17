"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const navigation = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Directory",
    href: "/directory",
  },
  {
    name: "How It Works",
    href: "/how-it-works",
  },
  {
    name: "Services",
    href: "/services",
    dropdown: [
      { name: "House Cleaning", href: "/services/house-cleaning" },
      { name: "Pressure Washing", href: "/services/pressure-washing" },
      { name: "Gutter Cleaning", href: "/services/gutter-cleaning" },
      { name: "Car Detailing", href: "/services/car-detailing" },
      { name: "Garden Maintenance", href: "/services/garden-maintenance" },
      { name: "Carpet Cleaning", href: "/services/carpet-cleaning" },
      { name: "Electricians", href: "/services/electricians" },
    ],
  },
  {
    name: "Pricing",
    href: "/pricing",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-lg border-b border-white/5 shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-background"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-xl bg-primary/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold text-gradient-1">Apex Leads</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <>
                    <button
                      onMouseEnter={() => setOpenDropdown(item.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                      className={clsx(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1",
                        pathname.startsWith(item.href)
                          ? "text-primary"
                          : "text-text-secondary hover:text-white"
                      )}
                    >
                      {item.name}
                      <svg
                        className={clsx(
                          "w-4 h-4 transition-transform",
                          openDropdown === item.name && "rotate-180"
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openDropdown === item.name && (
                      <div
                        onMouseEnter={() => setOpenDropdown(item.name)}
                        onMouseLeave={() => setOpenDropdown(null)}
                        className="absolute top-full left-0 mt-2 w-56 py-2 bg-surface/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl"
                      >
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-text-secondary hover:text-primary hover:bg-white/5 transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={clsx(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "text-primary bg-primary/10"
                        : "text-text-secondary hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-white transition-colors"
            >
              Join as Pro
            </Link>
            <Link href="/signup" className="btn btn-primary text-sm">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/5"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/5">
            <div className="space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === item.name ? null : item.name
                          )
                        }
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 rounded-lg"
                      >
                        {item.name}
                        <svg
                          className={clsx(
                            "w-4 h-4 transition-transform",
                            openDropdown === item.name && "rotate-180"
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {openDropdown === item.name && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-text-secondary hover:text-primary rounded-lg"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={clsx(
                        "block px-4 py-3 text-sm font-medium rounded-lg",
                        pathname === item.href
                          ? "text-primary bg-primary/10"
                          : "text-text-secondary hover:text-white hover:bg-white/5"
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
              <Link
                href="/signup"
                className="block w-full px-4 py-3 text-center text-sm font-medium text-text-secondary hover:text-white rounded-lg border border-white/10"
              >
                Join as Pro
              </Link>
              <Link
                href="/signup"
                className="block w-full px-4 py-3 text-center text-sm font-medium text-background bg-primary rounded-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

