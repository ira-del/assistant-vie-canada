// Calcule combien de temps il faudrait pour atteindre un objectif d'épargne
// selon différents rythmes mensuels — pure logique, aucun appel IA.

// Au-delà de ce délai, on considère l'objectif irréaliste au rythme actuel
// et on invite l'utilisateur à ajuster son effort ou son objectif.
export const SEUIL_MOIS_OBJECTIF_IRREALISTE = 25 * 12;

export function moisPourAtteindreObjectif(
  montantRestant: number,
  montantMensuel: number
): number | null {
  if (montantRestant <= 0) return 0;
  if (montantMensuel <= 0) return null;
  return Math.ceil(montantRestant / montantMensuel);
}

export function formatDureeMois(mois: number): string {
  if (mois <= 0) return "dès maintenant";
  const ans = Math.floor(mois / 12);
  const moisRestants = mois % 12;
  if (ans === 0) return `${mois} mois`;
  if (moisRestants === 0) return `${ans} an${ans > 1 ? "s" : ""}`;
  return `${ans} an${ans > 1 ? "s" : ""} ${moisRestants} mois`;
}

export function formatDateProjetee(mois: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() + mois);
  return date.toLocaleDateString("fr-CA", { month: "long", year: "numeric" });
}
