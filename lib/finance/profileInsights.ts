export interface ProfileInsights {
  titre: string;
  conseils: string[];
}

// Conseils adaptés à la situation professionnelle — vient compléter le
// dashboard générique sans le remplacer (le reste des cartes reste identique
// pour tout le monde).
const INSIGHTS_PAR_PROFIL: Record<string, ProfileInsights> = {
  "Étudiant(e)": {
    titre: "Conseils pour étudiant(e)",
    conseils: [
      "Priorise les bourses et le REEE avant d'emprunter — un prêt étudiant reste une dette à rembourser.",
      "Ouvre un CELI même avec un petit montant régulier : c'est l'habitude qui compte plus que le montant à cet âge.",
      "Garde tes reçus de frais de scolarité pour le crédit d'impôt fédéral et provincial.",
    ],
  },
  "Travailleur(-euse) salarié(e)": {
    titre: "Conseils pour salarié(e)",
    conseils: [
      "Si ton employeur cotise à un REER collectif ou un RVER, cotise au moins le minimum pour obtenir la contrepartie — c'est de l'argent gratuit.",
      "Vérifie ta couverture d'assurance collective avant d'en payer une en double ailleurs.",
    ],
  },
  "Entrepreneur(e) / travailleur(-euse) autonome": {
    titre: "Conseils pour travailleur(-euse) autonome",
    conseils: [
      "Mets de côté pour les acomptes provisionnels trimestriels — personne ne retient l'impôt à ta place.",
      "Vise un fonds d'urgence plus large (6 à 12 mois de dépenses) : tes revenus sont moins prévisibles qu'un salaire fixe.",
      "N'oublie pas que tu paies la part employeur ET employé des cotisations RRQ/RPC.",
    ],
  },
  "Retraité(e)": {
    titre: "Conseils pour la retraite",
    conseils: [
      "Surveille ton taux de retrait annuel : viser autour de 4 % de ton portefeuille aide à ne pas t'épuiser trop vite.",
      "Coordonne l'ordre de tes retraits (FERR, CELI, REER) selon leur traitement fiscal plutôt qu'au hasard.",
      "Vérifie ton admissibilité à la Sécurité de la vieillesse et au Supplément de revenu garanti.",
    ],
  },
  "Sans emploi actuellement": {
    titre: "Pendant ta recherche d'emploi",
    conseils: [
      "Priorise ton fonds d'urgence avant tout autre objectif financier pour l'instant.",
      "Vérifie ton admissibilité à l'assurance-emploi si ce n'est pas déjà fait.",
      "Mets en pause les cotisations non essentielles (investissement, épargne long terme) si ton budget est serré — tu pourras reprendre après.",
    ],
  },
};

export function getProfileInsights(situationProfessionnelle: string | null): ProfileInsights | null {
  if (!situationProfessionnelle) return null;
  return INSIGHTS_PAR_PROFIL[situationProfessionnelle] ?? null;
}
