# AtomSync Portal — Goal Setting & Tracking Platform

> Built for **AtomQuest Hackathon 1.0** by Atomberg Technologies

AtomSync is a comprehensive **Goal Setting, Tracking, and Performance Management Portal** designed for organizations that follow a quarterly OKR / MBO framework. It supports full lifecycle goal management — from drafting through manager approval, quarterly achievement tracking, scoring via multiple UoM types, and organizational reporting.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, React 19) |
| **Database** | Supabase (PostgreSQL + Auth + RLS) |
| **Styling** | Custom CSS Design System (glassmorphism, dark mode) |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod v4 |
| **Email** | Resend (transactional notifications) |
| **Deployment** | Vercel |

---

## ✨ Features

### Core Modules
- **Role-Based Access** — Employee, Manager, Admin with per-role dashboards
- **Goal Smart Form** — Thrust Area, Title, UoM (6 types), Target, Weightage with cross-goal validation
- **Manager Approval Workflow** — Submit → Review → Approve/Return with comments
- **Quarterly Achievement Tracking** — Planned vs Actual with UoM-based scoring
- **Manager Check-ins** — Structured feedback per quarter per employee

### Admin & Reporting
- **Cycle Management** — Create/activate performance cycles
- **Shared Goals** — Push KPIs from Admin to multiple employees
- **Audit Trail** — Complete change log for compliance
- **Reports** — CSV export, completion heatmaps
- **Analytics Dashboard** — QoQ trends, thrust area distribution, manager effectiveness

### Bonus
- **Escalation Rules** — Configurable auto-reminders for overdue actions
- **Email Notifications** — Auto-emails on submit/approve/return via Resend
- **Lock Enforcement** — Goals locked after approval; edits require unlock

---

## 📊 UoM Scoring System

| UoM Type | Formula | Example |
|----------|---------|---------|
| Numeric Min | `(target / actual) × 100` | Revenue target: ₹10L, actual: ₹8L → 80% |
| Numeric Max | `(actual / target) × 100` (inverted) | Defects target: 5, actual: 3 → 100% |
| Percentage Min | Direct comparison | Satisfaction: 90% target, 85% actual → 94% |
| Percentage Max | Inverse comparison | Attrition: 5% target, 3% actual → 100% |
| Timeline | `(planned_days / actual_days) × 100` | 30 days planned, 25 actual → 100% |
| Zero | `actual === 0 ? 100 : 0` | Safety incidents: target 0, actual 0 → 100% |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account

### Setup

```bash
# Clone
git clone https://github.com/mahaboob2603/atomsync-portal.git
cd atomsync-portal

# Install dependencies
npm install

# Create .env.local with your Supabase credentials
cp .env.example .env.local

# Run the database schema
# Copy supabase/schema.sql into your Supabase SQL editor and execute

# Start dev server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key (optional)
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── actions/          # Server Actions (goals, achievements, admin, auth)
│   ├── dashboard/        # Role-based dashboard pages
│   │   ├── goals/        # Employee goal management
│   │   ├── team-goals/   # Manager approval workflow
│   │   ├── checkins/     # Quarterly check-ins
│   │   ├── all-goals/    # Admin global view
│   │   ├── analytics/    # Performance analytics
│   │   ├── reports/      # CSV export & heatmaps
│   │   ├── cycles/       # Cycle management
│   │   ├── escalation/   # Escalation rules
│   │   └── audit/        # Audit trail
│   ├── login/            # Authentication
│   └── page.tsx          # Landing page
├── components/           # Reusable UI components
├── lib/
│   ├── supabase/         # Client/server/middleware helpers
│   ├── validations.ts    # Zod schemas
│   ├── scoring.ts        # UoM computation engine
│   ├── email.ts          # Resend email templates
│   ├── types.ts          # TypeScript interfaces
│   └── utils.ts          # Helper utilities
└── middleware.ts         # Auth session refresh
```

---

## 🗃️ Database Schema

10 tables with full relational integrity:
`profiles` · `cycles` · `thrust_areas` · `goal_sheets` · `goals` · `achievements` · `check_ins` · `audit_log` · `escalation_rules` · `escalation_log`

See [`supabase/schema.sql`](./supabase/schema.sql) for the complete DDL.

---

## 👥 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Employee | employee@atomberg.com | demo123 |
| Manager | manager@atomberg.com | demo123 |
| Admin | admin@atomberg.com | demo123 |

---

## 📄 License

MIT — Built with ❤️ for AtomQuest Hackathon 1.0
