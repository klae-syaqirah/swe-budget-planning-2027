import { useState } from 'react'
import {
  Server, Cpu, Monitor, Zap, Shield, Search, TrendingUp, CheckCircle,
  AlertTriangle, ExternalLink, Calendar, Download, MemoryStick, Network,
} from 'lucide-react'

/* ----------------------------- MOCK DATA ----------------------------- */

const NAV = [
  ['Foundation 2026', '#foundation'],
  ['2027 Roadmap', '#roadmap'],
  ['Hardware & NAS', '#hardware'],
  ['AI & Tooling', '#tooling'],
  ['Budget Simulator', '#budget'],
]

const KPIS = [
  { big: '5+', text: 'Websites rebuilt & fine-tuned by end of 2026', icon: TrendingUp },
  { big: '20GB', text: 'RAM NAS upgrade for zero-bottleneck Docker staging', icon: Cpu },
  { big: '2X', text: 'Estimated coding velocity via ChatGPT Plus + Codex', icon: Zap },
]

const TIMELINE = [
  { name: '2R Website', url: 'https://2r.com.my/', dates: '06 Oct – 16 Oct 2026', tag: 'Revamp & Responsive Tuning', entity: '2R', month: 'Oct' },
  { name: 'Online Store for JoA & KLAESB', url: 'https://klae-plt.com/shop', dates: '08 Oct – 21 Oct 2026', tag: 'E-Commerce Engine', entity: 'JoA / KLAESB', month: 'Oct' },
  { name: 'Share Contact System', url: 'https://share-contact.klaesb.com/', dates: '12 Oct – 23 Oct 2026', tag: 'Lead Capture Routing', entity: 'KLAESB', month: 'Oct' },
  { name: 'JoA Automation Website', url: 'https://joautomation.com/', dates: '26 Oct – 30 Oct 2026', tag: 'B2B Corporate Polish', entity: 'JoA', month: 'Oct' },
  { name: 'Perfect Automation', url: 'https://pf-automation.com/', dates: '02 Nov – 06 Nov 2026', tag: 'Industrial Showcase', entity: 'Perfect Automation', month: 'Nov' },
  { name: 'Intranet Phase 2 (OBR Requisition, Ticketing, Booking)', url: null, dates: '04 Nov – 30 Nov 2026', tag: 'Operations Automation', entity: 'Internal', month: 'Nov' },
  { name: 'Ex Team Website', url: 'https://exteamsb.com/', dates: '01 Dec – 07 Dec 2026', tag: 'Engineering Services', entity: 'Ex Team', month: 'Dec' },
  { name: 'KLAESB Main Website', url: 'https://www.klaesb.com/', dates: '08 Dec – 18 Dec 2026', tag: 'Brand Revamp', entity: 'KLAESB', month: 'Dec' },
  { name: 'Site Cleanup & Final Fine-Tuning', url: null, dates: '21 Dec – 31 Dec 2026', tag: 'Code Cleanup, Caching & Speed Tuning', entity: 'All', month: 'Dec' },
]

