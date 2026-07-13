// Injecte des données structurées Schema.org (JSON-LD) dans une page — aide
// Google à comprendre le contenu et peut activer des résultats enrichis
// (ex: questions dépliables directement dans les résultats de recherche
// pour une page qui utilise le schéma FAQPage).
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
