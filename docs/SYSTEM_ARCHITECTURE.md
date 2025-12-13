# CentFund Africa - System Architecture Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [User Roles](#user-roles)
3. [Authentication Flow](#authentication-flow)
4. [Application Workflow](#application-workflow)
5. [Database Schema](#database-schema)
6. [Frontend Architecture](#frontend-architecture)
7. [Backend Integration](#backend-integration)
8. [Complete User Journeys](#complete-user-journeys)

---

## 🎯 System Overview

CentFund Africa is a certification sponsorship platform that connects students seeking certification funding with sponsors willing to support their education. The system manages three main user types and facilitates the complete sponsorship lifecycle.

### Core Purpose
- **Students/Applicants:** Apply for certification sponsorship
- **Sponsors:** Support students by funding their certifications
- **Admins:** Manage applications, assign sponsors, and oversee the entire process

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
User enters email + password
         ↓
System checks credentials against .env file
         ↓
    ┌────┴────┐
    ↓         ↓         ↓
Admin?   Sponsor?   Applicant?
    ↓         ↓         ↓
Stay on   Redirect   Redirect
/admin    /sponsor   /home
          -dashboard
```

### Authentication Process
1. User navigates to `/admin`
2. Enters email and password
3. System checks against environment variables:
   - `VITE_ADMIN_EMAIL` & `VITE_ADMIN_PASSWORD`
   - `VITE_SPONSOR1_EMAIL` & `VITE_SPONSOR1_PASSWORD` (and 2, 3)
   - `VITE_USER1_EMAIL` & `VITE_USER1_PASSWORD` (and 2)

4. User type is identified
5. Session data stored in localStorage:
   - `userType`: 'admin' | 'sponsor' | 'applicant'
   - `userEmail`: User's email
   - `userName`: User's name (for sponsors)
   - `adminToken`: Authentication token
6. User redirected to appropriate dashboard

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

### Main Tables

#### 1. `applications` Table
**Purpose:** Store student certification applications

```sql
- id (UUID, Primary Key)
- full_name (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR)
- date_of_birth (DATE)
- gender (VARCHAR)
- nationality (VARCHAR)
- address (TEXT)
- city (VARCHAR)
- country (VARCHAR)
- education_level (VARCHAR)
- institution_name (VARCHAR)
- field_of_study (VARCHAR)
- certification_name (VARCHAR)
- certification_cost (DECIMAL)
- why_certification (TEXT)
- career_goals (TEXT)
- financial_situation (TEXT)
- resume_url (TEXT)
- id_document_url (TEXT)
- status (VARCHAR) - pending, accepted_stage1, etc.
- current_stage (INTEGER) - 1 or 2
- stage1_status (VARCHAR)
- stage2_status (VARCHAR)
- assigned_sponsor_id (UUID, Foreign Key)
- sponsor_assigned_at (TIMESTAMP)
- submitted_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```


#### 2. `sponsors` Table
**Purpose:** Store sponsor/partner applications and details

```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR)
- address (TEXT)
- city (VARCHAR)
- country (VARCHAR)
- organization (VARCHAR)
- project_id (UUID, Foreign Key)
- amount (DECIMAL)
- sponsor_type (VARCHAR) - 'full' or 'partial'
- status (VARCHAR) - 'pending', 'approved', 'rejected'
- id_document_url (TEXT)
- proof_of_funds_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 3. `users` Table
**Purpose:** Store all user accounts

```sql
- id (UUID, Primary Key)
- full_name (VARCHAR)
- email (VARCHAR, Unique)
- password (VARCHAR, Hashed)
- role (VARCHAR) - 'admin', 'sponsor', 'applicant'
- status (VARCHAR) - 'active', 'inactive'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 4. `sponsor_assignments` Table
**Purpose:** Track sponsor-student assignments

```sql
- id (UUID, Primary Key)
- sponsor_id (UUID, Foreign Key → users)
- application_id (UUID, Foreign Key → applications)
- assigned_at (TIMESTAMP)
- status (VARCHAR)
- payment_method (VARCHAR) - 'direct', 'platform'
- payment_status (VARCHAR)
- notes (TEXT)
```

#### 5. `application_history` Table
**Purpose:** Track all status changes

```sql
- id (UUID, Primary Key)
- application_id (UUID, Foreign Key)
- old_status (VARCHAR)
- new_status (VARCHAR)
- stage (INTEGER)
- changed_by (UUID, Foreign Key → users)
- notes (TEXT)
- created_at (TIMESTAMP)
```

#### 6. `sponsor_payments` Table
**Purpose:** Track payment information

```sql
- id (UUID, Primary Key)
- sponsor_assignment_id (UUID, Foreign Key)
- amount (DECIMAL)
- payment_method (VARCHAR)
- payment_date (TIMESTAMP)
- transaction_id (VARCHAR)
- status (VARCHAR)
- notes (TEXT)
```

### Database Relationships

```
users (sponsors)
    ↓ (1:many)
sponsor_assignments
    ↓ (1:1)
applications (students)
    ↓ (1:many)
application_history

sponsors (becoming partners)
    ↓ (independent)
(No direct relation to applications)
```

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
│   │   ├── AdminDashboard.tsx          # Main admin interface
│   │   ├── AdminLogin.tsx              # Unified login for all users
│   │   ├── ApplicationsManager.tsx     # Student applications management
│   │   ├── SponsorApplicationsManager.tsx  # Sponsor applications
│   │   ├── SponsorsListManager.tsx     # Active sponsors list
│   │   ├── ProjectsManager.tsx         # Projects management
│   │   ├── TeamManager.tsx             # Team management
│   │   └── ...
│   ├── ContactForm.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ...
├── pages/
│   ├── HomePage.tsx
│   ├── AdminPage.tsx                   # Admin entry point
│   ├── ApplicationPage.tsx             # Student application form
│   ├── SponsorDashboardPage.tsx        # Sponsor dashboard
│   ├── SponsorApplicationPage.tsx      # Become a sponsor form
│   └── ...
├── utils/
│   └── supabase/
│       ├── client.ts                   # Supabase client config
│       └── helpers.ts                  # Database helper functions
├── database/
│   ├── APPLICATION_SYSTEM_SCHEMA.sql   # Complete database schema
│   └── sponsors_table.sql              # Sponsors table schema
├── docs/
│   ├── SYSTEM_ARCHITECTURE.md          # This file
│   ├── APPLICATION_SYSTEM_GUIDE.md     # User guide
│   ├── LOGIN_CREDENTIALS.md            # Login info
│   └── ADMIN_APPLICATIONS_GUIDE.md     # Admin guide
├── .env                                # Environment variables
├── App.tsx                             # Main app component
├── main.tsx                            # Entry point + routing
└── package.json
```

### Component Hierarchy

```
App.tsx
├── Navbar
├── Routes
│   ├── HomePage
│   ├── AdminPage
│   │   ├── AdminLogin (if not authenticated)
│   │   └── AdminDashboard (if authenticated)
│   │       ├── ApplicationsManager
│   │       │   ├── Student Applications View
│   │       │   ├── Sponsor Applications View
│   │       │   └── Active Sponsors View
│   │       ├── ProjectsManager
│   │       ├── TeamManager
│   │       └── SettingsManager
│   ├── SponsorDashboardPage
│   ├── ApplicationPage
│   └── ...
└── Footer
```


### Admin Dashboard - 4 Category Cards

The admin dashboard features 4 main category cards for managing different aspects:

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                           │
│                   /admin (Applications Tab)                  │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   📚 BLUE    │  │  💼 PURPLE   │  │  🏢 GREEN    │  │  🏆 ORANGE   │
│   Student    │  │  Becoming    │  │   Active     │  │  Completed   │
│  Applicants  │  │   Sponsor    │  │  Sponsors    │  │              │
│              │  │              │  │              │  │              │
│   Count: X   │  │   Count: Y   │  │   Count: Z   │  │   Count: W   │
│  Pending: N  │  │  Pending: M  │  │  Active: K   │  │  Success: J  │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
      ↓                  ↓                  ↓                  ↓
   [CLICK]           [CLICK]           [CLICK]           [VIEW ONLY]
      ↓                  ↓                  ↓
  Shows table      Shows sponsor      Shows active
  of student       applications       sponsors list
  applications     (people wanting    (approved
                   to be partners)    partners)
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
1. Admin logs in at /admin
   Email: admin@centfundafrica.org
   Password: Admin@2024Secure!
   ↓
2. Clicks "Applications" tab
   ↓
3. Sees 4 category cards
   ↓
4. Clicks "Student Applicants" (Blue Card)
   ↓
5. Views list of all applications
   - Can search by name/email
   - Can filter by status
   ↓
6. Clicks "View" on an application
   ↓
7. Reviews complete details:
   - Personal info
   - Education
   - Certification needs
   - Documents
   - Submission date & time
   ↓
8. Makes decision:
   
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
```

### Journey 3: Sponsor Reviews Assignment

```
1. Sponsor logs in at /admin
   Email: sponsor1@centfundafrica.org
   Password: Sponsor1@2024!
   ↓
2. Automatically redirected to /sponsor-dashboard
   ↓
3. Sees assigned applications
   ↓
4. Clicks "View" on assigned student
   ↓
5. Reviews student details:
   - Personal information
   - Education background
   - Certification requirements
   - Cost
   ↓
6. Makes decision:
   
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
   - Can move to Stage 2
   
   Option B: DECLINE
   ↓
   - Clicks "Decline"
   - Application returns to admin
   - Admin can assign different sponsor
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

### Journey 5: Admin Views Active Sponsors

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
   - Documents
```


---

## 🔧 System Features

### Admin Features
1. **Dashboard Overview**
   - 4 category cards with real-time counts
   - Quick navigation between categories
   - Visual status indicators

2. **Student Application Management**
   - View all applications
   - Search and filter functionality
   - Detailed application view
   - Accept/Reject applications
   - Stage progression (Stage 1 → Stage 2)
   - Sponsor assignment
   - Status tracking
   - History logging

3. **Sponsor Application Management**
   - View people applying to become sponsors
   - Review company/organization details
   - Approve/Reject sponsor applications
   - Add to active sponsors list

4. **Active Sponsors Management**
   - View all approved sponsors
   - See sponsor details
   - Track sponsorship capacity
   - Monitor active sponsorships

5. **Additional Features**
   - Projects management
   - Team management
   - Testimonials management
   - Success stories management
   - Settings management

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
Login → Dashboard → Applications Tab
                         ↓
            ┌────────────┼────────────┐
            ↓            ↓            ↓
    Student Apps   Sponsor Apps   Active Sponsors
            ↓            ↓            ↓
    Manage Students  Approve/Reject  View Partners
    Accept/Reject    New Sponsors    Monitor Status
    Assign Sponsors
    Track Progress
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
1. Node.js (v16+)
2. npm or yarn
3. Supabase account
4. Environment variables configured

### Setup Steps
1. Clone repository
2. Install dependencies: `npm install`
3. Configure `.env` file with Supabase credentials
4. Run database migrations (SQL files in `/database`)
5. Start development server: `npm run dev`
6. Build for production: `npm run build`
7. Deploy to hosting platform (Vercel, Netlify, etc.)

### Environment Setup
```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview
```

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
6. **Offers** a unified login system with automatic role detection
7. **Features** an intuitive admin dashboard with 4 category cards
8. **Ensures** secure data handling and access control

The system streamlines the entire sponsorship process, making it easy for students to apply, sponsors to support, and admins to manage everything efficiently.

---

## 📞 Support & Maintenance

For technical support or questions:
- Review documentation in `/docs` folder
- Check database schemas in `/database` folder
- Verify environment variables in `.env` file
- Test with provided credentials in `LOGIN_CREDENTIALS.md`

---

**Last Updated:** December 2024  
**Version:** 1.0  
**Platform:** CentFund Africa Sponsorship Management System