const SALES_QUARTERS = {
  Q1: {
    title: 'Technical SEO & Conversion Engine', range: 'Jan – Mar 2027',
    milestones: [
      'Google Search Console, GA4, Microsoft Clarity & Meta Pixel rolled out to the remaining 6 sites (already live on klae-plt.com)',
      'Core Web Vitals score > 90 (image optimisation, WebP)',
      'Schema Markup (LocalBusiness, Product, Organization) extended to all sites (already live on klae-plt.com)',
      'klae-plt.com/shop checkout optimisation',
    ],
    synergy: 'Sales gets accurate tracking of where every lead comes from, plus search-ready pages.',
    kpis: ['100% sites pass Core Web Vitals (LCP < 2.5s)', '0 crawl errors', '+40% Google indexed pages'],
  },
  Q2: {
    title: 'Content Hub & Lead Automation', range: 'Apr – Jun 2027',
    milestones: [
      'Self-service blog / case-study CMS for easy content updates',
      'Quote request forms routed to Share Contact System & WhatsApp API',
      'Google Business Profile link synchronisation',
    ],
    synergy: 'Content goes live without waiting on code changes; sales receives leads instantly.',
    kpis: ['+25% inbound form leads', 'Lead response dispatch time < 2 minutes', 'Form load time < 1.5s'],
  },
  Q3: {
    title: 'High-Converting Landing Pages & Conversion Testing', range: 'Jul – Sep 2027',
    milestones: [
      'Dedicated campaign landing pages for paid ads',
      'A/B testing on B2B CTAs (JoA, Perfect Automation, KLAESB)',
    ],
    synergy: 'Every paid campaign gets a purpose-built, measurable landing page.',
    kpis: ['Landing page conversion rate > 3.5%', 'A/B-tested CTAs live on all B2B sites'],
  },
  Q4: {
    title: 'Security Audit, Disaster Recovery & Annual ROI Review', range: 'Oct – Dec 2027',
    milestones: [
      'Scheduled automated backup/restore drills via Synology DS925+',
      'Annual SEO keyword audit vs competitors',
      'Dependency security upgrades (Next.js, PHP, Node.js) & SSL tuning',
      'Offsite cloud backup of critical NAS data (3-2-1 rule: RAID alone is not a backup)',
    ],
    synergy: 'Full web-traffic-to-sales attribution report for management.',
    kpis: ['99.9% web uptime', '0 data loss incidents', 'Complete sales attribution report delivered'],
  },
}

const OPS_QUARTERS = {
  Q1: {
    title: 'Compliance Tracker & Expiry Alerts', range: 'Jan – Mar 2027',
    milestones: [
      'Company licence & certificate tracker in KLAE Group Portal (DOSH, CIDB, ST, insurance, domains, SSL) with email alerts 60 and 30 days before expiry',
      'Staff certificate expiry on the same engine (CIDB green card, NIOSH, safety passport), linked to each staff profile',
      'Email alerts for asset warranty & software licence expiry (asset register already live in the portal; alerts are on-screen only today)',
      'Uptime monitoring for all 7 sites & internal systems (Uptime Kuma in Docker on the NAS)',
    ],
    synergy: 'No company or staff member misses a renewal, and nobody has to remember to check.',
    kpis: ['100% of group & staff certificates registered', '0 missed renewals', 'Downtime alert < 5 minutes'],
  },
  Q2: {
    title: 'Quotation Generator & Shared Customer List', range: 'Apr – Jun 2027',
    milestones: [
      'Shared customer & product/service catalogue in the portal, one list for all 7 companies',
      'Group quotation generator replacing Excel quotes: auto quote numbering, approval flow, branded PDF per company',
      'Shopee ↔ klae-plt.com/shop stock sync (currently manual)',
    ],
    synergy: 'Sales stops retyping customers and prices into Excel; every quote is numbered, approved and traceable.',
    kpis: ['Excel quotations retired across all companies', 'Standard quote prepared in < 15 minutes', '0 manual stock updates between Shopee and the shop'],
  },
  Q3: {
    title: 'Field Service Reports & Training e-Certificates', range: 'Jul – Sep 2027',
    milestones: [
      'Digital service report for technicians (mobile PWA: shared customer list, photos, checklist, customer signature, auto PDF)',
      'KLAE PLT e-certificates with QR verification, participant registration, attendance & HRD Corp claim documents',
    ],
    synergy: 'Paper forms replaced; customers get a signed report on the spot and trainees get verifiable certificates the same day.',
    kpis: ['100% of field service jobs reported digitally', 'e-Certificates issued same day as training'],
  },
  Q4: {
    title: 'Group Dashboard & Handover Readiness', range: 'Oct – Dec 2027',
    milestones: [
      'Director dashboard in the portal: quotations issued & won per company, web leads, site uptime',
      'System documentation & handover runbooks for every internal system',
    ],
    synergy: 'Directors see every company on one screen; systems no longer depend on a single person.',
    kpis: ['Quotation pipeline value per company visible live', '1 consolidated dashboard live for directors', '100% of internal systems documented'],
  },
}

