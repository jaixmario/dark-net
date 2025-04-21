"use client"

import { useState } from "react"
import { Database, Search, RefreshCw, Server } from "lucide-react"

type DnsRecord = {
  type: string
  value: string
  ttl?: number
}

export function DnsLookup() {
  const [domain, setDomain] = useState("")
  const [recordType, setRecordType] = useState("A")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<DnsRecord[]>([])
  const [error, setError] = useState("")
  const [recentLookups, setRecentLookups] = useState<string[]>([])

  const performLookup = async () => {
    if (!domain.trim()) return

    setIsLoading(true)
    setError("")
    setResults([])

    try {
      // Use a real DNS lookup API
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=${recordType}`)

      if (!response.ok) {
        throw new Error("DNS lookup failed")
      }

      const data = await response.json()

      if (data.Status !== 0) {
        throw new Error(`DNS lookup failed with status: ${data.Status}`)
      }

      const records: DnsRecord[] = []

      if (data.Answer) {
        data.Answer.forEach((answer: any) => {
          records.push({
            type: recordType,
            value: answer.data,
            ttl: answer.TTL,
          })
        })
      }

      setResults(records)

      // Add to recent lookups
      if (!recentLookups.includes(`${domain} (${recordType})`)) {
        setRecentLookups((prev) => [`${domain} (${recordType})`, ...prev].slice(0, 5))
      }
    } catch (err) {
      console.error("DNS lookup error:", err)
      setError(err instanceof Error ? err.message : "DNS lookup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      <div className="mb-4">
        <div className="flex flex-wrap items-end gap-2 mb-3">
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

          <div>
            <label className="block text-xs mb-1">Record Type:</label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="bg-gray-900 border border-green-500/50 p-2 text-sm"
              disabled={isLoading}
            >
              <option value="A">A (IPv4)</option>
              <option value="AAAA">AAAA (IPv6)</option>
              <option value="MX">MX (Mail)</option>
              <option value="TXT">TXT</option>
              <option value="NS">NS (Nameserver)</option>
              <option value="CNAME">CNAME</option>
              <option value="SOA">SOA</option>
            </select>
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
                Lookup
              </>
            )}
          </button>
        </div>

        {/* Recent Lookups */}
        {recentLookups.length > 0 && (
          <div className="mb-3">
            <div className="text-xs mb-1">Recent Lookups:</div>
            <div className="flex flex-wrap gap-2">
              {recentLookups.map((lookup, index) => {
                const [lookupDomain, lookupType] = lookup.split(" (")
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setDomain(lookupDomain)
                      setRecordType(lookupType.replace(")", ""))
                    }}
                    className="text-xs bg-gray-900/70 border border-green-500/30 px-2 py-1 hover:bg-green-900/30"
                    disabled={isLoading}
                  >
                    {lookup}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 border border-green-500/30 overflow-auto">
        <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-sm font-bold flex items-center">
          <Database className="h-4 w-4 mr-2" />
          <span>DNS Records</span>
        </div>

        {error ? (
          <div className="p-4 text-red-400 text-center">
            <p className="text-sm">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <RefreshCw className="h-8 w-8 mb-3 animate-spin" />
              <span>Looking up DNS records...</span>
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className="divide-y divide-green-500/20">
            {results.map((record, index) => (
              <div key={index} className="p-3">
                <div className="flex items-center mb-2">
                  <Server className="h-4 w-4 mr-2" />
                  <span className="font-bold">{record.type} Record</span>
                  {record.ttl && <span className="ml-auto text-xs">TTL: {record.ttl}s</span>}
                </div>
                <div className="bg-gray-900/50 p-2 font-mono text-sm break-all">{record.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-center">
            <div className="flex flex-col items-center">
              <Database className="h-8 w-8 mb-3" />
              <span>Enter a domain name and select a record type to lookup</span>
              <span className="text-xs text-green-500/70 mt-2">Example: google.com, github.com</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
