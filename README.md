<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/target.svg" alt="AtomSync Logo" width="80" height="80">
  <h1 align="center">AtomSync Portal</h1>
  <p align="center"><strong>Institutional Grade Goal Setting & Analytics Platform</strong></p>
  <p align="center"><em>Engineered for AtomQuest Hackathon 1.0 by Atomberg Technologies</em></p>

  <p align="center">
    <a href="https://atomsync-portal.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/Live_Deployment-Vercel-000000?style=for-the-badge&logo=vercel" alt="Live Deployment">
    </a>
  </p>

  <p align="center">
    <a href="#-live-demo--accounts">Live Demo</a> •
    <a href="#-the-technological-noir-experience">UI/UX</a> •
    <a href="#-comprehensive-feature-breakdown">Features</a> •
    <a href="#-uom-scoring-engine">Scoring</a> •
    <a href="#-local-setup--deployment">Setup</a>
  </p>
</div>

---

## 🌍 Live Demo & Accounts

Experience the AtomSync Portal live: **[https://atomsync-portal.vercel.app/](https://atomsync-portal.vercel.app/)**

To explore the full Role-Based Access Control (RBAC) capabilities, use the following demo credentials:

| Designation | Authentication ID | Passkey | Capabilities |
|-------------|-------------------|---------|--------------|
| **System Admin**| `admin@atomberg.com` | `demo123` | Cycle Management, Audit Trails, Shared Goals, Analytics |
| **Manager** | `manager@atomberg.com` | `demo123` | Goal Approvals, Team Analytics, Quarterly Check-ins |
| **Operative** | `employee@atomberg.com` | `demo123` | Goal Creation, Achievement Logging, Performance Tracking |

---

## 🕶️ The "Technological Noir" Experience

AtomSync is designed to feel less like standard HR software and more like an **Institutional Command Center**. 

*   **Color Palette:** Built on a foundation of deep charcoal (`#0a0a0a`) backgrounds with vibrant **Signal Gold** (`#fdb913`) accents to direct focus.
*   **Advanced Glassmorphism:** Modules float above the background utilizing deep blur effects (`backdrop-filter: blur(20px)`), subtle gradient borders, and state-reactive hover glows.
*   **Institutional Typography:** Structured using `Geist` and `JetBrains Mono` for maximum data legibility, giving numerical data a precise, monospaced layout.
*   **Kinetic Micro-Interactions:** Subtle animations, such as glowing deploy buttons and pulsing active cycle badges, provide immediate tactile feedback.

---

## ✨ Comprehensive Feature Breakdown

### 🎯 1. Personal Blueprint (Goal Management)
The core engine for employees to define and execute their quarterly or annual objectives.
*   **Smart Creation:** Define goals across specific *Thrust Areas* (e.g., Innovation, Operational Excellence).
*   **Granular Metrics:** Support for 6 distinct Units of Measurement (UoM), from pure numeric targets to boolean (Zero Tolerance) metrics.
*   **Weightage Validation:** Built-in safeguards ensure that the total weightage of a goal sheet equals exactly 100% before submission.
*   **State Locking:** Once a blueprint is approved by a manager, it is cryptographically "locked." Edits require a formal, auditable unlock sequence.

### 👥 2. Managerial Command Workflow
Managers have a dedicated interface to review and steer their team's trajectory.
*   **Approval Pipeline:** Review submitted blueprints. Managers can either **Approve** (locking the goals) or **Return for Rework** with attached comments.
*   **Quarterly Check-ins:** A dedicated module to log structured, quarter-specific feedback for individual operatives, tracking the narrative behind the numbers.

### 📈 3. Analytics Intelligence
A highly sophisticated dashboard translating raw data into strategic insights.
*   **Thrust Area Momentum (Kinetic Fan):** A custom SVG fan chart representing the distribution of goals across the company's strategic pillars. Longer blades indicate heavier resource loading.
*   **Enterprise Topology Heatmap:** A visual matrix showing Quarter-over-Quarter (QoQ) completion rates for every operative, color-coded for instant performance readouts.
*   **Velocity Index:** Area charts tracking organizational momentum and average achievement scores across time.
*   **Leadership Impact Score:** A horizontal bar chart tracking manager effectiveness based on their frequency and quality of employee check-ins.

### 🛡️ 4. Institutional Control (Admin)
Superuser tools for maintaining organizational cadence and compliance.
*   **Cycle Control Center:** Activate and deactivate performance cycles (e.g., *FY 26-27 Q1 Check-in*). The system strictly enforces date-windows, preventing unauthorized submissions outside of active periods.
*   **Immutable Audit Trail:** A tamper-proof, system-wide log tracking every action—who updated what goal, when a sheet was approved, and when a check-in was logged. All timestamps are localized to IST (`Asia/Kolkata`).
*   **Shared Goals Deployment:** Push unified, non-editable KPIs from the Admin tier down to multiple operatives simultaneously to ensure organizational alignment.

### ⚡ 5. Automation & Infrastructure
*   **Resend Pipeline:** Transactional emails are automatically dispatched when goals are submitted, approved, or returned, keeping all parties instantly informed.
*   **Escalation Rules:** Configurable auto-reminders for overdue actions (e.g., alerting managers to pending approvals).

---

## 📊 UoM Scoring Engine

Performance isn't linear. AtomSync calculates achievement scores dynamically based on the selected Unit of Measurement:

| UoM Type | Computation Logic | Real-World Example |
|----------|-------------------|--------------------|
| **Numeric Min** | `(actual / target) × 100` | Revenue: Target ₹10L, Actual ₹8L → **80% Score** |
| **Numeric Max** | `(target / actual) × 100` | Defects: Target 5, Actual 3 → **100% Score** (Lower is better) |
| **Percentage Min** | Direct Comparison | Satisfaction: Target 90%, Actual 85% → **94% Score** |
| **Percentage Max** | Inverse Comparison | Attrition: Target 5%, Actual 3% → **100% Score** |
| **Timeline** | `(planned_days / actual_days) × 100` | Shipping: Planned 30d, Actual 25d → **100% Score** |
| **Zero Tolerance** | `actual === 0 ? 100 : 0` | Safety Incidents: Target 0, Actual 0 → **100% Score** |

---

## 🏗️ Technical Architecture

*   **Core Framework:** [Next.js 16](https://nextjs.org/) (App Router, React 19)
*   **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Supabase Auth)
*   **Styling:** Custom Vanilla CSS Design System (Glassmorphism, CSS Variables)
*   **Data Visualization:** [Recharts](https://recharts.org/) + Custom SVG Elements
*   **Form Management:** React Hook Form + Zod v4 (Strict type safety)
*   **Communications:** [Resend API](https://resend.com/)

---

## 🗃️ Database Schema

The backend is powered by a fully relational PostgreSQL database consisting of 10 core tables:

1.  `profiles`: RBAC mapping (Admin, Manager, Employee).
2.  `cycles`: Temporal management for goal-setting windows.
3.  `thrust_areas`: Strategic organizational pillars.
4.  `goal_sheets`: The container for an employee's seasonal goals.
5.  `goals`: Individual objectives with targets and weightages.
6.  `achievements`: Quarterly tracking against specific goals.
7.  `check_ins`: Managerial feedback logs.
8.  `audit_log`: The immutable history of all system state changes.
9.  `escalation_rules`: Triggers for overdue notifications.
10. `escalation_log`: History of fired escalations.

*(See `supabase/schema.sql` for the complete DDL and Row Level Security policies).*

---

## 💻 Local Setup & Deployment

### Prerequisites
*   Node.js 18+
*   A [Supabase](https://supabase.com/) Account (Free tier works perfectly)
*   A [Resend](https://resend.com/) Account (For email notifications)

### 1. Repository Setup
```bash
git clone https://github.com/mahaboob2603/atomsync-portal.git
cd atomsync-portal
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Populate it with your keys:
```env
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_supabase_anon_key"
RESEND_API_KEY="your_resend_api_key"
```

### 3. Database Bootstrapping
1. Log into your Supabase Dashboard.
2. Navigate to the **SQL Editor**.
3. Copy the entire contents of `supabase/schema.sql`.
4. Run the script. This will instantly build all tables, insert the initial demo data, and establish the RLS security policies.

### 4. Ignition
```bash
npm run dev
```
Navigate to `http://localhost:3000` to access the portal.

---

<div align="center">
  <p><strong>MIT License</strong> — <em>Engineered for performance. Designed for impact.</em></p>
</div>
