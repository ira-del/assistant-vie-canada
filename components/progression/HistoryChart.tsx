"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface HealthSnapshot {
  snapshot_date: string;
  health_score: number;
  patrimoine_net: number;
}

// snapshot_date est un champ "date" Postgres (ex: "2026-07-12"), sans heure.
// new Date("2026-07-12") serait interprété comme minuit UTC, ce qui décale
// l'affichage d'un jour dans les fuseaux horaires en avance sur UTC-0 (ex:
// Québec) une fois reconverti en heure locale — on construit donc la date
// manuellement à partir des composantes plutôt que de parser la string.
function parseDateLocale(dateStr: string): Date {
  const [annee, mois, jour] = dateStr.split("-").map(Number);
  return new Date(annee, mois - 1, jour);
}

const METRIQUES = [
  {
    key: "patrimoine_net" as const,
    label: "Valeur nette",
    color: "#6366f1",
    formatter: (v: number) =>
      v.toLocaleString("fr-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }),
  },
  {
    key: "health_score" as const,
    label: "Score de santé",
    color: "#22c55e",
    formatter: (v: number) => `${v}/100`,
  },
];

export default function HistoryChart({ snapshots }: { snapshots: HealthSnapshot[] }) {
  const [metrique, setMetrique] = useState<(typeof METRIQUES)[number]["key"]>(
    "patrimoine_net"
  );

  if (snapshots.length < 2) {
    return (
      <div className="glass rounded-2xl p-5 sm:p-6 mb-6 md:mb-8">
        <p className="text-sm font-semibold text-[var(--color-primary)] mb-1">
          Ton évolution réelle
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Reviens dans quelques jours pour voir ton évolution réelle se dessiner ici — un point
          est enregistré à chaque visite du tableau de bord.
        </p>
      </div>
    );
  }

  const actif = METRIQUES.find((m) => m.key === metrique)!;

  const data = snapshots.map((s) => ({
    date: parseDateLocale(s.snapshot_date).toLocaleDateString("fr-CA", {
      month: "short",
      day: "numeric",
    }),
    valeur: s[metrique],
  }));

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 mb-6 md:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-semibold text-[var(--color-primary)]">
            Ton évolution réelle
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] opacity-70">
            Basé sur tes chiffres enregistrés au fil du temps — pas une projection
          </p>
        </div>
        <div className="flex gap-1.5">
          {METRIQUES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetrique(m.key)}
              className={`text-xs px-2.5 py-1 rounded-full transition ${
                metrique === m.key
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <YAxis
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => (metrique === "health_score" ? v : v.toLocaleString("fr-CA"))}
            width={70}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const v = payload[0].value as number;
              return (
                <div className="bg-[#1a1f2e] border border-white/15 rounded-lg p-3 text-xs">
                  <p style={{ color: actif.color }}>
                    {actif.label} : {actif.formatter(v)}
                  </p>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="valeur"
            stroke={actif.color}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
