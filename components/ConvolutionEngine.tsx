"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import StepController from "@/components/StepController";
import StemPlot from "@/components/StemPlot";
import { ConvolutionResult } from "@/lib/convolution";

interface ConvolutionEngineProps {
  xSignal: number[];
  hSignal: number[];
  xStartIndex: number;
  hStartIndex: number;
  result: ConvolutionResult;
}

const SPEED_STEPS = [500, 300, 150];

const ConvolutionEngine = ({
  xSignal,
  hSignal,
  xStartIndex,
  hStartIndex,
  result
}: ConvolutionEngineProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);
  const intervalRef = useRef<number | null>(null);

  const totalSteps = result.steps.length;

  const safeStepIndex = useMemo(() => {
    if (totalSteps === 0) {
      return 0;
    }

    return Math.min(currentStep, totalSteps - 1);
  }, [currentStep, totalSteps]);

  const activeStep = totalSteps > 0 ? result.steps[safeStepIndex] : null;

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [result.output.length, result.outputStartIndex, result.steps.length]);

  useEffect(() => {
    if (!isPlaying || totalSteps <= 1) {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setCurrentStep((previousStep) => {
        if (previousStep >= totalSteps - 1) {
          setIsPlaying(false);
          return previousStep;
        }

        return previousStep + 1;
      });
    }, SPEED_STEPS[speedIndex]);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, speedIndex, totalSteps]);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStep((value) => Math.max(value - 1, 0));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep((value) => Math.min(value + 1, Math.max(totalSteps - 1, 0)));
  };

  const handlePlayPause = () => {
    if (totalSteps <= 1) {
      return;
    }

    setIsPlaying((value) => !value);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const accumulatedOutput = result.output.map((value, index) => (index <= safeStepIndex ? value : 0));
  const shiftedSignal = activeStep ? activeStep.shiftedH : Array.from({ length: xSignal.length }, () => 0);
  const productSignal = activeStep ? activeStep.product : Array.from({ length: xSignal.length }, () => 0);

  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-800/80 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-sm">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">2) Convolution Visualizer</h2>
          <p className="mt-1 text-sm text-slate-300">
            Step-by-step view of y[n] = x[n] * h[n] with flipped-and-shifted h[n-k].
          </p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-300">
          Step {Math.min(safeStepIndex + 1, Math.max(totalSteps, 1))} of {Math.max(totalSteps, 1)}
        </div>
      </header>

      <div className="mb-4 rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-200">
        {activeStep
          ? activeStep.expression
          : "Click Calculate to generate convolution steps and start the animation."}
      </div>

      <div className="grid gap-4">
        <StemPlot title="Row 1: x[k] (fixed)" signal={xSignal} startIndex={xStartIndex} height={180} />

        <StemPlot
          key={`shift-${safeStepIndex}`}
          title={`Row 2: h[n-k] (flipped and shifted), n = ${activeStep?.outputIndex ?? result.outputStartIndex}`}
          signal={shiftedSignal}
          startIndex={xStartIndex}
          height={180}
          color="#8B5CF6"
          className="animate-plot-fade"
        />

        <StemPlot
          key={`product-${safeStepIndex}`}
          title="Row 3: x[k] * h[n-k]"
          signal={productSignal}
          startIndex={xStartIndex}
          height={180}
          color="#3B82F6"
          className="animate-plot-fade"
        />

        <StemPlot
          key={`output-${safeStepIndex}`}
          title="Row 4: y[n] (accumulating output)"
          signal={accumulatedOutput}
          startIndex={result.outputStartIndex}
          highlightIndex={activeStep?.outputIndex}
          height={190}
          className="animate-plot-fade"
        />
      </div>

      <div className="mt-5">
        <StepController
          currentStep={safeStepIndex}
          totalSteps={totalSteps}
          isPlaying={isPlaying}
          speedIndex={speedIndex}
          onPrev={handlePrev}
          onNext={handleNext}
          onPlayPause={handlePlayPause}
          onReset={handleReset}
          onSpeedChange={(index) => setSpeedIndex(index)}
        />
      </div>

      <p className="mt-4 text-xs text-slate-400">
        h[n] starts at n = {hStartIndex}, x[n] starts at n = {xStartIndex}, therefore y[n] starts at n =
        {" "}
        {result.outputStartIndex}.
      </p>
    </section>
  );
};

export default ConvolutionEngine;
