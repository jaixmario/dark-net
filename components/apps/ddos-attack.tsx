"use client"

import { useState, useEffect, useRef } from "react"
import { Globe, Server, Zap, Play, Square, RefreshCw, BarChart2, AlertTriangle, Shield } from "lucide-react"

type Target = {
  id: string
  name: string
  ip: string
  port: number
  type: "website" | "server" | "network" | "iot"
  status: "online" | "offline" | "vulnerable"
}

type Attack = {
  id: string
  name: string
  protocol: "TCP" | "UDP" | "HTTP" | "ICMP" | "SYN" | "DNS" | "NTP" | "SSDP"
  description: string
  power: number // 1-10
  complexity: number // 1-10
}

type AttackLog = {
  id: string
  time: Date
  message: string
  type: "info" | "success" | "error" | "warning"
}

export function DdosAttack() {
  const [targets, setTargets] = useState<Target[]>([
    { id: "t1", name: "E-commerce Website", ip: "104.18.22.164", port: 80, type: "website", status: "online" },
    { id: "t2", name: "Banking Portal", ip: "198.51.100.65", port: 443, type: "website", status: "online" },
    { id: "t3", name: "Cloud Server", ip: "203.0.113.42", port: 22, type: "server", status: "online" },
    { id: "t4", name: "Government Website", ip: "192.0.2.18", port: 80, type: "website", status: "online" },
    { id: "t5", name: "Corporate Network", ip: "172.16.254.1", port: 0, type: "network", status: "online" },
    { id: "t6", name: "IoT Network", ip: "10.0.0.1", port: 80, type: "iot", status: "vulnerable" },
  ])

  const [attacks, setAttacks] = useState<Attack[]>([
    {
      id: "a1",
      name: "SYN Flood",
      protocol: "SYN",
      description: "Sends a flood of TCP/SYN packets, often with a spoofed source IP",
      power: 7,
      complexity: 5,
    },
    {
      id: "a2",
      name: "HTTP Flood",
      protocol: "HTTP",
      description: "Sends a huge amount of HTTP requests to overwhelm the target server",
      power: 6,
      complexity: 3,
    },
    {
      id: "a3",
      name: "UDP Flood",
      protocol: "UDP",
      description: "Sends a large number of UDP packets to random ports",
      power: 8,
      complexity: 4,
    },
    {
      id: "a4",
      name: "ICMP Flood",
      protocol: "ICMP",
      description: "Sends a large number of ICMP Echo Request packets",
      power: 6,
      complexity: 3,
    },
    {
      id: "a5",
      name: "Slowloris",
      protocol: "TCP",
      description: "Keeps many connections open to the target server by sending partial HTTP requests",
      power: 4,
      complexity: 7,
    },
    {
      id: "a6",
      name: "NTP Amplification",
      protocol: "NTP",
      description: "Exploits NTP servers to amplify attack traffic",
      power: 9,
      complexity: 8,
    },
    {
      id: "a7",
      name: "DNS Amplification",
      protocol: "DNS",
      description: "Exploits DNS servers to amplify attack traffic",
      power: 9,
      complexity: 8,
    },
    {
      id: "a8",
      name: "SSDP Reflection",
      protocol: "SSDP",
      description: "Exploits SSDP protocol to reflect and amplify traffic",
      power: 8,
      complexity: 7,
    },
  ])

  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null)
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null)
  const [isAttacking, setIsAttacking] = useState(false)
  const [attackPower, setAttackPower] = useState(50) // 0-100
  const [botnetSize, setBotnetSize] = useState(1000) // number of bots
  const [attackLogs, setAttackLogs] = useState<AttackLog[]>([])
  const [attackStats, setAttackStats] = useState({
    packetsPerSecond: 0,
    bandwidth: 0, // Mbps
    connections: 0,
    targetLoad: 0, // 0-100%
    successRate: 0, // 0-100%
  })
  const [attackDuration, setAttackDuration] = useState(0) // seconds
  const attackInterval = useRef<NodeJS.Timeout | null>(null)
  const [showTargetDetails, setShowTargetDetails] = useState(false)

  // Custom target inputs
  const [customIP, setCustomIP] = useState("")
  const [customPort, setCustomPort] = useState("80")
  const [customName, setCustomName] = useState("")
  const [showAddTarget, setShowAddTarget] = useState(false)

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (attackInterval.current) {
        clearInterval(attackInterval.current)
      }
    }
  }, [])

  // Start attack
  const startAttack = () => {
    if (!selectedTarget || !selectedAttack) return

    setIsAttacking(true)
    setAttackDuration(0)

    // Initial log
    addLog(
      `Starting ${selectedAttack.name} attack on ${selectedTarget.name} (${selectedTarget.ip}:${selectedTarget.port})`,
      "info",
    )
    addLog(`Initializing botnet with ${botnetSize.toLocaleString()} nodes`, "info")
    addLog(`Attack protocol: ${selectedAttack.protocol}`, "info")

    // Reset stats
    setAttackStats({
      packetsPerSecond: 0,
      bandwidth: 0,
      connections: 0,
      targetLoad: 0,
      successRate: 0,
    })

    // Set up interval to update attack progress
    attackInterval.current = setInterval(() => {
      setAttackDuration((prev) => prev + 1)
      updateAttackStats()
    }, 1000)
  }

  // Stop attack
  const stopAttack = () => {
    if (attackInterval.current) {
      clearInterval(attackInterval.current)
      attackInterval.current = null
    }

    setIsAttacking(false)
    addLog(`Attack stopped after ${formatDuration(attackDuration)}`, "warning")

    // Reset target status after a delay
    setTimeout(() => {
      if (selectedTarget) {
        setTargets((prev) =>
          prev.map((t) =>
            t.id === selectedTarget.id ? { ...t, status: t.status === "offline" ? "online" : t.status } : t,
          ),
        )
      }
    }, 5000)
  }

  // Update attack statistics
  const updateAttackStats = () => {
    if (!selectedTarget || !selectedAttack) return

    // Calculate base values based on attack power and botnet size
    const basePPS = selectedAttack.power * botnetSize * (attackPower / 50)
    const baseBandwidth = (selectedAttack.power * botnetSize * (attackPower / 40)) / 1000
    const baseConnections = botnetSize * (attackPower / 60)

    // Add some randomness
    const pps = Math.floor(basePPS * (0.9 + Math.random() * 0.2))
    const bandwidth = baseBandwidth * (0.85 + Math.random() * 0.3)
    const connections = Math.floor(baseConnections * (0.95 + Math.random() * 0.1))

    // Calculate target load based on attack effectiveness
    const maxLoad = selectedAttack.power * (attackPower / 10)
    const targetLoad = Math.min(100, attackStats.targetLoad + (maxLoad / 10) * (0.8 + Math.random() * 0.4))

    // Success rate based on target load
    const successRate = Math.min(100, (targetLoad / 100) * 120)

    setAttackStats({
      packetsPerSecond: pps,
      bandwidth: bandwidth,
      connections: connections,
      targetLoad: targetLoad,
      successRate: successRate,
    })

    // Log events based on attack progress
    logAttackProgress(targetLoad)

    // Check if target is down
    if (targetLoad >= 95 && selectedTarget.status !== "offline") {
      setTargets((prev) => prev.map((t) => (t.id === selectedTarget.id ? { ...t, status: "offline" } : t)))
      addLog(`TARGET DOWN: ${selectedTarget.name} (${selectedTarget.ip}:${selectedTarget.port}) is offline!`, "success")
    }
  }

  // Log attack progress
  const logAttackProgress = (targetLoad: number) => {
    // Only log occasionally to avoid spam
    if (Math.random() > 0.3) return

    if (targetLoad < 30) {
      addLog(`Target responding normally. Increasing attack intensity...`, "info")
    } else if (targetLoad < 60) {
      addLog(`Target showing signs of strain. Response time increasing.`, "info")
    } else if (targetLoad < 90) {
      addLog(`Target struggling to handle traffic. Services degrading.`, "warning")
    } else {
      addLog(`Target severely impacted. Services becoming unavailable.`, "warning")
    }

    // Random technical logs
    const technicalLogs = [
      "TCP handshake failures increasing",
      "Connection timeouts detected",
      "Target dropping packets",
      "Load balancer showing signs of stress",
      "Target firewall actively filtering traffic",
      "WAF detected, adjusting attack pattern",
      "Target implementing rate limiting",
      "Botnet node 192.168.x.x detected and blocked",
      "Amplification factor: 12.4x",
      "Packet fragmentation enabled to bypass filters",
    ]

    if (Math.random() > 0.7) {
      addLog(technicalLogs[Math.floor(Math.random() * technicalLogs.length)], "info")
    }
  }

  // Add log entry
  const addLog = (message: string, type: "info" | "success" | "error" | "warning") => {
    const newLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      time: new Date(),
      message,
      type,
    }

    setAttackLogs((prev) => [newLog, ...prev].slice(0, 100)) // Keep only the last 100 logs
  }

  // Format duration in seconds to mm:ss
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "online":
        return "text-green-500"
      case "offline":
        return "text-red-500"
      case "vulnerable":
        return "text-yellow-500"
      default:
        return ""
    }
  }

  // Add custom target
  const addCustomTarget = () => {
    if (!customIP || !customPort) return

    const newTarget: Target = {
      id: `t-${Date.now()}`,
      name: customName || `Target ${customIP}`,
      ip: customIP,
      port: Number.parseInt(customPort),
      type: "server",
      status: "online",
    }

    setTargets((prev) => [...prev, newTarget])
    setSelectedTarget(newTarget)
    setShowAddTarget(false)

    // Reset form
    setCustomIP("")
    setCustomPort("80")
    setCustomName("")

    addLog(`Added new target: ${newTarget.name} (${newTarget.ip}:${newTarget.port})`, "info")
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="text-lg font-bold flex items-center">
          <Zap className="h-5 w-5 mr-2 text-red-500" />
          <span>DDoS Attack Tool</span>
        </div>

        <div className="flex items-center space-x-2">
          {isAttacking ? (
            <button
              className="bg-red-900/50 border border-red-500 px-4 py-2 text-sm hover:bg-red-900/70 flex items-center text-red-400"
              onClick={stopAttack}
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Attack
            </button>
          ) : (
            <button
              className="bg-green-900/50 border border-green-500 px-4 py-2 text-sm hover:bg-green-900/70 flex items-center"
              onClick={startAttack}
              disabled={!selectedTarget || !selectedAttack}
            >
              <Play className="h-4 w-4 mr-2" />
              Launch Attack
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden">
        {/* Left Panel - Configuration */}
        <div className="w-full md:w-1/3 flex flex-col gap-3 overflow-auto">
          {/* Target Selection */}
          <div className="border border-green-500/30 bg-black/80">
            <div className="bg-green-900/20 p-2 border-b border-green-500/30 font-bold text-sm flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Target Selection
              </div>
              <button
                className="text-xs bg-green-900/30 px-2 py-0.5 rounded hover:bg-green-900/50"
                onClick={() => setShowAddTarget(!showAddTarget)}
              >
                {showAddTarget ? "Cancel" : "Add Target"}
              </button>
            </div>

            {showAddTarget && (
              <div className="p-2 border-b border-green-500/30">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-xs mb-1">IP Address:</label>
                    <input
                      type="text"
                      value={customIP}
                      onChange={(e) => setCustomIP(e.target.value)}
                      placeholder="192.168.1.1"
                      className="w-full bg-gray-900 border border-green-500/50 p-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Port:</label>
                    <input
                      type="text"
                      value={customPort}
                      onChange={(e) => setCustomPort(e.target.value)}
                      placeholder="80"
                      className="w-full bg-gray-900 border border-green-500/50 p-1 text-xs"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-xs mb-1">Name (optional):</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Target name"
                    className="w-full bg-gray-900 border border-green-500/50 p-1 text-xs"
                  />
                </div>
                <button
                  className="w-full bg-green-900/30 border border-green-500/50 p-1 text-xs hover:bg-green-900/50"
                  onClick={addCustomTarget}
                >
                  Add Target
                </button>
              </div>
            )}

            <div className="p-2 space-y-2 max-h-[200px] overflow-auto">
              {targets.map((target) => (
                <div
                  key={target.id}
                  className={`p-2 border cursor-pointer hover:bg-green-900/20 ${
                    selectedTarget?.id === target.id ? "border-green-500 bg-green-900/30" : "border-green-500/30"
                  }`}
                  onClick={() => {
                    setSelectedTarget(target)
                    setShowTargetDetails(true)
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {target.type === "website" ? (
                        <Globe className="h-4 w-4 mr-2" />
                      ) : target.type === "server" ? (
                        <Server className="h-4 w-4 mr-2" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2" />
                      )}
                      <span className="text-sm">{target.name}</span>
                    </div>
                    <span className={`text-xs ${getStatusColor(target.status)}`}>{target.status.toUpperCase()}</span>
                  </div>
                  <div className="text-xs text-green-500/70 mt-1">
                    {target.ip}:{target.port || "All"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attack Method */}
          <div className="border border-green-500/30 bg-black/80">
            <div className="bg-green-900/20 p-2 border-b border-green-500/30 font-bold text-sm flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Attack Method
            </div>
            <div className="p-2 space-y-2 max-h-[200px] overflow-auto">
              {attacks.map((attack) => (
                <div
                  key={attack.id}
                  className={`p-2 border cursor-pointer hover:bg-green-900/20 ${
                    selectedAttack?.id === attack.id ? "border-green-500 bg-green-900/30" : "border-green-500/30"
                  }`}
                  onClick={() => setSelectedAttack(attack)}
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-bold">{attack.name}</span>
                    <span className="text-xs bg-gray-900/70 px-2 py-0.5 rounded">{attack.protocol}</span>
                  </div>
                  <div className="text-xs text-green-500/70 mt-1">{attack.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Attack Configuration */}
          <div className="border border-green-500/30 bg-black/80">
            <div className="bg-green-900/20 p-2 border-b border-green-500/30 font-bold text-sm flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Attack Configuration
            </div>
            <div className="p-3 space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs">Attack Power: {attackPower}%</label>
                  <span className="text-xs">{attackPower < 30 ? "Low" : attackPower < 70 ? "Medium" : "High"}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={attackPower}
                  onChange={(e) => setAttackPower(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer"
                  disabled={isAttacking}
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs">Botnet Size: {formatNumber(botnetSize)} nodes</label>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={botnetSize}
                  onChange={(e) => setBotnetSize(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer"
                  disabled={isAttacking}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Panel - Attack Visualization & Stats */}
        <div className="w-full md:w-1/3 flex flex-col gap-3 overflow-auto">
          {/* Attack Visualization */}
          <div className="border border-green-500/30 bg-black/80 flex-1">
            <div className="bg-green-900/20 p-2 border-b border-green-500/30 font-bold text-sm flex items-center justify-between">
              <div className="flex items-center">
                <BarChart2 className="h-4 w-4 mr-2" />
                Attack Status
              </div>
              {isAttacking && (
                <div className="text-xs flex items-center">
                  <span className="animate-pulse text-red-400 mr-1">●</span>
                  <span>LIVE</span>
                  <span className="ml-2">{formatDuration(attackDuration)}</span>
                </div>
              )}
            </div>
            <div className="p-3 h-[300px] flex flex-col justify-between">
              {isAttacking ? (
                <>
                  {/* Target visualization */}
                  <div className="flex-1 flex items-center justify-center relative">
                    {/* Botnet nodes */}
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-red-500 animate-ping"
                        style={{
                          left: `${10 + Math.random() * 80}%`,
                          top: `${10 + Math.random() * 80}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${1 + Math.random() * 2}s`,
                        }}
                      ></div>
                    ))}

                    {/* Target server */}
                    <div className="relative">
                      <div
                        className={`w-20 h-20 border-4 ${
                          attackStats.targetLoad > 90
                            ? "border-red-500 animate-pulse"
                            : attackStats.targetLoad > 70
                              ? "border-yellow-500"
                              : "border-green-500"
                        } rounded-full flex items-center justify-center`}
                      >
                        <Server className="h-8 w-8" />
                      </div>

                      {/* Attack lines */}
                      {isAttacking &&
                        Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-full h-0.5 bg-red-500 animate-ping origin-center"
                            style={{
                              top: "50%",
                              left: "50%",
                              transform: `rotate(${i * 45}deg)`,
                              animationDelay: `${Math.random() * 2}s`,
                              animationDuration: `${0.5 + Math.random()}s`,
                            }}
                          ></div>
                        ))}

                      {/* Target load indicator */}
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">
                        Load: {Math.round(attackStats.targetLoad)}%
                      </div>
                    </div>
                  </div>

                  {/* Attack stats */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                      <div className="text-xs text-green-500/70">Packets/sec</div>
                      <div className="text-lg font-mono">{formatNumber(attackStats.packetsPerSecond)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-green-500/70">Bandwidth</div>
                      <div className="text-lg font-mono">{attackStats.bandwidth.toFixed(2)} Gbps</div>
                    </div>
                    <div>
                      <div className="text-xs text-green-500/70">Connections</div>
                      <div className="text-lg font-mono">{formatNumber(attackStats.connections)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-green-500/70">Success Rate</div>
                      <div className="text-lg font-mono">{Math.round(attackStats.successRate)}%</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <AlertTriangle className="h-12 w-12 mb-4 text-yellow-500" />
                  <p className="text-sm mb-2">No active attack</p>
                  <p className="text-xs text-green-500/70">
                    Select a target and attack method, then click Launch Attack
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Target Details */}
          {showTargetDetails && selectedTarget && (
            <div className="border border-green-500/30 bg-black/80">
              <div className="bg-green-900/20 p-2 border-b border-green-500/30 font-bold text-sm flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Target Details
                </div>
                <button className="text-xs" onClick={() => setShowTargetDetails(false)}>
                  ×
                </button>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-xs text-green-500/70">Name:</div>
                    <div>{selectedTarget.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-green-500/70">IP Address:</div>
                    <div>{selectedTarget.ip}</div>
                  </div>
                  <div>
                    <div className="text-xs text-green-500/70">Port:</div>
                    <div>{selectedTarget.port || "All Ports"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-green-500/70">Status:</div>
                    <div className={getStatusColor(selectedTarget.status)}>{selectedTarget.status.toUpperCase()}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-green-500/70 mb-1">Open Ports:</div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    {selectedTarget.port ? (
                      <div className="p-1 border border-green-500/20">
                        {selectedTarget.port} ({getServiceName(selectedTarget.port)})
                      </div>
                    ) : (
                      <>
                        <div className="p-1 border border-green-500/20">22 (SSH)</div>
                        <div className="p-1 border border-green-500/20">80 (HTTP)</div>
                        <div className="p-1 border border-green-500/20">443 (HTTPS)</div>
                        {selectedTarget.type === "server" && (
                          <>
                            <div className="p-1 border border-green-500/20">21 (FTP)</div>
                            <div className="p-1 border border-green-500/20">3306 (MySQL)</div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {selectedTarget.status === "vulnerable" && (
                  <div className="mt-3 p-2 border border-yellow-500/30 bg-yellow-900/10 text-yellow-500 text-xs">
                    <div className="flex items-center mb-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      <span className="font-bold">Vulnerabilities Detected</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      <li>Outdated firewall configuration</li>
                      <li>No DDoS protection</li>
                      <li>Limited bandwidth capacity</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Logs */}
        <div className="w-full md:w-1/3 border border-green-500/30 bg-black/80 overflow-hidden flex flex-col">
          <div className="bg-green-900/20 p-2 border-b border-green-500/30 font-bold text-sm flex items-center">
            <Terminal className="h-4 w-4 mr-2" />
            Attack Logs
          </div>
          <div className="p-2 flex-1 overflow-auto">
            {attackLogs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-green-500/50 text-sm">
                <div>
                  <RefreshCw className="h-8 w-8 mx-auto mb-2" />
                  <p>No attack logs yet</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1 text-xs font-mono">
                {attackLogs.map((log) => (
                  <div key={log.id} className="flex">
                    <span className="text-green-500/70 mr-2">[{log.time.toLocaleTimeString()}]</span>
                    <span
                      className={
                        log.type === "success"
                          ? "text-green-400"
                          : log.type === "error"
                            ? "text-red-400"
                            : log.type === "warning"
                              ? "text-yellow-400"
                              : ""
                      }
                    >
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get service name from port
function getServiceName(port: number): string {
  const commonPorts: Record<number, string> = {
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    465: "SMTPS",
    587: "SMTP",
    993: "IMAPS",
    995: "POP3S",
    3306: "MySQL",
    3389: "RDP",
    5432: "PostgreSQL",
    8080: "HTTP-ALT",
    8443: "HTTPS-ALT",
  }

  return commonPorts[port] || "Unknown"
}

// Missing components
function Settings(props) {
  return (
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function Terminal(props) {
  return (
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
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  )
}
