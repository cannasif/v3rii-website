import { motion } from 'framer-motion'

const lines = [
  "// V3Rİİ - Advanced Technology Solutions",
  "import React from 'react';",
  "import { motion, AnimatePresence } from 'framer-motion';",
  "import { AI, Innovation, Future } from './core';",
  "",
  "interface TechSolution {",
  "  id: string;",
  "  name: string;",
  "  isRevolutionary: boolean;",
  "  impact: 'high' | 'medium' | 'low';",
  "}",
  "",
  "class DigitalTransformation {",
  "  private vision: string;",
  "  private technology: string;",
  "",
  "  constructor(vision: string) {",
  "    this.vision = vision;",
  "    this.technology = 'cutting-edge';",
  "  }",
  "",
  "  async revolutionize(): Promise<Innovation[]> {",
  "    const solutions = await this.generateSolutions();",
  "    return solutions.filter(s => s.isRevolutionary);",
  "  }",
  "",
  "  private async generateSolutions() {",
  "    return [",
  "      { name: 'AI-Powered CRM', impact: 'high' },",
  "      { name: 'B2B Platform', impact: 'high' },",
  "      { name: 'Smart Warehouse', impact: 'medium' }",
  "    ];",
  "  }",
  "}",
  "",
  "const techSolution = (): TechSolution[] => {",
  "  return innovation.map((idea, index) => {",
  "    if (idea.isRevolutionary) {",
  "      return {",
  "        id: `solution-${index}`,",
  "        name: idea.name,",
  "        isRevolutionary: true,",
  "        impact: idea.calculateImpact()",
  "      };",
  "    }",
  "    return null;",
  "  }).filter(Boolean);",
  "};",
  "",
  "export const V3RiiPlatform = {",
  "  core: new DigitalTransformation('Innovation'),",
  "  ai: aiEngine,",
  "  solutions: techSolution(),",
  "  version: '3.0.0',",
  "  status: 'revolutionary'",
  "};",
  "",
  "export default V3Rİİ;",
  "",
  "// End of file - V3Rİİ Solutions",
  "// Copyright 2024 - All rights reserved"
]

type Props = {
  speed?: number
  opacity?: number
}

export default function CodeBackground({ speed = 75, opacity = 0.3 }: Props) {
  return (
    <div className="absolute inset-0" style={{ opacity }}>
      <div className="absolute inset-0 overflow-hidden flex justify-center pointer-events-none">
        <motion.div
          className="w-[90%] text-cyan-400/50 font-mono text-sm leading-6"
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        >
          <div className="whitespace-pre-line px-4 py-8">
            {lines.map((line, index) => (
              <div key={`code-${index}`} className="flex items-center">
                <span className="text-gray-500 w-8 text-right mr-4 select-none">
                  {(index + 1).toString().padStart(2, ' ')}
                </span>
                <span>{line}</span>
              </div>
            ))}
          </div>
          <div className="whitespace-pre-line px-4 py-8">
            {lines.map((line, index) => (
              <div key={`code-dup-${index}`} className="flex items-center">
                <span className="text-gray-500 w-8 text-right mr-4 select-none">
                  {(index + 1).toString().padStart(2, ' ')}
                </span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

