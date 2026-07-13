"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { GA_MEASUREMENT_ID, pageview } from "@/lib/analytics/gtag";
import { lireConsentement, EVENEMENT_CONSENTEMENT } from "@/lib/analytics/consent";

// Ne charge le script GA4 qu'une fois le consentement accepté — tant que
// rien n'est chargé, aucun cookie ni requête vers Google n'est envoyé.
export default function GoogleAnalyticsLoader() {
  const [autorise, setAutorise] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // localStorage n'existe pas côté serveur — on ne peut lire le
    // consentement qu'après le montage, pour éviter un mismatch
    // d'hydratation entre le rendu serveur et le premier rendu client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAutorise(lireConsentement() === "accepted");
    function onChange() {
      setAutorise(lireConsentement() === "accepted");
    }
    window.addEventListener(EVENEMENT_CONSENTEMENT, onChange);
    return () => window.removeEventListener(EVENEMENT_CONSENTEMENT, onChange);
  }, []);

  // La navigation App Router ne recharge pas la page — sans ça, seule la
  // toute première page vue serait comptabilisée.
  useEffect(() => {
    if (autorise) pageview(pathname);
  }, [pathname, autorise]);

  if (!autorise || !GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
