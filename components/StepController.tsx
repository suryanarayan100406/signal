"use client";

interface StepControllerProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speedIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onPlayPause: () => void;
  onReset: () => void;
  onSpeedChange: (index: number) => void;
}

const SPEED_LABELS = ["Slow", "Normal", "Fast"];

const StepController = ({
  currentStep,
  totalSteps,
  isPlaying,
  speedIndex,
  onPrev,
  onNext,
  onPlayPause,
  onReset,
  onSpeedChange
}: StepControllerProps) => {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentStep <= 0}
          className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 transition-all duration-300 hover:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>

        <button
          type="button"
          onClick={onPlayPause}
          disabled={totalSteps <= 1}
          className="rounded-lg border border-blue-400 bg-blue-500 px-3 py-2 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-blue-400 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-700 disabled:text-slate-400"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={currentStep >= totalSteps - 1}
          className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 transition-all duration-300 hover:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>

        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 transition-all duration-300 hover:border-violet-400"
        >
          Reset
        </button>

        <p className="ml-auto text-sm text-slate-300">
          Step {Math.min(currentStep + 1, Math.max(totalSteps, 1))} of {Math.max(totalSteps, 1)}
        </p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="speed" className="text-xs uppercase tracking-wide text-slate-400">
          Speed: {SPEED_LABELS[speedIndex]}
        </label>
        <input
          id="speed"
          type="range"
          min={0}
          max={2}
          step={1}
          value={speedIndex}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700"
        />
        <div className="flex justify-between text-xs text-slate-400">
          {SPEED_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepController;
