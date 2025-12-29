import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface GlossaryItem {
  term: string
  definition: string
  category: string
}

const glossaryItems: GlossaryItem[] = [
  {
    term: 'Epoch',
    definition: 'A fixed time period (e.g., weekly or monthly) during which sequencer fees are collected, rewards are distributed, and protocol emissions are allocated based on votes.',
    category: 'Core Concepts',
  },
  {
    term: 'Sequencer Fees',
    definition: 'Fees collected from all transactions processed by the network sequencer. A portion goes to the sequencer operator, and the remainder forms the fee pool for distribution.',
    category: 'Core Concepts',
  },
  {
    term: 'Fee Pool',
    definition: 'The portion of sequencer fees available for distribution to active participants, calculated as: Total Fees × (1 - Sequencer Cut %).',
    category: 'Core Concepts',
  },
  {
    term: 'Activity Participation Threshold (APT)',
    definition: 'A minimum activity score that users must meet to be eligible for fee pool rewards. This ensures rewards go to active participants rather than passive holders.',
    category: 'Core Concepts',
  },
  {
    term: 'Activity Score',
    definition: 'A metric measuring a user\'s engagement with the network, including transactions, protocol interactions, and governance participation.',
    category: 'Metrics',
  },
  {
    term: 'Vote Power',
    definition: 'The weight of a user\'s vote in protocol emissions allocation. Typically based on token holdings or staking position.',
    category: 'Metrics',
  },
  {
    term: 'Emissions',
    definition: 'Token rewards allocated to protocols based on community votes. Similar to Curve\'s gauge system, protocols compete for emissions through governance.',
    category: 'Core Concepts',
  },
  {
    term: 'Emission Budget',
    definition: 'The total amount of tokens available for distribution to protocols in a given epoch. Allocated proportionally based on effective votes.',
    category: 'Core Concepts',
  },
  {
    term: 'Base Votes',
    definition: 'The initial vote count for a protocol, determined by community governance decisions and protocol metrics.',
    category: 'Voting',
  },
  {
    term: 'Effective Votes',
    definition: 'The final vote count used for emissions calculation, which may include boosts from liquid bounties if enabled.',
    category: 'Voting',
  },
  {
    term: 'Liquid Bounties',
    definition: 'An optional mechanism where protocols can add a boost to their effective votes by contributing tokens. This creates a market for protocol competition.',
    category: 'Extensions',
  },
  {
    term: 'Bounty Boost',
    definition: 'A percentage multiplier applied to a protocol\'s base votes when liquid bounties are enabled. Formula: Effective Votes = Base Votes × (1 + Bounty Boost / 100).',
    category: 'Extensions',
  },
]

const categories = Array.from(new Set(glossaryItems.map((item) => item.category)))

export default function GlossarySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full py-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Aurora background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-dark-accent/5 rounded-full blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ 
            type: 'spring',
            stiffness: 100,
            damping: 20,
            mass: 0.8,
          }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-4 text-dark-accent">
            Glossary & FAQ
          </h2>
          <p className="text-dark-textMuted text-lg max-w-3xl mx-auto">
            Key terms and concepts in Panoramic Governance, explained simply.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {categories.map((category, catIdx) => {
            const categoryItems = glossaryItems.filter((item) => item.category === category)
            
            return (
              <motion.div
                key={category}
                initial={{ 
                  opacity: 0, 
                  y: 50,
                  scale: 0.9,
                }}
                animate={isInView ? { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                } : {}}
                transition={{ 
                  delay: catIdx * 0.1,
                  type: 'spring',
                  stiffness: 150,
                  damping: 15,
                  mass: 0.8,
                }}
                className="glass-card-hover p-5 h-full flex flex-col"
                whileHover={{ 
                  scale: 1.02,
                  y: -5,
                  transition: { type: 'spring', stiffness: 400, damping: 10 }
                }}
              >
                <h3 className="text-lg font-semibold mb-3 text-dark-accent">{category}</h3>
                <div className="space-y-3 flex-1">
                  {categoryItems.map((item, idx) => (
                    <motion.div
                      key={item.term}
                      initial={{ opacity: 0, x: -15 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ 
                        delay: catIdx * 0.1 + idx * 0.05,
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                      }}
                      className="border-b border-dark-border pb-2 last:border-0"
                    >
                      <h4 className="text-sm font-semibold text-dark-accent mb-1">
                        {item.term}
                      </h4>
                      <p className="text-xs text-dark-textMuted leading-relaxed">{item.definition}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ 
            delay: categories.length * 0.1 + 0.2,
            type: 'spring',
            stiffness: 100,
            damping: 15,
          }}
          className="glass-card-hover p-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-dark-accent">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                q: 'How is the fee pool distributed to users?',
                a: 'The fee pool is distributed proportionally to active users based on their activity scores. Only users who meet the APT threshold are eligible.',
              },
              {
                q: 'How are protocol emissions calculated?',
                a: 'Emissions are allocated proportionally based on effective votes. If liquid bounties are enabled, effective votes include the bounty boost multiplier.',
              },
              {
                q: 'What happens if a user doesn\'t meet the APT threshold?',
                a: 'Users below the APT threshold are marked as inactive and receive zero rewards from the fee pool. However, they can still participate in governance voting.',
              },
              {
                q: 'Why use liquid bounties?',
                a: 'Liquid bounties allow protocols to compete more directly for emissions by contributing tokens. This creates a market mechanism where protocols can signal their value.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  delay: categories.length * 0.1 + 0.3 + idx * 0.08,
                  type: 'spring',
                  stiffness: 150,
                  damping: 15,
                }}
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { type: 'spring', stiffness: 400, damping: 10 }
                }}
              >
                <h4 className="text-base font-semibold mb-1 text-dark-accent">
                  {faq.q}
                </h4>
                <p className="text-sm text-dark-textMuted leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

