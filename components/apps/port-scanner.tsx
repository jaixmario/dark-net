"use client"

import { useState } from "react"
import { Server, RefreshCw, AlertTriangle } from "lucide-react"

type PortStatus = "open" | "closed" | "timeout"

type ScanResult = {
  port: number
  status: PortStatus
  service: string
}

export function PortScanner() {
  const [target, setTarget] = useState("")
  const [portRange, setPortRange] = useState("1-1000")
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<ScanResult[]>([])
  const [error, setError] = useState("")

  const startScan = async () => {
    if (!target || !portRange) return

    setIsScanning(true)
    setProgress(0)
    setResults([])
    setError("")

    try {
      // Parse port range
      let startPort = 1
      let endPort = 1000

      if (portRange.includes("-")) {
        const [start, end] = portRange.split("-").map((p) => Number.parseInt(p.trim()))
        if (!isNaN(start) && !isNaN(end)) {
          startPort = start
          endPort = end
        }
      } else {
        const singlePort = Number.parseInt(portRange.trim())
        if (!isNaN(singlePort)) {
          startPort = singlePort
          endPort = singlePort
        }
      }

      // Validate port range
      if (startPort < 1 || endPort > 65535 || startPort > endPort) {
        throw new Error("Invalid port range. Must be between 1-65535.")
      }

      // For demo purposes, we'll simulate scanning common ports
      const commonPorts = [
        { port: 21, service: "FTP" },
        { port: 22, service: "SSH" },
        { port: 23, service: "Telnet" },
        { port: 25, service: "SMTP" },
        { port: 53, service: "DNS" },
        { port: 80, service: "HTTP" },
        { port: 110, service: "POP3" },
        { port: 143, service: "IMAP" },
        { port: 443, service: "HTTPS" },
        { port: 465, service: "SMTPS" },
        { port: 587, service: "SMTP Submission" },
        { port: 993, service: "IMAPS" },
        { port: 995, service: "POP3S" },
        { port: 3306, service: "MySQL" },
        { port: 3389, service: "RDP" },
        { port: 5432, service: "PostgreSQL" },
        { port: 8080, service: "HTTP Alternate" },
        { port: 8443, service: "HTTPS Alternate" },
      ]

      const totalPorts = endPort - startPort + 1
      let scannedPorts = 0
      const scanResults: ScanResult[] = []

      // Simulate scanning each port
      for (let port = startPort; port <= endPort; port++) {
        // Check if it's a common port
        const commonPort = commonPorts.find((p) => p.port === port)

        if (commonPort && port >= startPort && port <= endPort) {
          // Simulate random port status
          const rand = Math.random()
          const status: PortStatus = rand > 0.7 ? "open" : rand > 0.4 ? "closed" : "timeout"

          scanResults.push({
            port: commonPort.port,
            status,
            service: commonPort.service,
          })
        }

        scannedPorts++
        const newProgress = Math.floor((scannedPorts / totalPorts) * 100)
        setProgress(newProgress)

        // Add a small delay to simulate scanning
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      // Sort results by port number
      scanResults.sort((a, b) => a.port - b.port)
      setResults(scanResults)
    } catch (err) {
      console.error("Port scanning error:", err)
      setError(err instanceof Error ? err.message : "Port scanning failed. Please try again.")
    } finally {
      setIsScanning(false)
      setProgress(100)
    }
  }

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
            <label className="block text-xs mb-1">Port Range:</label>
            <input
              type="text"
              value={portRange}
              onChange={(e) => setPortRange(e.target.value)}
              placeholder="e.g., 1-1000 or 80,443"
              className="bg-gray-900 border border-green-500/50 p-2 text-sm w-32"
              disabled={isScanning}
            />
          </div>

          <button
            onClick={startScan}
            disabled={isScanning || !target.trim() || !portRange.trim()}
            className="bg-green-900/50 border border-green-500 px-4 py-2 text-sm hover:bg-green-900/70 disabled:opacity-50 flex items-center"
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Server className="h-4 w-4 mr-2" />
                Scan Ports
              </>
            )}
          </button>
        </div>

        {isScanning && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Scanning ports...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-900 h-2">
              <div className="bg-green-500 h-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 border border-green-500/30 overflow-auto">
        <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-sm font-bold flex items-center">
          <Server className="h-4 w-4 mr-2" />
          <span>Port Scan Results</span>
        </div>

        {error ? (
          <div className="p-4 text-red-400 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>Error</span>
            </div>
            <p className="text-sm">{error}</p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <div className="p-3 border-b border-green-500/30">
              <div className="text-sm mb-2">Target: {target}</div>
              <div className="text-xs">
                <span className="text-green-400">{results.filter((r) => r.status === "open").length}</span> open,
                <span className="text-red-400 ml-1">{results.filter((r) => r.status === "closed").length}</span> closed,
                <span className="text-yellow-400 ml-1">{results.filter((r) => r.status === "timeout").length}</span>{" "}
                filtered
              </div>
            </div>

            <div className="divide-y divide-green-500/20">
              <div className="bg-gray-900/50 p-2 text-xs font-bold grid grid-cols-3">
                <div>PORT</div>
                <div>STATE</div>
                <div>SERVICE</div>
              </div>

              {results.map((result, index) => (
                <div key={index} className="p-2 text-xs grid grid-cols-3">
                  <div>{result.port}/tcp</div>
                  <div
                    className={
                      result.status === "open"
                        ? "text-green-400"
                        : result.status === "timeout"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }
                  >
                    {result.status}
                  </div>
                  <div>{result.service}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-center">
            <div className="flex flex-col items-center">
              <Server className="h-8 w-8 mb-3" />
              <span>{isScanning ? "Scanning ports..." : "Enter a target and port range to start scanning"}</span>
              <span className="text-xs text-green-500/70 mt-2">Example: 192.168.1.1, 1-1000</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
