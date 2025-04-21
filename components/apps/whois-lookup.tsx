"use client"

import { useState } from "react"
import { Search, RefreshCw, Info, Globe } from "lucide-react"

export function WhoisLookup() {
  const [domain, setDomain] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [whoisData, setWhoisData] = useState("")
  const [error, setError] = useState("")
  const [recentLookups, setRecentLookups] = useState<string[]>([])

  const performLookup = async () => {
    if (!domain.trim()) return

    setIsLoading(true)
    setError("")
    setWhoisData("")

    try {
      // Use a real WHOIS API
      const response = await fetch(`https://whois.freeaiapi.xyz/?domain=${domain}`)

      if (!response.ok) {
        throw new Error("WHOIS lookup failed")
      }

      const data = await response.text()
      setWhoisData(data)

      // Add to recent lookups
      if (!recentLookups.includes(domain)) {
        setRecentLookups((prev) => [domain, ...prev].slice(0, 5))
      }
    } catch (err) {
      console.error("WHOIS lookup error:", err)
      setError(err instanceof Error ? err.message : "WHOIS lookup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      <div className="mb-4">
        <div className="flex items-end gap-2 mb-3">
          <div className="flex-1">
            <label className="block text-xs mb-1">Domain:</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain (e.g., example.com)"
              className="w-full bg-gray-900 border border-green-500/50 p-2 text-sm"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={performLookup}
            disabled={isLoading || !domain.trim()}
            className="bg-green-900/50 border border-green-500 px-4 py-2 text-sm hover:bg-green-900/70 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Looking up...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                WHOIS Lookup
              </>
            )}
          </button>
        </div>

        {/* Recent Lookups */}
        {recentLookups.length > 0 && (
          <div className="mb-3">
            <div className="text-xs mb-1">Recent Lookups:</div>
            <div className="flex flex-wrap gap-2">
              {recentLookups.map((lookup, index) => (
                <button
                  key={index}
                  onClick={() => setDomain(lookup)}
                  className="text-xs bg-gray-900/70 border border-green-500/30 px-2 py-1 hover:bg-green-900/30"
                  disabled={isLoading}
                >
                  {lookup}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 border border-green-500/30 overflow-auto">
        <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-sm font-bold flex items-center">
          <Globe className="h-4 w-4 mr-2" />
          <span>WHOIS Information</span>
        </div>

        {error ? (
          <div className="p-4 text-red-400 text-center">
            <div className="flex items-center justify-center mb-2">
              <Info className="h-5 w-5 mr-2" />
              <span>Error</span>
            </div>
            <p className="text-sm">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <RefreshCw className="h-8 w-8 mb-3 animate-spin" />
              <span>Looking up WHOIS information...</span>
            </div>
          </div>
        ) : whoisData ? (
          <div className="p-3">
            <pre className="font-mono text-xs whitespace-pre-wrap">{whoisData}</pre>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-center">
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 mb-3" />
              <span>Enter a domain name to lookup WHOIS information</span>
              <span className="text-xs text-green-500/70 mt-2">Example: google.com, github.com</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
