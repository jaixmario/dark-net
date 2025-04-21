"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

type Command = {
  input: string
  output: React.ReactNode
  isProcessing?: boolean
  isError?: boolean
}

const AVAILABLE_COMMANDS = [
  "help",
  "clear",
  "scan",
  "crack",
  "access",
  "decrypt",
  "download",
  "exit",
  "ls",
  "cat",
  "whoami",
  "ping",
  "neofetch",
  "lscpu",
  "htop",
  "df",
  "free",
  "ifconfig",
  "uname",
  "ps",
  "top",
  "find",
  "grep",
  "hack",
  "apt",
  "sudo",
  "apt-get",
]

// Define the command components
const ScanCommand = () => (
  <div className="space-y-1">
    <p className="text-green-400">Scanning network for vulnerabilities...</p>
    <p>Found 3 potential targets:</p>
    <ul className="list-disc list-inside text-yellow-400">
      <li>192.168.1.1 - Router (2 open ports)</li>
      <li>192.168.1.100 - Server (5 open ports)</li>
      <li>192.168.1.254 - Unknown device (3 open ports)</li>
    </ul>
    <p className="text-green-400">Scan complete.</p>
  </div>
)

const CrackCommand = () => (
  <div className="space-y-1">
    <p className="text-yellow-400">Attempting to crack password...</p>
    <p>Running dictionary attack...</p>
    <p>Trying common passwords...</p>
    <p>Trying variations...</p>
    <p className="text-green-400">Password cracked: admin123</p>
  </div>
)

const AccessCommand = ({ command }: { command: string }) => {
  const target = command.split(" ")[1]
  return (
    <div className="space-y-1">
      <p className="text-blue-400">Accessing {target || "target"}...</p>
      <p>Establishing secure connection...</p>
      <p>Bypassing firewall...</p>
      <p className="text-green-400">Access granted. You now have control of the system.</p>
    </div>
  )
}

const DecryptCommand = () => (
  <div className="space-y-1">
    <p className="text-purple-400">Decrypting data...</p>
    <p>Analyzing encryption algorithm...</p>
    <p>Applying decryption key...</p>
    <p className="text-green-400">Decryption successful.</p>
    <p className="text-yellow-400">Decrypted content:</p>
    <div className="bg-gray-900/50 p-2 font-mono text-xs">
      User credentials: admin:supersecretpassword root:toor123 guest:guest
    </div>
  </div>
)

const DownloadCommand = ({ command }: { command: string }) => {
  const file = command.split(" ")[1]
  return (
    <div className="space-y-1">
      <p className="text-orange-400">Downloading {file || "file"}...</p>
      <div className="w-full bg-gray-900 h-2 my-1">
        <div className="bg-green-500 h-full w-full transition-all duration-3000"></div>
      </div>
      <p className="text-green-400">Download complete. File saved to local system.</p>
    </div>
  )
}

const AptUpdateCommand = () => (
  <div className="space-y-1">
    <p className="text-green-400">Reading package lists...</p>
    <p>Building dependency tree...</p>
    <p>Reading state information...</p>
    <p>All packages are up to date.</p>
    <p className="text-green-400">Done</p>
  </div>
)

