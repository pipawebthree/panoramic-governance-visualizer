import { EpochParams, EpochResult } from './types'
import { generateUsers, generateProtocols } from './generators'

export function runEpoch(params: EpochParams): EpochResult {
  // Calculate fee pool
  const feePool = Math.round(
    params.totalSequencerFees * (1 - params.sequencerCut / 100) * 100
  ) / 100

  // Calculate APT threshold (strictness 0-100 maps to threshold 0-50)
  const aptThreshold = (params.aptStrictness / 100) * 50

  // Generate users and protocols
  const users = generateUsers(params.seed, 30)
  const protocols = generateProtocols(params.seed + 1000)

  // Apply APT gating and distribute fee pool
  const activeUsers = users.filter((u) => u.activityScore >= aptThreshold)
  
  // Calculate total weight (using activityScore as weight)
  const totalWeight = activeUsers.reduce((sum, u) => sum + u.activityScore, 0)

  // Distribute rewards proportionally
  users.forEach((user) => {
    user.isActive = user.activityScore >= aptThreshold
    if (user.isActive && totalWeight > 0) {
      user.rewardFromFees = Math.round(
        (feePool * user.activityScore) / totalWeight * 100
      ) / 100
    } else {
      user.rewardFromFees = 0
    }
  })

  // Calculate effective votes for protocols
  protocols.forEach((protocol) => {
    if (params.liquidBountiesEnabled) {
      // Bounty boost adds a multiplier: 1 + (bountyBoost / 100)
      protocol.effectiveVotes = Math.round(
        protocol.baseVotes * (1 + protocol.bountyBoost / 100) * 100
      ) / 100
    } else {
      protocol.effectiveVotes = protocol.baseVotes
    }
  })

  // Calculate total effective votes
  const totalEffectiveVotes = protocols.reduce(
    (sum, p) => sum + p.effectiveVotes,
    0
  )

  // Allocate emissions proportionally
  protocols.forEach((protocol) => {
    if (totalEffectiveVotes > 0) {
      protocol.emissionAllocation = Math.round(
        (params.emissionBudget * protocol.effectiveVotes) /
          totalEffectiveVotes *
          100
      ) / 100
    } else {
      protocol.emissionAllocation = 0
    }
  })

  return {
    feePool,
    users,
    protocols,
    aptThreshold,
  }
}

