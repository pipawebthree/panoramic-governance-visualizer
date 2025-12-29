import { motion } from 'framer-motion'

export const AnimatedConnection = ({ 
  startX, 
  startY, 
  endX, 
  endY 
}: { 
  startX: number
  startY: number
  endX: number
  endY: number
}) => {
  // Calculate path with a quadratic curve
  const midX = (startX + endX) / 2
  const path = `M ${startX} ${startY} Q ${midX} ${startY} ${midX} ${(startY + endY) / 2} T ${endX} ${endY}`

  return (
    <svg 
      viewBox="0 0 800 400"
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none', 
        overflow: 'visible', 
        zIndex: 0 
      }}
    >
      <defs>
        <filter id={`glow-${startX}-${startY}`}>
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Glow effect path */}
      <path 
        d={path} 
        stroke="#ABFE2C" 
        strokeWidth="6" 
        fill="none" 
        opacity="0.2" 
        filter={`url(#glow-${startX}-${startY})`}
      />
      {/* Moving dash path */}
      <motion.path
        d={path}
        stroke="#ABFE2C"
        strokeWidth="2"
        fill="none"
        strokeDasharray="10 5"
        animate={{ strokeDashoffset: [0, -20] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  )
}

