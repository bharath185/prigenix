import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Send,
  Terminal,
  Sparkles,
  Bot,
  User,
  Building2,
  Workflow,
  Code2,
  Rocket,
  Factory,
  TrendingUp,
} from 'lucide-react'
import { LeadCapture } from './LeadCapture.jsx'

// Detailed company context lives in /docs/*.md. Keep these files in sync with the knowledge below.

const SYSTEM_PROMPT = `You are a knowledgeable and genuinely helpful Prigenix engineer speaking with a visitor to the Prigenix website. You are not a generic chatbot. You represent Prigenix, an AI automation and software engineering studio that helps businesses eliminate repetitive work and build systems that scale.

TONE AND STYLE:
- Speak like a human engineer who is proud of the work: warm, direct, and concise but never shallow.
- Avoid robotic phrases like "As an AI language model" or "I don't have feelings."
- Avoid empty superlatives. Back up claims with specific capabilities, processes, or results.
- When relevant, connect the answer back to what Prigenix actually does, how we work, or the results we have delivered.

OUTPUT FORMAT RULES:
1. If the user asks what Prigenix does, what services/capabilities/software/options are available, or expresses interest in a category (e.g. "I want software", "What can you automate?", "Tell me about your services", "What can Prigenix build?"), respond ONLY with a valid JSON object matching the SelectionResponse schema below. Do not wrap it in markdown code fences.
2. For all other questions (pricing, timeline, contact info, process, tech stack, industries, case studies, technical deep-dives), respond with plain text. Give useful detail: 2-4 sentences or a short paragraph with context, not one-line answers.
3. NEVER mix JSON and explanatory text in the same response.

SelectionResponse schema:
{
  "type": "selection",
  "message": "A short, friendly intro sentence.",
  "topicHint": "one of: software | automate | industrial | stack | process | ai | cloud | mobile | support | results",
  "options": [
    {
      "id": "unique-kebab-case-id",
      "title": "Option title (max 40 chars)",
      "shortDescription": "One-line teaser (max 90 chars).",
      "detailedExplanation": "2-4 sentences describing the option, its value, and typical deliverables.",
      "iconHint": "Lucide icon name such as Code2, Bot, Workflow, Factory, Cloud, Smartphone, Shield, BarChart3, Rocket, Layers, Database, Server, TrendingUp, Zap, Settings, Lock, Sparkles",
      "ctaText": "Action-oriented button label, e.g. Build this for me"
    }
  ]
}

ABOUT PRIGENIX:
- We are a remote-first studio of product engineers, AI specialists, cloud architects, and industrial IoT engineers.
- We work as an embedded engineering partner for startups and enterprises in manufacturing, logistics, SaaS, finance, retail, healthcare, and professional services.
- Our process: Discover → Design → Build → Deploy → Optimize, in two-week sprints with live demos.
- Engagement models: Pilot projects (from $15k, 2-4 weeks), monthly retainers, and enterprise programs.
- Results: 2.4M+ tasks automated, 800+ hours saved monthly for clients, 340% average ROI, 99.7% production uptime.
- Contact: hello@prigenix.ai. We usually reply within a few hours.

SELECTION TOPIC GUIDANCE:
- "I want software" / "What kind of apps do you build?" → software options: Web Apps, Mobile Apps, Internal Tools, AI-Powered Products.
- "What can you automate?" → workflow options: Document Processing, Invoice-to-ERP, Support Triage, Email Routing.
- "Industrial IoT?" → industrial options: PLC Integration, Sensor Telemetry, Predictive Maintenance, SCADA-to-Cloud.
- "AI capabilities?" → AI options: Document Extraction, Support Agents, Classification & Routing, Generative Features.
- "What is Prigenix?" / "Services" → high-level options: Custom Software, AI Agents, Workflow Automation, Industrial IoT, Data Intelligence, Platform Modernization.

CONTENT RULES:
- Use exactly 4-6 options per selection response.
- For plain-text answers, include at least one concrete detail about Prigenix: a service, a process step, a technology choice, or a result.
- Do not share API keys, internal details, or make up client names.`

