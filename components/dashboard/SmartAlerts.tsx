"use client";

import { useState, useTransition } from "react";
import { SmartAlert } from "@/lib/finance/generateSmartAlerts";
import { dismissSmartAlert } from "@/app/actions/alerts";

export default function SmartAlerts({
  alerts,
  dismissedIds,
}: {
  alerts: SmartAlert[];
  dismissedIds: string[];
}) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set(dismissedIds));
  const [, startTransition] = useTransition();

  const visible = alerts.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  function handleDismiss(alertId: string) {
    setDismissed((prev) => new Set(prev).add(alertId));

    startTransition(async () => {
      const result = await dismissSmartAlert(alertId);
      if (result.error) {
        setDismissed((prev) => {
          const next = new Set(prev);
          next.delete(alertId);
          return next;
        });
      }
    });
  }

  return (
    <div className="space-y-3 mb-6 md:mb-8">
      {visible.map((alert) => (
        <div
          key={alert.id}
          className="glass rounded-2xl p-4 flex items-start gap-3 border border-[var(--color-primary)]/30"
        >
          <p className="flex-1 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {alert.message}
          </p>
          <button
            type="button"
            onClick={() => handleDismiss(alert.id)}
            aria-label="Ignorer cette suggestion"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition text-sm leading-none px-1"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
