import { User, Protocol } from './types'

// Simple seeded PRNG (Linear Congruential Generator)
class SeededRNG {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 2 ** 32
    return this.seed / 2 ** 32
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min
  }
}

const protocolNames = [
  'Uniswap V3',
  'Aave',
  'Compound',
  'Curve Finance',
  'Lido',
  'MakerDAO',
  'Balancer',
  'Synthetix',
]

const protocolCategories = [
  'DEX',
  'Lending',
  'Lending',
  'DEX',
  'Staking',
  'Lending',
  'DEX',
  'Derivatives',
]

export function generateUsers(seed: number, count: number = 30): User[] {
  const rng = new SeededRNG(seed)
  const users: User[] = []

  for (let i = 0; i < count; i++) {
    const activityScore = Math.round(rng.nextFloat(0, 100) * 100) / 100
    const votePower = Math.round(rng.nextFloat(0, 1000) * 100) / 100
    
    users.push({
      id: `user_${i + 1}`,
      activityScore,
      votePower,
      isActive: false, // Will be set during epoch run
      rewardFromFees: 0, // Will be calculated during epoch run
    })
  }

  return users
}

export function generateProtocols(seed: number): Protocol[] {
  const rng = new SeededRNG(seed)
  const protocols: Protocol[] = []

  for (let i = 0; i < protocolNames.length; i++) {
    const baseVotes = Math.round(rng.nextFloat(100, 10000))
    
    protocols.push({
      name: protocolNames[i],
      category: protocolCategories[i],
      baseVotes,
      bountyBoost: 0, // Can be set by user
      effectiveVotes: baseVotes, // Will be calculated
      emissionAllocation: 0, // Will be calculated
    })
  }

  return protocols
}

