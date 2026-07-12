export interface FinancialInputs {
  epargne_actuelle: number;
  montant_epargne_mensuel: number;
  frequence_epargne: string;
  dettes: number;
  taux_interet_dettes: number; // en %
  montant_paiement_dettes: number;
  frequence_paiement_dettes: string;
  montant_investi_mensuel: number;
  rendement_annuel_estime: number; // en %
  salaire_mensuel: number;
  autres_revenus: number;
  depenses_mensuelles: number;
}

export interface YearProjection {
  annee: number;
  epargne: number;
  dettes: number;
  investissements: number;
  patrimoineNet: number;
}

export interface MonthProjection {
  mois: number;
  epargne: number;
  dettes: number;
  investissements: number;
  patrimoineNet: number;
}

// Convertit un montant selon sa fréquence réelle en équivalent mensuel
export function montantMensuel(montant: number, frequence: string): number {
  switch (frequence) {
    case "hebdomadaire":
      return (montant * 52) / 12;
    case "aux_2_semaines":
      return (montant * 26) / 12;
    case "mensuel":
    default:
      return montant;
  }
}

export function projectNetWorth(
  inputs: FinancialInputs,
  years: number = 40
): YearProjection[] {
  const results: YearProjection[] = [];

  let epargne = inputs.epargne_actuelle;
  let dettes = inputs.dettes;
  let investissements = 0;

  const tauxDettesMensuel = inputs.taux_interet_dettes / 100 / 12;
  const rendementAnnuel = inputs.rendement_annuel_estime / 100;

  // Chaque flux est indépendant : dette, épargne et investissement se font EN PARALLÈLE,
  // pas l'un après l'autre. C'est à l'utilisateur de s'assurer que son budget le permet.
  const mensualiteDette = montantMensuel(
    inputs.montant_paiement_dettes,
    inputs.frequence_paiement_dettes
  );
  const epargneMensuelle = montantMensuel(
    inputs.montant_epargne_mensuel,
    inputs.frequence_epargne
  );

  for (let year = 0; year <= years; year++) {
    if (year > 0) {
      for (let month = 0; month < 12; month++) {
        // Dette : intérêts puis remboursement
        if (dettes > 0) {
          const interets = dettes * tauxDettesMensuel;
          const remboursementReel = Math.min(mensualiteDette, dettes + interets);
          dettes = Math.max(dettes + interets - remboursementReel, 0);
        }

        // Épargne : s'accumule chaque mois, indépendamment de la dette
        epargne += epargneMensuelle;

        // Investissements : versement mensuel
        investissements += inputs.montant_investi_mensuel;
      }
      // Croissance composée annuelle des investissements
      investissements = investissements * (1 + rendementAnnuel);
    }

    results.push({
      annee: year,
      epargne: Math.round(epargne),
      dettes: Math.round(dettes),
      investissements: Math.round(investissements),
      patrimoineNet: Math.round(epargne + investissements - dettes),
    });
  }

  return results;
}

// Même moteur que projectNetWorth, mais avec un point par mois au lieu d'un
// point par année — plus lisible pour les courtes durées (1-3 ans), où une
// projection annuelle ne donne que 2-4 points de données.
export function projectNetWorthMensuel(
  inputs: FinancialInputs,
  mois: number
): MonthProjection[] {
  const results: MonthProjection[] = [];

  let epargne = inputs.epargne_actuelle;
  let dettes = inputs.dettes;
  let investissements = 0;

  const tauxDettesMensuel = inputs.taux_interet_dettes / 100 / 12;
  // Taux mensuel équivalent au taux annuel, pour que la composition mensuelle
  // rejoigne exactement le résultat annuel de projectNetWorth à chaque année pleine.
  const rendementMensuel = Math.pow(1 + inputs.rendement_annuel_estime / 100, 1 / 12) - 1;

  const mensualiteDette = montantMensuel(
    inputs.montant_paiement_dettes,
    inputs.frequence_paiement_dettes
  );
  const epargneMensuelle = montantMensuel(
    inputs.montant_epargne_mensuel,
    inputs.frequence_epargne
  );

  results.push({
    mois: 0,
    epargne: Math.round(epargne),
    dettes: Math.round(dettes),
    investissements: Math.round(investissements),
    patrimoineNet: Math.round(epargne + investissements - dettes),
  });

  for (let m = 1; m <= mois; m++) {
    if (dettes > 0) {
      const interets = dettes * tauxDettesMensuel;
      const remboursementReel = Math.min(mensualiteDette, dettes + interets);
      dettes = Math.max(dettes + interets - remboursementReel, 0);
    }

    epargne += epargneMensuelle;
    investissements += inputs.montant_investi_mensuel;
    investissements = investissements * (1 + rendementMensuel);

    results.push({
      mois: m,
      epargne: Math.round(epargne),
      dettes: Math.round(dettes),
      investissements: Math.round(investissements),
      patrimoineNet: Math.round(epargne + investissements - dettes),
    });
  }

  return results;
}