'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
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
    <main className="h-screen w-screen bg-[#0A0A0A] font-sans text-white antialiased flex flex-col p-6 md:p-8 overflow-hidden relative">
      
      {/* Visual background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,91,58,0.08),transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full h-full flex flex-col justify-between overflow-hidden space-y-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0D5B3A]/30 bg-[#060A08] shadow-md">
              <img src="/logo.png" alt="Prigenix Logo" className="h-6 w-6 object-contain" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-extrabold uppercase tracking-widest text-white leading-none">
                Prigenix Studio
              </h1>
              <span className="font-mono text-[8px] uppercase tracking-wider text-accent-cyan block mt-1">
                Public Project Status Monitor
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-[#C8A870] font-bold block leading-none">Guest View</span>
            <span className="font-sans text-[9px] text-gray-500 block mt-1">AWS Neon PostgreSQL Pool</span>
          </div>
        </div>

        {/* Metrics cards grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          <div className="rounded-xl border border-white/5 bg-[#060A08]/50 p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2.5 text-[#0D5B3A]">
              <TrendingUp size={20} />
            </div>
            <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">Pipeline Value</span>
            <h3 className="font-heading text-base font-extrabold mt-1 text-white leading-none">
              ₹{totalPipeline.toLocaleString()}
            </h3>
            <span className="font-mono text-[8px] text-[#C8A870] block mt-1">Approved & Sent Milestones</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#060A08]/50 p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2.5 text-accent-purple">
              <Award size={20} />
            </div>
            <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">Win Rate</span>
            <h3 className="font-heading text-base font-extrabold mt-1 text-white leading-none">
              {winRate}%
            </h3>
            <span className="font-mono text-[8px] text-accent-cyan block mt-1">{approvedQuotesCount} of {totalQuotesCount} approved</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#060A08]/50 p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2.5 text-accent-cyan">
              <Clock size={20} />
            </div>
            <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">Active NDAs</span>
            <h3 className="font-heading text-base font-extrabold mt-1 text-white leading-none">
              {activeNDAs}
            </h3>
            <span className="font-mono text-[8px] text-text-muted block mt-1">Sent or Signed Agreements</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#060A08]/50 p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2.5 text-text-muted">
              <Briefcase size={20} />
            </div>
            <span className="font-mono text-[8px] uppercase tracking-widest text-text-muted">Database Total</span>
            <h3 className="font-heading text-base font-extrabold mt-1 text-white leading-none">
              {totalDocsCount}
            </h3>
            <span className="font-mono text-[8px] text-text-muted block mt-1 font-semibold">Persistent Documents</span>
          </div>
        </div>

        {/* Graphs & charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0 h-44">
          
          {/* Chart 1: Revenue by Client */}
          <div className="rounded-2xl border border-white/5 bg-[#060A08]/65 p-4 flex flex-col justify-between">
            <h3 className="font-heading text-[9px] font-bold uppercase tracking-widest text-[#C8A870]">
              Quotation Revenue by Client
            </h3>
            <div className="h-28 flex items-end justify-between px-4 pb-2 border-b border-white/5 relative">
              {barChartData.map((bar, i) => {
                const pct = Math.max(12, Math.round((bar.amount / maxAmount) * 100))
                return (
                  <div key={i} className="flex flex-col items-center w-12 group relative">
                    <div className="absolute bottom-full mb-1 bg-[#0A0A0A] border border-white/10 rounded-md py-0.5 px-1.5 font-mono text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
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
                  No records found in database.
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Status Distribution */}
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
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-mono text-[8px] uppercase font-bold ${
                        doc.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        doc.status === 'Sent' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        doc.status === 'Declined' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Document */}
                        <a
                          href={`/document?id=${doc.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded bg-white/5 border border-white/5 hover:border-accent-cyan/30 text-accent-cyan transition-all cursor-pointer block"
                          title="View Document"
                        >
                          <Printer size={11} />
                        </a>

                        {/* Copy Share Link */}
                        <button
                          type="button"
                          onClick={() => copyShareLink(doc.id)}
                          className="p-1 rounded bg-white/5 border border-white/5 hover:border-accent-purple/30 text-accent-purple transition-all cursor-pointer"
                          title="Copy Share Link"
                        >
                          <Link2 size={11} />
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

      </div>
    </main>
  )
}
