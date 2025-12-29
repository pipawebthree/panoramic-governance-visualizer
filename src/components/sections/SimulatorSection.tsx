import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useSimulatorStore } from '@/store/simulatorStore'
import { presets } from '@/lib/sim/presets'
import { Protocol } from '@/lib/sim/types'

// Helper function to get emoji for protocol
const getProtocolEmoji = (protocol: Protocol): string => {
  const name = protocol.name.toLowerCase()
  const category = protocol.category.toLowerCase()
  
  if (name.includes('pudgy')) return '🐧'
  if (name.includes('magic eden')) return '🛒'
  if (name.includes('chronoforge') || name.includes('somo')) return '🎮'
  if (name.includes('pyth')) return '🔗'
  if (name.includes('holoworld') || name.includes('ai')) return '🤖'
  if (name.includes('dynamic')) return '🛠️'
  
  // Fallback by category
  if (category.includes('gaming')) return '🎮'
  if (category.includes('culture') || category.includes('nft')) return '🐧'
  if (category.includes('marketplace')) return '🛒'
  if (category.includes('ai') || category.includes('consumer')) return '🤖'
  if (category.includes('infrastructure')) return '🔗'
  if (category.includes('tools')) return '🛠️'
  
  return '📦'
}

export default function SimulatorSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  
  const {
    params,
    result,
    setParams,
    setProtocolBountyBoost,
    runSimulation,
    loadPreset,
    exportState,
    importState,
  } = useSimulatorStore()

  const [shareJson, setShareJson] = useState('')
  const [importJson, setImportJson] = useState('')
  const [showShare, setShowShare] = useState(false)

  useEffect(() => {
    if (result) {
      setShareJson(exportState())
    }
  }, [result, exportState])

  const handleRun = () => {
    runSimulation()
    // Celebrate with confetti! 🎉
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ABFE2C', '#7B61FF', '#FFFFFF'],
    })
  }

  const handleBountyBoostChange = (protocolName: string, boost: number) => {
    setProtocolBountyBoost(protocolName, boost)
    if (result) {
      setTimeout(() => runSimulation(), 0)
    }
  }

  const handleExport = () => {
    navigator.clipboard.writeText(shareJson)
    alert('State copied to clipboard!')
  }

  const handleImport = () => {
    if (importState(importJson)) {
      setImportJson('')
      alert('State loaded successfully!')
    } else {
      alert('Invalid JSON format')
    }
  }

  const handleRandomizeSeed = () => {
    setParams({ seed: Math.floor(Math.random() * 1000000) })
  }

  // Bucket users for histogram
  const rewardBuckets = [0, 1000, 5000, 10000, 25000, 50000, 100000]
  const bucketCounts = rewardBuckets.map((_, i) => {
    if (!result) return 0
    const min = i === 0 ? 0 : rewardBuckets[i - 1]
    const max = rewardBuckets[i]
    return result.users.filter(
      (u) => u.rewardFromFees >= min && (i === rewardBuckets.length - 1 || u.rewardFromFees < max)
    ).length
  })

  const maxBucketCount = Math.max(...bucketCounts, 1)
  const maxEmission = result
    ? Math.max(...result.protocols.map((p) => p.emissionAllocation), 1)
    : 1

  // Get high reward users (top 10%)
  const highRewardThreshold = result
    ? result.users
        .map((u) => u.rewardFromFees)
        .sort((a, b) => b - a)[Math.floor(result.users.length * 0.1)] || 0
    : 0

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Aurora background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <motion.div
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-dark-blurple/10 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ 
            type: 'spring',
            stiffness: 100,
            damping: 20,
            mass: 0.8,
          }}
          className="text-center relative z-10"
        >
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-4 text-dark-accent">
            Epoch Simulator
          </h2>
          <p className="text-dark-textMuted text-lg max-w-3xl mx-auto">
            Adjust parameters and run simulations to understand how Panoramic Governance
            distributes rewards and allocates emissions.
          </p>
        </motion.div>

        {/* Presets with staggered spring */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: -15 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ 
            delay: 0.1,
            type: 'spring',
            stiffness: 120,
            damping: 15,
          }}
          className="glass-card-hover p-6 relative z-10"
        >
          <h3 className="text-xl font-semibold mb-4">Presets</h3>
          <div className="flex flex-wrap gap-3">
            {presets.map((preset, idx) => (
              <motion.button
                key={preset.name}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ 
                  delay: 0.2 + idx * 0.1,
                  type: 'spring',
                  stiffness: 200,
                  damping: 12,
                }}
                onClick={() => {
                  loadPreset(preset.name)
                  runSimulation()
                }}
                className="px-4 py-2 bg-dark-surfaceHover hover:bg-dark-accent hover:text-black text-dark-text rounded-lg transition-smooth"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                {preset.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 relative z-10">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: -100, rotateY: -20 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ 
              delay: 0.3,
              type: 'spring',
              stiffness: 100,
              damping: 15,
            }}
            className="space-y-6"
          >
            <div className="glass-card-hover p-6">
              <h3 className="text-xl font-semibold mb-6">Simulation Parameters</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Network Activity: {params.networkActivity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={params.networkActivity}
                    onChange={(e) => setParams({ networkActivity: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Total Sequencer Fees: ${params.totalSequencerFees.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={params.totalSequencerFees}
                    onChange={(e) => setParams({ totalSequencerFees: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sequencer Cut: {params.sequencerCut}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={params.sequencerCut}
                    onChange={(e) => setParams({ sequencerCut: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    APT Strictness: {params.aptStrictness}%
                    <span className="text-xs text-dark-textMuted ml-2">
                      (Threshold: {result ? result.aptThreshold.toFixed(2) : 'N/A'})
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={params.aptStrictness}
                    onChange={(e) => setParams({ aptStrictness: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Emission Budget: ${params.emissionBudget.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={params.emissionBudget}
                    onChange={(e) => setParams({ emissionBudget: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="liquidBounties"
                    checked={params.liquidBountiesEnabled}
                    onChange={(e) => setParams({ liquidBountiesEnabled: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="liquidBounties" className="text-sm font-medium">
                    Enable Liquid Bounties
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Random Seed: {params.seed}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={params.seed}
                      onChange={(e) => setParams({ seed: Number(e.target.value) })}
                      className="flex-1 px-3 py-2 bg-dark-surfaceHover border border-dark-border rounded-lg text-dark-text"
                    />
                    <motion.button
                      onClick={handleRandomizeSeed}
                      className="px-4 py-2 bg-dark-surfaceHover hover:bg-dark-accent hover:text-black text-dark-text rounded-lg transition-smooth"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Randomize
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  onClick={handleRun}
                  className="w-full px-6 py-3 bg-dark-accent hover:bg-dark-accentHover text-black rounded-lg font-medium transition-smooth shadow-glow-green"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Run Epoch 🐧
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotateY: 20 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ 
              delay: 0.4,
              type: 'spring',
              stiffness: 100,
              damping: 15,
            }}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Fee Pool */}
                  <div className="glass-card-hover p-6">
                    <h3 className="text-xl font-semibold mb-4">Fee Pool</h3>
                    <div className="text-3xl font-bold text-dark-accent">
                      ${result.feePool.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-sm text-dark-textMuted mt-2">
                      Calculated from {params.totalSequencerFees.toLocaleString()} × (1 - {params.sequencerCut}%)
                    </p>
                  </div>

                  {/* Protocol Emissions Chart */}
                  <div className="glass-card-hover p-6">
                    <h3 className="text-xl font-semibold mb-4">Protocol Emissions</h3>
                    <div className="space-y-3">
                      {result.protocols.map((protocol, idx) => (
                        <motion.div
                          key={protocol.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">
                              {getProtocolEmoji(protocol)} {protocol.name}
                            </span>
                            <span>${protocol.emissionAllocation.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-dark-surfaceHover rounded-full h-4">
                            <motion.div
                              className="bg-dark-accent h-4 rounded-full transition-smooth"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(protocol.emissionAllocation / maxEmission) * 100}%`,
                              }}
                              transition={{ duration: 0.5, delay: idx * 0.05 }}
                            />
                          </div>
                          {params.liquidBountiesEnabled && (
                            <div className="mt-2 flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="200"
                                value={protocol.bountyBoost}
                                onChange={(e) =>
                                  handleBountyBoostChange(protocol.name, Number(e.target.value))
                                }
                                className="w-20 px-2 py-1 bg-dark-surfaceHover border border-dark-border rounded text-sm"
                              />
                              <span className="text-xs text-dark-textMuted">% bounty boost</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* User Rewards Histogram */}
                  <div className="glass-card-hover p-6">
                    <h3 className="text-xl font-semibold mb-4">Active Pengus Rewards Distribution</h3>
                    <div className="flex items-end gap-2 h-48">
                      {bucketCounts.map((count, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 flex flex-col items-center"
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                        >
                          <motion.div
                            className="w-full bg-dark-accent rounded-t transition-smooth"
                            initial={{ height: 0 }}
                            animate={{
                              height: `${(count / maxBucketCount) * 100}%`,
                            }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                          />
                          <span className="text-xs text-dark-textMuted mt-2">
                            {rewardBuckets[i] === 0
                              ? '0'
                              : rewardBuckets[i] === 100000
                              ? '100k+'
                              : `${rewardBuckets[i - 1]}-${rewardBuckets[i]}`}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card-hover p-6 text-center text-dark-textMuted"
                >
                  Click "Run Epoch" to see results 🐧
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Tables */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* Users Table */}
            <div className="glass-card-hover p-6">
              <h3 className="text-xl font-semibold mb-4">
                Active Pengus ({result.users.filter((u) => u.isActive).length}/{result.users.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="text-left py-2">ID</th>
                      <th className="text-right py-2">Activity</th>
                      <th className="text-right py-2">Vote Power</th>
                      <th className="text-right py-2">Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.users.slice(0, 10).map((user) => {
                      const isHighReward = user.rewardFromFees >= highRewardThreshold
                      return (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: user.isActive ? 1 : 0.5 }}
                          className={`border-b border-dark-border ${
                            user.isActive ? '' : 'opacity-50'
                          }`}
                        >
                          <td className="py-2">
                            {user.id}
                            {isHighReward && user.isActive && (
                              <span className="ml-2">❄️</span>
                            )}
                          </td>
                          <td className="text-right py-2">{user.activityScore.toFixed(2)}</td>
                          <td className="text-right py-2">{user.votePower.toFixed(2)}</td>
                          <td className="text-right py-2 font-medium text-dark-accent">
                            ${user.rewardFromFees.toFixed(2)}
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
                <p className="text-xs text-dark-textMuted mt-2">
                  Showing 10 of {result.users.length} pengus
                </p>
              </div>
            </div>

            {/* Protocols Table */}
            <div className="glass-card-hover p-6">
              <h3 className="text-xl font-semibold mb-4">Protocols ({result.protocols.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="text-left py-2">Name</th>
                      <th className="text-right py-2">Base Votes</th>
                      <th className="text-right py-2">Effective</th>
                      <th className="text-right py-2">Emissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.protocols.map((protocol, idx) => (
                      <motion.tr
                        key={protocol.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-dark-border"
                      >
                        <td className="py-2">
                          <div>
                            <div className="font-medium">
                              {getProtocolEmoji(protocol)} {protocol.name}
                            </div>
                            <div className="text-xs text-dark-textMuted">{protocol.category}</div>
                          </div>
                        </td>
                        <td className="text-right py-2">
                          {protocol.baseVotes.toLocaleString()}
                        </td>
                        <td className="text-right py-2">
                          {protocol.effectiveVotes.toLocaleString()}
                        </td>
                        <td className="text-right py-2 font-medium text-dark-accent">
                          ${protocol.emissionAllocation.toLocaleString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

