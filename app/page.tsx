"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { HackingDesktop } from "@/components/hacking-desktop"
import { GlitchText } from "@/components/glitch-text"
import { MatrixBackground } from "@/components/matrix-background"

export default function HackingSimulator() {
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [welcomeMessage, setWelcomeMessage] = useState("")

  useEffect(() => {
    // Add a class to the body for global styling
    document.body.classList.add("hacking-theme")

    return () => {
      document.body.classList.remove("hacking-theme")
    }
  }, [])

  // Update the handleLogin function to accept the new users
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate authentication delay
    setTimeout(() => {
      // Check if credentials match any of the expected values
      if (
        (username === "JAI" && password === "MARIOpapaJI69") ||
        (username === "raj" && password === "P@ssw0rd!") ||
        (username === "ghost" && password === "P@ssw0rd!")
      ) {
        setWelcomeMessage(`Welcome back, ${username}! Access granted to all systems.`)
        setAuthenticated(true)
        setLoading(false)
      } else {
        setError("ACCESS DENIED: Invalid credentials")
        setLoading(false)
      }
    }, 1500)
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center overflow-hidden relative">
        <MatrixBackground />

        <div className="z-10 w-full max-w-md p-6 border border-green-500 bg-black/80 backdrop-blur-sm">
          <GlitchText text="DARKNET ACCESS TERMINAL" className="text-2xl font-bold mb-6 text-center" />

          <div className="mb-4 text-center">
            <div className="inline-block border border-green-500/50 p-2 rounded-full mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <p className="text-xs text-green-400 animate-pulse">SECURE AUTHENTICATION REQUIRED</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-1 text-xs uppercase tracking-wider">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-green-500/50 p-2 text-green-400 focus:outline-none focus:border-green-400"
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-xs uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-green-500/50 p-2 text-green-400 focus:outline-none focus:border-green-400"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500/70 hover:text-green-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-900/30 border border-green-500 py-2 hover:bg-green-900/50 transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  AUTHENTICATING...
                </span>
              ) : (
                "LOGIN"
              )}
            </button>
          </form>

          {error && <div className="mt-4 text-red-500 text-sm text-center animate-pulse">{error}</div>}

          <div className="mt-6 text-xs text-green-500/70 text-center">
            <p>UNAUTHORIZED ACCESS IS PROHIBITED</p>
            <p>ALL CONNECTIONS ARE MONITORED AND RECORDED</p>
          </div>
        </div>
      </div>
    )
  }

  return <HackingDesktop username={username} onLogout={() => setAuthenticated(false)} welcomeMessage={welcomeMessage} />
}