const AptUpgradeCommand = () => (
  <div className="space-y-1">
    <p className="text-green-400">Reading package lists...</p>
    <p>Building dependency tree...</p>
    <p>Reading state information...</p>
    <p>Calculating upgrade...</p>
    <p>The following packages will be upgraded:</p>
    <div className="text-yellow-400 ml-2">
      <p>kali-linux-core kali-desktop-core libssl3 openssl python3-pip</p>
      <p>python3-setuptools python3-wheel</p>
    </div>
    <p>7 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.</p>
    <p>Need to get 8,456 kB of archives.</p>
    <p>After this operation, 24.6 kB of additional disk space will be used.</p>
    <p>Do you want to continue? [Y/n] y</p>
    <p>Get:1 http://kali.download/kali kali-rolling/main amd64 libssl3 amd64 3.0.9-1 [1,940 kB]</p>
    <p>Get:2 http://kali.download/kali kali-rolling/main amd64 openssl amd64 3.0.9-1 [1,152 kB]</p>
    <p>Get:3 http://kali.download/kali kali-rolling/main amd64 python3-pip all 23.0.1+dfsg-1 [1,412 kB]</p>
    <p>Get:4 http://kali.download/kali kali-rolling/main amd64 python3-setuptools all 66.1.1-1 [1,152 kB]</p>
    <p>Get:5 http://kali.download/kali kali-rolling/main amd64 python3-wheel all 0.40.0-1 [48.6 kB]</p>
    <p>Get:6 http://kali.download/kali kali-rolling/main amd64 kali-linux-core all 2023.3.0 [2,752 kB]</p>
    <p>Fetched 8,456 kB in 2s (4,228 kB/s)</p>
    <p>Preconfiguring packages ...</p>
    <p>(Reading database ... 378672 files and directories currently installed.)</p>
    <p>Preparing to unpack .../libssl3_3.0.9-1_amd64.deb ...</p>
    <p>Unpacking libssl3:amd64 (3.0.9-1) over (3.0.8-1) ...</p>
    <p>Setting up libssl3:amd64 (3.0.9-1) ...</p>
    <p>Setting up openssl (3.0.9-1) ...</p>
    <p>Setting up python3-pip (23.0.1+dfsg-1) ...</p>
    <p>Setting up python3-setuptools (66.1.1-1) ...</p>
    <p>Setting up python3-wheel (0.40.0-1) ...</p>
    <p>Setting up kali-linux-core (2023.3.0) ...</p>
    <p>Processing triggers for man-db (2.11.2-2) ...</p>
    <p>Processing triggers for libc-bin (2.36-9+deb12u3) ...</p>
    <p className="text-green-400">Done</p>
  </div>
)

// Hidden site component
const HiddenSite = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
      <div className="bg-green-900/30 p-2 flex justify-between items-center border-b border-green-500/50">
        <div className="text-green-400 font-bold">DARKNET ACCESS GRANTED</div>
        <button onClick={onClose} className="text-red-400 hover:text-red-300">
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
}

