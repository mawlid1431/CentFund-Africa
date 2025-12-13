# 📊 Database Setup Files

This folder contains SQL scripts for setting up and maintaining your Supabase database.

## Files

### 1. `main.sql` ⭐ **MAIN DATABASE FILE**
**Purpose:** Complete database setup with all tables and sample data

**What it does:**
- Creates ALL required tables:
  - `projects` - Certification programs (4 sample projects)
  - `team_members` - Team member profiles
  - `success_stories` - Student success stories (4 samples)
  - `testimonials` - User testimonials (4 samples)
  - `partners` - Partner organizations (4 samples)
  - `users` - Admin, sponsors, and applicants
  - `applications` - Student applications (4 samples)
  - `sponsors` - Sponsor applications and details (4 active sponsors)
  - `application_history` - Status change tracking
  - `sponsor_responses` - Sponsor decisions
  - `notifications` - User notifications
- Sets up Row Level Security (RLS) policies
- Creates indexes for performance
- Adds auto-update triggers
- Populates sample data for testing

**Sample Data Included:**
- ✅ 4 Certification Projects (AWS, CCNA, IELTS, CompTIA A+)
- ✅ 4 Success Stories (Featured graduates)
- ✅ 4 Testimonials (Student and sponsor feedback)
- ✅ 4 Partner Organizations (Trusted partners)
- ✅ 4 Active Sponsors (Approved and ready)
- ✅ 4 Student Applications (Various statuses)
- ✅ 3 Admin Users (Main admin, Student admin, Sponsor admin)
- ✅ 4 Sponsor Users (Active sponsors)
- ✅ 4 Applicant Users (Students)

**When to run:**
- ✅ **First time setup** (REQUIRED)
- ✅ After database reset
- ✅ New environment (staging/production)
- ✅ Database corruption recovery

**How to run:**
1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to SQL Editor (left sidebar)
3. Click "New Query"
4. Copy entire contents of `main.sql`
5. Paste and click "Run" (or Ctrl+Enter)
6. Wait for completion message: "✅ Database setup complete!"

---

### 2. `APPLICATION_SYSTEM_SCHEMA.sql`
**Purpose:** Legacy application system schema (reference only)

**What it does:**
- Contains the original application system schema
- Includes detailed comments and documentation
- Reference for understanding the application workflow

**When to use:**
- 📖 Reference documentation
- 📖 Understanding table relationships
- ⚠️ Not needed if you run `main.sql`

---

### 3. `sponsors_table.sql`
**Purpose:** Legacy sponsors table schema (reference only)

**What it does:**
- Contains the original sponsors table definition
- Includes RLS policies for sponsors

**When to use:**
- 📖 Reference documentation
- ⚠️ Not needed if you run `main.sql`

---

## Database Schema

### Projects Table
```sql
projects (
  id                UUID PRIMARY KEY
  name              TEXT NOT NULL
  location          TEXT NOT NULL
  date              DATE NOT NULL
  description       TEXT NOT NULL
  image             TEXT NOT NULL
  target_amount     NUMERIC(12,2) NOT NULL
  raised_amount     NUMERIC(12,2) NOT NULL
  donation_link     TEXT
  status            TEXT NOT NULL (active/paused/completed)
  created_at        TIMESTAMP
  updated_at        TIMESTAMP
)
```

### Storage Bucket
- **Name:** `project-images`
- **Public:** Yes
- **Allowed file types:** Images (JPG, PNG, GIF)
- **Max file size:** 5MB

---

## Troubleshooting

### Issue: "Table already exists"
**Solution:** The table is already created. No action needed.

### Issue: "Permission denied for storage"
**Solution:** Run `fix-storage.sql`

### Issue: "Cannot insert into projects"
**Solution:** Check RLS policies. Re-run `setup.sql`

### Issue: Images not uploading
**Solution:** 
1. Run `fix-storage.sql`
2. Check file size (max 5MB)
3. Verify file type (images only)

---

## Production Deployment

When deploying to production:

1. **Create new Supabase project** for production
2. **Run `setup.sql`** in production database
3. **Update environment variables** in `.env`:
   ```env
   VITE_SUPABASE_URL=your_production_url
   VITE_SUPABASE_ANON_KEY=your_production_key
   ```
4. **Test thoroughly** before going live
5. **Remove sample data** if not needed

---

## Backup & Recovery

### Creating a Backup
1. Go to Supabase Dashboard → Database → Backups
2. Click "Create Backup"
3. Download backup file

### Restoring from Backup
1. Delete existing tables (if needed)
2. Run `setup.sql` to recreate structure
3. Import your backup data

---

## Important Notes

⚠️ **DO NOT DELETE THESE FILES**
- They are essential for database setup
- Needed for disaster recovery
- Required for team members
- Used in production deployment

✅ **Keep these files in version control**
- They contain no sensitive data
- Document your database structure
- Help with collaboration

🔒 **Security**
- These files contain no passwords
- No API keys or secrets
- Safe to commit to Git
- Safe to share with team

---

---

## 🚀 Quick Start

**New to the project? Start here:**

1. Read `QUICK_SETUP_GUIDE.md` - 5-minute setup walkthrough
2. Run `main.sql` in Supabase SQL Editor
3. Check `ADMIN_CREDENTIALS.md` for login details
4. Start your app: `npm run dev`

---

## 📁 File Overview

| File | Purpose | When to Use |
|------|---------|-------------|
| `main.sql` | **Complete database setup** 
