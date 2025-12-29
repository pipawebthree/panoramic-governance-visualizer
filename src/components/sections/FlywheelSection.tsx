import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

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
  
  // Animated stroke dash offset for flowing effect
  const dashOffset = useMotionValue(0)
  
  useEffect(() => {
    if (isInView) {
      const controls = animate(dashOffset, 100, {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      })
      return controls.stop
    }
  }, [isInView, dashOffset])

  // Node animation variants with spring physics
  const nodeVariants = {
    hidden: (i: number) => ({
      x: i % 2 === 0 ? -150 : 150,
      y: i % 2 === 0 ? -80 : 80,
      opacity: 0,
      scale: 0.3,
      rotate: i % 2 === 0 ? -45 : 45,
    }),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 120,
        damping: 12,
        mass: 0.8,
      },
    },
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
    >
      {/* Aurora background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div
          className="absolute top-1/2 left-1/3 w-72 h-72 bg-dark-accent/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            type: 'spring',
            stiffness: 100,
            damping: 15,
          }}
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

        <div className="glass-card-hover p-8 md:p-12 relative">
          {/* Neon glow effect */}
          <div
            className="absolute inset-0 rounded-xl opacity-50 blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(171, 254, 44, 0.2) 0%, transparent 70%)',
            }}
          />
          
          <div className="relative" style={{ height: '400px' }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 300"
              className="overflow-visible"
            >
              {/* SVG Filters for Neon Glow */}
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-strong">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#ABFE2C" filter="url(#glow)" />
                </marker>
              </defs>

              {/* Animated Connections with Flowing Dashes */}
              {connections.map((conn, idx) => {
                const fromNode = nodes.find((n) => n.id === conn.from)!
                const toNode = nodes.find((n) => n.id === conn.to)!
                const strokeDashOffset = useTransform(dashOffset, (v) => -(v + idx * 20))
                
                return (
                  <g key={`${conn.from}-${conn.to}`}>
                    <motion.line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="#ABFE2C"
                      strokeWidth={3}
                      strokeDasharray="10,5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={
                        isInView
                          ? { 
                              pathLength: 1, 
                              opacity: 1,
                            }
                          : { pathLength: 0, opacity: 0 }
                      }
                      transition={{
                        pathLength: { duration: 1, delay: idx * 0.15, ease: 'easeInOut' },
                        opacity: { duration: 0.5, delay: idx * 0.15 },
                      }}
                      style={{
                        filter: 'url(#glow)',
                        strokeDashoffset: strokeDashOffset,
                      }}
                      markerEnd="url(#arrowhead)"
                    />
                  </g>
                )
              })}

              {/* Pulsing Nodes with Heartbeat */}
              {nodes.map((node, idx) => {
                const isHovered = hoveredNode === node.id
                
                return (
                  <g key={node.id}>
                    <motion.circle
                      custom={idx}
                      variants={nodeVariants}
                      initial="hidden"
                      animate={
                        isInView
                          ? {
                              ...nodeVariants.visible,
                              scale: isHovered ? 1.15 : [1, 1.05, 1],
                            }
                          : 'hidden'
                      }
                      cx={node.x}
                      cy={node.y}
                      r={isHovered ? 40 : 30}
                      fill={isHovered ? '#8FE01C' : '#ABFE2C'}
                      stroke="#1E1B2E"
                      strokeWidth={3}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      transition={{
                        ...nodeVariants.visible.transition,
                        scale: {
                          duration: isHovered ? 0.2 : 2,
                          repeat: isHovered ? 0 : Infinity,
                          ease: 'easeInOut',
                          delay: idx * 0.2,
                        },
                      }}
                      style={{
                        filter: isHovered
                          ? 'url(#glow-strong)'
                          : 'url(#glow)',
                        boxShadow: isHovered
                          ? '0 0 30px rgba(171, 254, 44, 0.8)'
                          : '0 0 15px rgba(171, 254, 44, 0.5)',
                      }}
                    />
                    <motion.text
                      x={node.x}
                      y={node.y - 50}
                      textAnchor="middle"
                      fill="#e0e0e8"
                      fontSize="14"
                      fontWeight="600"
                      className="pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                    >
                      {node.label}
                    </motion.text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Tooltip */}
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="mt-4 p-4 glass-card border-dark-borderGlow"
              style={{
                boxShadow: '0 0 30px rgba(171, 254, 44, 0.3)',
              }}
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
          transition={{ 
            delay: 0.4,
            type: 'spring',
            stiffness: 100,
            damping: 15,
          }}
          className="grid md:grid-cols-2 gap-6"
        >
          <motion.div
            initial={{ opacity: 0, x: -30, rotateY: -15 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ 
              delay: 0.5,
              type: 'spring',
              stiffness: 100,
              damping: 15,
            }}
            className="glass-card-hover p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Activity Participation Threshold (APT)</h3>
            <p className="text-dark-textMuted">
              Only users who meet a minimum activity score receive rewards from the fee pool.
              This ensures that rewards go to active participants, not passive holders.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30, rotateY: 15 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ 
              delay: 0.6,
              type: 'spring',
              stiffness: 100,
              damping: 15,
            }}
            className="glass-card-hover p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Gauge-like Emissions</h3>
            <p className="text-dark-textMuted">
              Protocol emissions are allocated based on community votes, similar to Curve's
              gauge system. This creates competition and alignment between protocols and voters.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
