"use client"

import { useState } from "react"
import { FileText, Lock, Unlock, Copy, Check, RefreshCw } from "lucide-react"

type EncryptionType = "aes-256" | "des" | "rsa" | "blowfish"
type EncryptionMode = "encrypt" | "decrypt"

export function FileEncryptor() {
  const [mode, setMode] = useState<EncryptionMode>("encrypt")
  const [encryptionType, setEncryptionType] = useState<EncryptionType>("aes-256")
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [password, setPassword] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)

  const processText = () => {
    if (!inputText || !password) return

    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      if (mode === "encrypt") {
        setOutputText(simulateEncryption(inputText, password, encryptionType))
      } else {
        setOutputText(simulateDecryption(inputText, password, encryptionType))
      }
      setIsProcessing(false)
    }, 1500)
  }

  const simulateEncryption = (text: string, key: string, type: EncryptionType) => {
    // This is just a visual simulation, not actual encryption
    let result = ""

    // Convert to base64 and add some random characters to make it look encrypted
    const base64 = btoa(text)

    // Add a prefix based on encryption type
    const prefix = type === "aes-256" ? "AES256" : type === "des" ? "DES3" : type === "rsa" ? "RSA" : "BF"

    result = `${prefix}:${base64
      .split("")
      .map((c) => {
        if (Math.random() > 0.7) {
          return String.fromCharCode(c.charCodeAt(0) + 1)
        }
        return c
      })
      .join("")}==`

    return result
  }

  const simulateDecryption = (text: string, key: string, type: EncryptionType) => {
    // This is just a visual simulation, not actual decryption
    try {
      // Check if it has our fake prefix
      if (!text.includes(":")) {
        return "Error: Invalid encrypted format"
      }

      const parts = text.split(":")
      let base64 = parts[1]

      // Remove the extra == we added
      if (base64.endsWith("==")) {
        base64 = base64.substring(0, base64.length - 2)
      }

      // Try to undo our character shifting (this is just for show)
      base64 = base64
        .split("")
        .map((c) => {
          if (Math.random() > 0.7) {
            return String.fromCharCode(c.charCodeAt(0) - 1)
          }
          return c
        })
        .join("")

      // Try to decode
      try {
        return atob(base64)
      } catch (e) {
        return "Error: Decryption failed. Invalid key or corrupted data."
      }
    } catch (e) {
      return "Error: Decryption failed. Invalid format."
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateRandomKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+"
    let result = ""
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div>
            <label className="block text-xs mb-1">Mode:</label>
            <div className="flex">
              <button
                className={`px-3 py-1 text-sm flex items-center ${mode === "encrypt" ? "bg-green-900/50 border border-green-500" : "border border-green-500/30"}`}
                onClick={() => setMode("encrypt")}
              >
                <Lock className="h-4 w-4 mr-1" />
                Encrypt
              </button>
              <button
                className={`px-3 py-1 text-sm flex items-center ${mode === "decrypt" ? "bg-green-900/50 border border-green-500" : "border border-green-500/30"}`}
                onClick={() => setMode("decrypt")}
              >
                <Unlock className="h-4 w-4 mr-1" />
                Decrypt
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1">Algorithm:</label>
            <select
              value={encryptionType}
              onChange={(e) => setEncryptionType(e.target.value as EncryptionType)}
              className="bg-gray-900 border border-green-500/50 p-1 text-sm"
              disabled={isProcessing}
            >
              <option value="aes-256">AES-256</option>
              <option value="des">3DES</option>
              <option value="rsa">RSA</option>
              <option value="blowfish">Blowfish</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs mb-1">Encryption Key:</label>
            <div className="flex">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-gray-900 border border-green-500/50 p-1 text-sm font-mono"
                placeholder="Enter encryption key"
                disabled={isProcessing}
              />
              <button
                onClick={generateRandomKey}
                className="bg-gray-900 border border-green-500/50 border-l-0 px-2 hover:bg-green-900/30"
                title="Generate random key"
                disabled={isProcessing}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden">
        {/* Input Panel */}
        <div className="w-full md:w-1/2 border border-green-500/30 flex flex-col">
          <div className="bg-gray-900 p-2 border-b border-green-500/30 text-sm font-bold flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            <span>{mode === "encrypt" ? "Plain Text" : "Encrypted Text"}</span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-black border-none p-3 text-sm font-mono resize-none focus:outline-none"
            placeholder={mode === "encrypt" ? "Enter text to encrypt" : "Enter text to decrypt"}
            disabled={isProcessing}
          />
        </div>

        {/* Output Panel */}
        <div className="w-full md:w-1/2 border border-green-500/30 flex flex-col">
          <div className="bg-gray-900 p-2 border-b border-green-500/30 text-sm font-bold flex items-center justify-between">
            <div className="flex items-center">
              {mode === "encrypt" ? <Lock className="h-4 w-4 mr-2" /> : <Unlock className="h-4 w-4 mr-2" />}
              <span>{mode === "encrypt" ? "Encrypted Text" : "Decrypted Text"}</span>
            </div>

            {outputText && (
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
            {isProcessing ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin mr-2">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <span>{mode === "encrypt" ? "Encrypting..." : "Decrypting..."}</span>
              </div>
            ) : outputText ? (
              <div className="whitespace-pre-wrap break-all">{outputText}</div>
            ) : (
              <div className="text-green-500/50 flex items-center justify-center h-full">
                {mode === "encrypt" ? "Encrypted output will appear here" : "Decrypted output will appear here"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={processText}
          disabled={isProcessing || !inputText || !password}
          className="bg-green-900/50 border border-green-500 px-4 py-2 text-sm hover:bg-green-900/70 disabled:opacity-50 flex items-center"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              {mode === "encrypt" ? "Encrypting..." : "Decrypting..."}
            </>
          ) : (
            <>
              {mode === "encrypt" ? <Lock className="h-4 w-4 mr-2" /> : <Unlock className="h-4 w-4 mr-2" />}
              {mode === "encrypt" ? "Encrypt" : "Decrypt"}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