const TRACKS = {
  sales: { label: 'Sales Engine', impact: '// SALES IMPACT', quarters: SALES_QUARTERS },
  ops: { label: 'Group Operations', impact: '// GROUP IMPACT', quarters: OPS_QUARTERS },
}

const CAPACITY = [['50%', 'Sales Engine'], ['30%', 'Group Operations'], ['20%', 'Maintenance & support']]

const SPECS = [
  [Cpu, 'CPU', 'Quad-core 2.2 GHz AMD Ryzen Embedded (8 Threads)'],
  [MemoryStick, 'Default Memory', '4 GB DDR4 ECC SODIMM (1x slot occupied, 1x slot free)'],
  [Server, 'Max Capacity', 'Expandable to 32 GB (2x 16 GB ECC)'],
  [Server, 'Storage', '4-bay SATA (up to 9 bays with DX525) + 2x M.2 NVMe SSD slots'],
  [Network, 'Network', 'Dual 2.5GbE RJ-45 with Link Aggregation / Failover'],
]

const VENDORS = [
  { name: 'Bumi Technology', detail: 'DS925+ RM 4,100 (2-yr warranty) + 1x 8TB HAT3320-8T RM 2,095 (3-yr warranty)', total: '1 drive: RM 6,195 | 2 drives (RAID 1): RM 8,290', note: 'RECOMMENDED – Lowest Unit Price', best: true },
  { name: 'TC Tech Sales', detail: 'DS925+ RM 4,620 (chassis only)', total: 'RM 4,620 + drives', note: 'RM 520 higher than Bumi Tech without drives', best: false },
  { name: 'Shopee Official Bundle', detail: 'DS925+ with 2x 4TB HAT3300', total: 'RM 7,365', note: 'Inferior value – only 4TB usable in RAID 1', best: false },
]

const RFQ = ['ALL IT Hypermarket B2B', 'TMT (Thunder Match) Corporate', 'Viewnet B2B', 'Ban Leong Technologies (Official Synology Distributor Malaysia)']

const TOOLS = [
  {
    icon: Zap, name: 'ChatGPT Plus', role: 'Primary AI Engine for SWE', price: '$20/month', annual: '~RM 1,044/year',
    pros: ['Codex coding agent (VS Code extension + CLI) for multi-file Next.js & PHP refactoring', 'Deep Research for vendor, pricing & tech comparisons', 'Custom GPTs for repeatable docs (website info sheets, SEO copy, reports)', 'Image generation for banners & page mockups'],
    cons: ['Cloud-dependent: no credentials or customer data in prompts', '8% service tax on foreign digital services may apply'],
  },
  {
    icon: Shield, name: 'Cloud & Security', role: 'Cloudflare Maintenance', price: 'RM 0 free tier today', annual: 'Provision RM 1,200/year',
    pros: ['DDoS mitigation', 'Ultra-fast CDN caching', 'RM 0 at present tier (2 internal systems)', 'Budget covers enterprise domain SSL & DNS resilience for all active sites'],
    cons: [],
  },
  {
    icon: Search, name: 'SEO Tracking & Search Intelligence', role: 'Mangools / Ubersuggest', price: '$29/month', annual: '~RM 1,514/year',
    pros: ['Fraction of Semrush cost (RM 7,300/yr)', 'Tracks localised Google Malaysia rankings', 'Keyword difficulty & competitor backlink auditing'],
    cons: ['Smaller backlink database than Ahrefs / Semrush enterprise'],
  },
]

