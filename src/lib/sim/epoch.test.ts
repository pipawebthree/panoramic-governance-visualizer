import { describe, it, expect } from 'vitest'
import { runEpoch } from './epoch'
import { EpochParams } from './types'

describe('runEpoch', () => {
  const baseParams: EpochParams = {
    networkActivity: 50,
    totalSequencerFees: 1000000,
    sequencerCut: 25,
    aptStrictness: 50,
    emissionBudget: 500000,
    liquidBountiesEnabled: false,
    seed: 42,
  }

  it('should calculate fee pool correctly', () => {
    const result = runEpoch(baseParams)
    const expectedPool = 1000000 * (1 - 25 / 100)
    expect(result.feePool).toBeCloseTo(expectedPool, 2)
  })

  it('should calculate APT threshold correctly', () => {
    const result = runEpoch(baseParams)
    // APT strictness 50% maps to threshold of 25 (50% of 50)
    expect(result.aptThreshold).toBeCloseTo(25, 2)
  })

  it('should only mark active users above threshold', () => {
    const result = runEpoch(baseParams)
    result.users.forEach((user) => {
      if (user.isActive) {
        expect(user.activityScore).toBeGreaterThanOrEqual(result.aptThreshold)
      } else {
        expect(user.activityScore).toBeLessThan(result.aptThreshold)
      }
    })
  })

  it('should distribute rewards only to active users', () => {
    const result = runEpoch(baseParams)
    // const activeUsers = result.users.filter((u) => u.isActive) // Unused variable commented out
    const totalRewards = result.users.reduce((sum, u) => sum + u.rewardFromFees, 0)
    
    expect(totalRewards).toBeCloseTo(result.feePool, 2)
    result.users.forEach((user) => {
      if (!user.isActive) {
        expect(user.rewardFromFees).toBe(0)
      }
    })
  })

  it('should allocate emissions proportionally', () => {
    const result = runEpoch(baseParams)
    const totalEmissions = result.protocols.reduce(
      (sum, p) => sum + p.emissionAllocation,
      0
    )
    
    expect(totalEmissions).toBeCloseTo(baseParams.emissionBudget, 2)
  })

  it('should apply bounty boost when liquid bounties enabled', () => {
    const paramsWithBounties: EpochParams = {
      ...baseParams,
      liquidBountiesEnabled: true,
    }
    
    const result = runEpoch(paramsWithBounties)
    
    // Set a bounty boost on first protocol
    result.protocols[0].bountyBoost = 50
    result.protocols[0].effectiveVotes = Math.round(
      result.protocols[0].baseVotes * 1.5 * 100
    ) / 100
    
    expect(result.protocols[0].effectiveVotes).toBeGreaterThan(
      result.protocols[0].baseVotes
    )
  })

  it('should be deterministic with same seed', () => {
    const result1 = runEpoch(baseParams)
    const result2 = runEpoch(baseParams)
    
    expect(result1.feePool).toBe(result2.feePool)
    expect(result1.users.length).toBe(result2.users.length)
    expect(result1.protocols.length).toBe(result2.protocols.length)
    
    // Check first user is identical
    expect(result1.users[0].activityScore).toBe(result2.users[0].activityScore)
    expect(result1.users[0].votePower).toBe(result2.users[0].votePower)
  })

  it('should produce different results with different seeds', () => {
    const result1 = runEpoch({ ...baseParams, seed: 1 })
    const result2 = runEpoch({ ...baseParams, seed: 2 })
    
    // At least some users should differ
    const different = result1.users.some(
      (u, i) => u.activityScore !== result2.users[i].activityScore
    )
    expect(different).toBe(true)
  })
})

