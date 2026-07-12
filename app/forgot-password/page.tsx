import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ envoye?: string }>;
}) {
  const { envoye } = await searchParams;

  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="glass rounded-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Mot de passe oublié
        </h1>

        {envoye ? (
          <>
            <p className="text-[var(--color-text-secondary)] text-center mb-8">
              Si un compte existe avec cet email, un lien de réinitialisation vient d&apos;être
              envoyé. Vérifie ta boîte de réception (et tes indésirables).
            </p>
            <Link
              href="/login"
              className="link-button block text-center rounded-lg bg-white/10 hover:bg-white/20 transition py-2 font-semibold"
            >
              Retour à la connexion
            </Link>
          </>
        ) : (
          <>
            <p className="text-[var(--color-text-secondary)] text-center mb-8">
              Entre ton email, on t&apos;enverra un lien pour réinitialiser ton mot de passe.
            </p>
            <form action={requestPasswordReset} className="flex flex-col gap-4">
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
              <button
                type="submit"
                className="mt-4 rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition py-2 font-semibold"
              >
                Envoyer le lien
              </button>
            </form>
            <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
              <Link href="/login" className="text-[var(--color-secondary)] hover:underline">
                Retour à la connexion
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
