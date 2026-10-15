import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft, ChevronLeft, ChevronRight, Printer, Maximize,
  LayoutTemplate, BarChart3, Star, Globe, MessageCircle, Send,
} from 'lucide-react'
import { SCENARIOS, CONTINGENCY, subtotal, grandTotal, rm } from './data.js'

/* ----------------------------- BUDGET FIGURES ----------------------------- */

const SITES = 7
const REC = SCENARIOS.rec.items
const price = (prefix) => REC.find(([n]) => n.startsWith(prefix))[1]

// Group renewals split evenly across the 7 company websites
const HOSTING = Math.round(price('KL Host') / SITES)
const CLOUD = Math.round(price('Cloud, DNS') / SITES)
const BILLPLZ = price('BillPlz')
const NAS = price('Synology DS925+')
const RAM = price('16GB')

const ASSETS = REC.filter(([, , c]) => c === 'asset')
const YEARLY = REC.filter(([, , c]) => c !== 'asset')
const TOTAL = grandTotal(REC)
// Lean scenario: one drive instead of two (RAID 1)
const LEAN_SAVING = NAS - SCENARIOS.lean.items.find(([n]) => n.startsWith('Synology DS925+'))[1]

/* ----------------------------- CONTENT ----------------------------- */

const CLEANUP = ['21–31 Dec', 'Code cleanup, caching & speed tuning']
const TRACKING = ['Q1', 'Tracking on: Search Console, GA4, Clarity, Meta Pixel + Schema markup']
const SPEED = ['Q1', 'Core Web Vitals score above 90 (WebP images, faster pages)']
const CMS = ['Q2', 'Blog / case-study CMS + Google Business Profile sync']
const FORMS = ['Q2', 'Quote forms sent straight to Share Contact System & WhatsApp']
const AUDIT = ['Q4', 'Competitor keyword audit, security updates & backup drills']
const LANDING = ['Q3', 'Landing pages for paid ad campaigns']
const LANDING_AB = ['Q3', 'Campaign landing pages + A/B-tested call-to-action buttons']

const STANDARD = [TRACKING, SPEED, CMS, FORMS, LANDING, AUDIT]
const STANDARD_AB = [TRACKING, SPEED, CMS, FORMS, LANDING_AB, AUDIT]
const WEB_TARGETS = 'Targets: Core Web Vitals pass (LCP < 2.5s) · 0 crawl errors · +25% inbound form leads'
const WEB_GOAL = 'Goal: every site clean and fast before the 2027 campaigns start.'

const COMPANIES = [
  {
    name: 'KLAESB', url: 'klaesb.com',
    y26: [
      ['8–21 Oct', 'KLAESB products listed on the KLAE PLT online store'],
      ['12–23 Oct', 'Share Contact System launched for lead capture & routing'],
      ['8–18 Dec', 'Main website brand revamp'],
      CLEANUP,
    ],
    y27: STANDARD_AB,
  },
  {
    name: 'CMK Automation', url: null,
    y26: [
      ['Ongoing', 'Website hosted & running on KL Host'],
      ['Q4 2026', 'Not in the Oct–Dec 2026 revamp schedule'],
      CLEANUP,
    ],
    y27: [['Q1', 'Bring the site to group standard: mobile layout, WebP images, Core Web Vitals above 90'], TRACKING, CMS, FORMS, LANDING, AUDIT],
  },
  {
    name: 'JoA Automation', url: 'joautomation.com',
    y26: [
      ['8–21 Oct', 'JoA products listed on the KLAE PLT online store'],
      ['26–30 Oct', 'B2B corporate website polish'],
      CLEANUP,
    ],
    y27: STANDARD_AB,
  },
  {
    name: '2R', url: '2r.com.my',
    y26: [['6–16 Oct', 'Website revamp & responsive (mobile) tuning'], CLEANUP],
    y27: STANDARD,
  },
  {
    name: 'Ex Team', url: 'exteamsb.com',
    y26: [['1–7 Dec', 'Engineering services website refresh'], CLEANUP],
    y27: STANDARD,
  },
  {
    name: 'Perfect Automation', url: 'pf-automation.com',
    y26: [['2–6 Nov', 'Industrial showcase website'], CLEANUP],
    y27: STANDARD_AB,
  },
  {
    name: 'KLAE PLT', url: 'klae-plt.com',
    y26: [
      ['Live', 'Training portal, run separately from KLAESB'],
      ['8–21 Oct', 'Online store at klae-plt.com/shop selling JoA & KLAESB products'],
      ['Live', 'Search Console, GA4, Clarity, Meta Pixel & Schema already running'],
      CLEANUP,
    ],
    y27: [
      ['Q1', 'Checkout optimisation on klae-plt.com/shop'],
      SPEED,
      ['Q2', 'Stock sync between Shopee and the online store (no more manual updates)'],
      ['Q2', 'Course / blog CMS + Google Business Profile sync'],
      ['Q3', 'Training e-certificates with QR verification + HRD Corp claim documents'],
      AUDIT,
    ],
    extra: [['BillPlz gateway', BILLPLZ]],
  },
]

