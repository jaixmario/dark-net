"use client"

import { useState, useEffect } from "react"
import { Cpu, MemoryStickIcon as Memory, HardDrive, Zap, Thermometer, Fan, Wifi, Server } from "lucide-react"

// Add this after the imports
export const systemSpecsData = {
  system: {
    manufacturer: "Custom Build",
    model: "High-End Workstation",
    os: "Linux 6.4.0-x86_64",
    kernel: "6.4.0-1-amd64",
    hostname: "hackstation",
    uptime: "3 days, 7 hours, 22 minutes",
  },
  cpu: {
    model: "AMD Ryzen 9 7950X",
    cores: 16,
    threads: 32,
    baseSpeed: "4.5 GHz",
    boostSpeed: "5.7 GHz",
    cache: "64 MB L3",
    architecture: "Zen 4",
    socket: "AM5",
  },
  memory: {
    total: 128, // GB
    type: "DDR5",
    speed: "6000 MHz",
    channels: 4,
    modules: [
      { slot: "DIMM A1", size: 32, speed: "6000 MHz", manufacturer: "G.Skill" },
      { slot: "DIMM A2", size: 32, speed: "6000 MHz", manufacturer: "G.Skill" },
      { slot: "DIMM B1", size: 32, speed: "6000 MHz", manufacturer: "G.Skill" },
      { slot: "DIMM B2", size: 32, speed: "6000 MHz", manufacturer: "G.Skill" },
    ],
  },
  storage: [
    { device: "/dev/nvme0n1", type: "NVMe SSD", model: "Samsung 990 Pro", size: 2000, interface: "PCIe 4.0 x4" },
    { device: "/dev/nvme1n1", type: "NVMe SSD", model: "Samsung 990 Pro", size: 2000, interface: "PCIe 4.0 x4" },
    { device: "/dev/sda", type: "SATA SSD", model: "Samsung 870 EVO", size: 4000, interface: "SATA III" },
    { device: "/dev/sdb", type: "HDD", model: "WD Black", size: 8000, interface: "SATA III" },
  ],
  gpu: {
    model: "NVIDIA GeForce RTX 4090",
    memory: "24 GB GDDR6X",
    driver: "535.104.05",
    interface: "PCIe 4.0 x16",
    clocks: {
      core: "2235 MHz",
      memory: "21000 MHz",
    },
  },
  network: [
    { interface: "eth0", type: "Ethernet", speed: "10 Gbps", mac: "00:1A:2B:3C:4D:5E", ip: "192.168.1.100" },
    { interface: "wlan0", type: "Wi-Fi 6E", speed: "2.4 Gbps", mac: "00:5E:4D:3C:2B:1A", ip: "192.168.1.101" },
  ],
  motherboard: {
    manufacturer: "ASUS",
    model: "ROG Crosshair X670E Hero",
    chipset: "AMD X670E",
    biosVersion: "1601",
    biosDate: "2023-04-15",
  },
}