const SCENARIOS = {
  rec: {
    label: 'Recommended: High Reliability',
    items: [
      ['Synology DS925+ with 2x 8TB HDD (RAID 1 Redundancy)', 8290],
      ['16GB ECC RAM Upgrade', 480],
      ['Dual Monitors (MSI 27" + MSI 24.5")', 748.2],
      ['ChatGPT Plus Subscription', 1044],
      ['SEO Tool (Mangools / Ubersuggest)', 1514],
      ['KL Host Web Hosting – 7 sites (existing renewal)', 2310],
      ['BillPlz Payment Gateway (existing renewal)', 150],
      ['Cloud, DNS & SSL Maintenance', 1200],
      ['UPS for NAS (est., quote pending)', 700],
      ['Offsite Cloud Backup (Backblaze B2 / Synology C2, est.)', 400],
    ],
    note: 'Full data redundancy. A single HDD failure costs zero data.',
  },
  lean: {
    label: 'Lean Baseline',
    items: [
      ['Synology DS925+ with 1x 8TB HDD (no RAID 1)', 6195],
      ['16GB ECC RAM Upgrade', 480],
      ['Dual Monitors (MSI 27" + MSI 24.5")', 748.2],
      ['ChatGPT Plus Subscription', 1044],
      ['SEO Tool (deferred to free Google tools)', 0],
      ['KL Host Web Hosting – 7 sites (existing renewal)', 2310],
      ['BillPlz Payment Gateway (existing renewal)', 150],
      ['Cloud, DNS & SSL Maintenance', 1200],
      ['UPS for NAS (est., quote pending)', 700],
      ['Offsite Cloud Backup (Backblaze B2 / Synology C2, est.)', 400],
    ],
    note: 'carries NO drive redundancy if the HDD fails. Offsite backup is the only copy of the data.',
  },
}

const CONTINGENCY = 0.1

const subtotal = (items) => items.reduce((a, [, v]) => a + v, 0)
const grandTotal = (items) => Math.round(subtotal(items) * (1 + CONTINGENCY) * 100) / 100

const rm = (n) => 'RM ' + n.toLocaleString('en-MY', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })

/* ----------------------------- COMPONENTS ----------------------------- */

const Highlight = ({ children }) => (
  <span className="inline-block bg-[#ffe17c] text-[#171e19] px-3 py-1 -rotate-3 font-normal">{children}</span>
)

const Tag = ({ children, dark }) => (
  <span className={`font-mono text-xs uppercase px-2 py-1 border ${dark ? 'border-[#b7c6c2]/20 text-[#b7c6c2]' : 'border-[#171e19]/15 text-[#171e19]'}`}>{children}</span>
)

