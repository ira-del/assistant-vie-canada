export interface HealthScoreInputs {
  revenuMensuelTotal: number;
  depensesMensuelles: number;
  epargneActuelle: number;
  dettes: number;
  montantEpargneMensuel: number;
  montantInvestiMensuel: number;
  montantPaiementDettes: number;
  patrimoineNet: number;
  montantObjectif: number;
  progressionObjectif: number; // en %
}

export interface HealthScoreResult {
  score: number; // sur 100
  niveau: "excellent" | "correct" | "attention";
  pointsForts: string[];
  pointsFaibles: string[];
  priorites: string[];
}

export function calculateHealthScore(inputs: HealthScoreInputs): HealthScoreResult {
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

  let score = 0;
  const pointsForts: string[] = [];
  const pointsFaibles: string[] = [];
  const priorites: string[] = [];

  // 1. Taux d'épargne réel (20 pts) — % du revenu réellement mis de côté
  const montantMisDeCote = montantEpargneMensuel + montantInvestiMensuel;
  const tauxEpargneReel =
    revenuMensuelTotal > 0 ? (montantMisDeCote / revenuMensuelTotal) * 100 : 0;
  const pointsEpargne = Math.min(20, Math.round((tauxEpargneReel / 20) * 20));
  score += pointsEpargne;
  if (tauxEpargneReel >= 20) {
    pointsForts.push("Tu épargnes une bonne portion de ton revenu chaque mois.");
  } else if (tauxEpargneReel < 10) {
    pointsFaibles.push("Ton taux d'épargne réel est assez faible.");
    priorites.push("Essaie d'augmenter, même légèrement, ce que tu mets de côté chaque mois.");
  }

  // 2. Fonds d'urgence (20 pts) — mois de dépenses couverts par l'épargne
  const moisCouverts =
    depensesMensuelles > 0 ? epargneActuelle / depensesMensuelles : 0;
  const pointsFondsUrgence = Math.min(20, Math.round((moisCouverts / 6) * 20));
  score += pointsFondsUrgence;
  if (moisCouverts >= 6) {
    pointsForts.push("Ton fonds d'urgence couvre 6 mois de dépenses ou plus.");
  } else if (moisCouverts < 3) {
    pointsFaibles.push("Ton fonds d'urgence est insuffisant en cas d'imprévu.");
    priorites.push(
      `Vise un fonds d'urgence d'au moins ${Math.round(depensesMensuelles * 3).toLocaleString("fr-CA")} $ (3 mois de dépenses).`
    );
  }

  // 3. Taux d'endettement (20 pts) — dettes vs revenu annuel
  const revenuAnnuel = revenuMensuelTotal * 12;
  const tauxEndettement = revenuAnnuel > 0 ? (dettes / revenuAnnuel) * 100 : 0;
  const pointsEndettement = Math.max(0, Math.min(20, Math.round(20 - (tauxEndettement / 100) * 20)));
  score += pointsEndettement;
  if (tauxEndettement === 0) {
    pointsForts.push("Tu n'as aucune dette actuellement.");
  } else if (tauxEndettement > 50) {
    pointsFaibles.push("Ton niveau de dette est élevé par rapport à ton revenu.");
    priorites.push("Priorise le remboursement de tes dettes, surtout celles à taux d'intérêt élevé.");
  }

  // 4. Valeur nette (15 pts)
  const pointsValeurNette = patrimoineNet >= 0 ? 15 : Math.max(0, 15 + Math.round(patrimoineNet / 2000));
  score += Math.min(15, pointsValeurNette);
  if (patrimoineNet >= 0) {
    pointsForts.push("Ta valeur nette est positive : tu possèdes plus que tu ne dois.");
  } else {
    pointsFaibles.push("Ta valeur nette est négative pour le moment.");
  }

  // 5. Solde mensuel (15 pts)
  const soldeMensuel =
    revenuMensuelTotal - depensesMensuelles - montantPaiementDettes - montantInvestiMensuel - montantEpargneMensuel;
  const pointsSolde = soldeMensuel >= 0 ? 15 : Math.max(0, 15 + Math.round(soldeMensuel / 100));
  score += Math.min(15, pointsSolde);
  if (soldeMensuel < 0) {
    pointsFaibles.push("Ton budget mensuel est actuellement déficitaire.");
    priorites.push("Revois tes dépenses ou tes engagements financiers pour équilibrer ton budget.");
  }

  // 6. Progression vers l'objectif (10 pts)
  const pointsObjectif = montantObjectif > 0 ? Math.round((progressionObjectif / 100) * 10) : 5;
  score += pointsObjectif;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let niveau: HealthScoreResult["niveau"] = "attention";
  if (score >= 75) niveau = "excellent";
  else if (score >= 50) niveau = "correct";

  if (pointsForts.length === 0) {
    pointsForts.push("Tu as commencé à suivre tes finances, c'est une excellente première étape.");
  }
  if (priorites.length === 0) {
    priorites.push("Continue sur cette lancée et révise ta situation régulièrement.");
  }

  return { score, niveau, pointsForts, pointsFaibles, priorites };
}