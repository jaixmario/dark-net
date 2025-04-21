"use client"

import { useState, useEffect } from "react"
import {
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Trash,
  Edit,
  RefreshCw,
  FolderPlus,
  FileText,
  ArrowLeft,
  ArrowRight,
  Home,
  Search,
} from "lucide-react"

type FileSystemItem = {
  id: string
  name: string
  type: "file" | "directory"
  size?: number
  modified: string
  permissions: string
  owner: string
  content?: string
  children?: FileSystemItem[]
}

export function FileManager() {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([])
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<FileSystemItem | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [history, setHistory] = useState<string[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showProperties, setShowProperties] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [isCreatingFile, setIsCreatingFile] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)

  // Initialize file system
  useEffect(() => {
    initializeFileSystem()
  }, [])

  const initializeFileSystem = () => {
    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      const rootFileSystem: FileSystemItem[] = [
        {
          id: "root",
          name: "/",
          type: "directory",
          modified: "2023-05-15 10:30:45",
          permissions: "drwxr-xr-x",
          owner: "root",
          children: [
            {
              id: "home",
              name: "home",
              type: "directory",
              modified: "2023-05-15 10:30:45",
              permissions: "drwxr-xr-x",
              owner: "root",
              children: [
                {
                  id: "user",
                  name: "user",
                  type: "directory",
                  modified: "2023-05-15 10:30:45",
                  permissions: "drwxr-xr-x",
                  owner: "user",
                  children: [
                    {
                      id: "documents",
                      name: "Documents",
                      type: "directory",
                      modified: "2023-05-15 10:30:45",
                      permissions: "drwxr-xr-x",
                      owner: "user",
                      children: [
                        {
                          id: "notes.txt",
                          name: "notes.txt",
                          type: "file",
                          size: 2048,
                          modified: "2023-05-15 10:30:45",
                          permissions: "-rw-r--r--",
                          owner: "user",
                          content:
                            "These are my secret notes.\nRemember to update the security protocols.\nPassword: supersecret123",
                        },
                        {
                          id: "project.pdf",
                          name: "project.pdf",
                          type: "file",
                          size: 1048576,
                          modified: "2023-05-14 15:22:10",
                          permissions: "-rw-r--r--",
                          owner: "user",
                        },
                      ],
                    },
                    {
                      id: "downloads",
                      name: "Downloads",
                      type: "directory",
                      modified: "2023-05-13 08:15:30",
                      permissions: "drwxr-xr-x",
                      owner: "user",
                      children: [
                        {
                          id: "hack_tools.zip",
                          name: "hack_tools.zip",
                          type: "file",
                          size: 5242880,
                          modified: "2023-05-13 08:15:30",
                          permissions: "-rw-r--r--",
                          owner: "user",
                        },
                      ],
                    },
                    {
                      id: ".ssh",
                      name: ".ssh",
                      type: "directory",
                      modified: "2023-04-20 12:00:00",
                      permissions: "drwx------",
                      owner: "user",
                      children: [
                        {
                          id: "id_rsa",
                          name: "id_rsa",
                          type: "file",
                          size: 1024,
                          modified: "2023-04-20 12:00:00",
                          permissions: "-rw-------",
                          owner: "user",
                          content:
                            "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA1c7Jxg7r4S0X...\n-----END RSA PRIVATE KEY-----",
                        },
                        {
                          id: "id_rsa.pub",
                          name: "id_rsa.pub",
                          type: "file",
                          size: 256,
                          modified: "2023-04-20 12:00:00",
                          permissions: "-rw-r--r--",
                          owner: "user",
                          content: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDU... user@machine",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "etc",
              name: "etc",
              type: "directory",
              modified: "2023-05-10 09:45:12",
              permissions: "drwxr-xr-x",
              owner: "root",
              children: [
                {
                  id: "passwd",
                  name: "passwd",
                  type: "file",
                  size: 4096,
                  modified: "2023-05-10 09:45:12",
                  permissions: "-rw-r--r--",
                  owner: "root",
                  content: "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:User,,,:/home/user:/bin/bash",
                },
                {
                  id: "shadow",
                  name: "shadow",
                  type: "file",
                  size: 2048,
                  modified: "2023-05-10 09:45:12",
                  permissions: "-rw-r-----",
                  owner: "root",
                  content: "root:$6$xyz$abc123hash:18900:0:99999:7:::\nuser:$6$uvw$def456hash:18900:0:99999:7:::",
                },
              ],
            },
            {
              id: "var",
              name: "var",
              type: "directory",
              modified: "2023-05-12 14:20:30",
              permissions: "drwxr-xr-x",
              owner: "root",
              children: [
                {
                  id: "log",
                  name: "log",
                  type: "directory",
                  modified: "2023-05-12 14:20:30",
                  permissions: "drwxr-xr-x",
                  owner: "root",
                  children: [
                    {
                      id: "auth.log",
                      name: "auth.log",
                      type: "file",
                      size: 8192,
                      modified: "2023-05-12 14:20:30",
                      permissions: "-rw-r-----",
                      owner: "root",
                      content:
                        "May 12 14:15:22 server sshd[1234]: Failed password for user from 192.168.1.100 port 54321 ssh2\nMay 12 14:15:30 server sshd[1234]: Accepted password for user from 192.168.1.100 port 54321 ssh2",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]

      setFileSystem(rootFileSystem)
      setCurrentPath([])
      setIsLoading(false)
    }, 1000)
  }

  // Get current directory based on path
  const getCurrentDirectory = (): FileSystemItem[] => {
    if (currentPath.length === 0) {
      return fileSystem
    }

    let current = [...fileSystem]
    for (const segment of currentPath) {
      const found = current.find((item) => item.name === segment)
      if (found && found.type === "directory" && found.children) {
        current = found.children
      } else {
        return []
      }
    }
    return current
  }

  // Navigate to a directory
  const navigateTo = (path: string[]) => {
    // Add current path to history
    if (historyIndex === history.length - 1) {
      setHistory([...history, currentPath])
    } else {
      setHistory([...history.slice(0, historyIndex + 1), currentPath])
    }
    setHistoryIndex(historyIndex + 1)

    setCurrentPath(path)
    setSelectedItem(null)
  }

  // Handle navigation back
  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCurrentPath(history[historyIndex - 1])
      setSelectedItem(null)
    }
  }

  // Handle navigation forward
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCurrentPath(history[historyIndex + 1])
      setSelectedItem(null)
    }
  }

  // Handle item click
  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === "directory") {
      navigateTo([...currentPath, item.name])
    } else {
      setSelectedItem(item)
    }
  }

  // Handle item double click
  const handleItemDoubleClick = (item: FileSystemItem) => {
    if (item.type === "file") {
      setSelectedItem(item)
      setShowProperties(true)
    }
  }

  // Toggle folder expansion in tree view
  const toggleFolderExpansion = (id: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedFolders(newExpanded)
  }

  // Format file size
  const formatFileSize = (bytes?: number): string => {
    if (bytes === undefined) return "-"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  // Create a new file or folder
  const createNewItem = (type: "file" | "directory") => {
    if (!newItemName) return

    const currentDir = getCurrentDirectory()
    const newItem: FileSystemItem = {
      id: `${type}-${Date.now()}`,
      name: newItemName,
      type: type,
      modified: new Date().toISOString().replace("T", " ").substring(0, 19),
      permissions: type === "directory" ? "drwxr-xr-x" : "-rw-r--r--",
      owner: "user",
      size: type === "file" ? 0 : undefined,
      content: type === "file" ? "" : undefined,
      children: type === "directory" ? [] : undefined,
    }

    // Add to current directory
    setFileSystem((prevFileSystem) => {
      const newFileSystem = [...prevFileSystem]
      let current = newFileSystem

      for (const segment of currentPath) {
        const found = current.find((item) => item.name === segment)
        if (found && found.type === "directory" && found.children) {
          current = found.children
        }
      }

      current.push(newItem)
      return newFileSystem
    })

    setNewItemName("")
    setIsCreatingFile(false)
    setIsCreatingFolder(false)
  }

  // Delete selected item
  const deleteSelectedItem = () => {
    if (!selectedItem) return

    setFileSystem((prevFileSystem) => {
      const newFileSystem = [...prevFileSystem]
      let current = newFileSystem

      for (const segment of currentPath) {
        const found = current.find((item) => item.name === segment)
        if (found && found.type === "directory" && found.children) {
          current = found.children
        }
      }

      const index = current.findIndex((item) => item.id === selectedItem.id)
      if (index !== -1) {
        current.splice(index, 1)
      }

      return newFileSystem
    })

    setSelectedItem(null)
    setShowProperties(false)
  }

  // Rename selected item
  const renameSelectedItem = () => {
    if (!selectedItem || !newItemName) return

    setFileSystem((prevFileSystem) => {
      const newFileSystem = [...prevFileSystem]
      let current = newFileSystem

      for (const segment of currentPath) {
        const found = current.find((item) => item.name === segment)
        if (found && found.type === "directory" && found.children) {
          current = found.children
        }
      }

      const item = current.find((item) => item.id === selectedItem.id)
      if (item) {
        item.name = newItemName
      }

      return newFileSystem
    })

    setSelectedItem(null)
    setNewItemName("")
    setIsRenaming(false)
  }

  // Render tree view
  const renderTreeView = (items: FileSystemItem[], depth = 0) => {
    return (
      <div style={{ marginLeft: `${depth * 16}px` }}>
        {items.map((item) => (
          <div key={item.id}>
            <div
              className={`flex items-center p-1 hover:bg-green-900/20 cursor-pointer ${selectedItem?.id === item.id ? "bg-green-900/30" : ""}`}
              onClick={() => setSelectedItem(item)}
              onDoubleClick={() => handleItemClick(item)}
            >
              {item.type === "directory" && (
                <button
                  className="mr-1 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFolderExpansion(item.id)
                  }}
                >
                  {expandedFolders.has(item.id) ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
              )}
              {item.type === "directory" ? (
                <Folder className="h-4 w-4 mr-1 text-yellow-400" />
              ) : (
                <File className="h-4 w-4 mr-1 text-blue-400" />
              )}
              <span className="text-xs">{item.name}</span>
            </div>
            {item.type === "directory" &&
              item.children &&
              expandedFolders.has(item.id) &&
              renderTreeView(item.children, depth + 1)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      {/* Toolbar */}
      <div className="flex items-center mb-3 space-x-2">
        <button className="p-1 hover:bg-green-900/30 rounded" onClick={goBack} disabled={historyIndex <= 0}>
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          className="p-1 hover:bg-green-900/30 rounded"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <button className="p-1 hover:bg-green-900/30 rounded" onClick={() => navigateTo([])}>
          <Home className="h-4 w-4" />
        </button>
        <button className="p-1 hover:bg-green-900/30 rounded" onClick={initializeFileSystem}>
          <RefreshCw className="h-4 w-4" />
        </button>

        {/* Path display */}
        <div className="flex-1 bg-gray-900 border border-green-500/30 p-1 text-xs flex items-center">
          <span>/</span>
          {currentPath.map((segment, index) => (
            <span key={index} className="flex items-center">
              <span
                className="mx-1 hover:underline cursor-pointer"
                onClick={() => navigateTo(currentPath.slice(0, index + 1))}
              >
                {segment}
              </span>
              {index < currentPath.length - 1 && "/"}
            </span>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-green-500/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="pl-7 pr-2 py-1 bg-gray-900 border border-green-500/30 text-xs w-40"
          />
        </div>
      </div>

      <div className="flex-1 flex border border-green-500/30 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/4 border-r border-green-500/30 overflow-auto p-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <RefreshCw className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            renderTreeView(fileSystem)
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Actions bar */}
          <div className="border-b border-green-500/30 p-2 flex items-center space-x-2">
            <button
              className="text-xs flex items-center bg-green-900/30 border border-green-500/50 px-2 py-1 hover:bg-green-900/50"
              onClick={() => {
                setIsCreatingFile(true)
                setIsCreatingFolder(false)
                setIsRenaming(false)
                setNewItemName("")
              }}
            >
              <FileText className="h-3 w-3 mr-1" />
              New File
            </button>
            <button
              className="text-xs flex items-center bg-green-900/30 border border-green-500/50 px-2 py-1 hover:bg-green-900/50"
              onClick={() => {
                setIsCreatingFolder(true)
                setIsCreatingFile(false)
                setIsRenaming(false)
                setNewItemName("")
              }}
            >
              <FolderPlus className="h-3 w-3 mr-1" />
              New Folder
            </button>
            {selectedItem && (
              <>
                <button
                  className="text-xs flex items-center bg-green-900/30 border border-green-500/50 px-2 py-1 hover:bg-green-900/50"
                  onClick={() => {
                    setIsRenaming(true)
                    setIsCreatingFile(false)
                    setIsCreatingFolder(false)
                    setNewItemName(selectedItem.name)
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Rename
                </button>
                <button
                  className="text-xs flex items-center bg-red-900/30 border border-red-500/50 px-2 py-1 hover:bg-red-900/50 text-red-400"
                  onClick={deleteSelectedItem}
                >
                  <Trash className="h-3 w-3 mr-1" />
                  Delete
                </button>
              </>
            )}
          </div>

          {/* Create/rename form */}
          {(isCreatingFile || isCreatingFolder || isRenaming) && (
            <div className="border-b border-green-500/30 p-2 flex items-center">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={isCreatingFile ? "New file name" : isCreatingFolder ? "New folder name" : "New name"}
                className="flex-1 bg-gray-900 border border-green-500/50 p-1 text-xs mr-2"
                autoFocus
              />
              <button
                className="text-xs bg-green-900/30 border border-green-500/50 px-2 py-1 hover:bg-green-900/50"
                onClick={() => {
                  if (isCreatingFile) createNewItem("file")
                  else if (isCreatingFolder) createNewItem("directory")
                  else if (isRenaming) renameSelectedItem()
                }}
              >
                {isRenaming ? "Rename" : "Create"}
              </button>
              <button
                className="text-xs bg-gray-900/30 border border-gray-500/50 px-2 py-1 hover:bg-gray-900/50 ml-1"
                onClick={() => {
                  setIsCreatingFile(false)
                  setIsCreatingFolder(false)
                  setIsRenaming(false)
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* File list */}
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="h-5 w-5 animate-spin" />
              </div>
            ) : viewMode === "list" ? (
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-900">
                    <th className="text-left p-2 border-b border-green-500/30">Name</th>
                    <th className="text-left p-2 border-b border-green-500/30">Size</th>
                    <th className="text-left p-2 border-b border-green-500/30">Modified</th>
                    <th className="text-left p-2 border-b border-green-500/30">Permissions</th>
                    <th className="text-left p-2 border-b border-green-500/30">Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPath.length > 0 && (
                    <tr
                      className="hover:bg-green-900/20 cursor-pointer"
                      onClick={() => navigateTo(currentPath.slice(0, -1))}
                    >
                      <td className="p-2 border-b border-green-500/20">
                        <div className="flex items-center">
                          <Folder className="h-4 w-4 mr-1 text-yellow-400" />
                          <span>..</span>
                        </div>
                      </td>
                      <td className="p-2 border-b border-green-500/20">-</td>
                      <td className="p-2 border-b border-green-500/20">-</td>
                      <td className="p-2 border-b border-green-500/20">-</td>
                      <td className="p-2 border-b border-green-500/20">-</td>
                    </tr>
                  )}
                  {getCurrentDirectory()
                    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .sort((a, b) => {
                      // Directories first, then files
                      if (a.type === "directory" && b.type === "file") return -1
                      if (a.type === "file" && b.type === "directory") return 1
                      return a.name.localeCompare(b.name)
                    })
                    .map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-green-900/20 cursor-pointer ${selectedItem?.id === item.id ? "bg-green-900/30" : ""}`}
                        onClick={() => setSelectedItem(item)}
                        onDoubleClick={() => handleItemDoubleClick(item)}
                      >
                        <td className="p-2 border-b border-green-500/20">
                          <div className="flex items-center">
                            {item.type === "directory" ? (
                              <Folder className="h-4 w-4 mr-1 text-yellow-400" />
                            ) : (
                              <File className="h-4 w-4 mr-1 text-blue-400" />
                            )}
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td className="p-2 border-b border-green-500/20">{formatFileSize(item.size)}</td>
                        <td className="p-2 border-b border-green-500/20">{item.modified}</td>
                        <td className="p-2 border-b border-green-500/20">{item.permissions}</td>
                        <td className="p-2 border-b border-green-500/20">{item.owner}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <div className="p-2 grid grid-cols-4 gap-2">
                {currentPath.length > 0 && (
                  <div
                    className="p-2 flex flex-col items-center hover:bg-green-900/20 cursor-pointer"
                    onClick={() => navigateTo(currentPath.slice(0, -1))}
                  >
                    <Folder className="h-8 w-8 text-yellow-400" />
                    <span className="text-xs mt-1">..</span>
                  </div>
                )}
                {getCurrentDirectory()
                  .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .sort((a, b) => {
                    // Directories first, then files
                    if (a.type === "directory" && b.type === "file") return -1
                    if (a.type === "file" && b.type === "directory") return 1
                    return a.name.localeCompare(b.name)
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`p-2 flex flex-col items-center hover:bg-green-900/20 cursor-pointer ${selectedItem?.id === item.id ? "bg-green-900/30" : ""}`}
                      onClick={() => setSelectedItem(item)}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                    >
                      {item.type === "directory" ? (
                        <Folder className="h-8 w-8 text-yellow-400" />
                      ) : (
                        <File className="h-8 w-8 text-blue-400" />
                      )}
                      <span className="text-xs mt-1 text-center truncate w-full">{item.name}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Properties panel */}
        {showProperties && selectedItem && (
          <div className="w-1/4 border-l border-green-500/30 overflow-auto">
            <div className="p-2 border-b border-green-500/30 bg-gray-900 flex justify-between items-center">
              <span className="text-sm font-bold">Properties</span>
              <button className="text-xs" onClick={() => setShowProperties(false)}>
                ×
              </button>
            </div>
            <div className="p-2">
              <div className="mb-2">
                <div className="text-xs text-green-500/70">Name:</div>
                <div className="text-sm">{selectedItem.name}</div>
              </div>
              <div className="mb-2">
                <div className="text-xs text-green-500/70">Type:</div>
                <div className="text-sm">{selectedItem.type === "directory" ? "Directory" : "File"}</div>
              </div>
              {selectedItem.type === "file" && (
                <div className="mb-2">
                  <div className="text-xs text-green-500/70">Size:</div>
                  <div className="text-sm">{formatFileSize(selectedItem.size)}</div>
                </div>
              )}
              <div className="mb-2">
                <div className="text-xs text-green-500/70">Modified:</div>
                <div className="text-sm">{selectedItem.modified}</div>
              </div>
              <div className="mb-2">
                <div className="text-xs text-green-500/70">Permissions:</div>
                <div className="text-sm font-mono">{selectedItem.permissions}</div>
              </div>
              <div className="mb-2">
                <div className="text-xs text-green-500/70">Owner:</div>
                <div className="text-sm">{selectedItem.owner}</div>
              </div>

              {selectedItem.type === "file" && selectedItem.content && (
                <div className="mt-4">
                  <div className="text-xs text-green-500/70 mb-1">Content Preview:</div>
                  <div className="bg-gray-900 p-2 text-xs font-mono whitespace-pre-wrap max-h-40 overflow-auto border border-green-500/30">
                    {selectedItem.content}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
