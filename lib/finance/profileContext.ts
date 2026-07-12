// Construit un bloc de texte décrivant les informations spécifiques au profil
// professionnel de l'utilisateur (entrepreneur, étudiant, retraité...), pour
// que les fonctionnalités IA (conseiller, opportunités, immigration) en
// tiennent compte — même si ces infos ne sont plus affichées en cartes sur
// le dashboard.
export function buildProfessionalContext(
  situationProfessionnelle: string | null | undefined,
  finances: Record<string, unknown>
): string {
  switch (situationProfessionnelle) {
    case "Entrepreneur(e) / travailleur(-euse) autonome":
      return `
Chiffre d'affaires mensuel : ${finances.chiffre_affaires_mensuel ?? 0} $
Bénéfices mensuels : ${finances.benefices_mensuels ?? 0} $
Taxes/acomptes à prévoir : ${finances.taxes_a_payer_estimees ?? 0} $`.trim();

    case "Étudiant(e)":
      return `
Programme d'études : ${finances.programme_etudes || "non renseigné"}
Progression dans le programme : ${finances.progression_etudes || "non renseignée"}
Bourse (équivalent mensuel) : ${finances.montant_bourse_mensuel ?? 0} $`.trim();

    case "Retraité(e)":
      return `
Pension mensuelle : ${finances.montant_pension_mensuel ?? 0} $
Âge de retraite prévu/actuel : ${finances.age_retraite_prevu || "non renseigné"}`.trim();

    default:
      return "";
  }
}
