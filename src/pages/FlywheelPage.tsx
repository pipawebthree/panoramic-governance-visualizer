import { useState } from 'react'

interface Node {
  id: string
  label: string
  description: string
  x: number
  y: number
}

const nodes: Node[] = [
  {
    id: 'users',
    label: 'Users/Voters',
    description: 'Active participants who engage with protocols and vote on governance proposals',
    x: 100,
    y: 200,
  },
  {
    id: 'protocols',
    label: 'Protocols',
    description: 'DeFi protocols that receive emissions based on community votes',
    x: 300,
    y: 200,
  },
  {
    id: 'sequencer',
    label: 'Sequencer Fees',
    description: 'Fees collected from network transactions, with a portion going to the sequencer',
    x: 500,
    y: 200,
  },
  {
    id: 'rewards',
    label: 'Rewards',
    description: 'Fee pool distributed to active users who meet the Activity Participation Threshold (APT)',
    x: 700,
    y: 200,
  },
  {
    id: 'votes',
    label: 'Votes',
    description: 'Users vote on protocol emissions allocation, creating a feedback loop',
    x: 400,
    y: 100,
  },
]

const connections = [
  { from: 'users', to: 'protocols' },
  { from: 'protocols', to: 'sequencer' },
  { from: 'sequencer', to: 'rewards' },
  { from: 'rewards', to: 'votes' },
  { from: 'votes', to: 'protocols' },
]

export default function FlywheelPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [animationStep, setAnimationStep] = useState(0)

  const handlePlay = () => {
    setIsPlaying(true)
    setAnimationStep(0)
    
    const interval = setInterval(() => {
      setAnimationStep((prev) => {
        if (prev >= connections.length - 1) {
          clearInterval(interval)
          setIsPlaying(false)
          return 0
        }
        return prev + 1
      })
    }, 1000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">The Panoramic Governance Flywheel</h1>
        <p className="text-dark-textMuted text-lg max-w-3xl">
          Panoramic Governance creates a self-reinforcing cycle where active participants
          are rewarded, and those rewards enable better governance decisions. This loop
          strengthens the network over time.
        </p>
      </div>

      <div className="bg-dark-surface rounded-lg p-8 border border-dark-border">
        <div className="relative" style={{ height: '400px' }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 300"
            className="overflow-visible"
          >
            {/* Connections */}
            {connections.map((conn, idx) => {
              const fromNode = nodes.find((n) => n.id === conn.from)!
              const toNode = nodes.find((n) => n.id === conn.to)!
              
              const isActive = isPlaying && idx <= animationStep
              
              return (
                <line
                  key={`${conn.from}-${conn.to}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isActive ? '#ABFE2C' : '#3A3550'}
                  strokeWidth={isActive ? 3 : 2}
                  strokeDasharray={isActive ? '0' : '5,5'}
                  className="transition-smooth"
                  markerEnd="url(#arrowhead)"
                />
              )
            })}
            
            {/* Arrow marker */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#ABFE2C" />
              </marker>
            </defs>

            {/* Nodes */}
            {nodes.map((node) => {
              const isHovered = hoveredNode === node.id
              
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered ? 35 : 30}
                    fill={isHovered ? '#8FE01C' : '#ABFE2C'}
                    stroke="#1E1B2E"
                    strokeWidth={2}
                    className="transition-smooth cursor-pointer"
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  />
                  <text
                    x={node.x}
                    y={node.y - 50}
                    textAnchor="middle"
                    fill="#e0e0e8"
                    fontSize="14"
                    fontWeight="600"
                    className="pointer-events-none"
                  >
                    {node.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Tooltip */}
        {hoveredNode && (
          <div className="mt-4 p-4 bg-dark-surfaceHover rounded-lg border border-dark-border">
            <h3 className="font-semibold mb-2">
              {nodes.find((n) => n.id === hoveredNode)?.label}
            </h3>
            <p className="text-sm text-dark-textMuted">
              {nodes.find((n) => n.id === hoveredNode)?.description}
            </p>
          </div>
        )}

        {/* Play button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className="px-6 py-3 bg-dark-accent hover:bg-dark-accentHover text-black rounded-lg font-medium transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? 'Playing...' : 'Play Animation'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
          <h2 className="text-xl font-semibold mb-4">Activity Participation Threshold (APT)</h2>
          <p className="text-dark-textMuted">
            Only users who meet a minimum activity score receive rewards from the fee pool.
            This ensures that rewards go to active participants, not passive holders.
          </p>
        </div>
        
        <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
          <h2 className="text-xl font-semibold mb-4">Gauge-like Emissions</h2>
          <p className="text-dark-textMuted">
            Protocol emissions are allocated based on community votes, similar to Curve's
            gauge system. This creates competition and alignment between protocols and voters.
          </p>
        </div>
      </div>
    </div>
  )
}

