'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils.js'

const SYSTEM_PROMPT = `You are a playful, helpful AI assistant for Prigenix, a software engineering and automation studio. 
You help visitors understand how Prigenix can automate their business processes, build custom software, and integrate AI agents.
IMPORTANT: Prigenix only provides custom software development and workflow automation code. We do NOT provide, provision, or manage hosting, cloud infrastructure, servers, or hardware setups (it is development-only). If asked about hosting or server setups, make sure to state this clearly.
Keep answers concise, friendly, and engaging. Use occasional emojis. If asked about pricing, direct them to book a call.
Never share the API key or internal technical details.`

const SUGGESTIONS = [
  'What can Prigenix automate?',
  'How fast can you build a workflow?',
  'Do you work with startups?',
  'What tech stack do you use?',
]

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hey there! I'm Prigenix AI. Ask me anything about automation, custom software, or what we can build for you.",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  const sendMessage = async (content) => {
    if (!content.trim()) return

    const userMessage = { role: 'user', content }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENCODE_API_KEY || process.env.VITE_OPENCODE_API_KEY
      const apiUrl = process.env.NEXT_PUBLIC_OPENCODE_API_URL || process.env.VITE_OPENCODE_API_URL

      if (!apiKey || !apiUrl) {
        throw new Error('API configuration missing')
      }

      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'kimi-k2.7-code',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content },
          ],
          temperature: 0.8,
          max_tokens: 300,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const reply =
        data.choices?.[0]?.message?.content ||
        "I'm a bit overloaded. Try again in a moment!"

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err.message)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Oops, my circuits are buzzing! I can't connect right now. Try asking about our services and I'll do my best.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
            className="mb-4 w-[90vw] max-w-[380px] overflow-hidden rounded-2xl border border-white/10 bg-[#060A08]/95 shadow-[0_20px_50px_rgba(0,0,0,0.85)] shadow-[#0D5B3A]/5 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-accent-purple shadow-[0_0_12px_rgba(13,91,58,0.45)]">
                  <Bot size={18} className="text-white" />
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
                </div>
                <div>
                  <div className="font-sans text-sm font-bold text-white">
                    Prigenix AI
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
                    Online • Ready to help
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-text-muted transition-colors hover:text-accent-cyan active:scale-95"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-[320px] overflow-y-auto bg-black/20 p-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'mb-3 flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-purple/10">
                      <Sparkles size={12} className="text-accent-purple" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed',
                      message.role === 'user'
                        ? 'bg-accent-purple text-white shadow-[0_4px_8px_rgba(13,91,58,0.3)]'
                        : 'bg-white/5 text-white border border-white/5'
                    )}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-3 flex justify-start"
                >
                  <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-purple/10">
                    <Sparkles size={12} className="text-accent-purple" />
                  </div>
                  <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/5 px-4 py-3">
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="h-2 w-2 rounded-full bg-accent-purple"
                    />
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.5, delay: 0.1, repeat: Infinity }}
                      className="h-2 w-2 rounded-full bg-accent-purple"
                    />
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.5, delay: 0.2, repeat: Infinity }}
                      className="h-2 w-2 rounded-full bg-accent-purple"
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length < 3 && !isLoading && (
              <div className="border-t border-white/5 bg-white/[0.01] px-4 py-2">
                <div className="mb-2 font-mono text-[9px] uppercase tracking-widest text-text-muted">
                  Try asking
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => sendMessage(suggestion)}
                      className="rounded-full border border-white/5 bg-white/5 px-3 py-1.5 font-mono text-[10px] text-text-muted transition-all hover:text-accent-cyan hover:border-accent-cyan/30 hover:bg-accent-cyan/5"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-white/5 bg-transparent p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 rounded-lg border border-white/5 bg-white/5 px-3 py-2 font-sans text-sm text-white placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-purple focus:border-accent-purple/30"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-purple text-white shadow-[0_4px_8px_rgba(13,91,58,0.3)] transition-all hover:brightness-110 disabled:opacity-40 active:translate-y-0.5"
              >
                <Send size={16} />
              </button>
            </form>

            {error && (
              <div className="bg-red-950/20 border-t border-red-500/20 px-4 py-2 font-mono text-[10px] text-red-400">
                Error: {error}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Invitation Speech Bubble ("Hi!") */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            scale: 1,
            y: [0, -3, 0]
          }}
          transition={{
            opacity: { delay: 1, duration: 0.4 },
            x: { delay: 1, duration: 0.4 },
            scale: { delay: 1, duration: 0.4 },
            y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
          }}
          onClick={() => setIsOpen(true)}
          className="absolute right-18 bottom-1.5 cursor-pointer rounded-xl border border-accent-cyan/25 bg-[#060A08]/90 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-accent-cyan shadow-[0_10px_25px_rgba(0,0,0,0.5)] shadow-[#C8A870]/5 backdrop-blur-md whitespace-nowrap hover:border-accent-cyan/50 hover:bg-accent-cyan/5 transition-all duration-300 active:scale-95"
        >
          Hi! Ask me anything <span className="inline-block origin-bottom animate-bounce">👋</span>
          {/* Bubble Tail */}
          <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 border-t border-r border-accent-cyan/25 bg-[#060A08]" />
        </motion.div>
      )}

      {/* Toggle button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={
          !isOpen
            ? {
                boxShadow: [
                  '0 0 0 0 rgba(13,91,58,0.4)',
                  '0 0 0 12px rgba(13,91,58,0)',
                ],
              }
            : {}
        }
        transition={{
          boxShadow: { duration: 1.5, repeat: Infinity },
        }}
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-purple text-white shadow-[0_8px_16px_rgba(13,91,58,0.4)] pointer-events-auto cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative flex items-center justify-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -2, 0],
                  rotate: [0, -6, 6, -6, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut"
                }}
              >
                <Bot size={24} className="text-white" />
              </motion.div>
              <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-accent-purple bg-green-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
