"use client"

import { useState, useEffect } from "react"

interface GlitchTextProps {
  text: string
  className?: string
  glitchFactor?: number // 0-1, higher means more glitching
  speed?: number // ms between glitch updates
}

export function GlitchText({ text, className = "", glitchFactor = 0.3, speed = 100 }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text)

  useEffect(() => {
    // Characters to use for glitching
    const glitchChars = "!<>-_\\/[]{}—=+*^?#________"

    const interval = setInterval(() => {
      // Only glitch if random number is less than glitchFactor
      if (Math.random() < glitchFactor) {
        let result = ""

        // For each character in the original text
        for (let i = 0; i < text.length; i++) {
          // Randomly decide whether to glitch this character
          if (Math.random() < 0.1 * glitchFactor) {
            // Replace with a random glitch character
            result += glitchChars[Math.floor(Math.random() * glitchChars.length)]
          } else {
            // Keep the original character
            result += text[i]
          }
        }

        setDisplayText(result)
      } else {
        // Reset to original text
        setDisplayText(text)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, glitchFactor, speed])

  return <span className={`font-mono ${className}`}>{displayText}</span>
}
