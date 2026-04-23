"use client";

import { useMemo, useState } from "react";

import StemPlot from "@/components/StemPlot";
import {
  SIGNAL_PRESETS,
  SignalPresetId,
  formatSignalInput,
  getPresetById,
  parseSignalInput
} from "@/lib/signalUtils";

export interface SignalInputPayload {
  xSignal: number[];
  hSignal: number[];
  xStartIndex: number;
  hStartIndex: number;
  xRaw: string;
  hRaw: string;
}

interface SignalInputProps {
  defaultX?: string;
  defaultH?: string;
  defaultXStartIndex?: number;
  defaultHStartIndex?: number;
  onCalculate: (payload: SignalInputPayload) => void;
}

const SignalInput = ({
  defaultX = "1, 2, 3, 1",
  defaultH = "1, 1, 1",
  defaultXStartIndex = 0,
  defaultHStartIndex = 0,
  onCalculate
}: SignalInputProps) => {
  const [xRaw, setXRaw] = useState(defaultX);
  const [hRaw, setHRaw] = useState(defaultH);
  const [xStartIndex, setXStartIndex] = useState(defaultXStartIndex);
  const [hStartIndex, setHStartIndex] = useState(defaultHStartIndex);

  const parsedX = useMemo(() => parseSignalInput(xRaw), [xRaw]);
  const parsedH = useMemo(() => parseSignalInput(hRaw), [hRaw]);

  const canCalculate =
    !parsedX.error && !parsedH.error && parsedX.values.length > 0 && parsedH.values.length > 0;

  const applyPreset = (target: "x" | "h", presetId: SignalPresetId) => {
    const values = getPresetById(presetId);
    const text = formatSignalInput(values);

    if (target === "x") {
      setXRaw(text);
      return;
    }

    setHRaw(text);
  };

  const handleCalculate = () => {
    if (!canCalculate) {
      return;
    }

    onCalculate({
      xSignal: parsedX.values,
      hSignal: parsedH.values,
      xStartIndex,
      hStartIndex,
      xRaw,
      hRaw
    });
  };

  const previewX = parsedX.error ? [] : parsedX.values;
  const previewH = parsedH.error ? [] : parsedH.values;

  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-800/80 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-sm">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">1) Signal Input Panel</h2>
          <p className="mt-1 text-sm text-slate-300">
            Enter comma-separated sequences and optional starting index n0 for both signals.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCalculate}
          disabled={!canCalculate}
          className="rounded-xl border border-blue-400/80 bg-blue-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-blue-400 disabled:cursor-not-allowed disabled:border-slate-600 disabled:bg-slate-700 disabled:text-slate-400"
        >
          Calculate Convolution
        </button>
      </header>

      <div className="grid gap-4">
        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-slate-100">x[n]</label>
            <input
              value={xRaw}
              onChange={(event) => setXRaw(event.target.value)}
              placeholder="Example: 1, 2, 3, 1"
              className="min-w-[220px] flex-1 rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-blue-400"
            />
            <label className="text-sm text-slate-300">n0</label>
            <input
              type="number"
              value={xStartIndex}
              onChange={(event) => setXStartIndex(Number(event.target.value))}
              className="w-20 rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition-all duration-300 focus:border-blue-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {SIGNAL_PRESETS.map((preset) => (
              <button
                key={`x-${preset.id}`}
                type="button"
                onClick={() => applyPreset("x", preset.id)}
                className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 transition-all duration-300 hover:border-blue-400 hover:text-blue-300"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {parsedX.error ? <p className="mt-2 text-xs text-rose-400">{parsedX.error}</p> : null}
        </article>

        <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-slate-100">h[n]</label>
            <input
              value={hRaw}
              onChange={(event) => setHRaw(event.target.value)}
              placeholder="Example: 1, 1, 1"
              className="min-w-[220px] flex-1 rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-violet-400"
            />
            <label className="text-sm text-slate-300">n0</label>
            <input
              type="number"
              value={hStartIndex}
              onChange={(event) => setHStartIndex(Number(event.target.value))}
              className="w-20 rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition-all duration-300 focus:border-violet-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {SIGNAL_PRESETS.map((preset) => (
              <button
                key={`h-${preset.id}`}
                type="button"
                onClick={() => applyPreset("h", preset.id)}
                className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 transition-all duration-300 hover:border-violet-400 hover:text-violet-300"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {parsedH.error ? <p className="mt-2 text-xs text-rose-400">{parsedH.error}</p> : null}
        </article>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <StemPlot
          title="Live Preview: x[n]"
          signal={previewX}
          startIndex={xStartIndex}
          height={220}
          color="#3B82F6"
        />
        <StemPlot
          title="Live Preview: h[n]"
          signal={previewH}
          startIndex={hStartIndex}
          height={220}
          color="#8B5CF6"
        />
      </div>
    </section>
  );
};

export default SignalInput;
