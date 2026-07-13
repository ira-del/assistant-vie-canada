import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OpportunitiesList from "@/components/opportunites/OpportunitiesList";

export default async function OpportunitesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen gradient-bg p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Opportunités</h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Aides, bourses, crédits d&apos;impôt et subventions adaptés à ta situation
            </p>
          </div>
          <Link
            href="/dashboard"
            className="link-button rounded-lg bg-white/10 hover:bg-white/20 transition py-2 px-4 text-sm font-semibold"
          >
            ← Tableau de bord
          </Link>
        </div>

        <OpportunitiesList />
      </div>
    </main>
  );
}
