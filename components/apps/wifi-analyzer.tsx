"use client"

import { useState, useEffect } from "react"
import { Radio, RefreshCw, Wifi, WifiOff, Shield, AlertTriangle } from "lucide-react"

type WifiNetwork = {
  id: string
  ssid: string
  bssid: string
  channel: number
  frequency: string
  signal: number
  security: string[]
  vendor: string
  firstSeen: string
  lastSeen: string
  clients: number
}

export function WifiAnalyzer() {
  const [isScanning, setIsScanning] = useState(false)
  const [networks, setNetworks] = useState<WifiNetwork[]>([])
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null)
  const [scanCount, setScanCount] = useState(0)
  const [band, setBand] = useState<"2.4GHz" | "5GHz" | "all">("all")
  const [sortBy, setSortBy] = useState<"signal" | "ssid" | "channel">("signal")

  // Start/stop scanning
  const toggleScan = () => {
    if (isScanning) {
      setIsScanning(false)
    } else {
      setIsScanning(true)
      // Don't clear networks when starting a new scan
    }
  }

  // Clear all networks
  const clearNetworks = () => {
    setNetworks([])
    setSelectedNetwork(null)
    setScanCount(0)
  }

  // Generate random networks
  const generateRandomNetworks = () => {
    const securityTypes = [["WEP"], ["WPA"], ["WPA2"], ["WPA2", "WPA3"], ["WPA3"], ["Open"], ["WPA2", "Enterprise"]]

    const vendors = [
      "Cisco",
      "Netgear",
      "TP-Link",
      "Linksys",
      "Asus",
      "D-Link",
      "Ubiquiti",
      "Apple",
      "Belkin",
      "Unknown",
    ]

    const ssidPrefixes = [
      "HOME-",
      "NETGEAR",
      "TP-Link_",
      "Linksys",
      "ASUS_",
      "DIRECT-",
      "ATT",
      "xfinitywifi",
      "CenturyLink",
      "ORBI",
    ]

    const newNetworks: WifiNetwork[] = []
    const networkCount = Math.floor(Math.random() * 5) + 3 // 3-7 networks

    for (let i = 0; i < networkCount; i++) {
      const is5GHz = Math.random() > 0.5
      const channel = is5GHz ? Math.floor(Math.random() * 165) + 36 : Math.floor(Math.random() * 13) + 1
      const frequency = is5GHz ? "5GHz" : "2.4GHz"

      // Skip if we're filtering by band
      if ((band === "2.4GHz" && is5GHz) || (band === "5GHz" && !is5GHz)) {
        continue
      }

      const security = securityTypes[Math.floor(Math.random() * securityTypes.length)]
      const vendor = vendors[Math.floor(Math.random() * vendors.length)]
      const ssidPrefix = ssidPrefixes[Math.floor(Math.random() * ssidPrefixes.length)]
      const ssid = `${ssidPrefix}${Math.floor(Math.random() * 999)}`

      // Generate random MAC address
      const bssid = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, "0"),
      ).join(":")

      newNetworks.push({
        id: `network-${i}-${Date.now()}`,
        ssid,
        bssid,
        channel,
        frequency,
        signal: Math.floor(Math.random() * 100) - 100, // -100 to 0 dBm
        security,
        vendor,
        firstSeen: new Date().toLocaleTimeString(),
        lastSeen: new Date().toLocaleTimeString(),
        clients: Math.floor(Math.random() * 5),
      })
    }

    return newNetworks
  }

  // Simulate network scanning
  useEffect(() => {
    if (!isScanning) return

    const interval = setInterval(() => {
      const newNetworks = generateRandomNetworks()

      // Update existing networks or add new ones
      setNetworks((prev) => {
        const updated = [...prev]

        newNetworks.forEach((network) => {
          const existingIndex = updated.findIndex((n) => n.bssid === network.bssid)

          if (existingIndex >= 0) {
            // Update existing network
            updated[existingIndex] = {
              ...updated[existingIndex],
              signal: network.signal, // Update signal strength
              lastSeen: new Date().toLocaleTimeString(),
              clients: network.clients,
            }
          } else {
            // Add new network
            updated.push(network)
          }
        })

        return updated
      })

      setScanCount((prev) => prev + 1)
    }, 2000)

    return () => clearInterval(interval)
  }, [isScanning, band])

  // Sort networks
  const sortedNetworks = [...networks].sort((a, b) => {
    if (sortBy === "signal") {
      return b.signal - a.signal // Stronger signal first
    } else if (sortBy === "ssid") {
      return a.ssid.localeCompare(b.ssid)
    } else {
      return a.channel - b.channel
    }
  })

  // Get signal strength class
  const getSignalClass = (signal: number) => {
    if (signal > -50) return "text-green-400"
    if (signal > -70) return "text-yellow-400"
    return "text-red-400"
  }

  // Get security color
  const getSecurityColor = (security: string[]) => {
    if (security.includes("Open")) return "text-red-400"
    if (security.includes("WEP")) return "text-orange-400"
    if (security.includes("WPA3")) return "text-green-400"
    return "text-yellow-400"
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      <div className="mb-3">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="flex space-x-1">
            <button
              onClick={toggleScan}
              className={`px-2 py-1 text-xs flex items-center border ${isScanning ? "bg-red-900/30 border-red-500/70" : "bg-green-900/30 border-green-500/70"}`}
            >
              {isScanning ? (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Stop
                </>
              ) : (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  Start
                </>
              )}
            </button>

            <button
              onClick={clearNetworks}
              className="px-2 py-1 text-xs flex items-center bg-gray-900/30 border border-green-500/50"
              disabled={networks.length === 0}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Clear
            </button>
          </div>

          <div>
            <select
              value={band}
              onChange={(e) => setBand(e.target.value as "2.4GHz" | "5GHz" | "all")}
              className="bg-gray-900 border border-green-500/50 p-1 text-xs"
            >
              <option value="all">All Bands</option>
              <option value="2.4GHz">2.4 GHz</option>
              <option value="5GHz">5 GHz</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "signal" | "ssid" | "channel")}
              className="bg-gray-900 border border-green-500/50 p-1 text-xs"
            >
              <option value="signal">Sort by Signal</option>
              <option value="ssid">Sort by SSID</option>
              <option value="channel">Sort by Channel</option>
            </select>
          </div>

          <div className="ml-auto text-xs">
            {networks.length} networks found
            {scanCount > 0 && `, ${scanCount} scans`}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden">
        {/* Network List */}
        <div className="w-full md:w-1/2 border border-green-500/30 overflow-auto">
          <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-xs font-bold grid grid-cols-5">
            <div className="col-span-2">SSID</div>
            <div>Channel</div>
            <div>Security</div>
            <div>Signal</div>
          </div>

          <div className="divide-y divide-green-500/20">
            {networks.length === 0 ? (
              <div className="p-4 text-center text-sm text-green-500/70">
                {isScanning ? "Scanning for networks..." : "No networks found. Start scanning."}
              </div>
            ) : (
              sortedNetworks.map((network) => (
                <div
                  key={network.id}
                  className={`p-2 text-xs cursor-pointer hover:bg-green-900/20 ${selectedNetwork?.id === network.id ? "bg-green-900/30" : ""}`}
                  onClick={() => setSelectedNetwork(network)}
                >
                  <div className="grid grid-cols-5">
                    <div className="col-span-2 truncate">{network.ssid || "<Hidden SSID>"}</div>
                    <div>
                      {network.channel} ({network.frequency})
                    </div>
                    <div className={getSecurityColor(network.security)}>{network.security.join(", ")}</div>
                    <div className={getSignalClass(network.signal)}>{network.signal} dBm</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Network Details */}
        <div className="w-full md:w-1/2 border border-green-500/30 overflow-auto">
          {selectedNetwork ? (
            <div className="p-3">
              <div className="text-lg mb-3">{selectedNetwork.ssid || "<Hidden SSID>"}</div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div>
                  <div className="text-xs text-green-500/70">BSSID:</div>
                  <div className="font-mono">{selectedNetwork.bssid}</div>
                </div>
                <div>
                  <div className="text-xs text-green-500/70">Vendor:</div>
                  <div>{selectedNetwork.vendor}</div>
                </div>
                <div>
                  <div className="text-xs text-green-500/70">Channel:</div>
                  <div>{selectedNetwork.channel}</div>
                </div>
                <div>
                  <div className="text-xs text-green-500/70">Frequency:</div>
                  <div>{selectedNetwork.frequency}</div>
                </div>
                <div>
                  <div className="text-xs text-green-500/70">Signal:</div>
                  <div className={getSignalClass(selectedNetwork.signal)}>{selectedNetwork.signal} dBm</div>
                </div>
                <div>
                  <div className="text-xs text-green-500/70">Security:</div>
                  <div className={getSecurityColor(selectedNetwork.security)}>
                    {selectedNetwork.security.join(", ")}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-green-500/70">First Seen:</div>
                  <div>{selectedNetwork.firstSeen}</div>
                </div>
                <div>
                  <div className="text-xs text-green-500/70">Last Seen:</div>
                  <div>{selectedNetwork.lastSeen}</div>
                </div>
                <div>
                  <div className="text-xs text-green-500/70">Clients:</div>
                  <div>{selectedNetwork.clients}</div>
                </div>
              </div>

              {/* Signal Strength Meter */}
              <div className="mb-4">
                <div className="text-xs text-green-500/70 mb-1">Signal Strength:</div>
                <div className="w-full bg-gray-900 h-2 rounded-full">
                  <div
                    className={`h-full rounded-full ${getSignalClass(selectedNetwork.signal)}`}
                    style={{ width: `${Math.min(100, ((selectedNetwork.signal + 100) / 100) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>-100 dBm</span>
                  <span>-75 dBm</span>
                  <span>-50 dBm</span>
                  <span>-25 dBm</span>
                  <span>0 dBm</span>
                </div>
              </div>

              {/* Security Analysis */}
              <div className="mb-4">
                <div className="text-xs text-green-500/70 mb-1">Security Analysis:</div>
                <div
                  className={`p-2 border ${selectedNetwork.security.includes("Open") ? "border-red-500/50 bg-red-900/20" : selectedNetwork.security.includes("WEP") ? "border-orange-500/50 bg-orange-900/20" : selectedNetwork.security.includes("WPA3") ? "border-green-500/50 bg-green-900/20" : "border-yellow-500/50 bg-yellow-900/20"}`}
                >
                  <div className="flex items-center">
                    {selectedNetwork.security.includes("Open") ? (
                      <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
                    ) : selectedNetwork.security.includes("WEP") ? (
                      <AlertTriangle className="h-4 w-4 mr-2 text-orange-400" />
                    ) : selectedNetwork.security.includes("WPA3") ? (
                      <Shield className="h-4 w-4 mr-2 text-green-400" />
                    ) : (
                      <Shield className="h-4 w-4 mr-2 text-yellow-400" />
                    )}
                    <span className="text-sm">
                      {selectedNetwork.security.includes("Open")
                        ? "Insecure Network"
                        : selectedNetwork.security.includes("WEP")
                          ? "Weak Security"
                          : selectedNetwork.security.includes("WPA3")
                            ? "Strong Security"
                            : "Moderate Security"}
                    </span>
                  </div>
                  <div className="mt-1 text-xs">
                    {selectedNetwork.security.includes("Open")
                      ? "This network has no encryption. All data transmitted is vulnerable to interception."
                      : selectedNetwork.security.includes("WEP")
                        ? "WEP encryption can be cracked in minutes. Consider upgrading to WPA2 or WPA3."
                        : selectedNetwork.security.includes("WPA3")
                          ? "WPA3 provides strong encryption and protection against brute force attacks."
                          : "WPA2 provides good security but can be vulnerable to certain attacks."}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="bg-green-900/50 border border-green-500 px-3 py-1 text-sm hover:bg-green-900/70">
                  <Radio className="h-4 w-4 mr-1 inline-block" />
                  Monitor
                </button>
                {selectedNetwork.security.includes("Open") && (
                  <button className="bg-blue-900/50 border border-blue-500 px-3 py-1 text-sm hover:bg-blue-900/70 text-blue-400">
                    <Wifi className="h-4 w-4 mr-1 inline-block" />
                    Connect
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center p-4">
              <div className="flex flex-col items-center">
                <Radio className="h-8 w-8 mb-3" />
                <span>Select a network to view details</span>
                <span className="text-xs text-green-500/70 mt-2">
                  {isScanning ? "Scanning for networks..." : "Start scanning to discover networks"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
