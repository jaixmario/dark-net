"use client"

import { useState, useEffect } from "react"
import { Shield, Globe, RefreshCw, Check, Power, Lock } from "lucide-react"

type VpnLocation = {
  id: string
  country: string
  city: string
  flag: string
  latency: number
  load: number
}

export function VpnClient() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<VpnLocation | null>(null)
  const [locations, setLocations] = useState<VpnLocation[]>([
    { id: "us-ny", country: "United States", city: "New York", flag: "🇺🇸", latency: 85, load: 65 },
    { id: "us-la", country: "United States", city: "Los Angeles", flag: "🇺🇸", latency: 120, load: 45 },
    { id: "de-fr", country: "Germany", city: "Frankfurt", flag: "🇩🇪", latency: 110, load: 30 },
    { id: "de-be", country: "Germany", city: "Berlin", flag: "🇩🇪", latency: 125, load: 25 },
    { id: "in-de", country: "India", city: "Delhi", flag: "🇮🇳", latency: 210, load: 40 },
    { id: "in-mu", country: "India", city: "Mumbai", flag: "🇮🇳", latency: 195, load: 55 },
    { id: "jp-to", country: "Japan", city: "Tokyo", flag: "🇯🇵", latency: 170, load: 35 },
    { id: "sg-sg", country: "Singapore", city: "Singapore", flag: "🇸🇬", latency: 160, load: 50 },
    { id: "uk-lo", country: "United Kingdom", city: "London", flag: "🇬🇧", latency: 95, load: 60 },
    { id: "ca-to", country: "Canada", city: "Toronto", flag: "🇨🇦", latency: 100, load: 40 },
    { id: "au-sy", country: "Australia", city: "Sydney", flag: "🇦🇺", latency: 230, load: 30 },
    { id: "br-sp", country: "Brazil", city: "São Paulo", flag: "🇧🇷", latency: 180, load: 45 },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [connectionTime, setConnectionTime] = useState(0)
  const [ipAddress, setIpAddress] = useState("192.168.1.100")
  const [virtualIpAddress, setVirtualIpAddress] = useState("")
  const [connectionStats, setConnectionStats] = useState({
    dataReceived: 0,
    dataSent: 0,
  })
  const [activeTab, setActiveTab] = useState<"locations" | "settings">("locations")
  const [vpnProtocol, setVpnProtocol] = useState<"openvpn" | "wireguard">("wireguard")
  const [killSwitch, setKillSwitch] = useState(true)
  const [splitTunneling, setSplitTunneling] = useState(false)
  const [autoConnect, setAutoConnect] = useState(false)

  // Update connection time
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isConnected) {
      interval = setInterval(() => {
        setConnectionTime((prev) => prev + 1)

        // Update data stats
        setConnectionStats((prev) => ({
          dataReceived: prev.dataReceived + Math.floor(Math.random() * 50) + 10,
          dataSent: prev.dataSent + Math.floor(Math.random() * 30) + 5,
        }))
      }, 1000)
    } else {
      setConnectionTime(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isConnected])

  // Format time
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Format data size
  const formatDataSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  // Connect to VPN
  const connectVpn = () => {
    if (!selectedLocation) return

    setIsConnecting(true)

    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true)
      setIsConnecting(false)
      setVirtualIpAddress(generateRandomIp(selectedLocation.country))
    }, 2000)
  }

  // Disconnect from VPN
  const disconnectVpn = () => {
    setIsConnecting(true)

    // Simulate disconnection delay
    setTimeout(() => {
      setIsConnected(false)
      setIsConnecting(false)
      setVirtualIpAddress("")
    }, 1000)
  }

  // Generate random IP based on country
  const generateRandomIp = (country: string): string => {
    let prefix = ""

    switch (country) {
      case "United States":
        prefix = "104."
        break
      case "Germany":
        prefix = "85."
        break
      case "India":
        prefix = "117."
        break
      case "Japan":
        prefix = "126."
        break
      case "Singapore":
        prefix = "152."
        break
      case "United Kingdom":
        prefix = "92."
        break
      case "Canada":
        prefix = "99."
        break
      case "Australia":
        prefix = "180."
        break
      case "Brazil":
        prefix = "177."
        break
      default:
        prefix = "192."
    }

    return `${prefix}${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
  }

  // Filter locations based on search
  const filteredLocations = locations.filter(
    (location) =>
      location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.city.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-bold flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Secure VPN Client
        </div>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
          <span className="text-sm">{isConnected ? "Protected" : "Not Protected"}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3 flex flex-col">
          {/* Connection Panel */}
          <div className="border border-green-500/30 p-4 mb-4 flex flex-col items-center">
            <div className="relative mb-4">
              <div
                className={`w-32 h-32 rounded-full border-4 ${isConnected ? "border-green-500" : "border-red-500"} flex items-center justify-center`}
              >
                <div
                  className={`w-24 h-24 rounded-full ${isConnected ? "bg-green-900/50" : "bg-red-900/50"} flex items-center justify-center`}
                >
                  {isConnecting ? (
                    <RefreshCw className="h-12 w-12 animate-spin" />
                  ) : (
                    <Power className={`h-12 w-12 ${isConnected ? "text-green-400" : "text-red-400"}`} />
                  )}
                </div>
              </div>
              {selectedLocation && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-xl">
                  {selectedLocation.flag}
                </div>
              )}
            </div>

            <div className="text-center mb-4">
              <div className="text-xl font-bold">
                {isConnected ? "Connected" : isConnecting ? "Connecting..." : "Not Connected"}
              </div>
              {selectedLocation && (
                <div className="text-sm text-green-500/70">
                  {selectedLocation.city}, {selectedLocation.country}
                </div>
              )}
              {isConnected && <div className="text-xs mt-1">Connected for {formatTime(connectionTime)}</div>}
            </div>

            <button
              onClick={isConnected ? disconnectVpn : connectVpn}
              disabled={isConnecting || (!isConnected && !selectedLocation)}
              className={`px-6 py-2 rounded-full text-sm font-bold ${
                isConnected
                  ? "bg-red-900/50 border border-red-500 hover:bg-red-900/70 text-white"
                  : "bg-green-900/50 border border-green-500 hover:bg-green-900/70 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isConnected ? "Disconnect" : "Connect"}
            </button>
          </div>

          {/* Connection Info */}
          <div className="border border-green-500/30 p-4 flex-1">
            <div className="flex justify-between mb-4">
              <button
                className={`px-3 py-1 text-xs ${activeTab === "locations" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
                onClick={() => setActiveTab("locations")}
              >
                LOCATIONS
              </button>
              <button
                className={`px-3 py-1 text-xs ${activeTab === "settings" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
                onClick={() => setActiveTab("settings")}
              >
                SETTINGS
              </button>
            </div>

            {activeTab === "locations" ? (
              <>
                <div className="mb-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search locations..."
                    className="w-full bg-gray-900 border border-green-500/50 p-2 text-sm"
                  />
                </div>

                <div className="overflow-auto max-h-[300px]">
                  {filteredLocations.map((location) => (
                    <div
                      key={location.id}
                      className={`p-2 border border-green-500/20 mb-2 rounded cursor-pointer hover:bg-green-900/20 ${selectedLocation?.id === location.id ? "bg-green-900/30" : ""}`}
                      onClick={() => setSelectedLocation(location)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-xl mr-2">{location.flag}</div>
                          <div>
                            <div className="text-sm font-bold">{location.city}</div>
                            <div className="text-xs text-green-500/70">{location.country}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs">{location.latency} ms</div>
                          <div className="w-16 bg-gray-900 h-1 mt-1">
                            <div
                              className={`h-full ${location.load > 70 ? "bg-red-500" : location.load > 40 ? "bg-yellow-500" : "bg-green-500"}`}
                              style={{ width: `${location.load}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-bold mb-1">VPN Protocol</div>
                  <div className="flex space-x-2">
                    <button
                      className={`px-3 py-1 text-xs ${vpnProtocol === "wireguard" ? "bg-green-900/50 border border-green-500/50" : "border border-green-500/30"}`}
                      onClick={() => setVpnProtocol("wireguard")}
                    >
                      WireGuard
                    </button>
                    <button
                      className={`px-3 py-1 text-xs ${vpnProtocol === "openvpn" ? "bg-green-900/50 border border-green-500/50" : "border border-green-500/30"}`}
                      onClick={() => setVpnProtocol("openvpn")}
                    >
                      OpenVPN
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-bold">Kill Switch</div>
                    <button
                      className={`w-10 h-5 rounded-full relative ${killSwitch ? "bg-green-500" : "bg-gray-700"}`}
                      onClick={() => setKillSwitch(!killSwitch)}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black transition-transform ${killSwitch ? "transform translate-x-5" : ""}`}
                      ></span>
                    </button>
                  </div>
                  <div className="text-xs text-green-500/70 mt-1">Block all traffic if VPN connection drops</div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-bold">Split Tunneling</div>
                    <button
                      className={`w-10 h-5 rounded-full relative ${splitTunneling ? "bg-green-500" : "bg-gray-700"}`}
                      onClick={() => setSplitTunneling(!splitTunneling)}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black transition-transform ${splitTunneling ? "transform translate-x-5" : ""}`}
                      ></span>
                    </button>
                  </div>
                  <div className="text-xs text-green-500/70 mt-1">Allow some apps to bypass VPN</div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-bold">Auto-Connect</div>
                    <button
                      className={`w-10 h-5 rounded-full relative ${autoConnect ? "bg-green-500" : "bg-gray-700"}`}
                      onClick={() => setAutoConnect(!autoConnect)}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black transition-transform ${autoConnect ? "transform translate-x-5" : ""}`}
                      ></span>
                    </button>
                  </div>
                  <div className="text-xs text-green-500/70 mt-1">Connect to VPN when system starts</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/3 border border-green-500/30 p-4">
          <div className="text-sm font-bold mb-3">Connection Details</div>

          <div className="space-y-3">
            <div>
              <div className="text-xs text-green-500/70">Real IP Address:</div>
              <div className="text-sm font-mono">{ipAddress}</div>
            </div>

            <div>
              <div className="text-xs text-green-500/70">Virtual IP Address:</div>
              <div className="text-sm font-mono">{virtualIpAddress || "Not connected"}</div>
            </div>

            <div>
              <div className="text-xs text-green-500/70">Protocol:</div>
              <div className="text-sm">{vpnProtocol.toUpperCase()}</div>
            </div>

            <div>
              <div className="text-xs text-green-500/70">Connection Status:</div>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                <span>{isConnected ? "Connected" : "Disconnected"}</span>
              </div>
            </div>

            {isConnected && (
              <>
                <div>
                  <div className="text-xs text-green-500/70">Connection Time:</div>
                  <div className="text-sm">{formatTime(connectionTime)}</div>
                </div>

                <div>
                  <div className="text-xs text-green-500/70">Data Received:</div>
                  <div className="text-sm">{formatDataSize(connectionStats.dataReceived)}</div>
                </div>

                <div>
                  <div className="text-xs text-green-500/70">Data Sent:</div>
                  <div className="text-sm">{formatDataSize(connectionStats.dataSent)}</div>
                </div>
              </>
            )}
          </div>

          <div className="mt-6">
            <div className="text-sm font-bold mb-2">Security Status</div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-xs">IP Address Hidden</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-xs">Traffic Encrypted</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-xs">DNS Leak Protection</span>
              </div>
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-xs">AES-256 Encryption</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-xs">No Activity Logs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
