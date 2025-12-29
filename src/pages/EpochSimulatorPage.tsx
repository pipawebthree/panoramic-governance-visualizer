import { useEffect, useState } from 'react'
import { useSimulatorStore } from '@/store/simulatorStore'
import { presets } from '@/lib/sim/presets'

export default function EpochSimulatorPage() {
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
  }

  const handleBountyBoostChange = (protocolName: string, boost: number) => {
    setProtocolBountyBoost(protocolName, boost)
    // Re-run simulation if we already have results
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Epoch Simulator</h1>
        <p className="text-dark-textMuted text-lg">
          Adjust parameters and run simulations to understand how Panoramic Governance
          distributes rewards and allocates emissions.
        </p>
      </div>

      {/* Presets */}
      <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
        <h2 className="text-xl font-semibold mb-4">Presets</h2>
        <div className="flex flex-wrap gap-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                loadPreset(preset.name)
                runSimulation()
              }}
              className="px-4 py-2 bg-dark-surfaceHover hover:bg-dark-accent hover:text-black text-dark-text rounded-lg transition-smooth"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
            <h2 className="text-xl font-semibold mb-6">Simulation Parameters</h2>

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
                  <button
                    onClick={handleRandomizeSeed}
                    className="px-4 py-2 bg-dark-surfaceHover hover:bg-dark-accent hover:text-black text-dark-text rounded-lg transition-smooth"
                  >
                    Randomize
                  </button>
                </div>
              </div>

              <button
                onClick={handleRun}
                className="w-full px-6 py-3 bg-dark-accent hover:bg-dark-accentHover text-black rounded-lg font-medium transition-smooth"
              >
                Run Epoch
              </button>
            </div>
          </div>

          {/* Share/Load */}
          <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
            <h2 className="text-xl font-semibold mb-4">Share & Load</h2>
            <div className="space-y-4">
              <button
                onClick={() => setShowShare(!showShare)}
                className="w-full px-4 py-2 bg-dark-surfaceHover hover:bg-dark-accent hover:text-black text-dark-text rounded-lg transition-smooth"
              >
                {showShare ? 'Hide' : 'Show'} Share JSON
              </button>
              {showShare && (
                <div className="space-y-2">
                  <textarea
                    value={shareJson}
                    readOnly
                    className="w-full h-32 px-3 py-2 bg-dark-surfaceHover border border-dark-border rounded-lg text-dark-text text-xs font-mono"
                  />
                  <button
                    onClick={handleExport}
                    className="w-full px-4 py-2 bg-dark-accent hover:bg-dark-accentHover text-black rounded-lg transition-smooth"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}
              <div className="space-y-2">
                <textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder="Paste JSON state here..."
                  className="w-full h-32 px-3 py-2 bg-dark-surfaceHover border border-dark-border rounded-lg text-dark-text text-xs font-mono"
                />
                <button
                  onClick={handleImport}
                  className="w-full px-4 py-2 bg-dark-accent hover:bg-dark-accentHover text-black rounded-lg transition-smooth"
                >
                  Load from JSON
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Fee Pool */}
              <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
                <h2 className="text-xl font-semibold mb-4">Fee Pool</h2>
                <div className="text-3xl font-bold text-dark-accent">
                  ${result.feePool.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-dark-textMuted mt-2">
                  Calculated from {params.totalSequencerFees.toLocaleString()} × (1 - {params.sequencerCut}%)
                </p>
              </div>

              {/* Protocol Emissions Chart */}
              <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
                <h2 className="text-xl font-semibold mb-4">Protocol Emissions</h2>
                <div className="space-y-3">
                  {result.protocols.map((protocol) => (
                    <div key={protocol.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{protocol.name}</span>
                        <span>${protocol.emissionAllocation.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-dark-surfaceHover rounded-full h-4">
                        <div
                          className="bg-dark-accent h-4 rounded-full transition-smooth"
                          style={{
                            width: `${(protocol.emissionAllocation / maxEmission) * 100}%`,
                          }}
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
                    </div>
                  ))}
                </div>
              </div>

              {/* User Rewards Histogram */}
              <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
                <h2 className="text-xl font-semibold mb-4">User Rewards Distribution</h2>
                <div className="flex items-end gap-2 h-48">
                  {bucketCounts.map((count, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-dark-accent rounded-t transition-smooth"
                        style={{
                          height: `${(count / maxBucketCount) * 100}%`,
                        }}
                      />
                      <span className="text-xs text-dark-textMuted mt-2">
                        {rewardBuckets[i] === 0
                          ? '0'
                          : rewardBuckets[i] === 100000
                          ? '100k+'
                          : `${rewardBuckets[i - 1]}-${rewardBuckets[i]}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-dark-surface rounded-lg p-6 border border-dark-border text-center text-dark-textMuted">
              Click "Run Epoch" to see results
            </div>
          )}
        </div>
      </div>

      {/* Tables */}
      {result && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Users Table */}
          <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
            <h2 className="text-xl font-semibold mb-4">Users ({result.users.length})</h2>
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
                  {result.users.slice(0, 10).map((user) => (
                    <tr
                      key={user.id}
                      className={`border-b border-dark-border ${
                        user.isActive ? '' : 'opacity-50'
                      }`}
                    >
                      <td className="py-2">{user.id}</td>
                      <td className="text-right py-2">{user.activityScore.toFixed(2)}</td>
                      <td className="text-right py-2">{user.votePower.toFixed(2)}</td>
                      <td className="text-right py-2">
                        ${user.rewardFromFees.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-dark-textMuted mt-2">
                Showing 10 of {result.users.length} users
              </p>
            </div>
          </div>

          {/* Protocols Table */}
          <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
            <h2 className="text-xl font-semibold mb-4">Protocols ({result.protocols.length})</h2>
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
                  {result.protocols.map((protocol) => (
                    <tr key={protocol.name} className="border-b border-dark-border">
                      <td className="py-2">
                        <div>
                          <div className="font-medium">{protocol.name}</div>
                          <div className="text-xs text-dark-textMuted">{protocol.category}</div>
                        </div>
                      </td>
                      <td className="text-right py-2">
                        {protocol.baseVotes.toLocaleString()}
                      </td>
                      <td className="text-right py-2">
                        {protocol.effectiveVotes.toLocaleString()}
                      </td>
                      <td className="text-right py-2 font-medium">
                        ${protocol.emissionAllocation.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

