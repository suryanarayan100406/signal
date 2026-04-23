import Link from "next/link";

const concepts = [
  "Discrete-time finite-length sequences and indexing",
  "Linear convolution as sliding weighted overlap",
  "Flip-shift-multiply-add procedure",
  "Convolution output length: N + M - 1",
  "Step-wise accumulation for educational DSP visualization"
];

const blocks = [
  "Input x[n], h[n]",
  "Flip h[n] -> h[-k]",
  "Shift to h[n-k]",
  "Multiply x[k] with h[n-k]",
  "Sum products -> y[n]"
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="print-surface rounded-2xl border border-slate-700/80 bg-slate-800/80 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-sm">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-300">IEEE Appendix Reference</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-100">ConvoSim: Convolution Calculator</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            ConvoSim is an educational simulator for linear convolution of discrete-time signals.
            It shows each step of the process visually so learners can understand how the output
            sequence is formed.
          </p>
        </header>

        <section className="mb-7">
          <h2 className="mb-3 text-lg font-semibold text-slate-100">Convolution Block Flow</h2>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {blocks.map((block, index) => (
              <div key={block} className="flex items-center gap-2">
                <div className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-200">
                  {block}
                </div>
                {index < blocks.length - 1 ? <span className="text-slate-400">-&gt;</span> : null}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-7">
          <h2 className="mb-3 text-lg font-semibold text-slate-100">Signal Processing Concepts Covered</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            {concepts.map((concept) => (
              <li key={concept} className="rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2">
                {concept}
              </li>
            ))}
          </ul>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-700 pt-4 text-sm text-slate-400">
          <p>Prepared for IEEE report appendix. This page is print-friendly.</p>
          <Link
            href="/"
            className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-200 transition-all duration-300 hover:border-blue-400"
          >
            Back to Simulator
          </Link>
        </footer>
      </div>
    </main>
  );
}