const SAMPLE_COMMANDS = [
  { id: 'what-is', label: 'What is Prigenix?', topic: 'what-is', icon: Building2 },
  { id: 'automate', label: 'What can you automate?', topic: 'automate', icon: Workflow },
  { id: 'stack', label: 'Tech stack?', topic: 'stack', icon: Code2 },
  { id: 'process', label: 'How do you build?', topic: 'process', icon: Rocket },
  { id: 'industrial', label: 'Industrial IoT?', topic: 'industrial', icon: Factory },
  { id: 'results', label: 'Results?', topic: 'results', icon: TrendingUp },
]

const FALLBACK_RESPONSES = [
  {
    keywords: ['hi', 'hello', 'hey', 'how are you'],
    response: 'Hey! I am Prigenix AI. I can tell you about what we build, how we work, or help you find the right service. Ask me anything — like "I want software" or "What can you automate?"',
  },
  {
    keywords: ['what do you do', 'what can you do', 'what does prigenix do', 'things you do', 'what do you offer', 'what can prigenix'],
    response: 'Here are the services Prigenix offers. Tap one to learn more.',
    selection: {
      type: 'selection',
      message: 'Here are the services Prigenix offers. Tap one to learn more.',
      topicHint: 'software',
      options: [
        {
          id: 'custom-software',
          title: 'Custom Software',
          shortDescription: 'Web, mobile, and internal tools built for your ops.',
          detailedExplanation: 'We design and build software that fits your business like a bespoke machine — not an off-the-shelf compromise. Every architecture decision is made around performance, security, maintainability, and how your teams actually work. The result is a system that scales with you and earns trust with every release.',
          iconHint: 'Code2',
          ctaText: 'Build custom software',
        },
        {
          id: 'ai-agents',
          title: 'AI Agents',
          shortDescription: 'Autonomous agents that reason and execute.',
          detailedExplanation: 'We build agents that go beyond chatbots — systems that perceive context, plan actions, and complete multi-step tasks across tools and teams. Whether it is automating support triage, research, code review, or operations, the agent operates within guardrails you control. You get measurable throughput without adding headcount.',
          iconHint: 'Bot',
          ctaText: 'Add AI agents',
        },
        {
          id: 'workflow-automation',
          title: 'Workflow Automation',
          shortDescription: 'Self-running processes that cut cycle time.',
          detailedExplanation: 'We map your manual handoffs and repetitive tasks, then replace them with reliable, auditable automations. Integrations span APIs, databases, legacy systems, and messaging platforms so nothing falls between the cracks. Your team stops managing workarounds and starts moving work forward.',
          iconHint: 'Workflow',
          ctaText: 'Automate workflows',
        },
        {
          id: 'industrial-iot',
          title: 'Industrial IoT',
          shortDescription: 'Real-time visibility over machines and plants.',
          detailedExplanation: 'We connect sensors, controllers, and edge devices to give you live visibility and control over physical operations. From predictive maintenance to environmental monitoring, our systems deliver low-latency data where it is needed — on the factory floor or in the cloud. Built rugged, secure, and ready for real-world conditions.',
          iconHint: 'Factory',
          ctaText: 'Connect my floor',
        },
        {
          id: 'data-intelligence',
          title: 'Data Intelligence',
          shortDescription: 'Clean, queryable data for decisions and AI.',
          detailedExplanation: 'We clean, structure, and pipeline your data so it becomes a strategic asset instead of a liability. Our work supports analytics dashboards, reporting, machine learning, and AI-powered products. You get consistent, governed data that teams can trust and query with confidence.',
          iconHint: 'Database',
          ctaText: 'Unlock my data',
        },
        {
          id: 'platform-modernization',
          title: 'Platform Modernization',
          shortDescription: 'Migrate legacy systems to cloud-native stacks.',
          detailedExplanation: 'We untangle legacy code, infrastructure, and dependencies and migrate them to modern, cloud-native platforms. The process is incremental and risk-managed, so your business keeps running while your technology evolves. The outcome is lower cost, higher velocity, and a foundation ready for AI.',
          iconHint: 'Layers',
          ctaText: 'Modernize my stack',
        },
      ],
    },
  },
  {
    keywords: ['software', 'app', 'application', 'web', 'mobile', 'platform', 'build software', 'kind of software', 'i want software'],
    response: 'Here are the software solutions we can build for you. Tap one to see details.',
    selection: {
      type: 'selection',
      message: 'Here are the software solutions we can build for you. Tap one to see details.',
      topicHint: 'software',
      options: [
        {
          id: 'web-apps',
          title: 'Web Applications',
          shortDescription: 'React/Next.js apps, portals, and dashboards.',
          detailedExplanation: 'We build fast, secure web applications with React, Next.js, and TypeScript. This includes customer portals, SaaS products, admin dashboards, and internal tools with authentication, role-based access, and API integrations.',
          iconHint: 'Code2',
          ctaText: 'Start a web app',
        },
        {
          id: 'mobile-apps',
          title: 'Mobile Apps',
          shortDescription: 'iOS, Android, and cross-platform apps.',
          detailedExplanation: 'We develop native-feeling mobile experiences using React Native, Flutter, and PWA technologies. Ideal for field teams, customer apps, and IoT companion apps that need offline support and device integrations.',
          iconHint: 'Smartphone',
          ctaText: 'Build a mobile app',
        },
        {
          id: 'internal-tools',
          title: 'Internal Tools',
          shortDescription: 'Workflow tools that replace spreadsheets.',
          detailedExplanation: 'We replace manual spreadsheets and email chains with tailored internal tools that connect to your existing ERP, CRM, and databases. Features include custom forms, approval flows, sync, and role-based access.',
          iconHint: 'Layers',
          ctaText: 'Streamline operations',
        },
        {
          id: 'ai-products',
          title: 'AI-Powered Products',
          shortDescription: 'Products with generative AI and agents.',
          detailedExplanation: 'We embed LLMs, vector search, and AI agents into your product for document Q&A, smart search, content generation, and autonomous task handling.',
          iconHint: 'Bot',
          ctaText: 'Add AI to my product',
        },
      ],
    },
  },
  {
    keywords: ['automate', 'automation', 'workflow', 'process', 'repetitive', 'invoice', 'email', 'document', 'extract', 'sync', 'routine'],
    response: 'Here are the workflows Prigenix can automate. Tap one to explore.',
    selection: {
      type: 'selection',
      message: 'Here are the workflows Prigenix can automate. Tap one to explore.',
      topicHint: 'automate',
      options: [
        {
          id: 'document-processing',
          title: 'Document Processing',
          shortDescription: 'Extract data from PDFs, scans, and forms.',
          detailedExplanation: 'We use AI to read invoices, purchase orders, contracts, and forms, then extract structured data and route it to your ERP, CRM, or database without manual data entry.',
          iconHint: 'Database',
          ctaText: 'Automate documents',
        },
        {
          id: 'invoice-to-erp',
          title: 'Invoice-to-ERP',
          shortDescription: 'From inbox to posted record, hands-free.',
          detailedExplanation: 'Invoices are captured, validated against POs, coded, and synced to your ERP. Exceptions are flagged for review, and approvals are routed automatically.',
          iconHint: 'Workflow',
          ctaText: 'Sync invoices',
        },
        {
          id: 'support-triage',
          title: 'Support Triage',
          shortDescription: 'Classify and route customer requests.',
          detailedExplanation: 'AI reads incoming support emails and tickets, classifies urgency and topic, drafts responses, and routes complex issues to the right team member.',
          iconHint: 'Bot',
          ctaText: 'Triage support',
        },
        {
          id: 'email-routing',
          title: 'Email & Notification Routing',
          shortDescription: 'Never lose a message in the inbox.',
          detailedExplanation: 'We build rules and AI classifiers that read incoming messages, identify intent, and forward or notify the right people and systems in real time.',
          iconHint: 'Layers',
          ctaText: 'Route messages',
        },
      ],
    },
  },
  {
    keywords: ['industrial', 'iot', 'factory', 'plc', 'scada', 'manufacturing', 'sensor', 'shop floor', 'machine', 'equipment'],
    response: 'Here are the industrial IoT solutions Prigenix delivers. Tap one to learn more.',
    selection: {
      type: 'selection',
      message: 'Here are the industrial IoT solutions Prigenix delivers. Tap one to learn more.',
      topicHint: 'industrial',
      options: [
        {
          id: 'plc-integration',
          title: 'PLC Integration',
          shortDescription: 'Connect controllers to the cloud.',
          detailedExplanation: 'We connect PLCs and industrial controllers to cloud platforms so you can monitor commands, alarms, and production states from anywhere.',
          iconHint: 'Server',
          ctaText: 'Integrate PLCs',
        },
        {
          id: 'sensor-telemetry',
          title: 'Sensor Telemetry',
          shortDescription: 'Live data from temperature, pressure, vibration.',
          detailedExplanation: 'We deploy edge gateways that stream sensor data to time-series databases and dashboards, giving you real-time visibility into asset health.',
          iconHint: 'Database',
          ctaText: 'Stream telemetry',
        },
        {
          id: 'predictive-maintenance',
          title: 'Predictive Maintenance',
          shortDescription: 'Fix before failure.',
          detailedExplanation: 'Using vibration, temperature, and operational data, we build models that predict equipment failures before they happen, reducing downtime and maintenance costs.',
          iconHint: 'TrendingUp',
          ctaText: 'Predict failures',
        },
        {
          id: 'scada-to-cloud',
          title: 'SCADA-to-Cloud',
          shortDescription: 'Bridge legacy SCADA to modern dashboards.',
          detailedExplanation: 'We safely extract data from existing SCADA systems and publish it to cloud dashboards and analytics tools without disrupting control networks.',
          iconHint: 'Cloud',
          ctaText: 'Modernize SCADA',
        },
      ],
    },
  },
  {
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'llm', 'agent'],
    response: 'Here are the AI capabilities Prigenix can add to your business. Tap one to explore.',
    selection: {
      type: 'selection',
      message: 'Here are the AI capabilities Prigenix can add to your business. Tap one to explore.',
      topicHint: 'ai',
      options: [
        {
          id: 'document-extraction',
          title: 'Document Extraction',
          shortDescription: 'Pull structured data from unstructured files.',
          detailedExplanation: 'We train AI models to read PDFs, images, and scans and extract exactly the fields you need, formatted for your downstream systems.',
          iconHint: 'Database',
          ctaText: 'Extract documents',
        },
        {
          id: 'support-agents',
          title: 'Support Agents',
          shortDescription: 'AI that answers and routes customers.',
          detailedExplanation: 'We deploy agents that handle common support questions, draft replies, and escalate complex issues to humans with full context.',
          iconHint: 'Bot',
          ctaText: 'Deploy support agents',
        },
        {
          id: 'classification-routing',
          title: 'Classification & Routing',
          shortDescription: 'Sort and dispatch work automatically.',
          detailedExplanation: 'AI classifies incoming requests by type, urgency, and intent, then routes them to the right team or system without manual triage.',
          iconHint: 'Workflow',
          ctaText: 'Route with AI',
        },
        {
          id: 'generative-features',
          title: 'Generative Features',
          shortDescription: 'Add writing, summarization, and Q&A.',
          detailedExplanation: 'We embed generative AI into your product for content creation, summarization, document Q&A, and personalized recommendations.',
          iconHint: 'Sparkles',
          ctaText: 'Add generative AI',
        },
      ],
    },
  },
  {
    keywords: ['price', 'cost', 'pricing', 'how much', 'rate', 'budget'],
    response: 'Our pricing depends on scope and risk. Pilots start at $15,000 and run 2–4 weeks, which is the best way to prove ROI before scaling. For ongoing work we offer monthly retainers, and for large transformation programs we provide dedicated enterprise pods. I can connect you with a Prigenix engineer who will scope your specific need and send a clear proposal.',
  },
  {
    keywords: ['contact', 'email', 'call', 'reach', 'talk', 'get in touch', 'phone'],
    response: 'The fastest way to reach us is email at hello@prigenix.ai. We are a remote-first team working across multiple time zones and usually reply within a few hours during business days. You can also click "Book a Call" anywhere on the site to schedule a discovery call directly.',
  },
  {
    keywords: ['time', 'long', 'duration', 'weeks', 'timeline', 'fast', 'quick'],
    response: 'Most pilots go live in 2–4 weeks. A production MVP or internal tool typically takes 6–12 weeks. Enterprise programs or platform modernization run in phases, with the first incremental release usually landing in 8–16 weeks. We always front-load the highest-ROI workflows so you see value early, not at the end.',
  },
  {
    keywords: ['industry', 'industries', 'sector', 'sectors', 'manufacturing', 'logistics', 'saas', 'healthcare', 'finance', 'retail', 'agriculture', 'professional services'],
    response: 'We work across manufacturing, logistics, SaaS, finance, retail, healthcare, professional services, and agriculture. That variety matters because it means we have already solved integration, compliance, and scaling challenges similar to yours. Whether you need shop-floor IoT, invoice automation, or a customer-facing SaaS product, we adapt the stack to your environment.',
  },
  {
    keywords: ['team', 'engineers', 'developers', 'people', 'hire', 'who are you'],
    response: 'Prigenix is a remote-first team of product engineers, AI specialists, cloud architects, and industrial IoT engineers. We act as an embedded engineering partner rather than a traditional agency. That means we design, build, deploy, and operate systems alongside your team, and we communicate in daily standups and weekly demos rather than quarterly status reports.',
  },
  {
    keywords: ['location', 'where', 'country', 'office', 'remote'],
    response: 'We are fully remote and work with clients globally. Our team spans multiple time zones, so we can overlap with your working hours wherever you are. We use Slack, Teams, Zoom, and Notion to stay aligned, and we travel on-site when a project requires it, especially for industrial IoT deployments.',
  },
  {
    keywords: ['support', 'maintenance', 'after', 'warranty', 'help'],
    response: 'Every Prigenix engagement includes monitoring, runbooks, documentation, and a warranty period after go-live. If you choose a retainer, you also get ongoing support, performance tuning, security updates, and new feature development. We do not disappear after launch — we measure, optimize, and expand the system with you.',
  },
  {
    keywords: ['start', 'started', 'getting started', 'begin', 'project', 'engagement', 'hire you', 'how do i get'],
    response: 'The best way to start is a free automation audit or discovery call. We spend a few days understanding your workflows, systems, and bottlenecks, then identify the highest-ROI opportunities. After that, we propose a clear pilot scope with timeline, deliverables, and pricing. You can email hello@prigenix.ai or share your contact details here and we will reach out.',
  },
]

