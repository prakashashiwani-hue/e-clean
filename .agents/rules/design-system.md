# E-Clean — Reusable Design System

Use this exact design system for all UI — do not deviate from these values:

## COLOR PALETTE (light mode):
- Background: #FAFBF8 (near-white, faint green tint)
- Surface: #F5F8F3 (slightly deeper off-white for section backgrounds)
- Card: #FFFFFF, with soft shadow, never flat/borderless
- Text (foreground): #23302A (deep green-charcoal, not pure black)
- Primary: #2E7D4F (medium forest green — main buttons, active states, headers)
- Primary text-on-primary: #FCFEFA (near white)
- Secondary surface: #E8F0E5 (soft mint — secondary buttons, chip backgrounds)
- Secondary text: #3A5A44
- Muted surface: #F2F5F0 (subtle backgrounds, disabled states)
- Muted text: #6B7A70 (secondary/caption text)
- Accent: #DCEBD9 (light green — highlighted cards, selected states)
- Accent text: #33502F
- Success: #2F9E5C (resolved status, positive states)
- Warning: #E3A93A (amber — in-progress, medium priority)
- Destructive/Critical: #D64545 (red — urgent, escalated, errors)
- Border: #DCE3D8 (hairline borders on cards/inputs, very subtle)
- Chart accent (5th series / info): #5B8AA6 (muted blue, for neutral data points)

## TYPOGRAPHY:
- Headings (H1/H2/H3, screen titles, KPI numbers): "Sora" — geometric, slightly rounded, confident display font, tight letter-spacing (-0.02em)
- Body text, labels, buttons: "Plus Jakarta Sans" — clean modern humanist sans
- Never use generic Arial/Helvetica-looking type — must have the distinct rounded-geometric character of Sora + Plus Jakarta Sans

## SHAPE & DEPTH:
- Corner radius: consistently rounded, ~14px on cards/inputs, ~18-22px on larger containers/modals, fully pill-shaped (999px) on badges and status chips
- Shadows: soft, diffused, colored shadow using a dark-green tint (not pure black) — like a soft glow beneath cards, e.g. "0 12px 32px rgba(46,90,60,0.15)"
- No hard borders as the primary separator — prefer shadow + whitespace, use hairline borders (#DCE3D8) only where needed for tables/dividers

## COMPONENT PATTERNS:
- Buttons: solid primary green with white text, fully rounded corners, no sharp edges; secondary buttons use mint background with dark green text
- Status badges: small pill shapes — green bg/text for Resolved, amber for In Progress, red for Urgent/Escalated, gray/muted for Pending
- Cards: white background, soft green-tinted shadow, generous internal padding
- Icons: single consistent icon set (Phosphor or Lucide style, 1.5px stroke weight), colored to match the semantic state (green/amber/red/muted)
- Gradient accents (used sparingly, for hero sections/headers only): diagonal 135° gradient from #2E7D4F to a deeper teal-green #2A4A3E

## MOOD:
- Premium SaaS/fintech-level polish applied to civic-tech — trustworthy, clean, confident, modern. Never generic clip-art, never a default admin-panel template look.
