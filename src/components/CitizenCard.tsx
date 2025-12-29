import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion'
import { Twitter } from 'lucide-react'
import { Protocol } from '@/lib/sim/types'

function GlareOverlay({ mouseXSpring, mouseYSpring }: { mouseXSpring: MotionValue<number>, mouseYSpring: MotionValue<number> }) {
  const glareAngle = useTransform(
    [mouseXSpring, mouseYSpring],
    ([x, y]: number[]) => {
      const angle = Math.atan2(y, x) * (180 / Math.PI)
      return angle + 90
    }
  )

  const backgroundGradient = useTransform(
    glareAngle,
    (angle) => `linear-gradient(${angle}deg, transparent 30%, rgba(171, 254, 44, 0.1) 50%, transparent 70%)`
  )

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ background: backgroundGradient }}
    />
  )
}

interface CitizenCardProps {
  citizenId: string
  yieldAmount: number
  votedProtocol: Protocol
  onShare?: () => void
}

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
  
  if (category.includes('gaming')) return '🎮'
  if (category.includes('culture') || category.includes('nft')) return '🐧'
  if (category.includes('marketplace')) return '🛒'
  if (category.includes('ai') || category.includes('consumer')) return '🤖'
  if (category.includes('infrastructure')) return '🔗'
  if (category.includes('tools')) return '🛠️'
  
  return '📦'
}

export default function CitizenCard({ citizenId, yieldAmount, votedProtocol, onShare }: CitizenCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['17.5deg', '-17.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-17.5deg', '17.5deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const handleShare = () => {
    const text = `I just secured $${yieldAmount.toLocaleString()} in rewards on the @AbstractChain Panoramic Governance Simulator. My top protocol is ${votedProtocol.name}. Verify your citizenship: ${window.location.href}`
    const encodedText = encodeURIComponent(text)
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank')
    onShare?.()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          boxShadow: '0 0 15px rgba(171, 254, 44, 0.5)',
        }}
        className="relative w-full max-w-sm aspect-[1.586] glass-card-hover p-6 overflow-hidden"
      >
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Glare effect */}
        <GlareOverlay mouseXSpring={mouseXSpring} mouseYSpring={mouseYSpring} />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Top Left - Citizen ID */}
          <div>
            <p className="text-xs text-dark-textMuted mb-1">CITIZEN ID</p>
            <p className="text-sm font-mono text-dark-accent font-semibold">{citizenId}</p>
          </div>

          {/* Center - Yield Generated */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <p className="text-xs text-dark-textMuted mb-2">YIELD GENERATED</p>
            <motion.p
              className="text-4xl md:text-5xl font-heading font-bold text-dark-accent"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              ${yieldAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.p>
          </div>

          {/* Bottom - Voted For */}
          <div className="flex items-center gap-2">
            <p className="text-xs text-dark-textMuted">VOTED FOR</p>
            <div className="flex items-center gap-2">
              <span className="text-lg">{getProtocolEmoji(votedProtocol)}</span>
              <p className="text-sm font-semibold text-dark-accent">{votedProtocol.name}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Share Button */}
      <motion.button
        onClick={handleShare}
        className="flex items-center gap-2 px-6 py-3 bg-dark-accent hover:bg-dark-accentHover text-black rounded-lg font-medium transition-smooth shadow-glow-green"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Twitter className="w-5 h-5" />
        <span>Mint Proof on X</span>
      </motion.button>
    </div>
  )
}

