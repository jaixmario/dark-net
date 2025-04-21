"use client"

import { useState } from "react"
import { Wifi, Server, Database, Laptop, Router, AlertTriangle } from "lucide-react"

type NetworkDevice = {
  id: string
  name: string
  ip: string
  mac: string
  type: "server" | "router" | "computer" | "database" | "unknown"
  status: "online" | "offline" | "vulnerable"
  ports: { port: number; service: string; status: "open" | "closed" | "filtered" }[]
  os?: string
}

export function NetworkScanner() {
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [devices, setDevices] = useState<NetworkDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null)
  const [scanType, setScanType] = useState<"quick" | "full">("quick")
  const [ipRange, setIpRange] = useState("192.168.1.1-254")

  const startScan = () => {
    setScanning(true)
    setProgress(0)
    setDevices([])
    setSelectedDevice(null)

    // Simulate scanning progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setScanning(false)
          generateFakeDevices()
          return 100
        }
        return prev + (scanType === "quick" ? 5 : 2)
      })
    }, 200)
  }

  const generateFakeDevices = () => {
    const deviceTypes: ("server" | "router" | "computer" | "database" | "unknown")[] = [
      "server",
      "router",
      "computer",
      "database",
      "unknown",
    ]
    const osList = ["Windows 10", "Ubuntu 20.04", "macOS 12.0", "CentOS 8", "Unknown"]
    const ipBase = ipRange.split("-")[0].substring(0, ipRange.split("-")[0].lastIndexOf(".") + 1)

    const newDevices: NetworkDevice[] = []

    // Generate between 5-15 devices
    const deviceCount = Math.floor(Math.random() * 10) + 5

    for (let i = 0; i < deviceCount; i++) {
      const type = deviceTypes[Math.floor(Math.random() * deviceTypes.length)]
      const ipLastOctet = Math.floor(Math.random() * 254) + 1
      const macSegments = []

      for (let j = 0; j < 6; j++) {
        macSegments.push(
          Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, "0"),
        )
      }

      const ports = []
      const portCount = scanType === "quick" ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 10) + 3

      const commonPorts = [
        { port: 21, service: "FTP" },
        { port: 22, service: "SSH" },
        { port: 23, service: "Telnet" },
        { port: 25, service: "SMTP" },
        { port: 53, service: "DNS" },
        { port: 80, service: "HTTP" },
        { port: 443, service: "HTTPS" },
        { port: 3306, service: "MySQL" },
        { port: 3389, service: "RDP" },
        { port: 8080, service: "HTTP-ALT" },
      ]

      for (let j = 0; j < portCount; j++) {
        const portInfo = commonPorts[Math.floor(Math.random() * commonPorts.length)]
        const status: "open" | "closed" | "filtered" = ["open", "closed", "filtered"][Math.floor(Math.random() * 3)]

        ports.push({
          port: portInfo.port,
          service: portInfo.service,
          status,
        })
      }

      newDevices.push({
        id: `device-${i}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)}-${ipLastOctet}`,
        ip: `${ipBase}${ipLastOctet}`,
        mac: macSegments.join(":").toUpperCase(),
        type,
        status: Math.random() > 0.8 ? "vulnerable" : Math.random() > 0.9 ? "offline" : "online",
        ports,
        os: scanType === "full" ? osList[Math.floor(Math.random() * osList.length)] : undefined,
      })
    }

    setDevices(newDevices)
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "server":
        return <Server className="h-5 w-5" />
      case "router":
        return <Router className="h-5 w-5" />
      case "computer":
        return <Laptop className="h-5 w-5" />
      case "database":
        return <Database className="h-5 w-5" />
      default:
        return <Wifi className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-500"
      case "offline":
        return "text-gray-500"
      case "vulnerable":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div>
            <label className="block text-xs mb-1">IP Range:</label>
            <input
              type="text"
              value={ipRange}
              onChange={(e) => setIpRange(e.target.value)}
              className="bg-gray-900 border border-green-500/50 p-1 text-sm w-40"
              disabled={scanning}
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Scan Type:</label>
            <select
              value={scanType}
              onChange={(e) => setScanType(e.target.value as "quick" | "full")}
              className="bg-gray-900 border border-green-500/50 p-1 text-sm"
              disabled={scanning}
            >
              <option value="quick">Quick Scan</option>
              <option value="full">Full Scan</option>
            </select>
          </div>

          <div className="ml-auto">
            <button
              onClick={startScan}
              disabled={scanning}
              className="bg-green-900/50 border border-green-500 px-3 py-1 text-sm hover:bg-green-900/70 disabled:opacity-50"
            >
              {scanning ? "Scanning..." : "Start Scan"}
            </button>
          </div>
        </div>

        {scanning && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Scanning network...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-900 h-2">
              <div className="bg-green-500 h-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden">
        {/* Device List */}
        <div className="w-full md:w-1/2 border border-green-500/30 overflow-auto">
          <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-xs font-bold grid grid-cols-5">
            <div className="col-span-2">Device</div>
            <div>IP Address</div>
            <div>Type</div>
            <div>Status</div>
          </div>

          <div className="divide-y divide-green-500/20">
            {devices.length === 0 ? (
              <div className="p-4 text-center text-sm text-green-500/70">
                {scanning ? "Scanning in progress..." : "No devices found. Start a scan."}
              </div>
            ) : (
              devices.map((device) => (
                <div
                  key={device.id}
                  className={`p-2 text-xs grid grid-cols-5 cursor-pointer hover:bg-green-900/20 ${selectedDevice?.id === device.id ? "bg-green-900/30" : ""}`}
                  onClick={() => setSelectedDevice(device)}
                >
                  <div className="col-span-2 flex items-center">
                    {getDeviceIcon(device.type)}
                    <span className="ml-2 truncate">{device.name}</span>
                    {device.status === "vulnerable" && <AlertTriangle className="h-4 w-4 ml-1 text-red-500" />}
                  </div>
                  <div>{device.ip}</div>
                  <div className="capitalize">{device.type}</div>
                  <div className={getStatusColor(device.status)}>{device.status.toUpperCase()}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Device Details */}
        <div className="w-full md:w-1/2 border border-green-500/30 overflow-auto">
          {selectedDevice ? (
            <div className="p-3">
              <div className="flex items-center mb-4">
                {getDeviceIcon(selectedDevice.type)}
                <h3 className="text-lg ml-2">{selectedDevice.name}</h3>
                <span
                  className={`ml-auto px-2 py-1 text-xs rounded border ${getStatusColor(selectedDevice.status)} border-current`}
                >
                  {selectedDevice.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div>
                  <span className="text-xs text-green-500/70">IP Address:</span>
                  <div>{selectedDevice.ip}</div>
                </div>
                <div>
                  <span className="text-xs text-green-500/70">MAC Address:</span>
                  <div>{selectedDevice.mac}</div>
                </div>
                <div>
                  <span className="text-xs text-green-500/70">Type:</span>
                  <div className="capitalize">{selectedDevice.type}</div>
                </div>
                {selectedDevice.os && (
                  <div>
                    <span className="text-xs text-green-500/70">Operating System:</span>
                    <div>{selectedDevice.os}</div>
                  </div>
                )}
              </div>

              <div className="mb-2 text-sm font-bold">Open Ports:</div>
              <div className="border border-green-500/30">
                <div className="bg-gray-900 p-2 border-b border-green-500/30 text-xs font-bold grid grid-cols-3">
                  <div>Port</div>
                  <div>Service</div>
                  <div>Status</div>
                </div>

                <div className="divide-y divide-green-500/20">
                  {selectedDevice.ports.map((port, index) => (
                    <div key={index} className="p-2 text-xs grid grid-cols-3">
                      <div>{port.port}</div>
                      <div>{port.service}</div>
                      <div
                        className={
                          port.status === "open"
                            ? "text-red-400"
                            : port.status === "filtered"
                              ? "text-yellow-400"
                              : "text-gray-400"
                        }
                      >
                        {port.status.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedDevice.status === "vulnerable" && (
                <div className="mt-4 p-2 border border-red-500/50 bg-red-900/20 text-red-400 text-sm">
                  <div className="flex items-center mb-1">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="font-bold">Vulnerabilities Detected</span>
                  </div>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    <li>Outdated SSH server (CVE-2018-15473)</li>
                    <li>SMB protocol vulnerability (MS17-010)</li>
                    <li>Default credentials detected</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-green-500/70">Select a device to view details</div>
          )}
        </div>
      </div>
    </div>
  )
}