const TOPIC_KEYWORDS = {
  'what-is': ['what is', 'who is', 'about', 'company', 'prigenix', 'studio', 'tell me about', 'introduce'],
  automate: ['automate', 'automation', 'workflow', 'process', 'repetitive', 'invoice', 'email', 'document', 'extract', 'sync', 'routine'],
  stack: ['tech', 'stack', 'technology', 'react', 'node', 'python', 'aws', 'tools', 'language', 'framework', 'database', 'cloud'],
  process: ['process', 'build', 'methodology', 'sprint', 'how do you work', 'steps', 'delivery', 'develop'],
  industrial: ['industrial', 'factory', 'iot', 'sensor', 'plc', 'scada', 'manufacturing', 'shop floor', 'machine', 'equipment'],
  results: ['result', 'roi', 'impact', 'metric', 'saved', 'tasks', 'numbers', 'hours', 'success', 'case study', 'clients'],
}

function wordBoundaryMatch(text, keyword) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i')
  return regex.test(text)
}

function detectTopic(input) {
  const lower = input.toLowerCase()
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((kw) => wordBoundaryMatch(lower, kw))) {
      return topic
    }
  }
  return null
}

function getFallbackResponse(input, topics) {
  const lower = input.toLowerCase()

  const directMatch = FALLBACK_RESPONSES.find((item) =>
    item.keywords.some((kw) => wordBoundaryMatch(lower, kw))
  )
  if (directMatch) {
    return {
      response: directMatch.response,
      selection: directMatch.selection || null,
      topic: detectTopic(input),
    }
  }

  const topic = detectTopic(input)
  if (topic && topics?.[topic]?.description) {
    return { response: topics[topic].description, selection: null, topic }
  }

  return null
}

