# CentFund Africa - System Architecture Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [User Roles](#user-roles)
4. [Authentication Flow](#authentication-flow)
5. [Application Workflow](#application-workflow)
6. [Database Schema](#database-schema)
7. [Frontend Architecture](#frontend-architecture)
8. [Backend Integration](#backend-integration)
9. [Complete User Journeys](#complete-user-journeys)
10. [Deployment](#deployment)

---

## 🎯 System Overview

CentFund Africa is a comprehensive certification sponsorship platform that connects ambitious students seeking professional certification funding with sponsors willing to support their education. The platform manages the complete sponsorship lifecycle from application submission to certification completion.

### Core Purpose
- **Students/Applicants:** Apply for certification sponsorship and track application progress
- **Sponsors:** Support students by funding their certifications and monitor impact
- **Admins:** Manage applications, assign sponsors, oversee projects, and maintain the platform

### Key Features
- 🎓 **Student Application System** - Comprehensive application forms with document uploads
- 💼 **Sponsor Management** - Onboarding, approval, and assignment workflow
- 📊 **Admin Dashboard** - Multi-tab interface for complete platform management
- 🔐 **Unified Authentication** - Single login page with role-based access
- 📈 **Real-time Statistics** - Live dashboard metrics and progress tracking
- 🌐 **Public Website** - Showcase projects, success stories, and testimonials
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices

---

## 💻 Technology Stack

### Frontend
- **Framework:** React 19.2.3 with TypeScript 5.7.2
- **Build Tool:** Vite 6.0.1 (fast development and optimized builds)
- **Styling:** Tailwind CSS 3.4.0 (utility-first CSS framework)
- **Animations:** Motion 11.11.17 (Framer Motion - smooth animations)
- **Icons:** Lucide React 0.468.0 (beautiful icon library)
- **Notifications:** Sonner 2.0.3 (toast notifications)
- **Routing:** React Router DOM 6.28.0

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Environment-based credentials (development)
- **Storage:** Supabase Storage (file uploads)
- **API:** Supabase Client 2.46.1

### Development Tools
- **Package Manager:** npm 9.0.0+
- **Node Version:** 18.0.0+
- **Linting:** ESLint 9.15.0
- **Type Checking:** TypeScript strict mode

### Deployment
- **Platform:** Vercel (recommended)
- **CI/CD:** Automated builds on push
- **Environment:** Production and staging environments

---

## 👥 User Roles

### 1. Admin
**Access Level:** Full system control  
**Login:** `/admin`  
**Credentials:** Stored in `.env` file

**Capabilities:**
- View and manage all student applications
- Review sponsor applications (people wanting to become sponsors)
- Approve/reject applications
- Assign sponsors to students
- Move applications through stages
- View all system statistics
- Manage active sponsors list

### 2. Sponsor/Partner
**Access Level:** Limited to assigned applications  
**Login:** `/admin` (redirects to `/sponsor-dashboard`)  
**Credentials:** Stored in `.env` file

**Capabilities:**
- View assigned student applications
- Accept or decline sponsorship
- Choose payment method (direct or through platform)
- Track sponsorship progress
- View student details and requirements

### 3. Student/Applicant
**Access Level:** Own application only  
**Login:** `/admin` (redirects to home)  
**Credentials:** Stored in `.env` file

**Capabilities:**
- Submit certification application
- Track application status
- View assigned sponsor (if any)
- Update application information
- View progress through stages

---

## 🔐 Authentication Flow

### Unified Login System
All users log in through the same page: `/admin`

```
User navigates to /admin
         ↓
Login Selection Screen
┌────────────────────────────────┐
│  Choose Your Login Type:       │
│  [Admin] [Sponsor] [Student]   │
└────────────────────────────────┘
         ↓
User selects type & enters credentials
         ↓
System checks credentials against .env file
         ↓
    ┌────┴────┐
    ↓         ↓         ↓
Admin?   Sponsor?   Applicant?
    ↓         ↓         ↓
Shows    Shows      Shows
Admin    Sponsor    Student
Dashboard Dashboard Dashboard
(on same (on same  (on same
 page)    page)     page)
```

### Authentication Process
1. User navigates to `/admin`
2. Sees LoginSelection screen with 3 options:
   - Admin Login
   - Sponsor Login
   - Student Login
3. User selects their type
4. Enters email and password in AdminLogin component
5. System checks against environment variables:
   - `VITE_ADMIN_EMAIL` & `VITE_ADMIN_PASSWORD`
   - `VITE_SPONSOR1_EMAIL` & `VITE_SPONSOR1_PASSWORD` (and 2, 3)
   - `VITE_USER1_EMAIL` & `VITE_USER1_PASSWORD` (and 2)
6. User type is identified and validated
7. Session data stored in localStorage:
   - `userType`: 'admin' | 'sponsor' | 'applicant'
   - `userEmail`: User's email
   - `userName`: User's name (for sponsors)
   - `adminToken`: Authentication token
8. Appropriate dashboard shown on same page:
   - Admin → AdminDashboard
   - Sponsor → SponsorDashboard
   - Student → StudentDashboard

### Session Management
- **Storage:** Browser localStorage
- **Duration:** Until logout
- **Security:** Token-based authentication

---

## 📊 Application Workflow

### Complete Application Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                    STUDENT APPLICATION                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
                    [SUBMITTED]
                    Status: pending
                    Stage: 1
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN REVIEWS                             │
│  - Views all application details                            │
│  - Checks eligibility                                        │
│  - Makes decision                                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
                    ┌──────┴──────┐
                    ↓             ↓
              [ACCEPTED]      [REJECTED]
           Status: accepted   Status: rejected
              Stage: 1        (END)
                    ↓
┌─────────────────────────────────────────────────────────────┐
│              ADMIN ASSIGNS SPONSOR                           │
│  - Selects from active sponsors list                        │
│  - Checks sponsor capacity                                   │
│  - Assigns student to sponsor                                │
└─────────────────────────────────────────────────────────────┘
                    ↓
         [ASSIGNED TO SPONSOR]
      Status: assigned_to_sponsor
                    ↓
┌─────────────────────────────────────────────────────────────┐
│              SPONSOR REVIEWS                                 │
│  - Views student application                                 │
│  - Reviews requirements                                      │
│  - Makes decision                                            │
└─────────────────────────────────────────────────────────────┘
                    ↓
              ┌─────┴─────┐
              ↓           ↓
        [ACCEPTED]    [DECLINED]
                           ↓
                    Back to Admin
                           ↓
┌─────────────────────────────────────────────────────────────┐
│           SPONSOR CHOOSES PAYMENT METHOD                     │
│  Option 1: Pay Direct to Exam Center                        │
│  Option 2: Pay Through Platform                             │
└─────────────────────────────────────────────────────────────┘
                    ↓
              [PAYMENT CONFIRMED]
                    ↓
┌─────────────────────────────────────────────────────────────┐
│              ADMIN MOVES TO STAGE 2                          │
│  Status: pending_stage2                                      │
│  Stage: 2                                                    │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│              ADMIN FINAL REVIEW                              │
│  - Verifies payment                                          │
│  - Confirms all requirements met                             │
│  - Makes final decision                                      │
└─────────────────────────────────────────────────────────────┘
                    ↓
              ┌─────┴─────┐
              ↓           ↓
      [ACCEPTED]      [REJECTED]
   Status: accepted  Status: rejected
      Stage: 2
         ↓
    [COMPLETED]
```

### Status Definitions

| Status | Description | Stage | Actions Available |
|--------|-------------|-------|-------------------|
| `pending` | Initial submission | 1 | Admin: Accept/Reject |
| `accepted_stage1` | Approved for Stage 1 | 1 | Admin: Assign Sponsor, Move to Stage 2 |
| `assigned_to_sponsor` | Sponsor assigned | 1 | Sponsor: Accept/Decline |
| `pending_stage2` | Awaiting Stage 2 review | 2 | Admin: Final Accept/Reject |
| `accepted_stage2` | Final approval | 2 | Completed |
| `rejected` | Application denied | Any | End |

---

## 🗄️ Database Schema

### Complete Database Structure (11 Tables)

The database is built on **PostgreSQL** via **Supabase** with Row Level Security (RLS) enabled on all tables.

#### 1. `projects` Table
**Purpose:** Store certification programs/projects

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    target_amount NUMERIC(12, 2) DEFAULT 0,
    raised_amount NUMERIC(12, 2) DEFAULT 0,
    donation_link TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    location TEXT,
    date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Sample Data:** AWS Cloud Practitioner, CCNA Networking, IELTS, CompTIA A+

---

#### 2. `team_members` Table
**Purpose:** Store team member profiles

```sql
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    image TEXT,
    email TEXT,
    linkedin TEXT,
    twitter TEXT,
    order_index INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

#### 3. `success_stories` Table
**Purpose:** Store student success stories

```sql
CREATE TABLE success_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    age INTEGER,
    project TEXT NOT NULL,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    story TEXT NOT NULL,
    image TEXT NOT NULL,
    impact TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Sample Data:** 4 featured success stories from graduates

---

#### 4. `testimonials` Table
**Purpose:** Store user testimonials and feedback

```sql
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    image TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT NOT NULL,
    project TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Sample Data:** 6 testimonials from students and sponsors

---

#### 5. `partners` Table
**Purpose:** Store partner organizations

```sql
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo TEXT NOT NULL,
    website TEXT,
    description TEXT,
    partnership_type TEXT CHECK (partnership_type IN ('sponsor', 'partner', 'supporter')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Sample Data:** 4 partner organizations

---

#### 6. `users` Table
**Purpose:** Store all user accounts (admins, sponsors, applicants)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('applicant', 'admin', 'sponsor', 'student_admin', 'sponsor_admin')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Sample Data:**
- 3 Admin users (main admin, student admin, sponsor admin)
- 4 Sponsor users
- 4 Applicant users

---

#### 7. `applications` Table
**Purpose:** Store student certification applications

```sql
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Personal Information
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    nationality TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    
    -- Education Information
    education_level TEXT NOT NULL,
    institution_name TEXT NOT NULL,
    field_of_study TEXT NOT NULL,
    graduation_year INTEGER,
    current_gpa TEXT,
    
    -- Certification Details
    certification_name TEXT NOT NULL,
    certification_provider TEXT NOT NULL,
    exam_center TEXT,
    preferred_exam_date DATE,
    certification_cost NUMERIC(10, 2) NOT NULL,
    
    -- Motivation & Background
    why_certification TEXT NOT NULL,
    career_goals TEXT NOT NULL,
    financial_situation TEXT NOT NULL,
    previous_certifications TEXT,
    
    -- Documents (URLs to uploaded files)
    resume_url TEXT,
    id_document_url TEXT,
    transcript_url TEXT,
    motivation_letter_url TEXT,
    
    -- Application Status
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending',
        'under_review',
        'accepted_stage1',
        'assigned_to_sponsor',
        'pending_stage2',
        'accepted_stage2',
        'rejected',
        'completed'
    )),
    
    -- Stage Progress
    current_stage INTEGER DEFAULT 1,
    stage1_status TEXT DEFAULT 'pending',
    stage2_status TEXT DEFAULT 'not_started',
    
    -- Admin & Sponsor Assignment
    assigned_admin_id UUID REFERENCES users(id),
    assigned_sponsor_id UUID REFERENCES users(id),
    sponsor_assigned_at TIMESTAMP WITH TIME ZONE,
    
    -- Payment Information
    payment_method TEXT CHECK (payment_method IN ('through_us', 'direct_to_center', 'pending')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed')),
    payment_amount NUMERIC(10, 2),
    payment_date TIMESTAMP WITH TIME ZONE,
    
    -- Agreement
    agreement_accepted BOOLEAN DEFAULT FALSE,
    agreement_accepted_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Sample Data:** 4 student applications with various statuses

---

#### 8. `sponsors` Table
**Purpose:** Store sponsor applications and details

```sql
CREATE TABLE sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    organization TEXT,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    sponsor_type TEXT NOT NULL CHECK (sponsor_type IN ('full', 'partial')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    id_document_url TEXT,
    proof_of_funds_url TEXT,
    bio TEXT,
    total_sponsored INTEGER DEFAULT 0,
    active_sponsorships INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Sample Data:** 4 approved sponsors ready to support students

---

#### 9. `application_history` Table
**Purpose:** Track all application status changes

```sql
CREATE TABLE application_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    changed_by_id UUID REFERENCES users(id),
    previous_status TEXT,
    new_status TEXT NOT NULL,
    stage INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

#### 10. `sponsor_responses` Table
**Purpose:** Track sponsor decisions on applications

```sql
CREATE TABLE sponsor_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    sponsor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    response TEXT CHECK (response IN ('accepted', 'rejected', 'pending')),
    payment_preference TEXT CHECK (payment_preference IN ('through_us', 'direct_to_center')),
    payment_questions_answered BOOLEAN DEFAULT FALSE,
    payment_details JSONB,
    agreement_signed BOOLEAN DEFAULT FALSE,
    agreement_signed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

#### 11. `notifications` Table
**Purpose:** Store user notifications

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### Database Relationships

```
users (admins, sponsors, applicants)
    ↓
    ├─→ applications (applicant_id)
    │       ↓
    │       ├─→ application_history (tracks changes)
    │       └─→ sponsor_responses (sponsor decisions)
    │
    ├─→ applications (assigned_sponsor_id)
    │
    ├─→ notifications (user_id)
    │
    └─→ application_history (changed_by_id)

sponsors (sponsor applications)
    ↓
    └─→ projects (project_id) [optional]

projects ←→ success_stories (by project name)
projects ←→ testimonials (by project name)
```

### Performance Optimizations

**Indexes Created:**
- `idx_applications_applicant` on applications(applicant_id)
- `idx_applications_status` on applications(status)
- `idx_applications_sponsor` on applications(assigned_sponsor_id)
- `idx_applications_admin` on applications(assigned_admin_id)
- `idx_users_email` on users(email)
- `idx_users_role` on users(role)
- `idx_notifications_user` on notifications(user_id)
- `idx_sponsors_email` on sponsors(email)
- `idx_sponsors_status` on sponsors(status)
- `idx_projects_status` on projects(status)
- `idx_success_stories_status` on success_stories(status)
- `idx_testimonials_status` on testimonials(status)

**Triggers:**
- Auto-update `updated_at` timestamp on all tables when records are modified

---

## 🎨 Frontend Architecture

### Technology Stack
- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Routing:** Custom routing (main.tsx)
- **State Management:** React Hooks (useState, useEffect)
- **Backend:** Supabase (PostgreSQL + Auth)

### Project Structure

```
centfund-africa/
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx              # Main admin interface with tabs
│   │   ├── AdminLogin.tsx                  # Unified login component
│   │   ├── LoginSelection.tsx              # User type selection screen
│   │   ├── ApplicationsManager.tsx         # Student applications management
│   │   ├── SponsorApplicationsManager.tsx  # Sponsor applications
│   │   ├── SponsorsListManager.tsx         # Active sponsors list
│   │   ├── SponsorsManager.tsx             # Sponsors management
│   │   ├── ProjectsManager.tsx             # Projects management
│   │   ├── ProjectForm.tsx                 # Project creation/edit form
│   │   ├── TeamManager.tsx                 # Team management
│   │   ├── TeamForm.tsx                    # Team member form
│   │   ├── SuccessStoriesManager.tsx       # Success stories management
│   │   ├── SuccessStoryForm.tsx            # Success story form
│   │   ├── TestimonialsManager.tsx         # Testimonials management
│   │   ├── TestimonialForm.tsx             # Testimonial form
│   │   ├── PartnershipManager.tsx          # Partnerships management
│   │   ├── SettingsManager.tsx             # Settings management
│   │   └── SimpleAdminDashboard.tsx        # Simplified dashboard view
│   ├── sponsor/
│   │   └── SponsorDashboard.tsx            # Sponsor dashboard component
│   ├── student/
│   │   └── StudentDashboard.tsx            # Student dashboard component
│   ├── ContactForm.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProjectCard.tsx
│   ├── TeamCard.tsx
│   ├── TypewriterText.tsx
│   ├── HeroImageSlider.tsx
│   ├── DecorativeElements.tsx
│   ├── WhatsAppButton.tsx
│   └── ...
├── pages/
│   ├── HomePage.tsx                        # Landing page
│   ├── AdminPage.tsx                       # Admin entry point (all users)
│   ├── ApplicationPage.tsx                 # Student application form
│   ├── SponsorApplicationPage.tsx          # Become a sponsor form
│   ├── SponsorRequirementsPage.tsx         # Sponsor requirements info
│   ├── SponsorSuccessPage.tsx              # Sponsor application success
│   ├── SponsorDashboardPage.tsx            # Sponsor dashboard page
│   ├── ProjectsPage.tsx                    # Projects listing
│   ├── ProjectDetailPage.tsx               # Individual project details
│   ├── AboutPage.tsx                       # About page
│   ├── ContactPage.tsx                     # Contact page
│   ├── SuccessStoriesPage.tsx              # Success stories listing
│   ├── TestimonialsPage.tsx                # Testimonials listing
│   ├── NotFoundPage.tsx                    # 404 page
│   └── ...
├── utils/
│   └── supabase/
│       ├── client.ts                       # Supabase client config
│       └── helpers.ts                      # Database helper functions
├── database/
│   ├── APPLICATION_SYSTEM_SCHEMA.sql       # Complete database schema
│   ├── sponsors_table.sql                  # Sponsors table schema
│   └── README.md                           # Database documentation
├── docs/
│   ├── SYSTEM_ARCHITECTURE.md              # This file
│   ├── APPLICATION_SYSTEM_GUIDE.md         # User guide
│   ├── LOGIN_CREDENTIALS.md                # Login info
│   ├── ADMIN_APPLICATIONS_GUIDE.md         # Admin guide
│   └── setup/                              # Setup documentation
├── styles/                                 # CSS styles
├── public/                                 # Static assets
│   ├── carousel-1.jpg through carousel-5.jpg
│   └── ...
├── .env                                    # Environment variables
├── .env.example                            # Environment template
├── App.tsx                                 # Main app component
├── main.tsx                                # Entry point + routing
├── package.json                            # Dependencies
├── vite.config.ts                          # Vite configuration
├── tailwind.config.ts                      # Tailwind configuration
├── tsconfig.json                           # TypeScript configuration
└── vercel.json                             # Vercel deployment config
```

### Component Hierarchy

```
App.tsx
├── Navbar
├── Routes
│   ├── HomePage
│   │   ├── HeroImageSlider
│   │   ├── TypewriterText
│   │   ├── ProjectCard (multiple)
│   │   ├── DecorativeElements
│   │   └── WhatsAppButton
│   ├── AdminPage
│   │   ├── LoginSelection (if not authenticated)
│   │   ├── AdminLogin (if user type selected)
│   │   └── Dashboard (if authenticated)
│   │       ├── AdminDashboard (for admin users)
│   │       │   ├── [Applications Tab]
│   │       │   │   ├── ApplicationsManager
│   │       │   │   ├── SponsorApplicationsManager
│   │       │   │   └── SponsorsListManager
│   │       │   ├── [Projects Tab]
│   │       │   │   ├── ProjectsManager
│   │       │   │   └── ProjectForm
│   │       │   ├── [Team Tab]
│   │       │   │   ├── TeamManager
│   │       │   │   └── TeamForm
│   │       │   ├── [Success Stories Tab]
│   │       │   │   ├── SuccessStoriesManager
│   │       │   │   └── SuccessStoryForm
│   │       │   ├── [Testimonials Tab]
│   │       │   │   ├── TestimonialsManager
│   │       │   │   └── TestimonialForm
│   │       │   ├── [Partnerships Tab]
│   │       │   │   └── PartnershipManager
│   │       │   └── [Settings Tab]
│   │       │       └── SettingsManager
│   │       ├── SponsorDashboard (for sponsor users)
│   │       └── StudentDashboard (for student users)
│   ├── ApplicationPage
│   │   └── ContactForm (application form)
│   ├── SponsorApplicationPage
│   │   └── ContactForm (sponsor form)
│   ├── SponsorRequirementsPage
│   ├── ProjectsPage
│   │   └── ProjectCard (multiple)
│   ├── ProjectDetailPage
│   ├── AboutPage
│   │   └── TeamCard (multiple)
│   ├── ContactPage
│   │   └── ContactForm
│   ├── SuccessStoriesPage
│   ├── TestimonialsPage
│   └── NotFoundPage
└── Footer
```


### Admin Dashboard - Multi-Tab Interface

The admin dashboard features a tabbed interface for managing different aspects:

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                           │
│  [Applications] [Projects] [Team] [Success Stories]          │
│  [Testimonials] [Partnerships] [Settings]                    │
└─────────────────────────────────────────────────────────────┘

APPLICATIONS TAB:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   📚 BLUE    │  │  💼 PURPLE   │  │  🏢 GREEN    │
│   Student    │  │  Becoming    │  │   Active     │
│  Applicants  │  │   Sponsor    │  │  Sponsors    │
│              │  │              │  │              │
│   Count: X   │  │   Count: Y   │  │   Count: Z   │
│  Pending: N  │  │  Pending: M  │  │  Active: K   │
└──────────────┘  └──────────────┘  └──────────────┘
      ↓                  ↓                  ↓
   [CLICK]           [CLICK]           [CLICK]
      ↓                  ↓                  ↓
  Shows table      Shows sponsor      Shows active
  of student       applications       sponsors list
  applications     (people wanting    (approved
                   to be partners)    partners)

OTHER TABS:
- Projects: Manage certification programs
- Team: Manage team members
- Success Stories: Manage student success stories
- Testimonials: Manage user testimonials
- Partnerships: Manage partner organizations
- Settings: System configuration
```

---

## 🔄 Backend Integration

### Supabase Configuration

**File:** `utils/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Environment Variables

**File:** `.env`

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Admin
VITE_ADMIN_EMAIL=admin@centfundafrica.org
VITE_ADMIN_PASSWORD=Admin@2024Secure!

# Sponsors (3 accounts)
VITE_SPONSOR1_EMAIL=sponsor1@centfundafrica.org
VITE_SPONSOR1_PASSWORD=Sponsor1@2024!
VITE_SPONSOR1_NAME=John Smith

# Applicants (2 accounts)
VITE_USER1_EMAIL=applicant1@example.com
VITE_USER1_PASSWORD=User1@2024!
```

### API Operations

#### Fetch Applications
```typescript
const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('submitted_at', { ascending: false });
```

#### Update Application Status
```typescript
const { error } = await supabase
    .from('applications')
    .update({ 
        status: newStatus,
        current_stage: stage,
        updated_at: new Date().toISOString()
    })
    .eq('id', applicationId);
```

#### Assign Sponsor
```typescript
const { error } = await supabase
    .from('applications')
    .update({
        assigned_sponsor_id: sponsorId,
        sponsor_assigned_at: new Date().toISOString(),
        status: 'assigned_to_sponsor'
    })
    .eq('id', applicationId);
```

#### Fetch Sponsor Applications
```typescript
const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .order('created_at', { ascending: false });
```

#### Fetch Active Sponsors
```typescript
const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
```

---

## 🚀 Complete User Journeys

### Journey 1: Student Applies for Sponsorship

```
1. Student visits website
   ↓
2. Navigates to Application Page
   ↓
3. Fills out application form:
   - Personal Information
   - Education Background
   - Certification Details
   - Financial Situation
   - Uploads Documents (Resume, ID)
   ↓
4. Submits Application
   ↓
5. Application saved to database
   Status: pending
   Stage: 1
   ↓
6. Student can track status
   (Login with credentials to view)
```

### Journey 2: Admin Manages Application

```
1. Admin navigates to /admin
   ↓
2. Sees LoginSelection screen
   ↓
3. Clicks "Admin Login"
   ↓
4. Enters credentials:
   Email: admin@centfundafrica.org
   Password: Admin@2024Secure!
   ↓
5. AdminDashboard loads with multiple tabs
   ↓
6. Clicks "Applications" tab (default view)
   ↓
7. Sees 3 category cards:
   - Student Applicants (Blue)
   - Becoming Sponsor (Purple)
   - Active Sponsors (Green)
   ↓
8. Clicks "Student Applicants" (Blue Card)
   ↓
9. Views list of all applications
   - Can search by name/email
   - Can filter by status
   - Can sort by date
   ↓
10. Clicks "View" on an application
   ↓
11. Reviews complete details:
   - Personal info
   - Education background
   - Certification needs
   - Financial situation
   - Documents (resume, ID)
   - Submission date & time
   ↓
12. Makes decision:
   
   Option A: ACCEPT
   ↓
   - Clicks "Accept to Stage 1"
   - Status changes to: accepted_stage1
   - Stage remains: 1
   ↓
   - Admin can now:
     a) Assign Sponsor
        - Clicks "Assign to Sponsor"
        - Selects from active sponsors list
        - Checks sponsor capacity
        - Assigns
        - Status: assigned_to_sponsor
     
     b) Move to Stage 2
        - Clicks "Move to Stage 2"
        - Status: pending_stage2
        - Stage: 2
   
   Option B: REJECT
   ↓
   - Clicks "Reject"
   - Status: rejected
   - Application ends
   
13. Can switch to other tabs:
   - Projects: Manage certification programs
   - Team: Manage team members
   - Success Stories: Feature graduates
   - Testimonials: Manage feedback
   - Partnerships: Manage partners
   - Settings: Configure system
```

### Journey 3: Sponsor Reviews Assignment

```
1. Sponsor navigates to /admin
   ↓
2. Sees LoginSelection screen
   ↓
3. Clicks "Sponsor Login"
   ↓
4. Enters credentials:
   Email: sponsor1@centfundafrica.org
   Password: Sponsor1@2024!
   ↓
5. SponsorDashboard loads on same page
   ↓
6. Sees assigned applications list
   - Application details
   - Student information
   - Status indicators
   ↓
7. Clicks "View" on assigned student
   ↓
8. Reviews student details:
   - Personal information
   - Education background
   - Certification requirements
   - Cost breakdown
   - Career goals
   - Financial situation
   ↓
9. Makes decision:
   
   Option A: ACCEPT
   ↓
   - Clicks "Accept Sponsorship"
   - Chooses payment method:
     a) Pay Direct to Exam Center
     b) Pay Through Platform
   ↓
   - Fills additional information
   - Confirms agreement
   - Submits
   ↓
   - Admin notified
   - Status updated
   - Can move to Stage 2
   
   Option B: DECLINE
   ↓
   - Clicks "Decline"
   - Provides reason (optional)
   - Application returns to admin
   - Admin can assign different sponsor
   
10. Can track all sponsorships:
   - Active sponsorships
   - Completed sponsorships
   - Payment status
   - Student progress
```

### Journey 4: Person Wants to Become Sponsor

```
1. Person visits website
   ↓
2. Navigates to "Become a Sponsor" page
   ↓
3. Fills out sponsor application:
   - Personal/Company Information
   - Contact Details
   - Organization Name
   - Sponsorship Amount
   - Motivation
   - Documents
   ↓
4. Submits Application
   ↓
5. Saved to 'sponsors' table
   Status: pending
   ↓
6. Admin reviews:
   - Logs in
   - Clicks "Applications" tab
   - Clicks "Becoming Sponsor" (Purple Card)
   - Views sponsor application
   - Reviews details
   ↓
7. Admin decides:
   
   Option A: APPROVE
   ↓
   - Clicks "Approve"
   - Status: approved
   - Sponsor added to "Active Sponsors" list
   - Can now be assigned to students
   
   Option B: REJECT
   ↓
   - Clicks "Reject"
   - Status: rejected
   - Application ends
```

### Journey 5: Student Tracks Application

```
1. Student navigates to /admin
   ↓
2. Sees LoginSelection screen
   ↓
3. Clicks "Student Login"
   ↓
4. Enters credentials:
   Email: applicant1@example.com
   Password: User1@2024!
   ↓
5. StudentDashboard loads on same page
   ↓
6. Sees their application status:
   - Current status
   - Stage progress
   - Assigned sponsor (if any)
   - Timeline
   ↓
7. Can view application details:
   - Submitted information
   - Documents uploaded
   - Status history
   - Next steps
   ↓
8. Receives updates:
   - Status changes
   - Sponsor assignment
   - Payment confirmation
   - Completion notification
   ↓
9. Can update information:
   - Contact details
   - Documents
   - Additional information
```

### Journey 6: Admin Views Active Sponsors

```
1. Admin logs in
   ↓
2. Clicks "Applications" tab
   ↓
3. Clicks "Active Sponsors" (Green Card)
   ↓
4. Views list of all approved sponsors:
   - Name
   - Organization
   - Email & Phone
   - Sponsorship Type (full/partial)
   - Amount
   - Status
   - Date Joined
   ↓
5. Can click "View" for details
   ↓
6. Sees sponsor information:
   - Contact details
   - Organization info
   - Sponsorship capacity
   - Active sponsorships
   - Payment history
   - Documents
```


---

## 🔧 System Features

### Admin Features
1. **Dashboard Overview**
   - Multi-tab interface for different management areas
   - Real-time statistics and counts
   - Quick navigation between sections
   - Visual status indicators

2. **Applications Tab**
   - **Student Applications Management**
     - View all student applications
     - Search and filter functionality
     - Detailed application view
     - Accept/Reject applications
     - Stage progression (Stage 1 → Stage 2)
     - Sponsor assignment
     - Status tracking
     - History logging
   
   - **Sponsor Applications Management**
     - View people applying to become sponsors
     - Review company/organization details
     - Approve/Reject sponsor applications
     - Add to active sponsors list
   
   - **Active Sponsors Management**
     - View all approved sponsors
     - See sponsor details
     - Track sponsorship capacity
     - Monitor active sponsorships

3. **Projects Tab**
   - Create/Edit/Delete certification programs
   - Manage project details (name, description, image)
   - Set project status (active/inactive)
   - Track project metrics

4. **Team Tab**
   - Add/Edit/Remove team members
   - Manage team member profiles
   - Set roles and positions
   - Upload team photos

5. **Success Stories Tab**
   - Create/Edit/Delete success stories
   - Manage student testimonials
   - Track impact metrics
   - Feature successful graduates

6. **Testimonials Tab**
   - Manage user testimonials
   - Approve/Reject testimonials
   - Feature testimonials on homepage
   - Track ratings and feedback

7. **Partnerships Tab**
   - Manage partner organizations
   - Track partnership agreements
   - Monitor partnership status

8. **Settings Tab**
   - System configuration
   - Email settings
   - Notification preferences
   - General settings

### Sponsor Features
1. **Dashboard**
   - View assigned applications
   - See student details
   - Track sponsorship status

2. **Application Review**
   - View complete student information
   - Review certification requirements
   - See cost breakdown

3. **Sponsorship Actions**
   - Accept or decline sponsorship
   - Choose payment method
   - Submit payment information
   - Track payment status

### Student Features
1. **Application Submission**
   - Fill comprehensive application form
   - Upload required documents
   - Submit for review

2. **Status Tracking**
   - View current application status
   - See assigned sponsor (if any)
   - Track progress through stages
   - Receive notifications

---

## 📱 Responsive Design

The system is fully responsive and works on:
- **Desktop:** Full features, optimal layout
- **Tablet:** Adapted layout, touch-friendly
- **Mobile:** Simplified navigation, mobile-optimized

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 🔒 Security Features

### Authentication
- Environment variable-based credentials
- Session token management
- Role-based access control
- Automatic logout on session expiry

### Data Protection
- Supabase Row Level Security (RLS)
- Encrypted passwords (when using database auth)
- Secure file uploads
- HTTPS only in production

### Access Control
- Admin: Full access to all data
- Sponsor: Access only to assigned applications
- Student: Access only to own application

---

## 🎯 Key Workflows Summary

### Student Application Workflow
```
Submit → Pending → Admin Review → Accept/Reject
                                      ↓
                                   Accepted
                                      ↓
                              Assign Sponsor
                                      ↓
                            Sponsor Review
                                      ↓
                          Accept/Decline
                                      ↓
                              Stage 2
                                      ↓
                          Final Approval
                                      ↓
                            Completed
```

### Sponsor Application Workflow
```
Submit → Pending → Admin Review → Approve/Reject
                                      ↓
                                  Approved
                                      ↓
                            Active Sponsors List
                                      ↓
                        Can be assigned to students
```

### Admin Management Workflow
```
Login → LoginSelection → AdminDashboard
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
  Applications Tab      Projects Tab          Team Tab
        ↓                     ↓                     ↓
  ┌─────┼─────┐         Manage Certs         Manage Team
  ↓     ↓     ↓         Add/Edit/Delete      Add/Edit/Delete
Student Sponsor Active   Set Status          Set Roles
Apps    Apps   Sponsors  Track Metrics       Upload Photos
  ↓     ↓     ↓
Manage  Approve View
Accept  Reject  Monitor
Assign  Add to  Status
Track   List    Capacity

        ↓                     ↓                     ↓
  Success Stories      Testimonials          Partnerships
        ↓                     ↓                     ↓
  Feature Grads        Manage Feedback       Manage Partners
  Track Impact         Approve/Reject        Track Agreements
  Add Stories          Feature on Site       Monitor Status

        ↓
    Settings
        ↓
  Configure System
  Email Settings
  Notifications
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   STUDENT   │
│  (Frontend) │
└──────┬──────┘
       │ Submits Application
       ↓
┌─────────────┐
│  SUPABASE   │
│  (Backend)  │
│             │
│ applications│
│   table     │
└──────┬──────┘
       │ Fetches Data
       ↓
┌─────────────┐
│    ADMIN    │
│  (Frontend) │
└──────┬──────┘
       │ Reviews & Assigns
       ↓
┌─────────────┐
│  SUPABASE   │
│             │
│ sponsor_    │
│ assignments │
└──────┬──────┘
       │ Fetches Assignment
       ↓
┌─────────────┐
│   SPONSOR   │
│  (Frontend) │
└──────┬──────┘
       │ Accepts & Pays
       ↓
┌─────────────┐
│  SUPABASE   │
│             │
│ sponsor_    │
│ payments    │
└──────┬──────┘
       │ Updates Status
       ↓
┌─────────────┐
│    ADMIN    │
│  (Frontend) │
└──────┬──────┘
       │ Final Approval
       ↓
┌─────────────┐
│  SUPABASE   │
│             │
│ applications│
│ (completed) │
└─────────────┘
```

---

## 🚀 Deployment

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Supabase Account:** Free tier available at [supabase.com](https://supabase.com)
- **Git:** For version control

### Initial Setup

#### 1. Clone Repository
```bash
git clone https://github.com/mawlid1431/CentFund-Africa.git
cd CentFund-Africa
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://jwlpfmoohskipkcckaag.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Admin Credentials
VITE_ADMIN_EMAIL=admin@centfundafrica.org
VITE_ADMIN_PASSWORD=Admin@2024Secure!

# Sponsor Credentials (Example)
VITE_SPONSOR1_EMAIL=sponsor1@centfundafrica.org
VITE_SPONSOR1_PASSWORD=Sponsor1@2024!
VITE_SPONSOR1_NAME=John Smith

VITE_SPONSOR2_EMAIL=sponsor2@centfundafrica.org
VITE_SPONSOR2_PASSWORD=Sponsor2@2024!
VITE_SPONSOR2_NAME=Sarah Johnson

VITE_SPONSOR3_EMAIL=sponsor3@centfundafrica.org
VITE_SPONSOR3_PASSWORD=Sponsor3@2024!
VITE_SPONSOR3_NAME=Michael Brown

# Applicant Credentials (Example)
VITE_USER1_EMAIL=applicant1@example.com
VITE_USER1_PASSWORD=User1@2024!

VITE_USER2_EMAIL=applicant2@example.com
VITE_USER2_PASSWORD=User2@2024!
```

#### 4. Setup Database
1. Open [Supabase SQL Editor](https://app.supabase.com/project/jwlpfmoohskipkcckaag/sql)
2. Open `database/complete_setup.sql`
3. Copy entire file contents
4. Paste into SQL Editor
5. Click "Run" or press Ctrl+Enter
6. Wait for completion message

**What this creates:**
- ✅ 11 database tables with proper schema
- ✅ 12 performance indexes
- ✅ 8 auto-update triggers
- ✅ Sample data (4 projects, 4 success stories, 4 testimonials, etc.)
- ✅ 11 user accounts (3 admins, 4 sponsors, 4 students)

#### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Type check
tsc --noEmit
```

### Production Deployment

#### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all variables from `.env` file
   - Redeploy

#### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**
```bash
netlify login
```

3. **Deploy**
```bash
netlify deploy --prod
```

4. **Configure Environment Variables**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add all variables from `.env` file

#### Option 3: Manual Build

```bash
# Build the project
npm run build

# The dist/ folder contains production-ready files
# Upload to any static hosting service:
# - AWS S3 + CloudFront
# - GitHub Pages
# - Firebase Hosting
# - DigitalOcean App Platform
```

### Production Checklist

- [ ] Create production Supabase project
- [ ] Run `database/complete_setup.sql` in production database
- [ ] Update `.env` with production Supabase credentials
- [ ] Change admin password from default
- [ ] Remove or update sample data
- [ ] Enable HTTPS
- [ ] Configure custom domain
- [ ] Set up monitoring and error tracking
- [ ] Test all user flows (student, sponsor, admin)
- [ ] Verify email notifications work
- [ ] Check file upload functionality
- [ ] Test responsive design on mobile devices

### Environment-Specific Configuration

**Development:**
```env
VITE_SUPABASE_URL=https://your-dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=dev_anon_key
```

**Staging:**
```env
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging_anon_key
```

**Production:**
```env
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod_anon_key
```

### Continuous Integration/Deployment

**GitHub Actions Example:**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Monitoring & Maintenance

**Recommended Tools:**
- **Error Tracking:** Sentry
- **Analytics:** Google Analytics, Plausible
- **Uptime Monitoring:** UptimeRobot, Pingdom
- **Performance:** Lighthouse CI, WebPageTest

### Backup Strategy

1. **Database Backups:**
   - Supabase provides automatic daily backups
   - Manual backups: Dashboard → Database → Backups

2. **Code Backups:**
   - Git repository (GitHub, GitLab, Bitbucket)
   - Regular commits and tags

3. **Environment Variables:**
   - Store securely in password manager
   - Document in team wiki (without actual values)

---

## 📚 Documentation Files

1. **SYSTEM_ARCHITECTURE.md** (This file)
   - Complete system overview
   - Technical architecture
   - User journeys
   - Data flow

2. **APPLICATION_SYSTEM_GUIDE.md**
   - User guide for the application system
   - Step-by-step workflows
   - Status definitions

3. **LOGIN_CREDENTIALS.md**
   - All login credentials
   - User types and access levels
   - Testing instructions

4. **ADMIN_APPLICATIONS_GUIDE.md**
   - Admin-specific guide
   - 4 category cards explanation
   - Management features

5. **DATABASE SCHEMAS**
   - `APPLICATION_SYSTEM_SCHEMA.sql`
   - `sponsors_table.sql`

---

## 🎓 Summary

CentFund Africa is a comprehensive sponsorship management platform that:

1. **Connects** students needing certification funding with willing sponsors
2. **Manages** the complete application lifecycle from submission to completion
3. **Provides** role-based access for admins, sponsors, and students
4. **Tracks** all applications through multiple stages with detailed history
5. **Facilitates** sponsor-student matching and payment processing
6. **Offers** a unified login system with user type selection
7. **Features** an intuitive multi-tab admin dashboard for comprehensive management
8. **Ensures** secure data handling and access control
9. **Supports** multiple management areas: applications, projects, team, success stories, testimonials, partnerships, and settings
10. **Displays** all dashboards on the same page based on user role (no redirects)

The system streamlines the entire sponsorship process, making it easy for students to apply, sponsors to support, and admins to manage everything efficiently through a modern, responsive interface.

---

## 📞 Support & Maintenance

For technical support or questions:
- Review documentation in `/docs` folder
- Check database schemas in `/database` folder
- Verify environment variables in `.env` file
- Test with provided credentials in `LOGIN_CREDENTIALS.md`

---

## 📊 System Statistics

**Current Implementation:**
- **11 Database Tables** with full relationships
- **12 Performance Indexes** for fast queries
- **8 Auto-Update Triggers** for data consistency
- **3 User Roles** (Admin, Sponsor, Applicant)
- **5 Admin Sub-Roles** (Main Admin, Student Admin, Sponsor Admin, etc.)
- **8 Application Statuses** (Pending → Completed workflow)
- **2 Stages** in application review process
- **4 Sample Projects** (AWS, CCNA, IELTS, CompTIA A+)
- **11 Sample Users** for testing
- **Fully Responsive** design (mobile, tablet, desktop)

---

## 🔧 Troubleshooting

### Common Issues

**Issue: "Cannot connect to database"**
- Check Supabase URL and keys in `.env`
- Verify Supabase project is active
- Check network connection

**Issue: "Login not working"**
- Verify credentials in `.env` file
- Check localStorage is enabled in browser
- Clear browser cache and try again

**Issue: "Images not loading"**
- Check image URLs are valid
- Verify Supabase Storage is configured
- Check file permissions

**Issue: "Build fails"**
- Run `npm install` to update dependencies
- Check Node.js version (must be 18+)
- Clear `node_modules` and reinstall

**Issue: "Database tables not found"**
- Run `database/complete_setup.sql` in Supabase
- Check table names match schema
- Verify RLS policies are enabled

### Getting Help

- **Documentation:** Check `/docs` folder for guides
- **Database Schema:** See `database/complete_setup.sql`
- **Sample Data:** Included in setup script
- **GitHub Issues:** Report bugs and request features
- **Email:** support@centfundafrica.org

---

## 📚 Additional Documentation

**Available in `/docs` folder:**
1. `SYSTEM_ARCHITECTURE.md` - This file (complete system overview)
2. `APPLICATION_SYSTEM_GUIDE.md` - User guide for application system
3. `LOGIN_CREDENTIALS.md` - All login credentials and access levels
4. `ADMIN_APPLICATIONS_GUIDE.md` - Admin-specific management guide

**Available in `/database` folder:**
1. `complete_setup.sql` - Complete database setup (MAIN FILE)
2. `tables.sql` - Table schemas only
3. `data.sql` - Sample data only
4. `README.md` - Database documentation

---

## 🎯 Project Goals & Vision

### Short-term Goals (3-6 months)
- ✅ Launch MVP with core features
- ✅ Onboard first 10 sponsors
- ✅ Process 50+ student applications
- ⏳ Achieve 100% application processing rate
- ⏳ Expand to 5 new certification programs

### Long-term Goals (1-2 years)
- 📈 Support 1000+ students annually
- 🌍 Expand to 10+ African countries
- 💼 Partner with 50+ organizations
- 🎓 Achieve 80%+ certification success rate
- 💰 Facilitate $500K+ in sponsorships

### Impact Metrics
- **Students Supported:** Track number of applications processed
- **Certifications Completed:** Monitor success rate
- **Employment Rate:** Track job placements post-certification
- **Sponsor Satisfaction:** Measure sponsor engagement and retention
- **Platform Usage:** Monitor active users and engagement

---

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Standards
- **TypeScript:** Use strict mode, define types
- **React:** Functional components with hooks
- **Styling:** Tailwind CSS utility classes
- **Naming:** camelCase for variables, PascalCase for components
- **Comments:** Document complex logic
- **Testing:** Test critical user flows

### Pull Request Guidelines
- Describe changes clearly
- Include screenshots for UI changes
- Update documentation if needed
- Ensure all tests pass
- Follow existing code style

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

## 👥 Team & Contact

**CentFund Africa Team**
- **Website:** https://centfundafrica.org
- **Email:** info@centfundafrica.org
- **GitHub:** https://github.com/mawlid1431/CentFund-Africa
- **Support:** support@centfundafrica.org

**Technical Support:**
- **Developer:** Mawlid Hassan
- **Email:** mawlid@centfundafrica.org
- **GitHub:** @mawlid1431

---

**Last Updated:** December 13, 2024  
**Version:** 2.0.0  
**Platform:** CentFund Africa Sponsorship Management System  
**Status:** Production Ready ✅

---

## 🆕 Recent Updates (v2.0.0 - December 2024)

### Major Features
✅ **Complete Database Redesign**
- 11 interconnected tables with proper relationships
- Row Level Security (RLS) on all tables
- Performance indexes for fast queries
- Auto-update triggers for data consistency

✅ **Unified Authentication System**
- Single login page for all user types
- LoginSelection component for role selection
- Environment-based credentials (development)
- Role-based dashboard rendering

✅ **Multi-Tab Admin Dashboard**
- Applications tab (Student, Sponsor, Active Sponsors)
- Projects tab (Certification programs)
- Team tab (Team member management)
- Success Stories tab (Graduate stories)
- Testimonials tab (User feedback)
- Partnerships tab (Partner organizations)
- Settings tab (System configuration)

✅ **Enhanced User Experience**
- Smooth animations with Motion (Framer Motion)
- Responsive design for all devices
- TypewriterText effect on homepage
- HeroImageSlider with 5 carousel images
- WhatsAppButton for quick contact
- Toast notifications with Sonner

✅ **Complete Sample Data**
- 4 certification programs
- 4 success stories
- 6 testimonials
- 4 partner organizations
- 11 user accounts (3 admins, 4 sponsors, 4 students)
- 4 sample applications

### Technical Stack Updates
- **React:** 19.2.3 (latest stable)
- **TypeScript:** 5.7.2 (strict mode)
- **Vite:** 6.0.1 (fast builds)
- **Motion:** 11.11.17 (smooth animations)
- **Supabase:** 2.46.1 (backend)
- **Tailwind CSS:** 3.4.0 (styling)
- **Lucide React:** 0.468.0 (icons)

### Component Architecture
- Separated concerns with dedicated components
- Reusable form components
- Modular dashboard structure
- Clean component hierarchy
- TypeScript interfaces for type safety

### Performance Optimizations
- Database indexes on frequently queried columns
- Lazy loading for images
- Optimized bundle size
- Fast page transitions
- Efficient state management

### Security Enhancements
- Row Level Security (RLS) policies
- Secure password hashing (bcrypt)
- Environment variable protection
- HTTPS enforcement in production
- Input validation and sanitization

---

## 🚀 What's Next (v2.1.0 - Planned)

### Upcoming Features
- [ ] Email notifications for status changes
- [ ] File upload for documents (resume, ID, etc.)
- [ ] Advanced search and filtering
- [ ] Export data to CSV/PDF
- [ ] Real-time chat between sponsors and students
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Dark mode improvements
- [ ] Analytics dashboard

### Technical Improvements
- [ ] Unit tests with Vitest
- [ ] E2E tests with Playwright
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Docker containerization
- [ ] API documentation with Swagger
- [ ] Performance monitoring with Sentry
- [ ] SEO optimization
- [ ] PWA support

---

*Built with ❤️ by the CentFund Africa Team*
