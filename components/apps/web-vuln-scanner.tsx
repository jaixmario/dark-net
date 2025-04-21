"use client"

import { useState } from "react"
import { Search, RefreshCw, AlertTriangle, Shield } from "lucide-react"

type Vulnerability = {
  id: string
  name: string
  severity: "critical" | "high" | "medium" | "low" | "info"
  description: string
  location: string
  recommendation: string
}

export function WebVulnScanner() {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [scanResults, setScanResults] = useState<Vulnerability[]>([])
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null)
  const [scanOptions, setScanOptions] = useState({
    checkXss: true,
    checkSqli: true,
    checkCsrf: true,
    checkHeaders: true,
    checkSsl: true,
  })

  const startScan = () => {
    if (!url) return

    setIsScanning(true)
    setProgress(0)
    setScanResults([])
    setSelectedVulnerability(null)

    // Simulate scanning progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          generateFakeResults()
          return 100
        }
        return prev + 2
      })
    }, 200)
  }

  const generateFakeResults = () => {
    const vulnerabilities: Vulnerability[] = []

    // Generate vulnerabilities based on selected options
    if (scanOptions.checkXss && Math.random() > 0.5) {
      vulnerabilities.push({
        id: "vuln-1",
        name: "Cross-Site Scripting (XSS)",
        severity: "high",
        description:
          "Reflected XSS vulnerability found in search parameter. The application does not properly sanitize user input before reflecting it back in the response.",
        location: `${url}/search?q=test`,
        recommendation:
          "Implement proper input validation and output encoding. Consider using a Content Security Policy (CSP).",
      })
    }

    if (scanOptions.checkSqli && Math.random() > 0.6) {
      vulnerabilities.push({
        id: "vuln-2",
        name: "SQL Injection",
        severity: "critical",
        description:
          "SQL injection vulnerability detected in the id parameter. The application does not properly sanitize user input before using it in database queries.",
        location: `${url}/product?id=1`,
        recommendation:
          "Use parameterized queries or prepared statements. Implement input validation and consider using an ORM.",
      })
    }

    if (scanOptions.checkCsrf && Math.random() > 0.4) {
      vulnerabilities.push({
        id: "vuln-3",
        name: "Cross-Site Request Forgery (CSRF)",
        severity: "medium",
        description:
          "CSRF vulnerability detected in the user profile update form. The application does not implement anti-CSRF tokens.",
        location: `${url}/profile/update`,
        recommendation:
          "Implement anti-CSRF tokens for all state-changing operations. Consider using the SameSite cookie attribute.",
      })
    }

    if (scanOptions.checkHeaders) {
      vulnerabilities.push({
        id: "vuln-4",
        name: "Missing Security Headers",
        severity: "low",
        description:
          "The application is missing important security headers such as Content-Security-Policy, X-Content-Type-Options, and X-Frame-Options.",
        location: `${url}`,
        recommendation: "Implement the missing security headers to enhance the security posture of the application.",
      })
    }

    if (scanOptions.checkSsl && Math.random() > 0.7) {
      vulnerabilities.push({
        id: "vuln-5",
        name: "SSL/TLS Misconfiguration",
        severity: "medium",
        description: "The server supports outdated SSL/TLS protocols (TLS 1.0/1.1) and weak cipher suites.",
        location: `${url}`,
        recommendation: "Disable outdated protocols (TLS 1.0/1.1) and weak cipher suites. Enable TLS 1.2/1.3 only.",
      })
    }

    // Add some informational findings
    vulnerabilities.push({
      id: "vuln-6",
      name: "Information Disclosure",
      severity: "info",
      description: "Server version information is disclosed in HTTP headers.",
      location: `${url}`,
      recommendation: "Configure the server to hide version information in HTTP headers.",
    })

    // Sort by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 }
    vulnerabilities.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

    setScanResults(vulnerabilities)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500"
      case "high":
        return "text-orange-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-blue-500"
      case "info":
        return "text-gray-400"
      default:
        return ""
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
      case "low":
        return <Shield className="h-4 w-4" />
      case "info":
        return <Search className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      <div className="mb-4">
        <div className="flex flex-wrap items-end gap-2 mb-3">
          <div className="flex-1">
            <label className="block text-xs mb-1">Target URL:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL (e.g., https://example.com)"
              className="w-full bg-gray-900 border border-green-500/50 p-2 text-sm"
              disabled={isScanning}
            />
          </div>

          <button
            onClick={startScan}
            disabled={isScanning || !url.trim()}
            className="bg-green-900/50 border border-green-500 px-4 py-2 text-sm hover:bg-green-900/70 disabled:opacity-50 flex items-center"
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Scan Website
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <label className="flex items-center text-xs">
            <input
              type="checkbox"
              checked={scanOptions.checkXss}
              onChange={(e) => setScanOptions({ ...scanOptions, checkXss: e.target.checked })}
              className="mr-1"
              disabled={isScanning}
            />
            XSS
          </label>
          <label className="flex items-center text-xs">
            <input
              type="checkbox"
              checked={scanOptions.checkSqli}
              onChange={(e) => setScanOptions({ ...scanOptions, checkSqli: e.target.checked })}
              className="mr-1"
              disabled={isScanning}
            />
            SQL Injection
          </label>
          <label className="flex items-center text-xs">
            <input
              type="checkbox"
              checked={scanOptions.checkCsrf}
              onChange={(e) => setScanOptions({ ...scanOptions, checkCsrf: e.target.checked })}
              className="mr-1"
              disabled={isScanning}
            />
            CSRF
          </label>
          <label className="flex items-center text-xs">
            <input
              type="checkbox"
              checked={scanOptions.checkHeaders}
              onChange={(e) => setScanOptions({ ...scanOptions, checkHeaders: e.target.checked })}
              className="mr-1"
              disabled={isScanning}
            />
            Security Headers
          </label>
          <label className="flex items-center text-xs">
            <input
              type="checkbox"
              checked={scanOptions.checkSsl}
              onChange={(e) => setScanOptions({ ...scanOptions, checkSsl: e.target.checked })}
              className="mr-1"
              disabled={isScanning}
            />
            SSL/TLS
          </label>
        </div>

        {isScanning && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Scanning website...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-900 h-2">
              <div className="bg-green-500 h-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden">
        {/* Vulnerabilities List */}
        <div className="w-full md:w-1/2 border border-green-500/30 overflow-auto">
          <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-sm font-bold flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span>Detected Vulnerabilities</span>
          </div>

          <div className="divide-y divide-green-500/20">
            {scanResults.length === 0 ? (
              <div className="p-4 text-center text-sm text-green-500/70">
                {isScanning ? "Scanning in progress..." : "No vulnerabilities detected. Start a scan."}
              </div>
            ) : (
              scanResults.map((vuln) => (
                <div
                  key={vuln.id}
                  className={`p-3 text-sm cursor-pointer hover:bg-green-900/20 ${selectedVulnerability?.id === vuln.id ? "bg-green-900/30" : ""}`}
                  onClick={() => setSelectedVulnerability(vuln)}
                >
                  <div className="flex items-center mb-1">
                    <div className={`mr-2 ${getSeverityColor(vuln.severity)}`}>{getSeverityIcon(vuln.severity)}</div>
                    <span className="font-bold">{vuln.name}</span>
                    <span className={`ml-auto text-xs uppercase ${getSeverityColor(vuln.severity)}`}>
                      {vuln.severity}
                    </span>
                  </div>
                  <p className="text-xs text-green-500/70 truncate">{vuln.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Vulnerability Details */}
        <div className="w-full md:w-1/2 border border-green-500/30 overflow-auto">
          {selectedVulnerability ? (
            <div className="p-3">
              <div className="flex items-center mb-4">
                <div className={`mr-2 ${getSeverityColor(selectedVulnerability.severity)}`}>
                  {getSeverityIcon(selectedVulnerability.severity)}
                </div>
                <h3 className="text-lg">{selectedVulnerability.name}</h3>
                <span
                  className={`ml-auto px-2 py-1 text-xs rounded border ${getSeverityColor(selectedVulnerability.severity)} border-current`}
                >
                  {selectedVulnerability.severity.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-bold mb-1">Description:</div>
                  <p className="text-sm">{selectedVulnerability.description}</p>
                </div>

                <div>
                  <div className="text-sm font-bold mb-1">Location:</div>
                  <div className="bg-gray-900/50 p-2 text-sm font-mono break-all">{selectedVulnerability.location}</div>
                </div>

                <div>
                  <div className="text-sm font-bold mb-1">Recommendation:</div>
                  <p className="text-sm">{selectedVulnerability.recommendation}</p>
                </div>

                <div className="p-3 border border-green-500/30 bg-green-900/10">
                  <div className="flex items-center mb-2">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="text-sm font-bold">Security Impact</span>
                  </div>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    {selectedVulnerability.severity === "critical" || selectedVulnerability.severity === "high" ? (
                      <>
                        <li>May allow unauthorized access to sensitive data</li>
                        <li>Could lead to complete system compromise</li>
                        <li>High risk of data exfiltration</li>
                      </>
                    ) : selectedVulnerability.severity === "medium" ? (
                      <>
                        <li>May allow partial access to sensitive data</li>
                        <li>Could lead to limited system compromise</li>
                        <li>Moderate risk of data exfiltration</li>
                      </>
                    ) : (
                      <>
                        <li>Limited security impact</li>
                        <li>May provide information to attackers</li>
                        <li>Should be addressed as part of security best practices</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-green-500/70 h-full flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Shield className="h-8 w-8 mb-3" />
                <span>Select a vulnerability to view details</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