const IDEAS = [
  { icon: LayoutTemplate, title: 'One shared site template', text: 'Build all 7 sites from one component kit, so a brand or layout change is made once and rolls out everywhere.', cost: 'RM 0' },
  { icon: BarChart3, title: 'Monthly web report', text: 'Free Looker Studio report from GA4: traffic and leads per company, emailed to directors every month.', cost: 'RM 0 · free tool' },
  { icon: Star, title: 'Google review requests', text: 'After each service job or training, send the customer a Google review link to grow ratings on Google Maps.', cost: 'RM 0' },
  { icon: Globe, title: 'Bahasa Malaysia pages', text: 'BM versions of key service pages, so we show up when local customers search in Malay.', cost: 'RM 0' },
  { icon: MessageCircle, title: 'Website FAQ assistant', text: 'AI chat that answers common product questions and hands the customer to sales on WhatsApp.', cost: 'Cost to be checked' },
  { icon: Send, title: 'Order status emails', text: 'Automatic emails when a klae-plt.com/shop order is paid, packed and shipped.', cost: 'RM 0' },
]

/* ----------------------------- BUILDING BLOCKS ----------------------------- */

const THEMES = {
  light: 'bg-[#f4f3ee] text-[#171e19]',
  dark: 'bg-[#171e19] text-[#f4f3ee]',
  yellow: 'bg-[#ffe17c] text-[#171e19]',
}

const Frame = ({ theme = 'light', children }) => (
  <div className={`h-full w-full flex flex-col gap-4 px-[84px] pt-[38px] pb-[46px] ${THEMES[theme]}`}>{children}</div>
)

function Head({ eyebrow, title, pill, theme = 'light' }) {
  const dark = theme === 'dark'
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <div className={`font-mono text-[14px] font-bold tracking-[0.15em] ${dark ? 'text-[#b7c6c2]' : 'text-[#4b5650]'}`}>{eyebrow}</div>
        <h2 className="font-display text-[56px] mt-1">{title}</h2>
      </div>
      {pill && (
        <div className={`font-mono text-[16px] font-bold px-4 py-2 whitespace-nowrap mb-1 ${dark ? 'bg-[#ffe17c] text-[#171e19]' : 'bg-[#171e19] text-[#ffe17c]'}`}>{pill}</div>
      )}
    </div>
  )
}

// Card variants: outline (light slide), ink (dark card on light slide),
// deep (dark card on dark slide), paper (light card on dark slide)
const CARD = {
  outline: { box: 'bg-[#fbfbf7] border-[#171e19]', year: 'text-[#171e19]', label: 'text-[#4b5650]', tag: 'bg-[#e2e8e4] text-[#171e19]', foot: 'border-[#171e19]/20 text-[#4b5650]' },
  ink: { box: 'bg-[#171e19] border-[#171e19] text-[#eef2ef]', year: 'text-[#ffe17c]', label: 'text-[#b7c6c2]', tag: 'bg-[#ffe17c] text-[#171e19]', foot: 'border-[#3a463f] text-[#b7c6c2]' },
  deep: { box: 'bg-[#222a24] border-[#3a463f] text-[#eef2ef]', year: 'text-[#ffe17c]', label: 'text-[#b7c6c2]', tag: 'bg-[#ffe17c] text-[#171e19]', foot: 'border-[#3a463f] text-[#b7c6c2]' },
  paper: { box: 'bg-[#f4f3ee] border-[#f4f3ee] text-[#171e19]', year: 'text-[#171e19]', label: 'text-[#4b5650]', tag: 'bg-[#171e19] text-[#ffe17c]', foot: 'border-[#171e19]/20 text-[#4b5650]' },
}

