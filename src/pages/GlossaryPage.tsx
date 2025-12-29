import { motion } from 'framer-motion'

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

export default function GlossaryPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold mb-4">Glossary & FAQ</h1>
        <p className="text-dark-textMuted text-lg">
          Key terms and concepts in Panoramic Governance, explained simply.
        </p>
      </div>

      {categories.map((category, catIdx) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: catIdx * 0.1 }}
          className="glass-card-hover p-6"
        >
          <h2 className="text-2xl font-semibold mb-6">{category}</h2>
          <div className="space-y-6">
            {glossaryItems
              .filter((item) => item.category === category)
              .map((item, idx) => (
                <motion.div
                  key={item.term}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: catIdx * 0.1 + idx * 0.05 }}
                  className="border-b border-dark-border pb-4 last:border-0"
                >
                  <h3 className="text-lg font-semibold text-dark-accent mb-2">
                    {item.term}
                  </h3>
                  <p className="text-dark-textMuted">{item.definition}</p>
                </motion.div>
              ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: categories.length * 0.1 }}
        className="glass-card-hover p-6"
      >
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: categories.length * 0.1 + 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-2">
              How is the fee pool distributed to users?
            </h3>
            <p className="text-dark-textMuted">
              The fee pool is distributed proportionally to active users based on their activity
              scores. Only users who meet the APT threshold are eligible. The distribution formula
              is: User Reward = Fee Pool × (User Activity Score / Sum of All Active Users' Activity Scores).
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: categories.length * 0.1 + 0.15 }}
          >
            <h3 className="text-lg font-semibold mb-2">
              How are protocol emissions calculated?
            </h3>
            <p className="text-dark-textMuted">
              Emissions are allocated proportionally based on effective votes. The formula is:
              Protocol Emissions = Emission Budget × (Protocol Effective Votes / Sum of All Effective Votes).
              If liquid bounties are enabled, effective votes include the bounty boost multiplier.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: categories.length * 0.1 + 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-2">
              What happens if a user doesn't meet the APT threshold?
            </h3>
            <p className="text-dark-textMuted">
              Users below the APT threshold are marked as inactive and receive zero rewards from
              the fee pool. However, they can still participate in governance voting and may
              become active in future epochs if their activity increases.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: categories.length * 0.1 + 0.25 }}
          >
            <h3 className="text-lg font-semibold mb-2">
              Why use liquid bounties?
            </h3>
            <p className="text-dark-textMuted">
              Liquid bounties allow protocols to compete more directly for emissions by contributing
              tokens. This creates a market mechanism where protocols can signal their value and
              commitment to the ecosystem. It's optional and can be toggled on or off.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
