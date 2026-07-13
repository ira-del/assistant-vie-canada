"use client";

import { useState, useTransition } from "react";
import { NextStep } from "@/lib/finance/generateNextSteps";
import { toggleChecklistItem } from "@/app/actions/checklist";

export default function NextStepsChecklist({
  steps,
  completedIds,
}: {
  steps: NextStep[];
  completedIds: string[];
}) {
  const [completed, setCompleted] = useState(new Set(completedIds));
  const [isPending, startTransition] = useTransition();

  if (steps.length === 0) {
    return (
      <div className="glass rounded-2xl p-5 sm:p-6 mb-6 md:mb-8">
        <p className="text-sm font-semibold text-[var(--color-primary)] mb-1">
          Prochaines étapes
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Rien d&apos;urgent à faire pour l&apos;instant, continue sur ta lancée !
        </p>
      </div>
    );
  }

  function handleToggle(stepId: string) {
    const isNowCompleted = !completed.has(stepId);

    // Optimistic UI : on met à jour l'affichage tout de suite
    setCompleted((prev) => {
      const next = new Set(prev);
      if (isNowCompleted) next.add(stepId);
      else next.delete(stepId);
      return next;
    });

    startTransition(async () => {
      const result = await toggleChecklistItem(stepId, isNowCompleted);
      if (result.error) {
        // Échec : on annule le changement optimiste
        setCompleted((prev) => {
          const next = new Set(prev);
          if (isNowCompleted) next.delete(stepId);
          else next.add(stepId);
          return next;
        });
      }
    });
  }

  const doneCount = steps.filter((s) => completed.has(s.id)).length;

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 mb-6 md:mb-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-[var(--color-primary)]">
          Prochaines étapes
        </p>
        <span className="text-xs text-[var(--color-text-secondary)]">
          {doneCount} / {steps.length} complétées
        </span>
      </div>
      <ul className="space-y-3">
        {steps.map((step) => {
          const isDone = completed.has(step.id);
          return (
            <li key={step.id} className="flex items-start gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleToggle(step.id)}
                aria-pressed={isDone}
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition ${
                  isDone
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                    : "border-white/30 hover:border-white/60"
                }`}
              >
                {isDone && (
                  <span className="text-xs leading-none text-white">✓</span>
                )}
              </button>
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDone
                      ? "line-through text-[var(--color-text-secondary)]"
                      : "text-[var(--color-text-primary)]"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
