import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

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

export default function FlywheelSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Node animation variants
  const nodeVariants = {
    hidden: (i: number) => ({
      x: i % 2 === 0 ? -100 : 100,
      y: i % 2 === 0 ? -50 : 50,
      opacity: 0,
      scale: 0.5,
    }),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
        delay: 0.1,
      },
    },
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
    >
      <div className="max-w-7xl mx-auto w-full space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-4 text-dark-accent">
            The Panoramic Governance Flywheel
          </h2>
          <p className="text-dark-textMuted text-lg max-w-3xl mx-auto">
            Panoramic Governance creates a self-reinforcing cycle where active participants
            are rewarded, and those rewards enable better governance decisions. This loop
            strengthens the network over time.
          </p>
        </motion.div>

        <div className="glass-card-hover p-8 md:p-12">
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
                
                return (
                  <motion.line
                    key={`${conn.from}-${conn.to}`}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#3A3550"
                    strokeWidth={2}
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={
                      isInView
                        ? { pathLength: 1, opacity: 1 }
                        : { pathLength: 0, opacity: 0 }
                    }
                    transition={{
                      duration: 0.8,
                      delay: idx * 0.2,
                      ease: 'easeInOut',
                    }}
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
              {nodes.map((node, idx) => {
                const isHovered = hoveredNode === node.id
                
                return (
                  <g key={node.id}>
                    <motion.circle
                      custom={idx}
                      variants={nodeVariants}
                      initial="hidden"
                      animate={isInView ? 'visible' : 'hidden'}
                      cx={node.x}
                      cy={node.y}
                      r={isHovered ? 35 : 30}
                      fill={isHovered ? '#8FE01C' : '#ABFE2C'}
                      stroke="#1E1B2E"
                      strokeWidth={2}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      whileHover={{ scale: 1.1 }}
                      style={{
                        filter: isHovered
                          ? 'drop-shadow(0 0 15px #ABFE2C)'
                          : 'drop-shadow(0 0 5px #ABFE2C)',
                      }}
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 glass-card border-dark-borderGlow"
            >
              <h3 className="font-semibold mb-2 text-dark-accent">
                {nodes.find((n) => n.id === hoveredNode)?.label}
              </h3>
              <p className="text-sm text-dark-textMuted">
                {nodes.find((n) => n.id === hoveredNode)?.description}
              </p>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="glass-card-hover p-6">
            <h3 className="text-xl font-semibold mb-4">Activity Participation Threshold (APT)</h3>
            <p className="text-dark-textMuted">
              Only users who meet a minimum activity score receive rewards from the fee pool.
              This ensures that rewards go to active participants, not passive holders.
            </p>
          </div>
          
          <div className="glass-card-hover p-6">
            <h3 className="text-xl font-semibold mb-4">Gauge-like Emissions</h3>
            <p className="text-dark-textMuted">
              Protocol emissions are allocated based on community votes, similar to Curve's
              gauge system. This creates competition and alignment between protocols and voters.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

