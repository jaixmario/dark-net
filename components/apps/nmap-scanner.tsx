"use client"

import { useState, useEffect } from "react"
import { Network, RefreshCw, Server, AlertTriangle } from "lucide-react"

type ScanResult = {
  port: number
  service: string
  state: "open" | "closed" | "filtered"
  version?: string
}

type ScanTarget = {
  ip: string
  hostname?: string
  os?: string
  results: ScanResult[]
}

export function NmapScanner() {
  const [target, setTarget] = useState("")
  const [scanType, setScanType] = useState("basic")
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [scanResults, setScanResults] = useState<ScanTarget | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const startScan = () => {
    if (!target) return

    setIsScanning(true)
    setProgress(0)
    setScanResults(null)
    setLogs([`Starting ${scanType} scan on ${target}...`])

    // Simulate scanning progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = scanType === "basic" ? 5 : scanType === "quick" ? 3 : 1
        const newProgress = prev + increment

        // Add logs during scanning
        if (Math.random() > 0.7) {
          addLog(getRandomScanLog())
        }

        if (newProgress >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          generateFakeResults()
          return 100
        }
        return newProgress
      })
    }, 200)
  }

  const addLog = (log: string) => {
    setLogs((prev) => [...prev, log])
  }

  const getRandomScanLog = () => {
    const logs = [
      `Scanning port range...`,
      `Discovered open port 22/tcp on ${target}`,
      `Discovered open port 80/tcp on ${target}`,
      `Discovered open port 443/tcp on ${target}`,
      `Performing service detection...`,
      `Initiating OS detection...`,
      `Increasing send delay for ${target} from 0 to 5 due to max_successful_tryno increase to 4`,
      `Completed Service scan at 21:18, 10.31s elapsed`,
      `NSE: Script scanning ${target}`,
      `Initiating NSE at 21:18`,
      `Completed NSE at 21:18, 0.00s elapsed`,
    ]
    return logs[Math.floor(Math.random() * logs.length)]
  }

  const generateFakeResults = () => {
    // Generate fake scan results based on scan type
    const commonPorts = [
      { port: 21, service: "ftp", version: "vsftpd 3.0.3" },
      { port: 22, service: "ssh", version: "OpenSSH 8.2p1" },
      { port: 25, service: "smtp", version: "Postfix smtpd" },
      { port: 53, service: "domain", version: "ISC BIND 9.16.1" },
      { port: 80, service: "http", version: "Apache httpd 2.4.41" },
      { port: 443, service: "https", version: "nginx 1.18.0" },
      { port: 3306, service: "mysql", version: "MySQL 8.0.27" },
      { port: 8080, service: "http-proxy", version: "nginx 1.18.0" },
    ]

    // Determine how many ports to include based on scan type
    const portCount = scanType === "basic" ? 3 : scanType === "quick" ? 5 : 8

    // Randomly select ports and determine their state
    const results: ScanResult[] = []
    const selectedPorts = new Set<number>()

    while (selectedPorts.size < portCount) {
      const randomPort = commonPorts[Math.floor(Math.random() * commonPorts.length)]
      if (!selectedPorts.has(randomPort.port)) {
        selectedPorts.add(randomPort.port)

        // Determine port state
        const state: "open" | "closed" | "filtered" =
          Math.random() > 0.7 ? (Math.random() > 0.5 ? "closed" : "filtered") : "open"

        results.push({
          port: randomPort.port,
          service: randomPort.service,
          state,
          version: state === "open" ? randomPort.version : undefined,
        })
      }
    }

    // Sort by port number
    results.sort((a, b) => a.port - b.port)

    // Create the scan target result
    const scanTarget: ScanTarget = {
      ip: target,
      hostname: Math.random() > 0.5 ? `host-${target.replace(/\./g, "-")}.example.com` : undefined,
      os: scanType === "comprehensive" ? getRandomOS() : undefined,
      results,
    }

    setScanResults(scanTarget)
    addLog("Scan completed")
  }

  const getRandomOS = () => {
    const operatingSystems = [
      "Linux 5.4.0-81-generic",
      "Windows Server 2019",
      "FreeBSD 13.0",
      "Ubuntu 20.04 LTS",
      "Debian 11",
      "CentOS 8.4",
      "macOS 12.0.1",
    ]
    return operatingSystems[Math.floor(Math.random() * operatingSystems.length)]
  }

  // Auto-scroll logs
  useEffect(() => {
    const logsContainer = document.getElementById("nmap-logs")
    if (logsContainer) {
      logsContainer.scrollTop = logsContainer.scrollHeight
    }
  }, [logs])

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      <div className="mb-4">
        <div className="flex flex-wrap items-end gap-2 mb-3">
          <div className="flex-1">
            <label className="block text-xs mb-1">Target:</label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="IP address or hostname (e.g., 192.168.1.1)"
              className="w-full bg-gray-900 border border-green-500/50 p-2 text-sm"
              disabled={isScanning}
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Scan Type:</label>
            <select
              value={scanType}
              onChange={(e) => setScanType(e.target.value)}
              className="bg-gray-900 border border-green-500/50 p-2 text-sm"
              disabled={isScanning}
            >
              <option value="basic">Basic Scan (-sT)</option>
              <option value="quick">Quick Scan (-F)</option>
              <option value="comprehensive">Comprehensive (-sS -sV -O)</option>
            </select>
          </div>

          <button
            onClick={startScan}
            disabled={isScanning || !target.trim()}
            className="bg-green-900/50 border border-green-500 px-4 py-2 text-sm hover:bg-green-900/70 disabled:opacity-50 flex items-center"
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Network className="h-4 w-4 mr-2" />
                Start Scan
              </>
            )}
          </button>
        </div>

        {isScanning && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Scanning target...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-900 h-2">
              <div className="bg-green-500 h-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden">
        {/* Results Panel */}
        <div className="w-full md:w-1/2 border border-green-500/30 overflow-auto">
          <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-sm font-bold flex items-center">
            <Server className="h-4 w-4 mr-2" />
            <span>Scan Results</span>
          </div>

          {scanResults ? (
            <div className="p-3">
              <div className="mb-4">
                <div className="text-lg mb-2">Target: {scanResults.ip}</div>
                {scanResults.hostname && <div className="text-sm text-green-400">Hostname: {scanResults.hostname}</div>}
                {scanResults.os && <div className="text-sm text-green-400">OS: {scanResults.os}</div>}
              </div>

              <div className="border border-green-500/30 mb-4">
                <div className="bg-gray-900 p-2 text-xs font-bold grid grid-cols-4">
                  <div>PORT</div>
                  <div>STATE</div>
                  <div>SERVICE</div>
                  <div>VERSION</div>
                </div>

                <div className="divide-y divide-green-500/20">
                  {scanResults.results.map((result, index) => (
                    <div key={index} className="p-2 text-xs grid grid-cols-4">
                      <div>{result.port}/tcp</div>
                      <div
                        className={
                          result.state === "open"
                            ? "text-green-400"
                            : result.state === "filtered"
                              ? "text-yellow-400"
                              : "text-red-400"
                        }
                      >
                        {result.state}
                      </div>
                      <div>{result.service}</div>
                      <div>{result.version || "-"}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm">
                {scanResults.results.some((r) => r.state === "open") && (
                  <div className="flex items-center text-yellow-400 mb-2">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>Open ports detected. Consider securing unnecessary services.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-green-500/70">
              {isScanning ? "Scan in progress..." : "No scan results. Start a scan to see results."}
            </div>
          )}
        </div>

        {/* Logs Panel */}
        <div className="w-full md:w-1/2 border border-green-500/30 overflow-hidden flex flex-col">
          <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-sm font-bold">Nmap Output</div>

          <div id="nmap-logs" className="flex-1 p-2 font-mono text-xs overflow-auto">
            {logs.length === 0 ? (
              <div className="text-green-500/50 p-2">Nmap output will appear here</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
