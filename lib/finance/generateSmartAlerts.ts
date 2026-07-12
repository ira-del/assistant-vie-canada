import { HealthScoreInputs } from "./calculateHealthScore";

export interface SmartAlertInputs extends HealthScoreInputs {
  tauxInteretDettes: number;
}

export interface SmartAlert {
  id: string;
  message: string;
}

// Contrairement à generateNextSteps (les problèmes à corriger), ces alertes
// repèrent des opportunités : surplus non investi, dette coûteuse, objectif
// presque atteint. Pas de persistance en DB : recalculées à chaque chargement.
export function generateSmartAlerts(inputs: SmartAlertInputs): SmartAlert[] {
  const {
    revenuMensuelTotal,
    depensesMensuelles,
    dettes,
    tauxInteretDettes,
    montantEpargneMensuel,
    montantInvestiMensuel,
    montantPaiementDettes,
    montantObjectif,
    progressionObjectif,
  } = inputs;

  const alerts: SmartAlert[] = [];

  const soldeMensuel =
    revenuMensuelTotal - depensesMensuelles - montantPaiementDettes - montantInvestiMensuel - montantEpargneMensuel;
  if (soldeMensuel > 300) {
    alerts.push({
      id: "surplus_non_investi",
      message: `Tu as un surplus mensuel de ${Math.round(soldeMensuel).toLocaleString("fr-CA")} $ non affecté. Tu pourrais en investir une partie pour le faire fructifier.`,
    });
  }

  if (dettes > 0 && tauxInteretDettes >= 10) {
    const interetAnnuelEstime = Math.round(dettes * (tauxInteretDettes / 100));
    alerts.push({
      id: "dette_taux_eleve",
      message: `Tes dettes ont un taux d'intérêt élevé (${tauxInteretDettes}%), ce qui te coûte environ ${interetAnnuelEstime.toLocaleString("fr-CA")} $ par an. Rembourser plus vite réduirait cette facture.`,
    });
  }

  if (montantObjectif > 0 && progressionObjectif >= 80 && progressionObjectif < 100) {
    alerts.push({
      id: "objectif_presque_atteint",
      message: `Tu es à ${progressionObjectif}% de ton objectif financier. Encore un petit effort et tu y es !`,
    });
  }

  const montantMisDeCote = montantEpargneMensuel + montantInvestiMensuel;
  const tauxEpargneReel =
    revenuMensuelTotal > 0 ? (montantMisDeCote / revenuMensuelTotal) * 100 : 0;
  if (tauxEpargneReel >= 20 && montantEpargneMensuel > montantInvestiMensuel * 2) {
    alerts.push({
      id: "epargne_vers_investissement",
      message: "Tu épargnes très bien ! Une partie de cette épargne pourrait être placée dans un compte d'investissement pour profiter des intérêts composés.",
    });
  }

  return alerts;
}
