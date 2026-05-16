<div align="center">

# ⚡ AtomSync Portal

### Institutional-Grade Goal Setting & Performance Analytics Platform

*Built for AtomQuest Hackathon 1.0 — Atomberg Technologies*

<br/>

[![Live on Vercel](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://atomsync-portal.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<br/>

[Live Demo](#-live-demo) · [Features](#-features) · [Architecture](#-architecture) · [Scoring Engine](#-scoring-engine) · [Setup](#-local-setup)

</div>

---

## 📌 Overview

**AtomSync Portal** is a full-stack, enterprise-grade OKR (Objectives & Key Results) platform engineered to bring institutional-level goal management to modern organizations. It provides a unified environment for employees to define quarterly blueprints, managers to steer team trajectories, and administrators to enforce organizational cadence — all backed by a robust audit trail and real-time analytics.

Built on the **"Technological Noir"** design philosophy, AtomSync delivers a command-center aesthetic rather than generic HR software — with deep glassmorphism, kinetic micro-interactions, and a data-legible monospaced type system.

---

## 🌐 Live Demo

**[https://atomsync-portal.vercel.app/](https://atomsync-portal.vercel.app/)**

Use the following demo accounts to explore the full Role-Based Access Control (RBAC) system:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `admin@atomberg.com` | `demo123` | Cycle management, audit trails, shared goals, analytics |
| **Manager** | `manager@atomberg.com` | `demo123` | Goal approvals, team analytics, quarterly check-ins |
| **Employee** | `employee@atomberg.com` | `demo123` | Goal creation, achievement logging, performance tracking |

---

## ✨ Features

### 🎯 Goal Management (Personal Blueprint)
The core engine for employees to define and execute their quarterly or annual objectives.

- **Structured Creation** — Define goals across configurable *Thrust Areas* (e.g., Innovation, Operational Excellence, Customer Focus).
- **Granular Measurement** — Support for 6 distinct Units of Measurement (UoM), from numeric targets to boolean zero-tolerance metrics.
- **Weightage Validation** — Built-in enforcement ensures a goal sheet totals exactly 100% before submission.
- **State Locking** — Approved blueprints are locked. Any modification requires a formal, auditable unlock sequence.

### 👥 Manager Workflow
A dedicated interface for managers to review and steer their team's performance.

- **Approval Pipeline** — Review submitted blueprints and either **Approve** (locking goals) or **Return for Rework** with structured comments.
- **Quarterly Check-ins** — Log structured, quarter-specific feedback for individual team members, capturing the narrative behind the numbers.

### 📊 Analytics Intelligence
A sophisticated dashboard that translates raw performance data into strategic insights.

- **Thrust Area Momentum (Kinetic Fan)** — A custom SVG fan chart mapping goal distribution across the company's strategic pillars.
- **Enterprise Topology Heatmap** — A visual matrix displaying Quarter-over-Quarter (QoQ) completion rates for every operative, color-coded for instant readouts.
- **Velocity Index** — Area charts tracking organizational momentum and average achievement scores over time.
- **Leadership Impact Score** — A horizontal bar chart quantifying manager effectiveness based on the frequency and quality of employee check-ins.

### 🛡️ Admin Control Center
Superuser tooling to maintain organizational cadence and compliance.

- **Cycle Management** — Activate and deactivate performance cycles (e.g., *FY 26-27 Q1*). The system enforces date windows, preventing unauthorized submissions outside active periods.
- **Immutable Audit Trail** — A tamper-proof, system-wide log tracking every action: goal updates, sheet approvals, check-in submissions. All timestamps are localized to IST (`Asia/Kolkata`).
- **Shared Goals Deployment** — Push unified, non-editable KPIs from the Admin tier to multiple operatives simultaneously, ensuring organizational alignment.

### ⚡ Automation & Notifications
- **Transactional Email (Resend)** — Automated email notifications are dispatched when goals are submitted, approved, or returned for rework.
- **Escalation Rules** — Configurable auto-reminders for overdue actions (e.g., alerting managers to pending approvals past SLA).

---

## 📐 Scoring Engine

Performance is not linear. AtomSync calculates achievement scores dynamically based on the selected Unit of Measurement (UoM):

| UoM Type | Computation Logic | Example |
|----------|-------------------|---------|
| **Numeric Min** | `(actual ÷ target) × 100` | Revenue: Target ₹10L, Actual ₹8L → **80%** |
| **Numeric Max** | `(target ÷ actual) × 100` | Defects: Target 5, Actual 3 → **100%** *(lower is better)* |
| **Percentage Min** | Direct comparison | Satisfaction: Target 90%, Actual 85% → **94%** |
| **Percentage Max** | Inverse comparison | Attrition: Target 5%, Actual 3% → **100%** |
| **Timeline** | `(planned_days ÷ actual_days) × 100` | Delivery: Planned 30d, Actual 25d → **100%** |
| **Zero Tolerance** | `actual === 0 ? 100 : 0` | Safety Incidents: Target 0, Actual 0 → **100%** |

---

## 🏗️ Architecture

### Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, React 19) |
| **Language** | TypeScript 5 |
| **Database & Auth** | [Supabase](https://supabase.com/) — PostgreSQL + Row Level Security + Supabase Auth |
| **Styling** | Vanilla CSS Design System — Glassmorphism, CSS Custom Properties |
| **Data Visualization** | [Recharts](https://recharts.org/) + Custom SVG Elements |
| **Form Handling** | React Hook Form + Zod v4 |
| **Email** | [Resend API](https://resend.com/) |
| **Deployment** | [Vercel](https://vercel.com/) |

### Database Schema

The backend is powered by a fully relational PostgreSQL database with 10 core tables and comprehensive Row Level Security policies:

| Table | Purpose |
|-------|---------|
| `profiles` | RBAC role mapping (Admin, Manager, Employee) |
| `cycles` | Temporal management for goal-setting windows |
| `thrust_areas` | Strategic organizational pillars |
| `goal_sheets` | Container for an employee's seasonal goals |
| `goals` | Individual objectives with targets and weightages |
| `achievements` | Quarterly tracking of actual performance against goals |
| `check_ins` | Structured managerial feedback logs |
| `audit_log` | Immutable, append-only history of all system state changes |
| `escalation_rules` | Trigger configuration for overdue notifications |
| `escalation_log` | Historical record of all fired escalation events |

> See [`supabase/schema.sql`](./supabase/schema.sql) for the complete DDL, seed data, and RLS policy definitions.

---

## 💻 Local Setup

### Prerequisites

- **Node.js** v18 or higher
- A **[Supabase](https://supabase.com/)** project (free tier is sufficient)
- A **[Resend](https://resend.com/)** API key (for email notifications)

### 1. Clone the Repository

```bash
git clone https://github.com/mahaboob2603/atomsync-portal.git
cd atomsync-portal
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and populate it with your credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_supabase_anon_key"
RESEND_API_KEY="your_resend_api_key"
```

### 3. Bootstrap the Database

1. Open your **Supabase Dashboard** and navigate to the **SQL Editor**.
2. Copy the full contents of [`supabase/schema.sql`](./supabase/schema.sql).
3. Execute the script. This will create all tables, insert the initial demo data, and configure all RLS security policies automatically.

### 4. Run the Development Server

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to access the portal.

---

## 🎨 Design System

AtomSync is built on the **"Technological Noir"** aesthetic — engineered to feel like an institutional command center rather than conventional HR software.

| Token | Value | Usage |
|-------|-------|-------|
| **Background** | `#0a0a0a` | Deep charcoal base |
| **Accent** | `#fdb913` | Signal Gold — directs user focus |
| **Glass Effect** | `backdrop-filter: blur(20px)` | Floating module surfaces |
| **Body Font** | `Geist` | UI text and labels |
| **Mono Font** | `JetBrains Mono` | Numeric data and KPIs |

Key interaction patterns include: state-reactive hover glows on data modules, pulsing badges for active cycles, and animated deploy confirmations — all designed to provide immediate tactile feedback and reinforce the premium, data-driven feel of the platform.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

<div align="center">
  <sub>Engineered for performance. Designed for impact.</sub>
</div>
