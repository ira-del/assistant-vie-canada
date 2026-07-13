import { HealthScoreResult } from "@/lib/finance/calculateHealthScore";

const NIVEAU_CONFIG = {
  excellent: { emoji: "🟢", label: "Excellente santé financière", color: "#10b981" },
  correct: { emoji: "🟡", label: "Situation correcte mais améliorable", color: "#f59e0b" },
  attention: { emoji: "🔴", label: "Plusieurs points sont à améliorer", color: "#ef4444" },
};

export default function HealthScoreCard({ result }: { result: HealthScoreResult }) {
  const config = NIVEAU_CONFIG[result.niveau];

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 md:p-8 mb-6 md:mb-8">
      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
        {/* Score circulaire */}
        <div className="flex-shrink-0 flex flex-col items-center mx-auto md:mx-0">
          <div
            className="relative w-32 h-32 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(${config.color} ${result.score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
            }}
          >
            <div className="absolute inset-2 rounded-full bg-[var(--color-surface)] flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{result.score}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">/ 100</span>
            </div>
          </div>
          <p className="text-sm mt-3 text-center max-w-[160px]">
            {config.emoji}{" "}
            <span style={{ color: config.color }} className="font-medium">
              {config.label}
            </span>
          </p>
        </div>

        {/* Détails */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 text-sm w-full">
          <div>
            <p className="font-semibold text-[var(--color-success)] mb-3 flex items-center gap-1.5">
              ✅ Points forts
            </p>
            <ul className="space-y-2 text-[var(--color-text-secondary)]">
              {result.pointsForts.map((p, i) => (
                <li key={i} className="leading-relaxed">{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-[var(--color-warning)] mb-3 flex items-center gap-1.5">
              ⚠️ Points faibles
            </p>
            <ul className="space-y-2 text-[var(--color-text-secondary)]">
              {result.pointsFaibles.length > 0 ? (
                result.pointsFaibles.map((p, i) => (
                  <li key={i} className="leading-relaxed">{p}</li>
                ))
              ) : (
                <li className="leading-relaxed">Rien à signaler pour l&apos;instant.</li>
              )}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-[var(--color-primary)] mb-3 flex items-center gap-1.5">
              🎯 Priorités
            </p>
            <ul className="space-y-2 text-[var(--color-text-secondary)]">
              {result.priorites.map((p, i) => (
                <li key={i} className="leading-relaxed">{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}