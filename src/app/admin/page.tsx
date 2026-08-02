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
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Building,
  Upload,
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react'

// Simple client-side auth credentials for multiple roles
const CREDENTIALS = {
  admin: { pass: 'prigenix-admin-2026', role: 'Admin' },
  marketing: { pass: 'prigenix-marketing-2026', role: 'Marketing' }
}

interface DocRecord {
  id: string
  type: 'Quotation' | 'NDA'
  clientName: string
  subject: string
  status: 'Draft' | 'Sent' | 'Approved' | 'Declined'
  total?: number
  date: string
  createdBy: 'Admin' | 'Marketing'
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userRole, setUserRole] = useState<'Admin' | 'Marketing'>('Marketing')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<'monitor' | 'quotation' | 'nda'>('monitor')

  // Status tracker documents state
  const [documents, setDocuments] = useState<DocRecord[]>([
    { id: 'PRX-2026-0040', type: 'Quotation', clientName: 'Tesla Motor Corp', subject: 'Autonomous Robotic Line Integrator', status: 'Approved', total: 45000, date: '2026-07-28', createdBy: 'Admin' },
    { id: 'PRX-2026-0041', type: 'NDA', clientName: 'SpaceX Aerospace', subject: 'Flight Telemetry AI Models', status: 'Sent', date: '2026-07-30', createdBy: 'Marketing' },
    { id: 'PRX-2026-0042', type: 'Quotation', clientName: 'Hyperloop Tech', subject: 'Pneumatic Pressure Dashboard Controls', status: 'Draft', total: 18500, date: '2026-08-01', createdBy: 'Marketing' },
  ])

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

  // Document states
  const [clientName, setClientName] = useState('Tesla Motor Corp')
  const [clientAddress, setClientAddress] = useState('3500 Deer Creek Road, Palo Alto, CA 94304')
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0])
  const [docId, setDocId] = useState('PRX-2026-0043')
  const [clientLogoUrl, setClientLogoUrl] = useState<string | null>(null)

  // Quotation Specific States
  const [projectName, setProjectName] = useState('Autonomous Robotic Line Integrator')
  const [projectDescription, setProjectDescription] = useState('Custom development of edge-computing logic to monitor factory line conveyor speeds and automatically coordinate motor controllers via TCP/IP protocols.')
  const [quoteItems, setQuoteItems] = useState([
    { id: 1, title: 'Edge Integration Conveyor Scripts', qty: 1, rate: 15000 },
    { id: 2, title: 'Central SCADA Sync Pipeline', qty: 1, rate: 20000 },
    { id: 3, title: 'Fail-Safe Motor Trigger Logic', qty: 1, rate: 10000 },
  ])

  // NDA Specific States
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0])
  const [governingLaw, setGoverningLaw] = useState('State of California')
  const [disclosingParty, setDisclosingParty] = useState('Prigenix Studio')
  const [receivingParty, setReceivingParty] = useState('Tesla Motor Corp')
  const [ndaPurpose, setNdaPurpose] = useState('Evaluating a potential custom software development collaboration and edge-sensor telemetry integration.')

  // Client Logo Upload conversion to Base64 data URL
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

  // Remove Client Logo
  const clearClientLogo = () => {
    setClientLogoUrl(null)
  }

  // Add Item to Quotation
  const addQuoteItem = () => {
    const newId = quoteItems.length > 0 ? Math.max(...quoteItems.map(i => i.id)) + 1 : 1
    setQuoteItems([...quoteItems, { id: newId, title: 'New Scope Module', qty: 1, rate: 1500 }])
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

  // Calculate Quotation Totals
  const subtotal = quoteItems.reduce((sum, item) => sum + (item.qty * item.rate), 0)
  const total = subtotal 

  // Save Document to Tracker Database
  const saveDocumentToTracker = () => {
    const isDuplicate = documents.some(doc => doc.id === docId)
    if (isDuplicate) {
      // Update existing document
      setDocuments(documents.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            clientName,
            subject: activeTab === 'quotation' ? projectName : ndaPurpose,
            total: activeTab === 'quotation' ? total : undefined,
            date: docDate
          }
        }
        return doc
      }))
    } else {
      // Add new document
      const newDoc: DocRecord = {
        id: docId,
        type: activeTab === 'quotation' ? 'Quotation' : 'NDA',
        clientName,
        subject: activeTab === 'quotation' ? projectName : ndaPurpose,
        status: 'Draft',
        total: activeTab === 'quotation' ? total : undefined,
        date: docDate,
        createdBy: userRole
      }
      setDocuments([newDoc, ...documents])
    }
    setActiveTab('monitor')
  }

  // Update Document Status from Monitor Table
  const updateDocStatus = (id: string, newStatus: 'Draft' | 'Sent' | 'Approved' | 'Declined') => {
    setDocuments(documents.map(doc => {
      if (doc.id === id) {
        return { ...doc, status: newStatus }
      }
      return doc
    }))
  }

  // Delete Document (Admin Only Action)
  const deleteDocument = (id: string) => {
    if (userRole !== 'Admin') {
      alert('Permission Denied: Administrator clearance is required to delete records.')
      return
    }
    setDocuments(documents.filter(doc => doc.id !== id))
  }

  // Print Document Trigger
  const triggerPrint = () => {
    window.print()
  }

  if (!isLoggedIn) {
    return (
      <main className="relative flex min-h-screen w-full items-center justify-center bg-[#0A0A0A] px-4 font-sans text-white">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,91,58,0.15),transparent_60%)]" />
        
        <div className="relative z-10 w-full max-w-md">
          {/* Logo Mark */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#0D5B3A]/30 bg-[#060A08]/80 shadow-[0_0_20px_rgba(13,91,58,0.2)]">
              <img src="/logo.png" alt="Prigenix" className="h-10 w-10 object-contain" />
            </div>
            <h1 className="font-heading text-2xl font-extrabold uppercase tracking-widest text-white">
              Prigenix Studio
            </h1>
            <span className="font-mono text-xs uppercase tracking-wider text-accent-cyan">
              Admin & Marketing Document Portal
            </span>
          </div>

          {/* Login Card */}
          <form 
            onSubmit={handleLogin}
            className="rounded-3xl border border-[#C8A870]/25 bg-[#060A08]/85 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] shadow-[#C8A870]/5 backdrop-blur-2xl"
          >
            <h2 className="mb-6 font-heading text-lg font-bold text-white">
              Authentication Portal
            </h2>

            {loginError && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 font-mono text-xs text-red-400">
                <AlertCircle size={16} />
                {loginError}
              </div>
            )}

            <div className="space-y-4">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-text-muted">Username</label>
                <div className="relative flex items-center">
                  <User size={16} className="absolute left-4 text-text-muted" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin or marketing"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 font-sans text-sm text-white placeholder-white/30 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-text-muted">Password</label>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-4 text-text-muted" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 font-sans text-sm text-white placeholder-white/30 outline-none focus:border-accent-cyan/50 focus:bg-white/[0.08] transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 w-full cursor-pointer rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan py-3.5 font-heading text-sm font-extrabold uppercase tracking-widest text-white shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:brightness-110 active:scale-98 transition-all"
            >
              Authenticate
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full bg-[#0A0A0A] font-sans text-white antialiased flex flex-col md:flex-row print:bg-white print:text-black print:min-h-0">
      
      {/* 1. Print Style Overrides Injector */}
      <style jsx global>{`
        @media print {
          body, main {
            background: white !important;
            color: black !important;
            overflow: visible !important;
            height: auto !important;
          }
          .no-print {
            display: none !important;
          }
          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }
          .print-text-dark {
            color: #111111 !important;
          }
          .print-text-muted {
            color: #555555 !important;
          }
          .print-border {
            border-color: #cccccc !important;
          }
          .print-bg-header {
            background-color: #f7f9f8 !important;
          }
        }
      `}</style>

      {/* 2. Left Menu Bar (no-print) */}
      <section className="no-print w-full md:w-80 shrink-0 bg-[#060A08] border-r border-white/5 flex flex-col justify-between py-6 px-6">
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
          <div className="space-y-1.5">
            <button
              onClick={() => setActiveTab('monitor')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'monitor' 
                  ? 'bg-[#0D5B3A] text-white border border-[#0D5B3A]/30' 
                  : 'text-text-muted hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={16} />
              Status Monitor
            </button>
            <button
              onClick={() => setActiveTab('quotation')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'quotation' 
                  ? 'bg-[#0D5B3A] text-white border border-[#0D5B3A]/30' 
                  : 'text-text-muted hover:bg-white/5'
              }`}
            >
              <FileText size={16} />
              Quotation Builder
            </button>
            <button
              onClick={() => setActiveTab('nda')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'nda' 
                  ? 'bg-[#0D5B3A] text-white border border-[#0D5B3A]/30' 
                  : 'text-text-muted hover:bg-white/5'
              }`}
            >
              <FileSignature size={16} />
              NDA Agreement
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
                <span className="font-mono text-[9px] text-text-muted">Auth: Credentials</span>
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

      {/* 3. Middle Area: Document Status Tracker OR Generators Form (no-print) */}
      <section className="no-print flex-1 max-h-screen overflow-y-auto px-6 py-8 border-r border-white/5">
        
        {/* VIEW: STATUS MONITOR TRACKER */}
        {activeTab === 'monitor' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-extrabold tracking-tight text-white uppercase leading-none mb-1">
                  Document Tracker Dashboard
                </h2>
                <p className="font-mono text-xs text-text-muted">
                  Log role: <span className="text-accent-cyan">{userRole}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('quotation')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Plus size={14} /> Quotation
                </button>
                <button
                  onClick={() => setActiveTab('nda')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Plus size={14} /> NDA
                </button>
              </div>
            </div>

            {/* Table layout */}
            <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                    <th className="py-4 px-5">ID</th>
                    <th className="py-4 px-5">Type</th>
                    <th className="py-4 px-5">Client</th>
                    <th className="py-4 px-5 w-44">Subject</th>
                    <th className="py-4 px-5 text-right">Value</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03] font-sans text-xs text-white">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-5 font-mono text-text-muted">{doc.id}</td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold ${
                          doc.type === 'Quotation' 
                            ? 'bg-[#0D5B3A]/20 text-accent-cyan border border-[#0D5B3A]/20' 
                            : 'bg-[#C8A870]/20 text-[#C8A870] border border-[#C8A870]/20'
                        }`}>
                          {doc.type === 'Quotation' ? <FileText size={10} /> : <FileSignature size={10} />}
                          {doc.type}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-bold">{doc.clientName}</td>
                      <td className="py-4 px-5 text-text-muted truncate max-w-[176px]" title={doc.subject}>
                        {doc.subject}
                      </td>
                      <td className="py-4 px-5 text-right font-mono text-[#C8A870] font-bold">
                        {doc.total ? `$${doc.total.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-4 px-5">
                        <select
                          value={doc.status}
                          onChange={(e) => updateDocStatus(doc.id, e.target.value as any)}
                          className="bg-[#0A0A0A] border border-white/10 rounded-md py-1 px-2 font-mono text-[10px] text-white focus:border-accent-cyan/50 outline-none cursor-pointer"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Sent">Sent</option>
                          <option value="Approved">Approved</option>
                          <option value="Declined">Declined</option>
                        </select>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              // Load document values into form states for preview/printing
                              setDocId(doc.id)
                              setClientName(doc.clientName)
                              setDocDate(doc.date)
                              if (doc.type === 'Quotation') {
                                setProjectName(doc.subject)
                                setActiveTab('quotation')
                              } else {
                                setNdaPurpose(doc.subject)
                                setActiveTab('nda')
                              }
                            }}
                            className="p-1.5 rounded bg-white/5 border border-white/5 hover:border-accent-cyan/30 text-accent-cyan transition-all cursor-pointer"
                            title="Load & Preview"
                          >
                            <Printer size={13} />
                          </button>
                          
                          {/* Delete Action (RBAC check for Admin role) */}
                          <button
                            type="button"
                            disabled={userRole !== 'Admin'}
                            onClick={() => deleteDocument(doc.id)}
                            className={`p-1.5 rounded border transition-all ${
                              userRole === 'Admin' 
                                ? 'bg-red-500/5 border-red-500/10 hover:border-red-500/30 text-red-400 cursor-pointer' 
                                : 'opacity-40 bg-gray-500/5 border-gray-500/10 text-gray-500 cursor-not-allowed'
                            }`}
                            title={userRole === 'Admin' ? 'Delete Record' : 'Admin clearance required to delete'}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* RBAC Notice */}
            <div className="flex gap-3 items-start border border-white/5 bg-white/5 p-4 rounded-2xl font-sans text-xs text-text-muted leading-relaxed">
              <ShieldAlert size={18} className="text-[#C8A870] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Role Authorization Rules</span>
                Managers holding the <strong className="text-accent-cyan">Marketing</strong> role have clearance to build and modify records. Deleting documents is strictly restricted to <strong className="text-[#C8A870]">Admin</strong> accounts.
              </div>
            </div>
          </div>
        )}

        {/* VIEW: DOCUMENT GENERATOR FORMS */}
        {activeTab !== 'monitor' && (
          <div className="max-w-xl space-y-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('monitor')}
                className="font-mono text-xs text-accent-cyan hover:underline cursor-pointer"
              >
                ← Back to Monitor
              </button>
            </div>
            
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-white uppercase leading-none">
              {activeTab === 'quotation' ? 'Quotation Builder' : 'NDA Agreement Form'}
            </h2>

            {/* Document Metadata Form */}
            <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
              <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                Document Registry
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-text-muted">Document ID</label>
                  <input
                    type="text"
                    value={docId}
                    onChange={(e) => setDocId(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 font-mono text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-text-muted">Document Date</label>
                  <input
                    type="date"
                    value={docDate}
                    onChange={(e) => setDocDate(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 font-mono text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Client Branding & Logo Upload */}
            <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
              <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                Client Logo & Letterhead Customization
              </h3>
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-text-muted">Corporate Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                  />
                </div>
                
                {/* File Upload Selector */}
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-text-muted block">Client Logo Image</label>
                  <div className="flex gap-3 items-center">
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] uppercase tracking-wider cursor-pointer transition-all">
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
                      No custom client logo uploaded (letterhead will only display Prigenix logo).
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields: Quotation */}
            {activeTab === 'quotation' && (
              <>
                {/* Client HQ Details */}
                <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                  <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                    Billing Address
                  </h3>
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-text-muted">Client Address</label>
                    <textarea
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                  <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                    Project Specifications
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] text-text-muted">Project Name</label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] text-text-muted">Scope of Work Summary</label>
                      <textarea
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 font-sans text-xs leading-relaxed text-white focus:border-accent-cyan/55 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
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
                      <div key={item.id} className="flex gap-2 items-center p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="font-mono text-xs text-text-muted w-6">{index + 1}.</span>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateQuoteItem(item.id, 'title', e.target.value)}
                            placeholder="Module description"
                            className="w-full rounded-md border border-white/10 bg-[#0A0A0A] px-2 py-1.5 font-sans text-xs text-white focus:border-accent-cyan/50 outline-none"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <div className="relative flex items-center">
                              <span className="absolute left-2.5 font-mono text-[10px] text-text-muted">Qty:</span>
                              <input
                                type="number"
                                value={item.qty}
                                onChange={(e) => updateQuoteItem(item.id, 'qty', e.target.value)}
                                className="w-full rounded-md border border-white/10 bg-[#0A0A0A] py-1.5 pl-10 pr-2 font-mono text-xs text-white focus:border-accent-cyan/50 outline-none"
                              />
                            </div>
                            <div className="relative flex items-center">
                              <span className="absolute left-2.5 font-mono text-[10px] text-text-muted">Rate ($):</span>
                              <input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateQuoteItem(item.id, 'rate', e.target.value)}
                                className="w-full rounded-md border border-white/10 bg-[#0A0A0A] py-1.5 pl-14 pr-2 font-mono text-xs text-white focus:border-accent-cyan/50 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                        {quoteItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuoteItem(item.id)}
                            className="text-text-muted hover:text-red-400 p-1 cursor-pointer transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Form Fields: NDA */}
            {activeTab === 'nda' && (
              <>
                {/* Contractual Parties */}
                <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                  <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                    Contractual Parties
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] text-text-muted">Disclosing Party (Developer)</label>
                      <input
                        type="text"
                        value={disclosingParty}
                        onChange={(e) => setDisclosingParty(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] text-text-muted">Receiving Party (Client)</label>
                      <input
                        type="text"
                        value={receivingParty}
                        onChange={(e) => setReceivingParty(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Agreement Terms */}
                <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                  <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                    Agreement Terms
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] text-text-muted">Effective Date</label>
                        <input
                          type="date"
                          value={effectiveDate}
                          onChange={(e) => setEffectiveDate(e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 font-mono text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] text-text-muted">Governing Jurisdiction</label>
                        <input
                          type="text"
                          value={governingLaw}
                          onChange={(e) => setGoverningLaw(e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] text-text-muted">Purpose of Disclosures</label>
                      <textarea
                        value={ndaPurpose}
                        onChange={(e) => setNdaPurpose(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 font-sans text-xs leading-relaxed text-white focus:border-accent-cyan/55 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Actions Trigger Block */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={saveDocumentToTracker}
                className="flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-xl border border-[#0D5B3A] bg-[#0D5B3A]/20 hover:bg-[#0D5B3A]/40 py-4 font-heading text-xs font-bold uppercase tracking-wider text-white transition-all active:scale-98"
              >
                <CheckCircle2 size={16} />
                Save to Monitor
              </button>
              <button
                type="button"
                onClick={triggerPrint}
                className="flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan py-4 font-heading text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:brightness-110 transition-all active:scale-98"
              >
                <Printer size={16} />
                Print / Save PDF
              </button>
            </div>

          </div>
        )}
      </section>

      {/* 4. Document Live Preview (A4 simulation) (print-area) */}
      <section className="print-area flex-1 bg-[#121212] px-4 py-8 overflow-y-auto flex justify-center items-start print:bg-white print:p-0 print:overflow-visible">
        
        {/* Virtual A4 Sheet Container */}
        <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-gray-100 flex flex-col justify-between print:border-none print:shadow-none print:w-full print:p-0 print:min-h-0 print:h-auto">
          <div>
            
            {/* Header: Branded Letterhead */}
            <header className="flex items-start justify-between border-b-2 border-[#0D5B3A] pb-6 mb-8 print:border-b-2">
              <div className="flex gap-4 items-center">
                {/* Company Logo Image */}
                <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 p-2.5">
                  <img src="/logo.png" alt="Prigenix Logo" className="h-full w-full object-contain" />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-extrabold uppercase tracking-widest text-[#0D5B3A] leading-none mb-1">
                    Prigenix
                  </h4>
                  <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider block">
                    Software Development Studio
                  </p>
                  <p className="font-sans text-[9px] text-gray-400 leading-tight">
                    Seattle, WA • www.prigenix.com • contact@prigenix.com
                  </p>
                </div>
              </div>

              {/* Dynamic Client Logo Image (Uploaded) */}
              {clientLogoUrl ? (
                <div className="flex gap-4 items-center">
                  <div className="text-right">
                    <span className="font-mono text-[8px] text-gray-400 block uppercase tracking-widest">Prepared for</span>
                    <h5 className="font-heading text-xs font-extrabold uppercase text-gray-700 leading-none">
                      {clientName}
                    </h5>
                  </div>
                  <div className="h-14 w-20 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 p-2">
                    <img src={clientLogoUrl} className="h-full w-full object-contain" alt="Client Logo" />
                  </div>
                </div>
              ) : (
                <div className="text-right">
                  <h1 className="font-heading text-base font-extrabold uppercase tracking-wide text-[#0D5B3A] leading-none mb-2">
                    {activeTab === 'quotation' ? 'Project Quotation' : 'NDA Agreement'}
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
              
              {/* QUOTATION TEMPLATE */}
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

                  {/* Line Items Table */}
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
                            <td className="py-3 text-right font-mono text-gray-600">${item.rate.toLocaleString()}</td>
                            <td className="py-3 text-right font-mono text-black font-semibold">
                              ${(item.qty * item.rate).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary / Total Section */}
                  <div className="flex justify-end pt-4">
                    <div className="w-64 space-y-2 border-t border-gray-100 pt-4 print-border">
                      <div className="flex justify-between font-mono text-[10px] text-gray-500">
                        <span>Scope Subtotal:</span>
                        <span>${subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-mono text-[10px] text-gray-500">
                        <span>Provision Tax (0.0%):</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between border-t border-[#0D5B3A] pt-2 font-heading text-sm font-bold text-black print-border">
                        <span>TOTAL PROPOSAL:</span>
                        <span className="text-[#0D5B3A] font-extrabold">${total.toLocaleString()} USD</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes / Terms */}
                  <div className="pt-6 space-y-2 border-t border-gray-100 print-border">
                    <h5 className="font-heading text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      Standard Terms & Provisions
                    </h5>
                    <ul className="list-disc list-inside text-[10px] text-gray-500 space-y-1">
                      <li>Quotations are valid for exactly 30 days from the document date.</li>
                      <li>Payment milestones: 30% initial project kickoff, 40% mid-point milestone, 30% delivery.</li>
                      <li>Any changes in target project requirements will be processed under separate scope addenda.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* NDA AGREEMENT TEMPLATE */}
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

              {/* Dynamic Signature Blocks */}
              <div className="pt-16 grid grid-cols-2 gap-12 border-t border-gray-100 mt-12 print-border">
                <div className="space-y-6">
                  <span className="font-mono text-[9px] text-gray-400 block uppercase">
                    Authorized Representative (Developer)
                  </span>
                  <div className="border-b border-gray-300 w-full h-8 print-border" />
                  <div className="space-y-1">
                    <p className="font-bold text-black">{disclosingParty}</p>
                    <p className="text-gray-500 font-medium">Title: Technical Director</p>
                    <p className="text-gray-400 font-mono text-[9px]">Date: ________________________</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <span className="font-mono text-[9px] text-gray-400 block uppercase">
                    Authorized Representative (Client)
                  </span>
                  <div className="border-b border-gray-300 w-full h-8 print-border" />
                  <div className="space-y-1">
                    <p className="font-bold text-black">{receivingParty}</p>
                    <p className="text-gray-500 font-medium">Title: ________________________</p>
                    <p className="text-gray-400 font-mono text-[9px]">Date: ________________________</p>
                  </div>
                </div>
              </div>

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
