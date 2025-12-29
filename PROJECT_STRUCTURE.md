# Project Structure

```
panoramic-governance-visualizer/
├── index.html                 # Entry HTML file
├── package.json               # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript config
├── tsconfig.node.json        # TypeScript config for Node
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── .gitignore                # Git ignore rules
├── README.md                 # Project documentation
│
└── src/
    ├── main.tsx              # React entry point
    ├── App.tsx               # Main app component with routing
    ├── vite-env.d.ts        # Vite type declarations
    │
    ├── components/
    │   └── Layout.tsx       # Layout component with navigation
    │
    ├── pages/
    │   ├── FlywheelPage.tsx         # Interactive flywheel diagram
    │   ├── EpochSimulatorPage.tsx   # Main simulator interface
    │   └── GlossaryPage.tsx         # Terms and FAQ
    │
    ├── lib/
    │   └── sim/
    │       ├── types.ts      # TypeScript interfaces
    │       ├── generators.ts # Deterministic mock data generators
    │       ├── epoch.ts      # Main epoch simulation function
    │       ├── presets.ts    # Pre-configured scenarios
    │       └── epoch.test.ts # Unit tests
    │
    ├── store/
    │   └── simulatorStore.ts # Zustand state management
    │
    └── styles/
        └── index.css        # Global styles with Tailwind
```

## Key Files

- **Simulation Logic**: `src/lib/sim/epoch.ts` contains the core `runEpoch()` function
- **State Management**: `src/store/simulatorStore.ts` manages all simulator state
- **Pages**: Three main pages for Flywheel, Simulator, and Glossary
- **Tests**: Unit tests in `src/lib/sim/epoch.test.ts`

