import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StrataForge",
    template: "%s | StrataForge",
  },
  description:
    "Explore software architecture patterns, compare technology choices, and build implementation-ready solution blueprints.",
};

const navItems = [
  { href: "/", label: "Forge" },
  { href: "/patterns", label: "Pattern Atlas" },
  { href: "/scenarios", label: "Scenario Field Guide" },
  { href: "/compare", label: "Pattern Workbench" },
  { href: "/settings", label: "Settings" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <aside className="sidebar">
            <div className="brand-block">
              <p className="eyebrow">RuhlinIT Digital</p>
              <Link href="/" className="brand-link">
                StrataForge
              </Link>
              <p className="brand-copy">
                Compare software design patterns across languages, stacks, and
                integration boundaries.
              </p>
            </div>

            <nav className="nav">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}