# ConvoSim - Convolution Calculator (Beginner Guide)

ConvoSim is a visual tool to learn linear convolution with simple inputs and step-by-step animation.

## What you can do

- Enter two signals as comma-separated values
- Watch convolution happen one step at a time
- See the final output table
- Copy or download the result as PNG

## Convolution in one minute

A discrete-time signal is just a sequence of numbers.

Example:
- x[n] = 1, 2, 3, 1
- h[n] = 1, 1, 1

Convolution formula:

y[n] = sum x[k] * h[n-k]

Practical meaning:
1. Flip h
2. Shift it across x
3. Multiply overlap values
4. Add them to get one output sample
5. Repeat for all output indices

## Quick start

Requirements:
- Node.js 18+
- npm

Run locally:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

Optional production test:

```bash
npm run build
npm start
```

## How to use the app

The page has 3 sections.

### 1) Signal Input

- Enter x[n] and h[n] using commas
   - Example: 1, 2, 3, 1
- Optional: set n0 (starting index) for each signal
- You can use presets:
   - Unit Impulse
   - Unit Step
   - Rectangular Pulse
   - Ramp
   - Exponential (a=0.5)
   - Sinusoidal (w=pi/4)
- Click Calculate Convolution

### 2) Convolution Visualizer

You will see 4 rows:
1. x[k] (fixed)
2. h[n-k] (flipped and shifted)
3. x[k] * h[n-k] (product)
4. y[n] (output building step by step)

Controls:
- Prev
- Play or Pause
- Next
- Reset
- Speed slider (Slow, Normal, Fast)

### 3) Result Summary

- Output table of y[n]
- Formula display
- Copy Result button
- Download as PNG button

## First example to try

Input:
- x[n] = 1, 2, 3, 1
- h[n] = 1, 1, 1
- n0 = 0 for both

Expected output:
- y[n] = 1, 3, 6, 6, 4, 1

Quick checks:
1. Set h[n] to Unit Impulse [1], output should match x[n]
2. Change n0 and observe index shift behavior
3. Try Ramp and Sinusoidal presets and compare output shapes

## How to read stem plots

- Horizontal axis: index n
- Vertical axis: amplitude
- Blue stem: positive value
- Red stem: negative value
- Gray point: zero
- Orange highlight: current active sample

## About page

Open /about for a print-friendly summary containing:
- Short abstract
- Convolution block flow
- Concepts covered

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Troubleshooting

1. Invalid input error
Use valid comma-separated numbers only.

2. Output not updating
Press Calculate Convolution after changing inputs.

3. Build issue
Reinstall dependencies:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm run build
```

## License

Educational and academic use.
