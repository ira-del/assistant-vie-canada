// Liste fiable d'organismes connus -> leur site officiel réel. Volontairement
// codée en dur (pas générée par l'IA) pour ne jamais afficher un lien inventé.
// On fait une correspondance par mot-clé sur le nom d'organisme retourné par
// l'IA ; si aucun organisme connu ne correspond, on n'affiche pas de lien.
const ORGANISMES_CONNUS: { motsCles: string[]; nom: string; url: string }[] = [
  {
    motsCles: ["agence du revenu du canada", "arc"],
    nom: "Agence du revenu du Canada",
    url: "https://www.canada.ca/fr/agence-revenu.html",
  },
  {
    motsCles: ["revenu québec", "revenu quebec"],
    nom: "Revenu Québec",
    url: "https://www.revenuquebec.ca",
  },
  {
    motsCles: ["service canada"],
    nom: "Service Canada",
    url: "https://www.canada.ca/fr/emploi-developpement-social/ministere/portefeuille/service-canada.html",
  },
  {
    motsCles: ["emploi et développement social", "edsc"],
    nom: "Emploi et Développement social Canada",
    url: "https://www.canada.ca/fr/emploi-developpement-social.html",
  },
  {
    motsCles: ["immigration, réfugiés et citoyenneté", "ircc"],
    nom: "Immigration, Réfugiés et Citoyenneté Canada",
    url: "https://www.canada.ca/fr/immigration-refugies-citoyennete.html",
  },
  {
    motsCles: ["ministère de l'immigration", "mifi"],
    nom: "Ministère de l'Immigration, de la Francisation et de l'Intégration",
    url: "https://www.quebec.ca/gouvernement/ministere/immigration-francisation-integration",
  },
  {
    motsCles: ["aide financière aux études", "afe"],
    nom: "Aide financière aux études (Québec)",
    url: "https://www.quebec.ca/education/aide-financiere-etudes",
  },
  {
    motsCles: ["assurance-emploi", "assurance emploi"],
    nom: "Assurance-emploi",
    url: "https://www.canada.ca/fr/services/prestations/ae.html",
  },
];

export function trouverLienOrganisme(organisme: string): { nom: string; url: string } | null {
  const texte = organisme.toLowerCase();
  for (const entry of ORGANISMES_CONNUS) {
    if (entry.motsCles.some((mot) => texte.includes(mot))) {
      return { nom: entry.nom, url: entry.url };
    }
  }
  return null;
}
