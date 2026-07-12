import { HealthScoreInputs } from "./calculateHealthScore";

export interface NextStep {
  id: string;
  label: string;
  description: string;
}

// Chaque étape a un id stable : ne pas le renommer, il sert de clé de
// persistance dans checklist_progress (renommer ferait perdre l'état coché).
export function generateNextSteps(inputs: HealthScoreInputs): NextStep[] {
  const {
    revenuMensuelTotal,
    depensesMensuelles,
    epargneActuelle,
    dettes,
    montantEpargneMensuel,
    montantInvestiMensuel,
    montantPaiementDettes,
    montantObjectif,
  } = inputs;

  const steps: NextStep[] = [];

  const moisCouverts =
    depensesMensuelles > 0 ? epargneActuelle / depensesMensuelles : 0;
  if (moisCouverts < 3) {
    steps.push({
      id: "fonds_urgence",
      label: "Constituer un fonds d'urgence",
      description: `Vise ${Math.round(depensesMensuelles * 3).toLocaleString("fr-CA")} $ de côté (3 mois de dépenses) avant d'investir davantage.`,
    });
  }

  if (dettes > 0 && montantPaiementDettes > 0) {
    steps.push({
      id: "rembourser_dettes",
      label: "Accélérer le remboursement des dettes",
      description: "Augmente légèrement ton paiement mensuel, en priorité sur les dettes à taux d'intérêt élevé.",
    });
  }

  const montantMisDeCote = montantEpargneMensuel + montantInvestiMensuel;
  const tauxEpargneReel =
    revenuMensuelTotal > 0 ? (montantMisDeCote / revenuMensuelTotal) * 100 : 0;
  if (tauxEpargneReel < 10) {
    steps.push({
      id: "augmenter_epargne",
      label: "Augmenter ton taux d'épargne",
      description: "Essaie de mettre de côté au moins 10 % de ton revenu chaque mois, même un petit montant régulier.",
    });
  }

  if (montantInvestiMensuel === 0) {
    steps.push({
      id: "ouvrir_investissement",
      label: "Ouvrir un compte d'investissement (CELI/REER)",
      description: "Même un petit montant mensuel dans un CELI ou REER profite des intérêts composés sur le long terme.",
    });
  }

  const soldeMensuel =
    revenuMensuelTotal - depensesMensuelles - montantPaiementDettes - montantInvestiMensuel - montantEpargneMensuel;
  if (soldeMensuel < 0) {
    steps.push({
      id: "equilibrer_budget",
      label: "Équilibrer ton budget mensuel",
      description: "Revois tes dépenses ou tes engagements financiers : ton budget est actuellement déficitaire.",
    });
  }

  if (montantObjectif === 0) {
    steps.push({
      id: "definir_objectif",
      label: "Définir un objectif financier",
      description: "Te fixer un objectif chiffré (achat, voyage, retraite...) aide à suivre ta progression dans le temps.",
    });
  }

  return steps;
}
