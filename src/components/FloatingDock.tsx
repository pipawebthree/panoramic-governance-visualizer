import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Home, Activity, Calculator, Book } from 'lucide-react'

interface DockItem {
  id: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  targetId: string
}

const dockItems: DockItem[] = [
  { id: 'hero', icon: Home, label: 'Start', targetId: 'hero' },
  { id: 'flywheel', icon: Activity, label: 'Logic', targetId: 'flywheel' },
  { id: 'simulator', icon: Calculator, label: 'Toy', targetId: 'simulator' },
  { id: 'glossary', icon: Book, label: 'Info', targetId: 'glossary' },
]

export default function FloatingDock() {
  const dockRef = useRef<HTMLDivElement>(null)
  const [mouseX, setMouseX] = useState<number | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dockRef.current) {
        const rect = dockRef.current.getBoundingClientRect()
        setMouseX(e.clientX - rect.left)
      }
    }

    const handleMouseLeave = () => {
      setMouseX(null)
    }

    const dock = dockRef.current
    if (dock) {
      dock.addEventListener('mousemove', handleMouseMove)
      dock.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (dock) {
        dock.removeEventListener('mousemove', handleMouseMove)
        dock.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  const handleClick = (targetId: string) => {
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.div
      ref={dockRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
      style={{
        height: '64px',
        padding: '0 16px',
        background: 'rgba(5, 5, 5, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '9999px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="flex items-center gap-4 h-full">
        {dockItems.map((item) => {
          const Icon = item.icon
          const itemRef = useRef<HTMLButtonElement>(null)
          const distance = useMotionValue(150)
          const scale = useTransform(distance, (d) => {
            if (d > 150) return 1.0
            const normalized = d / 150
            const gaussian = Math.exp(-(normalized * normalized) * 2)
            return 1.0 + gaussian * 0.5
          })

          useEffect(() => {
            if (mouseX !== null && itemRef.current) {
              const rect = itemRef.current.getBoundingClientRect()
              const iconCenterX = rect.left + rect.width / 2 - (dockRef.current?.getBoundingClientRect().left || 0)
              const d = Math.abs(mouseX - iconCenterX)
              distance.set(d)
            } else {
              distance.set(150)
            }
          }, [mouseX, distance])

          return (
            <motion.button
              key={item.id}
              ref={itemRef}
              onClick={() => handleClick(item.targetId)}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-dark-textMuted hover:text-dark-accent transition-colors"
              style={{ scale }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