function YearCard({ year, label, variant, footer, children }) {
  const v = CARD[variant]
  return (
    <div className={`flex flex-col gap-3 p-[20px] border-2 min-h-0 ${v.box}`}>
      <div className="flex items-baseline gap-3">
        <span className={`font-display text-[40px] ${v.year}`}>{year}</span>
        <span className={`font-mono text-[13px] font-bold tracking-[0.12em] ${v.label}`}>{label}</span>
      </div>
      {children}
      {footer && <div className={`mt-auto pt-3 border-t-2 text-[14px] ${v.foot}`}>{footer}</div>}
    </div>
  )
}

function Rows({ rows, tagWidth, variant }) {
  return (
    <div className="flex flex-col gap-[7px]">
      {rows.map(([tag, text]) => (
        <div key={text} className="flex gap-3 items-start">
          <span className={`font-mono text-[13px] font-bold py-[3px] shrink-0 text-center ${CARD[variant].tag}`} style={{ width: tagWidth }}>{tag}</span>
          <span className="text-[17px] leading-[1.35]">{text}</span>
        </div>
      ))}
    </div>
  )
}

function Groups({ groups }) {
  return groups.map(([label, items]) => (
    <div key={label}>
      <div className="font-mono text-[13px] font-bold tracking-[0.12em] text-[#ffe17c] uppercase">{label}</div>
      <ul className="mt-2 list-disc pl-6 text-[18px] leading-[1.6]">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  ))
}

function BudgetStrip({ label, items, total, totalNote }) {
  return (
    <div className="flex items-center gap-6 bg-[#ffe17c] text-[#171e19] border-2 border-[#171e19] px-[20px] py-[10px]">
      <div className="font-mono text-[13px] font-bold tracking-[0.12em] leading-snug shrink-0">
        {label.map((l, i) => <div key={l} className={i ? 'font-normal tracking-normal' : ''}>{l}</div>)}
      </div>
      {items.map(([k, v]) => (
        <div key={k} className="text-[16px] whitespace-nowrap">{k}{v != null && <> <b className="font-mono">{rm(v)}</b></>}</div>
      ))}
      <div className="ml-auto text-right shrink-0">
        <div className="font-display text-[32px] leading-none">{total}</div>
        <div className="font-mono text-[12px] font-bold mt-1">{totalNote}</div>
      </div>
    </div>
  )
}

/* ----------------------------- SLIDES ----------------------------- */

