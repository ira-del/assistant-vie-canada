import { Badge } from "@/lib/finance/badgeCatalog";

export default function BadgesShelf({
  catalog,
  earnedIds,
}: {
  catalog: Badge[];
  earnedIds: string[];
}) {
  const earnedCount = catalog.filter((b) => earnedIds.includes(b.id)).length;

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 mb-6 md:mb-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-[var(--color-primary)]">
          Badges
        </p>
        <span className="text-xs text-[var(--color-text-secondary)]">
          {earnedCount} / {catalog.length} débloqués
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {catalog.map((badge) => {
          const isEarned = earnedIds.includes(badge.id);
          return (
            <div
              key={badge.id}
              title={badge.description}
              className={`rounded-xl p-4 text-center border transition ${
                isEarned
                  ? "border-[var(--color-primary)]/40 bg-white/5"
                  : "border-white/5 opacity-40 grayscale"
              }`}
            >
              <div className="text-2xl mb-1">{badge.emoji}</div>
              <p className="text-xs font-medium leading-snug">{badge.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
