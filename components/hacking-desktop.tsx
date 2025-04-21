"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Terminal } from "./terminal"
import { NetworkScanner } from "./apps/network-scanner"
import { PasswordCracker } from "./apps/password-cracker"
import { FileEncryptor } from "./apps/file-encryptor"
import { IPTracker } from "./apps/ip-tracker"
import { VulnerabilityScanner } from "./apps/vulnerability-scanner"
import { NmapScanner } from "./apps/nmap-scanner"
import { Wireshark } from "./apps/wireshark"
import { Metasploit } from "./apps/metasploit"
import { HashCalculator } from "./apps/hash-calculator"
import { DnsLookup } from "./apps/dns-lookup"
import { WhoisLookup } from "./apps/whois-lookup"
import { PortScanner } from "./apps/port-scanner"
import { WebVulnScanner } from "./apps/web-vuln-scanner"
import { SocialEngineer } from "./apps/social-engineer"
import { WifiAnalyzer } from "./apps/wifi-analyzer"
import { TaskManager } from "./apps/task-manager"
import { FileManager } from "./apps/file-manager"
import { SystemSpecs } from "./apps/system-specs"
import { SpeedTest } from "./apps/speed-test"
import { AttackMap } from "./apps/attack-map"
import {
  TerminalIcon,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Battery,
  BatteryCharging,
  Key,
  FileText,
  Globe,
  Shield,
  Power,
  X,
  Minimize2,
  Maximize2,
  Menu,
  Hash,
  Database,
  Search,
  Radio,
  Zap,
  Users,
  Server,
  AlertTriangle,
  Network,
  Activity,
  Folder,
  Cpu,
  Bell,
  Map,
  Lock,
} from "lucide-react"

// Add the new app imports
import { OnionBrowser } from "./apps/onion-browser"
import { VpnClient } from "./apps/vpn-client"
// Update the import for the DDoS attack tool
import { DdosAttack } from "./apps/ddos-attack"

type AppWindow = {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
  isOpen: boolean
  isMinimized: boolean
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
}

type WifiNetwork = {
  ssid: string
  strength: number // 0-100
  secured: boolean
  connected: boolean
}