function Cover() {
  const stats = [
    ['7', 'Company websites'],
    ['2', 'Internal portals (HR & Sales)'],
    [rm(Math.round(TOTAL)), `2027 budget, incl. ${CONTINGENCY * 100}% contingency`],
  ]
  return (
    <div className="h-full w-full grid-bg bg-[#171e19] text-[#f4f3ee] px-[84px] py-[84px] flex flex-col justify-between">
      <div>
        <div className="font-mono text-[15px] font-bold tracking-[0.18em] text-[#ffe17c]">KLAE GROUP · SOFTWARE ENGINEERING (SWE) · OCTOBER 2026</div>
        <h1 className="font-display text-[112px] mt-6">
          <span className="text-[#ffe17c]">2027</span> Web & Systems Plan
        </h1>
        <p className="mt-6 max-w-[860px] text-[21px] leading-[1.45] text-[#b7c6c2]">
          What we roll out in Q4 2026, what we build in 2027, and the budget it needs, for 7 company websites and 2 internal portals.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {stats.map(([big, text], i) => (
          <div key={text} className={`border-2 bg-[#222a24] p-[22px] ${i === 2 ? 'border-[#ffe17c]' : 'border-[#3a463f]'}`}>
            <div className="font-display text-[60px] text-[#ffe17c]">{big}</div>
            <div className="mt-2 text-[17px] font-semibold">{text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Company({ c, n }) {
  const yearly = HOSTING + CLOUD + (c.extra || []).reduce((a, [, v]) => a + v, 0)
  return (
    <Frame>
      <Head eyebrow={`COMPANY WEBSITE · ${n} / ${COMPANIES.length}`} title={c.name} pill={c.url || '[CMK website URL]'} />
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <YearCard year="2026" label="Q4 2026 ROLLOUT" variant="outline" footer={WEB_GOAL}>
          <Rows rows={c.y26} tagWidth={92} variant="outline" />
        </YearCard>
        <YearCard year="2027" label="THE PLAN" variant="ink" footer={WEB_TARGETS}>
          <Rows rows={c.y27} tagWidth={40} variant="ink" />
        </YearCard>
      </div>
      <BudgetStrip
        label={['2027 BUDGET', 'Yearly, per company']}
        items={[['Hosting (KL Host)', HOSTING], ['Cloud, DNS & SSL', CLOUD], ...(c.extra || [])]}
        total={rm(yearly)}
        totalNote="PER YEAR · RECURRING"
      />
    </Frame>
  )
}

function HrPortal() {
  return (
    <Frame theme="dark">
      <Head theme="dark" eyebrow="INTERNAL SYSTEM · 1 / 2" title="KLAE Group HR Portal" pill="All 7 companies" />
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <YearCard year="2026" label="PHASE 1 & 2" variant="deep">
          <Groups groups={[
            ['Phase 1 · Live', ['HR module: staff profiles, leave & claims', 'Company module', 'Asset register']],
            ['Phase 2 · 4–30 Nov 2026', ['Booking', 'OBR requisition', 'Ticketing']],
          ]} />
        </YearCard>
        <YearCard year="2027" label="THE PLAN" variant="paper" footer="NEW = suggestion, not yet in the roadmap">
          <Rows variant="paper" tagWidth={44} rows={[
            ['Q1', 'Company licence & certificate tracker (DOSH, CIDB, ST, insurance, domains, SSL) with email alerts 60 & 30 days before expiry'],
            ['Q1', 'Staff certificate expiry alerts (CIDB green card, NIOSH, safety passport) linked to each staff profile'],
            ['Q1', 'Email alerts for asset warranty & software licence expiry'],
            ['Q4', 'Director dashboard + documentation & handover runbooks'],
            ['NEW', 'Staff onboarding / offboarding checklist: accounts, laptop & assets returned'],
            ['NEW', 'Mobile-friendly approvals for leave, claims & OBR'],
          ]} />
        </YearCard>
      </div>
      <BudgetStrip
        label={['2027 BUDGET', 'Shared with Sales Portal']}
        items={[['New Synology DS925+, 2× 8TB (RAID 1)', NAS], ['16GB ECC RAM upgrade', RAM]]}
        total={rm(NAS + RAM)}
        totalNote="ONE-TIME ASSET"
      />
    </Frame>
  )
}

function SalesPortal() {
  return (
    <Frame theme="dark">
      <Head theme="dark" eyebrow="INTERNAL SYSTEM · 2 / 2" title="KLAE Group Sales Portal" />
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <YearCard year="2026" label="PHASE 2" variant="deep" footer="Base in place for the 2027 sales modules.">
          <Groups groups={[['Phase 2 · Nov 2026', ['Booking', 'OBR requisition', 'Ticketing']]]} />
        </YearCard>
        <YearCard year="2027" label="THE PLAN" variant="paper" footer="Targets: Excel quotations retired · standard quote ready in < 15 minutes">
          <Rows variant="paper" tagWidth={44} rows={[
            ['Q2', 'Shared customer & product catalogue: one list for all 7 companies'],
            ['Q2', 'Quotation generator replacing Excel: auto numbering, approval flow, branded PDF per company'],
            ['Q3', 'Field service reports on mobile: photos, checklist, customer signature, auto PDF'],
            ['Q4', 'Director dashboard: quotations issued & won per company, web leads'],
            ['NEW', 'Follow-up reminders for open quotations'],
            ['NEW', 'Sales pipeline view: lead → quote → won / lost'],
          ]} />
        </YearCard>
      </div>
      <BudgetStrip
        label={['2027 BUDGET', 'Combined with HR Portal']}
        items={[['Runs on the same new Synology DS925+ budgeted under the HR Portal', null]]}
        total="RM 0"
        totalNote="NO EXTRA COST"
      />
    </Frame>
  )
}

function Ideas() {
  return (
    <Frame theme="yellow">
      <Head eyebrow="IDEAS · NOT YET IN THE PLAN" title="Ideas for 2027" />
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {IDEAS.map(({ icon: Icon, title, text, cost }) => (
          <div key={title} className="flex flex-col gap-2 bg-[#fffbea] border-2 border-[#171e19] p-[20px]">
            <div className="flex items-center gap-3">
              <Icon size={24} className="shrink-0" />
              <h3 className="text-[20px] font-bold leading-tight">{title}</h3>
            </div>
            <p className="text-[17px] leading-[1.45] text-[#2c332e]">{text}</p>
            <span className="mt-auto self-start font-mono text-[12px] font-bold bg-[#171e19] text-[#ffe17c] px-2 py-1">{cost}</span>
          </div>
        ))}
      </div>
    </Frame>
  )
}

function BudgetList({ items, variant, total }) {
  const dark = variant === 'ink'
  return (
    <div className="flex flex-col">
      {items.map(([name, v, cat, short]) => (
        <div key={name} className={`flex justify-between items-baseline gap-4 py-[8px] border-b ${dark ? 'border-[#3a463f]' : 'border-[#171e19]/15'}`}>
          <span className="text-[16px]">
            {short || name}
            {cat === 'monthly' && <span className={`font-mono text-[12px] ml-2 ${dark ? 'text-[#b7c6c2]' : 'text-[#4b5650]'}`}>{rm(Math.round(v / 12))}/mo × 12</span>}
          </span>
          <span className="font-mono text-[16px] font-bold whitespace-nowrap">{rm(v)}</span>
        </div>
      ))}
      <div className={`flex justify-between gap-4 pt-[12px] font-bold ${dark ? 'text-[#ffe17c]' : ''}`}>
        <span className="font-mono text-[14px] tracking-[0.12em]">SUBTOTAL</span>
        <span className="font-mono text-[18px]">{rm(total)}</span>
      </div>
    </div>
  )
}

function Budget() {
  const assets = subtotal(ASSETS)
  const yearly = subtotal(YEARLY)
  const sub = assets + yearly
  return (
    <Frame>
      <Head eyebrow="BUDGET 2027 · ASSETS VS YEARLY" title="2027 Budget" pill="Recommended scenario" />
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <YearCard year="Assets" label="ONE-TIME PURCHASE, OWNED BY THE COMPANY" variant="outline">
          <BudgetList items={ASSETS} variant="outline" total={assets} />
        </YearCard>
        <YearCard year="Yearly" label="RECURRING, CARRIES INTO 2028" variant="ink">
          <BudgetList items={YEARLY} variant="ink" total={yearly} />
        </YearCard>
      </div>
      <BudgetStrip
        label={['2027 TOTAL', 'Assets + yearly']}
        items={[['Assets', assets], ['Yearly', yearly], [`Contingency ${CONTINGENCY * 100}%`, Math.round((TOTAL - sub) * 100) / 100]]}
        total={rm(TOTAL)}
        totalNote="TOTAL 2027"
      />
      <p className="text-[14px] text-[#4b5650]">
        Contingency covers price changes, exchange rate and SST. UPS for the NAS is not included: it falls under the Infrastructure budget.
        Lean option: 1× 8TB drive (no RAID 1) saves {rm(LEAN_SAVING)} before contingency, but a single drive failure would lose data.
      </p>
    </Frame>
  )
}

const SLIDES = [
  { title: 'Cover', render: () => <Cover /> },
  ...COMPANIES.map((c, i) => ({ title: c.name, render: () => <Company c={c} n={i + 1} /> })),
  { title: 'HR Portal', theme: 'dark', render: () => <HrPortal /> },
  { title: 'Sales Portal', theme: 'dark', render: () => <SalesPortal /> },
  { title: 'Ideas for 2027', render: () => <Ideas /> },
  { title: '2027 Budget', render: () => <Budget /> },
]

/* ----------------------------- VIEWER ----------------------------- */

const pad = (n) => String(n).padStart(2, '0')

function PageNo({ n, theme }) {
  return (
    <div className={`absolute right-[84px] bottom-[16px] font-mono text-[12px] pointer-events-none ${theme === 'dark' ? 'text-[#b7c6c2]' : 'text-[#4b5650]'}`}>
      SWE · 2027 PLAN — {pad(n)} / {pad(SLIDES.length)}
    </div>
  )
}

const Slide = ({ i }) => (
  <div className="slide">
    {SLIDES[i].render()}
    {i > 0 && <PageNo n={i + 1} theme={SLIDES[i].theme} />}
  </div>
)

const initialIndex = () => {
  const n = parseInt(window.location.hash.slice(1), 10)
  return n >= 1 && n <= SLIDES.length ? n - 1 : 0
}

export default function Slides() {
  const [idx, setIdx] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const stage = useRef(null)

  const go = (d) => setIdx((i) => Math.min(SLIDES.length - 1, Math.max(0, i + d)))

  useEffect(() => {
    history.replaceState(null, '', `#${idx + 1}`)
  }, [idx])

  useEffect(() => {
    const onKey = (e) => {
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(1) }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1) }
      if (e.key === 'Home') setIdx(0)
      if (e.key === 'End') setIdx(SLIDES.length - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const el = stage.current
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      const margin = document.fullscreenElement ? 0 : 32
      setScale(Math.max(0.1, Math.min((width - margin) / 1280, (height - margin) / 720)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const btn = 'inline-flex items-center gap-2 border border-[#b7c6c2]/30 px-3 py-2 hover:bg-[#ffe17c] hover:text-[#171e19] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit'

  return (
    <>
      <div className="print:hidden h-screen flex flex-col bg-[#0f1411] text-[#f4f3ee]">
        <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#b7c6c2]/20 font-mono text-xs font-bold">
          <a href="./" className={btn}><ArrowLeft size={14} /> FULL WEBSITE</a>
          <span className="text-[#b7c6c2]">{pad(idx + 1)} / {pad(SLIDES.length)} · {SLIDES[idx].title.toUpperCase()}</span>
          <div className="flex gap-2">
            <button className={btn} onClick={() => go(-1)} disabled={idx === 0} aria-label="Previous slide"><ChevronLeft size={14} /></button>
            <button className={btn} onClick={() => go(1)} disabled={idx === SLIDES.length - 1} aria-label="Next slide"><ChevronRight size={14} /></button>
            <button className={btn} onClick={() => stage.current.requestFullscreen?.()}><Maximize size={14} /> PRESENT</button>
            <button className="inline-flex items-center gap-2 bg-[#ffe17c] text-[#171e19] px-3 py-2 hover:-translate-y-0.5" onClick={() => window.print()}>
              <Printer size={14} /> PRINT / SAVE PDF
            </button>
          </div>
        </header>

        <div ref={stage} className="flex-1 min-h-0 flex items-center justify-center bg-[#0f1411] overflow-hidden">
          <div style={{ width: 1280 * scale, height: 720 * scale }} className="shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
              <Slide i={idx} />
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center gap-1.5 px-4 py-3 border-t border-[#b7c6c2]/20">
          {SLIDES.map((s, i) => (
            <button key={s.title} onClick={() => setIdx(i)} title={s.title}
              className={`font-mono text-xs w-8 h-8 border border-[#b7c6c2]/30 ${i === idx ? 'bg-[#ffe17c] text-[#171e19] font-bold' : 'hover:bg-[#ffe17c]/20'}`}>
              {i + 1}
            </button>
          ))}
        </nav>
      </div>

      <div className="print-deck hidden print:block">
        {SLIDES.map((s, i) => <Slide key={s.title} i={i} />)}
      </div>
    </>
  )
}
