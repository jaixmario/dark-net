"use client"

import { useState, useEffect } from "react"
import { RefreshCw, X, Activity, Cpu, HardDrive, MemoryStickIcon as Memory, BarChart2 } from "lucide-react"

// Import the shared system specs data at the top of the file
import { systemSpecsData } from "./system-specs"

type Process = {
  pid: number
  name: string
  user: string
  cpu: number
  memory: number
  status: "running" | "sleeping" | "stopped" | "zombie"
  started: string
  command: string
}

type SystemInfo = {
  hostname: string
  os: string
  kernel: string
  uptime: string
  cpuModel: string
  cpuCores: number
  cpuThreads: number
  cpuSpeed: string
  totalMemory: number
  totalSwap: number
  totalDisk: number
  usedDisk: number
}

export function TaskManager() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
  const [sortBy, setSortBy] = useState<keyof Process>("cpu")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"processes" | "performance" | "services">("processes")
  const [searchQuery, setSearchQuery] = useState("")
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [cpuUsage, setCpuUsage] = useState<number[]>([])
  const [memoryUsage, setMemoryUsage] = useState<number[]>([])
  const [diskUsage, setDiskUsage] = useState<number[]>([])
  const [networkUsage, setNetworkUsage] = useState<number[]>([])
  const [diskActivity, setDiskActivity] = useState<{ [key: string]: number }>({})

  // Initialize with fake data
  useEffect(() => {
    refreshData()

    // Set up periodic refresh
    const interval = setInterval(() => {
      updateMetrics()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const refreshData = () => {
    setIsRefreshing(true)

    // Simulate loading delay
    setTimeout(() => {
      generateFakeProcesses()
      generateFakeSystemInfo()
      setIsRefreshing(false)
    }, 500)
  }

  const updateMetrics = () => {
    // Update CPU usage
    setCpuUsage((prev) => {
      const newValue = Math.random() * 100
      return [...prev.slice(-19), newValue]
    })

    // Update memory usage
    setMemoryUsage((prev) => {
      const newValue = 40 + Math.random() * 30
      return [...prev.slice(-19), newValue]
    })

    // Update disk usage
    setDiskUsage((prev) => {
      const newValue = Math.random() * 50
      return [...prev.slice(-19), newValue]
    })

    // Update network usage
    setNetworkUsage((prev) => {
      const newValue = Math.random() * 80
      return [...prev.slice(-19), newValue]
    })

    // Update disk activity
    setDiskActivity((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((key) => {
        updated[key] = Math.max(0, Math.min(100, updated[key] + (Math.random() * 10 - 5)))
      })
      return updated
    })

    // Update process CPU and memory usage
    setProcesses((prev) =>
      prev.map((process) => ({
        ...process,
        cpu: Math.min(99.9, Math.max(0.1, process.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(process.memory + (Math.random() * 2 - 1), systemInfo?.totalMemory || 32768),
      })),
    )
  }

  const generateFakeProcesses = () => {
    const processNames = [
      "systemd",
      "kworker",
      "bash",
      "sshd",
      "nginx",
      "apache2",
      "mysql",
      "postgres",
      "python",
      "node",
      "chrome",
      "firefox",
      "vscode",
      "docker",
      "containerd",
      "snapd",
      "rsyslogd",
      "cron",
      "irqbalance",
      "networkmanager",
      "pulseaudio",
      "gnome-shell",
    ]

    const users = ["root", "user", "www-data", "mysql", "nobody", "systemd-network"]

    const statuses: ("running" | "sleeping" | "stopped" | "zombie")[] = ["running", "sleeping", "stopped", "zombie"]

    const processes: Process[] = []

    // Generate 20-40 processes
    const processCount = Math.floor(Math.random() * 20) + 20

    for (let i = 0; i < processCount; i++) {
      const name = processNames[Math.floor(Math.random() * processNames.length)]
      const user = users[Math.floor(Math.random() * users.length)]
      const status =
        i < processCount - 3
          ? Math.random() > 0.8
            ? "sleeping"
            : "running"
          : statuses[Math.floor(Math.random() * statuses.length)]

      // Generate a random start time within the last 24 hours
      const now = new Date()
      const hoursAgo = Math.floor(Math.random() * 24)
      const minutesAgo = Math.floor(Math.random() * 60)
      const startTime = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000 - minutesAgo * 60 * 1000)

      processes.push({
        pid: Math.floor(Math.random() * 30000) + 1,
        name,
        user,
        cpu: Math.random() * (name === "chrome" || name === "firefox" ? 30 : 5),
        memory: Math.random() * (name === "chrome" || name === "firefox" ? 2000 : 500),
        status,
        started: startTime.toLocaleTimeString(),
        command:
          name === "kworker"
            ? `[kworker/u8:1-events]`
            : `/usr/bin/${name} ${Math.random() > 0.5 ? "--config /etc/config.conf" : ""}`,
      })
    }

    setProcesses(processes)
  }

  // Modify the generateFakeSystemInfo function to use the shared data
  const generateFakeSystemInfo = () => {
    // Use the shared system specs data
    const cpuModel = systemSpecsData.cpu.model
    const cpuCores = systemSpecsData.cpu.cores
    const cpuThreads = systemSpecsData.cpu.threads
    const totalMemory = systemSpecsData.memory.total * 1024 // Convert GB to MB
    const totalSwap = 8192 + Math.floor(Math.random() * 3) * 8192 // 8GB to 32GB

    // Calculate total disk space from the storage array - convert GB to MB
    const totalDisk = systemSpecsData.storage.reduce((total, drive) => total + drive.size, 0)

    // Calculate used disk space (30-70% of total)
    const usedDiskPercentage = 0.3 + Math.random() * 0.4
    const usedDisk = Math.floor(totalDisk * usedDiskPercentage)

    // Calculate uptime
    const uptimeDays = Math.floor(Math.random() * 30)
    const uptimeHours = Math.floor(Math.random() * 24)
    const uptimeMinutes = Math.floor(Math.random() * 60)
    const uptime = `${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m`

    setSystemInfo({
      hostname: systemSpecsData.system.hostname,
      os: systemSpecsData.system.os,
      kernel: systemSpecsData.system.kernel,
      uptime,
      cpuModel,
      cpuCores,
      cpuThreads,
      cpuSpeed: cpuModel.split("@")[1]?.trim() || systemSpecsData.cpu.boostSpeed,
      totalMemory,
      totalSwap,
      totalDisk,
      usedDisk,
    })

    // Initialize usage metrics
    setCpuUsage(
      Array(20)
        .fill(0)
        .map(() => Math.random() * 100),
    )
    setMemoryUsage(
      Array(20)
        .fill(0)
        .map(() => 40 + Math.random() * 30),
    )
    setDiskUsage(
      Array(20)
        .fill(0)
        .map(() => Math.random() * 50),
    )
    setNetworkUsage(
      Array(20)
        .fill(0)
        .map(() => Math.random() * 80),
    )

    // Set disk activity for the same drives as in SystemSpecs
    const diskActivityObj = {}
    systemSpecsData.storage.forEach((drive) => {
      diskActivityObj[drive.device] = Math.random() * 30
    })
    setDiskActivity(diskActivityObj)
  }

  const killProcess = (pid: number) => {
    setProcesses((prev) => prev.filter((process) => process.pid !== pid))
    if (selectedProcess?.pid === pid) {
      setSelectedProcess(null)
    }
  }

  const formatMemory = (bytes: number): string => {
    if (bytes < 1024) return `${bytes.toFixed(2)} KB`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} MB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} GB`
  }

  const formatDisk = (bytes: number): string => {
    const kb = bytes
    const mb = kb / 1024
    const gb = mb / 1024
    const tb = gb / 1024

    if (tb >= 1) return `${tb.toFixed(2)} TB`
    if (gb >= 1) return `${gb.toFixed(2)} GB`
    if (mb >= 1) return `${mb.toFixed(2)} MB`
    return `${kb.toFixed(2)} KB`
  }

  const handleSort = (column: keyof Process) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("desc")
    }
  }

  const sortedProcesses = [...processes]
    .filter(
      (process) =>
        process.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        process.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        process.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        process.pid.toString().includes(searchQuery),
    )
    .sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

  // Render performance chart
  const renderChart = (data: number[], color: string, label: string, unit: string) => {
    const max = Math.max(...data, 100)

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold">{label}</span>
          <span className="text-xs">
            {data[data.length - 1].toFixed(1)}
            {unit}
          </span>
        </div>
        <div className="h-16 bg-gray-900 border border-green-500/30 flex items-end">
          {data.map((value, index) => (
            <div key={index} className={`w-full h-full flex-1 flex items-end`}>
              <div className={`w-full ${color}`} style={{ height: `${(value / max) * 100}%` }}></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      {/* Toolbar */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex space-x-1">
          <button
            className={`px-3 py-1 text-xs uppercase ${activeTab === "processes" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
            onClick={() => setActiveTab("processes")}
          >
            Processes
          </button>
          <button
            className={`px-3 py-1 text-xs uppercase ${activeTab === "performance" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
            onClick={() => setActiveTab("performance")}
          >
            Performance
          </button>
          <button
            className={`px-3 py-1 text-xs uppercase ${activeTab === "services" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
            onClick={() => setActiveTab("services")}
          >
            Services
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search processes..."
            className="bg-gray-900 border border-green-500/30 p-1 text-xs w-40"
          />
          <button
            className="p-1 hover:bg-green-900/30 rounded flex items-center text-xs"
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 border border-green-500/30 overflow-hidden">
        {activeTab === "processes" && (
          <div className="h-full flex flex-col">
            <div className="overflow-auto flex-1">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-900">
                    <th
                      className="text-left p-2 border-b border-green-500/30 cursor-pointer hover:bg-green-900/30"
                      onClick={() => handleSort("name")}
                    >
                      Name {sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="text-left p-2 border-b border-green-500/30 cursor-pointer hover:bg-green-900/30"
                      onClick={() => handleSort("pid")}
                    >
                      PID {sortBy === "pid" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="text-left p-2 border-b border-green-500/30 cursor-pointer hover:bg-green-900/30"
                      onClick={() => handleSort("user")}
                    >
                      User {sortBy === "user" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="text-left p-2 border-b border-green-500/30 cursor-pointer hover:bg-green-900/30"
                      onClick={() => handleSort("status")}
                    >
                      Status {sortBy === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="text-left p-2 border-b border-green-500/30 cursor-pointer hover:bg-green-900/30"
                      onClick={() => handleSort("cpu")}
                    >
                      CPU% {sortBy === "cpu" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="text-left p-2 border-b border-green-500/30 cursor-pointer hover:bg-green-900/30"
                      onClick={() => handleSort("memory")}
                    >
                      Memory {sortBy === "memory" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="text-left p-2 border-b border-green-500/30 cursor-pointer hover:bg-green-900/30"
                      onClick={() => handleSort("started")}
                    >
                      Started {sortBy === "started" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="text-left p-2 border-b border-green-500/30">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProcesses.map((process) => (
                    <tr
                      key={process.pid}
                      className={`hover:bg-green-900/20 cursor-pointer ${selectedProcess?.pid === process.pid ? "bg-green-900/30" : ""}`}
                      onClick={() => setSelectedProcess(process)}
                    >
                      <td className="p-2 border-b border-green-500/20">{process.name}</td>
                      <td className="p-2 border-b border-green-500/20">{process.pid}</td>
                      <td className="p-2 border-b border-green-500/20">{process.user}</td>
                      <td className="p-2 border-b border-green-500/20">
                        <span
                          className={
                            process.status === "running"
                              ? "text-green-400"
                              : process.status === "sleeping"
                                ? "text-blue-400"
                                : process.status === "stopped"
                                  ? "text-yellow-400"
                                  : "text-red-400"
                          }
                        >
                          {process.status}
                        </span>
                      </td>
                      <td className="p-2 border-b border-green-500/20">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-900 h-2 mr-2">
                            <div
                              className={`h-full ${process.cpu > 50 ? "bg-red-500" : "bg-green-500"}`}
                              style={{ width: `${Math.min(100, process.cpu)}%` }}
                            ></div>
                          </div>
                          <span>{process.cpu.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="p-2 border-b border-green-500/20">{formatMemory(process.memory)}</td>
                      <td className="p-2 border-b border-green-500/20">{process.started}</td>
                      <td className="p-2 border-b border-green-500/20">
                        <button
                          className="text-red-400 hover:text-red-300"
                          onClick={(e) => {
                            e.stopPropagation()
                            killProcess(process.pid)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedProcess && (
              <div className="border-t border-green-500/30 p-2">
                <div className="text-xs font-bold mb-1">Process Details</div>
                <div className="text-xs font-mono bg-gray-900/50 p-2 whitespace-pre-wrap">
                  {selectedProcess.command}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "performance" && systemInfo && (
          <div className="h-full overflow-auto p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-bold mb-2 flex items-center">
                  <Cpu className="h-4 w-4 mr-1" />
                  CPU
                </div>
                {renderChart(cpuUsage, "bg-green-500", "Utilization", "%")}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div>
                    <div className="text-green-500/70">Model:</div>
                    <div>{systemInfo.cpuModel}</div>
                  </div>
                  <div>
                    <div className="text-green-500/70">Speed:</div>
                    <div>{systemInfo.cpuSpeed}</div>
                  </div>
                  <div>
                    <div className="text-green-500/70">Cores:</div>
                    <div>
                      {systemInfo.cpuCores} (Physical), {systemInfo.cpuThreads} (Logical)
                    </div>
                  </div>
                  <div>
                    <div className="text-green-500/70">Current Usage:</div>
                    <div>{cpuUsage[cpuUsage.length - 1].toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold mb-2 flex items-center">
                  <Memory className="h-4 w-4 mr-1" />
                  Memory
                </div>
                {renderChart(memoryUsage, "bg-blue-500", "Usage", "%")}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div>
                    <div className="text-green-500/70">Total Physical:</div>
                    <div>{formatMemory(systemInfo.totalMemory * 1024)}</div>
                  </div>
                  <div>
                    <div className="text-green-500/70">In Use:</div>
                    <div>
                      {formatMemory((systemInfo.totalMemory * 1024 * memoryUsage[memoryUsage.length - 1]) / 100)}
                    </div>
                  </div>
                  <div>
                    <div className="text-green-500/70">Available:</div>
                    <div>
                      {formatMemory(systemInfo.totalMemory * 1024 * (1 - memoryUsage[memoryUsage.length - 1] / 100))}
                    </div>
                  </div>
                  <div>
                    <div className="text-green-500/70">Swap:</div>
                    <div>{formatMemory(systemInfo.totalSwap * 1024)}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold mb-2 flex items-center">
                  <HardDrive className="h-4 w-4 mr-1" />
                  Disk
                </div>
                {renderChart(diskUsage, "bg-purple-500", "Activity", "%")}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div>
                    <div className="text-green-500/70">Total Space:</div>
                    <div>{formatDisk(systemInfo.totalDisk * 1024 * 1024)}</div>
                  </div>
                  <div>
                    <div className="text-green-500/70">Used Space:</div>
                    <div>{formatDisk(systemInfo.usedDisk * 1024 * 1024)}</div>
                  </div>
                  <div>
                    <div className="text-green-500/70">Free Space:</div>
                    <div>{formatDisk((systemInfo.totalDisk - systemInfo.usedDisk) * 1024 * 1024)}</div>
                  </div>
                  <div>
                    <div className="text-green-500/70">Usage:</div>
                    <div>{((systemInfo.usedDisk / systemInfo.totalDisk) * 100).toFixed(1)}%</div>
                  </div>
                </div>

                {/* Add individual disk information */}
                <div className="mt-2">
                  <div className="text-xs text-green-500/70 mb-1">Storage Devices:</div>
                  <div className="space-y-2">
                    {systemSpecsData.storage.map((drive, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-xs mb-1">
                          <span>
                            {drive.model} ({drive.device})
                          </span>
                          <span>{diskActivity[drive.device]?.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-900 h-2">
                          <div
                            className="h-full bg-purple-500"
                            style={{ width: `${diskActivity[drive.device] || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold mb-2 flex items-center">
                  <Activity className="h-4 w-4 mr-1" />
                  Network
                </div>
                {renderChart(networkUsage, "bg-cyan-500", "Throughput", " Mbps")}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div>
                    <div className="text-green-500/70">Adapter:</div>
                    <div>eth0 (1000 Mbps)</div>
                  </div>
                  <div>
                    <div className="text-green-500/70">IP Address:</div>
                    <div>192.168.1.100</div>
                  </div>
                  <div>
                    <div className="text-green-500/70">Current Send:</div>
                    <div>{(networkUsage[networkUsage.length - 1] / 2).toFixed(1)} Mbps</div>
                  </div>
                  <div>
                    <div className="text-green-500/70">Current Receive:</div>
                    <div>{(networkUsage[networkUsage.length - 1] / 2).toFixed(1)} Mbps</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-bold mb-2 flex items-center">
                <BarChart2 className="h-4 w-4 mr-1" />
                System Information
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-green-500/70">Hostname:</div>
                  <div>{systemInfo.hostname}</div>
                </div>
                <div>
                  <div className="text-green-500/70">Operating System:</div>
                  <div>{systemInfo.os}</div>
                </div>
                <div>
                  <div className="text-green-500/70">Kernel:</div>
                  <div>{systemInfo.kernel}</div>
                </div>
                <div>
                  <div className="text-green-500/70">Uptime:</div>
                  <div>{systemInfo.uptime}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="h-full overflow-auto p-3">
            <div className="text-sm font-bold mb-2">System Services</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-900">
                  <th className="text-left p-2 border-b border-green-500/30">Name</th>
                  <th className="text-left p-2 border-b border-green-500/30">Status</th>
                  <th className="text-left p-2 border-b border-green-500/30">PID</th>
                  <th className="text-left p-2 border-b border-green-500/30">Description</th>
                  <th className="text-left p-2 border-b border-green-500/30">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-green-900/20">
                  <td className="p-2 border-b border-green-500/20">sshd</td>
                  <td className="p-2 border-b border-green-500/20 text-green-400">Running</td>
                  <td className="p-2 border-b border-green-500/20">1234</td>
                  <td className="p-2 border-b border-green-500/20">OpenSSH server daemon</td>
                  <td className="p-2 border-b border-green-500/20">
                    <button className="text-xs bg-red-900/30 border border-red-500/50 px-2 py-1 hover:bg-red-900/50 text-red-400">
                      Stop
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-green-900/20">
                  <td className="p-2 border-b border-green-500/20">nginx</td>
                  <td className="p-2 border-b border-green-500/20 text-green-400">Running</td>
                  <td className="p-2 border-b border-green-500/20">2345</td>
                  <td className="p-2 border-b border-green-500/20">Nginx web server</td>
                  <td className="p-2 border-b border-green-500/20">
                    <button className="text-xs bg-red-900/30 border border-red-500/50 px-2 py-1 hover:bg-red-900/50 text-red-400">
                      Stop
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-green-900/20">
                  <td className="p-2 border-b border-green-500/20">mysql</td>
                  <td className="p-2 border-b border-green-500/20 text-green-400">Running</td>
                  <td className="p-2 border-b border-green-500/20">3456</td>
                  <td className="p-2 border-b border-green-500/20">MySQL database server</td>
                  <td className="p-2 border-b border-green-500/20">
                    <button className="text-xs bg-red-900/30 border border-red-500/50 px-2 py-1 hover:bg-red-900/50 text-red-400">
                      Stop
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-green-900/20">
                  <td className="p-2 border-b border-green-500/20">apache2</td>
                  <td className="p-2 border-b border-green-500/20 text-yellow-400">Stopped</td>
                  <td className="p-2 border-b border-green-500/20">-</td>
                  <td className="p-2 border-b border-green-500/20">Apache HTTP Server</td>
                  <td className="p-2 border-b border-green-500/20">
                    <button className="text-xs bg-green-900/30 border border-green-500/50 px-2 py-1 hover:bg-green-900/50">
                      Start
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-green-900/20">
                  <td className="p-2 border-b border-green-500/20">cron</td>
                  <td className="p-2 border-b border-green-500/20 text-green-400">Running</td>
                  <td className="p-2 border-b border-green-500/20">4567</td>
                  <td className="p-2 border-b border-green-500/20">Daemon to execute scheduled commands</td>
                  <td className="p-2 border-b border-green-500/20">
                    <button className="text-xs bg-red-900/30 border border-red-500/50 px-2 py-1 hover:bg-red-900/50 text-red-400">
                      Stop
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-green-900/20">
                  <td className="p-2 border-b border-green-500/20">docker</td>
                  <td className="p-2 border-b border-green-500/20 text-green-400">Running</td>
                  <td className="p-2 border-b border-green-500/20">5678</td>
                  <td className="p-2 border-b border-green-500/20">Docker application container engine</td>
                  <td className="p-2 border-b border-green-500/20">
                    <button className="text-xs bg-red-900/30 border border-red-500/50 px-2 py-1 hover:bg-red-900/50 text-red-400">
                      Stop
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-green-900/20">
                  <td className="p-2 border-b border-green-500/20">mongodb</td>
                  <td className="p-2 border-b border-green-500/20 text-yellow-400">Stopped</td>
                  <td className="p-2 border-b border-green-500/20">-</td>
                  <td className="p-2 border-b border-green-500/20">MongoDB database server</td>
                  <td className="p-2 border-b border-green-500/20">
                    <button className="text-xs bg-green-900/30 border border-green-500/50 px-2 py-1 hover:bg-green-900/50">
                      Start
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
