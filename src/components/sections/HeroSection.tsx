import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Parallax effects
  const penguinY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const penguinOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const penguinBlur = useTransform(scrollYProgress, [0, 0.5], [0, 20])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-bgAlt to-dark-bg" />
      
      {/* Floating Penguin */}
      <motion.div
        style={{
          y: penguinY,
          opacity: penguinOpacity,
          filter: `blur(${penguinBlur}px)`,
        }}
        className="relative z-10"
      >
        <motion.img
          src="/penguin.png"
          alt="Abstract Panoramix Penguin"
          className="w-64 h-64 md:w-96 md:h-96 object-contain"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Parallax Text */}
      <motion.div
        style={{
          y: textY,
          opacity: textOpacity,
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-heading font-bold text-dark-accent/20 select-none">
          ABSTRACT
          <br />
          PANORAMIX
        </h1>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2 text-dark-textMuted">
          <span className="text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-dark-accent rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-dark-accent rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

