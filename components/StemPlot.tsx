"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export interface StemPlotProps {
  signal: number[];
  startIndex?: number;
  highlightIndex?: number;
  title: string;
  color?: string;
  height?: number;
  className?: string;
}

const POSITIVE_COLOR = "#3B82F6";
const NEGATIVE_COLOR = "#EF4444";
const ZERO_COLOR = "#94A3B8";
const HIGHLIGHT_COLOR = "#F97316";

const roundValue = (value: number, digits = 4): number => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const StemPlot = ({
  signal,
  startIndex = 0,
  highlightIndex,
  title,
  color,
  height = 230,
  className
}: StemPlotProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [plotWidth, setPlotWidth] = useState(640);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    const updateSize = () => {
      setPlotWidth(Math.max(wrapper.clientWidth, 280));
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(wrapper);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(plotWidth * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${plotWidth}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const padding = {
      left: 58,
      right: 20,
      top: 22,
      bottom: 44
    };

    const width = plotWidth;
    const drawHeight = height;
    const areaWidth = width - padding.left - padding.right;
    const areaHeight = drawHeight - padding.top - padding.bottom;
    const axisY = padding.top + areaHeight / 2;

    context.fillStyle = "#020617";
    context.fillRect(0, 0, width, drawHeight);

    context.strokeStyle = "rgba(148, 163, 184, 0.16)";
    context.lineWidth = 1;
    context.setLineDash([4, 5]);

    const gridLines = 6;
    for (let i = 0; i <= gridLines; i += 1) {
      const y = padding.top + (areaHeight / gridLines) * i;
      context.beginPath();
      context.moveTo(padding.left, y);
      context.lineTo(width - padding.right, y);
      context.stroke();
    }
    context.setLineDash([]);

    context.strokeStyle = "#64748B";
    context.lineWidth = 1.25;

    context.beginPath();
    context.moveTo(padding.left, axisY);
    context.lineTo(width - padding.right, axisY);
    context.stroke();

    context.beginPath();
    context.moveTo(padding.left, padding.top);
    context.lineTo(padding.left, drawHeight - padding.bottom);
    context.stroke();

    context.fillStyle = "#CBD5E1";
    context.font = "12px Inter, sans-serif";
    context.textAlign = "center";
    context.fillText("n", width / 2, drawHeight - 12);

    context.save();
    context.translate(16, drawHeight / 2);
    context.rotate(-Math.PI / 2);
    context.fillText("Amplitude", 0, 0);
    context.restore();

    if (signal.length === 0) {
      context.fillStyle = "#94A3B8";
      context.font = "13px Inter, sans-serif";
      context.fillText("No samples to plot", width / 2, drawHeight / 2);
      return;
    }

    const maxAbs = Math.max(1, ...signal.map((value) => Math.abs(value)));
    const yScale = (areaHeight * 0.45) / maxAbs;

    context.fillStyle = "#94A3B8";
    context.textAlign = "right";
    context.font = "11px Inter, sans-serif";

    const yTicks = [maxAbs, maxAbs / 2, 0, -maxAbs / 2, -maxAbs].map((value) => roundValue(value));
    yTicks.forEach((tick) => {
      const y = axisY - tick * yScale;
      context.fillText(`${tick}`, padding.left - 8, y + 3);
    });

    const labelStride = Math.max(1, Math.ceil(signal.length / 12));

    signal.forEach((value, index) => {
      const x =
        signal.length === 1
          ? padding.left + areaWidth / 2
          : padding.left + (areaWidth * index) / (signal.length - 1);

      const y = axisY - value * yScale;
      const sampleIndex = startIndex + index;
      const isHighlighted = typeof highlightIndex === "number" && sampleIndex === highlightIndex;

      const stemColor = isHighlighted
        ? HIGHLIGHT_COLOR
        : value > 0
          ? color || POSITIVE_COLOR
          : value < 0
            ? NEGATIVE_COLOR
            : ZERO_COLOR;

      context.beginPath();
      context.strokeStyle = stemColor;
      context.lineWidth = isHighlighted ? 2.8 : 2;
      context.moveTo(x, axisY);
      context.lineTo(x, y);
      context.stroke();

      context.beginPath();
      context.fillStyle = stemColor;
      context.arc(x, y, isHighlighted ? 5 : 3.5, 0, Math.PI * 2);
      context.fill();

      if (index % labelStride === 0 || index === signal.length - 1) {
        context.fillStyle = "#CBD5E1";
        context.textAlign = "center";
        context.font = "11px Inter, sans-serif";
        context.fillText(String(sampleIndex), x, axisY + 18);
      }
    });
  }, [color, height, highlightIndex, plotWidth, signal, startIndex]);

  return (
    <article className={clsx("rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4 backdrop-blur-sm", className)}>
      <header className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <p className="text-xs text-slate-400">{signal.length} samples</p>
      </header>
      <div ref={wrapperRef} className="w-full">
        <canvas ref={canvasRef} className="block w-full rounded-xl border border-slate-800/80 bg-slate-950/80" />
      </div>
    </article>
  );
};

export default StemPlot;
