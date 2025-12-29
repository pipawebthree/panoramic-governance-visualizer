import { create } from 'zustand'
import { EpochParams, EpochResult } from '@/lib/sim/types'
import { runEpoch } from '@/lib/sim/epoch'
import { presets } from '@/lib/sim/presets'

interface SimulatorState {
  params: EpochParams
  result: EpochResult | null
  protocols: Array<{ name: string; bountyBoost: number }>
  setParams: (params: Partial<EpochParams>) => void
  setProtocolBountyBoost: (protocolName: string, boost: number) => void
  runSimulation: () => void
  loadPreset: (presetName: string) => void
  exportState: () => string
  importState: (json: string) => boolean
}

const defaultParams: EpochParams = {
  networkActivity: 50,
  totalSequencerFees: 500000,
  sequencerCut: 25,
  aptStrictness: 50,
  emissionBudget: 500000,
  liquidBountiesEnabled: false,
  seed: 42,
}

export const useSimulatorStore = create<SimulatorState>((set, get) => ({
  params: defaultParams,
  result: null,
  protocols: [],
  
  setParams: (updates) => {
    set((state) => ({
      params: { ...state.params, ...updates },
    }))
  },
  
  setProtocolBountyBoost: (protocolName, boost) => {
    set((state) => {
      const protocols = [...state.protocols]
      const index = protocols.findIndex((p) => p.name === protocolName)
      if (index >= 0) {
        protocols[index].bountyBoost = boost
      } else {
        protocols.push({ name: protocolName, bountyBoost: boost })
      }
      return { protocols }
    })
  },
  
  runSimulation: () => {
    const { params, protocols: storedProtocols } = get()
    
    // Run the epoch simulation
    const result = runEpoch(params)
    
    // Initialize protocols array if empty or if protocols changed
    const currentProtocols = get().protocols
    if (currentProtocols.length === 0 || 
        currentProtocols.length !== result.protocols.length ||
        !result.protocols.every((p) => currentProtocols.some((cp) => cp.name === p.name))) {
      const initialProtocols = result.protocols.map((p) => {
        const existing = storedProtocols.find((sp) => sp.name === p.name)
        return {
          name: p.name,
          bountyBoost: existing?.bountyBoost ?? 0,
        }
      })
      set({ protocols: initialProtocols })
    }
    
    // Get updated protocols after potential initialization
    const updatedProtocols = get().protocols
    
    // Apply stored bounty boosts
    if (params.liquidBountiesEnabled) {
      result.protocols.forEach((protocol) => {
        const stored = updatedProtocols.find((p) => p.name === protocol.name)
        if (stored) {
          protocol.bountyBoost = stored.bountyBoost
          protocol.effectiveVotes = Math.round(
            protocol.baseVotes * (1 + stored.bountyBoost / 100) * 100
          ) / 100
        }
      })
      
      // Recalculate emissions with updated effective votes
      const totalEffectiveVotes = result.protocols.reduce(
        (sum, p) => sum + p.effectiveVotes,
        0
      )
      
      result.protocols.forEach((protocol) => {
        if (totalEffectiveVotes > 0) {
          protocol.emissionAllocation = Math.round(
            (params.emissionBudget * protocol.effectiveVotes) /
              totalEffectiveVotes *
              100
          ) / 100
        }
      })
    }
    
    set({ result })
  },
  
  loadPreset: (presetName) => {
    const preset = presets.find((p) => p.name === presetName)
    if (preset) {
      set({
        params: {
          networkActivity: preset.networkActivity,
          totalSequencerFees: preset.totalSequencerFees,
          sequencerCut: preset.sequencerCut,
          aptStrictness: preset.aptStrictness,
          emissionBudget: preset.emissionBudget,
          liquidBountiesEnabled: preset.liquidBountiesEnabled,
          seed: preset.seed,
        },
        result: null,
        protocols: [],
      })
    }
  },
  
  exportState: () => {
    const { params, protocols } = get()
    return JSON.stringify({ params, protocols }, null, 2)
  },
  
  importState: (json) => {
    try {
      const data = JSON.parse(json)
      if (data.params) {
        set({
          params: { ...defaultParams, ...data.params },
          protocols: data.protocols || [],
          result: null,
        })
        return true
      }
      return false
    } catch {
      return false
    }
  },
}))

