import Link from "next/link";
import Logo from "@/components/ui/Logo";

const LIENS = [
  { href: "/fonctionnalites", label: "Fonctionnalités" },
  { href: "/blog", label: "Blog" },
  { href: "/a-propos", label: "À propos" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/confidentialite", label: "Politique de confidentialité" },
  { href: "/conditions-utilisation", label: "Conditions d'utilisation" },
  { href: "/mentions-legales", label: "Mentions légales" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div>
            <Logo />
            <p className="text-sm text-[var(--color-text-secondary)] mt-2 max-w-xs">
              L&apos;assistant de vie financier pensé pour le Canada.
            </p>
          </div>

          <nav
            aria-label="Liens du pied de page"
            className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2"
          >
            {LIENS.map((lien) => (
              <Link
                key={lien.href}
                href={lien.href}
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition"
              >
                {lien.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 text-xs text-[var(--color-text-secondary)] opacity-70">
          © {new Date().getFullYear()} Assistant Vie Canada. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
