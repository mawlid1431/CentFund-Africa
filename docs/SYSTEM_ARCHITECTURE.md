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

**Last Updated:** December 13, 2024  
**Version:** 2.0  
**Platform:** CentFund Africa Sponsorship Management System

---

## 🆕 Recent Updates (v2.0)

### Authentication Flow Enhancement
- Added LoginSelection component for user type selection
- Improved user experience with clear role separation
- All dashboards now render on the same page (no redirects)

### Admin Dashboard Improvements
- Migrated from 4-card layout to comprehensive multi-tab interface
- Added dedicated tabs for:
  - Applications (Student, Sponsor, Active Sponsors)
  - Projects (Certification programs management)
  - Team (Team members management)
  - Success Stories (Graduate success stories)
  - Testimonials (User feedback)
  - Partnerships (Partner organizations)
  - Settings (System configuration)

### Component Organization
- Separated dashboards into dedicated components:
  - AdminDashboard (admin users)
  - SponsorDashboard (sponsor users)
  - StudentDashboard (student users)
- Added form components for easier data entry
- Improved component reusability

### User Experience
- Enhanced visual design with Framer Motion animations
- Improved responsive design for mobile devices
- Added TypewriterText and HeroImageSlider components
- Integrated WhatsAppButton for quick communication
- Better loading states and error handling

### Technical Improvements
- Updated to React 19.2.3
- Using Motion 11.11.17 for animations
- Supabase 2.46.1 for backend
- TypeScript 5.7.2 for type safety
- Vite 6.0.1 for fast builds
