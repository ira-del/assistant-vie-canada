import Link from "next/link";
import { login } from "@/app/actions/auth";
import PasswordInput from "@/components/ui/PasswordInput";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="glass rounded-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Connexion
        </h1>
        <p className="text-[var(--color-text-secondary)] text-center mb-8">
          Accède à ton tableau de bord financier
        </p>

        {error && (
          <p className="text-sm text-[var(--color-danger)] text-center mb-4">
            {error}
          </p>
        )}

        <form action={login} className="flex flex-col gap-4">
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
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm">
                Mot de passe
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[var(--color-secondary)] hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <PasswordInput
              id="password"
              name="password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="mt-4 rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition py-2 font-semibold"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-[var(--color-secondary)] hover:underline">
            Inscris-toi
          </Link>
        </p>
      </div>
    </main>
  );
}