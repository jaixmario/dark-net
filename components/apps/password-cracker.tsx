"use client"

import { useState } from "react"
import { Key, Lock, Check, AlertTriangle, Loader2 } from "lucide-react"

type PasswordMethod = "dictionary" | "bruteforce" | "hybrid"
type HashType = "md5" | "sha1" | "sha256" | "ntlm"

export function PasswordCracker() {
  const [hashInput, setHashInput] = useState("")
  const [method, setMethod] = useState<PasswordMethod>("dictionary")
  const [hashType, setHashType] = useState<HashType>("md5")
  const [isCracking, setIsCracking] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ password: string; timeElapsed: string } | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [attemptsPerSecond, setAttemptsPerSecond] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [presetHashes, setPresetHashes] = useState<{ hash: string; type: HashType }[]>([
    { hash: "5f4dcc3b5aa765d61d8327deb882cf99", type: "md5" },
    { hash: "5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8", type: "sha1" },
    { hash: "e10adc3949ba59abbe56e057f20f883e", type: "md5" },
    { hash: "7c4a8d09ca3762af61e59520943dc26494f8941b", type: "sha1" },
  ])

  const startCracking = () => {
    if (!hashInput.trim()) return

    setIsCracking(true)
    setProgress(0)
    setResult(null)
    setAttempts(0)
    setAttemptsPerSecond(0)
    setLogs([`Starting ${method} attack on ${hashType} hash...`])

    // Simulate cracking progress
    const startTime = Date.now()
    let totalAttempts = 0
    let lastLogTime = startTime

    const interval = setInterval(() => {
      const currentTime = Date.now()
      const elapsedSeconds = (currentTime - startTime) / 1000

      // Simulate different speeds based on method
      const attemptsThisInterval =
        method === "bruteforce"
          ? Math.floor(Math.random() * 100000) + 50000
          : method === "hybrid"
            ? Math.floor(Math.random() * 50000) + 10000
            : Math.floor(Math.random() * 10000) + 1000

      totalAttempts += attemptsThisInterval
      setAttempts(totalAttempts)
      setAttemptsPerSecond(Math.floor(totalAttempts / elapsedSeconds))

      // Add logs occasionally
      if (currentTime - lastLogTime > 1000) {
        lastLogTime = currentTime

        if (Math.random() > 0.7) {
          const possibleLogs = [
            `Trying password pattern: ${getRandomPattern()}...`,
            `Checking common substitutions...`,
            `Testing password variations...`,
            `Analyzing hash structure...`,
            `Applying ${method} techniques...`,
          ]

          setLogs((prev) => [...prev, possibleLogs[Math.floor(Math.random() * possibleLogs.length)]])
        }
      }

      setProgress((prev) => {
        const newProgress = prev + (method === "dictionary" ? 5 : method === "hybrid" ? 2 : 0.5)

        if (newProgress >= 100) {
          clearInterval(interval)
          setIsCracking(false)

          // Simulate success or failure
          const success = Math.random() > 0.3

          if (success) {
            const crackedPassword = getRandomPassword()
            const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(2)

            setResult({
              password: crackedPassword,
              timeElapsed: timeElapsed,
            })

            setLogs((prev) => [...prev, `Password found: ${crackedPassword}`])
          } else {
            setLogs((prev) => [...prev, "Password cracking failed. Try a different method or hash type."])
          }

          return 100
        }

        return newProgress
      })
    }, 300)
  }

  const getRandomPattern = () => {
    const patterns = ["[a-z]+[0-9]{2}", "[A-Z][a-z]+[0-9]+", "[a-z]+[!@#$]", "[A-Z][a-z]{5,8}"]
    return patterns[Math.floor(Math.random() * patterns.length)]
  }

  const getRandomPassword = () => {
    const commonPasswords = [
      "password123",
      "qwerty",
      "123456",
      "admin",
      "welcome",
      "letmein",
      "football",
      "monkey",
      "abc123",
      "superman",
    ]
    return commonPasswords[Math.floor(Math.random() * commonPasswords.length)]
  }

  const selectPresetHash = (hash: string, type: HashType) => {
    setHashInput(hash)
    setHashType(type)
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      <div className="mb-4">
        <div className="flex flex-wrap items-end gap-3 mb-3">
          <div className="flex-1">
            <label className="block text-xs mb-1">Hash:</label>
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Enter hash to crack"
              className="w-full bg-gray-900 border border-green-500/50 p-2 text-sm font-mono"
              disabled={isCracking}
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Hash Type:</label>
            <select
              value={hashType}
              onChange={(e) => setHashType(e.target.value as HashType)}
              className="bg-gray-900 border border-green-500/50 p-2 text-sm"
              disabled={isCracking}
            >
              <option value="md5">MD5</option>
              <option value="sha1">SHA1</option>
              <option value="sha256">SHA256</option>
              <option value="ntlm">NTLM</option>
            </select>
          </div>

          <div>
            <label className="block text-xs mb-1">Method:</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PasswordMethod)}
              className="bg-gray-900 border border-green-500/50 p-2 text-sm"
              disabled={isCracking}
            >
              <option value="dictionary">Dictionary Attack</option>
              <option value="bruteforce">Brute Force</option>
              <option value="hybrid">Hybrid Attack</option>
            </select>
          </div>

          <div>
            <button
              onClick={startCracking}
              disabled={isCracking || !hashInput.trim()}
              className="bg-green-900/50 border border-green-500 px-4 py-2 text-sm hover:bg-green-900/70 disabled:opacity-50"
            >
              {isCracking ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cracking...
                </span>
              ) : (
                <span className="flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  Crack Password
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Preset Hashes */}
        <div className="mb-3">
          <div className="text-xs mb-1">Quick Select:</div>
          <div className="flex flex-wrap gap-2">
            {presetHashes.map((preset, index) => (
              <button
                key={index}
                onClick={() => selectPresetHash(preset.hash, preset.type)}
                className="text-xs bg-gray-900/70 border border-green-500/30 px-2 py-1 hover:bg-green-900/30"
                disabled={isCracking}
              >
                {preset.hash.substring(0, 8)}... ({preset.type})
              </button>
            ))}
          </div>
        </div>

        {isCracking && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Cracking in progress...</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-900 h-2">
              <div className="bg-red-500 h-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>Attempts: {attempts.toLocaleString()}</span>
              <span>{attemptsPerSecond.toLocaleString()} h/s</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden">
        {/* Results Panel */}
        <div className="w-full md:w-1/2 border border-green-500/30 overflow-auto">
          <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-sm font-bold">Results</div>

          <div className="p-3">
            {result ? (
              <div className="space-y-3">
                <div className="flex items-center text-green-400">
                  <Check className="h-5 w-5 mr-2" />
                  <span className="text-lg">Password Cracked!</span>
                </div>

                <div className="p-3 border border-green-500/50 bg-green-900/20">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-xs text-green-500/70">Password:</span>
                      <div className="font-mono text-lg">{result.password}</div>
                    </div>
                    <div>
                      <span className="text-xs text-green-500/70">Time Elapsed:</span>
                      <div>{result.timeElapsed} seconds</div>
                    </div>
                    <div>
                      <span className="text-xs text-green-500/70">Hash Type:</span>
                      <div>{hashType.toUpperCase()}</div>
                    </div>
                    <div>
                      <span className="text-xs text-green-500/70">Method:</span>
                      <div className="capitalize">{method}</div>
                    </div>
                  </div>
                </div>

                <div className="text-sm">
                  <div className="flex items-center text-yellow-400 mb-1">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>Security Analysis</span>
                  </div>
                  <ul className="list-disc list-inside text-xs space-y-1 text-yellow-300">
                    <li>This password is commonly used and easily crackable</li>
                    <li>Consider using a stronger password with mixed characters</li>
                    <li>Recommended length: 12+ characters</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-sm text-green-500/70 p-4">
                {isCracking ? (
                  <div className="flex flex-col items-center">
                    <Lock className="h-8 w-8 mb-2 animate-pulse" />
                    <span>Cracking password...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Key className="h-8 w-8 mb-2" />
                    <span>Enter a hash and start cracking</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Logs Panel */}
        <div className="w-full md:w-1/2 border border-green-500/30 overflow-auto">
          <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-sm font-bold">
            Activity Log
          </div>

          <div className="p-2 text-xs space-y-1 font-mono">
            {logs.length === 0 ? (
              <div className="text-center text-green-500/70 p-4">No activity yet</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="flex">
                  <span className="text-green-300 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
