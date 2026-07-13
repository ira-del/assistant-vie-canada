"use client";

import { useState, useMemo, useRef } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  projectNetWorth,
  projectNetWorthMensuel,
  FinancialInputs,
} from "@/lib/finance/projectNetWorth";

const DUREES = [1, 5, 10];

const UNITES = [
  { valeur: "jours", label: "jour(s)" },
  { valeur: "semaines", label: "semaine(s)" },
  { valeur: "mois", label: "mois" },
  { valeur: "annees", label: "année(s)" },
] as const;
type Unite = (typeof UNITES)[number]["valeur"];

const COURBES = [
  { key: "patrimoineNet", label: "Valeur nette", color: "#6366f1" },
  { key: "epargne", label: "Épargne", color: "#06b6d4" },
  { key: "investissements", label: "Investissements", color: "#a855f7" },
  { key: "dettes", label: "Dettes", color: "#ef4444" },
] as const;

interface Point {
  periode: number;
  epargne: number;
  dettes: number;
  investissements: number;
  patrimoineNet: number;
}

// Convertit une durée personnalisée (ex: "2 semaines") en nombre de mois
// entiers — le moteur de projection ne calcule qu'à la granularité du mois
// ou de l'année, il n'y a pas de projection jour par jour.
function convertirEnMois(valeur: number, unite: Unite): number {
  switch (unite) {
    case "jours":
      return Math.max(1, Math.round(valeur / 30));
    case "semaines":
      return Math.max(1, Math.round(valeur / 4.345));
    case "mois":
      return Math.max(1, Math.round(valeur));
    case "annees":
      return Math.max(1, Math.round(valeur * 12));
  }
}

