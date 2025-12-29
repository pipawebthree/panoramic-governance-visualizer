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
  'Pudgy Penguins',
  'Magic Eden',
  'ChronoForge',
  'Somo',
  'Pyth Network',
  'Holoworld AI',
  'Dynamic',
]

const protocolCategories = [
  'Culture/NFT',
  'Marketplace',
  'Gaming',
  'Gaming',
  'Infrastructure',
  'AI/Consumer',
  'Tools',
]

// Base vote multipliers for special protocols/categories
const getBaseVoteMultiplier = (name: string, category: string): number => {
  // Pudgy Penguins gets high base weight (native brand)
  if (name === 'Pudgy Penguins') {
    return 2.5 // 2.5x multiplier for being the native brand
  }
  // Gaming and Culture categories get a boost (consumer-focused chain)
  if (category === 'Gaming' || category === 'Culture/NFT') {
    return 1.3 // 1.3x multiplier for consumer-focused categories
  }
  return 1.0 // Default multiplier
}

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
    const name = protocolNames[i]
    const category = protocolCategories[i]
    // Generate base votes with category/protocol-specific multipliers
    const rawBaseVotes = Math.round(rng.nextFloat(100, 10000))
    const multiplier = getBaseVoteMultiplier(name, category)
    const baseVotes = Math.round(rawBaseVotes * multiplier)
    
    protocols.push({
      name,
      category,
      baseVotes,
      bountyBoost: 0, // Can be set by user
      effectiveVotes: baseVotes, // Will be calculated
      emissionAllocation: 0, // Will be calculated
    })
  }

  return protocols
}

