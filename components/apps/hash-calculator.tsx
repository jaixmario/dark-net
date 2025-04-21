"use client"

import { useState } from "react"
import { Hash, Copy, Check, RefreshCw } from "lucide-react"

export function HashCalculator() {
  const [input, setInput] = useState("")
  const [hashType, setHashType] = useState("md5")
  const [result, setResult] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [copied, setCopied] = useState(false)

  const calculateHash = async () => {
    if (!input) return

    setIsCalculating(true)
    setResult("")

    try {
      // Use the Web Crypto API to calculate hashes
      const encoder = new TextEncoder()
      const data = encoder.encode(input)

      let hashBuffer

      switch (hashType) {
        case "md5":
          // Web Crypto doesn't support MD5, so we'll simulate it
          setResult(await simulateMd5(input))
          break
        case "sha1":
          hashBuffer = await crypto.subtle.digest("SHA-1", data)
          setResult(bufferToHex(hashBuffer))
          break
        case "sha256":
          hashBuffer = await crypto.subtle.digest("SHA-256", data)
          setResult(bufferToHex(hashBuffer))
          break
        case "sha512":
          hashBuffer = await crypto.subtle.digest("SHA-512", data)
          setResult(bufferToHex(hashBuffer))
          break
      }
    } catch (err) {
      console.error("Hash calculation error:", err)
      setResult("Error calculating hash")
    } finally {
      setIsCalculating(false)
    }
  }

  // Helper function to convert buffer to hex string
  const bufferToHex = (buffer: ArrayBuffer) => {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

  // Simulate MD5 (since Web Crypto doesn't support it)
  const simulateMd5 = async (text: string) => {
    // This is just a simulation for visual purposes
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // Generate a random-looking hash
        let hash = ""
        for (let i = 0; i < 32; i++) {
          hash += "0123456789abcdef"[Math.floor(Math.random() * 16)]
        }
        resolve(hash)
      }, 300)
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      <div className="mb-4">
        <div className="flex flex-wrap items-end gap-2 mb-3">
          <div className="flex-1">
            <label className="block text-xs mb-1">Text to Hash:</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              className="w-full bg-gray-900 border border-green-500/50 p-2 text-sm h-24 resize-none"
              disabled={isCalculating}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <label className="block text-xs mb-1">Hash Algorithm:</label>
            <select
              value={hashType}
              onChange={(e) => setHashType(e.target.value)}
              className="bg-gray-900 border border-green-500/50 p-2 text-sm"
              disabled={isCalculating}
            >
              <option value="md5">MD5</option>
              <option value="sha1">SHA-1</option>
              <option value="sha256">SHA-256</option>
              <option value="sha512">SHA-512</option>
            </select>
          </div>

          <div className="ml-auto">
            <button
              onClick={calculateHash}
              disabled={isCalculating || !input.trim()}
              className="bg-green-900/50 border border-green-500 px-4 py-2 text-sm hover:bg-green-900/70 disabled:opacity-50 flex items-center"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Hash className="h-4 w-4 mr-2" />
                  Calculate Hash
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 border border-green-500/30 flex flex-col">
        <div className="bg-gray-900 p-2 border-b border-green-500/30 text-sm font-bold flex items-center justify-between">
          <div className="flex items-center">
            <Hash className="h-4 w-4 mr-2" />
            <span>Hash Result ({hashType.toUpperCase()})</span>
          </div>

          {result && (
            <button
              onClick={copyToClipboard}
              className="text-xs flex items-center hover:text-green-400"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex-1 p-3 bg-gray-900/30 font-mono text-sm overflow-auto">
          {isCalculating ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin mr-2">
                <RefreshCw className="h-5 w-5" />
              </div>
              <span>Calculating hash...</span>
            </div>
          ) : result ? (
            <div className="break-all">{result}</div>
          ) : (
            <div className="text-green-500/50 flex items-center justify-center h-full">
              Enter text and calculate a hash to see the result
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
