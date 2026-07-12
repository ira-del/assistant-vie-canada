export default function OnboardingStepper({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="flex items-center gap-2 mb-4 justify-center" aria-hidden="true">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`h-1.5 rounded-full transition-all ${
            step === currentStep
              ? "w-8 bg-[var(--color-primary)]"
              : step < currentStep
              ? "w-4 bg-[var(--color-primary)]/50"
              : "w-4 bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}