export function HackingDesktop({
  username,
  onLogout,
  welcomeMessage,
}: {
  username: string
  onLogout: () => void
  welcomeMessage: string
}) {
  const [time, setTime] = useState(new Date())
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [windows, setWindows] = useState<AppWindow[]>([])
  const [highestZIndex, setHighestZIndex] = useState(10)
  const [showMobileAppDrawer, setShowMobileAppDrawer] = useState(false)
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true)
  const [showNetworkPanel, setShowNetworkPanel] = useState(false)
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false)
  const [airplaneMode, setAirplaneMode] = useState(false)
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [isCharging, setIsCharging] = useState(true)
  const [notifications, setNotifications] = useState<{ id: string; message: string; time: Date }[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [availableNetworks, setAvailableNetworks] = useState<WifiNetwork[]>([
    { ssid: "MARIO 5G IS BACK", strength: 90, secured: true, connected: true },
    { ssid: "MARIO 2.4G", strength: 85, secured: true, connected: false },
    { ssid: "Neighbor's WiFi", strength: 60, secured: true, connected: false },
    { ssid: "Free Public WiFi", strength: 40, secured: false, connected: false },
    { ssid: "Cafe WiFi", strength: 30, secured: true, connected: false },
  ])

  const [isFullScreenMode, setIsFullScreenMode] = useState(false)
  const [menuTapCount, setMenuTapCount] = useState(0)
  const [menuTapTimer, setMenuTapTimer] = useState<NodeJS.Timeout | null>(null)
  const [showFullScreenSite, setShowFullScreenSite] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Hide welcome message after 5 seconds
  useEffect(() => {
    if (showWelcomeMessage) {
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showWelcomeMessage])

  // Simulate battery drain
  useEffect(() => {
    const interval = setInterval(() => {
      if (isCharging) {
        setBatteryLevel((prev) => Math.min(100, prev + 1))
      } else {
        setBatteryLevel((prev) => Math.max(5, prev - 1))
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [isCharging])

  // Initialize apps
  useEffect(() => {
    // Update the initialApps array in the useEffect to include the new apps
    const initialApps: AppWindow[] = [
      {
        id: "terminal",
        title: "Terminal",
        icon: <TerminalIcon className="h-5 w-5" />,
        content: <Terminal username={username} />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 50, y: 50 },
        size: { width: 600, height: 400 },
      },
      {
        id: "network-scanner",
        title: "Network Scanner",
        icon: <Wifi className="h-5 w-5" />,
        content: <NetworkScanner />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 100, y: 100 },
        size: { width: 650, height: 450 },
      },
      {
        id: "password-cracker",
        title: "Password Cracker",
        icon: <Key className="h-5 w-5" />,
        content: <PasswordCracker />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 150, y: 150 },
        size: { width: 550, height: 400 },
      },
      {
        id: "file-encryptor",
        title: "File Encryptor",
        icon: <FileText className="h-5 w-5" />,
        content: <FileEncryptor />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 200, y: 200 },
        size: { width: 500, height: 450 },
      },
      {
        id: "ip-tracker",
        title: "IP Tracker",
        icon: <Globe className="h-5 w-5" />,
        content: <IPTracker />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 250, y: 250 },
        size: { width: 600, height: 500 },
      },
      {
        id: "vulnerability-scanner",
        title: "Vulnerability Scanner",
        icon: <Shield className="h-5 w-5" />,
        content: <VulnerabilityScanner />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 300, y: 300 },
        size: { width: 650, height: 450 },
      },
      // New tools
      {
        id: "nmap-scanner",
        title: "Nmap Scanner",
        icon: <Network className="h-5 w-5" />,
        content: <NmapScanner />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 80, y: 80 },
        size: { width: 620, height: 480 },
      },
      {
        id: "wireshark",
        title: "Packet Analyzer",
        icon: <Zap className="h-5 w-5" />,
        content: <Wireshark />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 120, y: 120 },
        size: { width: 700, height: 500 },
      },
      {
        id: "metasploit",
        title: "Exploit Framework",
        icon: <AlertTriangle className="h-5 w-5" />,
        content: <Metasploit />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 160, y: 160 },
        size: { width: 650, height: 480 },
      },
      {
        id: "hash-calculator",
        title: "Hash Calculator",
        icon: <Hash className="h-5 w-5" />,
        content: <HashCalculator />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 200, y: 200 },
        size: { width: 550, height: 400 },
      },
      {
        id: "dns-lookup",
        title: "DNS Lookup",
        icon: <Database className="h-5 w-5" />,
        content: <DnsLookup />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 240, y: 240 },
        size: { width: 580, height: 420 },
      },
      {
        id: "whois-lookup",
        title: "WHOIS Lookup",
        icon: <Search className="h-5 w-5" />,
        content: <WhoisLookup />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 280, y: 280 },
        size: { width: 600, height: 450 },
      },
      {
        id: "port-scanner",
        title: "Port Scanner",
        icon: <Server className="h-5 w-5" />,
        content: <PortScanner />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 320, y: 320 },
        size: { width: 580, height: 420 },
      },
      {
        id: "web-vuln-scanner",
        title: "Web Vulnerability Scanner",
        icon: <Globe className="h-5 w-5" />,
        content: <WebVulnScanner />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 360, y: 360 },
        size: { width: 650, height: 480 },
      },
      {
        id: "social-engineer",
        title: "Social Engineering Toolkit",
        icon: <Users className="h-5 w-5" />,
        content: <SocialEngineer />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 400, y: 400 },
        size: { width: 620, height: 450 },
      },
      {
        id: "wifi-analyzer",
        title: "WiFi Analyzer",
        icon: <Radio className="h-5 w-5" />,
        content: <WifiAnalyzer />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 440, y: 440 },
        size: { width: 600, height: 450 },
      },
      {
        id: "task-manager",
        title: "Task Manager",
        icon: <Activity className="h-5 w-5" />,
        content: <TaskManager />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 180, y: 180 },
        size: { width: 650, height: 450 },
      },
      {
        id: "file-manager",
        title: "File Manager",
        icon: <Folder className="h-5 w-5" />,
        content: <FileManager />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 220, y: 220 },
        size: { width: 700, height: 500 },
      },
      {
        id: "system-specs",
        title: "System Specs",
        icon: <Cpu className="h-5 w-5" />,
        content: <SystemSpecs />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 260, y: 260 },
        size: { width: 650, height: 450 },
      },
      {
        id: "speed-test",
        title: "Speed Test",
        icon: <Zap className="h-5 w-5" />,
        content: <SpeedTest />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 300, y: 300 },
        size: { width: 700, height: 500 },
      },
      // Add the new apps
      {
        id: "onion-browser",
        title: "Onion Browser",
        icon: <Globe className="h-5 w-5 text-purple-400" />,
        content: <OnionBrowser />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 340, y: 340 },
        size: { width: 800, height: 600 },
      },
      {
        id: "vpn-client",
        title: "VPN Client",
        icon: <Shield className="h-5 w-5 text-blue-400" />,
        content: <VpnClient />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 380, y: 380 },
        size: { width: 700, height: 550 },
      },
      // Add the Attack Map app
      {
        id: "attack-map",
        title: "Attack Map",
        icon: <Map className="h-5 w-5 text-red-400" />,
        content: <AttackMap />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 100, y: 100 },
        size: { width: 900, height: 600 },
      },
      // Then in the initialApps array, replace the DdosSimulator with:
      {
        id: "ddos-attack",
        title: "DDoS Attack",
        icon: <Zap className="h-5 w-5 text-red-400" />,
        content: <DdosAttack />,
        isOpen: false,
        isMinimized: false,
        zIndex: 10,
        position: { x: 420, y: 420 },
        size: { width: 900, height: 600 },
      },
    ]

    setWindows(initialApps)
  }, [username])

  const addNotification = (message: string) => {
    const newNotification = {
      id: `notif-${Date.now()}`,
      message,
      time: new Date(),
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const openApp = (id: string) => {
    setWindows((prev) =>
      prev.map((window) => {
        if (window.id === id) {
          return {
            ...window,
            isOpen: true,
            isMinimized: false,
            zIndex: highestZIndex + 1,
          }
        }
        return window
      }),
    )

    setActiveWindowId(id)
    setHighestZIndex((prev) => prev + 1)
    setShowStartMenu(false)
    setShowMobileAppDrawer(false)
  }

  const closeApp = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    setWindows((prev) =>
      prev.map((window) => {
        if (window.id === id) {
          return {
            ...window,
            isOpen: false,
          }
        }
        return window
      }),
    )

    if (activeWindowId === id) {
      setActiveWindowId(null)
    }
  }

  const minimizeApp = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    setWindows((prev) =>
      prev.map((window) => {
        if (window.id === id) {
          return {
            ...window,
            isMinimized: true,
          }
        }
        return window
      }),
    )

    if (activeWindowId === id) {
      setActiveWindowId(null)
    }
  }

  const maximizeApp = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    // For simplicity, we'll just make it full screen
    // In a real app, you'd toggle between a saved size/position and full screen
    setWindows((prev) =>
      prev.map((window) => {
        if (window.id === id) {
          return {
            ...window,
            position: { x: 0, y: 0 },
            size: { width: window.innerWidth || 800, height: window.innerHeight - 40 || 600 },
          }
        }
        return window
      }),
    )
  }

  const bringToFront = (id: string) => {
    if (id === activeWindowId) return

    setWindows((prev) =>
      prev.map((window) => {
        if (window.id === id) {
          return {
            ...window,
            zIndex: highestZIndex + 1,
          }
        }
        return window
      }),
    )

    setActiveWindowId(id)
    setHighestZIndex((prev) => prev + 1)
  }

  const startDrag = (id: string, e: React.MouseEvent) => {
    e.preventDefault()

    bringToFront(id)

    const window = windows.find((w) => w.id === id)
    if (!window) return

    const startX = e.clientX
    const startY = e.clientY
    const startLeft = window.position.x
    const startTop = window.position.y

    const onMouseMove = (e: MouseEvent) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id === id) {
            return {
              ...w,
              position: {
                x: startLeft + e.clientX - startX,
                y: startTop + e.clientY - startY,
              },
            }
          }
          return w
        }),
      )
    }

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  const startResize = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    bringToFront(id)

    const window = windows.find((w) => w.id === id)
    if (!window) return

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = window.size.width
    const startHeight = window.size.height

    const onMouseMove = (e: MouseEvent) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id === id) {
            return {
              ...w,
              size: {
                width: Math.max(300, startWidth + e.clientX - startX),
                height: Math.max(200, startHeight + e.clientY - startY),
              },
            }
          }
          return w
        }),
      )
    }

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  const toggleWifi = () => {
    if (airplaneMode) return // Can't toggle WiFi in airplane mode

    setWifiEnabled((prev) => !prev)

    // If turning WiFi on, connect to the first network
    if (!wifiEnabled) {
      setAvailableNetworks((prev) =>
        prev.map((network, index) =>
          index === 0 ? { ...network, connected: true } : { ...network, connected: false },
        ),
      )
      addNotification(`Connected to ${availableNetworks[0].ssid}`)
    } else {
      // Disconnect from all networks when turning WiFi off
      setAvailableNetworks((prev) => prev.map((network) => ({ ...network, connected: false })))
      addNotification(`WiFi disabled`)
    }
  }

  const toggleBluetooth = () => {
    if (airplaneMode) return // Can't toggle Bluetooth in airplane mode

    setBluetoothEnabled((prev) => !prev)
    addNotification(`Bluetooth ${!bluetoothEnabled ? "enabled" : "disabled"}`)
  }

  const toggleAirplaneMode = () => {
    setAirplaneMode((prev) => !prev)

    if (!airplaneMode) {
      // Turning airplane mode ON
      const previousWifiState = wifiEnabled
      const previousBluetoothState = bluetoothEnabled

      setWifiEnabled(false)
      setBluetoothEnabled(false)

      // Disconnect from all networks
      setAvailableNetworks((prev) => prev.map((network) => ({ ...network, connected: false })))

      addNotification(`Airplane mode enabled. WiFi and Bluetooth disabled.`)
    } else {
      // Turning airplane mode OFF - don't automatically enable WiFi/Bluetooth
      addNotification(`Airplane mode disabled. You can now enable WiFi and Bluetooth.`)
    }
  }

  const connectToNetwork = (ssid: string) => {
    if (!wifiEnabled) {
      setWifiEnabled(true)
    }

    setAvailableNetworks((prev) =>
      prev.map((network) => ({
        ...network,
        connected: network.ssid === ssid,
      })),
    )

    addNotification(`Connected to ${ssid}`)
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  const handleMenuTap = () => {
    // Increment tap count
    const newCount = menuTapCount + 1
    setMenuTapCount(newCount)

    // Clear existing timer if there is one
    if (menuTapTimer) {
      clearTimeout(menuTapTimer)
    }

    // Set a new timer to reset the count after 2 seconds
    const timer = setTimeout(() => {
      setMenuTapCount(0)
    }, 2000)

    setMenuTapTimer(timer)

    // If this is the third tap, enter true full screen mode
    if (newCount === 3) {
      // Request full screen mode using the browser's Fullscreen API
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`)
        })
      } else if (document.documentElement.webkitRequestFullscreen) {
        /* Safari */
        document.documentElement.webkitRequestFullscreen()
      } else if (document.documentElement.msRequestFullscreen) {
        /* IE11 */
        document.documentElement.msRequestFullscreen()
      }

      setMenuTapCount(0)
      if (menuTapTimer) clearTimeout(menuTapTimer)
    } else {
      // Normal menu toggle behavior for non-third taps
      setShowStartMenu(!showStartMenu)
    }
  }

  // Add this useEffect to handle fullscreen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFullScreen = document.fullscreenElement !== null
      setIsFullScreenMode(isFullScreen)
    }

    document.addEventListener("fullscreenchange", handleFullScreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange)
    document.addEventListener("mozfullscreenchange", handleFullScreenChange)
    document.addEventListener("MSFullscreenChange", handleFullScreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange)
    }
  }, [])

  const FullScreenSite = () => (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
      <div className="bg-green-900/30 p-2 flex justify-between items-center border-b border-green-500/50">
        <div className="text-green-400 font-bold">DARKNET ACCESS GRANTED</div>
        <button onClick={() => setShowFullScreenSite(false)} className="text-red-400 hover:text-red-300">
          ×
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl text-green-400 mb-4">Welcome to the Shadow Network</h1>
          <div className="mb-6 text-green-300">
            <p>
              You've discovered the hidden access point. This network is not monitored and provides anonymous access to
              restricted resources.
            </p>
            <p className="mt-2">All activities here are encrypted and untraceable.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-green-500/30 bg-black/50 p-4">
              <h2 className="text-lg text-green-400 mb-2">Secure Communications</h2>
              <p className="text-sm text-green-300/70">
                End-to-end encrypted messaging system with self-destructing messages.
              </p>
              <button className="mt-2 bg-green-900/50 border border-green-500/30 px-3 py-1 text-sm hover:bg-green-900/70">
                Access Channel
              </button>
            </div>

            <div className="border border-green-500/30 bg-black/50 p-4">
              <h2 className="text-lg text-green-400 mb-2">Data Exchange</h2>
              <p className="text-sm text-green-300/70">Anonymous file sharing with zero metadata retention.</p>
              <button className="mt-2 bg-green-900/50 border border-green-500/30 px-3 py-1 text-sm hover:bg-green-900/70">
                Open Vault
              </button>
            </div>

            <div className="border border-green-500/30 bg-black/50 p-4">
              <h2 className="text-lg text-green-400 mb-2">Network Access</h2>
              <p className="text-sm text-green-300/70">Secure routing through multiple proxy layers.</p>
              <button className="mt-2 bg-green-900/50 border border-green-500/30 px-3 py-1 text-sm hover:bg-green-900/70">
                Connect
              </button>
            </div>

            <div className="border border-green-500/30 bg-black/50 p-4">
              <h2 className="text-lg text-green-400 mb-2">Marketplace</h2>
              <p className="text-sm text-green-300/70">Trading platform for digital assets and services.</p>
              <button className="mt-2 bg-green-900/50 border border-green-500/30 px-3 py-1 text-sm hover:bg-green-900/70">
                Browse
              </button>
            </div>
          </div>

          <div className="border border-green-500/30 bg-black/50 p-4 mb-6">
            <h2 className="text-lg text-green-400 mb-2">Terminal Access</h2>
            <div className="font-mono text-sm text-green-300/90 bg-black/70 p-2 mb-2">
              <div>root@shadow:~# connect --secure --anonymous</div>
              <div>Establishing secure connection...</div>
              <div>Connection established through 7 proxy nodes.</div>
              <div>Your current identity: Ghost_Node_7842</div>
              <div>root@shadow:~# _</div>
            </div>
            <button className="bg-green-900/50 border border-green-500/30 px-3 py-1 text-sm hover:bg-green-900/70">
              Open Terminal
            </button>
          </div>

          <div className="text-xs text-green-500/50 text-center">
            <p>Access ID: {Math.random().toString(36).substring(2, 15)}</p>
            <p>Session encrypted with AES-256</p>
          </div>
        </div>
      </div>
    </div>
  )

  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (menuTapTimer) {
        clearTimeout(menuTapTimer)
      }
    }
  }, [menuTapTimer])

  return (
    <div
      className={`min-h-screen ${isFullScreenMode ? "fixed inset-0 z-50" : ""} bg-black text-green-500 font-mono flex flex-col`}
    >
      {showFullScreenSite && <FullScreenSite />}
      {/* Desktop */}
      <div
        className={`flex-1 relative ${isFullScreenMode ? "overflow-auto" : "overflow-hidden"} bg-gradient-to-br from-gray-900 to-black`}
      >
        {/* Welcome Message */}
        {showWelcomeMessage && welcomeMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-900/80 border border-green-500 px-6 py-3 rounded-md shadow-lg animate-fadeIn">
            <p className="text-center text-green-300">{welcomeMessage}</p>
          </div>
        )}

        {/* Notifications */}
        <div className="absolute top-4 right-4 z-40 flex flex-col gap-2 max-w-xs">
          {notifications.slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className="bg-green-900/80 border border-green-500 px-4 py-2 rounded-md shadow-lg animate-fadeIn flex justify-between"
            >
              <div>
                <p className="text-sm text-green-300">{notification.message}</p>
                <p className="text-xs text-green-500/70">{notification.time.toLocaleTimeString()}</p>
              </div>
              <button
                className="ml-2 text-green-300 hover:text-green-100"
                onClick={() => dismissNotification(notification.id)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Desktop Icons */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 p-4">
          {windows.map((app) => (
            <div
              key={app.id}
              className="flex flex-col items-center justify-center p-2 hover:bg-green-900/20 rounded cursor-pointer"
              onClick={() => openApp(app.id)}
            >
              <div className="w-12 h-12 flex items-center justify-center border border-green-500/50 rounded bg-black/50">
                {app.icon}
              </div>
              <span className="text-xs mt-1 text-center">{app.title}</span>
            </div>
          ))}
        </div>

        {/* Windows */}
        {windows.map(
          (window) =>
            window.isOpen &&
            !window.isMinimized && (
              <div
                key={window.id}
                className="absolute border border-green-500/70 bg-black/90 shadow-lg overflow-hidden flex flex-col"
                style={{
                  left: isMobile ? 0 : `${window.position.x}px`,
                  top: isMobile ? 0 : `${window.position.y}px`,
                  width: isMobile ? "100%" : `${window.size.width}px`,
                  height: isMobile ? "calc(100% - 40px)" : `${window.size.height}px`,
                  zIndex: window.zIndex,
                }}
                onClick={() => bringToFront(window.id)}
              >
                {/* Window Title Bar */}
                <div
                  className="bg-green-900/50 p-2 flex items-center cursor-move"
                  onMouseDown={(e) => !isMobile && startDrag(window.id, e)}
                >
                  <div className="flex items-center">
                    {window.icon}
                    <span className="ml-2 text-sm">{window.title}</span>
                  </div>
                  <div className="ml-auto flex items-center space-x-1">
                    {!isMobile && (
                      <>
                        <button
                          className="p-1 hover:bg-green-700/50 rounded"
                          onClick={(e) => minimizeApp(window.id, e)}
                        >
                          <Minimize2 className="h-3 w-3" />
                        </button>
                        <button
                          className="p-1 hover:bg-green-700/50 rounded"
                          onClick={(e) => maximizeApp(window.id, e)}
                        >
                          <Maximize2 className="h-3 w-3" />
                        </button>
                      </>
                    )}
                    <button className="p-1 hover:bg-red-700/50 rounded" onClick={(e) => closeApp(window.id, e)}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Window Content */}
                <div className="flex-1 overflow-auto">{window.content}</div>

                {/* Resize Handle (desktop only) */}
                {!isMobile && (
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                    onMouseDown={(e) => startResize(window.id, e)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M14 14L14 8M14 14L8 14M14 14L8 8"
                        stroke="#22c55e"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ),
        )}
      </div>

      {/* Taskbar */}
      <div className="h-10 bg-gray-900 border-t border-green-500/30 flex items-center px-2">
        {/* Start Button */}
        <div className="relative">
          <button className="p-2 hover:bg-green-900/50 rounded flex items-center" onClick={handleMenuTap}>
            <Menu className="h-5 w-5 mr-1" />
            <span className="text-xs hidden sm:inline">MENU</span>
          </button>

          {/* Start Menu */}
          {showStartMenu && (
            <div className="absolute bottom-full left-0 mb-1 w-48 bg-gray-900 border border-green-500/50 shadow-lg z-50">
              <div className="p-2 border-b border-green-500/30">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-900/50 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">{username.charAt(0)}</span>
                  </div>
                  <span className="ml-2 text-sm">{username}</span>
                </div>
              </div>

              <div className="py-1 max-h-[60vh] overflow-y-auto">
                {windows.map((app) => (
                  <button
                    key={app.id}
                    className="w-full text-left px-3 py-2 hover:bg-green-900/30 flex items-center"
                    onClick={() => openApp(app.id)}
                  >
                    {app.icon}
                    <span className="ml-2 text-sm">{app.title}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-green-500/30 p-1">
                <button
                  className="w-full text-left px-3 py-2 hover:bg-red-900/30 flex items-center text-red-400"
                  onClick={onLogout}
                >
                  <Power className="h-5 w-5" />
                  <span className="ml-2 text-sm">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Open Windows */}
        <div className="flex-1 flex items-center space-x-1 ml-2 overflow-x-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-transparent">
          {windows
            .filter((w) => w.isOpen)
            .map((window) => (
              <button
                key={window.id}
                className={`px-2 py-1 text-xs flex items-center rounded truncate ${activeWindowId === window.id ? "bg-green-900/50 border border-green-500/50" : "hover:bg-green-900/30"}`}
                onClick={() => {
                  if (window.isMinimized) {
                    setWindows((prev) =>
                      prev.map((w) => {
                        if (w.id === window.id) {
                          return { ...w, isMinimized: false }
                        }
                        return w
                      }),
                    )
                  }
                  bringToFront(window.id)
                }}
              >
                {window.icon}
                <span className="ml-1 hidden sm:inline truncate max-w-[100px]">{window.title}</span>
              </button>
            ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center space-x-2 ml-auto">
          {/* Notifications */}
          <button
            className="relative p-1 hover:bg-green-900/30 rounded"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </button>

          {/* Volume */}
          <button className="p-1 hover:bg-green-900/30 rounded" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Battery */}
          <div className="flex items-center text-xs">
            {isCharging ? <BatteryCharging className="h-4 w-4 mr-1" /> : <Battery className="h-4 w-4 mr-1" />}
            <span>{batteryLevel}%</span>
          </div>

          <div className="text-xs">{time.toLocaleTimeString()}</div>
        </div>
      </div>

      {showNetworkPanel && (
        <div className="absolute bottom-10 right-4 w-64 bg-gray-900 border border-green-500/50 shadow-lg z-50 p-3">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold">Network</h3>
            <button className="text-xs hover:text-green-400" onClick={() => setShowNetworkPanel(false)}>
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Network Controls - All in the same navigation plane */}
          <div className="flex space-x-3 mb-3 border-b border-green-500/30 pb-3">
            <div className="flex flex-col items-center">
              <button
                className={`p-2 rounded-full ${wifiEnabled ? "bg-green-900/50" : "bg-gray-800/50"} ${airplaneMode ? "opacity-50" : ""}`}
                onClick={() => !airplaneMode && toggleWifi()}
                disabled={airplaneMode}
              >
                {wifiEnabled ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
              </button>
              <span className="text-xs mt-1">WiFi</span>
            </div>
          </div>

          {wifiEnabled && (
            <div className="mt-2 space-y-2">
              <div className="text-xs font-bold mb-1">Available Networks</div>
              {availableNetworks.map((network) => (
                <div
                  key={network.ssid}
                  className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                    network.connected ? "bg-green-900/30 border border-green-500/50" : "hover:bg-green-900/20"
                  }`}
                  onClick={() => connectToNetwork(network.ssid)}
                >
                  <div className="flex items-center">
                    <Wifi className="h-3 w-3 mr-1" />
                    <span className="text-xs">{network.ssid}</span>
                    {network.secured && <Lock className="h-2 w-2 ml-1 text-yellow-400" />}
                  </div>
                  <div className="flex items-center">
                    <div className="flex space-x-0.5">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className={`w-0.5 ${bar * 25 <= network.strength ? "bg-green-500" : "bg-gray-700"}`}
                          style={{ height: `${bar * 2 + 2}px` }}
                        ></div>
                      ))}
                    </div>
                    {network.connected && <div className="w-1.5 h-1.5 rounded-full bg-green-500 ml-1"></div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="w-full text-xs bg-green-900/50 hover:bg-green-900/30 rounded py-2">Refresh</button>
        </div>
      )}
    </div>
  )
}
