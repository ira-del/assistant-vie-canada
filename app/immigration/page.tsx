import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ImmigrationDiagnosisView from "@/components/immigration/ImmigrationDiagnosisView";

export default async function ImmigrationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen gradient-bg p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Immigration</h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Diagnostic et prochaines étapes selon ton statut
            </p>
          </div>
          <Link
            href="/dashboard"
            className="link-button rounded-lg bg-white/10 hover:bg-white/20 transition py-2 px-4 text-sm font-semibold"
          >
            ← Tableau de bord
          </Link>
        </div>

        <ImmigrationDiagnosisView />
      </div>
    </main>
  );
}