function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-[#171e19] border-b border-[#b7c6c2]/20 text-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <a href="#top" className="font-display text-xl whitespace-nowrap">SWE GROWTH ENGINE // 2027</a>
        <div className="hidden lg:flex gap-6 text-sm font-medium">
          {NAV.map(([l, h]) => (
            <a key={h} href={h} className="text-[#b7c6c2] hover:text-[#ffe17c]">[{l}]</a>
          ))}
        </div>
        <span className="hidden md:block bg-[#ffe17c] text-[#171e19] font-mono text-xs font-bold px-3 py-2 whitespace-nowrap">
          STATUS: READY FOR Q1 EXECUTION
        </span>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section id="top" className="grid-bg bg-[#171e19] text-white py-24 border-b border-[#b7c6c2]/20">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-display text-6xl md:text-8xl xl:text-9xl">
          We code the engine.{' '}
          <Highlight>SALES</Highlight>{' '}
          closes the deals.
        </h1>
        <p className="mt-10 max-w-3xl text-lg md:text-xl text-[#b7c6c2] leading-relaxed">
          Transforming SWE from a cost center into a continuous pipeline of qualified leads, enterprise web infrastructure, and high-uptime operational systems across all corporate entities.
        </p>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {KPIS.map(({ big, text, icon: Icon }) => (
            <div key={big} className="lift border border-[#b7c6c2]/20 bg-[#272727] p-6">
              <Icon className="text-[#ffe17c] mb-4" size={28} />
              <div className="font-display text-6xl text-[#ffe17c]">{big}</div>
              <p className="mt-3 font-bold uppercase text-sm tracking-wide">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Foundation() {
  const [month, setMonth] = useState('All')
  const list = TIMELINE.filter((t) => month === 'All' || t.month === month)
  return (
    <section id="foundation" className="grid-bg bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Tag>Q4 2026 // Pre-requisite overhaul</Tag>
        <h2 className="font-display text-6xl md:text-8xl mt-4">Clean codebase. <Highlight>ZERO BS.</Highlight></h2>
        <p className="mt-6 max-w-2xl text-lg text-[#272727]">
          Before running 2027 revenue campaigns, every website foundation is audited, upgraded, and consolidated.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          {['All', 'Oct', 'Nov', 'Dec'].map((m) => (
            <button key={m} onClick={() => setMonth(m)}
              className={`font-mono text-sm px-4 py-2 border border-[#171e19]/15 hover:shadow-[4px_4px_0px_0px_#ffe17c] hover:-translate-y-1 ${month === m ? 'bg-[#171e19] text-[#ffe17c]' : 'bg-white'}`}>
              {m === 'All' ? 'ALL PROJECTS' : m.toUpperCase() + ' 2026'}
            </button>
          ))}
        </div>
        <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {list.map((t) => (
            <div key={t.name} className="lift bg-white border border-[#171e19]/15 p-6 flex flex-col">
              <div className="flex items-center gap-2 font-mono text-sm font-bold"><Calendar size={16} />{t.dates}</div>
              <h3 className="font-display text-3xl mt-4">{t.name}</h3>
              <div className="mt-3 flex gap-2 flex-wrap"><Tag>{t.tag}</Tag><Tag>{t.entity}</Tag></div>
              {t.url && (
                <a href={t.url} target="_blank" rel="noreferrer" className="mt-auto pt-5 inline-flex items-center gap-1 text-sm font-bold underline decoration-[#ffe17c] decoration-4 underline-offset-4">
                  {t.url.replace(/^https?:\/\//, '')} <ExternalLink size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 border border-[#171e19]/15 border-l-8 border-l-[#ffe17c] bg-[#b7c6c2]/20 p-6 flex gap-4">
          <CheckCircle className="shrink-0" />
          <p><strong>Entity Clarity:</strong> KLAE PLT (Training portal – live; online store at klae-plt.com/shop selling JoA & KLAESB products – Oct 2026) is operated independently from KLAESB (main corporate website – scheduled for Dec 2026 revamp).</p>
        </div>
      </div>
    </section>
  )
}

function Roadmap() {
  const [track, setTrack] = useState('sales')
  const [q, setQ] = useState('Q1')
  const t = TRACKS[track]
  const d = t.quarters[q]
  return (
    <section id="roadmap" className="grid-bg bg-[#171e19] text-white py-24 border-y border-[#b7c6c2]/20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-6xl md:text-8xl">2027 Milestones: <Highlight>SWE x KLAE GROUP</Highlight> impact</h2>
        <p className="mt-6 max-w-3xl text-lg text-[#b7c6c2]">
          Two parallel tracks: a Sales Engine that brings in leads, and Group Operations modules built into the existing KLAE Group Portal (leave, claims, tickets, assets and bookings already live) to cut manual work across all 7 companies.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm">
          <span className="text-[#b7c6c2]">CAPACITY SPLIT (1 DEVELOPER):</span>
          {CAPACITY.map(([pct, l]) => <span key={l}><span className="text-[#ffe17c] font-bold">{pct}</span> {l}</span>)}
        </div>
        <div className="mt-10 inline-flex border border-[#b7c6c2]/20">
          {Object.entries(TRACKS).map(([k, v]) => (
            <button key={k} onClick={() => setTrack(k)}
              className={`px-6 py-3 font-bold text-sm ${track === k ? 'bg-[#ffe17c] text-[#171e19]' : 'bg-[#272727] hover:bg-[#ffe17c]/20'}`}>
              {v.label}
            </button>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {Object.keys(t.quarters).map((k) => (
            <button key={k} onClick={() => setQ(k)}
              className={`font-display text-3xl px-8 py-3 border border-[#b7c6c2]/20 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#ffe17c] ${q === k ? 'bg-[#ffe17c] text-[#171e19]' : 'bg-[#272727]'}`}>
              {k}
            </button>
          ))}
        </div>
        <div className="mt-8 border border-[#b7c6c2]/20 bg-[#272727] p-8">
          <div className="font-mono text-[#ffe17c] text-sm">{d.range}</div>
          <h3 className="font-display text-4xl md:text-6xl mt-2">{d.title}</h3>
          <div className="mt-8 grid lg:grid-cols-3 gap-8">
            <div>
              <h4 className="font-mono text-xs text-[#b7c6c2] mb-3">// DELIVERABLES</h4>
              <ul className="space-y-3">{d.milestones.map((m) => (
                <li key={m} className="flex gap-2"><CheckCircle size={18} className="text-[#ffe17c] shrink-0 mt-1" />{m}</li>
              ))}</ul>
            </div>
            <div>
              <h4 className="font-mono text-xs text-[#b7c6c2] mb-3">{t.impact}</h4>
              <p className="text-lg">{d.synergy}</p>
            </div>
            <div>
              <h4 className="font-mono text-xs text-[#b7c6c2] mb-3">// MEASURABLE KPIs</h4>
              <ul className="space-y-3">{d.kpis.map((k) => (
                <li key={k} className="font-mono text-sm border border-[#ffe17c]/60 text-[#ffe17c] p-3">{k}</li>
              ))}</ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Hardware() {
  return (
    <section id="hardware" className="grid-bg bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-6xl md:text-8xl">Hardware infrastructure & <Highlight>JUSTIFICATION</Highlight></h2>

        <h3 className="font-display text-4xl mt-14">Part A // Synology DS925+ & RAM bottleneck</h3>
        <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {SPECS.map(([Icon, k, v]) => (
            <div key={k} className="lift border border-[#171e19]/15 bg-white p-5">
              <Icon className="mb-3" />
              <div className="font-mono text-xs text-[#272727]/70">{k.toUpperCase()}</div>
              <div className="font-bold mt-1">{v}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-[#171e19] text-white p-8 border-l-8 border-[#ffe17c] flex gap-4">
          <AlertTriangle className="text-[#ffe17c] shrink-0" size={28} />
          <p><strong className="text-[#ffe17c]">Why RAM runs high on the current test NAS:</strong> Running Active Backup for Business + Synology Drive indexing + Docker Container Manager (running dev/staging web databases for 7 entities) exhausts 4GB immediately. The DS925+ ships with the same 4GB, so adding a 16GB DDR4 ECC RAM stick (<span className="font-mono">~RM480</span>) on day one brings total capacity to 20GB, completely eliminating memory swap throttling.</p>
        </div>

        <h4 className="font-mono text-sm mt-12 mb-4">// VENDOR COMPARISON</h4>
        <div className="overflow-x-auto border border-[#171e19]/15">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#171e19] text-white font-mono text-xs">
              <tr>{['VENDOR', 'CONFIGURATION', 'TOTAL', 'VERDICT'].map((h) => <th key={h} className="p-4">{h}</th>)}</tr>
            </thead>
            <tbody>
              {VENDORS.map((v) => (
                <tr key={v.name} className={`border-t border-[#171e19]/15 hover:bg-[#ffe17c]/30 ${v.best ? 'bg-[#ffe17c]/20' : ''}`} style={{ transition: 'all 300ms' }}>
                  <td className="p-4 font-bold">{v.name}</td>
                  <td className="p-4">{v.detail}</td>
                  <td className="p-4 font-mono">{v.total}</td>
                  <td className="p-4 font-bold">{v.best && <span className="bg-[#ffe17c] px-2 py-1 mr-2">★</span>}{v.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm"><strong>Potential corporate RFQ channels:</strong> {RFQ.join(' · ')}</p>
        <p className="mt-2 text-sm"><strong>Also budgeted:</strong> a UPS so a power cut cannot corrupt the NAS mid-write, and offsite cloud backup of critical data. RAID 1 survives a drive failure, but not accidental deletion, ransomware or fire.</p>

        <h3 className="font-display text-4xl mt-20">Part B // Dual monitor setup (MSI 27" FHD + MSI 24.5" FHD)</h3>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="lift border border-[#171e19]/15 p-8">
            <Tag>Option A</Tag>
            <h4 className="font-display text-4xl mt-3">Single monitor (status quo)</h4>
            <p className="mt-4"><CheckCircle className="inline mr-2" size={18} /><strong>Pro:</strong> Low upfront cost.</p>
            <p className="mt-2"><AlertTriangle className="inline mr-2" size={18} /><strong>Con:</strong> Extreme context-switching fatigue between IDE, terminal, browser DevTools, DBeaver and design assets. Loss of ~20 mins/day.</p>
          </div>
          <div className="lift border border-[#171e19]/15 p-8 bg-[#ffe17c]/30">
            <Tag>Option B // Recommended</Tag>
            <h4 className="font-display text-4xl mt-3">Dual display <span className="font-mono text-2xl">RM 748.20</span></h4>
            <div className="mt-4 font-mono text-sm space-y-2">
              <p>
                <a className="underline decoration-[#171e19] underline-offset-4" href="https://s.shopee.com.my/qk4kRpuNz?share_channel_code=1" target="_blank" rel="noreferrer">MSI PRO MP275 27" FHD 100Hz IPS (3YW)</a>: RM 399
              </p>
              <p>
                <a className="underline decoration-[#171e19] underline-offset-4" href="https://s.shopee.com.my/BUNxAU5KJ?share_channel_code=1" target="_blank" rel="noreferrer">MSI PRO MP251 E14L 24.5" FHD 144Hz IPS (3YW)</a>: RM 349.20
              </p>
              <p>Stock stands only, no monitor arm: easy to pack and move if the office relocates</p>
              <p className="text-xs">Shopee website prices. Mobile app prices are lower (RM 311 + RM 290), i.e. RM 601 total.</p>
            </div>
            <p className="mt-3"><Monitor className="inline mr-2" size={18} /><strong>Recovers ~20 mins/day</strong> of context-switching, enabling instant code-inspect comparison, side-by-side terminal logs and immediate responsive testing. Saves ~75 hours per year (20 mins × ~230 working days) across 7 company websites.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Tooling() {
  return (
    <section id="tooling" className="grid-bg bg-[#171e19] text-white py-24 border-y border-[#b7c6c2]/20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-6xl md:text-8xl">Software & <Highlight>AI</Highlight> multipliers</h2>
        <div className="mt-12 grid lg:grid-cols-3 gap-6">
          {TOOLS.map(({ icon: Icon, name, role, price, annual, pros, cons }) => (
            <div key={name} className="lift border border-[#b7c6c2]/20 bg-[#272727] p-6 flex flex-col">
              <Icon className="text-[#ffe17c]" size={30} />
              <h3 className="font-display text-4xl mt-4">{name}</h3>
              <div className="text-[#b7c6c2] text-sm">{role}</div>
              <div className="mt-4 font-mono">
                <div className="text-[#ffe17c] text-xl font-bold">{price}</div>
                <div className="text-sm">{annual}</div>
              </div>
              <h4 className="font-mono text-xs text-[#b7c6c2] mt-6 mb-2">// PROS</h4>
              <ul className="space-y-2 text-sm">{pros.map((p) => <li key={p} className="flex gap-2"><CheckCircle size={16} className="text-[#ffe17c] shrink-0 mt-0.5" />{p}</li>)}</ul>
              {cons.length > 0 && <>
                <h4 className="font-mono text-xs text-[#b7c6c2] mt-6 mb-2">// CONS</h4>
                <ul className="space-y-2 text-sm">{cons.map((p) => <li key={p} className="flex gap-2"><AlertTriangle size={16} className="shrink-0 mt-0.5" />{p}</li>)}</ul>
              </>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Budget() {
  const [mode, setMode] = useState('rec')
  const s = SCENARIOS[mode]
  const sub = subtotal(s.items)
  const total = grandTotal(s.items)
  const saving = grandTotal(SCENARIOS.rec.items) - grandTotal(SCENARIOS.lean.items)
  return (
    <section id="budget" className="grid-bg bg-white py-24">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-display text-6xl md:text-8xl">2027 budget summary & <Highlight>SCENARIO</Highlight> toggle</h2>
        <div className="mt-10 inline-flex border border-[#171e19]/15 no-print">
          {Object.entries(SCENARIOS).map(([k, v]) => (
            <button key={k} onClick={() => setMode(k)}
              className={`px-6 py-3 font-bold text-sm ${mode === k ? 'bg-[#171e19] text-[#ffe17c]' : 'bg-white hover:bg-[#ffe17c]/40'}`}>
              {v.label}
            </button>
          ))}
        </div>
        <div className="mt-6 border border-[#171e19]/15 bg-white">
          {s.items.map(([n, v]) => (
            <div key={n} className="flex justify-between gap-4 p-4 border-b border-[#171e19]/15">
              <span className={v === 0 ? 'text-[#272727]/60 italic' : ''}>{n}</span>
              <span className="font-mono font-bold whitespace-nowrap">{rm(v)}</span>
            </div>
          ))}
          <div className="flex justify-between gap-4 p-4 border-b border-[#171e19]/15 bg-[#b7c6c2]/20">
            <span>Contingency ({CONTINGENCY * 100}% of {rm(sub)}): price changes, exchange rate, SST</span>
            <span className="font-mono font-bold whitespace-nowrap">{rm(total - sub)}</span>
          </div>
          <div className="flex justify-between items-center p-6 bg-[#171e19] text-white">
            <span className="font-display text-3xl">Total</span>
            <span className="font-mono text-3xl font-bold text-[#ffe17c]">{rm(total)}</span>
          </div>
        </div>
        <p className="mt-4 flex gap-2 items-center font-medium">
          {mode === 'rec' ? <Shield size={18} /> : <AlertTriangle size={18} />} {mode === 'rec' ? s.note : `Saves ${rm(saving)} but ${s.note}`}
        </p>
        <div className="mt-10 flex flex-wrap gap-4 no-print">
          <button onClick={() => window.print()}
            className="bg-[#ffe17c] text-[#171e19] font-bold px-6 py-4 border border-[#171e19] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#171e19] inline-flex items-center gap-2">
            <Download size={18} /> Download Executive PDF Summary
          </button>
          <a href="mailto:?subject=Q1%202027%20Planning%20Sync%20-%20Sales&body=Let%27s%20schedule%20the%20Q1%20planning%20sync."
            className="border-2 border-[#171e19] text-[#171e19] font-bold px-6 py-4 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#ffe17c] inline-flex items-center gap-2">
            <Calendar size={18} /> Schedule Q1 Planning Sync with Sales
          </a>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <Foundation />
      <Roadmap />
      <Hardware />
      <Tooling />
      <Budget />
      <footer className="bg-[#171e19] text-[#b7c6c2] font-mono text-xs p-8 text-center">
        SWE GROWTH ENGINE // 2027 — KLAESB · KLAE PLT · CMK Automation · 2R · JoA Automation · Perfect Automation · Ex Team
      </footer>
    </>
  )
}

