"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";

export default function HeaderMenu({
  showImmigration = true,
}: {
  showImmigration?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`cursor-pointer rounded-lg border transition py-2 px-4 text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 ${
          open
            ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
            : "bg-white/10 border-white/15 hover:bg-white/20 hover:border-white/30"
        }`}
      >
        Menu
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
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

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-[var(--color-surface)] border border-white/10 shadow-2xl overflow-hidden z-50">
          <Link
            href="/progression"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm cursor-pointer hover:bg-white/10 active:bg-white/20 transition"
          >
            Ma progression
          </Link>
          <Link
            href="/assistant"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm cursor-pointer hover:bg-white/10 active:bg-white/20 transition"
          >
            Assistant IA
          </Link>
          <Link
            href="/opportunites"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm cursor-pointer hover:bg-white/10 active:bg-white/20 transition"
          >
            Opportunités
          </Link>
          {showImmigration && (
            <Link
              href="/immigration"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm cursor-pointer hover:bg-white/10 active:bg-white/20 transition"
            >
              Immigration
            </Link>
          )}
          <Link
            href="/onboarding/profil"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm cursor-pointer hover:bg-white/10 active:bg-white/20 transition border-t border-white/10"
          >
            Modifier mon profil
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="menu-item-button w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 active:bg-white/20 transition text-[var(--color-danger)] border-t border-white/10"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
