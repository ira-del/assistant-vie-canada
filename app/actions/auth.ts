"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

// Reconstruit l'origine du site (protocole + hôte) à partir des en-têtes de
// la requête — fonctionne aussi bien en local qu'une fois déployé, sans
// avoir besoin de coder l'URL en dur ou d'ajouter une variable d'env.
async function getSiteOrigin(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol =
    headersList.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

// Fonction appelée par le formulaire de connexion
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Pour l'instant on redirige simplement vers la page de login avec une erreur en query
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

// Fonction appelée par le formulaire d'inscription
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

// Fonction pour se déconnecter (on l'utilisera plus tard)
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// Envoie l'email de réinitialisation de mot de passe
export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const origin = await getSiteOrigin();

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });

  // Toujours le même message, que l'email existe ou non dans la base —
  // évite de révéler quels emails sont déjà inscrits (énumération de comptes).
  redirect("/forgot-password?envoye=1");
}

// Enregistre le nouveau mot de passe — appelée depuis /reset-password,
// où l'utilisateur arrive avec une session de récupération déjà active
// (établie par app/auth/confirm/route.ts après clic sur le lien de l'email)
export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}