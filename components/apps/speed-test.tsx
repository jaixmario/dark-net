"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, RefreshCw, Zap } from "lucide-react"

export function SpeedTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadSpeed, setDownloadSpeed] = useState(0)
  const [uploadSpeed, setUploadSpeed] = useState(0)
  const [ping, setPing] = useState(0)
  const [jitter, setJitter] = useState(0)
  const [testPhase, setTestPhase] = useState<"idle" | "ping" | "download" | "upload" | "complete">("idle")
  const [testHistory, setTestHistory] = useState<
    {
      date: string
      download: number
      upload: number
      ping: number
    }[]
  >([])
  const [serverLocation, setServerLocation] = useState("New York, NY")
  const [isp, setIsp] = useState("Fiber Optic Communications")

  // Start the speed test
  const startTest = () => {
    setIsRunning(true)
    setProgress(0)
    setTestPhase("ping")
    setDownloadSpeed(0)
    setUploadSpeed(0)
    setPing(0)
    setJitter(0)

    // Simulate ping test
    setTimeout(() => {
      const pingValue = Math.floor(Math.random() * 30) + 5
      const jitterValue = Math.floor(Math.random() * 5) + 1
      setPing(pingValue)
      setJitter(jitterValue)
      setTestPhase("download")
      setProgress(20)
    }, 1500)
  }

  // Update progress and speeds during the test
  useEffect(() => {
    if (!isRunning) return

    let interval: NodeJS.Timeout

    if (testPhase === "download") {
      let currentProgress = 20
      let currentSpeed = 0
      const maxSpeed = Math.floor(Math.random() * 500) + 500 // 500-1000 Mbps

      interval = setInterval(() => {
        currentProgress += 2
        currentSpeed = Math.min(maxSpeed, currentSpeed + Math.floor(Math.random() * 50))
        setDownloadSpeed(currentSpeed)
        setProgress(currentProgress)

        if (currentProgress >= 60) {
          clearInterval(interval)
          setTestPhase("upload")
        }
      }, 100)
    } else if (testPhase === "upload") {
      let currentProgress = 60
      let currentSpeed = 0
      const maxSpeed = Math.floor(Math.random() * 200) + 300 // 300-500 Mbps

      interval = setInterval(() => {
        currentProgress += 2
        currentSpeed = Math.min(maxSpeed, currentSpeed + Math.floor(Math.random() * 30))
        setUploadSpeed(currentSpeed)
        setProgress(currentProgress)

        if (currentProgress >= 100) {
          clearInterval(interval)
          setTestPhase("complete")
          setIsRunning(false)

          // Add to history
          setTestHistory((prev) => [
            {
              date: new Date().toLocaleTimeString(),
              download: downloadSpeed,
              upload: currentSpeed,
              ping: ping,
            },
            ...prev.slice(0, 4), // Keep only the last 5 tests
          ])
        }
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, testPhase])

  // Get color based on speed
  const getSpeedColor = (speed: number) => {
    if (speed > 500) return "text-green-400"
    if (speed > 200) return "text-blue-400"
    if (speed > 100) return "text-yellow-400"
    return "text-red-400"
  }

  // Get color based on ping
  const getPingColor = (ping: number) => {
    if (ping < 10) return "text-green-400"
    if (ping < 20) return "text-blue-400"
    if (ping < 50) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-bold flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Network Speed Test
        </div>
        <button
          onClick={startTest}
          disabled={isRunning}
          className="bg-green-900/50 border border-green-500 px-4 py-2 text-sm hover:bg-green-900/70 disabled:opacity-50 flex items-center"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Start Test
            </>
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3 border border-green-500/30 p-4 flex flex-col">
          {/* Test Progress */}
          {(isRunning || testPhase === "complete") && (
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-1">
                <span>{testPhase === "complete" ? "Test Complete" : `Testing: ${testPhase.toUpperCase()}`}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-900 h-2 mb-2">
                <div
                  className="h-full bg-green-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Speed Gauges */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Download Speed */}
            <div className="flex flex-col items-center">
              <div className="text-sm mb-2 flex items-center">
                <ArrowDown className="h-4 w-4 mr-1" />
                Download
              </div>
              <div className={`text-4xl font-bold ${getSpeedColor(downloadSpeed)}`}>{downloadSpeed.toFixed(2)}</div>
              <div className="text-xs text-green-500/70">Mbps</div>

              {/* Speed Gauge */}
              <div className="w-full bg-gray-900 h-4 mt-4 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getSpeedColor(downloadSpeed).replace("text-", "bg-")}`}
                  style={{ width: `${Math.min(100, (downloadSpeed / 1000) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Upload Speed */}
            <div className="flex flex-col items-center">
              <div className="text-sm mb-2 flex items-center">
                <ArrowUp className="h-4 w-4 mr-1" />
                Upload
              </div>
              <div className={`text-4xl font-bold ${getSpeedColor(uploadSpeed)}`}>{uploadSpeed.toFixed(2)}</div>
              <div className="text-xs text-green-500/70">Mbps</div>

              {/* Speed Gauge */}
              <div className="w-full bg-gray-900 h-4 mt-4 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getSpeedColor(uploadSpeed).replace("text-", "bg-")}`}
                  style={{ width: `${Math.min(100, (uploadSpeed / 500) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Ping */}
            <div className="flex flex-col items-center">
              <div className="text-sm mb-2">Ping</div>
              <div className={`text-3xl font-bold ${getPingColor(ping)}`}>{ping}</div>
              <div className="text-xs text-green-500/70">ms</div>
            </div>

            {/* Jitter */}
            <div className="flex flex-col items-center">
              <div className="text-sm mb-2">Jitter</div>
              <div className={`text-3xl font-bold ${getPingColor(jitter)}`}>{jitter}</div>
              <div className="text-xs text-green-500/70">ms</div>
            </div>
          </div>

          {/* Server Info */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-green-500/70 text-xs">Server Location</div>
              <div>{serverLocation}</div>
            </div>
            <div>
              <div className="text-green-500/70 text-xs">Internet Service Provider</div>
              <div>{isp}</div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 border border-green-500/30 p-4">
          <div className="text-sm font-bold mb-3 flex items-center">
            <RefreshCw className="h-4 w-4 mr-1" />
            Test History
          </div>

          {testHistory.length > 0 ? (
            <div className="space-y-3">
              {testHistory.map((test, index) => (
                <div key={index} className="border border-green-500/20 p-2 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-green-500/70">{test.date}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-green-500/70">Download</div>
                      <div className={getSpeedColor(test.download)}>{test.download.toFixed(2)} Mbps</div>
                    </div>
                    <div>
                      <div className="text-green-500/70">Upload</div>
                      <div className={getSpeedColor(test.upload)}>{test.upload.toFixed(2)} Mbps</div>
                    </div>
                    <div>
                      <div className="text-green-500/70">Ping</div>
                      <div className={getPingColor(test.ping)}>{test.ping} ms</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-green-500/50 py-8">No test history available</div>
          )}
        </div>
      </div>
    </div>
  )
}
