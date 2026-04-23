const roundValue = (value: number, digits = 6): number => {
  const factor = 10 ** digits;
  const rounded = Math.round(value * factor) / factor;
  return Object.is(rounded, -0) ? 0 : rounded;
};

export interface CorrelationResult {
  lags: number[];
  values: number[];
  peakLag: number;
  peakValue: number;
}

export const crossCorrelation = (x: number[], y: number[]): CorrelationResult => {
  if (x.length === 0 || y.length === 0) {
    return {
      lags: [],
      values: [],
      peakLag: 0,
      peakValue: 0
    };
  }

  const nLength = x.length;
  const mLength = y.length;
  const minLag = -(mLength - 1);
  const maxLag = nLength - 1;

  const lags: number[] = [];
  const values: number[] = [];

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let sum = 0;

    for (let n = 0; n < nLength; n += 1) {
      const yIndex = n + lag;
      if (yIndex >= 0 && yIndex < mLength) {
        sum += x[n] * y[yIndex];
      }
    }

    lags.push(lag);
    values.push(roundValue(sum));
  }

  const peakIndex = values.reduce((bestIndex, value, index, array) => {
    return Math.abs(value) > Math.abs(array[bestIndex]) ? index : bestIndex;
  }, 0);

  return {
    lags,
    values,
    peakLag: lags[peakIndex],
    peakValue: values[peakIndex]
  };
};

export const autoCorrelation = (x: number[]): CorrelationResult => crossCorrelation(x, x);
