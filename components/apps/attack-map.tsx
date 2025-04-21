"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { RefreshCw, Shield, AlertTriangle, Info, Zap, Lock, Wifi, Globe } from "lucide-react"

type Attack = {
  id: string
  sourceCountry: string
  sourceCity: string
  sourceLat: number
  sourceLng: number
  targetCountry: string
  targetCity: string
  targetLat: number
  targetLng: number
  type: "ddos" | "ransomware" | "phishing" | "malware" | "sql-injection" | "xss" | "bruteforce" | "mitm"
  severity: "low" | "medium" | "high" | "critical"
  timestamp: Date
  status: "ongoing" | "blocked" | "detected"
}

// Map coordinates for major cities
const cityCoordinates = {
  // Indian cities
  Delhi: { lat: 28.6139, lng: 77.209 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },

  // International cities
  "New York": { lat: 40.7128, lng: -74.006 },
  "Los Angeles": { lat: 34.0522, lng: -118.2437 },
  Chicago: { lat: 41.8781, lng: -87.6298 },
  London: { lat: 51.5074, lng: -0.1278 },
  Paris: { lat: 48.8566, lng: 2.3522 },
  Tokyo: { lat: 35.6762, lng: 139.6503 },
  Beijing: { lat: 39.9042, lng: 116.4074 },
  Moscow: { lat: 55.7558, lng: 37.6173 },
  Sydney: { lat: 33.8688, lng: 151.2093 },
  Berlin: { lat: 52.52, lng: 13.405 },
  Toronto: { lat: 43.6532, lng: -79.3832 },
  Singapore: { lat: 1.3521, lng: 103.8198 },
  Dubai: { lat: 25.2048, lng: 55.2708 },
  "Sao Paulo": { lat: -23.5505, lng: -46.6333 },
  Seoul: { lat: 37.5665, lng: 126.978 },
}

// Import missing components
const Database = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
)

const Key = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
)

const Code = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const attackTypes = {
  ddos: {
    name: "DDoS Attack",
    description: "Distributed Denial of Service attack flooding servers with traffic",
    icon: <Zap className="h-4 w-4 text-red-400" />,
  },
  ransomware: {
    name: "Ransomware",
    description: "Malicious software that encrypts files and demands payment",
    icon: <Lock className="h-4 w-4 text-purple-400" />,
  },
  phishing: {
    name: "Phishing",
    description: "Deceptive attempt to steal sensitive information",
    icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
  },
  malware: {
    name: "Malware",
    description: "Malicious software designed to damage systems",
    icon: <AlertTriangle className="h-4 w-4 text-orange-400" />,
  },
  "sql-injection": {
    name: "SQL Injection",
    description: "Code injection technique targeting databases",
    icon: <Database className="h-4 w-4 text-blue-400" />,
  },
  xss: {
    name: "Cross-Site Scripting",
    description: "Client-side code injection attack",
    icon: <Code className="h-4 w-4 text-green-400" />,
  },
  bruteforce: {
    name: "Brute Force",
    description: "Attempting to crack passwords by trying many combinations",
    icon: <Key className="h-4 w-4 text-yellow-400" />,
  },
  mitm: {
    name: "Man in the Middle",
    description: "Attack intercepting communications between systems",
    icon: <Wifi className="h-4 w-4 text-cyan-400" />,
  },
}

// Helper function to get random item from array
const getRandomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

// Helper function to get random city
const getRandomCity = (): [string, { lat: number; lng: number }] => {
  const cities = Object.entries(cityCoordinates)
  const [city, coords] = cities[Math.floor(Math.random() * cities.length)]
  return [city, coords]
}

