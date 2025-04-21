"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AlertTriangle, RefreshCw, Search, Shield, Check } from "lucide-react"

type Exploit = {
  id: string
  name: string
  description: string
  type: "exploit" | "auxiliary" | "post" | "payload"
  platform: string
  date: string
  rank: "excellent" | "great" | "good" | "normal" | "average" | "low"
  cve?: string
}

type Target = {
  id: string
  name: string
  ip: string
  os: string
  status: "vulnerable" | "patched" | "unknown"
}

export function Metasploit() {
  const [activeTab, setActiveTab] = useState<"exploits" | "targets" | "console">("exploits")
  const [searchTerm, setSearchTerm] = useState("")
  const [exploits, setExploits] = useState<Exploit[]>([])
  const [selectedExploit, setSelectedExploit] = useState<Exploit | null>(null)
  const [targets, setTargets] = useState<Target[]>([])
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null)
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    "Metasploit Framework v6.2.26-dev",
    "=[ metasploit v6.2.26-dev ]",
    "+ -- --=[ 2264 exploits - 1189 auxiliary - 404 post ]",
    "+ -- --=[ 951 payloads - 45 encoders - 11 nops ]",
    "+ -- --=[ 9 evasion ]",
    "",
    "msf6 >",
  ])
  const [consoleInput, setConsoleInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExploiting, setIsExploiting] = useState(false)

  // Initialize with fake data
  useEffect(() => {
    generateFakeExploits()
    generateFakeTargets()
  }, [])

  const generateFakeExploits = () => {
    const exploitTypes = ["exploit", "auxiliary", "post", "payload"] as const
    const platforms = ["Windows", "Linux", "macOS", "Multi", "Android", "iOS"]
    const ranks = ["excellent", "great", "good", "normal", "average", "low"] as const

    const fakeExploits: Exploit[] = []

    for (let i = 1; i <= 50; i++) {
      const type = exploitTypes[Math.floor(Math.random() * exploitTypes.length)]
      const platform = platforms[Math.floor(Math.random() * platforms.length)]
      const rank = ranks[Math.floor(Math.random() * ranks.length)]

      let name = ""
      let description = ""
      let cve = undefined

      if (type === "exploit") {
        const services = ["smb", "ssh", "http", "ftp", "rdp", "mysql", "postgresql"]
        const service = services[Math.floor(Math.random() * services.length)]
        const vulnTypes = ["buffer_overflow", "rce", "auth_bypass", "sqli", "file_upload"]
        const vulnType = vulnTypes[Math.floor(Math.random() * vulnTypes.length)]

        name = `${platform.toLowerCase()}/${service}/${vulnType}`
        description = `${platform} ${service.toUpperCase()} service ${vulnType.replace("_", " ")} vulnerability`

        // Generate a random CVE
        const year = 2015 + Math.floor(Math.random() * 8)
        const id = 1000 + Math.floor(Math.random() * 9000)
        cve = `CVE-${year}-${id}`
      } else if (type === "auxiliary") {
        const auxTypes = ["scanner", "fuzzer", "dos", "spoof", "gather"]
        const auxType = auxTypes[Math.floor(Math.random() * auxTypes.length)]

        name = `auxiliary/${auxType}/${platform.toLowerCase()}_service_discovery`
        description = `${platform} service discovery and enumeration`
      } else if (type === "post") {
        const postTypes = ["gather", "escalate", "manage", "recon"]
        const postType = postTypes[Math.floor(Math.random() * postTypes.length)]

        name = `post/${platform.toLowerCase()}/${postType}/credentials`
        description = `${platform} post-exploitation ${postType} module`
      } else {
        const payloadTypes = ["cmd", "meterpreter", "shell", "dllinject"]
        const payloadType = payloadTypes[Math.floor(Math.random() * payloadTypes.length)]

        name = `payload/${platform.toLowerCase()}/${payloadType}/reverse_tcp`
        description = `${platform} ${payloadType} reverse TCP payload`
      }

      // Generate a random date within the last 3 years
      const date = new Date()
      date.setFullYear(date.getFullYear() - Math.floor(Math.random() * 3))
      date.setMonth(Math.floor(Math.random() * 12))
      date.setDate(Math.floor(Math.random() * 28) + 1)

      fakeExploits.push({
        id: `MSF-${i}`,
        name,
        description,
        type,
        platform,
        date: date.toISOString().split("T")[0],
        rank,
        cve,
      })
    }

    setExploits(fakeExploits)
  }

  const generateFakeTargets = () => {
    const operatingSystems = [
      "Windows 10 Pro",
      "Windows Server 2019",
      "Ubuntu 20.04 LTS",
      "Debian 11",
      "CentOS 8",
      "macOS 12.0",
      "Kali Linux 2022.1",
    ]

    const fakeTargets: Target[] = []

    for (let i = 1; i <= 10; i++) {
      const os = operatingSystems[Math.floor(Math.random() * operatingSystems.length)]
      const status = ["vulnerable", "patched", "unknown"][Math.floor(Math.random() * 3)] as
        | "vulnerable"
        | "patched"
        | "unknown"

      fakeTargets.push({
        id: `TGT-${i}`,
        name: `Target-${i}`,
        ip: `192.168.1.${10 + i}`,
        os,
        status,
      })
    }

    setTargets(fakeTargets)
  }

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!consoleInput.trim()) return

    // Add the command to the console output
    setConsoleOutput((prev) => [...prev, `msf6 > ${consoleInput}`])

    // Process the command
    processConsoleCommand(consoleInput)

    // Clear the input
    setConsoleInput("")
  }

  const processConsoleCommand = (command: string) => {
    const cmd = command.trim().toLowerCase()

    if (cmd === "help") {
      setConsoleOutput((prev) => [
        ...prev,
        "Core Commands",
        "=============",
        "    Command       Description",
        "    -------       -----------",
        "    help          Help menu",
        "    use           Selects a module by name",
        "    search        Searches module names and descriptions",
        "    show          Displays modules of a given type",
        "    exit          Exit the console",
        "",
        "msf6 >",
      ])
    } else if (cmd.startsWith("search")) {
      setIsLoading(true)

      // Simulate search delay
      setTimeout(() => {
        const searchTerm = cmd.replace("search", "").trim()

        if (!searchTerm) {
          setConsoleOutput((prev) => [...prev, "Usage: search <keyword>", "", "msf6 >"])
          setIsLoading(false)
          return
        }

        const results = exploits.filter((e) => e.name.includes(searchTerm) || e.description.includes(searchTerm))

        if (results.length === 0) {
          setConsoleOutput((prev) => [...prev, `No results for "${searchTerm}"`, "", "msf6 >"])
        } else {
          setConsoleOutput((prev) => [
            ...prev,
            `Matching Modules (${results.length})`,
            "==================",
            "   #  Name                                      Disclosure Date  Rank       Description",
            "   -  ----                                      ---------------  ----       -----------",
            ...results
              .slice(0, 10)
              .map((e, i) => `   ${i}  ${e.name.padEnd(40)} ${e.date}  ${e.rank.padEnd(10)} ${e.description}`),
            "",
            "msf6 >",
          ])
        }

        setIsLoading(false)
      }, 500)
    } else if (cmd.startsWith("use")) {
      const moduleName = cmd.replace("use", "").trim()

      if (!moduleName) {
        setConsoleOutput((prev) => [...prev, "Usage: use <module_name>", "", "msf6 >"])
        return
      }

      const module = exploits.find((e) => e.name === moduleName)

      if (!module) {
        setConsoleOutput((prev) => [...prev, `Module '${moduleName}' not found`, "", "msf6 >"])
        return
      }

      setSelectedExploit(module)

      setConsoleOutput((prev) => [
        ...prev,
        `Using ${module.type}/${module.name}`,
        "",
        `msf6 ${module.type}(${module.name}) >`,
      ])
    } else if (cmd === "show options" && selectedExploit) {
      setConsoleOutput((prev) => [
        ...prev,
        "Module options (exploit/windows/smb/ms17_010_eternalblue):",
        "",
        "   Name           Current Setting  Required  Description",
        "   ----           ---------------  --------  -----------",
        "   RHOSTS                          yes       The target host(s)",
        "   RPORT          445              yes       The target port",
        "   SMBDomain      .                no        The Windows domain to use for authentication",
        "   SMBPass                         no        The password for the specified username",
        "   SMBUser                         no        The username to authenticate as",
        "   VERIFY_ARCH    true             yes       Check if remote architecture matches exploit Target",
        "   VERIFY_TARGET  true             yes       Check if remote OS matches exploit Target",
        "",
        "Exploit target:",
        "",
        "   Id  Name",
        "   --  ----",
        "   0   Windows 7 and Server 2008 R2 (x64) All Service Packs",
        "",
        `msf6 ${selectedExploit.type}(${selectedExploit.name}) >`,
      ])
    } else if (cmd.startsWith("set") && selectedExploit) {
      const parts = cmd.split(" ")

      if (parts.length < 3) {
        setConsoleOutput((prev) => [
          ...prev,
          "Usage: set <option> <value>",
          "",
          `msf6 ${selectedExploit.type}(${selectedExploit.name}) >`,
        ])
        return
      }

      const option = parts[1].toUpperCase()
      const value = parts.slice(2).join(" ")

      setConsoleOutput((prev) => [
        ...prev,
        `${option} => ${value}`,
        "",
        `msf6 ${selectedExploit.type}(${selectedExploit.name}) >`,
      ])
    } else if (cmd === "exploit" && selectedExploit) {
      setIsExploiting(true)

      // Simulate exploitation
      setConsoleOutput((prev) => [
        ...prev,
        "[*] Started reverse TCP handler on 192.168.1.100:4444",
        "[*] 192.168.1.20:445 - Connecting to target for exploitation...",
      ])

      setTimeout(() => {
        setConsoleOutput((prev) => [
          ...prev,
          "[+] 192.168.1.20:445 - Connection established for exploitation",
          "[*] 192.168.1.20:445 - Trying exploit with 12 Grooming Allocations...",
          "[*] 192.168.1.20:445 - Sending all but last fragment of exploit packet",
          "[*] 192.168.1.20:445 - Starting non-paged pool grooming",
        ])
      }, 1000)

      setTimeout(() => {
        setConsoleOutput((prev) => [
          ...prev,
          "[+] 192.168.1.20:445 - Sending SMBv2 buffers",
          "[+] 192.168.1.20:445 - Sending final SMBv2 buffers",
          "[*] 192.168.1.20:445 - Sending last fragment of exploit packet!",
          "[*] 192.168.1.20:445 - Receiving response from exploit packet",
          "[+] 192.168.1.20:445 - ETERNALBLUE overwrite completed successfully (0xC000000D)!",
          "[*] 192.168.1.20:445 - Sending egg to corrupted connection",
          "[*] 192.168.1.20:445 - Triggering free of corrupted buffer...",
        ])
      }, 2000)

      setTimeout(() => {
        setConsoleOutput((prev) => [
          ...prev,
          "[*] Sending stage (201283 bytes) to 192.168.1.20",
          "[*] Meterpreter session 1 opened (192.168.1.100:4444 -> 192.168.1.20:49162) at 2023-05-01 15:30:45 -0400",
          "",
          "meterpreter > ",
        ])
        setIsExploiting(false)
      }, 3000)
    } else if (cmd === "exit") {
      if (selectedExploit) {
        setSelectedExploit(null)
        setConsoleOutput((prev) => [...prev, "", "msf6 >"])
      } else {
        setConsoleOutput((prev) => [...prev, "Exiting console...", ""])
      }
    } else {
      setConsoleOutput((prev) => [
        ...prev,
        `[-] Unknown command: ${cmd}`,
        "",
        selectedExploit ? `msf6 ${selectedExploit.type}(${selectedExploit.name}) >` : "msf6 >",
      ])
    }
  }

  const searchExploits = () => {
    if (!searchTerm) return exploits

    return exploits.filter(
      (exploit) =>
        exploit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exploit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exploit.cve && exploit.cve.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "excellent":
        return "text-green-400"
      case "great":
        return "text-emerald-400"
      case "good":
        return "text-cyan-400"
      case "normal":
        return "text-blue-400"
      case "average":
        return "text-yellow-400"
      case "low":
        return "text-red-400"
      default:
        return ""
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vulnerable":
        return "text-red-400"
      case "patched":
        return "text-green-400"
      case "unknown":
        return "text-yellow-400"
      default:
        return ""
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "vulnerable":
        return <AlertTriangle className="h-4 w-4" />
      case "patched":
        return <Check className="h-4 w-4" />
      case "unknown":
        return <Search className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      <div className="mb-3">
        <div className="flex space-x-1">
          <button
            className={`px-3 py-1 text-xs uppercase ${activeTab === "exploits" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
            onClick={() => setActiveTab("exploits")}
          >
            Exploits
          </button>
          <button
            className={`px-3 py-1 text-xs uppercase ${activeTab === "targets" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
            onClick={() => setActiveTab("targets")}
          >
            Targets
          </button>
          <button
            className={`px-3 py-1 text-xs uppercase ${activeTab === "console" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
            onClick={() => setActiveTab("console")}
          >
            Console
          </button>
        </div>
      </div>

      <div className="flex-1 border border-green-500/30 overflow-hidden">
        {activeTab === "exploits" && (
          <div className="h-full flex flex-col">
            <div className="p-2 border-b border-green-500/30 flex items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500/50" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search exploits..."
                  className="w-full bg-gray-900 border border-green-500/50 p-2 pl-8 text-sm"
                />
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Exploit List */}
              <div className="w-1/2 border-r border-green-500/30 overflow-auto">
                <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-xs font-bold grid grid-cols-3">
                  <div>Name</div>
                  <div>Platform</div>
                  <div>Rank</div>
                </div>

                <div className="divide-y divide-green-500/20">
                  {searchExploits().map((exploit) => (
                    <div
                      key={exploit.id}
                      className={`p-2 text-xs cursor-pointer hover:bg-green-900/20 ${selectedExploit?.id === exploit.id ? "bg-green-900/30" : ""}`}
                      onClick={() => setSelectedExploit(exploit)}
                    >
                      <div className="grid grid-cols-3">
                        <div className="truncate">{exploit.name}</div>
                        <div>{exploit.platform}</div>
                        <div className={getRankColor(exploit.rank)}>{exploit.rank}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exploit Details */}
              <div className="w-1/2 overflow-auto">
                {selectedExploit ? (
                  <div className="p-3">
                    <div className="text-lg mb-3">{selectedExploit.name}</div>

                    <div className="mb-3">
                      <div className="text-xs text-green-500/70">Description:</div>
                      <div className="text-sm">{selectedExploit.description}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div>
                        <div className="text-xs text-green-500/70">Type:</div>
                        <div className="capitalize">{selectedExploit.type}</div>
                      </div>
                      <div>
                        <div className="text-xs text-green-500/70">Platform:</div>
                        <div>{selectedExploit.platform}</div>
                      </div>
                      <div>
                        <div className="text-xs text-green-500/70">Rank:</div>
                        <div className={getRankColor(selectedExploit.rank)}>{selectedExploit.rank}</div>
                      </div>
                      <div>
                        <div className="text-xs text-green-500/70">Date:</div>
                        <div>{selectedExploit.date}</div>
                      </div>
                      {selectedExploit.cve && (
                        <div className="col-span-2">
                          <div className="text-xs text-green-500/70">CVE:</div>
                          <div className="text-yellow-400">{selectedExploit.cve}</div>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-green-500/70 mb-1">Options:</div>
                      <div className="border border-green-500/30">
                        <div className="bg-gray-900 p-2 text-xs font-bold grid grid-cols-3">
                          <div>Name</div>
                          <div>Required</div>
                          <div>Description</div>
                        </div>
                        <div className="divide-y divide-green-500/20 text-xs">
                          <div className="p-2 grid grid-cols-3">
                            <div>RHOSTS</div>
                            <div className="text-red-400">yes</div>
                            <div>The target host(s)</div>
                          </div>
                          <div className="p-2 grid grid-cols-3">
                            <div>RPORT</div>
                            <div>no</div>
                            <div>The target port (default: varies)</div>
                          </div>
                          <div className="p-2 grid grid-cols-3">
                            <div>PAYLOAD</div>
                            <div className="text-red-400">yes</div>
                            <div>The payload to use</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        className="bg-green-900/50 border border-green-500 px-3 py-1 text-sm hover:bg-green-900/70"
                        onClick={() => setActiveTab("console")}
                      >
                        Use in Console
                      </button>
                      <button
                        className="bg-red-900/50 border border-red-500 px-3 py-1 text-sm hover:bg-red-900/70 text-red-400"
                        onClick={() => {
                          setActiveTab("targets")
                          // Find a vulnerable target
                          const vulnTarget = targets.find((t) => t.status === "vulnerable")
                          if (vulnTarget) {
                            setSelectedTarget(vulnTarget)
                          }
                        }}
                      >
                        Find Targets
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center p-4">
                    <div className="flex flex-col items-center">
                      <AlertTriangle className="h-8 w-8 mb-3" />
                      <span>Select an exploit to view details</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "targets" && (
          <div className="h-full flex flex-col">
            <div className="p-2 border-b border-green-500/30 flex items-center justify-between">
              <div className="text-sm font-bold">Network Targets</div>
              <button className="bg-green-900/50 border border-green-500 px-3 py-1 text-xs hover:bg-green-900/70 flex items-center">
                <RefreshCw className="h-3 w-3 mr-1" />
                Scan Network
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Target List */}
              <div className="w-1/2 border-r border-green-500/30 overflow-auto">
                <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-xs font-bold grid grid-cols-3">
                  <div>Name</div>
                  <div>IP Address</div>
                  <div>Status</div>
                </div>

                <div className="divide-y divide-green-500/20">
                  {targets.map((target) => (
                    <div
                      key={target.id}
                      className={`p-2 text-xs cursor-pointer hover:bg-green-900/20 ${selectedTarget?.id === target.id ? "bg-green-900/30" : ""}`}
                      onClick={() => setSelectedTarget(target)}
                    >
                      <div className="grid grid-cols-3">
                        <div>{target.name}</div>
                        <div>{target.ip}</div>
                        <div className={`flex items-center ${getStatusColor(target.status)}`}>
                          {getStatusIcon(target.status)}
                          <span className="ml-1 capitalize">{target.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Details */}
              <div className="w-1/2 overflow-auto">
                {selectedTarget ? (
                  <div className="p-3">
                    <div className="text-lg mb-3">{selectedTarget.name}</div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div>
                        <div className="text-xs text-green-500/70">IP Address:</div>
                        <div>{selectedTarget.ip}</div>
                      </div>
                      <div>
                        <div className="text-xs text-green-500/70">Operating System:</div>
                        <div>{selectedTarget.os}</div>
                      </div>
                      <div>
                        <div className="text-xs text-green-500/70">Status:</div>
                        <div className={`flex items-center ${getStatusColor(selectedTarget.status)}`}>
                          {getStatusIcon(selectedTarget.status)}
                          <span className="ml-1 capitalize">{selectedTarget.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-xs text-green-500/70 mb-1">Open Ports:</div>
                      <div className="border border-green-500/30">
                        <div className="bg-gray-900 p-2 text-xs font-bold grid grid-cols-3">
                          <div>Port</div>
                          <div>Service</div>
                          <div>Version</div>
                        </div>
                        <div className="divide-y divide-green-500/20 text-xs">
                          <div className="p-2 grid grid-cols-3">
                            <div>22/tcp</div>
                            <div>SSH</div>
                            <div>OpenSSH 8.2p1</div>
                          </div>
                          <div className="p-2 grid grid-cols-3">
                            <div>80/tcp</div>
                            <div>HTTP</div>
                            <div>Apache 2.4.41</div>
                          </div>
                          <div className="p-2 grid grid-cols-3">
                            <div>445/tcp</div>
                            <div>SMB</div>
                            <div>Samba 4.11.6</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedTarget.status === "vulnerable" && (
                      <div className="mb-3 p-2 border border-red-500/50 bg-red-900/20 text-red-400">
                        <div className="flex items-center mb-1">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span className="font-bold">Vulnerabilities Detected</span>
                        </div>
                        <ul className="list-disc list-inside text-xs space-y-1">
                          <li>SMB service vulnerable to EternalBlue (MS17-010)</li>
                          <li>SSH server outdated (CVE-2019-6111)</li>
                          <li>Apache server vulnerable to directory traversal</li>
                        </ul>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        className="bg-green-900/50 border border-green-500 px-3 py-1 text-sm hover:bg-green-900/70"
                        onClick={() => setActiveTab("console")}
                      >
                        Open Console
                      </button>
                      {selectedTarget.status === "vulnerable" && (
                        <button
                          className="bg-red-900/50 border border-red-500 px-3 py-1 text-sm hover:bg-red-900/70 text-red-400"
                          onClick={() => {
                            setActiveTab("console")
                            // Find a suitable exploit
                            const exploit = exploits.find(
                              (e) => e.name.includes("smb") || e.name.includes("eternalblue"),
                            )
                            if (exploit) {
                              setSelectedExploit(exploit)
                              setConsoleOutput((prev) => [
                                ...prev,
                                `msf6 > use ${exploit.name}`,
                                `Using ${exploit.type}/${exploit.name}`,
                                `msf6 ${exploit.type}(${exploit.name}) > set RHOSTS ${selectedTarget.ip}`,
                                `RHOSTS => ${selectedTarget.ip}`,
                                `msf6 ${exploit.type}(${exploit.name}) > `,
                              ])
                            }
                          }}
                        >
                          Exploit Target
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center p-4">
                    <div className="flex flex-col items-center">
                      <Shield className="h-8 w-8 mb-3" />
                      <span>Select a target to view details</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "console" && (
          <div className="h-full flex flex-col bg-black">
            <div className="flex-1 p-2 font-mono text-xs overflow-auto">
              {consoleOutput.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center">
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  <span>Processing...</span>
                </div>
              )}
              {isExploiting && (
                <div className="flex items-center text-red-400 animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-2" />
                  <span>Exploiting target...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleConsoleSubmit} className="border-t border-green-500/30 p-2">
              <div className="flex items-center">
                <span className="text-green-400 mr-1">
                  {selectedExploit ? `msf6 ${selectedExploit.type}(${selectedExploit.name}) >` : "msf6 >"}
                </span>
                <input
                  type="text"
                  value={consoleInput}
                  onChange={(e) => setConsoleInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none"
                  disabled={isLoading || isExploiting}
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
