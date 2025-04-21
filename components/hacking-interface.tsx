"use client"

import { useState, useEffect, useRef } from "react"
import { Shield, Cpu, HardDrive, Wifi, Server, Lock } from "lucide-react"
import { GlitchText } from "./glitch-text"

export function HackingInterface() {
  const [systemStatus, setSystemStatus] = useState({
    cpu: Math.floor(Math.random() * 60) + 40,
    memory: Math.floor(Math.random() * 40) + 60,
    network: Math.floor(Math.random() * 30) + 70,
    security: Math.floor(Math.random() * 50) + 50,
  })

  const [activeTab, setActiveTab] = useState("network")
  const [logs, setLogs] = useState<string[]>([
    "System initialized",
    "Connecting to secure network...",
    "Connection established",
    "Running security protocols...",
    "Scanning for vulnerabilities...",
  ])

  const [networkNodes, setNetworkNodes] = useState<
    { id: number; x: number; y: number; connections: number[]; type: string }[]
  >([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Update system status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus((prev) => ({
        cpu: Math.min(100, Math.max(30, prev.cpu + Math.random() * 10 - 5)),
        memory: Math.min(100, Math.max(50, prev.memory + Math.random() * 6 - 3)),
        network: Math.min(100, Math.max(60, prev.network + Math.random() * 8 - 4)),
        security: Math.min(100, Math.max(40, prev.security + Math.random() * 12 - 6)),
      }))

      // Add random logs
      if (Math.random() > 0.7) {
        const newLogs = [
          "Packet analysis complete",
          "Firewall rules updated",
          "New connection detected",
          "Security scan in progress",
          "Encrypted data received",
          "Authentication successful",
          "Suspicious activity detected",
          "System resources optimized",
          "Network traffic analyzed",
          "Vulnerability patched",
        ]

        const randomLog = newLogs[Math.floor(Math.random() * newLogs.length)]
        setLogs((prev) => [...prev.slice(-19), randomLog])
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Initialize network nodes
  useEffect(() => {
    const nodes = []
    const nodeCount = 12

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        connections: [],
        type: ["server", "client", "router", "database"][Math.floor(Math.random() * 4)],
      })
    }

    // Create connections
    for (let i = 0; i < nodeCount; i++) {
      const connectionCount = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < connectionCount; j++) {
        const target = Math.floor(Math.random() * nodeCount)
        if (target !== i && !nodes[i].connections.includes(target)) {
          nodes[i].connections.push(target)
        }
      }
    }

    setNetworkNodes(nodes)
  }, [])

  // Draw network map
  useEffect(() => {
    if (!canvasRef.current || activeTab !== "network") return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections
    ctx.strokeStyle = "rgba(0, 255, 128, 0.3)"
    ctx.lineWidth = 1

    networkNodes.forEach((node) => {
      const x1 = (node.x / 100) * canvas.width
      const y1 = (node.y / 100) * canvas.height

      node.connections.forEach((targetId) => {
        const target = networkNodes.find((n) => n.id === targetId)
        if (target) {
          const x2 = (target.x / 100) * canvas.width
          const y2 = (target.y / 100) * canvas.height

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()

          // Draw moving dots along connections
          const time = Date.now() / 1000
          const position = (time % 2) / 2 // 0 to 1 over 2 seconds

          const dotX = x1 + (x2 - x1) * position
          const dotY = y1 + (y2 - y1) * position

          ctx.fillStyle = "rgba(0, 255, 128, 0.8)"
          ctx.beginPath()
          ctx.arc(dotX, dotY, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    })

    // Draw nodes
    networkNodes.forEach((node) => {
      const x = (node.x / 100) * canvas.width
      const y = (node.y / 100) * canvas.height

      ctx.fillStyle =
        node.type === "server"
          ? "rgba(255, 100, 100, 0.8)"
          : node.type === "database"
            ? "rgba(100, 100, 255, 0.8)"
            : node.type === "router"
              ? "rgba(255, 255, 100, 0.8)"
              : "rgba(100, 255, 100, 0.8)"

      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = "rgba(0, 255, 128, 0.5)"
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      ctx.stroke()

      // Node label
      ctx.fillStyle = "rgba(0, 255, 128, 0.8)"
      ctx.font = "10px monospace"
      ctx.fillText(node.type.substring(0, 3).toUpperCase(), x - 10, y - 10)
    })

    // Animation loop
    const animationFrame = requestAnimationFrame(() => {
      if (canvasRef.current) {
        // This will trigger a re-render and redraw
        setNetworkNodes((prev) => [...prev])
      }
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [networkNodes, activeTab])

  return (
    <div className="h-full flex flex-col bg-black/80 border-l border-green-500/30">
      <div className="border-b border-green-500/30 p-2">
        <div className="flex space-x-1">
          <button
            className={`px-3 py-1 text-xs uppercase ${activeTab === "network" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
            onClick={() => setActiveTab("network")}
          >
            Network
          </button>
          <button
            className={`px-3 py-1 text-xs uppercase ${activeTab === "system" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
            onClick={() => setActiveTab("system")}
          >
            System
          </button>
          <button
            className={`px-3 py-1 text-xs uppercase ${activeTab === "logs" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
            onClick={() => setActiveTab("logs")}
          >
            Logs
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "network" && (
          <div className="h-full relative">
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="absolute top-2 left-2 bg-black/70 border border-green-500/30 p-2 text-xs">
              <GlitchText text="NETWORK TOPOLOGY" className="text-cyan-400 mb-1" />
              <p>Active nodes: {networkNodes.length}</p>
              <p>Connections: {networkNodes.reduce((acc, node) => acc + node.connections.length, 0)}</p>
              <p>Security level: {systemStatus.security}%</p>
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="p-4 h-full">
            <GlitchText text="SYSTEM DIAGNOSTICS" className="text-lg mb-4" />

            <div className="grid gap-4">
              <div className="border border-green-500/30 p-3">
                <div className="flex items-center mb-2">
                  <Cpu className="h-4 w-4 mr-2" />
                  <span className="text-sm">CPU Usage</span>
                  <span className="ml-auto text-sm">{systemStatus.cpu}%</span>
                </div>
                <div className="w-full bg-gray-900 h-2">
                  <div
                    className={`h-full transition-all duration-500 ${systemStatus.cpu > 80 ? "bg-red-500" : "bg-green-500"}`}
                    style={{ width: `${systemStatus.cpu}%` }}
                  ></div>
                </div>
              </div>

              <div className="border border-green-500/30 p-3">
                <div className="flex items-center mb-2">
                  <HardDrive className="h-4 w-4 mr-2" />
                  <span className="text-sm">Memory Usage</span>
                  <span className="ml-auto text-sm">{systemStatus.memory}%</span>
                </div>
                <div className="w-full bg-gray-900 h-2">
                  <div
                    className={`h-full transition-all duration-500 ${systemStatus.memory > 90 ? "bg-red-500" : "bg-green-500"}`}
                    style={{ width: `${systemStatus.memory}%` }}
                  ></div>
                </div>
              </div>

              <div className="border border-green-500/30 p-3">
                <div className="flex items-center mb-2">
                  <Wifi className="h-4 w-4 mr-2" />
                  <span className="text-sm">Network Traffic</span>
                  <span className="ml-auto text-sm">{systemStatus.network}%</span>
                </div>
                <div className="w-full bg-gray-900 h-2">
                  <div
                    className="h-full transition-all duration-500 bg-blue-500"
                    style={{ width: `${systemStatus.network}%` }}
                  ></div>
                </div>
              </div>

              <div className="border border-green-500/30 p-3">
                <div className="flex items-center mb-2">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="text-sm">Security Status</span>
                  <span className="ml-auto text-sm">{systemStatus.security}%</span>
                </div>
                <div className="w-full bg-gray-900 h-2">
                  <div
                    className={`h-full transition-all duration-500 ${
                      systemStatus.security < 50
                        ? "bg-red-500"
                        : systemStatus.security < 70
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${systemStatus.security}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="border border-green-500/30 p-3 flex flex-col items-center justify-center">
                <Server className="h-8 w-8 mb-2 text-cyan-400" />
                <div className="text-center">
                  <div className="text-xs text-green-300">MAIN SERVER</div>
                  <div className="text-xs">STATUS: ONLINE</div>
                </div>
              </div>

              <div className="border border-green-500/30 p-3 flex flex-col items-center justify-center">
                <Lock className={`h-8 w-8 mb-2 ${systemStatus.security > 70 ? "text-green-400" : "text-red-400"}`} />
                <div className="text-center">
                  <div className="text-xs text-green-300">FIREWALL</div>
                  <div className="text-xs">STATUS: {systemStatus.security > 70 ? "SECURE" : "VULNERABLE"}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="p-2 h-full overflow-auto">
            <GlitchText text="SYSTEM LOGS" className="text-sm mb-2" />

            <div className="text-xs space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="flex">
                  <span className="text-green-300 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
