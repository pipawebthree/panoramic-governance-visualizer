import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Advanced parallax transforms
  const penguinY = useTransform(scrollYProgress, [0, 1], [0, -300])
  const penguinScale = useTransform(scrollYProgress, [0, 1], [1, 0.6])
  const penguinOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const penguinBlur = useTransform(scrollYProgress, [0, 0.6], [0, 30])
  const penguinRotate = useTransform(scrollYProgress, [0, 1], [0, 15])
  
  // Text parallax (moves slower)
  const textY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const textScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])


  return (
    <section
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

      {/* Parallax Text - Moves slower than penguin */}
      <motion.div
        style={{
          y: textY,
          opacity: textOpacity,
          scale: textScale,
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-heading font-bold text-dark-accent/20 select-none">
          ABSTRACT
          <br />
          PANORAMIX
        </h1>
      </motion.div>
      
      {/* Floating Penguin with Zero-G Physics */}
      <motion.div
        style={{
          scale: penguinScale,
          opacity: penguinOpacity,
          filter: `blur(${penguinBlur}px)`,
        }}
        className="relative z-10"
        animate={{
          // Continuous sine wave levitation
          y: [0, -30, 0],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          rotate: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        <motion.div
          style={{
            y: penguinY,
            rotate: penguinRotate,
          }}
        >
          <motion.img
            src="/penguin.png"
            alt="Abstract Panoramix Penguin"
            className="w-64 h-64 md:w-96 md:h-96 object-contain mix-blend-multiply"
            style={{
              filter: 'drop-shadow(0 0 40px rgba(171, 254, 44, 0.3))',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Scroll indicator with enhanced animation */}
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
