import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const [glitchText, setGlitchText] = useState('ABSTRACT PANORAMIX')
  const [isGlitching, setIsGlitching] = useState(false)

  // Parallax effects
  const textY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const textScale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  // Glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true)
      const originalText = 'ABSTRACT PANORAMIX'
      let iterations = 0
      
      const glitchAnimation = setInterval(() => {
        setGlitchText(
          originalText
            .split('')
            .map((char, index) => {
              if (index < iterations) {
                return originalText[index]
              }
              return glitchChars[Math.floor(Math.random() * glitchChars.length)]
            })
            .join('')
        )

        if (iterations >= originalText.length) {
          clearInterval(glitchAnimation)
          setIsGlitching(false)
          setGlitchText(originalText)
        }

        iterations += 1 / 3
      }, 30)
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Aurora Blobs Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-dark-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-dark-blurple/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-bgAlt to-dark-bg" />
      
      {/* Film Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Typographic Hero */}
      <motion.div
        style={{
          y: textY,
          opacity: textOpacity,
          scale: textScale,
        }}
        className="relative z-10 text-center"
      >
        {/* Main Title with Glitch Effect */}
        <motion.h1
          className="text-7xl md:text-8xl lg:text-9xl font-heading font-bold text-dark-accent mb-6 select-none"
          style={{
            textShadow: '0 0 40px rgba(171, 254, 44, 0.5), 0 0 80px rgba(171, 254, 44, 0.3)',
          }}
          animate={isGlitching ? {
            x: [0, -2, 2, -2, 2, 0],
            y: [0, 2, -2, 2, -2, 0],
          } : {}}
          transition={{
            duration: 0.1,
            repeat: isGlitching ? 5 : 0,
          }}
        >
          {glitchText.split('').map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              animate={isGlitching ? {
                color: ['#ABFE2C', '#7B61FF', '#ABFE2C'],
              } : {}}
              transition={{
                duration: 0.1,
                delay: index * 0.01,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl text-dark-textMuted font-light"
        >
          Visualizing the future of Consumer Crypto Governance
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2 text-dark-textMuted">
          <motion.span
            className="text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll to explore
          </motion.span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 border-dark-accent rounded-full flex items-start justify-center p-2"
            style={{
              boxShadow: '0 0 20px rgba(171, 254, 44, 0.5)',
            }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 bg-dark-accent rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
