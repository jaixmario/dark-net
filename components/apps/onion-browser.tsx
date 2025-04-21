"use client"

import type React from "react"

import { useState } from "react"
import { Globe, Search, Shield, Lock, RefreshCw, AlertTriangle, Eye, EyeOff, Settings } from "lucide-react"

export function OnionBrowser() {
  const [url, setUrl] = useState("http://onionbrowser.start")
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [bookmarks, setBookmarks] = useState<{ url: string; title: string }[]>([
    { url: "http://onionbrowser.start", title: "Onion Start Page" },
    { url: "http://3g2upl4pq6kufc4m.onion", title: "Search Engine" },
    { url: "http://zqktlwiuavvvqqt4ybvgvi7tyo4hjl5xgfuvpdf6otjiycgwqbym2qad.onion", title: "Dark Forum" },
    { url: "http://darkmarketxz7adw.onion", title: "Dark Market" },
  ])
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [securityLevel, setSecurityLevel] = useState<"standard" | "safer" | "safest">("standard")
  const [isPrivate, setIsPrivate] = useState(true)
  const [tabs, setTabs] = useState<{ id: string; url: string; title: string; isActive: boolean }[]>([
    { id: "tab-1", url: "http://onionbrowser.start", title: "Onion Start", isActive: true },
  ])
  const [showSettings, setShowSettings] = useState(false)

  // Simulate page loading
  const loadPage = (pageUrl: string) => {
    if (pageUrl === url) return

    setIsLoading(true)
    setUrl(pageUrl)

    // Add to history
    if (historyIndex < history.length - 1) {
      setHistory([...history.slice(0, historyIndex + 1), pageUrl])
    } else {
      setHistory([...history, pageUrl])
    }
    setHistoryIndex(history.length)

    // Update active tab
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.isActive) {
          return { ...tab, url: pageUrl, title: getPageTitle(pageUrl) }
        }
        return tab
      }),
    )

    // Simulate loading delay
    setTimeout(() => {
      setCurrentPage(pageUrl)
      setIsLoading(false)
    }, 1500)
  }

  // Get page title based on URL
  const getPageTitle = (pageUrl: string): string => {
    if (pageUrl === "http://onionbrowser.start") return "Onion Start"
    if (pageUrl.includes("3g2upl4pq6kufc4m")) return "Secure Search"
    if (pageUrl.includes("zqktlwiuavvvqqt4ybvgvi7tyo4hjl5xgfuvpdf6otjiycgwqbym2qad")) return "Dark Forum"
    if (pageUrl.includes("darkmarketxz7adw")) return "Dark Market"

    // Extract domain for other URLs
    try {
      const domain = new URL(pageUrl).hostname
      return domain.split(".")[0]
    } catch {
      return "Unknown Page"
    }
  }

  // Handle URL submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Add .onion if missing and not a known protocol
    let processedUrl = url
    if (!url.includes("://") && !url.endsWith(".onion")) {
      processedUrl = `http://${url}.onion`
    } else if (!url.includes("://")) {
      processedUrl = `http://${url}`
    }

    loadPage(processedUrl)
  }

  // Go back in history
  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setUrl(history[historyIndex - 1])
      setCurrentPage(history[historyIndex - 1])

      // Update active tab
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.isActive) {
            return { ...tab, url: history[historyIndex - 1], title: getPageTitle(history[historyIndex - 1]) }
          }
          return tab
        }),
      )
    }
  }

  // Go forward in history
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setUrl(history[historyIndex + 1])
      setCurrentPage(history[historyIndex + 1])

      // Update active tab
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.isActive) {
            return { ...tab, url: history[historyIndex + 1], title: getPageTitle(history[historyIndex + 1]) }
          }
          return tab
        }),
      )
    }
  }

  // Add a new tab
  const addTab = () => {
    // Deactivate all current tabs
    setTabs((prev) => prev.map((tab) => ({ ...tab, isActive: false })))

    // Add new tab
    const newTab = {
      id: `tab-${Date.now()}`,
      url: "http://onionbrowser.start",
      title: "Onion Start",
      isActive: true,
    }

    setTabs((prev) => [...prev, newTab])
    setUrl("http://onionbrowser.start")
    setCurrentPage("http://onionbrowser.start")
  }

  // Close a tab
  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    // Get the tab to be closed
    const tabToClose = tabs.find((tab) => tab.id === id)

    // Don't close if it's the last tab
    if (tabs.length <= 1) return

    // If closing the active tab, activate another tab
    if (tabToClose?.isActive) {
      const tabIndex = tabs.findIndex((tab) => tab.id === id)
      const newActiveIndex = tabIndex === 0 ? 1 : tabIndex - 1

      setTabs((prev) =>
        prev
          .map((tab, i) => (i === newActiveIndex ? { ...tab, isActive: true } : { ...tab, isActive: false }))
          .filter((tab) => tab.id !== id),
      )

      // Set URL and page to the newly active tab
      const newActiveTab = tabs[newActiveIndex === 0 ? 1 : newActiveIndex]
      setUrl(newActiveTab.url)
      setCurrentPage(newActiveTab.url)
    } else {
      // Just remove the tab if it's not active
      setTabs((prev) => prev.filter((tab) => tab.id !== id))
    }
  }

  // Switch to a tab
  const switchTab = (id: string) => {
    const targetTab = tabs.find((tab) => tab.id === id)
    if (!targetTab) return

    setTabs((prev) => prev.map((tab) => (tab.id === id ? { ...tab, isActive: true } : { ...tab, isActive: false })))

    setUrl(targetTab.url)
    setCurrentPage(targetTab.url)
  }

  // Render page content based on URL
  const renderPageContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <RefreshCw className="h-8 w-8 mb-3 animate-spin text-purple-500" />
          <div className="text-sm">Establishing secure connection through Tor network...</div>
          <div className="text-xs text-purple-400 mt-2">Routing through multiple relays for anonymity</div>
        </div>
      )
    }

    if (!currentPage) return null

    if (currentPage === "http://onionbrowser.start") {
      return (
        <div className="p-6 max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-purple-900 flex items-center justify-center">
                <Globe className="h-12 w-12 text-purple-300" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-900 rounded-full flex items-center justify-center">
                <Lock className="h-4 w-4 text-green-300" />
              </div>
            </div>
          </div>

          <h1 className="text-xl text-center text-purple-400 mb-6">Onion Browser</h1>

          <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Search or enter address"
                className="flex-1 bg-black border border-purple-500/50 p-2 text-sm rounded-l focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-900/50 border border-purple-500/50 border-l-0 px-3 rounded-r hover:bg-purple-900/70"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {bookmarks.map((bookmark, index) => (
              <button
                key={index}
                className="p-3 bg-gray-900/30 border border-purple-500/30 rounded hover:bg-purple-900/20 text-left"
                onClick={() => loadPage(bookmark.url)}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center mr-2">
                    <Globe className="h-4 w-4 text-purple-300" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-purple-300">{bookmark.title}</div>
                    <div className="text-xs text-purple-500/70 truncate">{bookmark.url}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="text-xs text-center text-purple-500/70">
            <p>Your connection is secure and anonymous through the Tor network</p>
            <p className="mt-1">Security Level: {securityLevel.charAt(0).toUpperCase() + securityLevel.slice(1)}</p>
          </div>
        </div>
      )
    }

    if (currentPage.includes("3g2upl4pq6kufc4m")) {
      return (
        <div className="p-6 max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
              <Search className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <h1 className="text-xl text-center text-purple-400 mb-6">Secure Search</h1>

          <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
            <div className="flex">
              <input
                type="text"
                placeholder="Search anonymously..."
                className="flex-1 bg-black border border-purple-500/50 p-2 text-sm rounded-l focus:outline-none focus:border-purple-500"
              />
              <button className="bg-purple-900/50 border border-purple-500/50 border-l-0 px-3 rounded-r hover:bg-purple-900/70">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="text-sm text-center text-purple-500/70 mb-6">
            <p>The most private search engine</p>
            <p>No tracking, no logs, no surveillance</p>
          </div>

          <div className="bg-gray-900/30 p-4 rounded-lg">
            <h2 className="text-sm font-bold text-purple-400 mb-2">Privacy Features</h2>
            <ul className="text-xs space-y-2">
              <li className="flex items-center">
                <Shield className="h-3 w-3 mr-2 text-green-400" />
                <span>No personal information is collected or shared</span>
              </li>
              <li className="flex items-center">
                <Shield className="h-3 w-3 mr-2 text-green-400" />
                <span>Encrypted connections protect your search queries</span>
              </li>
              <li className="flex items-center">
                <Shield className="h-3 w-3 mr-2 text-green-400" />
                <span>No targeted ads or search history profiling</span>
              </li>
            </ul>
          </div>
        </div>
      )
    }

    if (currentPage.includes("zqktlwiuavvvqqt4ybvgvi7tyo4hjl5xgfuvpdf6otjiycgwqbym2qad")) {
      return (
        <div className="p-4">
          <h1 className="text-lg text-purple-400 mb-4">Dark Forum</h1>

          <div className="bg-gray-900/50 p-3 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold">Welcome to the Hidden Forum</h2>
              <span className="text-xs bg-purple-900/50 px-2 py-1 rounded">5,432 users online</span>
            </div>
            <p className="text-xs text-purple-500/70 mb-3">
              This is a secure communication platform. Remember to follow the forum rules and maintain operational
              security.
            </p>
            <div className="flex space-x-2 text-xs">
              <button className="bg-purple-900/50 border border-purple-500/50 px-2 py-1 rounded hover:bg-purple-900/70">
                Login
              </button>
              <button className="bg-gray-800/50 border border-gray-700 px-2 py-1 rounded hover:bg-gray-800/70">
                Register
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { title: "Security Discussion", posts: 1243, lastActive: "2 minutes ago" },
              { title: "Cryptography", posts: 876, lastActive: "15 minutes ago" },
              { title: "Privacy Tools", posts: 2154, lastActive: "Just now" },
              { title: "System Administration", posts: 543, lastActive: "1 hour ago" },
              { title: "Network Security", posts: 987, lastActive: "30 minutes ago" },
            ].map((forum, index) => (
              <div key={index} className="bg-gray-900/30 p-3 rounded-lg border border-purple-500/20">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-purple-300">{forum.title}</h3>
                  <span className="text-xs bg-gray-800 px-2 py-0.5 rounded">{forum.posts} posts</span>
                </div>
                <div className="text-xs text-purple-500/70 mt-1">Last active: {forum.lastActive}</div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (currentPage.includes("darkmarketxz7adw")) {
      return (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg text-purple-400">Dark Market</h1>
            <div className="flex items-center text-xs">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              <span>Secure Connection</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-900/30 p-3 rounded-lg border border-purple-500/20">
              <h3 className="text-sm font-bold text-purple-300 mb-2">Market Categories</h3>
              <ul className="text-xs space-y-1">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1"></span>
                  <span>Digital Goods</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1"></span>
                  <span>Security Software</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1"></span>
                  <span>Hacking Tools</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1"></span>
                  <span>Secure Communication</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-900/30 p-3 rounded-lg border border-purple-500/20">
              <h3 className="text-sm font-bold text-purple-300 mb-2">Market Stats</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-purple-500/70">Vendors:</div>
                  <div>1,234</div>
                </div>
                <div>
                  <div className="text-purple-500/70">Listings:</div>
                  <div>15,678</div>
                </div>
                <div>
                  <div className="text-purple-500/70">Users:</div>
                  <div>45,321</div>
                </div>
                <div>
                  <div className="text-purple-500/70">Transactions:</div>
                  <div>234,567</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 p-3 rounded-lg">
            <h3 className="text-sm font-bold text-purple-300 mb-2">Featured Listings</h3>
            <div className="space-y-2">
              {[
                { name: "Premium VPN Service", price: "0.012 BTC", rating: "4.9/5" },
                { name: "Secure OS Package", price: "0.025 BTC", rating: "4.8/5" },
                { name: "Encrypted Communication Suite", price: "0.018 BTC", rating: "4.7/5" },
                { name: "Network Analysis Tools", price: "0.031 BTC", rating: "4.9/5" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-black/30 rounded border border-purple-500/10"
                >
                  <div>
                    <div className="text-xs font-bold">{item.name}</div>
                    <div className="text-[10px] text-purple-500/70">Rating: {item.rating}</div>
                  </div>
                  <div className="text-xs">{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    // Default page for unknown URLs
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <AlertTriangle className="h-12 w-12 mb-4 text-yellow-500" />
        <h2 className="text-lg mb-2">Page Not Found</h2>
        <p className="text-sm text-center mb-4">
          The onion site you're looking for might be offline or the address might be incorrect.
        </p>
        <button
          onClick={() => loadPage("http://onionbrowser.start")}
          className="bg-purple-900/50 border border-purple-500/50 px-3 py-1 text-sm rounded hover:bg-purple-900/70"
        >
          Return to Start Page
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-950 text-purple-300">
      {/* Browser Toolbar */}
      <div className="bg-gray-900 border-b border-purple-500/30 p-2 flex items-center">
        <div className="flex space-x-1 mr-2">
          <button className="p-1 hover:bg-purple-900/30 rounded" onClick={goBack} disabled={historyIndex <= 0}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="p-1 hover:bg-purple-900/30 rounded"
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="p-1 hover:bg-purple-900/30 rounded"
            onClick={() => loadPage(currentPage || "http://onionbrowser.start")}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex">
          <div className="flex items-center bg-black border border-purple-500/50 rounded-l px-2">
            <Lock className="h-3 w-3 text-green-500" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-black border-y border-purple-500/50 p-1 text-xs focus:outline-none"
          />
          <button type="submit" className="bg-black border border-purple-500/50 rounded-r px-2">
            <Search className="h-3 w-3" />
          </button>
        </form>

        <div className="flex space-x-1 ml-2">
          <button
            className="p-1 hover:bg-purple-900/30 rounded relative"
            onClick={() => setShowBookmarks(!showBookmarks)}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {showBookmarks && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-gray-900 border border-purple-500/50 shadow-lg z-10">
                <div className="p-1 text-xs font-bold border-b border-purple-500/30">Bookmarks</div>
                <div className="max-h-48 overflow-y-auto">
                  {bookmarks.map((bookmark, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-2 text-xs hover:bg-purple-900/30 flex items-center"
                      onClick={() => {
                        loadPage(bookmark.url)
                        setShowBookmarks(false)
                      }}
                    >
                      <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{bookmark.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </button>

          <button
            className="p-1 hover:bg-purple-900/30 rounded"
            onClick={() => setIsPrivate(!isPrivate)}
            title={isPrivate ? "Private Browsing Enabled" : "Private Browsing Disabled"}
          >
            {isPrivate ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>

          <button
            className="p-1 hover:bg-purple-900/30 rounded relative"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />

            {showSettings && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-gray-900 border border-purple-500/50 shadow-lg z-10">
                <div className="p-1 text-xs font-bold border-b border-purple-500/30">Security Settings</div>
                <div className="p-2">
                  <div className="mb-2">
                    <div className="text-xs mb-1">Security Level:</div>
                    <select
                      value={securityLevel}
                      onChange={(e) => setSecurityLevel(e.target.value as "standard" | "safer" | "safest")}
                      className="w-full bg-black border border-purple-500/50 p-1 text-xs"
                    >
                      <option value="standard">Standard</option>
                      <option value="safer">Safer</option>
                      <option value="safest">Safest</option>
                    </select>
                  </div>
                  <div className="text-xs text-purple-500/70">
                    Higher security levels may affect website functionality
                  </div>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-gray-900/50 border-b border-purple-500/30 flex items-center overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center p-1 pr-2 border-r border-purple-500/20 cursor-pointer ${tab.isActive ? "bg-gray-900" : "hover:bg-gray-900/50"}`}
            onClick={() => switchTab(tab.id)}
          >
            <div className="flex items-center max-w-[150px]">
              <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="text-xs truncate">{tab.title}</span>
            </div>
            <button className="ml-2 hover:bg-purple-900/30 rounded-full p-0.5" onClick={(e) => closeTab(tab.id, e)}>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}
        <button className="p-1 hover:bg-purple-900/30 rounded-full ml-1" onClick={addTab}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Browser Content */}
      <div className="flex-1 overflow-auto">{renderPageContent()}</div>

      {/* Status Bar */}
      <div className="bg-gray-900 border-t border-purple-500/30 p-1 flex items-center justify-between text-xs">
        <div className="flex items-center">
          <Lock className="h-3 w-3 mr-1 text-green-500" />
          <span>Secure Connection</span>
        </div>
        <div>{isPrivate ? "Private Browsing Enabled" : "Standard Browsing"}</div>
      </div>
    </div>
  )
}
