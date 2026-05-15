# AtomSync Portal — Architecture

## System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                                │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                    Next.js 16 App Router                            │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │ │
│  │  │ Landing  │  │  Login   │  │Dashboard │  │  Role-Based      │   │ │
│  │  │  Page    │  │  Page    │  │  Layout  │  │  Navigation      │   │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘   │ │
│  │                                                                     │ │
│  │  ┌─────────────────────────────────────────────────────────────┐   │ │
│  │  │                    Dashboard Modules                         │   │ │
│  │  │  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │   │ │
│  │  │  │  Goals   │  │ Team     │  │ Check-ins│  │  Analytics  │  │   │ │
│  │  │  │ (CRUD)  │  │ Goals    │  │ & Achieve│  │  (Recharts) │  │   │ │
│  │  │  └─────────┘  └──────────┘  └──────────┘  └────────────┘  │   │ │
│  │  │  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │   │ │
│  │  │  │ Reports │  │  Audit   │  │ Cycles   │  │ Escalation  │  │   │ │
│  │  │  │ (CSV)   │  │  Trail   │  │ (Admin)  │  │  Module     │  │   │ │
│  │  │  └─────────┘  └──────────┘  └──────────┘  └────────────┘  │   │ │
│  │  └─────────────────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTPS / Server Actions
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        SERVER (Next.js SSR)                               │
│  ┌─────────────────────┐  ┌─────────────────┐  ┌──────────────────────┐ │
│  │  Middleware (Auth)   │  │ Server Actions   │  │  API Routes          │ │
│  │  • Session refresh   │  │ • goals.ts       │  │  • /api/seed         │ │
│  │  • Route protection  │  │ • achievements.ts│  │                      │ │
│  │  • Role-based access │  │ • auth.ts        │  │                      │ │
│  └─────────────────────┘  └─────────────────┘  └──────────────────────┘ │
│  ┌─────────────────────┐  ┌─────────────────┐  ┌──────────────────────┐ │
│  │  Validation (Zod)   │  │  Scoring Engine  │  │  Email Service       │ │
│  │  • 100% weightage   │  │  • Min/Max calc  │  │  • Resend API        │ │
│  │  • Min 10% per goal │  │  • Timeline      │  │  • Lazy-initialized  │ │
│  │  • Max 8 goals      │  │  • Zero-based    │  │  • Graceful fallback │ │
│  └─────────────────────┘  └─────────────────┘  └──────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Supabase Client SDK (SSR)
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        SUPABASE (Backend-as-a-Service)                    │
│  ┌─────────────────────┐  ┌──────────────────────────────────────────┐  │
│  │  Authentication      │  │  PostgreSQL Database                     │  │
│  │  • Email/Password    │  │  ┌──────────┐  ┌───────────┐            │  │
│  │  • Session mgmt      │  │  │ profiles │  │ cycles    │            │  │
│  │  • Row Level Security│  │  ├──────────┤  ├───────────┤            │  │
│  └─────────────────────┘  │  │goal_sheets│  │  goals    │            │  │
│                            │  ├──────────┤  ├───────────┤            │  │
│                            │  │achievemnts│  │ check_ins │            │  │
│                            │  ├──────────┤  ├───────────┤            │  │
│                            │  │audit_log │  │thrust_areas│           │  │
│                            │  ├──────────┤  ├───────────┤            │  │
│                            │  │escalation│  │escalation │            │  │
│                            │  │_rules    │  │_log       │            │  │
│                            │  └──────────┘  └───────────┘            │  │
│                            └──────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────┐   │
│  │  Row Level Security (RLS) Policies                                │   │
│  │  • Employee: own data only  • Manager: team data  • Admin: all   │   │
│  └───────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘

## Technology Stack

| Layer         | Technology           | Purpose                              |
|---------------|----------------------|--------------------------------------|
| Frontend      | Next.js 16 (App Router) | React SSR framework                |
| Styling       | Tailwind CSS v4      | Utility-first CSS                    |
| Language      | TypeScript           | Type-safe development                |
| Validation    | Zod v4               | Schema validation (client + server)  |
| Forms         | React Hook Form      | Performant form handling             |
| Charts        | Recharts             | Analytics visualizations             |
| Icons         | Lucide React         | Consistent icon system               |
| Auth          | Supabase Auth        | Email/password authentication        |
| Database      | Supabase PostgreSQL  | Managed relational database          |
| Security      | Supabase RLS         | Row-level access control             |
| Email         | Resend (optional)    | Transactional notifications          |
| Hosting       | Vercel               | Edge-optimized deployment            |
| VCS           | GitHub               | Source code management               |

## Data Flow

### Goal Creation → Approval Flow
```
Employee creates goals → Validates (Zod) → Saves to DB
    → Submits sheet → Status = "pending_approval"
    → Email to Manager → Manager reviews
    → Approve (locks goals) OR Return (with reason)
    → Email notification to Employee
```

### Achievement Tracking Flow
```
Employee logs actual values → Score auto-computed
    → Shared goal sync (if applicable)
    → Manager views Planned vs Actual
    → Manager adds check-in comment
    → Audit log captures all changes
```

### Scoring Formulas
```
Min (Higher=Better):  Score = (Actual ÷ Target) × 100
Max (Lower=Better):   Score = (Target ÷ Actual) × 100
Timeline:             Score = Days Remaining > 0 ? 100 : 0
Zero:                 Score = Actual === 0 ? 100 : 0
```

## Security Model

- **Authentication**: Supabase Auth with email/password
- **Authorization**: Role-based (employee, manager, admin)
- **Data Access**: PostgreSQL Row Level Security (RLS)
- **Route Protection**: Next.js middleware + server-side checks
- **Audit Trail**: All goal modifications logged with timestamps

## Cost Optimization

- **Supabase Free Tier**: 500MB DB, 50K auth users, unlimited API
- **Vercel Free Tier**: 100GB bandwidth, serverless functions
- **No external APIs** required for core functionality
- **SSR caching**: Pages rendered on-demand, revalidated on mutations
- **Lazy loading**: Email service only initialized when API key present
```