export default function NetWorthChart({ inputs }: { inputs: FinancialInputs }) {
  const [duree, setDuree] = useState(5);
  const [mensuel, setMensuel] = useState(false);
  const [courbesActives, setCourbesActives] = useState<Set<string>>(
    new Set(["patrimoineNet"])
  );

  const [expanded, setExpanded] = useState(false);
  const [personnaliseOuvert, setPersonnaliseOuvert] = useState(false);
  const [customValeur, setCustomValeur] = useState(6);
  const [customUnite, setCustomUnite] = useState<Unite>("mois");
  const [pointSelectionne, setPointSelectionne] = useState<number | null>(null);
  // Suivi en continu du point survolé — le clic s'appuie sur cette valeur
  // plutôt que sur son propre e.activeLabel, qui peut être en retard d'un
  // cran par rapport à la position réelle de la souris (comportement connu
  // de Recharts : l'état interactif interne n'est pas toujours à jour au
  // moment exact du clic).
  const pointSurvole = useRef<number | null>(null);

  const data: Point[] = useMemo(() => {
    if (mensuel) {
      return projectNetWorthMensuel(inputs, duree).map((p) => ({
        periode: p.mois,
        epargne: p.epargne,
        dettes: p.dettes,
        investissements: p.investissements,
        patrimoineNet: p.patrimoineNet,
      }));
    }
    return projectNetWorth(inputs, duree).map((p) => ({
      periode: p.annee,
      epargne: p.epargne,
      dettes: p.dettes,
      investissements: p.investissements,
      patrimoineNet: p.patrimoineNet,
    }));
  }, [inputs, duree, mensuel]);

  const tickInterval = mensuel
    ? duree <= 12
      ? 0
      : Math.ceil(duree / 12)
    : duree <= 10
    ? 1
    : duree <= 40
    ? 4
    : duree <= 60
    ? 9
    : 19;

  const formatMoney = (value: number) =>
    value.toLocaleString("fr-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    });

  function toggleCourbe(key: string) {
    setCourbesActives((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function choisirPreset(annees: number) {
    setMensuel(false);
    setDuree(annees);
    setPersonnaliseOuvert(false);
    setPointSelectionne(null);
    pointSurvole.current = null;
  }

  function appliquerPersonnalise() {
    const totalMois = convertirEnMois(customValeur, customUnite);
    if (totalMois <= 36) {
      setMensuel(true);
      setDuree(totalMois);
    } else {
      setMensuel(false);
      setDuree(Math.max(1, Math.round(totalMois / 12)));
    }
    setPointSelectionne(null);
    pointSurvole.current = null;
  }

  return (
    <div className="glass rounded-2xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-1">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Évolution de ta situation financière
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] opacity-70">
            Basé sur ta situation actuelle, maintenue constante
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex-wrap gap-1.5 items-center ${
              expanded ? "flex" : "hidden md:flex"
            }`}
          >
            {DUREES.map((d) => (
              <button
                key={d}
                onClick={() => choisirPreset(d)}
                className={`text-xs px-2.5 py-1 rounded-full transition ${
                  !mensuel && duree === d
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10"
                }`}
              >
                {d} an{d > 1 ? "s" : ""}
              </button>
            ))}
            <button
              onClick={() => setPersonnaliseOuvert((o) => !o)}
              className={`text-xs px-2.5 py-1 rounded-full transition border ${
                personnaliseOuvert
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/20"
                  : "border-white/10 bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10"
              }`}
            >
              Personnalisé
            </button>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="md:hidden flex-shrink-0 text-xs font-medium text-[var(--color-primary)] hover:underline"
          >
            {expanded ? "Masquer le graphique" : "Voir le graphique"}
          </button>
        </div>
      </div>

      <div className={expanded ? "block" : "hidden md:block"}>
      {personnaliseOuvert && (
        <div className="flex flex-wrap items-end gap-2 mt-3 p-3 rounded-lg bg-white/5">
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">
              Durée
            </label>
            <input
              type="number"
              min={1}
              value={customValeur}
              onChange={(e) => setCustomValeur(Math.max(1, Number(e.target.value)))}
              className="w-24 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 outline-none focus:border-[var(--color-primary)] transition text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">
              Unité
            </label>
            <select
              value={customUnite}
              onChange={(e) => setCustomUnite(e.target.value as Unite)}
              className="rounded-lg bg-[var(--color-surface)] border border-white/10 px-3 py-1.5 outline-none focus:border-[var(--color-primary)] transition text-sm text-white"
            >
              {UNITES.map((u) => (
                <option key={u.valeur} value={u.valeur} className="bg-[var(--color-surface)]">
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={appliquerPersonnalise}
            className="rounded-lg bg-[var(--color-primary)] hover:opacity-90 transition py-1.5 px-4 text-sm font-semibold"
          >
            Appliquer
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-3 my-4">
        {COURBES.map((c) => (
          <button
            key={c.key}
            onClick={() => toggleCourbe(c.key)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition ${
              courbesActives.has(c.key)
                ? "border-white/20 bg-white/10"
                : "border-white/5 opacity-40 hover:opacity-70"
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: c.color }}
            />
            {c.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-[var(--color-text-secondary)] opacity-70 mb-2">
        Clique sur un point de la courbe pour voir le détail de cette période.
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          onMouseMove={(e) => {
            if (e && e.activeLabel !== undefined && e.activeLabel !== null) {
              pointSurvole.current = Number(e.activeLabel);
            }
          }}
          onClick={() => {
            if (pointSurvole.current !== null) {
              setPointSelectionne(pointSurvole.current);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          {pointSelectionne !== null && (
            <ReferenceLine x={pointSelectionne} stroke="#94a3b8" strokeDasharray="4 4" />
          )}
          <XAxis
            dataKey="periode"
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            interval={tickInterval}
            label={{
              value: mensuel ? "Mois" : "Années",
              position: "insideBottom",
              offset: -5,
              fill: "#94a3b8",
              fontSize: 11,
            }}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => v.toLocaleString("fr-CA")}
            width={80}
          />
<Tooltip
            isAnimationActive={false}
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;
              const point = payload[0].payload as Point;
              const valeurs: Record<string, number> = {
                patrimoineNet: point.patrimoineNet,
                epargne: point.epargne,
                investissements: point.investissements,
                dettes: point.dettes,
              };
              return (
                <div className="bg-[#1a1f2e] border border-white/15 rounded-lg p-3 text-xs space-y-1">
                  <p className="font-semibold mb-1">
                    {mensuel ? "Mois" : "Année"} {label}
                  </p>
                  {COURBES.filter((c) => courbesActives.has(c.key)).map((c) => (
                    <p key={c.key} style={{ color: c.color }}>
                      {c.label} : {formatMoney(valeurs[c.key])}
                    </p>
                  ))}
                </div>
              );
            }}
          />
          {COURBES.filter((c) => courbesActives.has(c.key)).map((c) => (
            <Line
              key={c.key}
              type="monotone"
              dataKey={c.key}
              stroke={c.color}
              strokeWidth={2}
              dot={false}
              name={c.label}
              isAnimationActive={false}
              activeDot={{ r: 5, cursor: "pointer" }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>

      {pointSelectionne !== null &&
        (() => {
          const point = data.find((p) => p.periode === pointSelectionne);
          if (!point) return null;
          return (
            <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold">
                  Détail — {mensuel ? "Mois" : "Année"} {pointSelectionne}
                </p>
                <button
                  type="button"
                  onClick={() => setPointSelectionne(null)}
                  aria-label="Fermer le détail"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition text-sm leading-none px-1"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {COURBES.filter((c) => courbesActives.has(c.key)).map((c) => (
                  <div key={c.key}>
                    <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 mb-0.5">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: c.color }}
                      />
                      {c.label}
                    </p>
                    <p className="text-sm font-semibold" style={{ color: c.color }}>
                      {formatMoney(point[c.key])}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
