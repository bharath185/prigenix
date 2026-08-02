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
  AlertCircle 
} from 'lucide-react'

// Simple client-side auth credentials
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'prigenix-admin-2026'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<'quotation' | 'nda'>('quotation')

  // Load auth state from localStorage
  useEffect(() => {
    const session = localStorage.getItem('prigenix_admin_auth')
    if (session === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  // Handle Login Action
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem('prigenix_admin_auth', 'true')
      setIsLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid administrator credentials')
    }
  }

  // Handle Logout Action
  const handleLogout = () => {
    localStorage.removeItem('prigenix_admin_auth')
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
  }

  // Document states
  const [clientName, setClientName] = useState('Acme Corporation')
  const [clientAddress, setClientAddress] = useState('123 Enterprise St, Seattle, WA 98101')
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0])
  const [docId, setDocId] = useState('PRX-2026-0042')

  // Quotation Specific States
  const [projectName, setProjectName] = useState('Autonomous AI Customer Agent Integration')
  const [projectDescription, setProjectDescription] = useState('Design, engineering, and integration of a custom LLM reasoning agent equipped with retrieval-augmented generation (RAG) to handle tier-1 support operations.')
  const [quoteItems, setQuoteItems] = useState([
    { id: 1, title: 'AI Reasoning Architecture & Design', qty: 1, rate: 8500 },
    { id: 2, title: 'Custom RAG Knowledge Ingestion Pipelines', qty: 1, rate: 12000 },
    { id: 3, title: 'Next.js Client Web Chat Overlay', qty: 1, rate: 6500 },
  ])

  // NDA Specific States
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0])
  const [governingLaw, setGoverningLaw] = useState('State of Washington')
  const [disclosingParty, setDisclosingParty] = useState('Prigenix Studio')
  const [receivingParty, setReceivingParty] = useState('Acme Corporation')
  const [ndaPurpose, setNdaPurpose] = useState('Evaluating a potential custom software development collaboration and AI integration strategy.')

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
  const total = subtotal // 0% tax, simple developer pricing

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
              Admin Document Portal
            </span>
          </div>

          {/* Login Card */}
          <form 
            onSubmit={handleLogin}
            className="rounded-3xl border border-[#C8A870]/25 bg-[#060A08]/85 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] shadow-[#C8A870]/5 backdrop-blur-2xl"
          >
            <h2 className="mb-6 font-heading text-lg font-bold text-white">
              Administrator Login
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
                    placeholder="Enter username"
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
              Sign In
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full bg-[#0A0A0A] font-sans text-white antialiased flex flex-col md:flex-row print:bg-white print:text-black print:min-h-0">
      
      {/* 1. Print Styles Overrides Injector */}
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
          /* High contrast for printing */
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

      {/* 2. Admin Control Panel Sidebar (no-print) */}
      <section className="no-print w-full md:w-80 shrink-0 bg-[#060A08] border-r border-white/5 flex flex-col justify-between py-6 px-6">
        <div>
          {/* Brand header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0D5B3A]/30 bg-[#0A0A0A] shadow-md">
              <img src="/logo.png" alt="Prigenix" className="h-6 w-6 object-contain" />
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

          {/* Navigation tab triggers */}
          <div className="space-y-1.5">
            <button
              onClick={() => setActiveTab('quotation')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'quotation' 
                  ? 'bg-[#0D5B3A] text-white border border-[#0D5B3A]/30' 
                  : 'text-text-muted hover:bg-white/5'
              }`}
            >
              <FileText size={16} />
              Quotation Generator
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

        {/* User control footer */}
        <div className="border-t border-white/5 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-cyan font-mono text-xs">
                AD
              </div>
              <div>
                <span className="font-sans text-xs font-bold block text-white">Administrator</span>
                <span className="font-mono text-[9px] text-text-muted">Status: Active</span>
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

      {/* 3. Document Configuration Form Panel (no-print) */}
      <section className="no-print flex-1 max-h-screen overflow-y-auto px-6 py-8 border-r border-white/5">
        <div className="max-w-xl">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-white mb-6 uppercase">
            {activeTab === 'quotation' ? 'Quotation Specifications' : 'NDA Agreement Settings'}
          </h2>

          <div className="space-y-6">
            
            {/* Common Document Metadata */}
            <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
              <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                Document Metadata
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

            {/* Form Fields: Quotation */}
            {activeTab === 'quotation' && (
              <>
                {/* Client Information */}
                <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                  <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                    Client Information
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] text-text-muted">Client Corporate Name</label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] text-text-muted">Client Headquarters Address</label>
                      <textarea
                        value={clientAddress}
                        onChange={(e) => setClientAddress(e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 font-sans text-xs text-white focus:border-accent-cyan/55 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Scope Description */}
                <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                  <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                    Scope Description
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

                {/* Line Items Builder */}
                <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-[10px] font-bold uppercase tracking-widest text-[#C8A870]">
                      Pricing & Scope Deliverables
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
                            placeholder="Module / Scope description"
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
                      <label className="font-mono text-[10px] text-text-muted">Scope & Purpose of Disclosure</label>
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

            {/* Print Action Trigger */}
            <button
              type="button"
              onClick={triggerPrint}
              className="w-full flex items-center justify-center gap-2 cursor-pointer rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan py-4 font-heading text-sm font-extrabold uppercase tracking-widest text-white shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:brightness-110 transition-all active:scale-98"
            >
              <Printer size={18} />
              Print / Save PDF Letterhead
            </button>

          </div>
        </div>
      </section>

      {/* 4. Document Live Preview Panel (print-area) */}
      <section className="print-area flex-1 bg-[#121212] px-4 py-8 overflow-y-auto flex justify-center items-start print:bg-white print:p-0 print:overflow-visible">
        
        {/* Virtual A4 Sheet Container */}
        <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-gray-100 flex flex-col justify-between print:border-none print:shadow-none print:w-full print:p-0 print:min-h-0 print:h-auto">
          <div>
            
            {/* Branded Letterhead Header */}
            <header className="flex items-start justify-between border-b-2 border-[#0D5B3A] pb-6 mb-8 print:border-b-2">
              <div className="flex gap-4 items-center">
                {/* Logo Image */}
                <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 p-2.5">
                  <img src="/logo.png" alt="Prigenix" className="h-full w-full object-contain" />
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

              <div className="text-right">
                <h1 className="font-heading text-lg font-bold uppercase tracking-wide text-[#0D5B3A] leading-none mb-2">
                  {activeTab === 'quotation' ? 'Project Quotation' : 'NDA Agreement'}
                </h1>
                <p className="font-mono text-[10px] text-gray-500">
                  ID: <span className="text-black font-semibold">{docId}</span>
                </p>
                <p className="font-mono text-[10px] text-gray-500">
                  Date: <span className="text-black font-semibold">{docDate}</span>
                </p>
              </div>
            </header>

            {/* Document Content */}
            <div className="font-sans text-xs leading-relaxed text-gray-800 print-text-dark select-text">
              
              {/* QUOTATION TEMPLATE */}
              {activeTab === 'quotation' && (
                <div className="space-y-6">
                  {/* Parties & Overview */}
                  <div>
                    <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2 print-text-muted">
                      Prepared For
                    </h5>
                    <p className="font-bold text-sm text-black">{clientName}</p>
                    <p className="text-gray-500 font-medium">{clientAddress}</p>
                  </div>

                  <div>
                    <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2 print-text-muted">
                      Project Target: <span className="text-black capitalize font-bold">{projectName}</span>
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
