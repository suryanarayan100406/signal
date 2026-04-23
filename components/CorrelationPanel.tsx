"use client";

import { useMemo, useState } from "react";

import StemPlot from "@/components/StemPlot";
import { autoCorrelation, crossCorrelation } from "@/lib/correlation";

interface CorrelationPanelProps {
  xSignal: number[];
  hSignal: number[];
}

type CorrelationTab = "cross" | "auto";

const CorrelationPanel = ({ xSignal, hSignal }: CorrelationPanelProps) => {
  const [activeTab, setActiveTab] = useState<CorrelationTab>("cross");

  const cross = useMemo(() => crossCorrelation(xSignal, hSignal), [xSignal, hSignal]);
  const auto = useMemo(() => autoCorrelation(xSignal), [xSignal]);

  const selected = activeTab === "cross" ? cross : auto;
  const selectedTitle =
    activeTab === "cross" ? "Cross-Correlation Rxy[l]" : "Auto-Correlation Rxx[l]";

  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-800/80 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-sm">
      <header className="mb-5">
        <h2 className="text-xl font-semibold text-slate-100">3) Correlation Panel</h2>
        <p className="mt-1 text-sm text-slate-300">
          Analyze lag alignment using cross-correlation and inspect symmetry with auto-correlation.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("cross")}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300 ${
            activeTab === "cross"
              ? "border-blue-400 bg-blue-500 text-slate-950"
              : "border-slate-600 bg-slate-900 text-slate-200 hover:border-blue-400"
          }`}
        >
          Cross-Correlation
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("auto")}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300 ${
            activeTab === "auto"
              ? "border-violet-400 bg-violet-500 text-slate-950"
              : "border-slate-600 bg-slate-900 text-slate-200 hover:border-violet-400"
          }`}
        >
          Auto-Correlation
        </button>
      </div>

      <StemPlot
        title={`${selectedTitle} vs lag l`}
        signal={selected.values}
        startIndex={selected.lags[0] ?? 0}
        highlightIndex={selected.peakLag}
        height={230}
        color={activeTab === "cross" ? "#3B82F6" : "#8B5CF6"}
      />

      <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-200">
        Peak lag = {selected.peakLag}, value = {selected.peakValue}
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-700">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-slate-900 text-slate-200">
            <tr>
              <th className="border-b border-slate-700 px-3 py-2 text-left">Lag l</th>
              <th className="border-b border-slate-700 px-3 py-2 text-left">Correlation</th>
            </tr>
          </thead>
          <tbody>
            {selected.lags.map((lag, index) => {
              const value = selected.values[index];
              const isPeak = lag === selected.peakLag;

              return (
                <tr key={`${lag}-${value}`} className={isPeak ? "bg-amber-500/10" : "bg-slate-900/40"}>
                  <td className="border-b border-slate-800 px-3 py-2 text-slate-200">{lag}</td>
                  <td className="border-b border-slate-800 px-3 py-2 text-slate-300">{value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CorrelationPanel;
