# 🎯 Database Setup Checklist

## Current Status: ⚠️ NEEDS SETUP

Follow these steps in order:

---

## ☐ Step 1: Run Database Scripts in Supabase

### 1.1 Open Supabase Dashboard
- [ ] Go to https://app.supabase.com
- [ ] Login to your account
- [ ] Select project: `jwlpfmoohskipkcckaag`

### 1.2 Run Tables Script
- [ ] Click **SQL Editor** in left sidebar
- [ ] Click **New Query** button
- [ ] Open file: `database/tables.sql`
- [ ] Copy ALL content (Ctrl+A, Ctrl+C)
- [ ] Paste into SQL Editor
- [ ] Click **Run** button (or Ctrl+Enter)
- [ ] Wait for success message: "✅ All tables created successfully!"
- [ ] Verify: Should see "11 tables with indexes and triggers"

### 1.3 Run Data Script
- [ ] Click **New Query** button again
- [ ] Open file: `database/data.sql`
- [ ] Copy ALL content (Ctrl+A, Ctrl+C)
- [ ] Paste into SQL Editor
- [ ] Click **Run** button (or Ctrl+Enter)
- [ ] Wait for success message: "✅ Sample data inserted successfully!"
- [ ] Verify: Should see "4 Projects, 4 Success Stories, 11 Users, etc."

---

## ☐ Step 2: Verify Data in Supabase

### 2.1 Check Tables
- [ ] Click **Table Editor** in left sidebar
- [ ] Verify these tables exist:
  - [ ] `projects` (4 rows)
  - [ ] `success_stories` (4 rows)
  - [ ] `testimonials` (4 rows)
  - [ ] `team_members` (0 rows - empty is OK)
  - [ ] `partners` (4 rows)
  - [ ] `users` (11 rows)
  - [ ] `sponsors` (4 rows)
  - [ ] `applications` (4 rows)
  - [ ] `application_history` (0 rows - empty is OK)
  - [ ] `sponsor_responses` (0 rows - empty is OK)
  - [ ] `notifications` (0 rows - empty is OK)

### 2.2 Spot Check Data
- [ ] Click on `projects` table
- [ ] Should see: AWS Cloud Practitioner, CCNA, IELTS, CompTIA A+
- [ ] Click on `users` table
- [ ] Should see: admin@centfundafrica.org and other users
- [ ] Click on `applications` table
- [ ] Should see: 4 student applications with different statuses

---

## ☐ Step 3: Test Application

### 3.1 Start Development Server
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] Opens at http://localhost:5173

### 3.2 Test Homepage
- [ ] Visit http://localhost:5173
- [ ] Homepage loads without errors
- [ ] See 3 projects displayed (from database)
- [ ] See success stories section (from database)
- [ ] See testimonials scrolling (from database)
- [ ] Check browser console - NO 400 errors!

### 3.3 Test Projects Page
- [ ] Click "Projects" or "Apply Now"
- [ ] Should see 4 certification programs
- [ ] All images load correctly
- [ ] Click on a project - details show

### 3.4 Test Success Stories
- [ ] Click "Success Stories" in navigation
- [ ] Should see 4 success stories
- [ ] All from database (Amina, Mohamed, Fatima, Ibrahim)

### 3.5 Test Testimonials
- [ ] Click "Testimonials" in navigation
- [ ] Should see testimonials
- [ ] All from database

---

## ☐ Step 4: Test Admin Panel

### 4.1 Access Admin Login
- [ ] Visit http://localhost:5173/admin
- [ ] See login selection screen
- [ ] Click "Admin Login"

### 4.2 Login as Admin
- [ ] Email: `admin@centfundafrica.org`
- [ ] Password: `Admin@2024Secure!`
- [ ] Click "Sign In"
- [ ] Successfully logged in - see dashboard

### 4.3 Test Admin Dashboard
- [ ] See 4 main cards: Student Applicants, Becoming Sponsor, Active Sponsors, Completed
- [ ] Student Applicants shows: 4 total
- [ ] Click "Student Applicants" card
- [ ] See table with 4 applications
- [ ] NO errors in console!

### 4.4 Test Application Management
- [ ] Click "View" on any application
- [ ] Modal opens with full details
- [ ] See personal info, certification details, etc.
- [ ] Close modal

### 4.5 Test Other Admin Sections
- [ ] Click "Projects" tab
- [ ] Should see 4 projects from database
- [ ] Click "Success Stories" tab
- [ ] Should see 4 stories from database
- [ ] Click "Testimonials" tab
- [ ] Should see 4 testimonials from database

---

## ☐ Step 5: Verify No Hardcoded Data

### 5.1 Check Browser Console
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Refresh page
- [ ] Should see: "Loading projects from database..." or similar
- [ ] Should NOT see: "Using hardcoded data"
- [ ] Should NOT see: 400 errors
- [ ] Should NOT see: "Could not find relationship" errors

### 5.2 Check Network Tab
- [ ] Open DevTools Network tab
- [ ] Refresh page
- [ ] Filter by "supabase"
- [ ] Should see successful requests (200 status)
- [ ] Should see requests to: `/rest/v1/projects`, `/rest/v1/success_stories`, etc.

---

## ☐ Step 6: Test Sponsor Login (Optional)

### 6.1 Logout from Admin
- [ ] Click logout button in admin panel

### 6.2 Login as Sponsor
- [ ] Go back to http://localhost:5173/admin
- [ ] Click "Sponsor Login"
- [ ] Email: `sponsor1@centfundafrica.org`
- [ ] Password: 