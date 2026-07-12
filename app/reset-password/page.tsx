import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePassword } from "@/app/actions/auth";
import PasswordInput from "@/components/ui/PasswordInput";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sans session de récupération active (lien invalide/expiré ou visite
  // directe de la page), on renvoie demander un nouveau lien.
  if (!user) {
    redirect("/forgot-password");
  }

  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="glass rounded-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Nouveau mot de passe
        </h1>
        <p className="text-[var(--color-text-secondary)] text-center mb-8">
          Choisis un nouveau mot de passe pour ton compte.
        </p>

        {error && (
          <p className="text-sm text-[var(--color-danger)] text-center mb-4">
            {error}
          </p>
        )}

        <form action={updatePassword} className="flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Nouveau mot de passe
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
            Mettre à jour le mot de passe
          </button>
        </form>
      </div>
    </main>
  );
}
