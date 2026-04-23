"use client";

import html2canvas from "html2canvas";
import { useRef, useState } from "react";

import { CONVOLUTION_FORMULA, ConvolutionResult } from "@/lib/convolution";

interface ResultSummaryProps {
  result: ConvolutionResult;
}

const ResultSummary = ({ result }: ResultSummaryProps) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const nValues = result.output.map((_, index) => result.outputStartIndex + index);

  const handleCopy = async () => {
    const lines = [
      "Convolution Result",
      CONVOLUTION_FORMULA,
      `n: ${nValues.join(", ")}`,
      `y[n]: ${result.output.join(", ")}`
    ];

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = async () => {
    if (!summaryRef.current) {
      return;
    }

    setDownloading(true);

    try {
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: "#0F172A",
        scale: 2,
        useCORS: true
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "convosim-result.png";
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-800/80 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-sm">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">4) Result Summary</h2>
          <p className="mt-1 text-sm text-slate-300">Final output sequence table, formula, and export actions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition-all duration-300 hover:border-blue-400"
          >
            {copied ? "Copied" : "Copy Result"}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="rounded-lg border border-violet-400 bg-violet-500 px-3 py-2 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-violet-400 disabled:cursor-not-allowed disabled:border-slate-600 disabled:bg-slate-700 disabled:text-slate-400"
          >
            {downloading ? "Rendering..." : "Download as PNG"}
          </button>
        </div>
      </header>

      <div ref={summaryRef} className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
        <p className="mb-3 text-sm text-slate-200">Formula: {CONVOLUTION_FORMULA}</p>

        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="min-w-full border-collapse text-sm">
            <tbody>
              <tr className="bg-slate-950/70">
                <th className="border-b border-slate-700 px-3 py-2 text-left text-slate-200">n</th>
                {nValues.map((value) => (
                  <td key={`n-${value}`} className="border-b border-slate-800 px-3 py-2 text-slate-300">
                    {value}
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-900/60">
                <th className="px-3 py-2 text-left text-slate-200">y[n]</th>
                {result.output.map((value, index) => (
                  <td key={`y-${nValues[index]}`} className="px-3 py-2 text-slate-300">
                    {value}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ResultSummary;
