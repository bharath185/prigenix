'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  FileSignature, 
  Printer, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Clock, 
  Briefcase, 
  Link2,
  Building
} from 'lucide-react'

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
}

export default function PublicDashboardPage() {
  const [documents, setDocuments] = useState<DocRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch documents from Neon PostgreSQL
  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDocuments(data)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load database documents:', err)
        setLoading(false)
      })
  }, [])

  // Copy Public Share Link to Clipboard
  const copyShareLink = (id: string) => {
    const origin = window.location.origin
    const shareUrl = `${origin}/document?id=${id}`
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert(`Secure public link copied to clipboard:\n${shareUrl}`))
      .catch(err => console.error('Failed to copy link:', err))
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

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0A0A0A] font-sans text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-accent-cyan" />
        <span className="mt-4 font-mono text-xs text-text-muted">Loading visual dashboard...</span>
      </div>
    )
  }

  return (
    <main className="min-h-screen w-full bg-[#0A0A0A] font-sans text-white antialiased flex flex-col p-8 md:p-12">
      
      {/* Visual background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,91,58,0.1),transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#0D5B3A]/30 bg-[#060A08] shadow-md">
              <img src="/logo.png" alt="Prigenix Logo" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-extrabold uppercase tracking-widest text-white leading-none">
                Prigenix Studio
              </h1>
              <span className="font-mono text-[9px] uppercase tracking-wider text-accent-cyan block mt-1">
                Public Project Status Monitor
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-[#C8A870] font-bold block">Guest View</span>
            <span className="font-sans text-[10px] text-gray-500 block">Real-time Neon Database Sync</span>
          </div>
        </div>

        {/* Metrics cards grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-[#0D5B3A]">
              <TrendingUp size={24} />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">Pipeline Value</span>
            <h3 className="font-heading text-lg font-extrabold mt-2 text-white">
              ₹{totalPipeline.toLocaleString()}
            </h3>
            <span className="font-mono text-[9px] text-[#C8A870] block mt-1 font-semibold">Approved & Sent Milestones</span>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-accent-purple">
              <Award size={24} />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">Win Rate</span>
            <h3 className="font-heading text-lg font-extrabold mt-2 text-white">
              {winRate}%
            </h3>
            <span className="font-mono text-[9px] text-accent-cyan block mt-1">{approvedQuotesCount} of {totalQuotesCount} approved</span>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-accent-cyan">
              <Clock size={24} />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">Active NDAs</span>
            <h3 className="font-heading text-lg font-extrabold mt-2 text-white">
              {activeNDAs}
            </h3>
            <span className="font-mono text-[9px] text-text-muted block mt-1">Sent or Signed Agreements</span>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#060A08]/50 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-text-muted">
              <Briefcase size={24} />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">Database Total</span>
            <h3 className="font-heading text-lg font-extrabold mt-2 text-white">
              {totalDocsCount}
            </h3>
            <span className="font-mono text-[9px] text-text-muted block mt-1">Persistent Documents</span>
          </div>
        </div>

        {/* Graphs & charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Revenue by Client */}
          <div className="rounded-3xl border border-white/5 bg-[#060A08]/65 p-6 shadow-2xl">
            <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-[#C8A870] mb-6">
              Quotation Revenue by Client
            </h3>
            <div className="h-56 flex items-end justify-between px-4 pb-6 border-b border-white/5 relative">
              {barChartData.map((bar, i) => {
                const pct = Math.max(12, Math.round((bar.amount / maxAmount) * 100))
                return (
                  <div key={i} className="flex flex-col items-center w-12 group relative">
                    <div className="absolute bottom-full mb-2 bg-[#0A0A0A] border border-white/10 rounded-md py-1 px-2 font-mono text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                      ₹{(bar.amount).toLocaleString()}
                    </div>
                    <div 
                      style={{ height: `${pct}%` }} 
                      className="w-8 rounded-t-lg bg-gradient-to-t from-accent-purple to-accent-cyan shadow-[0_0_15px_rgba(139,92,246,0.35)] group-hover:brightness-110 transition-all duration-500"
                    />
                    <span className="font-mono text-[9px] text-text-muted mt-2 truncate w-14 text-center">
                      {bar.name}
                    </span>
                  </div>
                )
              })}
              {barChartData.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center font-sans text-xs text-text-muted">
                  No records found in database.
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Status Distribution */}
          <div className="rounded-3xl border border-white/5 bg-[#060A08]/65 p-6 shadow-2xl flex flex-col justify-between">
            <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-[#C8A870] mb-4">
              Document Status Distribution
            </h3>
            <div className="flex flex-row items-center justify-around gap-4 flex-1">
              <div className="relative h-32 w-32 shrink-0">
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
                          className="transition-all duration-1000"
                        />
                      )
                    })
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                  <span className="font-heading text-lg font-extrabold text-white">{totalDocsCount}</span>
                  <span className="font-mono text-[8px] text-text-muted uppercase mt-0.5">Docs</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-[9px] text-white">
                  <div className="h-2 w-2 rounded-full bg-[#10B981]" />
                  <span>Approved: <strong className="text-white">{statusCounts.Approved}</strong></span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-white">
                  <div className="h-2 w-2 rounded-full bg-[#06B6D4]" />
                  <span>Sent: <strong className="text-white">{statusCounts.Sent}</strong></span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-white">
                  <div className="h-2 w-2 rounded-full bg-[#FFC107]" />
                  <span>Draft: <strong className="text-white">{statusCounts.Draft}</strong></span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-white">
                  <div className="h-2 w-2 rounded-full bg-[#EF4444]" />
                  <span>Declined: <strong className="text-white">{statusCounts.Declined}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document list table */}
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
                    <span className="font-mono text-[9px] uppercase tracking-wider block text-[#C8A870]">
                      {doc.type}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-bold">{doc.clientName}</td>
                  <td className="py-4 px-5 text-text-muted truncate max-w-[176px]" title={doc.subject}>
                    {doc.subject}
                  </td>
                  <td className="py-4 px-5 text-right font-mono text-[#C8A870] font-bold">
                    {doc.total ? `₹${doc.total.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[9px] uppercase font-bold ${
                      doc.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      doc.status === 'Sent' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      doc.status === 'Declined' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <div className="flex items-center justify-center gap-2.5">
                      {/* View Document */}
                      <a
                        href={`/document?id=${doc.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded bg-white/5 border border-white/5 hover:border-accent-cyan/30 text-accent-cyan transition-all cursor-pointer block"
                        title="View Document"
                      >
                        <Printer size={13} />
                      </a>

                      {/* Copy Share Link */}
                      <button
                        type="button"
                        onClick={() => copyShareLink(doc.id)}
                        className="p-1.5 rounded bg-white/5 border border-white/5 hover:border-accent-purple/30 text-accent-purple transition-all cursor-pointer"
                        title="Copy Share Link"
                      >
                        <Link2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-text-muted font-mono text-xs">
                    No documents recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  )
}
