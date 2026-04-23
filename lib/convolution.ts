import { padSignal, toRoundedSignal } from "@/lib/signalUtils";

const roundValue = (value: number, digits = 6): number => {
  const factor = 10 ** digits;
  const rounded = Math.round(value * factor) / factor;
  return Object.is(rounded, -0) ? 0 : rounded;
};

export interface ConvolutionStep {
  step: number;
  shiftedH: number[];
  product: number[];
  partialSum: number;
  outputIndex: number;
  expression: string;
}

export interface ConvolutionResult {
  output: number[];
  outputStartIndex: number;
  steps: ConvolutionStep[];
}

export const CONVOLUTION_FORMULA = "y[n] = sum x[k] * h[n-k], k = -inf..+inf";

export const linearConvolution = (
  xSignal: number[],
  hSignal: number[],
  xStartIndex = 0,
  hStartIndex = 0
): ConvolutionResult => {
  const x = toRoundedSignal(xSignal);
  const h = toRoundedSignal(hSignal);

  if (x.length === 0 || h.length === 0) {
    return {
      output: [],
      outputStartIndex: xStartIndex + hStartIndex,
      steps: []
    };
  }

  const nLength = x.length;
  const mLength = h.length;
  const outputLength = nLength + mLength - 1;
  const outputStartIndex = xStartIndex + hStartIndex;

  // The core sum uses padded arrays to match the textbook finite-length implementation.
  const paddedX = padSignal(x, outputLength);
  const paddedH = padSignal(h, outputLength);

  const output: number[] = [];
  const steps: ConvolutionStep[] = [];

  for (let step = 0; step < outputLength; step += 1) {
    const n = outputStartIndex + step;

    const paddedProducts = Array.from({ length: outputLength }, (_, k) => {
      const hIndex = step - k;
      const hValue = hIndex >= 0 && hIndex < outputLength ? paddedH[hIndex] : 0;
      return roundValue(paddedX[k] * hValue);
    });

    const partialSum = roundValue(paddedProducts.reduce((acc, value) => acc + value, 0));
    output.push(partialSum);

    const shiftedH = Array.from({ length: nLength }, (_, xRelativeIndex) => {
      const k = xStartIndex + xRelativeIndex;
      const hAbsoluteIndex = n - k;
      const hRelativeIndex = hAbsoluteIndex - hStartIndex;

      if (hRelativeIndex < 0 || hRelativeIndex >= mLength) {
        return 0;
      }

      return h[hRelativeIndex];
    });

    const product = shiftedH.map((value, index) => roundValue(value * x[index]));

    const terms = x
      .map((xValue, xRelativeIndex) => {
        const hValue = shiftedH[xRelativeIndex];
        if (xValue === 0 || hValue === 0) {
          return null;
        }

        const k = xStartIndex + xRelativeIndex;
        const hIndex = n - k;
        return `x[${k}]*h[${hIndex}]`;
      })
      .filter((term): term is string => Boolean(term));

    const expression =
      terms.length > 0
        ? `Computing y[${n}] = ${terms.join(" + ")} = ${partialSum}`
        : `Computing y[${n}] = 0`;

    steps.push({
      step,
      shiftedH,
      product,
      partialSum,
      outputIndex: n,
      expression
    });
  }

  return {
    output,
    outputStartIndex,
    steps
  };
};
