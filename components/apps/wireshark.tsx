"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Filter, Download, Play, Square } from "lucide-react"

type PacketType = "TCP" | "UDP" | "ICMP" | "ARP" | "DNS" | "HTTP" | "HTTPS" | "TLS"

type Packet = {
  id: number
  timestamp: string
  source: string
  destination: string
  protocol: PacketType
  length: number
  info: string
  data: string
}

export function Wireshark() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [packets, setPackets] = useState<Packet[]>([])
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null)
  const [filter, setFilter] = useState("")
  const [interfaces, setInterfaces] = useState<string[]>([
    "eth0 (Ethernet)",
    "wlan0 (Wi-Fi)",
    "lo (Loopback)",
    "usb0 (USB Ethernet)",
  ])
  const [selectedInterface, setSelectedInterface] = useState("eth0 (Ethernet)")
  const [captureCount, setCaptureCount] = useState(0)

  // Start/stop packet capture
  const toggleCapture = () => {
    if (isCapturing) {
      setIsCapturing(false)
    } else {
      setIsCapturing(true)
      setSelectedPacket(null)
      // Don't clear packets when starting a new capture
    }
  }

  // Clear all captured packets
  const clearCapture = () => {
    setPackets([])
    setSelectedPacket(null)
    setCaptureCount(0)
  }

  // Generate a random IP address
  const getRandomIP = () => {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
  }

  // Generate a random MAC address
  const getRandomMAC = () => {
    const hexDigits = "0123456789ABCDEF"
    let mac = ""
    for (let i = 0; i < 6; i++) {
      mac += hexDigits.charAt(Math.floor(Math.random() * 16))
      mac += hexDigits.charAt(Math.floor(Math.random() * 16))
      if (i < 5) mac += ":"
    }
    return mac
  }

  // Generate random packet data
  const getRandomPacketData = () => {
    const protocols: PacketType[] = ["TCP", "UDP", "ICMP", "ARP", "DNS", "HTTP", "HTTPS", "TLS"]
    const protocol = protocols[Math.floor(Math.random() * protocols.length)]

    let source = getRandomIP()
    let destination = getRandomIP()
    let info = ""

    // Local network IPs are more realistic
    if (Math.random() > 0.5) {
      source = `192.168.1.${Math.floor(Math.random() * 254) + 1}`
    }
    if (Math.random() > 0.7) {
      destination = `192.168.1.${Math.floor(Math.random() * 254) + 1}`
    }

    // Add port numbers for TCP/UDP
    if (protocol === "TCP" || protocol === "UDP") {
      const srcPort = Math.floor(Math.random() * 60000) + 1024
      let dstPort = 80

      // Common destination ports
      if (protocol === "TCP") {
        dstPort = [80, 443, 22, 21, 25, 3306, 8080][Math.floor(Math.random() * 7)]
      } else {
        dstPort = [53, 67, 123, 161, 5353][Math.floor(Math.random() * 5)]
      }

      source = `${source}:${srcPort}`
      destination = `${destination}:${dstPort}`

      if (protocol === "TCP") {
        const flags = ["SYN", "ACK", "SYN, ACK", "FIN", "RST", "PSH, ACK"][Math.floor(Math.random() * 6)]
        info = `${srcPort} → ${dstPort} [${flags}] Seq=0 Win=64240 Len=${Math.floor(Math.random() * 1000)}`
      } else {
        info = `${srcPort} → ${dstPort} Len=${Math.floor(Math.random() * 1000)}`
      }
    } else if (protocol === "HTTP") {
      const methods = ["GET", "POST", "PUT", "DELETE"]
      const method = methods[Math.floor(Math.random() * methods.length)]
      const paths = ["/", "/index.html", "/api/users", "/login", "/images/logo.png"]
      const path = paths[Math.floor(Math.random() * paths.length)]
      info = `${method} ${path} HTTP/1.1`
    } else if (protocol === "DNS") {
      const domains = ["example.com", "google.com", "github.com", "microsoft.com", "apple.com"]
      const domain = domains[Math.floor(Math.random() * domains.length)]
      info = `Standard query 0x${Math.floor(Math.random() * 10000).toString(16)} A ${domain}`
    } else if (protocol === "ARP") {
      info = `Who has ${destination}? Tell ${source}`
    } else if (protocol === "ICMP") {
      info = `Echo (ping) request id=${Math.floor(Math.random() * 10000)}, seq=${Math.floor(Math.random() * 100)}`
    } else {
      info = `Packet data for ${protocol}`
    }

    // Generate hex data
    let data = ""
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        data +=
          Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, "0") + " "
      }
      data += "\n"
    }

    return {
      protocol,
      source,
      destination,
      info,
      length: Math.floor(Math.random() * 1000) + 64,
      data,
    }
  }

  // Simulate packet capture
  useEffect(() => {
    if (!isCapturing) return

    const interval = setInterval(() => {
      const packetData = getRandomPacketData()
      const newPacket: Packet = {
        id: captureCount + 1,
        timestamp: new Date().toISOString().split("T")[1].split(".")[0],
        ...packetData,
      }

      setPackets((prev) => [...prev, newPacket])
      setCaptureCount((prev) => prev + 1)
    }, 500)

    return () => clearInterval(interval)
  }, [isCapturing, captureCount])

  // Filter packets
  const filteredPackets = filter
    ? packets.filter(
        (packet) =>
          packet.protocol.toLowerCase().includes(filter.toLowerCase()) ||
          packet.source.toLowerCase().includes(filter.toLowerCase()) ||
          packet.destination.toLowerCase().includes(filter.toLowerCase()) ||
          packet.info.toLowerCase().includes(filter.toLowerCase()),
      )
    : packets

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      <div className="mb-3">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div>
            <select
              value={selectedInterface}
              onChange={(e) => setSelectedInterface(e.target.value)}
              className="bg-gray-900 border border-green-500/50 p-1 text-sm"
              disabled={isCapturing}
            >
              {interfaces.map((iface) => (
                <option key={iface} value={iface}>
                  {iface}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-1">
            <button
              onClick={toggleCapture}
              className={`px-2 py-1 text-xs flex items-center border ${isCapturing ? "bg-red-900/30 border-red-500/70" : "bg-green-900/30 border-green-500/70"}`}
            >
              {isCapturing ? (
                <>
                  <Square className="h-3 w-3 mr-1" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Start
                </>
              )}
            </button>

            <button
              onClick={clearCapture}
              className="px-2 py-1 text-xs flex items-center bg-gray-900/30 border border-green-500/50"
              disabled={packets.length === 0}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Clear
            </button>
          </div>

          <div className="flex-1 flex items-center">
            <div className="relative flex-1">
              <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-green-500/50" />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter packets (e.g., tcp, 192.168.1.1)"
                className="w-full bg-gray-900 border border-green-500/50 p-1 pl-7 text-xs"
              />
            </div>
          </div>

          <div className="text-xs">
            {captureCount} packets captured
            {filter && `, ${filteredPackets.length} displayed`}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden border border-green-500/30">
        {/* Packet List */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-900 sticky top-0">
                <th className="p-1 text-left border-b border-r border-green-500/30 w-12">No.</th>
                <th className="p-1 text-left border-b border-r border-green-500/30 w-24">Time</th>
                <th className="p-1 text-left border-b border-r border-green-500/30">Source</th>
                <th className="p-1 text-left border-b border-r border-green-500/30">Destination</th>
                <th className="p-1 text-left border-b border-r border-green-500/30 w-20">Protocol</th>
                <th className="p-1 text-left border-b border-r border-green-500/30 w-16">Length</th>
                <th className="p-1 text-left border-b border-green-500/30">Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-500/20">
              {filteredPackets.map((packet) => (
                <tr
                  key={packet.id}
                  className={`hover:bg-green-900/20 cursor-pointer ${selectedPacket?.id === packet.id ? "bg-green-900/30" : ""}`}
                  onClick={() => setSelectedPacket(packet)}
                >
                  <td className="p-1 border-r border-green-500/30">{packet.id}</td>
                  <td className="p-1 border-r border-green-500/30">{packet.timestamp}</td>
                  <td className="p-1 border-r border-green-500/30">{packet.source}</td>
                  <td className="p-1 border-r border-green-500/30">{packet.destination}</td>
                  <td className={`p-1 border-r border-green-500/30 ${getProtocolColor(packet.protocol)}`}>
                    {packet.protocol}
                  </td>
                  <td className="p-1 border-r border-green-500/30">{packet.length}</td>
                  <td className="p-1 truncate max-w-xs">{packet.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Packet Details */}
        {selectedPacket && (
          <div className="h-1/3 border-t border-green-500/30 overflow-auto">
            <div className="p-2 bg-gray-900 border-b border-green-500/30 flex items-center justify-between">
              <span className="text-sm font-bold">Packet {selectedPacket.id} Details</span>
              <button className="text-xs flex items-center hover:text-green-400">
                <Download className="h-3 w-3 mr-1" />
                Export
              </button>
            </div>
            <div className="p-2">
              <div className="mb-2">
                <div className="text-xs font-bold mb-1">Frame Information:</div>
                <div className="text-xs ml-4">
                  <div>Arrival Time: {new Date().toLocaleString()}</div>
                  <div>Frame Number: {selectedPacket.id}</div>
                  <div>Frame Length: {selectedPacket.length} bytes</div>
                </div>
              </div>

              <div className="mb-2">
                <div className="text-xs font-bold mb-1">{selectedPacket.protocol} Protocol:</div>
                <div className="text-xs ml-4">
                  <div>Source: {selectedPacket.source}</div>
                  <div>Destination: {selectedPacket.destination}</div>
                  <div>{selectedPacket.info}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold mb-1">Hex Dump:</div>
                <pre className="text-xs font-mono bg-gray-900/50 p-2 overflow-x-auto">{selectedPacket.data}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to get color based on protocol
function getProtocolColor(protocol: PacketType): string {
  switch (protocol) {
    case "TCP":
      return "text-blue-400"
    case "UDP":
      return "text-purple-400"
    case "HTTP":
    case "HTTPS":
      return "text-green-400"
    case "DNS":
      return "text-yellow-400"
    case "ICMP":
      return "text-red-400"
    case "ARP":
      return "text-cyan-400"
    case "TLS":
      return "text-emerald-400"
    default:
      return ""
  }
}
