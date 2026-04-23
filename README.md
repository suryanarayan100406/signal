# ConvoSim - Convolution and Correlation Calculator

ConvoSim is an interactive web app to learn and compute discrete-time signal operations:
- Linear convolution
- Cross-correlation
- Auto-correlation

It is built with Next.js 14 + TypeScript + Tailwind CSS, with no backend required.

## Who is this for?

If you are new to signal processing, this app is designed for you.
It shows each convolution step visually, instead of only giving the final number sequence.

## Core idea in simple words

### 1) Signal
A discrete-time signal is just a list of numbers ordered by index:
- Example: x[n] = [1, 2, 3, 1]
- The index n usually starts at 0, but you can set a different start index n0.

### 2) Convolution (output of system)
Convolution combines two signals to produce a new signal:

y[n] = sum over k of x[k] * h[n-k]

Think of it as:
1. Flip h
2. Slide h across x
3. Multiply overlap values
4. Add them to get one output sample
5. Repeat for each output index

### 3) Cross-correlation (similarity vs shift)
Cross-correlation tells how similar two signals are at different shifts (lags):

Rxy[l] = sum over n of x[n] * y[n+l]

### 4) Auto-correlation
Auto-correlation compares a signal with itself:

Rxx[l] = sum over n of x[n] * x[n+l]

Useful facts:
- It is symmetric around lag 0
- Maximum is usually at lag 0

## Quick start (run locally)

Requirements:
- Node.js 18 or newer
- npm

Install and run:

```bash
npm install
npm run dev
```

Open:
- http://localhost:3000

Production build test:

```bash
npm run build
npm start
```

## How to use the app (step-by-step)

The home page has 4 sections from top to bottom.

### 1) Signal Input Panel
- Enter x[n] and h[n] as comma-separated numbers.
  - Example: 1, 2, 3, 1
- Optionally set n0 (starting index) for each signal.
- Use preset buttons if you want ready-made signals:
  - Unit Impulse
  - Unit Step
  - Rectangular Pulse
  - Ramp
  - Exponential (a=0.5)
  - Sinusoidal (w=pi/4)
- Live stem plots update while you type.
- Click Calculate Convolution to compute and update all sections.

### 2) Convolution Visualizer
You will see 4 stacked plots:
1. x[k] (fixed)
2. h[n-k] (flipped and shifted each step)
3. x[k] * h[n-k] (pointwise product)
4. y[n] (accumulating output)

Controls:
- Prev: go one step back
- Play/Pause: animate steps
- Next: go one step forward
- Reset: return to first step
- Speed slider: Slow / Normal / Fast

Important:
- The text line above the plots shows the current equation being computed.
- Step counter shows progress through all output samples.

### 3) Correlation Panel
- Switch tabs:
  - Cross-Correlation
  - Auto-Correlation
- View stem plot vs lag
- See table of lag and correlation values
- Peak lag is highlighted

### 4) Result Summary
- Final y[n] table is shown with index n and values
- Formula is displayed
- Copy Result copies the output to clipboard
- Download as PNG exports the result area as an image

## First learning exercise (recommended)

Use this simple test:
- x[n] = 1, 2, 3, 1
- h[n] = 1, 1, 1
- n0 for both = 0

Expected convolution output:
- y[n] = 1, 3, 6, 6, 4, 1

Then try these concept checks:
1. Set h[n] = Unit Impulse [1]
   - You should get y[n] = x[n] (same shape)
2. Switch to Auto-Correlation tab
   - Highest peak should appear at lag 0
3. Use Ramp or Sinusoidal preset
   - Observe how cross-correlation peak changes with lag

## How to read the stem plots

- Horizontal axis: sample index n
- Vertical axis: amplitude
- Blue stem: positive value
- Red stem: negative value
- Gray dot on axis: zero value
- Orange highlight: currently active sample

## About page (for report)

Open:
- /about

This page includes:
- Project abstract
- Convolution block diagram
- Concepts covered
- Tech stack summary

It is print-friendly for report appendix usage.

## Project scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Run production server
npm run lint       # Lint checks
npm run typecheck  # TypeScript type checks
```

## Deploy to Vercel

This project is Vercel-ready.
- Import the GitHub repo into Vercel
- Framework should be detected as Next.js
- Build command: npm run build

If you ever see an output-directory error, ensure Vercel is not configured as a static export project with output directory set to public.

## Troubleshooting

1) "Use comma-separated numeric values only"
- Remove extra commas and spaces like: 1, 2, 3

2) Nothing changes after editing signals
- Click Calculate Convolution after making changes

3) Build fails locally
- Delete node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

(For Windows PowerShell, use Remove-Item with -Recurse -Force.)

## License

For educational and academic use.
