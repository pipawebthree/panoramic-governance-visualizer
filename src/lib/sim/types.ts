export interface User {
  id: string
  activityScore: number
  votePower: number
  isActive: boolean
  rewardFromFees: number
}

export interface Protocol {
  name: string
  category: string
  baseVotes: number
  bountyBoost: number
  effectiveVotes: number
  emissionAllocation: number
}

export interface EpochParams {
  networkActivity: number // 0-100
  totalSequencerFees: number // 0-1,000,000
  sequencerCut: number // 0-50 (%)
  aptStrictness: number // 0-100
  emissionBudget: number // 0-1,000,000
  liquidBountiesEnabled: boolean
  seed: number
}

export interface EpochResult {
  feePool: number
  users: User[]
  protocols: Protocol[]
  aptThreshold: number
}

