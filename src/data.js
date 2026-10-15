/* Budget data shared by the website (App.jsx) and the presentation (Slides.jsx) */

// Item: [name, RM per year, category, optional short label used on the slides]
export const SCENARIOS = {
  rec: {
    label: 'Recommended: High Reliability',
    items: [
      ['Synology DS925+ with 2x 8TB HDD (RAID 1 Redundancy)', 8290, 'asset', 'Synology DS925+ with 2× 8TB HDD (RAID 1)'],
      ['16GB ECC RAM Upgrade', 480, 'asset'],
      ['Dual Monitors (MSI 27" + MSI 24.5")', 748.2, 'asset'],
      ['ChatGPT Plus Subscription', 1044, 'monthly'],
      ['SEO Tool – 1 month for Q4 competitor audit (Mangools / Ubersuggest)', 130, 'yearly', 'SEO tool, 1 month for the Q4 audit'],
      ['KL Host Web Hosting – 7 sites (existing renewal)', 2310, 'yearly', 'Web hosting, 7 sites (KL Host)'],
      ['BillPlz Payment Gateway (existing renewal)', 150, 'yearly', 'BillPlz payment gateway (KLAE PLT)'],
    ],
    note: 'Full data redundancy. A single HDD failure costs zero data.',
  },
  lean: {
    label: 'Lean Baseline',
    items: [
      ['Synology DS925+ with 1x 8TB HDD (no RAID 1)', 6195, 'asset'],
      ['16GB ECC RAM Upgrade', 480, 'asset'],
      ['Dual Monitors (MSI 27" + MSI 24.5")', 748.2, 'asset'],
      ['ChatGPT Plus Subscription', 1044, 'monthly'],
      ['SEO Tool (Q4 audit with free Google tools only)', 0, 'yearly'],
      ['KL Host Web Hosting – 7 sites (existing renewal)', 2310, 'yearly'],
      ['BillPlz Payment Gateway (existing renewal)', 150, 'yearly'],
    ],
    note: 'carries NO drive redundancy: if the HDD fails, the data on it is lost.',
  },
}

export const CATEGORIES = [
  { key: 'asset', label: 'Assets', hint: 'One-time purchase, owned by the company' },
  { key: 'monthly', label: 'Monthly subscriptions', hint: 'Billed every month, shown as monthly × 12' },
  { key: 'yearly', label: 'Yearly renewals', hint: 'One-off payment once a year' },
]

export const CONTINGENCY = 0.1

export const subtotal = (items) => items.reduce((a, [, v]) => a + v, 0)
export const grandTotal = (items) => Math.round(subtotal(items) * (1 + CONTINGENCY) * 100) / 100

export const rm = (n) => 'RM ' + n.toLocaleString('en-MY', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })
