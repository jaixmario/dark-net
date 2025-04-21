"use client"

import { useState } from "react"
import { Mail, Copy, Check, RefreshCw, FileText, Send } from "lucide-react"

type TemplateType = "phishing" | "spear-phishing" | "pretexting" | "baiting" | "quid-pro-quo"

type Template = {
  id: string
  type: TemplateType
  name: string
  subject: string
  content: string
  targetType: string
}

export function SocialEngineer() {
  const [activeTab, setActiveTab] = useState<"templates" | "generator" | "campaigns">("templates")
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "template-1",
      type: "phishing",
      name: "Password Reset",
      subject: "Urgent: Your Account Password Needs to be Reset",
      content:
        "Dear [NAME],\n\nOur security system has detected unusual activity on your account. To protect your information, you need to reset your password immediately.\n\nPlease click the link below to verify your identity and set a new password:\n\n[LINK]\n\nIf you don't take action within 24 hours, your account may be suspended.\n\nThank you,\n[COMPANY] Security Team",
      targetType: "General",
    },
    {
      id: "template-2",
      type: "spear-phishing",
      name: "Invoice Payment",
      subject: "Invoice #12345 Payment Required",
      content:
        "Dear [NAME],\n\nI hope this email finds you well. I'm writing to inform you that invoice #12345 for [COMPANY] is now due for payment.\n\nPlease review the attached invoice and process the payment at your earliest convenience.\n\nIf you have any questions, please don't hesitate to contact our accounting department.\n\nBest regards,\n[SENDER_NAME]\nAccounting Department\n[COMPANY]",
      targetType: "Finance Department",
    },
    {
      id: "template-3",
      type: "pretexting",
      name: "IT Support",
      subject: "Required System Update",
      content:
        "Dear [NAME],\n\nI'm [SENDER_NAME] from the IT department. We're performing critical security updates on all employee accounts today.\n\nTo complete this process, we need you to verify your login credentials. Please click the link below and enter your username and password:\n\n[LINK]\n\nThis is urgent as systems not updated may lose access to company resources.\n\nThank you for your cooperation,\n[SENDER_NAME]\nIT Support Team",
      targetType: "Employees",
    },
    {
      id: "template-4",
      type: "baiting",
      name: "Free Gift Card",
      subject: "Congratulations! You've Won a $100 Gift Card",
      content:
        "Congratulations [NAME]!\n\nYou've been selected to receive a $100 gift card to [STORE]!\n\nTo claim your gift card, simply click the link below and fill out a short survey:\n\n[LINK]\n\nHurry, this offer expires soon!\n\nBest regards,\n[COMPANY] Rewards Team",
      targetType: "General",
    },
    {
      id: "template-5",
      type: "quid-pro-quo",
      name: "Software License",
      subject: "Your Free Software License",
      content:
        "Hello [NAME],\n\nAs part of our customer appreciation program, we're offering you a free license for [SOFTWARE].\n\nTo activate your license, please download the attached file and follow the installation instructions.\n\nEnjoy your free software!\n\nBest regards,\n[COMPANY] Customer Support",
      targetType: "Technical Users",
    },
  ])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [generatedEmail, setGeneratedEmail] = useState<string>("")
  const [targetName, setTargetName] = useState("")
  const [targetEmail, setTargetEmail] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [senderName, setSenderName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [campaigns, setCampaigns] = useState<
    { id: string; name: string; status: string; sent: number; opened: number; clicked: number }[]
  >([
    { id: "camp-1", name: "Q1 Finance Department", status: "Completed", sent: 25, opened: 18, clicked: 12 },
    { id: "camp-2", name: "IT Department Test", status: "In Progress", sent: 15, opened: 10, clicked: 5 },
    { id: "camp-3", name: "Executive Team", status: "Scheduled", sent: 0, opened: 0, clicked: 0 },
  ])

  const generateEmail = () => {
    if (!selectedTemplate) return

    setIsGenerating(true)

    // Simulate generation delay
    setTimeout(() => {
      let content = selectedTemplate.content

      // Replace placeholders
      content = content.replace(/\[NAME\]/g, targetName || "[TARGET NAME]")
      content = content.replace(/\[COMPANY\]/g, companyName || "[COMPANY NAME]")
      content = content.replace(/\[SENDER_NAME\]/g, senderName || "[SENDER NAME]")
      content = content.replace(/\[LINK\]/g, "https://malicious-site.example.com/login")

      setGeneratedEmail(content)
      setIsGenerating(false)
    }, 1000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getTemplateTypeColor = (type: TemplateType) => {
    switch (type) {
      case "phishing":
        return "text-blue-400"
      case "spear-phishing":
        return "text-red-400"
      case "pretexting":
        return "text-yellow-400"
      case "baiting":
        return "text-purple-400"
      case "quid-pro-quo":
        return "text-green-400"
      default:
        return ""
    }
  }

  return (
    <div className="h-full flex flex-col bg-black p-3 text-green-500">
      <div className="mb-3">
        <div className="flex space-x-1">
          <button
            className={`px-3 py-1 text-xs uppercase ${activeTab === "templates" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
            onClick={() => setActiveTab("templates")}
          >
            Templates
          </button>
          <button
            className={`px-3 py-1 text-xs uppercase ${activeTab === "generator" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
            onClick={() => setActiveTab("generator")}
          >
            Generator
          </button>
          <button
            className={`px-3 py-1 text-xs uppercase ${activeTab === "campaigns" ? "bg-green-900/50 border border-green-500/50" : "border border-transparent hover:border-green-500/30"}`}
            onClick={() => setActiveTab("campaigns")}
          >
            Campaigns
          </button>
        </div>
      </div>

      <div className="flex-1 border border-green-500/30 overflow-hidden">
        {activeTab === "templates" && (
          <div className="h-full flex flex-col md:flex-row">
            {/* Template List */}
            <div className="w-full md:w-1/2 border-r border-green-500/30 overflow-auto">
              <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-xs font-bold grid grid-cols-3">
                <div>Name</div>
                <div>Type</div>
                <div>Target</div>
              </div>

              <div className="divide-y divide-green-500/20">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-2 text-xs cursor-pointer hover:bg-green-900/20 ${selectedTemplate?.id === template.id ? "bg-green-900/30" : ""}`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="grid grid-cols-3">
                      <div className="truncate">{template.name}</div>
                      <div className={getTemplateTypeColor(template.type)}>{template.type}</div>
                      <div>{template.targetType}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Template Details */}
            <div className="w-full md:w-1/2 overflow-auto">
              {selectedTemplate ? (
                <div className="p-3">
                  <div className="text-lg mb-3">{selectedTemplate.name}</div>

                  <div className="mb-3">
                    <div className="text-xs text-green-500/70">Type:</div>
                    <div className={`text-sm ${getTemplateTypeColor(selectedTemplate.type)}`}>
                      {selectedTemplate.type}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs text-green-500/70">Subject:</div>
                    <div className="text-sm font-bold">{selectedTemplate.subject}</div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs text-green-500/70">Content:</div>
                    <div className="mt-1 p-3 bg-gray-900/50 border border-green-500/30 whitespace-pre-wrap text-sm">
                      {selectedTemplate.content}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs text-green-500/70">Target Type:</div>
                    <div className="text-sm">{selectedTemplate.targetType}</div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      className="bg-green-900/50 border border-green-500 px-3 py-1 text-sm hover:bg-green-900/70"
                      onClick={() => setActiveTab("generator")}
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center p-4">
                  <div className="flex flex-col items-center">
                    <FileText className="h-8 w-8 mb-3" />
                    <span>Select a template to view details</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "generator" && (
          <div className="h-full flex flex-col md:flex-row">
            {/* Generator Form */}
            <div className="w-full md:w-1/2 border-r border-green-500/30 overflow-auto">
              <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-sm font-bold">
                Email Generator
              </div>

              <div className="p-3 space-y-3">
                <div>
                  <label className="block text-xs mb-1">Template:</label>
                  <select
                    value={selectedTemplate?.id || ""}
                    onChange={(e) => {
                      const template = templates.find((t) => t.id === e.target.value)
                      setSelectedTemplate(template || null)
                    }}
                    className="w-full bg-gray-900 border border-green-500/50 p-2 text-sm"
                  >
                    <option value="">Select a template</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} ({template.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs mb-1">Target Name:</label>
                  <input
                    type="text"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-gray-900 border border-green-500/50 p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1">Target Email:</label>
                  <input
                    type="email"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    className="w-full bg-gray-900 border border-green-500/50 p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1">Company Name:</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Inc."
                    className="w-full bg-gray-900 border border-green-500/50 p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1">Sender Name:</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full bg-gray-900 border border-green-500/50 p-2 text-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={generateEmail}
                    disabled={!selectedTemplate || isGenerating}
                    className="bg-green-900/50 border border-green-500 px-4 py-2 text-sm hover:bg-green-900/70 disabled:opacity-50 w-full flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Generate Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Email */}
            <div className="w-full md:w-1/2 overflow-auto">
              <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-sm font-bold flex items-center justify-between">
                <span>Generated Email</span>
                {generatedEmail && (
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

              <div className="p-3">
                {generatedEmail ? (
                  <div className="border border-green-500/30">
                    <div className="bg-gray-900/50 p-3 border-b border-green-500/30">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-green-500/70">From:</span> <span>{senderName || "[SENDER NAME]"}</span>
                        </div>
                        <div>
                          <span className="text-green-500/70">To:</span>{" "}
                          <span>
                            {targetName || "[TARGET NAME]"} &lt;{targetEmail || "target@example.com"}&gt;
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-green-500/70">Subject:</span>{" "}
                          <span className="font-bold">{selectedTemplate?.subject}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 whitespace-pre-wrap text-sm">{generatedEmail}</div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-center">
                    <div className="flex flex-col items-center">
                      <Mail className="h-8 w-8 mb-3" />
                      <span>Select a template and generate an email</span>
                    </div>
                  </div>
                )}

                {generatedEmail && (
                  <div className="mt-4 flex justify-end">
                    <button className="bg-red-900/50 border border-red-500 px-3 py-1 text-sm hover:bg-red-900/70 text-red-400 flex items-center">
                      <Send className="h-4 w-4 mr-1" />
                      Send Email
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div className="h-full overflow-auto">
            <div className="sticky top-0 bg-gray-900 p-2 border-b border-green-500/30 text-sm font-bold flex items-center justify-between">
              <span>Phishing Campaigns</span>
              <button className="text-xs bg-green-900/50 border border-green-500/50 px-2 py-1 hover:bg-green-900/70">
                New Campaign
              </button>
            </div>

            <div className="p-3">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th className="p-2 text-left border border-green-500/30">Campaign Name</th>
                    <th className="p-2 text-left border border-green-500/30">Status</th>
                    <th className="p-2 text-left border border-green-500/30">Sent</th>
                    <th className="p-2 text-left border border-green-500/30">Opened</th>
                    <th className="p-2 text-left border border-green-500/30">Clicked</th>
                    <th className="p-2 text-left border border-green-500/30">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-green-900/20">
                      <td className="p-2 border border-green-500/30">{campaign.name}</td>
                      <td className="p-2 border border-green-500/30">
                        <span
                          className={
                            campaign.status === "Completed"
                              ? "text-green-400"
                              : campaign.status === "In Progress"
                                ? "text-yellow-400"
                                : "text-blue-400"
                          }
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="p-2 border border-green-500/30">{campaign.sent}</td>
                      <td className="p-2 border border-green-500/30">{campaign.opened}</td>
                      <td className="p-2 border border-green-500/30">{campaign.clicked}</td>
                      <td className="p-2 border border-green-500/30">
                        {campaign.sent > 0 ? `${Math.round((campaign.clicked / campaign.sent) * 100)}%` : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {campaigns.length === 0 && <div className="text-center p-4 text-green-500/70">No campaigns found</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
