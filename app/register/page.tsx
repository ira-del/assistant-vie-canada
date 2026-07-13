import Link from "next/link";
import { signup } from "@/app/actions/auth";
import PasswordInput from "@/components/ui/PasswordInput";

export const metadata = { title: "Créer un compte", alternates: { canonical: "/register" } };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="glass rounded-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Créer un compte
        </h1>
        <p className="text-[var(--color-text-secondary)] text-center mb-8">
          Commence à simuler ton avenir financier
        </p>

        {error && (
          <p className="text-sm text-[var(--color-danger)] text-center mb-4">
            {error}
          </p>
        )}

        <form action={signup} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-[var(--color-primary)] transition"
              placeholder="toi@exemple.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Mot de passe
            </label>
            <PasswordInput
              id="password"
              name="password"
              required
              minLength={6}
              placeholder="6 caractères minimum"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="mt-4 rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition py-2 font-semibold"
          >
            S&apos;inscrire
          </button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-[var(--color-secondary)] hover:underline">
            Connecte-toi
          </Link>
        </p>
      </div>
    </main>
  );
}