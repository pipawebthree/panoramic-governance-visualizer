import { EpochParams } from './types'

export interface Preset extends EpochParams {
  name: string
  description: string
}

export const presets: Preset[] = [
  {
    name: 'DeFi-heavy',
    description: 'High activity, DeFi-focused protocols dominate',
    networkActivity: 85,
    totalSequencerFees: 750000,
    sequencerCut: 20,
    aptStrictness: 40,
    emissionBudget: 800000,
    liquidBountiesEnabled: false,
    seed: 12345,
  },
  {
    name: 'Gaming boom',
    description: 'High network activity with gaming protocols',
    networkActivity: 95,
    totalSequencerFees: 950000,
    sequencerCut: 15,
    aptStrictness: 30,
    emissionBudget: 1000000,
    liquidBountiesEnabled: true,
    seed: 54321,
  },
  {
    name: 'Whale governance',
    description: 'Low activity, high sequencer cut, strict APT',
    networkActivity: 35,
    totalSequencerFees: 500000,
    sequencerCut: 45,
    aptStrictness: 70,
    emissionBudget: 400000,
    liquidBountiesEnabled: false,
    seed: 99999,
  },
]