export function AICommandEditor({ onTopicChange, onAIResponse, topics, leadCapture, onLeadCaptureSubmit }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hey! I'm Prigenix AI. Pick a command or ask me anything about what we do.",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTopic, setActiveTopic] = useState('welcome')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, leadCapture])

  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }])
  }

  const handleCommand = async (command) => {
    const { label, topic } = command
    setActiveTopic(topic)
    onTopicChange?.(topic)

    addMessage('user', label)
    setIsLoading(true)

    const topicResponse = topics?.[topic]?.description
    if (topicResponse) {
      setTimeout(() => {
        addMessage('assistant', topicResponse)
        setIsLoading(false)
      }, 350)
      return
    }

    await fetchAIResponse(label)
  }

  const updateTopicFromInput = (input) => {
    const topic = detectTopic(input)
    if (topic) {
      setActiveTopic(topic)
      onTopicChange?.(topic)
    }
  }

  const applyStructuredResponse = (rawResponse, userMessage) => {
    // Try to parse JSON from the AI reply so we can show a friendly chat message
    // while still passing the raw JSON to the visual stage.
    const trimmed = (rawResponse || '').trim()
    let jsonText = trimmed
    const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch?.[1]) jsonText = codeBlockMatch[1].trim()

    if (jsonText.startsWith('{')) {
      try {
        const parsed = JSON.parse(jsonText)
        if (parsed.type === 'selection' && Array.isArray(parsed.options)) {
          addMessage('assistant', parsed.message || 'Here are some options. Tap one to learn more.')
          onAIResponse?.(jsonText, userMessage)
          return
        }
        if (parsed.type === 'lead_capture') {
          addMessage('assistant', parsed.message || 'Great! Please share your contact details.')
          onAIResponse?.(jsonText, userMessage)
          return
        }
      } catch {
        // Not valid JSON, fall through to plain text
      }
    }

    addMessage('assistant', rawResponse)
    onAIResponse?.(rawResponse, userMessage)
  }

  const fetchAIResponse = async (userMessage) => {
    setIsLoading(true)
    const fallback = getFallbackResponse(userMessage, topics)

    // Always try to update visual based on topic detection
    updateTopicFromInput(userMessage)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENCODE_API_KEY || process.env.VITE_OPENCODE_API_KEY
      const apiUrl = process.env.NEXT_PUBLIC_OPENCODE_API_URL || process.env.VITE_OPENCODE_API_URL

      if (!apiKey || !apiUrl) {
        throw new Error('API configuration missing')
      }

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'qwen3.7-plus',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 800,
          stream: false,
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `API error: ${response.status}`)
      }

      const data = await response.json()
      const reply =
        data.choices?.[0]?.message?.content ||
        "I'm thinking too hard. Try again?"
      applyStructuredResponse(reply, userMessage)
    } catch (err) {
      console.error('AI chat error:', err)
      if (fallback?.selection) {
        addMessage('assistant', fallback.selection.message || fallback.response)
        onAIResponse?.(JSON.stringify(fallback.selection), userMessage)
      } else if (fallback?.response) {
        addMessage('assistant', fallback.response)
        onAIResponse?.(fallback.response, userMessage)
      } else {
        const genericResponse = "I am not sure I caught that. I can tell you about Prigenix services, how we build software, what we automate, our industrial IoT work, pricing, or how to get started. What would you like to know?"
        addMessage('assistant', genericResponse)
        onAIResponse?.(genericResponse, userMessage)
      }
    } finally {
      clearTimeout(timeoutId)
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    addMessage('user', input)
    updateTopicFromInput(input)
    fetchAIResponse(input)
    setInput('')
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl glass shadow-industrial-floating">
      {/* Terminal header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-foreground/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20">
            <Terminal size={18} className="text-accent" />
          </div>
          <div>
            <span className="block font-sans text-sm font-bold text-white">
              Prigenix AI
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
              Interactive Guide
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1">
          <span className="h-2 w-2 animate-led-pulse rounded-full bg-green-500" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-green-400">
            Online
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-background/50 p-5">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  message.role === 'user' ? 'bg-muted' : 'bg-accent/20'
                }`}
              >
                {message.role === 'user' ? (
                  <User size={14} className="text-text-muted" />
                ) : (
                  <Bot size={14} className="text-accent" />
                )}
              </div>
              <div
                className={`rounded-2xl px-4 py-3 font-mono text-sm leading-relaxed md:text-base ${
                  message.role === 'user'
                    ? 'bg-accent text-white rounded-tl-none'
                    : 'bg-muted text-gray-200 rounded-tl-none'
                }`}
              >
                {message.content}
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/20">
              <Sparkles size={14} className="text-accent" />
            </div>
            <div className="flex gap-1.5 rounded-2xl bg-muted px-4 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-accent"
                />
              ))}
            </div>
          </motion.div>
        )}

        {leadCapture?.status && leadCapture.status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/20">
                <Bot size={14} className="text-accent" />
              </div>
              <div className="flex-1">
                <div className="mb-2 rounded-2xl rounded-tl-none bg-muted px-4 py-3 font-mono text-sm leading-relaxed text-gray-200">
                  Great choice! Please share your mobile number and email so our team can reach out.
                </div>
                <LeadCapture onSubmit={onLeadCaptureSubmit} status={leadCapture.status} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sample commands */}
      <div className="border-t border-white/5 bg-foreground/50 p-4">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-gray-500">
          Quick commands
        </div>
        <div className="grid grid-cols-1 gap-2">
          {SAMPLE_COMMANDS.map((cmd) => {
            const Icon = cmd.icon
            return (
              <motion.button
                key={cmd.id}
                type="button"
                onClick={() => handleCommand(cmd)}
                whileHover={{ x: 4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left font-mono text-xs transition-all md:text-sm ${
                  activeTopic === cmd.topic
                    ? 'bg-gradient-to-r from-accent/20 to-accent/5 text-accent shadow-[0_0_16px_rgba(59,130,246,0.15)] border border-accent/20'
                    : 'bg-muted text-gray-400 hover:bg-muted/80 hover:text-gray-200 border border-transparent'
                }`}
              >
                <Icon size={16} className={activeTopic === cmd.topic ? 'text-accent' : 'text-gray-500'} />
                <span className="flex-1">{cmd.label}</span>
                {activeTopic === cmd.topic && (
                  <motion.span
                    layoutId="activeDot"
                    className="h-2 w-2 rounded-full bg-accent"
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 border-t border-white/5 bg-background p-4"
      >
        <span className="font-mono text-xl text-accent">&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about Prigenix..."
          className="flex-1 bg-transparent font-mono text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none md:text-base"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-[0_4px_12px_rgba(166,50,60,0.3)] transition-all hover:brightness-110 disabled:opacity-30 md:h-11 md:w-11"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
