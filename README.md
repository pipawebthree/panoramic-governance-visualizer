# Panoramic Governance Visualizer

An educational MVP web app that explains Abstract's Panoramic Governance (PG) system and provides an interactive epoch simulator. Built to help users understand PG in under 3 minutes through visualizations and hands-on experimentation.

## What is Panoramic Governance?

Panoramic Governance is a two-part system:

1. **Activity Participation Threshold (APT)**: Distributes sequencer fee rewards to active participants who meet a minimum activity threshold, ensuring rewards go to engaged users rather than passive holders.

2. **Gauge-like Emissions**: Allocates protocol emissions based on community votes, similar to Curve's gauge system, creating competition and alignment between protocols and voters.

The system creates a self-reinforcing flywheel: active users receive rewards → rewards enable better governance → better governance improves protocol allocation → protocols grow → more activity → more fees → cycle continues.

## Features

- **Flywheel Visualization**: Interactive SVG diagram showing the governance loop with animated flow
- **Epoch Simulator**: Deterministic simulation with adjustable parameters:
  - Network activity, sequencer fees, sequencer cut
  - APT strictness (maps to activity threshold)
  - Emission budget
  - Liquid bounties toggle (optional extension)
  - Random seed for reproducible results
- **Visual Outputs**:
  - Fee pool calculation
  - User rewards distribution (histogram)
  - Protocol emissions allocation (bar chart)
  - Detailed tables for users and protocols
- **Presets**: Three pre-configured scenarios (DeFi-heavy, Gaming boom, Whale governance)
- **Share & Load**: Export/import simulator state as JSON
- **Glossary**: Clear definitions of all key terms

## Tech Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** (dark theme)
- **Zustand** for state management
- **Vitest** for unit tests
- Pure SVG for charts (no external chart libraries)

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## Project Structure

```
panoramic-governance-visualizer/
├── src/
│   ├── components/       # Reusable components (Layout, etc.)
│   ├── lib/
│   │   └── sim/         # Simulation logic
│   │       ├── types.ts
│   │       ├── generators.ts  # Deterministic mock data generators
│   │       ├── epoch.ts       # Main epoch simulation function
│   │       └── presets.ts     # Pre-configured scenarios
│   ├── pages/           # Page components
│   │   ├── FlywheelPage.tsx
│   │   ├── EpochSimulatorPage.tsx
│   │   └── GlossaryPage.tsx
│   ├── store/          # Zustand stores
│   │   └── simulatorStore.ts
│   ├── styles/         # Global styles
│   │   └── index.css
│   ├── App.tsx         # Main app component with routing
│   └── main.tsx        # Entry point
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Simulation Details

The simulator uses deterministic seeded random number generation to ensure reproducible results. All calculations use fixed-point arithmetic (rounded to 2 decimal places) to avoid floating-point drift.

### Key Formulas

- **Fee Pool**: `pool = totalFees × (1 - sequencerCut / 100)`
- **APT Threshold**: `threshold = (aptStrictness / 100) × 50`
- **User Reward**: `reward = feePool × (userActivityScore / sumOfActiveUserScores)`
- **Effective Votes** (with bounties): `effectiveVotes = baseVotes × (1 + bountyBoost / 100)`
- **Protocol Emissions**: `emissions = emissionBudget × (protocolEffectiveVotes / sumOfAllEffectiveVotes)`

## License

MIT