// Helper function to get random Indian city
const getRandomIndianCity = (): [string, { lat: number; lng: number }] => {
  const indianCities = [
    ["Delhi", cityCoordinates["Delhi"]],
    ["Mumbai", cityCoordinates["Mumbai"]],
    ["Bangalore", cityCoordinates["Bangalore"]],
    ["Hyderabad", cityCoordinates["Hyderabad"]],
    ["Chennai", cityCoordinates["Chennai"]],
    ["Kolkata", cityCoordinates["Kolkata"]],
    ["Ahmedabad", cityCoordinates["Ahmedabad"]],
    ["Pune", cityCoordinates["Pune"]],
    ["Jaipur", cityCoordinates["Jaipur"]],
    ["Lucknow", cityCoordinates["Lucknow"]],
  ]
  return getRandomItem(indianCities) as [string, { lat: number; lng: number }]
}

// Helper function to get country from city
const getCityCountry = (city: string): string => {
  const indianCities = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Ahmedabad",
    "Pune",
    "Jaipur",
    "Lucknow",
  ]
  if (indianCities.includes(city)) return "India"

  const cityToCountry: Record<string, string> = {
    "New York": "USA",
    "Los Angeles": "USA",
    Chicago: "USA",
    London: "UK",
    Paris: "France",
    Tokyo: "Japan",
    Beijing: "China",
    Moscow: "Russia",
    Sydney: "Australia",
    Berlin: "Germany",
    Toronto: "Canada",
    Singapore: "Singapore",
    Dubai: "UAE",
    "Sao Paulo": "Brazil",
    Seoul: "South Korea",
  }

  return cityToCountry[city] || "Unknown"
}