export function Terminal({ username }: { username: string }) {
  const [commands, setCommands] = useState<Command[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const terminalEndRef = useRef<HTMLDivElement>(null)
  const [sudoMode, setSudoMode] = useState(false)
  const [sudoCommand, setSudoCommand] = useState("")
  const [sudoPassword, setSudoPassword] = useState("")
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Track line taps for hidden site activation
  const [tappedLines, setTappedLines] = useState<number[]>([])
  const [showHiddenSite, setShowHiddenSite] = useState(false)

  // Handle line tap
  const handleLineTap = (lineIndex: number) => {
    // Add the tapped line to the array if it's not already the last tapped line
    if (tappedLines.length === 0 || tappedLines[tappedLines.length - 1] !== lineIndex) {
      const newTappedLines = [...tappedLines, lineIndex]
      setTappedLines(newTappedLines)

      // If 3 different lines have been tapped, show the hidden site
      if (newTappedLines.length >= 3) {
        setShowHiddenSite(true)
        setTappedLines([]) // Reset tapped lines
      }
    }
  }

  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup code if needed
    }
  }, [])

  useEffect(() => {
    // Initial welcome message
    setCommands([
      {
        input: "connect",
        output: (
          <div className="space-y-1 my-1">
            <p className="text-yellow-400">Connection established to secure server.</p>
            <p>Welcome to DarkNet Terminal, {username}.</p>
            <p>
              Type <span className="text-cyan-400">help</span> for available commands.
            </p>
          </div>
        ),
      },
    ])
  }, [username])

  useEffect(() => {
    // Scroll to bottom when commands change
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [commands])

  // Fix the issue where the terminal might be repeating commands
  // Update the handleSubmit function to properly handle command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (sudoMode) {
      // Handle sudo password input
      setSudoMode(false)
      if (sudoPassword === "MARIOpapaJI69") {
        // Correct password, execute the sudo command
        processCommand(sudoCommand, true)
      } else {
        // Incorrect password
        setCommands((prev) => [
          ...prev,
          {
            input: "[sudo] password for " + username + ": " + "*".repeat(sudoPassword.length),
            output: <p className="text-red-400">Sorry, try again.</p>,
            isError: true,
          },
        ])
      }
      setSudoPassword("")
      setSudoCommand("")
      return
    }

    if (!currentInput.trim() || isProcessing) return

    // Add the command to the history
    const newCommand: Command = {
      input: currentInput,
      output: null,
      isProcessing: true,
    }

    setCommands([...commands, newCommand])
    setCurrentInput("")
    setIsProcessing(true)

    // Process command after a delay to simulate thinking
    setTimeout(() => {
      if (currentInput.trim().startsWith("sudo ")) {
        // Handle sudo command
        setSudoMode(true)
        setSudoCommand(currentInput.trim())
        setCommands((prev) => [
          ...prev.slice(0, -1),
          {
            ...prev[prev.length - 1],
            isProcessing: false,
            output: <p>[sudo] password for {username}:</p>,
          },
        ])
        setIsProcessing(false)
      } else {
        processCommand(currentInput)
      }
    }, 500)
  }

  // Make sure the neofetch command displays consistent system information
  // Update the neofetch command output to match system specs
  const processCommand = (cmd: string, isSudo = false) => {
    const command = cmd.trim().toLowerCase()
    let output: React.ReactNode
    let isError = false

    // Process different commands
    if (command === "help") {
      output = (
        <div className="space-y-1 my-1">
          <p className="text-cyan-400">Available commands:</p>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4">
            {AVAILABLE_COMMANDS.map((cmd) => (
              <li key={cmd} className="text-green-300">
                {cmd}
              </li>
            ))}
          </ul>
        </div>
      )
    } else if (command === "clear") {
      setCommands([])
      setIsProcessing(false)
      return
    } else if (command === "scan") {
      output = <ScanCommand />
    } else if (command === "crack") {
      output = <CrackCommand />
    } else if (command.startsWith("access")) {
      output = <AccessCommand command={command} />
    } else if (command === "decrypt") {
      output = <DecryptCommand />
    } else if (command.startsWith("download")) {
      output = <DownloadCommand command={command} />
    } else if (command === "exit") {
      output = <p className="text-yellow-400">Terminating session... Connection closed.</p>
    } else if (command === "ls") {
      output = (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 text-blue-300">
          <span>system/</span>
          <span>users/</span>
          <span>network/</span>
          <span>security.dat</span>
          <span>access.log</span>
          <span>config.sys</span>
        </div>
      )
    } else if (command === "cat") {
      output = <p className="text-red-400">Error: Specify a file to read</p>
      isError = true
    } else if (command.startsWith("cat ")) {
      const file = command.split(" ")[1]
      if (file === "security.dat") {
        output = (
          <div className="text-yellow-400">
            <p>SECURITY CONFIGURATION</p>
            <p>Firewall: ACTIVE</p>
            <p>Encryption: AES-256</p>
            <p>Last breach attempt: 2023-04-12 03:24:16</p>
          </div>
        )
      } else if (file === "access.log") {
        output = (
          <div className="text-gray-400 text-xs space-y-1">
            <p>192.168.1.45 - - [20/Apr/2023:10:23:15 +0000] "GET /admin HTTP/1.1" 403 287</p>
            <p>192.168.1.45 - - [20/Apr/2023:10:23:18 +0000] "GET /login HTTP/1.1" 200 1256</p>
            <p>192.168.1.45 - - [20/Apr/2023:10:24:22 +0000] "POST /login HTTP/1.1" 302 0</p>
            <p>192.168.1.45 - - [20/Apr/2023:10:24:23] "GET /dashboard HTTP/1.1" 200 4523</p>
          </div>
        )
      } else {
        output = <p className="text-red-400">Error: File not found: {file}</p>
        isError = true
      }
    } else if (command === "whoami") {
      output = (
        <p>
          User: <span className="text-cyan-400">{username}</span> | Access Level:{" "}
          <span className="text-yellow-400">{isSudo ? "ROOT" : "ADMIN"}</span>
        </p>
      )
    } else if (command.startsWith("ping")) {
      const target = command.split(" ")[1]
      if (!target) {
        output = <p className="text-red-400">Error: Specify a target to ping</p>
        isError = true
      } else {
        output = (
          <div className="space-y-1">
            <p>PING {target} (192.168.1.1): 56 data bytes</p>
            <p>64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=4.321 ms</p>
            <p>64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=5.129 ms</p>
            <p>64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=3.876 ms</p>
            <p>64 bytes from 192.168.1.1: icmp_seq=3 ttl=64 time=4.102 ms</p>
            <p className="text-cyan-400">--- {target} ping statistics ---</p>
            <p>4 packets transmitted, 4 packets received, 0.0% packet loss</p>
            <p>round-trip min/avg/max/stddev = 3.876/4.357/5.129/0.452 ms</p>
          </div>
        )
      }
    } else if (command === "neofetch") {
      output = (
        <div className="space-y-1 my-1 font-mono">
          <pre className="text-cyan-400">
            {`                    -@                    
                 .##@                   
                .####@                  
                @#####@                 
              . *######@                
             .##@o@#####@               
            /############@              
           /##############@             
          @######@**@######@            
         @######@    @######@           
        @######@      @######@          
      -@#######h      h#######@-        
     /#####h@@##@    @##@h@#####\\       
    @H@*   .@@#@       @#@@.   *@H@     
   *      @#@h@         @h@#@      *    
         @#@*             *@#@          
        @#@                 @#@         
       @#@                   @#@        
      @#@                     @#@       
     @#@                       @#@      
    @#@                         @#@     
   @#@                           @#@    
  @#@                             @#@   
 @#@                               @#@  
@#@                                 @#@ 
@#@                                   @#@
@#@                                     @#@`}
          </pre>
          <div className="grid grid-cols-2 gap-x-4">
            <div>
              <span className="text-green-400">OS:</span> Linux Kali 6.4.0-kali1-amd64
            </div>
            <div>
              <span className="text-green-400">Host:</span> hackstation
            </div>
            <div>
              <span className="text-green-400">Kernel:</span> 6.4.0-kali1-amd64
            </div>
            <div>
              <span className="text-green-400">Uptime:</span> 3 days, 7 hours, 22 minutes
            </div>
            <div>
              <span className="text-green-400">Packages:</span> 4,782 (dpkg)
            </div>
            <div>
              <span className="text-green-400">Shell:</span> bash 5.2.15
            </div>
            <div>
              <span className="text-green-400">Resolution:</span> 3840x2160
            </div>
            <div>
              <span className="text-green-400">DE:</span> GNOME 43.0
            </div>
            <div>
              <span className="text-green-400">WM:</span> Mutter
            </div>
            <div>
              <span className="text-green-400">Terminal:</span> gnome-terminal
            </div>
            <div>
              <span className="text-green-400">CPU:</span> AMD Ryzen 9 7950X (32) @ 5.7GHz
            </div>
            <div>
              <span className="text-green-400">GPU:</span> NVIDIA GeForce RTX 4090
            </div>
            <div>
              <span className="text-green-400">Memory:</span> 32GB / 128GB
            </div>
          </div>
        </div>
      )
    } else if (command === "lscpu") {
      output = (
        <div className="space-y-1 my-1 font-mono text-xs">
          <div>
            <span className="text-green-400">Architecture:</span> x86_64
          </div>
          <div>
            <span className="text-green-400">CPU op-mode(s):</span> 32-bit, 64-bit
          </div>
          <div>
            <span className="text-green-400">Byte Order:</span> Little Endian
          </div>
          <div>
            <span className="text-green-400">CPU(s):</span> 32
          </div>
          <div>
            <span className="text-green-400">On-line CPU(s) list:</span> 0-31
          </div>
          <div>
            <span className="text-green-400">Thread(s) per core:</span> 2
          </div>
          <div>
            <span className="text-green-400">Core(s) per socket:</span> 16
          </div>
          <div>
            <span className="text-green-400">Socket(s):</span> 1
          </div>
          <div>
            <span className="text-green-400">NUMA node(s):</span> 1
          </div>
          <div>
            <span className="text-green-400">Vendor ID:</span> AuthenticAMD
          </div>
          <div>
            <span className="text-green-400">CPU family:</span> 25
          </div>
          <div>
            <span className="text-green-400">Model:</span> 97
          </div>
          <div>
            <span className="text-green-400">Model name:</span> AMD Ryzen 9 7950X 16-Core Processor
          </div>
          <div>
            <span className="text-green-400">Stepping:</span> 2
          </div>
          <div>
            <span className="text-green-400">CPU MHz:</span> 4500.000
          </div>
          <div>
            <span className="text-green-400">CPU max MHz:</span> 5700.0000
          </div>
          <div>
            <span className="text-green-400">CPU min MHz:</span> 3000.0000
          </div>
          <div>
            <span className="text-green-400">BogoMIPS:</span> 9024.99
          </div>
          <div>
            <span className="text-green-400">L1d cache:</span> 512 KiB
          </div>
          <div>
            <span className="text-green-400">L1i cache:</span> 512 KiB
          </div>
          <div>
            <span className="text-green-400">L2 cache:</span> 16 MiB
          </div>
          <div>
            <span className="text-green-400">L3 cache:</span> 64 MiB
          </div>
          <div>
            <span className="text-green-400">NUMA node0 CPU(s):</span> 0-31
          </div>
        </div>
      )
    } else if (command === "htop" || command === "top") {
      output = (
        <div className="space-y-1 my-1 font-mono text-xs">
          <div className="flex justify-between mb-2">
            <div>
              <span className="text-cyan-400">Tasks:</span> 243 total, 1 running, 242 sleeping, 0 stopped, 0 zombie
            </div>
            <div>
              <span className="text-cyan-400">Load average:</span> 0.52 0.58 0.59
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-2">
            <div>
              <div className="text-cyan-400">
                CPU[||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||]
              </div>
            </div>
          </div>
          <div className="text-xs">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="text-left px-1">PID</th>
                  <th className="text-left px-1">USER</th>
                  <th className="text-left px-1">PR</th>
                  <th className="text-left px-1">NI</th>
                  <th className="text-left px-1">VIRT</th>
                  <th className="text-left px-1">RES</th>
                  <th className="text-left px-1">SHR</th>
                  <th className="text-left px-1">S</th>
                  <th className="text-left px-1">%CPU</th>
                  <th className="text-left px-1">%MEM</th>
                  <th className="text-left px-1">TIME+</th>
                  <th className="text-left px-1">COMMAND</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-1">1</td>
                  <td className="px-1">root</td>
                  <td className="px-1">20</td>
                  <td className="px-1">0</td>
                  <td className="px-1">169M</td>
                  <td className="px-1">12M</td>
                  <td className="px-1">8M</td>
                  <td className="px-1">S</td>
                  <td className="px-1">0.0</td>
                  <td className="px-1">0.1</td>
                  <td className="px-1">0:03.72</td>
                  <td className="px-1">systemd</td>
                </tr>
                <tr>
                  <td className="px-1">2</td>
                  <td className="px-1">root</td>
                  <td className="px-1">20</td>
                  <td className="px-1">0</td>
                  <td className="px-1">0</td>
                  <td className="px-1">0</td>
                  <td className="px-1">0</td>
                  <td className="px-1">S</td>
                  <td className="px-1">0.0</td>
                  <td className="px-1">0.0</td>
                  <td className="px-1">0:00.00</td>
                  <td className="px-1">kthreadd</td>
                </tr>
                <tr>
                  <td className="px-1">3</td>
                  <td className="px-1">root</td>
                  <td className="px-1">0</td>
                  <td className="px-1">-20</td>
                  <td className="px-1">0</td>
                  <td className="px-1">0</td>
                  <td className="px-1">0</td>
                  <td className="px-1">I</td>
                  <td className="px-1">0.0</td>
                  <td className="px-1">0.0</td>
                  <td className="px-1">0:00.00</td>
                  <td className="px-1">rcu_gp</td>
                </tr>
                <tr>
                  <td className="px-1">1234</td>
                  <td className="px-1">{username}</td>
                  <td className="px-1">20</td>
                  <td className="px-1">0</td>
                  <td className="px-1">1.2G</td>
                  <td className="px-1">400M</td>
                  <td className="px-1">120M</td>
                  <td className="px-1">R</td>
                  <td className="px-1 text-green-400">25.0</td>
                  <td className="px-1">3.2</td>
                  <td className="px-1">1:42.55</td>
                  <td className="px-1">hacktools</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    } else if (command === "df") {
      output = (
        <div className="space-y-1 my-1 font-mono text-xs">
          <div className="text-cyan-400">Filesystem Size Used Avail Use% Mounted on</div>
          <div>udev 7.8G 0 7.8G 0% /dev</div>
          <div>tmpfs 1.6G 2.1M 1.6G 1% /run</div>
          <div>ext4 223G 28G 184G 14% /</div>
          <div>tmpfs 7.8G 82M 7.7G 2% /dev/shm</div>
          <div>tmpfs 5.0M 4.0K 5.0M 1% /run/lock</div>
          <div>ext4 932G 218G 667G 25% /home</div>
        </div>
      )
    } else if (command === "free") {
      output = (
        <div className="space-y-1 my-1 font-mono text-xs">
          <div className="text-cyan-400"> total used free shared buff/cache available</div>
          <div>Mem: 128G 42G 78G 82M 8G 86G</div>
          <div>Swap: 8G 0B 8G</div>
        </div>
      )
    } else if (command === "ifconfig") {
      output = (
        <div className="space-y-1 my-1 font-mono text-xs">
          <div className="text-cyan-400">eth0: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt; mtu 1500</div>
          <div> inet 192.168.1.100 netmask 255.255.255.0 broadcast 192.168.1.255</div>
          <div> inet6 fe80::216:3eff:fe12:7c8c prefixlen 64 scopeid 0x20&lt;link&gt;</div>
          <div> ether 00:16:3e:12:7c:8c txqueuelen 1000 (Ethernet)</div>
          <div> RX packets 8762 bytes 1234567 (1.2 MB)</div>
          <div> RX errors 0 dropped 0 overruns 0 frame 0</div>
          <div> TX packets 5684 bytes 987654 (987.6 KB)</div>
          <div> TX errors 0 dropped 0 overruns 0 carrier 0 collisions 0</div>
          <div className="mt-2 text-cyan-400">lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt; mtu 65536</div>
          <div> inet 127.0.0.1 netmask 255.0.0.0</div>
          <div> inet6 ::1 prefixlen 128 scopeid 0x10&lt;host&gt;</div>
          <div> loop txqueuelen 1000 (Local Loopback)</div>
          <div> RX packets 1234 bytes 123456 (123.4 KB)</div>
          <div> RX errors 0 dropped 0 overruns 0 frame 0</div>
          <div> TX packets 1234 bytes 123456 (123.4 KB)</div>
          <div> TX errors 0 dropped 0 overruns 0 carrier 0 collisions 0</div>
        </div>
      )
    } else if (command === "uname" || command === "uname -a") {
      output = (
        <div className="font-mono text-xs">
          Linux hackstation 6.4.0-kali1-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.4.11-1kali1 (2023-08-21) x86_64 GNU/Linux
        </div>
      )
    } else if (command === "ps" || command === "ps aux") {
      output = (
        <div className="space-y-1 my-1 font-mono text-xs">
          <div className="text-cyan-400">USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND</div>
          <div>root 1 0.0 0.1 169012 12204 ? Ss Aug20 0:03 /sbin/init</div>
          <div>root 2 0.0 0.0 0 0 ? S Aug20 0:00 [kthreadd]</div>
          <div>root 3 0.0 0.0 0 0 ? I&lt; Aug20 0:00 [rcu_gp]</div>
          <div>{username} 1234 25.0 3.2 1232456 400123 pts/0 R+ 10:42 1:42 hacktools</div>
          <div>{username} 1337 0.5 0.8 234567 89012 pts/1 Ss 11:20 0:05 bash</div>
        </div>
      )
    } else if (command.startsWith("find")) {
      output = (
        <div className="space-y-1 my-1 font-mono text-xs">
          <div>./system</div>
          <div>./system/config</div>
          <div>./system/config/network.conf</div>
          <div>./system/logs</div>
          <div>./system/logs/access.log</div>
          <div>./users</div>
          <div>./users/admin</div>
          <div>./users/admin/.ssh</div>
          <div>./security.dat</div>
          <div>./access.log</div>
          <div>./config.sys</div>
        </div>
      )
    } else if (command.startsWith("grep")) {
      const searchTerm = command.split(" ")[1]
      if (!searchTerm) {
        output = <p className="text-red-400">Error: No search pattern specified</p>
        isError = true
      } else {
        output = (
          <div className="space-y-1 my-1 font-mono text-xs">
            <div>
              ./access.log:<span className="text-yellow-400">{searchTerm}</span> - - [20/Apr/2023:10:23:15 +0000] "GET
              /admin HTTP/1.1" 403 287
            </div>
            <div>
              ./access.log:<span className="text-yellow-400">{searchTerm}</span> - - [20/Apr/2023:10:23:18 +0000] "GET
              /login HTTP/1.1" 200 1256
            </div>
            <div>
              ./system/logs/access.log:<span className="text-yellow-400">{searchTerm}</span> - - [19/Apr/2023:22:15:42
              +0000] "POST /login HTTP/1.1" 401 187
            </div>
          </div>
        )
      }
    } else if (command === "apt update" || command === "apt-get update") {
      output = <AptUpdateCommand />
    } else if (command === "apt upgrade" || command === "apt-get upgrade") {
      output = <AptUpgradeCommand />
    } else if (command.startsWith("sudo")) {
      // This should only happen if the password was correct
      const sudoCmd = command.substring(5)
      if (sudoCmd === "apt update" || sudoCmd === "apt-get update") {
        output = <AptUpdateCommand />
      } else if (sudoCmd === "apt upgrade" || sudoCmd === "apt-get upgrade") {
        output = <AptUpgradeCommand />
      } else {
        output = (
          <div>
            <p>Running command with elevated privileges: {sudoCmd}</p>
            <p className="text-green-400">Command executed successfully.</p>
          </div>
        )
      }
    } else {
      output = <p className="text-red-400">Command not found: {command}</p>
      isError = true
    }

    // Update the command with the output
    setCommands((prev) =>
      prev.map((cmd, i) => {
        if (i === prev.length - 1) {
          return {
            ...cmd,
            output,
            isProcessing: false,
            isError,
          }
        }
        return cmd
      }),
    )

    setIsProcessing(false)
  }

  return (
    <>
      {showHiddenSite && <HiddenSite onClose={() => setShowHiddenSite(false)} />}
      <div
        className={`${
          isFullScreen ? "fixed inset-0 z-50" : "h-full"
        } flex flex-col bg-black text-green-500 font-mono p-2`}
      >
        {isFullScreen && (
          <div className="flex justify-between items-center mb-2 border-b border-green-500/30 pb-1">
            <div className="text-xs">Terminal - Full Screen Mode</div>
            <button
              className="text-xs bg-green-900/50 border border-green-500/30 px-2 py-1 hover:bg-green-900/70"
              onClick={() => setIsFullScreen(false)}
            >
              Exit Full Screen
            </button>
          </div>
        )}
        <div className="flex-1 overflow-auto">
          {commands.map((command, index) => (
            <div key={index} className="mb-2" onClick={() => handleLineTap(index)}>
              <div className="flex">
                <span className="text-cyan-400 mr-2">{username}@hackstation:~$</span>
                <span>{command.input}</span>
              </div>
              {command.isProcessing ? (
                <div className="flex items-center mt-1">
                  <div className="animate-pulse mr-2">...</div>
                  <div className="text-xs text-gray-400">Processing...</div>
                </div>
              ) : (
                <div className={`mt-1 ${command.isError ? "text-red-400" : ""}`}>{command.output}</div>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="mt-2 flex items-center border-t border-green-500/30 pt-2">
          <span className="text-cyan-400 mr-2">{username}@hackstation:~$</span>
          <input
            type="text"
            value={sudoMode ? sudoPassword : currentInput}
            onChange={(e) => (sudoMode ? setSudoPassword(e.target.value) : setCurrentInput(e.target.value))}
            className="flex-1 bg-transparent border-none outline-none text-green-500"
            disabled={isProcessing}
            autoFocus
            type={sudoMode ? "password" : "text"}
          />
        </form>
      </div>
    </>
  )
}
