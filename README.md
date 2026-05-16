<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/target.svg" alt="AtomSync Logo" width="80" height="80">
  <h1 align="center">AtomSync Portal</h1>
  <p align="center"><strong>Institutional Grade Goal Setting & Analytics Platform</strong></p>
  <p align="center"><em>Built for AtomQuest Hackathon 1.0 by Atomberg Technologies</em></p>

  <p align="center">
    <a href="#-the-technological-noir-experience">UI/UX</a> •
    <a href="#-core-architecture">Architecture</a> •
    <a href="#-feature-matrix">Features</a> •
    <a href="#-uom-scoring-engine">Scoring</a> •
    <a href="#-deployment--setup">Setup</a>
  </p>
</div>

---

## 🕶️ The "Technological Noir" Experience

AtomSync isn't just a dashboard; it's a **Command Center**. Redesigned with a premium "Technological Noir" aesthetic, the portal utilizes deep charcoal backgrounds (`#0a0a0a`), vibrant *Signal Gold* accents (`#fdb913`), and advanced glassmorphism.

*   **Institutional Typography:** Powered by `Geist` and `JetBrains Mono` for maximum data legibility.
*   **Dynamic Glass Modules:** Frosted glass panels with subtle gradient borders that respond to user interaction.
*   **Data Density:** High-contrast visualizations, including the custom "Thrust Area Momentum" kinetic fan chart.

---

## 🏗️ Core Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Core Framework** | Next.js 16 (App Router) | Server Components & Routing |
| **Database & Auth** | Supabase (PostgreSQL) | RLS, Authentication, Realtime |
| **Styling Engine** | Custom CSS | Glassmorphism, CSS Variables, Keyframes |
| **Data Visualization**| Recharts | Interactive Area, Bar, and custom SVG charts |
| **Form Management** | React Hook Form + Zod | Strict validation & type safety |
| **Comms pipeline** | Resend API | Transactional email notifications |

---

## ✨ Feature Matrix

### 🎯 Personal Blueprint (Goal Management)
*   **Smart Goal Creation:** Define goals by Thrust Area, Title, UoM (6 distinct types), Target, and Weightage.
*   **Total Validation:** Cross-goal validation ensures weightages always equal precisely 100%.
*   **Manager Workflow:** Submit blueprint → Review → Approve or Return with annotated feedback.

### 📈 Analytics Intelligence
*   **Thrust Area Momentum:** A custom kinetic fan visualization showing the distribution of strategic goals across organizational pillars.
*   **Enterprise Topology Heatmap:** A visual matrix showing QoQ completion rates for every operative.
*   **Velocity Index:** Area charts tracking Quarter-over-Quarter average achievement scores.

### 🛡️ Institutional Control (Admin & Managers)
*   **Cycle Control Center:** Activate and deactivate performance cycles (Q1, Q2, Annual) with strict date-window enforcement.
*   **Manager Check-ins:** Log structured quarterly feedback for direct reports.
*   **Immutable Audit Trail:** A complete, tamper-proof log (tracked in IST) of every goal change, approval, and system action.
*   **Shared Goals:** Administrators can push unified KPIs to multiple operatives simultaneously.

### ⚡ Automation & Infrastructure
*   **Notification Engine:** Automated emails via Resend when goals are submitted, approved, or returned.
*   **State Locking:** Goal sheets are strictly locked post-approval; edits require an explicit administrative unlock.
*   **Escalation Rules:** Configurable auto-reminders for overdue actions.

---

## 📊 UoM Scoring Engine

The portal calculates performance scores dynamically based on the selected Unit of Measurement:

| UoM Type | Computation Logic | Real-World Example |
|----------|-------------------|--------------------|
| **Numeric Min** | `(actual / target) × 100` | Revenue: Target ₹10L, Actual ₹8L → **80%** |
| **Numeric Max** | `(target / actual) × 100` | Defects: Target 5, Actual 3 → **100%** |
| **Percentage Min** | Direct Comparison | Satisfaction: Target 90%, Actual 85% → **94%** |
| **Percentage Max** | Inverse Comparison | Attrition: Target 5%, Actual 3% → **100%** |
| **Timeline** | `(planned_days / actual_days) × 100` | Shipping: Planned 30d, Actual 25d → **100%** |
| **Zero Tolerance** | `actual === 0 ? 100 : 0` | Safety Incidents: Target 0, Actual 0 → **100%** |

---

## 🚀 Deployment & Setup

### Prerequisites
*   Node.js 18+
*   Supabase Account
*   Resend Account (for email pipelines)

### Local Initialization

```bash
# 1. Clone the repository
git clone https://github.com/mahaboob2603/atomsync-portal.git
cd atomsync-portal

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
```

### Environment Configuration (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_supabase_anon_key"
RESEND_API_KEY="your_resend_api_key"
```

### Database Bootstrapping
1. Open your Supabase SQL Editor.
2. Copy the entire contents of `supabase/schema.sql`.
3. Execute the script to build the 10 relational tables, RLS policies, and core triggers.

### Ignition
```bash
npm run dev
```
Navigate to `http://localhost:3000` to access the portal.

---

## 👥 Demo Access Protocols

| Designation | Authentication ID | Passkey |
|-------------|-------------------|---------|
| **Operative** | `employee@atomberg.com` | `demo123` |
| **Manager** | `manager@atomberg.com` | `demo123` |
| **System Admin**| `admin@atomberg.com` | `demo123` |

---

<div align="center">
  <p><strong>MIT License</strong> — <em>Engineered for performance. Designed for impact.</em></p>
</div>
