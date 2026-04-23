export type SignalPresetId =
  | "impulse"
  | "step"
  | "rect"
  | "ramp"
  | "exponential"
  | "sinusoidal";

export interface SignalPreset {
  id: SignalPresetId;
  label: string;
  values: number[];
}

const roundValue = (value: number, digits = 6): number => {
  const factor = 10 ** digits;
  const rounded = Math.round(value * factor) / factor;
  return Object.is(rounded, -0) ? 0 : rounded;
};

export const SIGNAL_PRESETS: SignalPreset[] = [
  { id: "impulse", label: "Unit Impulse", values: [1] },
  { id: "step", label: "Unit Step", values: [1, 1, 1, 1, 1, 1] },
  { id: "rect", label: "Rectangular Pulse", values: [1, 1, 1, 1] },
  { id: "ramp", label: "Ramp", values: [0, 1, 2, 3, 4, 5] },
  { id: "exponential", label: "Exponential (a=0.5)", values: [1, 0.5, 0.25, 0.125, 0.0625] },
  {
    id: "sinusoidal",
    label: "Sinusoidal (w=pi/4)",
    values: Array.from({ length: 8 }, (_, n) => roundValue(Math.sin((Math.PI / 4) * n)))
  }
];

export interface ParsedSignalInput {
  values: number[];
  error: string | null;
}

export const parseSignalInput = (input: string): ParsedSignalInput => {
  const trimmed = input.trim();
  if (!trimmed) {
    return { values: [], error: "Enter at least one value." };
  }

  const rawParts = trimmed.split(",");
  const values: number[] = [];

  for (const part of rawParts) {
    const token = part.trim();
    if (!token) {
      return { values: [], error: "Use comma-separated numeric values only." };
    }

    const parsed = Number(token);
    if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
      return { values: [], error: `Invalid number: ${token}` };
    }

    values.push(roundValue(parsed));
  }

  return { values, error: null };
};

export const formatSignalInput = (signal: number[]): string => signal.join(", ");

export const getPresetById = (id: SignalPresetId): number[] => {
  const preset = SIGNAL_PRESETS.find((item) => item.id === id);
  return preset ? [...preset.values] : [];
};

export const flipSignal = (signal: number[]): number[] => [...signal].reverse();

export const shiftSignal = (signal: number[], shiftBy: number): { signal: number[]; startIndex: number } => ({
  signal: [...signal],
  startIndex: shiftBy
});

export const padSignal = (signal: number[], targetLength: number): number[] => {
  if (targetLength <= signal.length) {
    return signal.slice(0, targetLength);
  }

  return [...signal, ...Array.from({ length: targetLength - signal.length }, () => 0)];
};

export const multiplySignals = (a: number[], b: number[]): number[] => {
  const length = Math.min(a.length, b.length);
  return Array.from({ length }, (_, index) => roundValue(a[index] * b[index]));
};

export const buildIndexRange = (startIndex: number, length: number): number[] =>
  Array.from({ length }, (_, i) => startIndex + i);

export const toRoundedSignal = (signal: number[]): number[] => signal.map((value) => roundValue(value));
