'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  FileSignature, 
  LogOut, 
  Printer, 
  Plus, 
  Trash2, 
  Lock, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  LayoutDashboard,
  ShieldAlert,
  TrendingUp,
  Award,
  Clock,
  Briefcase,
  Link2,
  ListTodo,
  Cpu,
  Layers,
  Building,
  UserPlus
} from 'lucide-react'

// Simple client-side auth credentials
const CREDENTIALS = {
  admin: { pass: 'prigenix-admin-2026', role: 'Admin' },
  marketing: { pass: 'prigenix-marketing-2026', role: 'Marketing' }
}

interface DocRecord {
  id: string
  type: 'Quotation' | 'NDA' | 'Service Agreement' | 'Kickoff Requirement' | 'Techstack'
  clientName: string
  subject: string
  status: 'Draft' | 'Sent' | 'Approved' | 'Declined'
  total?: number
  date: string
  createdBy: 'Admin' | 'Marketing'
  clientLogo?: string | null
  content?: string | null
}

interface ClientRecord {
  id: number
  companyName: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  taxId?: string
  status: 'Onboarding' | 'Active' | 'Suspended'
  createdAt: string
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userRole, setUserRole] = useState<'Admin' | 'Marketing'>('Marketing')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<'monitor' | 'quotation' | 'nda' | 'service' | 'kickoff' | 'techstack' | 'onboard'>('monitor')

  // Core records states
  const [documents, setDocuments] = useState<DocRecord[]>([])
  const [clients, setClients] = useState<ClientRecord[]>([])

  // Fetch documents and clients from Neon PostgreSQL
  useEffect(() => {
    if (isLoggedIn) {
      // Load Documents
      fetch('/api/documents')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setDocuments(data)
        })
        .catch(err => console.error('Failed to load documents:', err))

      // Load Onboarded Clients
      fetch('/api/clients')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setClients(data)
        })
        .catch(err => console.error('Failed to load clients:', err))
    }
  }, [isLoggedIn])

  // Load auth state from localStorage
  useEffect(() => {
    const session = localStorage.getItem('prigenix_admin_auth')
    const role = localStorage.getItem('prigenix_admin_role')
    if (session === 'true' && role) {
      setIsLoggedIn(true)
      setUserRole(role as 'Admin' | 'Marketing')
    }
  }, [])

  // Handle Login Action
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedUser = username.trim().toLowerCase()
    
    if (trimmedUser === 'admin' && password === CREDENTIALS.admin.pass) {
      localStorage.setItem('prigenix_admin_auth', 'true')
      localStorage.setItem('prigenix_admin_role', 'Admin')
      setUserRole('Admin')
      setIsLoggedIn(true)
      setLoginError('')
    } else if (trimmedUser === 'marketing' && password === CREDENTIALS.marketing.pass) {
      localStorage.setItem('prigenix_admin_auth', 'true')
      localStorage.setItem('prigenix_admin_role', 'Marketing')
      setUserRole('Marketing')
      setIsLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid username or password credentials')
    }
  }

  // Handle Logout Action
  const handleLogout = () => {
    localStorage.removeItem('prigenix_admin_auth')
    localStorage.removeItem('prigenix_admin_role')
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
  }

  // Onboarding Client Form States
  const [onboardCompany, setOnboardCompany] = useState('')
  const [onboardContact, setOnboardContact] = useState('')
  const [onboardEmail, setOnboardEmail] = useState('')
  const [onboardPhone, setOnboardPhone] = useState('')
  const [onboardTaxId, setOnboardTaxId] = useState('')
  const [onboardStatus, setOnboardStatus] = useState<'Onboarding' | 'Active' | 'Suspended'>('Onboarding')

  // Document Metadata Form States
  const [clientName, setClientName] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0])
  const [docId, setDocId] = useState('PRX-2026-0044')
  const [clientLogoUrl, setClientLogoUrl] = useState<string | null>(null)

  // 1. Quotation Specific States
  const [projectName, setProjectName] = useState('Autonomous Robotic Line Integrator')
  const [projectDescription, setProjectDescription] = useState('Custom development of edge-computing logic to monitor factory line conveyor speeds and automatically coordinate motor controllers via TCP/IP protocols.')
  const [quoteItems, setQuoteItems] = useState([
    { id: 1, title: 'Edge Integration Conveyor Scripts', qty: 1, rate: 1500000 },
    { id: 2, title: 'Central SCADA Sync Pipeline', qty: 1, rate: 2000000 },
    { id: 3, title: 'Fail-Safe Motor Trigger Logic', qty: 1, rate: 1000000 },
  ])

  // 2. NDA Specific States
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0])
  const [governingLaw, setGoverningLaw] = useState('State of California')
  const [disclosingParty, setDisclosingParty] = useState('Prigenix Studio')
  const [receivingParty, setReceivingParty] = useState('')
  const [ndaPurpose, setNdaPurpose] = useState('Evaluating a potential collaboration and edge-sensor telemetry integration.')

  // 3. Service Agreement Specific States
  const [serviceTotal, setServiceTotal] = useState(5000000)
  const [milestones, setMilestones] = useState([
    { title: 'Project Kickoff & Environment Setup', percentage: 30 },
    { title: 'Alpha Release & Sensor Integration', percentage: 40 },
    { title: 'Final Handover & Client Training', percentage: 30 },
  ])

  // 4. Kickoff Requirement Specific States
  const [kickoffObjective, setKickoffObjective] = useState('Sync industrial sensors with the central dashboard and deploy edge server clusters.')
  const [checklist, setChecklist] = useState([
    { title: 'Configure TCP/IP edge sensor scripts', status: 'Pending' },
    { title: 'Synchronize central Neon DB pools', status: 'Pending' },
    { title: 'Run high-load telemetry diagnostics', status: 'Pending' },
  ])
  const [sprintKickoff, setSprintKickoff] = useState('Week 1')
  const [sprintDesign, setSprintDesign] = useState('Week 2')
  const [sprintDev, setSprintDev] = useState('Week 3-6')
  const [sprintTest, setSprintTest] = useState('Week 7')
  const [sprintLaunch, setSprintLaunch] = useState('Week 8')

  // 5. Techstack Specific States
  const [stackClient, setStackClient] = useState('Next.js 16 / React 19 / TypeScript')
  const [stackServer, setStackServer] = useState('Next.js API Serverless Routes')
  const [stackDb, setStackDb] = useState('Neon AWS Serverless PostgreSQL')
  const [stackHost, setStackHost] = useState('Vercel Edge Platform CDN')
  const [stackAi, setStackAi] = useState('Google Gemini 2.0 Pro')
  const [stackAuth, setStackAuth] = useState('Credentials Browser LocalStorage')

  // Client Selection Change triggers auto-population
  const handleClientSelectionChange = (selectedCompanyName: string) => {
    setClientName(selectedCompanyName)
    const selected = clients.find(c => c.companyName === selectedCompanyName)
    if (selected) {
      setClientAddress(selected.taxId ? `${selected.companyName}, GSTIN/Tax ID: ${selected.taxId}` : selected.companyName)
      setReceivingParty(selected.companyName)
    }
  }

  // Onboard Client Save
  const saveClientProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onboardCompany || !onboardContact || !onboardEmail) {
      alert('Please fill out all required client onboarding fields')
      return
    }

    const payload = {
      companyName: onboardCompany,
      contactName: onboardContact,
      contactEmail: onboardEmail,
      contactPhone: onboardPhone,
      taxId: onboardTaxId,
      status: onboardStatus
    }

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const saved = await res.json()
        setClients(prev => {
          const exists = prev.some(c => c.id === saved.id)
          if (exists) {
            return prev.map(c => c.id === saved.id ? saved : c)
          }
          return [saved, ...prev]
        })
        // Clear fields
        setOnboardCompany('')
        setOnboardContact('')
        setOnboardEmail('')
        setOnboardPhone('')
        setOnboardTaxId('')
        setOnboardStatus('Onboarding')
        alert('Client profile saved and synchronized successfully!')
      }
    } catch (err) {
      console.error('Error saving client profile:', err)
    }
  }

  // Delete Client Profile (Admin Only Action)
  const deleteClientProfile = async (id: number) => {
    if (userRole !== 'Admin') {
      alert('Permission Denied: Administrator clearance is required to delete client records.')
      return
    }

    try {
      const res = await fetch(`/api/clients?id=${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setClients(clients.filter(c => c.id !== id))
      }
    } catch (err) {
      console.error('Error deleting client:', err)
    }
  }

  // Client Logo Upload conversion to Base64
  const handleClientLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setClientLogoUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearClientLogo = () => {
    setClientLogoUrl(null)
  }

  // Add Item to Quotation
  const addQuoteItem = () => {
    const newId = quoteItems.length > 0 ? Math.max(...quoteItems.map(i => i.id)) + 1 : 1
    setQuoteItems([...quoteItems, { id: newId, title: 'New Scope Module', qty: 1, rate: 150000 }])
  }

  // Remove Item from Quotation
  const removeQuoteItem = (id: number) => {
    setQuoteItems(quoteItems.filter(item => item.id !== id))
  }

  // Update Quotation Item Values
  const updateQuoteItem = (id: number, field: 'title' | 'qty' | 'rate', value: any) => {
    setQuoteItems(quoteItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [field]: field === 'title' ? value : Number(value)
        }
      }
      return item
    }))
  }

  // Dynamic Service Milestones
  const updateMilestone = (index: number, field: 'title' | 'percentage', value: any) => {
    const nextMilestones = [...milestones]
    nextMilestones[index] = {
      ...nextMilestones[index],
      [field]: field === 'percentage' ? Number(value) : value
    }
    setMilestones(nextMilestones)
  }

  const addMilestone = () => {
    setMilestones([...milestones, { title: 'New Payment Milestone', percentage: 10 }])
  }

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  // Dynamic Kickoff Checklist
  const updateChecklistItem = (index: number, field: 'title' | 'status', value: any) => {
    const nextChecklist = [...checklist]
    nextChecklist[index] = {
      ...nextChecklist[index],
      [field]: value
    }
    setChecklist(nextChecklist)
  }

  const addChecklistItem = () => {
    setChecklist([...checklist, { title: 'New Requirement item', status: 'Pending' }])
  }

  const removeChecklistItem = (index: number) => {
    setChecklist(checklist.filter((_, i) => i !== index))
  }

  // Calculate Quotation Totals
  const subtotal = quoteItems.reduce((sum, item) => sum + (item.qty * item.rate), 0)
  const total = subtotal 

  // Save Document to Neon PostgreSQL Tracker
  const saveDocumentToTracker = async () => {
    if (!clientName) {
      alert('Please select or configure an onboarded client profile first!')
      return
    }

    let contentPayload: any = {}
    let subject = ''
    let documentTotal: number | undefined = undefined
    let typeName: 'Quotation' | 'NDA' | 'Service Agreement' | 'Kickoff Requirement' | 'Techstack' = 'Quotation'

    if (activeTab === 'quotation') {
      typeName = 'Quotation'
      subject = projectName
      documentTotal = total
      contentPayload = { quoteItems, projectDescription, clientAddress }
    } else if (activeTab === 'nda') {
      typeName = 'NDA'
      subject = ndaPurpose
      contentPayload = { effectiveDate, governingLaw, disclosingParty, receivingParty }
    } else if (activeTab === 'service') {
      typeName = 'Service Agreement'
      subject = projectName
      documentTotal = serviceTotal
      contentPayload = { milestones, clientAddress, governingLaw }
    } else if (activeTab === 'kickoff') {
      typeName = 'Kickoff Requirement'
      subject = kickoffObjective
      contentPayload = { checklist, sprintKickoff, sprintDesign, sprintDev, sprintTest, sprintLaunch }
    } else if (activeTab === 'techstack') {
      typeName = 'Techstack'
      subject = projectName
      contentPayload = { stackClient, stackServer, stackDb, stackHost, stackAi, stackAuth }
    }

    const docData = {
      id: docId,
      type: typeName,
      clientName,
      subject,
      status: 'Draft',
      total: documentTotal,
      date: docDate,
      createdBy: userRole,
      clientLogo: clientLogoUrl,
      content: JSON.stringify(contentPayload)
    }

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData)
      })
      if (res.ok) {
        const savedDoc = await res.json()
        setDocuments(prev => {
          const exists = prev.some(d => d.id === savedDoc.id)
          if (exists) {
            return prev.map(d => d.id === savedDoc.id ? savedDoc : d)
          }
          return [savedDoc, ...prev]
        })
      }
    } catch (err) {
      console.error('Error saving document to database:', err)
    }
    setActiveTab('monitor')
  }

  // Update Document Status from Monitor Table
  const updateDocStatus = async (id: string, newStatus: 'Draft' | 'Sent' | 'Approved' | 'Declined') => {
    const doc = documents.find(d => d.id === id)
    if (!doc) return

    const updatedData = {
      ...doc,
      status: newStatus
    }

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })
      if (res.ok) {
        setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d))
      }
    } catch (err) {
      console.error('Error updating document status:', err)
    }
  }

  // Delete Document (Admin Only Action)
  const deleteDocument = async (id: string) => {
    if (userRole !== 'Admin') {
      alert('Permission Denied: Administrator clearance is required to delete records.')
      return
    }

    try {
      const res = await fetch(`/api/documents?id=${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setDocuments(documents.filter(doc => doc.id !== id))
      }
    } catch (err) {
      console.error('Error deleting document:', err)
    }
  }

  // Copy Public Share Link to Clipboard
  const copyShareLink = (id: string) => {
    const origin = window.location.origin
    const shareUrl = `${origin}/document?id=${id}`
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert(`Secure public link copied to clipboard:\n${shareUrl}`))
      .catch(err => console.error('Failed to copy link:', err))
  }

  // Print Document Trigger
  const triggerPrint = () => {
    window.print()
  }

  // Metrics computations
  const totalPipeline = documents
    .filter(d => (d.type === 'Quotation' || d.type === 'Service Agreement') && (d.status === 'Approved' || d.status === 'Sent'))
    .reduce((sum, d) => sum + (d.total || 0), 0)

  const approvedQuotesCount = documents.filter(d => d.type === 'Quotation' && d.status === 'Approved').length
  const totalQuotesCount = documents.filter(d => d.type === 'Quotation').length
  const winRate = totalQuotesCount > 0 ? Math.round((approvedQuotesCount / totalQuotesCount) * 100) : 0

  const activeNDAs = documents.filter(d => d.type === 'NDA' && (d.status === 'Sent' || d.status === 'Approved')).length
  const totalDocsCount = documents.length

  // Status counts for Ring Chart
  const statusCounts = {
    Approved: documents.filter(d => d.status === 'Approved').length,
    Sent: documents.filter(d => d.status === 'Sent').length,
    Draft: documents.filter(d => d.status === 'Draft').length,
    Declined: documents.filter(d => d.status === 'Declined').length,
  }

  // Bar Chart calculations
  const barChartData = documents
    .filter(d => d.total)
    .map(d => ({
      name: d.clientName.split(' ')[0],
      amount: d.total || 0,
      status: d.status
    }))
    .slice(0, 4)

  const maxAmount = barChartData.length > 0 ? Math.max(...barChartData.map(b => b.amount)) : 1

  // If not logged in, render the credential form
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen w-full bg-[#0A0A0A] font-sans flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(13,91,58,0.1),transparent_65%)] pointer-events-none" />
        
        <form onSubmit={handleLogin} className="relative z-10 w-full max-w-md bg-[#060A08]/85 border border-white/5 shadow-2xl rounded-3xl p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#0D5B3A]/30 bg-[#0A0A0A] shadow-md">
              <img src="/logo.png" alt="Prigenix Logo" className="h-8 w-8 object-contain" />
            </div>
            <h2 className="font-heading text-lg font-extrabold uppercase tracking-widest text-white mt-4">
              Prigenix Secure Login
            </h2>
            <p className="font-mono text-[9px] uppercase tracking-wider text-text-muted">
              Quotation & Agreement Workspace
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Username</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 text-text-muted" size={14} />
                <input
                  type="text"
                  required
                  placeholder="admin or marketing"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Secret Passcode</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 text-text-muted" size={14} />
                <input
                  type="password"
                  required
                  placeholder="Enter role password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {loginError && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-sans">
              <AlertCircle size={14} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan font-heading text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-accent-purple/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
          >
            Authenticate Credentials
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="h-screen w-screen bg-[#0A0A0A] font-sans text-white antialiased flex flex-row overflow-hidden print:bg-white print:text-black print:h-auto print:overflow-visible">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4;
            margin: 15mm 15mm 15mm 15mm;
          }
          body, main {
            background: white !important;
            color: black !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
          }
          tr, li, p, h1, h2, h3, h4, h5, h6 {
            page-break-inside: avoid !important;
          }
        }
      `}} />
      
      {/* 2. Left Menu Bar (no-print) */}
      <section className="print:hidden h-screen w-80 shrink-0 bg-[#060A08] border-r border-white/5 flex flex-col justify-between py-6 px-6 overflow-hidden">
        <div>
          {/* Logo header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0D5B3A]/30 bg-[#0A0A0A] shadow-md">
              <img src="/logo.png" alt="Prigenix Logo" className="h-6 w-6 object-contain" />
            </div>
            <div>
              <span className="font-heading text-sm font-extrabold uppercase tracking-widest block leading-none">
                Prigenix
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-accent-cyan">
                Workspace Admin
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('monitor')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'monitor' ? 'bg-[#0D5B3A] text-white border border-[#0D5B3A]/30' : 'text-text-muted hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={14} />
              Status Monitor
            </button>
            <button
              onClick={() => setActiveTab('onboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'onboard' ? 'bg-[#0D5B3A] text-white border border-[#0D5B3A]/30' : 'text-text-muted hover:bg-white/5'
              }`}
            >
              <UserPlus size={14} />
              Client Onboard
            </button>
            <div className="pt-4 pb-2 px-4 font-mono text-[9px] uppercase text-text-muted tracking-widest border-t border-white/5 mt-4">
              Builders
            </div>
            <button
              onClick={() => setActiveTab('quotation')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'quotation' ? 'bg-[#0D5B3A] text-white border border-[#0D5B3A]/30' : 'text-text-muted hover:bg-white/5'
              }`}
            >
              <FileText size={14} />
              Quotation
            </button>
            <button
              onClick={() => setActiveTab('nda')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'nda' ? 'bg-[#0D5B3A] text-white border border-[#0D5B3A]/30' : 'text-text-muted hover:bg-white/5'
              }`}
            >
              <FileSignature size={14} />
              NDA Agreement
            </button>
            <button
              onClick={() => setActiveTab('service')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'service' ? 'bg-[#0D5B3A] text-white border border-[#0D5B3A]/30' : 'text-text-muted hover:bg-white/5'
              }`}
            >
              <Layers size={14} />
              Service SLA
            </button>
            <button
              onClick={() => setActiveTab('kickoff')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'kickoff' ? 'bg-[#0D5B3A] text-white border border-[#0D5B3A]/30' : 'text-text-muted hover:bg-white/5'
              }`}
            >
              <ListTodo size={14} />
              Kickoff Requirements
            </button>
            <button
              onClick={() => setActiveTab('techstack')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'techstack' ? 'bg-[#0D5B3A] text-white border border-[#0D5B3A]/30' : 'text-text-muted hover:bg-white/5'
              }`}
            >
              <Cpu size={14} />
              Techstack Specs
            </button>
          </div>
        </div>

        {/* User settings & status */}
        <div className="border-t border-white/5 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-cyan font-mono text-xs font-bold">
                {userRole === 'Admin' ? 'AD' : 'MK'}
              </div>
              <div>
                <span className="font-sans text-xs font-bold block text-white">{userRole} Panel</span>
                <span className="font-mono text-[9px] text-text-muted">Neon PostgreSQL Sync</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 text-text-muted hover:text-red-400 font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </section>

      {/* 3. Middle Area: Fit Screen Layout with Scrollable Inner Panels */}
      <section className="print:hidden flex-1 h-screen overflow-hidden flex flex-col px-8 py-8">
        
        {/* VIEW: STATUS MONITOR TRACKER */}
        {activeTab === 'monitor' && (
          <div className="h-full flex flex-col space-y-6 overflow-hidden">
            <div>
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-white uppercase leading-none mb-1">
                Document Database Dashboard
              </h2>
              <p className="font-mono text-[10px] text-accent-cyan font-bold">
                Real-Time AWS Neon PostgreSQL Persistence
              </p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
              <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-4 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-[#0D5B3A]">
                  <TrendingUp size={20} />
                </div>
                <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">Pipeline Value</span>
                <h3 className="font-heading text-base font-extrabold mt-1 text-white">
                  ₹{totalPipeline.toLocaleString()}
                </h3>
                <span className="font-mono text-[8px] text-[#C8A870] block mt-0.5">Approved & Sent Milestones</span>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-4 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-accent-purple">
                  <Award size={20} />
                </div>
                <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">Win Rate</span>
                <h3 className="font-heading text-base font-extrabold mt-1 text-white">
                  {winRate}%
                </h3>
                <span className="font-mono text-[8px] text-accent-cyan block mt-0.5">{approvedQuotesCount} of {totalQuotesCount} approved</span>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-4 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-accent-cyan">
                  <Clock size={20} />
                </div>
                <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">Active NDAs</span>
                <h3 className="font-heading text-base font-extrabold mt-1 text-white">
                  {activeNDAs}
                </h3>
                <span className="font-mono text-[8px] text-text-muted block mt-0.5">Sent or Signed Agreements</span>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-4 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 text-text-muted">
                  <Briefcase size={20} />
                </div>
                <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">Database Total</span>
                <h3 className="font-heading text-base font-extrabold mt-1 text-white">
                  {totalDocsCount}
                </h3>
                <span className="font-mono text-[8px] text-text-muted block mt-0.5 font-semibold">Stored Documents</span>
              </div>
            </div>

            {/* Graphs & charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0 h-44">
              <div className="rounded-2xl border border-white/5 bg-[#060A08]/65 p-4 flex flex-col justify-between">
                <h3 className="font-heading text-[9px] font-bold uppercase tracking-widest text-[#C8A870]">
                  Quotation Revenue by Client
                </h3>
                <div className="h-28 flex items-end justify-between px-4 pb-2 border-b border-white/5 relative">
                  {barChartData.map((bar, i) => {
                    const pct = Math.max(12, Math.round((bar.amount / maxAmount) * 100))
                    return (
                      <div key={i} className="flex flex-col items-center w-12 group relative">
                        <div className="absolute bottom-full mb-1 bg-[#0A0A0A] border border-white/10 rounded-md py-0.5 px-1.5 font-mono text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          ₹{(bar.amount).toLocaleString()}
                        </div>
                        <div 
                          style={{ height: `${pct}%` }} 
                          className="w-6 rounded-t bg-gradient-to-t from-accent-purple to-accent-cyan shadow-[0_0_10px_rgba(139,92,246,0.3)] group-hover:brightness-110 transition-all duration-500"
                        />
                        <span className="font-mono text-[8px] text-text-muted mt-1 truncate w-14 text-center">
                          {bar.name}
                        </span>
                      </div>
                    )
                  })}
                  {barChartData.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center font-sans text-xs text-text-muted">
                      No records found.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#060A08]/65 p-4 flex flex-col justify-between">
                <h3 className="font-heading text-[9px] font-bold uppercase tracking-widest text-[#C8A870]">
                  Document Status Distribution
                </h3>
                <div className="flex flex-row items-center justify-around gap-4 h-28">
                  <div className="relative h-24 w-24 shrink-0">
                    <svg viewBox="0 0 36 36" className="h-full w-full">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                      {totalDocsCount > 0 && (() => {
                        let offset = 0
                        return Object.entries(statusCounts).map(([status, count], i) => {
                          if (count === 0) return null
                          const share = (count / totalDocsCount) * 100
                          const dash = `${share} ${100 - share}`
                          const currentOffset = offset
                          offset += share
                          let strokeColor = '#FFC107'
                          if (status === 'Approved') strokeColor = '#10B981'
                          if (status === 'Sent') strokeColor = '#06B6D4'
                          if (status === 'Declined') strokeColor = '#EF4444'

                          return (
                            <circle
                              key={i}
                              cx="18"
                              cy="18"
                              r="15.915"
                              fill="none"
                              stroke={strokeColor}
                              strokeWidth="3.5"
                              strokeDasharray={dash}
                              strokeDashoffset={100 - currentOffset}
                              strokeLinecap="round"
                            />
                          )
                        })
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                      <span className="font-heading text-sm font-extrabold text-white">{totalDocsCount}</span>
                      <span className="font-mono text-[7px] text-text-muted uppercase">Docs</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[8px] font-mono">
                    <div className="flex items-center gap-1.5 text-white">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                      <span>Approved: {statusCounts.Approved}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#06B6D4]" />
                      <span>Sent: {statusCounts.Sent}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FFC107]" />
                      <span>Draft: {statusCounts.Draft}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
                      <span>Declined: {statusCounts.Declined}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document list table - Scrollable internally */}
            <div className="flex-1 rounded-2xl border border-white/5 bg-[#060A08]/50 overflow-hidden flex flex-col">
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-[#060A08]">
                    <tr className="border-b border-white/5 bg-white/5 font-mono text-[9px] uppercase tracking-wider text-text-muted">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4 w-40">Subject</th>
                      <th className="py-3 px-4 text-right">Value</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02] font-sans text-xs text-white">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-2.5 px-4 font-mono text-text-muted text-[10px]">{doc.id}</td>
                        <td className="py-2.5 px-4">
                          <span className="font-mono text-[8px] uppercase tracking-wider text-[#C8A870] font-semibold">
                            {doc.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-[11px]">{doc.clientName}</td>
                        <td className="py-2.5 px-4 text-text-muted truncate max-w-[150px] text-[11px]" title={doc.subject}>
                          {doc.subject}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-[#C8A870] font-bold text-[10px]">
                          {doc.total ? `₹${doc.total.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-2.5 px-4">
                          <select
                            value={doc.status}
                            onChange={(e) => updateDocStatus(doc.id, e.target.value as any)}
                            className="bg-[#0A0A0A] border border-white/10 rounded-md py-0.5 px-1.5 font-mono text-[9px] text-white focus:border-accent-cyan/50 outline-none cursor-pointer"
                          >
                            <option value="Draft">Draft</option>
                            <option value="Sent">Sent</option>
                            <option value="Approved">Approved</option>
                            <option value="Declined">Declined</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Print Action */}
                            <button
                              type="button"
                              onClick={() => {
                                setDocId(doc.id)
                                setClientName(doc.clientName)
                                setDocDate(doc.date)
                                setClientLogoUrl(doc.clientLogo || null)
                                
                                let parsed: any = {}
                                try {
                                  if (doc.content) parsed = JSON.parse(doc.content)
                                } catch (err) {
                                  console.error(err)
                                }

                                if (doc.type === 'Quotation') {
                                  setProjectName(doc.subject)
                                  setProjectDescription(parsed.projectDescription || '')
                                  setQuoteItems(parsed.quoteItems || [])
                                  setClientAddress(parsed.clientAddress || '')
                                  setActiveTab('quotation')
                                } else if (doc.type === 'NDA') {
                                  setNdaPurpose(doc.subject)
                                  setEffectiveDate(parsed.effectiveDate || doc.date)
                                  setGoverningLaw(parsed.governingLaw || '')
                                  setDisclosingParty(parsed.disclosingParty || '')
                                  setReceivingParty(parsed.receivingParty || '')
                                  setActiveTab('nda')
                                } else if (doc.type === 'Service Agreement') {
                                  setProjectName(doc.subject)
                                  setServiceTotal(doc.total || 0)
                                  setMilestones(parsed.milestones || [])
                                  setClientAddress(parsed.clientAddress || '')
                                  setGoverningLaw(parsed.governingLaw || '')
                                  setActiveTab('service')
                                } else if (doc.type === 'Kickoff Requirement') {
                                  setKickoffObjective(doc.subject)
                                  setChecklist(parsed.checklist || [])
                                  setSprintKickoff(parsed.sprintKickoff || '')
                                  setSprintDesign(parsed.sprintDesign || '')
                                  setSprintDev(parsed.sprintDev || '')
                                  setSprintTest(parsed.sprintTest || '')
                                  setSprintLaunch(parsed.sprintLaunch || '')
                                  setActiveTab('kickoff')
                                } else if (doc.type === 'Techstack') {
                                  setProjectName(doc.subject)
                                  setStackClient(parsed.stackClient || '')
                                  setStackServer(parsed.stackServer || '')
                                  setStackDb(parsed.stackDb || '')
                                  setStackHost(parsed.stackHost || '')
                                  setStackAi(parsed.stackAi || '')
                                  setStackAuth(parsed.stackAuth || '')
                                  setActiveTab('techstack')
                                }
                              }}
                              className="p-1 rounded bg-white/5 border border-white/5 hover:border-accent-cyan/30 text-accent-cyan transition-all cursor-pointer animate-pulse-subtle"
                              title="Load & Print"
                            >
                              <Printer size={11} />
                            </button>

                            {/* Share Link Action */}
                            <button
                              type="button"
                              onClick={() => copyShareLink(doc.id)}
                              className="p-1 rounded bg-white/5 border border-white/5 hover:border-accent-purple/30 text-accent-purple transition-all cursor-pointer"
                              title="Copy Share Link"
                            >
                              <Link2 size={11} />
                            </button>
                            
                            {/* Delete Action */}
                            <button
                              type="button"
                              disabled={userRole !== 'Admin'}
                              onClick={() => deleteDocument(doc.id)}
                              className={`p-1 rounded border transition-all ${
                                userRole === 'Admin' 
                                  ? 'bg-red-500/5 border-red-500/10 hover:border-red-500/30 text-red-400 cursor-pointer' 
                                  : 'opacity-40 bg-gray-500/5 border-gray-500/10 text-gray-500 cursor-not-allowed'
                              }`}
                              title={userRole === 'Admin' ? 'Delete Record' : 'Admin clearance required'}
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {documents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-text-muted font-mono text-xs">
                          No documents stored in PostgreSQL.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: CLIENT ONBOARD PANEL */}
        {activeTab === 'onboard' && (
          <div className="h-full flex flex-col space-y-6 overflow-hidden">
            <div>
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-white uppercase leading-none mb-1">
                Client Onboarding Registry
              </h2>
              <p className="font-mono text-[10px] text-accent-cyan font-bold">
                Register New Corporate Accounts & Profiles
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 overflow-hidden">
              {/* Left: Input Form */}
              <form onSubmit={saveClientProfile} className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4 overflow-y-auto h-full max-h-full">
                <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870] mb-2">
                  Client Profile Form
                </h3>
                
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-text-muted uppercase">Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tesla Motor Corp"
                      value={onboardCompany}
                      onChange={(e) => setOnboardCompany(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 text-white focus:border-accent-cyan/55 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-text-muted uppercase">Primary Contact Person *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elon Musk"
                      value={onboardContact}
                      onChange={(e) => setOnboardContact(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 text-white focus:border-accent-cyan/55 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-text-muted uppercase">Contact Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. elon@tesla.com"
                      value={onboardEmail}
                      onChange={(e) => setOnboardEmail(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 text-white focus:border-accent-cyan/55 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-text-muted uppercase">Contact Phone</label>
                      <input
                        type="text"
                        placeholder="e.g. +1 555 0199"
                        value={onboardPhone}
                        onChange={(e) => setOnboardPhone(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 text-white focus:border-accent-cyan/55 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-text-muted uppercase">GSTIN / Tax ID</label>
                      <input
                        type="text"
                        placeholder="e.g. GSTIN-37A"
                        value={onboardTaxId}
                        onChange={(e) => setOnboardTaxId(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 text-white focus:border-accent-cyan/55 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-text-muted uppercase">Account Status</label>
                    <select
                      value={onboardStatus}
                      onChange={(e) => setOnboardStatus(e.target.value as any)}
                      className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 text-white focus:border-accent-cyan/55 outline-none cursor-pointer"
                    >
                      <option value="Onboarding">Onboarding</option>
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 flex items-center justify-center gap-2 cursor-pointer rounded-xl border border-[#0D5B3A] bg-[#0D5B3A]/20 hover:bg-[#0D5B3A]/40 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white transition-all"
                >
                  <CheckCircle2 size={14} />
                  Onboard Corporate Client
                </button>
              </form>

              {/* Right: Scrollable onboarded clients list */}
              <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 overflow-hidden flex flex-col h-full max-h-full">
                <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870] mb-4 shrink-0">
                  Onboarded Corporate Accounts List
                </h3>

                <div className="overflow-y-auto flex-1 space-y-3">
                  {clients.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Building size={14} className="text-accent-cyan" />
                          <strong className="text-white text-[13px]">{c.companyName}</strong>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full font-mono text-[8px] uppercase tracking-wider ${
                            c.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                            c.status === 'Suspended' ? 'bg-rose-500/20 text-rose-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-text-muted font-medium">Contact: {c.contactName} ({c.contactEmail})</p>
                        {c.taxId && <p className="font-mono text-[9px] text-[#C8A870]">GSTIN/Tax ID: {c.taxId}</p>}
                      </div>
                      
                      {/* Delete Client action */}
                      <button
                        type="button"
                        disabled={userRole !== 'Admin'}
                        onClick={() => deleteClientProfile(c.id)}
                        className={`p-2 rounded border transition-all ${
                          userRole === 'Admin' 
                            ? 'bg-red-500/5 border-red-500/10 hover:border-red-500/30 text-red-400 cursor-pointer' 
                            : 'opacity-40 bg-gray-500/5 border-gray-500/10 text-gray-500 cursor-not-allowed'
                        }`}
                        title={userRole === 'Admin' ? 'Delete Profile' : 'Admin clearance required'}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  {clients.length === 0 && (
                    <div className="h-full flex items-center justify-center font-mono text-[10px] text-text-muted">
                      No corporate accounts onboarded in PostgreSQL yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: DOCUMENT GENERATOR FORMS */}
        {activeTab !== 'monitor' && activeTab !== 'onboard' && (
          <div className="h-full flex flex-col space-y-6 overflow-hidden">
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => setActiveTab('monitor')}
                className="font-mono text-[10px] text-accent-cyan hover:underline cursor-pointer"
              >
                ← Back to Monitor
              </button>
            </div>
            
            <h2 className="font-heading text-xl font-extrabold tracking-tight text-white uppercase leading-none shrink-0">
              {activeTab === 'quotation' && 'Quotation Builder'}
              {activeTab === 'nda' && 'NDA Agreement Form'}
              {activeTab === 'service' && 'Service Agreement Builder'}
              {activeTab === 'kickoff' && 'Kickoff Requirements Specification'}
              {activeTab === 'techstack' && 'Technology Stack Specifications'}
            </h2>

            {/* Scrollable form panels to fit screen */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column (Metadata & Client Select Dropdown) */}
                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                    <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                      Document Registry
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Document ID</label>
                        <input
                          type="text"
                          value={docId}
                          onChange={(e) => setDocId(e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-mono text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Document Date</label>
                        <input
                          type="date"
                          value={docDate}
                          onChange={(e) => setDocDate(e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-mono text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                    <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                      Client Onboard Selection (Auto-populates fields)
                    </h3>
                    <div className="space-y-3.5">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Select Corporate Client *</label>
                        <select
                          value={clientName}
                          onChange={(e) => handleClientSelectionChange(e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none cursor-pointer"
                        >
                          <option value="" disabled className="text-gray-500 bg-[#0A0A0A]">Select client account...</option>
                          {clients.map(c => (
                            <option key={c.id} value={c.companyName} className="bg-[#0A0A0A] text-white">
                              {c.companyName} ({c.status})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted block">Client Logo Image</label>
                        <div className="flex gap-3 items-center">
                          <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-[9px] uppercase tracking-wider cursor-pointer transition-all">
                            <Upload size={12} />
                            Choose Logo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleClientLogoUpload}
                              className="hidden"
                            />
                          </label>
                          {clientLogoUrl && (
                            <button
                              type="button"
                              onClick={clearClientLogo}
                              className="text-red-400 hover:text-red-300 font-mono text-[9px] uppercase tracking-wider"
                            >
                              Clear Image
                            </button>
                          )}
                        </div>
                        {clientLogoUrl ? (
                          <div className="mt-2 flex h-14 w-28 items-center justify-center rounded-lg bg-white/5 p-2 border border-white/5 overflow-hidden">
                            <img src={clientLogoUrl} className="h-full w-full object-contain" alt="Client Logo Thumbnail" />
                          </div>
                        ) : (
                          <span className="font-mono text-[9px] text-text-muted block">
                            No custom client logo uploaded.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (Dynamic Custom Fields) */}
                <div className="space-y-6">
                  
                  {/* FORM TYPE 1: QUOTATION */}
                  {activeTab === 'quotation' && (
                    <>
                      <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                        <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                          Billing Address
                        </h3>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Client Address (Auto-filled)</label>
                          <textarea
                            value={clientAddress}
                            onChange={(e) => setClientAddress(e.target.value)}
                            rows={2}
                            className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all resize-none"
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                        <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                          Project Specifications
                        </h3>
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Project Name</label>
                            <input
                              type="text"
                              value={projectName}
                              onChange={(e) => setProjectName(e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Scope of Work Summary</label>
                            <textarea
                              value={projectDescription}
                              onChange={(e) => setProjectDescription(e.target.value)}
                              rows={3}
                              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-sans text-xs leading-relaxed text-white focus:border-accent-cyan/55 outline-none transition-all resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* FORM TYPE 2: NDA */}
                  {activeTab === 'nda' && (
                    <>
                      <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                        <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                          Contractual Parties
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Disclosing Party</label>
                            <input
                              type="text"
                              value={disclosingParty}
                              onChange={(e) => setDisclosingParty(e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Receiving Party (Auto-filled)</label>
                            <input
                              type="text"
                              value={receivingParty}
                              onChange={(e) => setReceivingParty(e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                        <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                          Agreement Terms
                        </h3>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Effective Date</label>
                              <input
                                type="date"
                                value={effectiveDate}
                                onChange={(e) => setEffectiveDate(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-mono text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Governing Jurisdiction</label>
                              <input
                                type="text"
                                value={governingLaw}
                                onChange={(e) => setGoverningLaw(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Purpose of Disclosures</label>
                            <textarea
                              value={ndaPurpose}
                              onChange={(e) => setNdaPurpose(e.target.value)}
                              rows={3}
                              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-sans text-xs leading-relaxed text-white focus:border-accent-cyan/55 outline-none transition-all resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* FORM TYPE 3: SERVICE AGREEMENT */}
                  {activeTab === 'service' && (
                    <>
                      <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                        <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                          Service Billing Address
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Client Address (Auto-filled)</label>
                            <textarea
                              value={clientAddress}
                              onChange={(e) => setClientAddress(e.target.value)}
                              rows={2}
                              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all resize-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Total Budget (₹)</label>
                              <input
                                type="number"
                                value={serviceTotal}
                                onChange={(e) => setServiceTotal(Number(e.target.value))}
                                className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-mono text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Governing State</label>
                              <input
                                type="text"
                                value={governingLaw}
                                onChange={(e) => setGoverningLaw(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                        <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                          SLA Service Description
                        </h3>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Scope Objective</label>
                          <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* FORM TYPE 4: KICKOFF DETAILS */}
                  {activeTab === 'kickoff' && (
                    <>
                      <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                        <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                          Objectives Summary
                        </h3>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Target Kickoff Objective</label>
                          <textarea
                            value={kickoffObjective}
                            onChange={(e) => setKickoffObjective(e.target.value)}
                            rows={2}
                            className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all resize-none"
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                        <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                          Sprint Schedule (Timeline)
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Kickoff (Sprint 1)</label>
                            <input type="text" value={sprintKickoff} onChange={(e) => setSprintKickoff(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2 font-sans text-xs text-white outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Design (Sprint 2)</label>
                            <input type="text" value={sprintDesign} onChange={(e) => setSprintDesign(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2 font-sans text-xs text-white outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Development</label>
                            <input type="text" value={sprintDev} onChange={(e) => setSprintDev(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2 font-sans text-xs text-white outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Diagnostics/Test</label>
                            <input type="text" value={sprintTest} onChange={(e) => setSprintTest(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2 font-sans text-xs text-white outline-none" />
                          </div>
                          <div className="space-y-1.5 col-span-2">
                            <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Target Launch</label>
                            <input type="text" value={sprintLaunch} onChange={(e) => setSprintLaunch(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2 font-sans text-xs text-white outline-none" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* FORM TYPE 5: TECHSTACK SPECS */}
                  {activeTab === 'techstack' && (
                    <>
                      <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                        <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                          Architecture Modules
                        </h3>
                        <div className="space-y-3.5">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Client Interface</label>
                              <input type="text" value={stackClient} onChange={(e) => setStackClient(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2 font-sans text-xs text-white outline-none" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Server Logic</label>
                              <input type="text" value={stackServer} onChange={(e) => setStackServer(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2 font-sans text-xs text-white outline-none" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Database Layer</label>
                              <input type="text" value={stackDb} onChange={(e) => setStackDb(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2 font-sans text-xs text-white outline-none" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Hosting Node</label>
                              <input type="text" value={stackHost} onChange={(e) => setStackHost(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2 font-sans text-xs text-white outline-none" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">AI Reasoner Model</label>
                              <input type="text" value={stackAi} onChange={(e) => setStackAi(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2 font-sans text-xs text-white outline-none" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Security Access</label>
                              <input type="text" value={stackAuth} onChange={(e) => setStackAuth(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2 font-sans text-xs text-white outline-none" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                        <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                          Project Target Specs
                        </h3>
                        <div className="space-y-1.5">
                          <label className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Application Target Title</label>
                          <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-[#0A0A0A] p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>

              {/* Dynamic cost item builders (Lower portion) */}
              {activeTab === 'quotation' && (
                <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                      Pricing Breakdowns
                    </h3>
                    <button
                      type="button"
                      onClick={addQuoteItem}
                      className="flex items-center gap-1 cursor-pointer font-mono text-[10px] uppercase text-accent-cyan hover:brightness-110"
                    >
                      <Plus size={12} /> Add Scope Item
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {quoteItems.map((item, index) => (
                      <div key={item.id} className="flex gap-4 items-center p-4 rounded-xl bg-white/5 border border-white/5">
                        <span className="font-mono text-xs text-text-muted w-6">{index + 1}.</span>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateQuoteItem(item.id, 'title', e.target.value)}
                              placeholder="Module description"
                              className="w-full rounded-md border border-white/10 bg-[#0A0A0A] px-3 py-2 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none"
                            />
                          </div>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 font-mono text-[9px] text-text-muted uppercase">Qty:</span>
                            <input
                              type="number"
                              value={item.qty}
                              onChange={(e) => updateQuoteItem(item.id, 'qty', e.target.value)}
                              className="w-full rounded-md border border-white/10 bg-[#0A0A0A] py-2 pl-12 pr-3 font-mono text-xs text-white focus:border-accent-cyan/55 outline-none"
                            />
                          </div>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 font-mono text-[9px] text-text-muted uppercase">Rate (₹):</span>
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateQuoteItem(item.id, 'rate', e.target.value)}
                              className="w-full rounded-md border border-white/10 bg-[#0A0A0A] py-2 pl-16 pr-3 font-mono text-xs text-white focus:border-accent-cyan/55 outline-none"
                            />
                          </div>
                        </div>
                        {quoteItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuoteItem(item.id)}
                            className="text-text-muted hover:text-red-400 p-2 cursor-pointer transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'service' && (
                <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                      Payment Milestones Split
                    </h3>
                    <button
                      type="button"
                      onClick={addMilestone}
                      className="flex items-center gap-1 cursor-pointer font-mono text-[10px] uppercase text-accent-cyan hover:brightness-110"
                    >
                      <Plus size={12} /> Add Milestone
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {milestones.map((ms, index) => {
                      const computedAmount = Math.round(serviceTotal * (ms.percentage / 100))
                      return (
                        <div key={index} className="flex gap-4 items-center p-4 rounded-xl bg-white/5 border border-white/5">
                          <span className="font-mono text-xs text-text-muted w-6">{index + 1}.</span>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <input
                                type="text"
                                value={ms.title}
                                onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                                placeholder="Milestone release phase"
                                className="w-full rounded-md border border-white/10 bg-[#0A0A0A] px-3 py-2 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none"
                              />
                            </div>
                            <div className="relative flex items-center">
                              <span className="absolute left-3 font-mono text-[9px] text-text-muted uppercase">Split (%):</span>
                              <input
                                type="number"
                                value={ms.percentage}
                                onChange={(e) => updateMilestone(index, 'percentage', e.target.value)}
                                className="w-full rounded-md border border-white/10 bg-[#0A0A0A] py-2 pl-16 pr-3 font-mono text-xs text-white focus:border-accent-cyan/55 outline-none"
                              />
                            </div>
                            <div className="flex items-center justify-end font-mono text-xs text-text-muted pr-3">
                              <span>Computed: ₹{computedAmount.toLocaleString()}</span>
                            </div>
                          </div>
                          {milestones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMilestone(index)}
                              className="text-text-muted hover:text-red-400 p-2 cursor-pointer transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'kickoff' && (
                <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                      Project Requirements Checklist
                    </h3>
                    <button
                      type="button"
                      onClick={addChecklistItem}
                      className="flex items-center gap-1 cursor-pointer font-mono text-[10px] uppercase text-accent-cyan hover:brightness-110"
                    >
                      <Plus size={12} /> Add Task
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {checklist.map((item, index) => (
                      <div key={index} className="flex gap-4 items-center p-4 rounded-xl bg-white/5 border border-white/5">
                        <span className="font-mono text-xs text-text-muted w-6">{index + 1}.</span>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateChecklistItem(index, 'title', e.target.value)}
                              placeholder="Requirement checklist task description"
                              className="w-full rounded-md border border-white/10 bg-[#0A0A0A] px-3 py-2 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none"
                            />
                          </div>
                          <div>
                            <select
                              value={item.status}
                              onChange={(e) => updateChecklistItem(index, 'status', e.target.value)}
                              className="w-full rounded-md border border-white/10 bg-[#0A0A0A] px-3 py-2 font-mono text-xs text-white focus:border-accent-cyan/55 outline-none cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </div>
                        {checklist.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChecklistItem(index)}
                            className="text-text-muted hover:text-red-400 p-2 cursor-pointer transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lower Actions Block */}
              <div className="flex gap-4 max-w-md pt-4 shrink-0 pb-12">
                <button
                  type="button"
                  onClick={saveDocumentToTracker}
                  className="flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-xl border border-[#0D5B3A] bg-[#0D5B3A]/20 hover:bg-[#0D5B3A]/40 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white transition-all active:scale-98"
                >
                  <CheckCircle2 size={14} />
                  Save & Record
                </button>
                <button
                  type="button"
                  onClick={triggerPrint}
                  className="flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white shadow-md hover:brightness-110 transition-all active:scale-98"
                >
                  <Printer size={14} />
                  Print / Save PDF
                </button>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* 4. Document Live Preview (HIDDEN ON SCREEN, ONLY VISIBLE DURING PRINT) */}
      <section className="hidden print:block print:absolute print:left-0 print:top-0 print:z-[99999] print:w-full print:bg-white print:text-black print:overflow-visible">
        
        {/* Virtual A4 Sheet Container */}
        <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 flex flex-col justify-between print:border-none print:shadow-none print:w-full print:p-0 print:min-h-0 print:h-auto">
          <div>
            
            {/* Header: Branded Letterhead (Logos Only) */}
            <header className="flex items-center justify-between border-b-2 border-[#0D5B3A] pb-6 mb-8 print:border-b-2">
              {/* Left: Prigenix Logo Only */}
              <div className="h-16 w-16 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 p-2.5 shrink-0">
                <img src="/logo.png" alt="Prigenix Logo" className="h-full w-full object-contain" />
              </div>

              {/* Right: Client Logo (if uploaded) OR Document Details (if not uploaded) */}
              {clientLogoUrl ? (
                <div className="h-16 w-20 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 p-2 shrink-0">
                  <img src={clientLogoUrl} className="h-full w-full object-contain" alt="Client Logo" />
                </div>
              ) : (
                <div className="text-right">
                  <h1 className="font-heading text-base font-extrabold uppercase tracking-wide text-[#0D5B3A] leading-none mb-2">
                    {activeTab === 'quotation' && 'Project Quotation'}
                    {activeTab === 'nda' && 'NDA Agreement'}
                    {activeTab === 'service' && 'Service Agreement'}
                    {activeTab === 'kickoff' && 'Kickoff Requirements'}
                    {activeTab === 'techstack' && 'Technology Stack'}
                  </h1>
                  <p className="font-mono text-[10px] text-gray-500">
                    ID: <span className="text-black font-semibold">{docId}</span>
                  </p>
                  <p className="font-mono text-[10px] text-gray-500">
                    Date: <span className="text-black font-semibold">{docDate}</span>
                  </p>
                </div>
              )}
            </header>

            {/* Document Content Body */}
            <div className="font-sans text-xs leading-relaxed text-gray-800 print-text-dark select-text">
              
              {/* TYPE 1: QUOTATION */}
              {activeTab === 'quotation' && (
                <div className="space-y-6">
                  {clientLogoUrl && (
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2 print-text-muted">
                          Prepared For
                        </h5>
                        <p className="font-bold text-sm text-black">{clientName}</p>
                        <p className="text-gray-500 font-medium">{clientAddress}</p>
                      </div>
                      <div className="text-right">
                        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-[#0D5B3A] leading-none mb-2">
                          Project Quotation
                        </h2>
                        <p className="font-mono text-[10px] text-gray-500">
                          ID: <span className="text-black font-semibold">{docId}</span>
                        </p>
                        <p className="font-mono text-[10px] text-gray-500">
                          Date: <span className="text-black font-semibold">{docDate}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {!clientLogoUrl && (
                    <div>
                      <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2 print-text-muted">
                        Prepared For
                      </h5>
                      <p className="font-bold text-sm text-black">{clientName}</p>
                      <p className="text-gray-500 font-medium">{clientAddress}</p>
                    </div>
                  )}

                  <div>
                    <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2 print-text-muted">
                      Project Objective: <span className="text-black capitalize font-bold">{projectName}</span>
                    </h5>
                    <p className="text-gray-600 italic bg-gray-50 p-4 border-l-2 border-[#0D5B3A] rounded-r-md print:bg-gray-100">
                      "{projectDescription}"
                    </p>
                  </div>

                  <div>
                    <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-3 print-text-muted">
                      Scope Allocation & Cost Breakdown
                    </h5>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#0D5B3A] font-heading text-[10px] uppercase tracking-wider text-gray-500 print-border">
                          <th className="py-2.5 font-bold">Scope Module</th>
                          <th className="py-2.5 text-center font-bold w-20">Qty/Hours</th>
                          <th className="py-2.5 text-right font-bold w-24">Rate</th>
                          <th className="py-2.5 text-right font-bold w-28">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quoteItems.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100 font-sans print-border">
                            <td className="py-3 font-semibold text-black">{item.title}</td>
                            <td className="py-3 text-center font-mono text-gray-600">{item.qty}</td>
                            <td className="py-3 text-right font-mono text-gray-600">₹{item.rate.toLocaleString()}</td>
                            <td className="py-3 text-right font-mono text-black font-semibold">
                              ₹{(item.qty * item.rate).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-4">
                    <div className="w-64 space-y-2 border-t border-gray-100 pt-4 print-border">
                      <div className="flex justify-between font-mono text-[10px] text-gray-500">
                        <span>Scope Subtotal:</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-mono text-[10px] text-gray-500">
                        <span>Provision Tax (0.0%):</span>
                        <span>₹0.00</span>
                      </div>
                      <div className="flex justify-between border-t border-[#0D5B3A] pt-2 font-heading text-sm font-bold text-black print-border">
                        <span>TOTAL PROPOSAL:</span>
                        <span className="text-[#0D5B3A] font-extrabold">₹{total.toLocaleString()} INR</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 space-y-2 border-t border-gray-100 print-border">
                    <h5 className="font-heading text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      Standard Terms & Provisions
                    </h5>
                    <ul className="list-disc list-inside text-[10px] text-gray-500 space-y-1">
                      <li>Quotations are valid for exactly 30 days from the document date.</li>
                      <li>Payment milestones: 30% initial project kickoff, 40% mid-point milestone, 30% delivery.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TYPE 2: NDA AGREEMENT */}
              {activeTab === 'nda' && (
                <div className="space-y-6">
                  {clientLogoUrl && (
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="font-mono text-[8px] text-gray-400 block uppercase tracking-widest">Parties</span>
                        <p className="font-bold text-xs text-black">Disclosing: {disclosingParty}</p>
                        <p className="font-bold text-xs text-black">Receiving: {receivingParty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[10px] text-gray-500">
                          ID: <span className="text-black font-semibold">{docId}</span>
                        </p>
                        <p className="font-mono text-[10px] text-gray-500">
                          Date: <span className="text-black font-semibold">{docDate}</span>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <h2 className="text-center font-heading text-sm font-bold uppercase tracking-widest text-[#0D5B3A] mb-4">
                    MUTUAL NON-DISCLOSURE AGREEMENT
                  </h2>

                  <p className="text-justify leading-relaxed">
                    This Mutual Non-Disclosure Agreement (the "Agreement") is entered into and made effective as of 
                    <strong> {effectiveDate}</strong> (the "Effective Date"), by and between 
                    <strong> {disclosingParty}</strong>, with principal operations listed under Prigenix Software Studio 
                    ("Disclosing Party"), and <strong> {receivingParty}</strong>, with offices listed at {clientName} 
                    ("Receiving Party"). The Disclosing Party and Receiving Party may collectively be referred to as 
                    the "Parties" or individually as a "Party."
                  </p>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <h6 className="font-heading text-[10px] font-bold text-black uppercase">
                        1. Purpose & Protected Disclosures
                      </h6>
                      <p className="text-justify text-gray-600 print-text-dark">
                        The Parties wish to evaluate a potential business opportunity or transaction relating to: 
                        <strong className="text-black"> {ndaPurpose}</strong>. In connection with this evaluation, 
                        Parties may share proprietary technology specifications, business processes, and software codes 
                        ("Confidential Information").
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h6 className="font-heading text-[10px] font-bold text-black uppercase">
                        2. Nondisclosure Obligations
                      </h6>
                      <p className="text-justify text-gray-600 print-text-dark">
                        The Receiving Party shall hold the Confidential Information in strict trust and confidence. The 
                        Receiving Party shall not reproduce, copy, duplicate, or disclose any Confidential Information 
                        to third parties without the prior written consent of the Disclosing Party, except to personnel 
                        who have a direct need-to-know to achieve the Purpose.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h6 className="font-heading text-[10px] font-bold text-black uppercase">
                        3. Agreement Duration & Term
                      </h6>
                      <p className="text-justify text-gray-600 print-text-dark">
                        This Agreement's disclosure period begins on the Effective Date. The obligation of 
                        confidentiality shall survive for a period of three (3) years from the date of initial 
                        disclosure, or until the Confidential Information no longer constitutes a proprietary business 
                        trade secret.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h6 className="font-heading text-[10px] font-bold text-black uppercase">
                        4. Jurisdiction & Governing Law
                      </h6>
                      <p className="text-justify text-gray-600 print-text-dark">
                        This Agreement shall be governed, interpreted, and construed in accordance with the laws of 
                        <strong> {governingLaw}</strong>, without regard to its conflict of law principles. Any dispute 
                        shall be resolved in courts within the governing jurisdiction.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TYPE 3: SERVICE AGREEMENT */}
              {activeTab === 'service' && (
                <div className="space-y-6">
                  {clientLogoUrl && (
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2 print-text-muted">
                          Service Client
                        </h5>
                        <p className="font-bold text-sm text-black">{clientName}</p>
                        <p className="text-gray-500 font-medium">{clientAddress}</p>
                      </div>
                      <div className="text-right">
                        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-[#0D5B3A] leading-none mb-2">
                          Service Agreement
                        </h2>
                        <p className="font-mono text-[10px] text-gray-500">
                          ID: <span className="text-black font-semibold">{docId}</span>
                        </p>
                        <p className="font-mono text-[10px] text-gray-500">
                          Date: <span className="text-black font-semibold">{docDate}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {!clientLogoUrl && (
                    <div>
                      <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2 print-text-muted">
                        Service Client
                      </h5>
                      <p className="font-bold text-sm text-black">{clientName}</p>
                      <p className="text-gray-500 font-medium">{clientAddress}</p>
                    </div>
                  )}

                  <div>
                    <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2 print-text-muted">
                      Scope of Services: <span className="text-black capitalize font-bold">{projectName}</span>
                    </h5>
                    <p className="text-gray-600 italic bg-gray-50 p-4 border-l-2 border-[#0D5B3A] rounded-r-md print:bg-gray-100">
                      "Implementation of Custom Software architecture modules as outlined in the project deliverables."
                    </p>
                  </div>

                  <div>
                    <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-3 print-text-muted">
                      Payment Milestones Split
                    </h5>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#0D5B3A] font-heading text-[10px] uppercase tracking-wider text-gray-500 print-border">
                          <th className="py-2.5 font-bold">Milestone Description</th>
                          <th className="py-2.5 text-center font-bold w-24">Percentage</th>
                          <th className="py-2.5 text-right font-bold w-32">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {milestones.map((ms, i) => (
                          <tr key={i} className="border-b border-gray-100 font-sans print-border">
                            <td className="py-3 font-semibold text-black">{ms.title}</td>
                            <td className="py-3 text-center font-mono text-gray-600">{ms.percentage}%</td>
                            <td className="py-3 text-right font-mono text-black font-semibold">
                              ₹{Math.round(serviceTotal * (ms.percentage / 100)).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-4">
                    <div className="w-64 space-y-2 border-t border-gray-100 pt-4 print-border">
                      <div className="flex justify-between border-t border-[#0D5B3A] pt-2 font-heading text-sm font-bold text-black print-border">
                        <span>TOTAL BUDGET:</span>
                        <span className="text-[#0D5B3A] font-extrabold">₹{serviceTotal.toLocaleString()} INR</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 space-y-2 border-t border-gray-100 print-border">
                    <h5 className="font-heading text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      Jurisdiction & Liability
                    </h5>
                    <p className="text-[9px] text-gray-500">
                      This SLA is governed under the jurisdiction of the {governingLaw}. Under no circumstances shall either party be liable to the other for indirect, special, or consequential damages.
                    </p>
                  </div>
                </div>
              )}

              {/* TYPE 4: KICKOFF DETAILS */}
              {activeTab === 'kickoff' && (
                <div className="space-y-6">
                  <div>
                    <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2 print-text-muted">
                      Project Client
                    </h5>
                    <p className="font-bold text-sm text-black">{clientName}</p>
                  </div>

                  <div>
                    <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2 print-text-muted">
                      Core Objective
                    </h5>
                    <p className="text-gray-600 italic bg-gray-50 p-4 border-l-2 border-[#0D5B3A] rounded-r-md print:bg-gray-100">
                      "{kickoffObjective}"
                    </p>
                  </div>

                  <div>
                    <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-3 print-text-muted">
                      Requirements Checklist
                    </h5>
                    <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100 print:bg-gray-100">
                      {checklist.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${
                            item.status === 'Completed' ? 'bg-[#0D5B3A] border-[#0D5B3A] text-white' : 'border-gray-300 bg-white'
                          }`}>
                            {item.status === 'Completed' && '✓'}
                          </div>
                          <span className={`text-[11px] ${item.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-700 font-semibold'}`}>
                            {item.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-3 print-text-muted">
                      Sprint Timeline Schedule
                    </h5>
                    <div className="grid grid-cols-5 gap-3 border border-gray-100 rounded-xl p-4 bg-gray-50 text-center print:bg-gray-100">
                      <div>
                        <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Kickoff</span>
                        <span className="text-[10px] font-bold text-black block mt-1">{sprintKickoff}</span>
                      </div>
                      <div>
                        <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Design</span>
                        <span className="text-[10px] font-bold text-black block mt-1">{sprintDesign}</span>
                      </div>
                      <div>
                        <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Dev</span>
                        <span className="text-[10px] font-bold text-black block mt-1">{sprintDev}</span>
                      </div>
                      <div>
                        <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Test</span>
                        <span className="text-[10px] font-bold text-black block mt-1">{sprintTest}</span>
                      </div>
                      <div>
                        <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Launch</span>
                        <span className="text-[10px] font-bold text-black block mt-1">{sprintLaunch}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TYPE 5: TECHSTACK SPECS */}
              {activeTab === 'techstack' && (
                <div className="space-y-6">
                  <div>
                    <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2 print-text-muted">
                      Project Client
                    </h5>
                    <p className="font-bold text-sm text-black">{clientName}</p>
                  </div>

                  <div>
                    <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2 print-text-muted">
                      Target Architecture
                    </h5>
                    <p className="text-gray-600 italic bg-gray-50 p-4 border-l-2 border-[#0D5B3A] rounded-r-md print:bg-gray-100">
                      "{projectName}"
                    </p>
                  </div>

                  <div>
                    <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-3 print-text-muted">
                      Core Technologies Allocation
                    </h5>
                    <div className="grid grid-cols-2 gap-4 border border-gray-100 rounded-xl p-4 bg-gray-50 print:bg-gray-100">
                      <div>
                        <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Client Layer</span>
                        <span className="text-xs font-bold text-black block mt-0.5">{stackClient}</span>
                      </div>
                      <div>
                        <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Server Logic</span>
                        <span className="text-xs font-bold text-black block mt-0.5">{stackServer}</span>
                      </div>
                      <div>
                        <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Database Storage</span>
                        <span className="text-xs font-bold text-black block mt-0.5">{stackDb}</span>
                      </div>
                      <div>
                        <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Hosting Node</span>
                        <span className="text-xs font-bold text-black block mt-0.5">{stackHost}</span>
                      </div>
                      <div>
                        <span className="font-heading text-[9px] text-[#C8A870] uppercase block">AI Model</span>
                        <span className="text-xs font-bold text-black block mt-0.5">{stackAi}</span>
                      </div>
                      <div>
                        <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Security Access</span>
                        <span className="text-xs font-bold text-black block mt-0.5">{stackAuth}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Branded Footer */}
          <footer className="border-t border-gray-100 pt-4 flex items-center justify-between text-gray-400 font-mono text-[8px] tracking-wider uppercase mt-8 print-border">
            <span>Prigenix Software Studio</span>
            <span>Confidential & Proprietary Document</span>
          </footer>
        </div>

      </section>

    </main>
  )
}