// Helper function to generate a random attack
const generateRandomAttack = (): Attack => {
  // 50% chance the attack originates from India
  const useIndianSource = Math.random() < 0.5

  const [sourceCity, sourceCoords] = useIndianSource ? getRandomIndianCity() : getRandomCity()
  let [targetCity, targetCoords] = getRandomCity()

  // Make sure source and target are different
  while (sourceCity === targetCity) {
    ;[targetCity, targetCoords] = getRandomCity()
  }

  // More realistic attack types based on source/target
  let attackType: keyof typeof attackTypes
  let severity: Attack["severity"]
  let status: Attack["status"]

  // Determine attack type based on source/target
  if (sourceCity === "Beijing" || sourceCity === "Moscow") {
    // More likely to be sophisticated attacks from these cities
    attackType = getRandomItem(["ransomware", "mitm", "sql-injection", "malware"]) as keyof typeof attackTypes
    severity = getRandomItem(["high", "critical", "critical"]) as Attack["severity"]
  } else if (targetCity === "New York" || targetCity === "London" || targetCity === "Tokyo") {
    // Financial centers more likely to be targeted by certain attacks
    attackType = getRandomItem(["ddos", "ransomware", "phishing"]) as keyof typeof attackTypes
    severity = getRandomItem(["medium", "high", "critical"]) as Attack["severity"]
  } else {
    // Random attack for other combinations
    attackType = getRandomItem(Object.keys(attackTypes)) as keyof typeof attackTypes
    severity = getRandomItem(["low", "medium", "high", "critical"]) as Attack["severity"]
  }

  // Status is partially determined by severity
  if (severity === "critical") {
    status = getRandomItem(["ongoing", "detected", "detected"]) as Attack["status"]
  } else if (severity === "high") {
    status = getRandomItem(["ongoing", "detected", "blocked"]) as Attack["status"]
  } else {
    status = getRandomItem(["ongoing", "blocked", "detected"]) as Attack["status"]
  }

  return {
    id: `attack-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sourceCountry: getCityCountry(sourceCity),
    sourceCity,
    sourceLat: sourceCoords.lat,
    sourceLng: sourceCoords.lng,
    targetCountry: getCityCountry(targetCity),
    targetCity,
    targetLat: targetCoords.lat,
    targetLng: targetCoords.lng,
    type: attackType,
    severity,
    timestamp: new Date(),
    status,
  }
}

export function AttackMap() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [showLegend, setShowLegend] = useState(true)
  const [attackStats, setAttackStats] = useState({
    total: 0,
    blocked: 0,
    critical: 0,
    fromIndia: 0,
    toIndia: 0,
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  // Initialize with fake data
  useEffect(() => {
    setIsLoading(true)

    // Generate initial attacks
    const initialAttacks = Array(15)
      .fill(null)
      .map(() => generateRandomAttack())
    setAttacks(initialAttacks)

    // Calculate stats
    updateStats(initialAttacks)

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    // Set up interval to add new attacks
    const interval = setInterval(() => {
      if (Math.random() < 0.7) {
        // 70% chance to add a new attack
        const newAttack = generateRandomAttack()
        setAttacks((prev) => {
          const updated = [...prev, newAttack]
          // Keep only the latest 30 attacks
          if (updated.length > 30) {
            updated.shift()
          }
          updateStats(updated)
          return updated
        })
      }
    }, 3000)

    return () => {
      clearInterval(interval)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Update stats
  const updateStats = (attackList: Attack[]) => {
    setAttackStats({
      total: attackList.length,
      blocked: attackList.filter((a) => a.status === "blocked").length,
      critical: attackList.filter((a) => a.severity === "critical").length,
      fromIndia: attackList.filter((a) => a.sourceCountry === "India").length,
      toIndia: attackList.filter((a) => a.targetCountry === "India").length,
    })
  }

  // Draw map and attacks
  useEffect(() => {
    if (!canvasRef.current || isLoading) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // World map coordinates to canvas coordinates
    const mapToCanvas = (lat: number, lng: number) => {
      // Simple equirectangular projection
      const x = (lng + 180) * (canvas.width / 360)
      const y = (90 - lat) * (canvas.height / 180)
      return { x, y }
    }

    // Draw function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background (world map)
      ctx.fillStyle = "rgba(0, 10, 20, 0.9)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw more realistic world map
      drawWorldMap(ctx, canvas.width, canvas.height)

      // Draw attacks
      const now = Date.now()

      attacks.forEach((attack) => {
        // Skip if filtered
        if (
          activeFilter &&
          activeFilter !== attack.type &&
          activeFilter !== attack.severity &&
          activeFilter !== attack.status &&
          activeFilter !== attack.sourceCountry &&
          activeFilter !== attack.targetCountry
        ) {
          return
        }

        const source = mapToCanvas(attack.sourceLat, attack.sourceLng)
        const target = mapToCanvas(attack.targetLat, attack.targetLng)

        // Calculate attack age for animation (0-1)
        const attackAge = Math.min(1, (now - attack.timestamp.getTime()) / 10000)

        // Draw arc connection line for more realistic trajectory
        drawAttackArc(ctx, source, target, attackAge, attack)

        // Highlight source and target with glowing effect
        drawGlowingPoint(ctx, source.x, source.y, "rgba(255, 50, 50, 0.8)", 4)
        drawGlowingPoint(ctx, target.x, target.y, "rgba(50, 255, 50, 0.8)", 4)

        // Draw attack type icon for selected attack
        if (selectedAttack && attack.id === selectedAttack.id) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
          ctx.lineWidth = 2
          ctx.setLineDash([5, 3])
          ctx.beginPath()
          ctx.arc(source.x, source.y, 12, 0, Math.PI * 2)
          ctx.stroke()

          ctx.beginPath()
          ctx.arc(target.x, target.y, 12, 0, Math.PI * 2)
          ctx.stroke()
          ctx.setLineDash([])

          // Draw line from source to target
          ctx.beginPath()

          // Create curved path for selected attack
          const cp1x = source.x + (target.x - source.x) * 0.3
          const cp1y = source.y + (target.y - source.y) * 0.1 - 50
          const cp2x = source.x + (target.x - source.x) * 0.7
          const cp2y = source.y + (target.y - source.y) * 0.9 - 50

          ctx.moveTo(source.x, source.y)
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, target.x, target.y)

          ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"
          ctx.lineWidth = 2
          ctx.stroke()
        }
      })

      // Continue animation
      animationRef.current = requestAnimationFrame(draw)
    }

    // Add these helper functions after the mapToCanvas function

    // Function to draw a more realistic world map
    const drawWorldMap = (ctx, width, height) => {
      // Draw ocean
      ctx.fillStyle = "rgba(0, 20, 40, 0.3)"
      ctx.fillRect(0, 0, width, height)

      // Draw latitude/longitude grid
      ctx.strokeStyle = "rgba(0, 100, 128, 0.2)"
      ctx.lineWidth = 1

      // Draw longitude lines
      for (let lng = -180; lng <= 180; lng += 15) {
        const { x } = mapToCanvas(0, lng)
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      // Draw latitude lines
      for (let lat = -90; lat <= 90; lat += 15) {
        const { y } = mapToCanvas(lat, 0)
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw continents with more detail
      // North America
      drawContinent(
        ctx,
        [
          { lat: 60, lng: -130 },
          { lat: 70, lng: -90 },
          { lat: 50, lng: -60 },
          { lat: 30, lng: -80 },
          { lat: 15, lng: -100 },
          { lat: 30, lng: -120 },
          { lat: 50, lng: -125 },
        ],
        "rgba(0, 80, 0, 0.3)",
      )

      // South America
      drawContinent(
        ctx,
        [
          { lat: 10, lng: -80 },
          { lat: 0, lng: -50 },
          { lat: -50, lng: -70 },
          { lat: -20, lng: -80 },
          { lat: 0, lng: -85 },
        ],
        "rgba(0, 100, 0, 0.3)",
      )

      // Europe & Africa
      drawContinent(
        ctx,
        [
          { lat: 60, lng: 0 },
          { lat: 70, lng: 30 },
          { lat: 40, lng: 40 },
          { lat: 30, lng: 20 },
          { lat: 0, lng: 10 },
          { lat: -30, lng: 20 },
          { lat: -35, lng: 30 },
          { lat: 0, lng: 40 },
          { lat: 30, lng: 40 },
          { lat: 40, lng: 10 },
        ],
        "rgba(0, 90, 0, 0.3)",
      )

      // Asia
      drawContinent(
        ctx,
        [
          { lat: 70, lng: 80 },
          { lat: 60, lng: 150 },
          { lat: 30, lng: 130 },
          { lat: 10, lng: 100 },
          { lat: 0, lng: 100 },
          { lat: 20, lng: 80 },
          { lat: 30, lng: 60 },
          { lat: 60, lng: 60 },
        ],
        "rgba(0, 85, 0, 0.3)",
      )

      // Australia
      drawContinent(
        ctx,
        [
          { lat: -10, lng: 110 },
          { lat: -10, lng: 150 },
          { lat: -30, lng: 155 },
          { lat: -40, lng: 145 },
          { lat: -30, lng: 115 },
        ],
        "rgba(0, 95, 0, 0.3)",
      )

      // Draw major cities with pulsing effect
      Object.entries(cityCoordinates).forEach(([city, { lat, lng }]) => {
        const { x, y } = mapToCanvas(lat, lng)

        // Pulsing effect
        const pulseSize = 2 + Math.sin(Date.now() / 500) * 1

        // Draw city dot
        ctx.fillStyle = "rgba(0, 255, 128, 0.7)"
        ctx.beginPath()
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2)
        ctx.fill()

        // Draw city name for selected cities
        if (
          ["Delhi", "Mumbai", "New York", "London", "Tokyo", "Beijing", "Sydney", "Moscow", "Singapore"].includes(city)
        ) {
          ctx.fillStyle = "rgba(0, 255, 128, 0.8)"
          ctx.font = "9px monospace"
          ctx.fillText(city, x + 5, y + 3)
        }
      })
    }

    // Function to draw a continent
    const drawContinent = (ctx, points, color) => {
      if (points.length < 3) return

      ctx.fillStyle = color
      ctx.beginPath()

      const start = mapToCanvas(points[0].lat, points[0].lng)
      ctx.moveTo(start.x, start.y)

      for (let i = 1; i < points.length; i++) {
        const point = mapToCanvas(points[i].lat, points[i].lng)
        ctx.lineTo(point.x, point.y)
      }

      ctx.closePath()
      ctx.fill()
    }

    // Function to draw an attack arc
    const drawAttackArc = (ctx, source, target, progress, attack) => {
      // Calculate control points for a curved path
      const dx = target.x - source.x
      const dy = target.y - source.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Higher arc for longer distances
      const arcHeight = Math.min(distance * 0.3, 100)

      // Control points for the bezier curve
      const cpX = source.x + dx * 0.5
      const cpY = source.y + dy * 0.5 - arcHeight

      // Draw the path
      ctx.beginPath()
      ctx.moveTo(source.x, source.y)
      ctx.quadraticCurveTo(cpX, cpY, target.x, target.y)

      // Line style based on attack type and status
      if (attack.status === "blocked") {
        ctx.strokeStyle = "rgba(255, 0, 0, 0.4)"
        ctx.setLineDash([5, 3])
      } else if (attack.severity === "critical") {
        ctx.strokeStyle = "rgba(255, 0, 0, 0.7)"
        ctx.setLineDash([])
      } else if (attack.severity === "high") {
        ctx.strokeStyle = "rgba(255, 165, 0, 0.7)"
        ctx.setLineDash([])
      } else {
        ctx.strokeStyle = "rgba(0, 255, 255, 0.5)"
        ctx.setLineDash([])
      }

      ctx.lineWidth = attack.severity === "critical" ? 2 : 1
      ctx.stroke()
      ctx.setLineDash([])

      // Draw animated dot along the attack path
      if (attack.status !== "blocked") {
        // Calculate position along the bezier curve
        const t = progress
        const x = (1 - t) * (1 - t) * source.x + 2 * (1 - t) * t * cpX + t * t * target.x
        const y = (1 - t) * (1 - t) * source.y + 2 * (1 - t) * t * cpY + t * t * target.y

        // Draw the dot with a glow effect
        const dotColor =
          attack.severity === "critical"
            ? "rgba(255, 0, 0, 0.8)"
            : attack.severity === "high"
              ? "rgba(255, 165, 0, 0.8)"
              : "rgba(0, 255, 255, 0.8)"

        drawGlowingPoint(ctx, x, y, dotColor, 3)

        // Add a trail effect for critical attacks
        if (attack.severity === "critical") {
          ctx.beginPath()
          ctx.arc(x, y, 5, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(255, 0, 0, 0.2)"
          ctx.fill()
        }
      }
    }

    // Function to draw a glowing point
    const drawGlowingPoint = (ctx, x, y, color, size) => {
      // Outer glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.beginPath()
      ctx.arc(x, y, size * 2, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Inner dot
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    }

    // Start animation
    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [attacks, isLoading, selectedAttack, activeFilter])

  // Handle canvas click to select attack
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // World map coordinates to canvas coordinates
    const mapToCanvas = (lat: number, lng: number) => {
      const canvasX = (lng + 180) * (canvas.width / 360)
      const canvasY = (90 - lat) * (canvas.height / 180)
      return { x: canvasX, y: canvasY }
    }

    // Find clicked attack
    let clickedAttack: Attack | null = null
    let minDistance = Number.POSITIVE_INFINITY

    attacks.forEach((attack) => {
      const source = mapToCanvas(attack.sourceLat, attack.sourceLng)
      const target = mapToCanvas(attack.targetLat, attack.targetLng)

      // Check if click is near source or target
      const distToSource = Math.sqrt(Math.pow(x - source.x, 2) + Math.pow(y - source.y, 2))
      const distToTarget = Math.sqrt(Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2))

      const minDist = Math.min(distToSource, distToTarget)

      if (minDist < 15 && minDist < minDistance) {
        minDistance = minDist
        clickedAttack = attack
      }
    })

    setSelectedAttack(clickedAttack)
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  // Apply filter
  const applyFilter = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter)
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center">
          <Globe className="h-5 w-5 mr-2 text-green-400" />
          <h2 className="text-sm font-bold">Global Cyber Attack Map</h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="p-1 hover:bg-green-900/30 rounded flex items-center text-xs"
            onClick={() => setShowLegend(!showLegend)}
          >
            <Info className="h-3 w-3 mr-1" />
            {showLegend ? "Hide" : "Show"} Legend
          </button>

          <button
            className="p-1 hover:bg-green-900/30 rounded flex items-center text-xs"
            onClick={() => setSelectedAttack(null)}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mb-3 grid grid-cols-5 gap-2 text-xs">
        <div className="bg-gray-900/50 border border-green-500/30 p-2 flex flex-col items-center">
          <div className="text-green-300 font-bold">{attackStats.total}</div>
          <div>Total Attacks</div>
        </div>
        <div className="bg-gray-900/50 border border-green-500/30 p-2 flex flex-col items-center">
          <div className="text-red-400 font-bold">{attackStats.critical}</div>
          <div>Critical</div>
        </div>
        <div className="bg-gray-900/50 border border-green-500/30 p-2 flex flex-col items-center">
          <div className="text-green-400 font-bold">{attackStats.blocked}</div>
          <div>Blocked</div>
        </div>
        <div className="bg-gray-900/50 border border-green-500/30 p-2 flex flex-col items-center">
          <div className="text-blue-400 font-bold">{attackStats.fromIndia}</div>
          <div>From India</div>
        </div>
        <div className="bg-gray-900/50 border border-green-500/30 p-2 flex flex-col items-center">
          <div className="text-yellow-400 font-bold">{attackStats.toIndia}</div>
          <div>To India</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 border border-green-500/30 overflow-hidden flex flex-col md:flex-row">
        {/* Map Canvas */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-green-500" />
              <span className="ml-2">Loading attack data...</span>
            </div>
          ) : (
            <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" onClick={handleCanvasClick} />
          )}

          {/* Legend */}
          {showLegend && (
            <div className="absolute top-2 left-2 bg-black/70 border border-green-500/30 p-2 text-xs max-w-[200px]">
              <div className="font-bold mb-1">Attack Types</div>
              <div className="grid grid-cols-1 gap-1">
                {Object.entries(attackTypes).map(([key, { name, icon }]) => (
                  <button
                    key={key}
                    className={`flex items-center hover:bg-green-900/30 p-1 rounded ${activeFilter === key ? "bg-green-900/50" : ""}`}
                    onClick={() => applyFilter(key)}
                  >
                    {icon}
                    <span className="ml-1">{name}</span>
                  </button>
                ))}
              </div>

              <div className="font-bold mt-2 mb-1">Severity</div>
              <div className="grid grid-cols-2 gap-1">
                <button
                  className={`flex items-center hover:bg-green-900/30 p-1 rounded ${activeFilter === "critical" ? "bg-green-900/50" : ""}`}
                  onClick={() => applyFilter("critical")}
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  Critical
                </button>
                <button
                  className={`flex items-center hover:bg-green-900/30 p-1 rounded ${activeFilter === "high" ? "bg-green-900/50" : ""}`}
                  onClick={() => applyFilter("high")}
                >
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                  High
                </button>
                <button
                  className={`flex items-center hover:bg-green-900/30 p-1 rounded ${activeFilter === "medium" ? "bg-green-900/50" : ""}`}
                  onClick={() => applyFilter("medium")}
                >
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                  Medium
                </button>
                <button
                  className={`flex items-center hover:bg-green-900/30 p-1 rounded ${activeFilter === "low" ? "bg-green-900/50" : ""}`}
                  onClick={() => applyFilter("low")}
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Low
                </button>
              </div>

              <div className="font-bold mt-2 mb-1">Status</div>
              <div className="grid grid-cols-1 gap-1">
                <button
                  className={`flex items-center hover:bg-green-900/30 p-1 rounded ${activeFilter === "ongoing" ? "bg-green-900/50" : ""}`}
                  onClick={() => applyFilter("ongoing")}
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                  Ongoing
                </button>
                <button
                  className={`flex items-center hover:bg-green-900/30 p-1 rounded ${activeFilter === "blocked" ? "bg-green-900/50" : ""}`}
                  onClick={() => applyFilter("blocked")}
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Blocked
                </button>
                <button
                  className={`flex items-center hover:bg-green-900/30 p-1 rounded ${activeFilter === "detected" ? "bg-green-900/50" : ""}`}
                  onClick={() => applyFilter("detected")}
                >
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                  Detected
                </button>
              </div>

              <button
                className="w-full mt-2 text-xs bg-green-900/50 border border-green-500/50 py-1 hover:bg-green-900/70"
                onClick={() => setActiveFilter(null)}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Attack Details */}
        <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-green-500/30 overflow-auto">
          <div className="p-2 border-b border-green-500/30 flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            <span className="text-xs font-bold">Attack Details</span>
          </div>

          {selectedAttack ? (
            <div className="p-2 text-xs">
              <div className="mb-3">
                <div className="flex items-center">
                  {attackTypes[selectedAttack.type].icon}
                  <span className="ml-1 font-bold">{attackTypes[selectedAttack.type].name}</span>
                </div>
                <div className="text-green-500/70 mt-1">{attackTypes[selectedAttack.type].description}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <div className="text-green-500/70">Severity:</div>
                  <div
                    className={
                      selectedAttack.severity === "critical"
                        ? "text-red-400"
                        : selectedAttack.severity === "high"
                          ? "text-orange-400"
                          : selectedAttack.severity === "medium"
                            ? "text-yellow-400"
                            : "text-green-400"
                    }
                  >
                    {selectedAttack.severity.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-green-500/70">Status:</div>
                  <div
                    className={
                      selectedAttack.status === "blocked"
                        ? "text-green-400"
                        : selectedAttack.status === "detected"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }
                  >
                    {selectedAttack.status.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-green-500/70">Source:</div>
                <div>
                  {selectedAttack.sourceCity}, {selectedAttack.sourceCountry}
                </div>
                <div className="text-xs text-green-500/50">
                  {selectedAttack.sourceLat.toFixed(4)}, {selectedAttack.sourceLng.toFixed(4)}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-green-500/70">Target:</div>
                <div>
                  {selectedAttack.targetCity}, {selectedAttack.targetCountry}
                </div>
                <div className="text-xs text-green-500/50">
                  {selectedAttack.targetLat.toFixed(4)}, {selectedAttack.targetLng.toFixed(4)}
                </div>
              </div>

              <div>
                <div className="text-green-500/70">Timestamp:</div>
                <div>{formatTime(selectedAttack.timestamp)}</div>
              </div>

              <button
                className="w-full mt-4 text-xs bg-green-900/50 border border-green-500/50 py-1 hover:bg-green-900/70"
                onClick={() => setSelectedAttack(null)}
              >
                Close Details
              </button>
            </div>
          ) : (
            <div className="p-4 text-xs text-center text-green-500/70">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500/70" />
              Select an attack on the map to view details
              <div className="mt-4 text-green-500/50">{attacks.length} active attacks detected</div>
            </div>
          )}

          {/* Recent Attacks */}
          <div className="p-2 border-t border-green-500/30">
            <div className="text-xs font-bold mb-2">Recent Attacks</div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {attacks.slice(0, 5).map((attack) => (
                <button
                  key={attack.id}
                  className={`w-full text-left p-1 text-xs border border-green-500/20 hover:bg-green-900/30 ${selectedAttack?.id === attack.id ? "bg-green-900/50" : ""}`}
                  onClick={() => setSelectedAttack(attack)}
                >
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      {attackTypes[attack.type].icon}
                      <span className="ml-1">
                        {attack.sourceCountry} → {attack.targetCountry}
                      </span>
                    </div>
                    <span
                      className={
                        attack.severity === "critical"
                          ? "text-red-400"
                          : attack.severity === "high"
                            ? "text-orange-400"
                            : attack.severity === "medium"
                              ? "text-yellow-400"
                              : "text-green-400"
                      }
                    >
                      {attack.severity.substring(0, 1).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-green-500/50 text-[10px]">{formatTime(attack.timestamp)}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
