import { HealthScoreInputs } from "./calculateHealthScore";

export interface Badge {
  id: string;
  emoji: string;
  label: string;
  description: string;
}

// Catalogue de tous les badges possibles. Un badge gagné reste acquis pour
// toujours (persisté dans badges_earned), même si la situation régresse
// ensuite — ce sont des jalons atteints, pas un statut en temps réel.
// Seuils volontairement exigeants : ce sont de vraies réussites, pas des
// paliers de participation.
export const BADGE_CATALOG: Badge[] = [
  {
    id: "profil_complete",
    emoji: "🧾",
    label: "Premier pas",
    description: "Tu as complété ton profil financier.",
  },
  {
    id: "budget_equilibre",
    emoji: "⚖️",
    label: "Budget équilibré",
    description: "Ton solde mensuel (après dépenses, dettes et investissements) est nettement positif.",
  },
  {
    id: "investisseur",
    emoji: "📈",
    label: "Investisseur actif",
    description: "Tu investis au moins 10% de ton revenu chaque mois.",
  },
  {
    id: "fonds_urgence",
    emoji: "🛟",
    label: "Fonds d'urgence",
    description: "Ton épargne couvre au moins 6 mois de dépenses.",
  },
  {
    id: "objectif_atteint",
    emoji: "🏆",
    label: "Objectif atteint",
    description: "Tu as atteint 100% de ton objectif financier.",
  },
  {
    id: "sans_dette",
    emoji: "🏁",
    label: "Sans dette",
    description: "Tu n'as plus aucune dette à rembourser.",
  },
  {
    id: "valeur_nette_positive",
    emoji: "💎",
    label: "Valeur nette positive",
    description: "Tu possèdes plus que tu ne dois.",
  },
];

// Retourne les ids de badges dont la condition est remplie *avec les
// données actuelles*. Le caller compare avec ce qui est déjà en DB pour
// savoir quels nouveaux badges attribuer (voir app/dashboard/page.tsx).
export function computeSatisfiedBadgeIds(inputs: HealthScoreInputs): string[] {
  const {
    revenuMensuelTotal,
    depensesMensuelles,
    epargneActuelle,
    dettes,
    montantEpargneMensuel,
    montantInvestiMensuel,
    montantPaiementDettes,
    patrimoineNet,
    montantObjectif,
    progressionObjectif,
  } = inputs;

  const satisfied: string[] = ["profil_complete"];

  const soldeMensuel =
    revenuMensuelTotal - depensesMensuelles - montantPaiementDettes - montantInvestiMensuel - montantEpargneMensuel;
  if (soldeMensuel > depensesMensuelles * 0.2) satisfied.push("budget_equilibre");

  const tauxInvestissement =
    revenuMensuelTotal > 0 ? (montantInvestiMensuel / revenuMensuelTotal) * 100 : 0;
  if (tauxInvestissement >= 10) satisfied.push("investisseur");

  const moisCouverts = depensesMensuelles > 0 ? epargneActuelle / depensesMensuelles : 0;
  if (moisCouverts >= 6) satisfied.push("fonds_urgence");

  if (montantObjectif > 0 && progressionObjectif >= 100) satisfied.push("objectif_atteint");

  if (dettes === 0) satisfied.push("sans_dette");

  if (patrimoineNet >= 0) satisfied.push("valeur_nette_positive");

  return satisfied;
}