export function SystemSpecs() {
  const [activeTab, setActiveTab] = useState<"overview" | "cpu" | "memory" | "storage" | "gpu" | "network">("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [specs, setSpecs] = useState<any>(null)
  const [temperatures, setTemperatures] = useState<{ [key: string]: number }>({})
  const [fanSpeeds, setFanSpeeds] = useState<{ [key: string]: number }>({})
  const [cpuUsage, setCpuUsage] = useState<number[]>(Array(8).fill(0))
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [gpuUsage, setGpuUsage] = useState(0)
  const [diskActivity, setDiskActivity] = useState<{ [key: string]: number }>({})

  // Initialize with fake data
  useEffect(() => {
    loadSystemSpecs()

    // Set up periodic updates
    const interval = setInterval(() => {
      updateMetrics()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Now modify the loadSystemSpecs function to use this shared data:
  const loadSystemSpecs = () => {
    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      setSpecs(systemSpecsData)

      // Initialize temperatures
      setTemperatures({
        CPU: 65,
        "CPU Core 1": 62,
        "CPU Core 2": 64,
        "CPU Core 3": 63,
        "CPU Core 4": 65,
        "CPU Core 5": 61,
        "CPU Core 6": 66,
        "CPU Core 7": 63,
        "CPU Core 8": 64,
        GPU: 72,
        "M.2 SSD": 52,
        Motherboard: 38,
      })

      // Initialize fan speeds
      setFanSpeeds({
        "CPU Fan": 1200,
        "Chassis Fan 1": 800,
        "Chassis Fan 2": 850,
        "Chassis Fan 3": 820,
        "GPU Fan 1": 1500,
        "GPU Fan 2": 1450,
        "GPU Fan 3": 1480,
      })

      // Initialize disk activity
      setDiskActivity({
        "/dev/nvme0n1": 15,
        "/dev/nvme1n1": 5,
        "/dev/sda": 2,
        "/dev/sdb": 8,
      })

      // Initialize CPU usage
      setCpuUsage(
        Array(16)
          .fill(0)
          .map(() => Math.random() * 100),
      )

      // Initialize memory usage
      setMemoryUsage(Math.random() * 40 + 20)

      // Initialize GPU usage
      setGpuUsage(Math.random() * 60 + 10)

      setIsLoading(false)
    }, 1000)
  }

  const updateMetrics = () => {
    // Update temperatures with small random fluctuations
    setTemperatures((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((key) => {
        updated[key] = Math.max(30, Math.min(95, updated[key] + (Math.random() * 4 - 2)))
      })
      return updated
    })

    // Update fan speeds
    setFanSpeeds((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((key) => {
        updated[key] = Math.max(500, Math.min(2000, updated[key] + (Math.random() * 100 - 50)))
      })
      return updated
    })

    // Update CPU usage
    setCpuUsage((prev) => prev.map(() => Math.random() * 100))

    // Update memory usage
    setMemoryUsage((prev) => Math.max(10, Math.min(90, prev + (Math.random() * 10 - 5))))

    // Update GPU usage
    setGpuUsage((prev) => Math.max(5, Math.min(99, prev + (Math.random() * 15 - 7.5))))

    // Update disk activity
    setDiskActivity((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((key) => {
        updated[key] = Math.max(0, Math.min(100, updated[key] + (Math.random() * 10 - 5)))
      })
      return updated
    })
  }

  const formatStorage = (gb: number): string => {
    if (gb < 1000) return `${gb} GB`
    return `${(gb / 1000).toFixed(1)} TB`
  }

  // Render a gauge chart
  const renderGauge = (value: number, label: string, color: string, unit = "%") => {
    const angle = (value / 100) * 180

    return (
      <div className="flex flex-col items-center mb-4">
        <div className="relative w-32 h-16 overflow-hidden">
          <div className="absolute w-32 h-32 bg-gray-900 rounded-full top-0"></div>
          <div
            className={`absolute w-32 h-32 rounded-full top-0 ${color}`}
            style={{
              clipPath: `polygon(16px 16px, 16px 16px, 16px 32px, ${16 + Math.cos(((angle - 90) * Math.PI) / 180) * 16}px ${16 + Math.sin(((angle - 90) * Math.PI) / 180) * 16}px)`,
              transformOrigin: "16px 16px",
              transform: "rotate(0deg)",
            }}
          ></div>
          <div className="absolute w-full text-center bottom-0 text-xs font-bold">
            {value.toFixed(1)}
            {unit}
          </div>
        </div>
        <div className="text-xs mt-1">{label}</div>
      </div>
    )
  }

  // Render a bar chart for CPU cores
  const renderCpuCores = () => {
    return (
      <div className="grid grid-cols-4 gap-2">
        {cpuUsage.map((usage, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Core {index + 1}</span>
              <span>{usage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-900 h-2">
              <div
                className={`h-full ${usage > 80 ? "bg-red-500" : usage > 60 ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${usage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      {/* Tabs */}
      <div className="mb-3 flex space-x-1 overflow-x-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-transparent">
        <button
          className={`px-3 py-1 text-xs uppercase whitespace-nowrap ${activeTab === "overview" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-3 py-1 text-xs uppercase whitespace-nowrap ${activeTab === "cpu" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
          onClick={() => setActiveTab("cpu")}
        >
          CPU
        </button>
        <button
          className={`px-3 py-1 text-xs uppercase whitespace-nowrap ${activeTab === "memory" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
          onClick={() => setActiveTab("memory")}
        >
          Memory
        </button>
        <button
          className={`px-3 py-1 text-xs uppercase whitespace-nowrap ${activeTab === "storage" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
          onClick={() => setActiveTab("storage")}
        >
          Storage
        </button>
        <button
          className={`px-3 py-1 text-xs uppercase whitespace-nowrap ${activeTab === "gpu" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
          onClick={() => setActiveTab("gpu")}
        >
          GPU
        </button>
        <button
          className={`px-3 py-1 text-xs uppercase whitespace-nowrap ${activeTab === "network" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
          onClick={() => setActiveTab("network")}
        >
          Network
        </button>
      </div>

      <div className="flex-1 border border-green-500/30 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin mr-2">
              <Zap className="h-5 w-5" />
            </div>
            <span>Loading system information...</span>
          </div>
        ) : (
          <div className="p-3">
            {activeTab === "overview" && specs && (
              <div>
                <div className="text-lg font-bold mb-4">{specs.system.model}</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-bold mb-2 flex items-center">
                      <Server className="h-4 w-4 mr-1" />
                      System Information
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div>
                        <div className="text-green-500/70">Manufacturer:</div>
                        <div>{specs.system.manufacturer}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Model:</div>
                        <div>{specs.system.model}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Operating System:</div>
                        <div>{specs.system.os}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Kernel:</div>
                        <div>{specs.system.kernel}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Hostname:</div>
                        <div>{specs.system.hostname}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Uptime:</div>
                        <div>{specs.system.uptime}</div>
                      </div>
                    </div>

                    <div className="text-sm font-bold mb-2 flex items-center">
                      <Cpu className="h-4 w-4 mr-1" />
                      Processor
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div>
                        <div className="text-green-500/70">Model:</div>
                        <div>{specs.cpu.model}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Cores/Threads:</div>
                        <div>
                          {specs.cpu.cores} / {specs.cpu.threads}
                        </div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Base Speed:</div>
                        <div>{specs.cpu.baseSpeed}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Boost Speed:</div>
                        <div>{specs.cpu.boostSpeed}</div>
                      </div>
                    </div>

                    <div className="text-sm font-bold mb-2 flex items-center">
                      <Memory className="h-4 w-4 mr-1" />
                      Memory
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div>
                        <div className="text-green-500/70">Total:</div>
                        <div>{specs.memory.total} GB</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Type:</div>
                        <div>{specs.memory.type}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Speed:</div>
                        <div>{specs.memory.speed}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Channels:</div>
                        <div>{specs.memory.channels}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold mb-2 flex items-center">
                      <Zap className="h-4 w-4 mr-1" />
                      Graphics
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div>
                        <div className="text-green-500/70">Model:</div>
                        <div>{specs.gpu.model}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Memory:</div>
                        <div>{specs.gpu.memory}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Driver:</div>
                        <div>{specs.gpu.driver}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Interface:</div>
                        <div>{specs.gpu.interface}</div>
                      </div>
                    </div>

                    <div className="text-sm font-bold mb-2 flex items-center">
                      <HardDrive className="h-4 w-4 mr-1" />
                      Storage
                    </div>
                    <div className="space-y-2 text-xs mb-4">
                      {specs.storage.map((drive: any, index: number) => (
                        <div key={index} className="grid grid-cols-3 gap-2">
                          <div>{drive.model}</div>
                          <div>{formatStorage(drive.size)}</div>
                          <div>{drive.type}</div>
                        </div>
                      ))}
                    </div>

                    <div className="text-sm font-bold mb-2 flex items-center">
                      <Wifi className="h-4 w-4 mr-1" />
                      Network
                    </div>
                    <div className="space-y-2 text-xs mb-4">
                      {specs.network.map((net: any, index: number) => (
                        <div key={index} className="grid grid-cols-3 gap-2">
                          <div>{net.type}</div>
                          <div>{net.speed}</div>
                          <div>{net.ip}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-bold mb-2 flex items-center">
                    <Thermometer className="h-4 w-4 mr-1" />
                    Temperatures & Usage
                  </div>
                  <div className="flex flex-wrap justify-around">
                    {renderGauge(cpuUsage.reduce((a, b) => a + b, 0) / cpuUsage.length, "CPU Usage", "bg-green-500")}
                    {renderGauge(memoryUsage, "Memory Usage", "bg-blue-500")}
                    {renderGauge(gpuUsage, "GPU Usage", "bg-purple-500")}
                    {renderGauge(temperatures["CPU"], "CPU Temp", "bg-red-500", "°C")}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "cpu" && specs && (
              <div>
                <div className="text-lg font-bold mb-4">{specs.cpu.model}</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-bold mb-2">Specifications</div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div>
                        <div className="text-green-500/70">Model:</div>
                        <div>{specs.cpu.model}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Architecture:</div>
                        <div>{specs.cpu.architecture}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Cores:</div>
                        <div>{specs.cpu.cores}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Threads:</div>
                        <div>{specs.cpu.threads}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Base Speed:</div>
                        <div>{specs.cpu.baseSpeed}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Boost Speed:</div>
                        <div>{specs.cpu.boostSpeed}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Cache:</div>
                        <div>{specs.cpu.cache}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Socket:</div>
                        <div>{specs.cpu.socket}</div>
                      </div>
                    </div>

                    <div className="text-sm font-bold mb-2">Temperatures</div>
                    <div className="space-y-2 text-xs mb-4">
                      {Object.entries(temperatures)
                        .filter(([key]) => key.includes("CPU"))
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span>{key}:</span>
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-900 h-2 mr-2">
                                <div
                                  className={`h-full ${value > 80 ? "bg-red-500" : value > 70 ? "bg-yellow-500" : "bg-green-500"}`}
                                  style={{ width: `${(value / 100) * 100}%` }}
                                ></div>
                              </div>
                              <span
                                className={
                                  value > 80 ? "text-red-500" : value > 70 ? "text-yellow-500" : "text-green-500"
                                }
                              >
                                {value.toFixed(1)}°C
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="text-sm font-bold mb-2">Fan Speeds</div>
                    <div className="space-y-2 text-xs mb-4">
                      {Object.entries(fanSpeeds)
                        .filter(([key]) => key.includes("CPU") || key.includes("Chassis"))
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span>{key}:</span>
                            <div className="flex items-center">
                              <Fan
                                className="h-3 w-3 mr-1 animate-spin"
                                style={{ animationDuration: `${3000 / (value / 1000)}ms` }}
                              />
                              <span>{value.toFixed(0)} RPM</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold mb-2">CPU Usage</div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Total CPU Usage:</span>
                        <span>{(cpuUsage.reduce((a, b) => a + b, 0) / cpuUsage.length).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-900 h-2 mb-4">
                        <div
                          className={`h-full ${cpuUsage.reduce((a, b) => a + b, 0) / cpuUsage.length > 80 ? "bg-red-500" : cpuUsage.reduce((a, b) => a + b, 0) / cpuUsage.length > 60 ? "bg-yellow-500" : "bg-green-500"}`}
                          style={{ width: `${cpuUsage.reduce((a, b) => a + b, 0) / cpuUsage.length}%` }}
                        ></div>
                      </div>

                      {renderCpuCores()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "memory" && specs && (
              <div>
                <div className="text-lg font-bold mb-4">
                  {specs.memory.total} GB {specs.memory.type} @ {specs.memory.speed}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-bold mb-2">Memory Usage</div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Used: {((specs.memory.total * memoryUsage) / 100).toFixed(1)} GB</span>
                        <span>Free: {(specs.memory.total * (1 - memoryUsage / 100)).toFixed(1)} GB</span>
                      </div>
                      <div className="w-full bg-gray-900 h-4 mb-2">
                        <div
                          className={`h-full ${memoryUsage > 80 ? "bg-red-500" : memoryUsage > 60 ? "bg-yellow-500" : "bg-blue-500"}`}
                          style={{ width: `${memoryUsage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-center">
                        {memoryUsage.toFixed(1)}% of {specs.memory.total} GB
                      </div>
                    </div>

                    <div className="text-sm font-bold mb-2">Memory Specifications</div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div>
                        <div className="text-green-500/70">Total Size:</div>
                        <div>{specs.memory.total} GB</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Type:</div>
                        <div>{specs.memory.type}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Speed:</div>
                        <div>{specs.memory.speed}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Channels:</div>
                        <div>{specs.memory.channels}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold mb-2">Memory Modules</div>
                    <div className="space-y-2 text-xs mb-4">
                      {specs.memory.modules.map((module: any, index: number) => (
                        <div key={index} className="border border-green-500/30 p-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="text-green-500/70">Slot:</div>
                              <div>{module.slot}</div>
                            </div>
                            <div>
                              <div className="text-green-500/70">Size:</div>
                              <div>{module.size} GB</div>
                            </div>
                            <div>
                              <div className="text-green-500/70">Speed:</div>
                              <div>{module.speed}</div>
                            </div>
                            <div>
                              <div className="text-green-500/70">Manufacturer:</div>
                              <div>{module.manufacturer}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "storage" && specs && (
              <div>
                <div className="text-lg font-bold mb-4">Storage Devices</div>

                <div className="space-y-4">
                  {specs.storage.map((drive: any, index: number) => (
                    <div key={index} className="border border-green-500/30 p-3">
                      <div className="flex items-center mb-2">
                        <HardDrive className="h-4 w-4 mr-2" />
                        <div className="text-sm font-bold">
                          {drive.model} ({formatStorage(drive.size)})
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-3">
                        <div>
                          <div className="text-green-500/70">Device:</div>
                          <div>{drive.device}</div>
                        </div>
                        <div>
                          <div className="text-green-500/70">Type:</div>
                          <div>{drive.type}</div>
                        </div>
                        <div>
                          <div className="text-green-500/70">Size:</div>
                          <div>{formatStorage(drive.size)}</div>
                        </div>
                        <div>
                          <div className="text-green-500/70">Interface:</div>
                          <div>{drive.interface}</div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Activity:</span>
                          <span>{diskActivity[drive.device]}%</span>
                        </div>
                        <div className="w-full bg-gray-900 h-2">
                          <div
                            className={`h-full ${diskActivity[drive.device] > 80 ? "bg-red-500" : diskActivity[drive.device] > 50 ? "bg-yellow-500" : "bg-purple-500"}`}
                            style={{ width: `${diskActivity[drive.device]}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "gpu" && specs && (
              <div>
                <div className="text-lg font-bold mb-4">{specs.gpu.model}</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-bold mb-2">GPU Specifications</div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div>
                        <div className="text-green-500/70">Model:</div>
                        <div>{specs.gpu.model}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Memory:</div>
                        <div>{specs.gpu.memory}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Driver Version:</div>
                        <div>{specs.gpu.driver}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Interface:</div>
                        <div>{specs.gpu.interface}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Core Clock:</div>
                        <div>{specs.gpu.clocks.core}</div>
                      </div>
                      <div>
                        <div className="text-green-500/70">Memory Clock:</div>
                        <div>{specs.gpu.clocks.memory}</div>
                      </div>
                    </div>

                    <div className="text-sm font-bold mb-2">Temperatures</div>
                    <div className="space-y-2 text-xs mb-4">
                      <div className="flex items-center justify-between">
                        <span>GPU Temperature:</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-900 h-2 mr-2">
                            <div
                              className={`h-full ${temperatures["GPU"] > 80 ? "bg-red-500" : temperatures["GPU"] > 70 ? "bg-yellow-500" : "bg-green-500"}`}
                              style={{ width: `${(temperatures["GPU"] / 100) * 100}%` }}
                            ></div>
                          </div>
                          <span
                            className={
                              temperatures["GPU"] > 80
                                ? "text-red-500"
                                : temperatures["GPU"] > 70
                                  ? "text-yellow-500"
                                  : "text-green-500"
                            }
                          >
                            {temperatures["GPU"].toFixed(1)}°C
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm font-bold mb-2">Fan Speeds</div>
                    <div className="space-y-2 text-xs mb-4">
                      {Object.entries(fanSpeeds)
                        .filter(([key]) => key.includes("GPU"))
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span>{key}:</span>
                            <div className="flex items-center">
                              <Fan
                                className="h-3 w-3 mr-1 animate-spin"
                                style={{ animationDuration: `${3000 / (value / 1000)}ms` }}
                              />
                              <span>{value.toFixed(0)} RPM</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold mb-2">GPU Usage</div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>GPU Utilization:</span>
                        <span>{gpuUsage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-900 h-4 mb-2">
                        <div
                          className={`h-full ${gpuUsage > 80 ? "bg-red-500" : gpuUsage > 60 ? "bg-yellow-500" : "bg-purple-500"}`}
                          style={{ width: `${gpuUsage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-sm font-bold mb-2">Memory Usage</div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>VRAM Usage:</span>
                        <span>{((24 * gpuUsage) / 100).toFixed(1)} GB / 24 GB</span>
                      </div>
                      <div className="w-full bg-gray-900 h-4 mb-2">
                        <div className="h-full bg-blue-500" style={{ width: `${gpuUsage}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "network" && specs && (
              <div>
                <div className="text-lg font-bold mb-4">Network Interfaces</div>

                <div className="space-y-4">
                  {specs.network.map((net: any, index: number) => (
                    <div key={index} className="border border-green-500/30 p-3">
                      <div className="flex items-center mb-2">
                        {net.type === "Ethernet" ? (
                          <Server className="h-4 w-4 mr-2" />
                        ) : (
                          <Wifi className="h-4 w-4 mr-2" />
                        )}
                        <div className="text-sm font-bold">
                          {net.interface} ({net.type})
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-3">
                        <div>
                          <div className="text-green-500/70">Interface:</div>
                          <div>{net.interface}</div>
                        </div>
                        <div>
                          <div className="text-green-500/70">Type:</div>
                          <div>{net.type}</div>
                        </div>
                        <div>
                          <div className="text-green-500/70">Speed:</div>
                          <div>{net.speed}</div>
                        </div>
                        <div>
                          <div className="text-green-500/70">MAC Address:</div>
                          <div>{net.mac}</div>
                        </div>
                        <div>
                          <div className="text-green-500/70">IP Address:</div>
                          <div>{net.ip}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs mb-1">Download Speed</div>
                          <div className="w-full bg-gray-900 h-2 mb-1">
                            <div className="h-full bg-blue-500" style={{ width: `${Math.random() * 80 + 10}%` }}></div>
                          </div>
                          <div className="text-xs text-right">{(Math.random() * 500 + 100).toFixed(1)} Mbps</div>
                        </div>

                        <div>
                          <div className="text-xs mb-1">Upload Speed</div>
                          <div className="w-full bg-gray-900 h-2 mb-1">
                            <div className="h-full bg-green-500" style={{ width: `${Math.random() * 60 + 10}%` }}></div>
                          </div>
                          <div className="text-xs text-right">{(Math.random() * 100 + 50).toFixed(1)} Mbps</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
