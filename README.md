# 🌟 CertFund Africa Website

A modern, professional platform built with React, TypeScript, Tailwind CSS, and Supabase. Connect students with sponsors to fund professional certifications and unlock career opportunities.

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e.svg)](https://supabase.com/)

## 🎬 Demo

**Live Demo:** [Coming Soon]

**Admin Access:**
- URL: `/admin`
- Credentials: Set via environment variables (see `.env.example`)

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [System Architecture](#-system-architecture)
- [Admin Dashboard](#-admin-dashboard)
- [Database Schema](#-database-schema)
- [Tech Stack](#-tech-stack)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

### Public Features
- 🎨 **Modern Design** - Beautiful, responsive UI with dark mode support
- 📊 **Project Tracking** - Real-time progress bars and funding goals
- 💰 **Easy Donations** - One-click donation via external payment links
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Fast Performance** - Optimized with Vite and code splitting
- 🖼️ **Image Gallery** - High-quality project images

### Admin Features
- 🎛️ **Full Dashboard** - Manage all projects from one place
- ➕ **CRUD Operations** - Create, Read, Update, Delete projects
- 📸 **Image Upload** - Upload images directly from your device
- 📊 **Live Statistics** - Real-time dashboard with key metrics
- 🔗 **Donation Links** - Add PayPal, Stripe, or custom payment links
- 🔐 **Secure Access** - Protected admin routes with authentication
- 🔑 **Password Management** - Change admin password with validation
- 📈 **Status Management** - Set projects as Active, Paused, or Completed

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd certfund-africa-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Setup database**
```bash
# Go to Supabase Dashboard → SQL Editor
# Copy and run: COPY_THIS_TO_SUPABASE.sql
# Then run: FIX_STORAGE_POLICIES.sql
```

5. **Start development server**
```bash
npm run dev
```

6. **Open in browser**
```
http://localhost:5173
```

## 📊 Database Setup

### Step 1: Run Main Schema
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **SQL Editor** → **New Query**
3. Copy contents of `COPY_THIS_TO_SUPABASE.sql`
4. Click **Run**

### Step 2: Fix Storage Policies
1. In SQL Editor, create **New Query**
2. Copy contents of `FIX_STORAGE_POLICIES.sql`
3. Click **Run**

This creates:
- ✅ `projects` table
- ✅ `donations` table
- ✅ `project-images` storage bucket
- ✅ Sample data
- ✅ RLS policies

## 🎛️ Admin Dashboard

Access the admin dashboard at `/admin`

**Login Credentials:**
- Configured via `VITE_ADMIN_EMAIL` and `VITE_ADMIN_PASSWORD` environment variables
- See `.env.example` for setup instructions

**Features:**
- ✅ Create, edit, and delete projects
- ✅ Upload project images from device
- ✅ Manage project details (name, location, date, description)
- ✅ Set target and raised amounts
- ✅ Add donation links (PayPal, Stripe, etc.)
- ✅ Update project status (Active, Paused, Completed)
- ✅ Live statistics dashboard
- ✅ Real-time data synchronization

## 📁 Project Structure

```
certfund-africa-website/
├── components/          # React components
│   ├── admin/          # Admin dashboard components
│   ├── DonationForm.tsx
│   ├── ProjectCard.tsx
│   └── ...
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── ProjectsPage.tsx
│   ├── DonatePage.tsx
│   └── AdminPage.tsx
├── utils/              # Utility functions
│   └── supabase/       # Supabase client and helpers
├── styles/             # Global styles
├── .env                # Environment variables (not in git)
├── .env.example        # Environment template
├── COPY_THIS_TO_SUPABASE.sql  # Database schema
└── FIX_STORAGE_POLICIES.sql   # Storage policies fix
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 🌐 Pages & Routes

| Route | Page | Description | Access |
|-------|------|-------------|--------|
| `/` | HomePage | Landing page with featured projects | Public |
| `/projects` | ProjectsPage | Browse all active projects | Public |
| `/project-detail/:id` | ProjectDetailPage | View project details & donate | Public |
| `/donate` | DonatePage | General donation form | Public |
| `/about` | AboutPage | About the charity | Public |
| `/contact` | ContactPage | Contact form | Public |
| `/admin` | AdminPage | Admin dashboard & login | Admin Only |

### Admin Dashboard Routes
- `/admin` - Login page
- `/admin/dashboard` - Statistics & overview
- `/admin/projects` - Manage projects (CRUD operations)

## 🔐 Environment Variables

Required variables in `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Public     │  │    Admin     │  │   Project    │      │
│  │   Website    │  │  Dashboard   │  │   Details    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   React Router  │
                    │   (Navigation)  │
                    └────────┬────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React Components                         │   │
│  │  • HomePage  • ProjectsPage  • DonatePage            │   │
│  │  • AdminPage • ProjectDetailPage • ContactPage       │   │
│  └──────────────────────────────────────────────────────┘   │
│                             │                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           State Management & Hooks                    │   │
│  │  • useState  • useEffect  • Custom Hooks             │   │
│  └──────────────────────────────────────────────────────┘   │
│                             │                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Supabase Helpers                         │   │
│  │  • getProjects()  • createProject()                  │   │
│  │  • updateProject()  • deleteProject()                │   │
│  │  • getDonations()  • createDonation()                │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │ Supabase Client │
                    │   (API Layer)   │
                    └────────┬────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                      BACKEND LAYER                           │
│                    (Supabase Cloud)                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                      │   │
│  │  ┌────────────────┐      ┌────────────────┐         │   │
│  │  │   projects     │      │   donations    │         │   │
│  │  │  • id          │      │  • id          │         │   │
│  │  │  • name        │      │  • project_id  │         │   │
│  │  │  • location    │      │  • donor_name  │         │   │
│  │  │  • date        │      │  • amount      │         │   │
│  │  │  • description │      │  • status      │         │   │
│  │  │  • image       │      └────────────────┘         │   │
│  │  │  • target_amt  │                                 │   │
│  │  │  • raised_amt  │                                 │   │
│  │  │  • donation_link│                                │   │
│  │  │  • status      │                                 │   │
│  │  └────────────────┘                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Supabase Storage                         │   │
│  │  ┌────────────────────────────────────────┐         │   │
│  │  │      project-images bucket             │         │   │
│  │  │  • Public access for viewing           │         │   │
│  │  │  • Upload permissions for admin        │         │   │
│  │  │  • Max 5MB per image                   │         │   │
│  │  └────────────────────────────────────────┘         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Row Level Security (RLS)                      │   │
│  │  • Public: Read active projects                      │   │
│  │  • Admin: Full CRUD on all tables                    │   │
│  │  • Secure image upload/access                        │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow

#### 1. **Public User Flow**
```
User → Browse Projects → Click "Learn More" → View Details → Click "Donate Now" → External Payment
```

#### 2. **Admin Flow**
```
Admin → Login (/admin) → Dashboard → Manage Projects → Upload Images → Update Database
```

#### 3. **Project Creation Flow**
```
Admin Dashboard → Add Project Form → Fill Details → Upload Image to Storage 
→ Get Image URL → Save to Database → Update UI
```

### Component Architecture

```
App.tsx
├── HomePage
│   ├── HeroSection
│   ├── FeaturedProjects (ProjectCard × 3)
│   ├── ImpactSection
│   └── CTASection
│
├── ProjectsPage
│   ├── SearchBar
│   ├── FilterButtons
│   └── ProjectGrid (ProjectCard × N)
│
├── ProjectDetailPage
│   ├── ProjectHeader
│   ├── ProjectImage
│   ├── DonationSidebar
│   │   ├── ProgressBar
│   │   ├── DonateButton (External Link)
│   │   └── ShareButton
│   └── ProjectTabs
│       ├── Overview
│       ├── Updates
│       └── Supporters
│
├── DonatePage
│   └── DonationForm
│
├── AdminPage
│   ├── AdminLogin
│   └── AdminDashboard
│       ├── StatsCards
│       └── ProjectsManager
│           ├── ProjectsList
│           └── ProjectForm
│               ├── ImageUpload
│               ├── FormFields
│               └── StatusSelector
│
├── AboutPage
└── ContactPage
```

## 🗄️ Database Schema

### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  target_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  raised_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  donation_link TEXT,
  status TEXT NOT NULL DEFAULT 'active' 
    CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Donations Table
```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Buckets
- **project-images**: Public bucket for project images
  - Max file size: 5MB
  - Allowed types: JPG, PNG, GIF
  - Public read access
  - Authenticated upload access

## 🎨 Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite (Fast HMR, optimized builds)
- **Styling:** Tailwind CSS (Utility-first CSS)
- **Animations:** Framer Motion (Smooth transitions)
- **Icons:** Lucide React (Modern icon library)
- **Notifications:** Sonner (Toast notifications)
- **Routing:** React Router (Client-side routing)

### Backend
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (Image hosting)
- **Authentication:** Row Level Security (RLS)
- **API:** Supabase Client (Auto-generated REST API)

### Development
- **Language:** TypeScript (Type safety)
- **Linting:** ESLint (Code quality)
- **Package Manager:** npm
- **Version Control:** Git

## 🔒 Security Features

### Database Security
- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **Public users** can only read active projects
- ✅ **Authenticated users** have full CRUD access
- ✅ **SQL injection protection** via Supabase client
- ✅ **Data validation** on all inputs

### Storage Security
- ✅ **Public read access** for project images
- ✅ **Authenticated upload** for admin only
- ✅ **File type validation** (JPG, PNG, GIF only)
- ✅ **File size limits** (5MB maximum)

### Application Security
- ✅ **Environment variables** for sensitive data
- ✅ **HTTPS only** in production
- ✅ **Input sanitization** on all forms
- ✅ **XSS protection** via React
- ✅ **CSRF protection** via Supabase

### Admin Security
- ✅ **Login required** for admin access
- ✅ **Session management** via localStorage
- ✅ **Logout functionality**
- ✅ **Protected routes**

## 🔄 Project Workflow

### For Public Users

1. **Browse Projects**
   - Visit homepage or `/projects`
   - View featured projects with progress bars
   - See raised amounts and goals

2. **View Project Details**
   - Click on any project card or "Learn More"
   - Read full project description
   - View location, date, and status
   - Check funding progress

3. **Make a Donation**
   - Click "Donate Now" button
   - Redirected to external payment link (PayPal, Stripe, etc.)
   - Complete payment on secure platform

### For Administrators

1. **Login to Admin Dashboard**
   - Navigate to `/admin`
   - Enter credentials (admin / admin123)
   - Access admin dashboard

2. **Create New Project**
   - Click "Add Project" button
   - Fill in project details:
     - Project Name
     - Location
     - Start Date
     - Description
     - Upload Image (from device)
     - Target Amount
     - Raised Amount
     - Donation Link (optional)
     - Status (Active/Paused/Completed)
   - Click "Create Project"

3. **Edit Existing Project**
   - Click "Edit" on any project card
   - Update any field
   - Upload new image if needed
   - Click "Update Project"

4. **Delete Project**
   - Click "Delete" on project card
   - Confirm deletion
   - Project removed from database

5. **Monitor Statistics**
   - View dashboard stats:
     - Active Projects count
     - Total Raised amount
     - Total Donations count
     - Success Rate percentage

## 🐛 Troubleshooting

### App not loading?
1. Check browser console (F12) for errors
2. Verify `.env` file exists with correct values
3. Ensure database schema is run in Supabase
4. Try clearing cache: `rm -rf node_modules .vite && npm install`

### Images not uploading?
1. Run `FIX_STORAGE_POLICIES.sql` in Supabase
2. Verify `project-images` bucket exists
3. Check file size (max 5MB)
4. Check file type (JPG, PNG, GIF only)

### No projects showing?
1. Verify SQL schema was run
2. Check Supabase Table Editor for data
3. Check browser console for API errors
4. Verify RLS policies allow public read

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Done!** Your site is live at `your-project.vercel.app`

### Deploy to Netlify

1. **Build the project**
```bash
npm run build
```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect your GitHub repo
   - Add environment variables in Site Settings

### Environment Variables for Production

Make sure to set these in your hosting platform:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📊 Performance Optimization

- ✅ **Code Splitting** - Lazy loading for routes
- ✅ **Image Optimization** - Compressed images from Supabase
- ✅ **Caching** - Browser caching for static assets
- ✅ **Minification** - Production builds are minified
- ✅ **Tree Shaking** - Unused code removed
- ✅ **Fast Refresh** - Instant HMR in development

## 📝 License

MIT License - feel free to use this project for your own charity!

## 📚 API Reference

### Supabase Helper Functions

#### Projects

```typescript
// Get all projects
getProjects(): Promise<Project[]>

// Get active projects only
getActiveProjects(): Promise<Project[]>

// Get project by ID
getProjectById(id: string): Promise<Project>

// Create new project
createProject(project: ProjectInsert): Promise<Project>

// Update project
updateProject(id: string, updates: ProjectUpdate): Promise<Project>

// Delete project
deleteProject(id: string): Promise<void>
```

#### Donations

```typescript
// Create donation
createDonation(donation: DonationInsert): Promise<Donation>

// Get all donations
getDonations(): Promise<Donation[]>

// Get donations by project
getDonationsByProject(projectId: string): Promise<Donation[]>

// Update donation status
updateDonationStatus(id: string, status: string): Promise<Donation>
```

#### Dashboard

```typescript
// Get dashboard statistics
getDashboardStats(): Promise<{
  activeProjects: number;
  totalRaised: number;
  totalDonations: number;
  successRate: number;
}>
```

### Project Object Structure

```typescript
interface Project {
  id: string;
  name: string;
  location: string;
  date: string;
  description: string;
  image: string;
  target_amount: number;
  raised_amount: number;
  donation_link: string | null;
  status: 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

## 🎯 Quick Reference Card

### Admin Credentials
```
URL: http://localhost:5173/admin
Credentials: Set in .env file (see .env.example)
```

### Environment Setup
```bash
# 1. Install dependencies
npm install

# 2. Setup .env file
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

# 3. Run SQL in Supabase
COPY_THIS_TO_SUPABASE.sql

# 4. Start dev server
npm run dev
```

### Key Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
```

### Project Structure
```
src/
├── components/     # Reusable components
│   ├── admin/     # Admin dashboard components
│   └── ...        # Public components
├── pages/         # Page components
├── utils/         # Helper functions
│   └── supabase/  # Database helpers
└── styles/        # Global styles
```

### Database Tables
- **projects** - All charity projects
- **donations** - Donation records
- **project-images** - Image storage bucket

### Key Features
✅ Project Management (CRUD)
✅ Image Upload to Supabase
✅ External Donation Links
✅ Real-time Statistics
✅ Dark Mode Support
✅ Mobile Responsive
✅ Row Level Security

---

**Built with ❤️ for making a difference**

*Empowering charities to reach more people and make a bigger impact.*