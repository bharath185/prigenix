'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Printer, AlertCircle, FileText, FileSignature, CheckCircle2 } from 'lucide-react'

// Simple wrapper to run searchParams inside Suspense context
function DocumentViewerContent() {
  const searchParams = useSearchParams()
  const docId = searchParams.get('id')

  const [document, setDocument] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!docId) {
      setError('Missing Document ID parameter')
      setLoading(false)
      return
    }

    fetch(`/api/documents?id=${docId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Document not found in database')
        }
        return res.json()
      })
      .then((data) => {
        setDocument(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [docId])

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0A0A0A] font-sans text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-accent-cyan" />
        <span className="mt-4 font-mono text-xs text-text-muted">Loading secure document...</span>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0A0A0A] font-sans text-white px-4">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 max-w-md text-center space-y-4">
          <AlertCircle className="mx-auto text-red-400" size={40} />
          <h2 className="font-heading text-lg font-bold">Document Error</h2>
          <p className="font-sans text-sm text-gray-400">{error || 'An unexpected error occurred.'}</p>
        </div>
      </div>
    )
  }

  // Parse document JSON payload if present
  let content: any = {}
  try {
    if (document.content) {
      content = JSON.parse(document.content)
    }
  } catch (e) {
    console.error('Error parsing document content payload:', e)
  }

  return (
    <div className="min-h-screen w-full bg-[#121212] font-sans text-black flex flex-col items-center py-12 px-4 print:bg-white print:p-0">
      
      {/* Print Style Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body, main, div {
            background: white !important;
            color: black !important;
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
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}} />

      {/* Dynamic Floating Action Button */}
      <div className="no-print mb-6 flex gap-4 w-full max-w-[210mm] justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 shadow-sm">
            <img src="/logo.png" alt="Prigenix" className="h-5 w-5 object-contain" />
          </div>
          <div>
            <span className="font-heading text-xs font-extrabold uppercase tracking-wider block leading-none">Prigenix Document</span>
            <span className="font-mono text-[9px] text-accent-cyan uppercase">Secure Shared Link</span>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan font-heading text-xs font-bold uppercase tracking-wider text-white shadow-md hover:brightness-110 active:scale-98 transition-all cursor-pointer"
        >
          <Printer size={14} />
          Print / Save PDF
        </button>
      </div>

      {/* Main A4 sheet */}
      <div className="print-area w-[210mm] min-h-[297mm] bg-white text-black p-12 shadow-2xl border border-gray-100 flex flex-col justify-between print:border-none print:shadow-none print:w-full print:p-0 print:min-h-0 print:h-auto">
        <div>
          
          {/* Header Block (Logos Only) */}
          <header className="flex items-center justify-between border-b-2 border-[#0D5B3A] pb-6 mb-8 print:border-b-2">
            {/* Left: Prigenix logo */}
            <div className="h-24 w-24 flex items-center justify-center bg-transparent border-none p-0 shrink-0">
              <img src="/logo.png" alt="Prigenix Logo" className="h-full w-full object-contain" />
            </div>

            {/* Center: Document metadata */}
            <div className="text-center mx-auto">
              <h1 className="font-heading text-sm font-extrabold uppercase tracking-widest text-[#0D5B3A] leading-none mb-1.5">
                {document.type === 'Quotation' && 'Quotation'}
                {document.type === 'NDA' && 'Mutual NDA Agreement'}
                {document.type === 'Service Agreement' && 'Service Level Agreement'}
                {document.type === 'Kickoff Requirement' && 'Kickoff Requirements Specification'}
                {document.type === 'Techstack' && 'Technology Stack Specifications'}
              </h1>
              <div className="flex gap-4 justify-center font-mono text-[9px] text-gray-500">
                <span>ID: <span className="text-black font-semibold">{document.id}</span></span>
                <span>•</span>
                <span>Date: <span className="text-black font-semibold">{document.date}</span></span>
              </div>
            </div>

            {/* Right: Client logo if uploaded */}
            {document.clientLogo ? (
              <div className="h-24 w-32 flex items-center justify-center bg-transparent border-none p-0 shrink-0">
                <img src={document.clientLogo} className="h-full w-full object-contain" alt="Client Logo" />
              </div>
            ) : (
              <div className="w-24 h-24 flex items-center justify-end font-heading text-[10px] font-extrabold uppercase tracking-wider text-gray-400 text-right shrink-0 leading-tight">
                {document.clientName.split(' ')[0]}
              </div>
            )}
          </header>

          {/* Render Area */}
          <div className="font-sans text-xs leading-relaxed text-gray-800 select-text">
            
            {/* TYPE 1: QUOTATION */}
            {document.type === 'Quotation' && (
              <div className="space-y-6">
                <div>
                  <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2">Prepared For</h5>
                  <p className="font-bold text-sm text-black">{document.clientName}</p>
                  <p className="text-gray-500 font-medium">{content.clientAddress || 'Headquarters Office'}</p>
                </div>

                <div>
                  <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2">Project: <span className="text-black font-bold capitalize">{document.subject}</span></h5>
                  <p className="text-gray-600 italic bg-gray-50 p-4 border-l-2 border-[#0D5B3A] rounded-r-md">
                    "{content.projectDescription || 'No description provided.'}"
                  </p>
                </div>

                <div>
                  <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-3">Scope Cost Allocation</h5>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#0D5B3A] font-heading text-[10px] uppercase tracking-wider text-gray-500">
                        <th className="py-2.5 font-bold">Scope Module</th>
                        <th className="py-2.5 text-center font-bold w-20">Qty/Hours</th>
                        <th className="py-2.5 text-right font-bold w-24">Rate</th>
                        <th className="py-2.5 text-right font-bold w-28">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(content.quoteItems || []).map((item: any, i: number) => (
                        <tr key={i} className="border-b border-gray-100">
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
                  <div className="w-64 space-y-2 border-t border-gray-100 pt-4">
                    <div className="flex justify-between font-mono text-[10px] text-gray-500">
                      <span>Scope Subtotal:</span>
                      <span>₹{(document.total || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-gray-500">
                      <span>Provision Tax (0%):</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="flex justify-between border-t border-[#0D5B3A] pt-2 font-heading text-sm font-bold text-black">
                      <span>TOTAL PROPOSAL:</span>
                      <span className="text-[#0D5B3A] font-extrabold">₹{(document.total || 0).toLocaleString()} INR</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 space-y-2 border-t border-gray-100">
                  <h5 className="font-heading text-[9px] font-bold uppercase tracking-wider text-gray-400">Standard Terms & Provisions</h5>
                  <ul className="list-disc list-inside text-[10px] text-gray-500 space-y-1">
                    {(content.termsProvisions || 'Quotations are valid for exactly 30 days from the document date.\nPayment milestones: 30% initial project kickoff, 40% mid-point milestone, 30% delivery.').split('\n').map((term: string, i: number) => (
                      <li key={i}>{term}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TYPE 2: NDA */}
            {document.type === 'NDA' && (
              <div className="space-y-6">
                <h2 className="text-center font-heading text-sm font-bold uppercase tracking-widest text-[#0D5B3A] mb-4">
                  MUTUAL NON-DISCLOSURE AGREEMENT
                </h2>

                <p className="text-justify leading-relaxed">
                  This Mutual Non-Disclosure Agreement (the "Agreement") is entered into and made effective as of 
                  <strong> {content.effectiveDate || document.date}</strong> (the "Effective Date"), by and between 
                  <strong> {content.disclosingParty || 'Prigenix'}</strong>, with principal operations listed under Prigenix 
                  ("Disclosing Party"), and <strong> {content.receivingParty || document.clientName}</strong>, with offices listed at {document.clientName} 
                  ("Receiving Party"). The Disclosing Party and Receiving Party may collectively be referred to as 
                  the "Parties" or individually as a "Party."
                </p>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <h6 className="font-heading text-[10px] font-bold text-black uppercase">1. Purpose & Protected Disclosures</h6>
                    <p className="text-justify text-gray-600">
                      The Parties wish to evaluate a potential business opportunity or transaction relating to: 
                      <strong className="text-black"> {document.subject}</strong>. In connection with this evaluation, 
                      Parties may share proprietary technology specifications, business processes, and software codes 
                      ("Confidential Information").
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h6 className="font-heading text-[10px] font-bold text-black uppercase">2. Nondisclosure Obligations</h6>
                    <p className="text-justify text-gray-600">
                      The Receiving Party shall hold the Confidential Information in strict trust and confidence. The 
                      Receiving Party shall not reproduce, copy, duplicate, or disclose any Confidential Information 
                      to third parties without the prior written consent of the Disclosing Party, except to personnel 
                      who have a direct need-to-know to achieve the Purpose.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h6 className="font-heading text-[10px] font-bold text-black uppercase">3. Agreement Duration & Term</h6>
                    <p className="text-justify text-gray-600">
                      This Agreement's disclosure period begins on the Effective Date. The obligation of 
                      confidentiality shall survive for a period of three (3) years from the date of initial 
                      disclosure, or until the Confidential Information no longer constitutes a proprietary business 
                      trade secret.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h6 className="font-heading text-[10px] font-bold text-black uppercase">4. Jurisdiction & Governing Law</h6>
                    <p className="text-justify text-gray-600">
                      This Agreement shall be governed, interpreted, and construed in accordance with the laws of 
                      <strong> {content.governingLaw || 'State of California'}</strong>, without regard to its conflict of law principles. Any dispute 
                      shall be resolved in courts within the governing jurisdiction.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 3: SERVICE AGREEMENT */}
            {document.type === 'Service Agreement' && (
              <div className="space-y-6">
                <div>
                  <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2">Service Client</h5>
                  <p className="font-bold text-sm text-black">{document.clientName}</p>
                  <p className="text-gray-500 font-medium">{content.clientAddress || 'Headquarters Office'}</p>
                </div>

                <div>
                  <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2">Scope of Services</h5>
                  <p className="text-gray-600 italic bg-gray-50 p-4 border-l-2 border-[#0D5B3A] rounded-r-md">
                    "{document.subject}"
                  </p>
                </div>

                <div>
                  <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-3">Service Payment Milestones</h5>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#0D5B3A] font-heading text-[10px] uppercase tracking-wider text-gray-500">
                        <th className="py-2.5 font-bold">Milestone Description</th>
                        <th className="py-2.5 text-center font-bold w-24">Percentage</th>
                        <th className="py-2.5 text-right font-bold w-32">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(content.milestones || []).map((ms: any, i: number) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-3 font-semibold text-black">{ms.title}</td>
                          <td className="py-3 text-center font-mono text-gray-600">{ms.percentage}%</td>
                          <td className="py-3 text-right font-mono text-black font-semibold">
                            ₹{Number(ms.amount).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end pt-4">
                  <div className="w-64 space-y-2 border-t border-gray-100 pt-4">
                    <div className="flex justify-between border-t border-[#0D5B3A] pt-2 font-heading text-sm font-bold text-black">
                      <span>TOTAL BUDGET:</span>
                      <span className="text-[#0D5B3A] font-extrabold">₹{(document.total || 0).toLocaleString()} INR</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 space-y-2 border-t border-gray-100">
                  <h5 className="font-heading text-[9px] font-bold uppercase tracking-wider text-gray-400">Standard Terms & Provisions</h5>
                  <ul className="list-disc list-inside text-[10px] text-gray-500 space-y-1 mb-3">
                    {(content.termsProvisions || 'This Service Level Agreement shall be governed under the laws of the State of California.').split('\n').map((term: string, i: number) => (
                      <li key={i}>{term}</li>
                    ))}
                  </ul>
                  <p className="text-[9px] text-gray-500 leading-tight">
                    Under no circumstances shall either party be liable to the other for indirect, special, or consequential damages.
                  </p>
                </div>
              </div>
            )}

            {/* TYPE 4: KICKOFF REQUIREMENT */}
            {document.type === 'Kickoff Requirement' && (
              <div className="space-y-6">
                <div>
                  <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2">Project Client</h5>
                  <p className="font-bold text-sm text-black">{document.clientName}</p>
                </div>

                <div>
                  <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2">Core Objective</h5>
                  <p className="text-gray-600 italic bg-gray-50 p-4 border-l-2 border-[#0D5B3A] rounded-r-md">
                    "{document.subject}"
                  </p>
                </div>

                {/* Requirements Checklist */}
                <div>
                  <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-3">Requirement Checklist</h5>
                  <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {(content.checklist || []).map((item: any, i: number) => (
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

                {/* Sprints Timeline */}
                <div>
                  <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-3">Project Sprint Timeline</h5>
                  <div className="grid grid-cols-5 gap-3 border border-gray-100 rounded-xl p-4 bg-gray-50 text-center">
                    <div>
                      <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Kickoff</span>
                      <span className="text-[10px] font-bold text-black block mt-1">{content.sprintKickoff || 'Week 1'}</span>
                    </div>
                    <div>
                      <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Design</span>
                      <span className="text-[10px] font-bold text-black block mt-1">{content.sprintDesign || 'Week 2'}</span>
                    </div>
                    <div>
                      <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Dev</span>
                      <span className="text-[10px] font-bold text-black block mt-1">{content.sprintDev || 'Week 3-6'}</span>
                    </div>
                    <div>
                      <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Test</span>
                      <span className="text-[10px] font-bold text-black block mt-1">{content.sprintTest || 'Week 7'}</span>
                    </div>
                    <div>
                      <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Launch</span>
                      <span className="text-[10px] font-bold text-black block mt-1">{content.sprintLaunch || 'Week 8'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 5: TECHSTACK */}
            {document.type === 'Techstack' && (
              <div className="space-y-6">
                <div>
                  <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2">Project Client</h5>
                  <p className="font-bold text-sm text-black">{document.clientName}</p>
                </div>

                <div>
                  <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-2">Target Architecture</h5>
                  <p className="text-gray-600 italic bg-gray-50 p-4 border-l-2 border-[#0D5B3A] rounded-r-md">
                    "{document.subject}"
                  </p>
                </div>

                {/* Techstack allocation grid */}
                <div>
                  <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-[#C8A870] mb-3">Core Technologies List</h5>
                  <div className="grid grid-cols-2 gap-4 border border-gray-100 rounded-xl p-4 bg-gray-50">
                    <div>
                      <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Client Layer</span>
                      <span className="text-xs font-bold text-black block mt-0.5">{content.stackClient || 'Next.js / TypeScript'}</span>
                    </div>
                    <div>
                      <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Server Layer</span>
                      <span className="text-xs font-bold text-black block mt-0.5">{content.stackServer || 'Next.js API Routes'}</span>
                    </div>
                    <div>
                      <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Database Storage</span>
                      <span className="text-xs font-bold text-black block mt-0.5">{content.stackDb || 'Neon Serverless PostgreSQL'}</span>
                    </div>
                    <div>
                      <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Hosting & CDN</span>
                      <span className="text-xs font-bold text-black block mt-0.5">{content.stackHost || 'Vercel Edge Platform'}</span>
                    </div>
                    <div>
                      <span className="font-heading text-[9px] text-[#C8A870] uppercase block">AI Model/LLM</span>
                      <span className="text-xs font-bold text-black block mt-0.5">{content.stackAi || 'Google Gemini Pro / Claude 3.5'}</span>
                    </div>
                    <div>
                      <span className="font-heading text-[9px] text-[#C8A870] uppercase block">Authentication</span>
                      <span className="text-xs font-bold text-black block mt-0.5">{content.stackAuth || 'NextAuth / Credentials'}</span>
                    </div>
                  </div>
                </div>

                {/* Architect Details */}
                <div className="pt-4 border-t border-gray-100">
                  <h5 className="font-heading text-[9px] font-bold uppercase tracking-wider text-gray-400">Architectural Decisions Summary</h5>
                  <p className="text-[10px] text-gray-500 leading-relaxed mt-2 text-justify">
                    This selection of technology modules has been optimized for scalability, sub-second latency via edge deployments, secure data encryption-at-rest under SSL requirements, and modular code encapsulation.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Branded Footer */}
        <footer className="border-t border-gray-100 pt-4 flex items-center justify-between text-gray-400 font-mono text-[8px] tracking-wider uppercase mt-12">
          <span>Prigenix</span>
          <span>Confidential & Proprietary Document</span>
        </footer>
      </div>

    </div>
  )
}

export default function DocumentViewerPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen w-full items-center justify-center bg-[#0A0A0A] font-sans text-white">
        <span className="font-mono text-xs text-text-muted">Loading secure workspace...</span>
      </div>
    }>
      <DocumentViewerContent />
    </Suspense>
  )
}
