"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import ConvolutionEngine from "@/components/ConvolutionEngine";
import ResultSummary from "@/components/ResultSummary";
import SignalInput, { SignalInputPayload } from "@/components/SignalInput";
import { linearConvolution } from "@/lib/convolution";

const DEFAULT_INPUT: SignalInputPayload = {
  xSignal: [1, 2, 3, 1],
  hSignal: [1, 1, 1],
  xStartIndex: 0,
  hStartIndex: 0,
  xRaw: "1, 2, 3, 1",
  hRaw: "1, 1, 1"
};

export default function HomePage() {
  const [activeInput, setActiveInput] = useState<SignalInputPayload>(DEFAULT_INPUT);

  const convolutionResult = useMemo(() => {
    return linearConvolution(
      activeInput.xSignal,
      activeInput.hSignal,
      activeInput.xStartIndex,
      activeInput.hStartIndex
    );
  }, [activeInput]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 rounded-2xl border border-slate-700/80 bg-slate-800/80 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-300">ConvoSim</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              Convolution Calculator
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
              Learn linear convolution using simple signal input, clear stem-plot visualization,
              and step-by-step animation.
            </p>
          </div>

          <Link
            href="/about"
            className="rounded-xl border border-violet-400 bg-violet-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-violet-400"
          >
            IEEE About Page
          </Link>
        </div>
      </header>

      <div className="space-y-6">
        <SignalInput
          defaultX={DEFAULT_INPUT.xRaw}
          defaultH={DEFAULT_INPUT.hRaw}
          defaultXStartIndex={DEFAULT_INPUT.xStartIndex}
          defaultHStartIndex={DEFAULT_INPUT.hStartIndex}
          onCalculate={(payload) => setActiveInput(payload)}
        />

        <ConvolutionEngine
          xSignal={activeInput.xSignal}
          hSignal={activeInput.hSignal}
          xStartIndex={activeInput.xStartIndex}
          hStartIndex={activeInput.hStartIndex}
          result={convolutionResult}
        />

        <ResultSummary result={convolutionResult} />
      </div>
    </main>
  );
}
