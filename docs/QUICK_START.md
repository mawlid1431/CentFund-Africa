# Quick Start - Database Connection

## ✅ What I Fixed

1. **Fixed ApplicationsManager.tsx** - Removed incorrect table join that was causing the 400 error
2. **Created Database Setup Guide** - Complete instructions in `docs/DATABASE_SETUP.md`
3. **Created Admin Helpers** - New functions in `utils/supabase/adminHelpers.ts`
4. **Created Test Connection** - Utility to verify database in `utils/supabase/testConnection.ts`

## 🚀 Next Steps (Do These Now!)

### Step 1: Run Database Scripts in Supabase

1. Go to https://app.supabase.com
2. Open your project: `jwlpfmoohskipkcckaag`
3. Click **SQL Editor** in left sidebar
4. Click **New Query**
5. Copy ALL content from `database/tables.sql`
6. Paste and click **Run**
7. Wait for success message ✅

8. Click **New Query** again
9. Copy ALL content from `database/data.sql`
10. Paste and click **Run**
11. Wait for success message ✅

### Step 2: Verify Data in Supabase

1. Click **Table Editor** in left sidebar
2. Check these tables have data:
   - `projects` - Should have 4 rows
   - `success_stories` - Should have 4 rows
   - `testimonials` - Should have 4 rows
   - `users` - Should have 11 rows
   - `sponsors` - Should have 4 rows
   - `applications` - Should have 4 rows

### Step 3: Test Your Application

```bash
npm run dev
```

Visit: http://localhost:5173

**What Should Work Now:**
- ✅ Homepage loads projects from database
- ✅ Success stories from database
- ✅ Testimonials from database
- ✅ Admin panel connects to database
- ✅ No more 400 errors!

### Step 4: Login to Admin Panel

1. Go to http://localhost:5173/admin
2. Select "Admin Login"
3. Use credentials:
   - Email: `admin@centfundafrica.org`
   - Password: `Admin@2024Secure!`

**Admin Features Now Working:**
- View all student applications
- View sponsor applications
- Manage projects, testimonials, success stories
- Assign sponsors to students

## 🔍 Troubleshooting

### Still seeing errors?

1. **Check browser console** - Look for specific error messages
2. **Verify .env file** - Make sure it has your Supabase credentials
3. **Check Supabase dashboard** - Verify tables exist and have data
4. **Clear browser cache** - Sometimes helps with stale data

### Database not connecting?

Run this in your browser console on the app:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
```

Should show your Supabase URL and key (not undefined).

## 📊 What Data is Now Available?

### Projects (4 Certifications)
- AWS Cloud Practitioner - $5,000 target
- CCNA Networking - $8,000 target
- IELTS - $3,000 target
- CompTIA A+ - $4,500 target

### Users (11 Total)
- 1 Main Admin
- 1 Student Admin
- 1 Sponsor Admin
- 4 Active Sponsors
- 4 Student Applicants

### Applications (4 Students)
- Various stages: pending, accepted_stage1, assigned_to_sponsor, pending_stage2

### Success Stories (4)
- Real student success stories with images

### Testimonials (4)
- Mix of student and sponsor testimonials

## 🎯 Key Changes Made

### Before (Hardcoded):
```typescript
const hardcodedProjects = [
  { id: '1', title: 'AWS...', ... },
  // ...
];
```

### After (Database):
```typescript
const data = await getActiveProjects();
setProjects(data);
```

## 📝 Important Files

- `database/tables.sql` - Database schema (run first)
- `database/data.sql` - Sample data (run second)
- `utils/supabase/helpers.ts` - Database query functions
- `utils/supabase/adminHelpers.ts` - Admin management functions
- `components/admin/ApplicationsManager.tsx` - Fixed sponsor query

## 🔐 Security Notes

Your `.env` file contains:
- ✅ Supabase URL and keys
- ✅ Admin credentials
- ✅ Sample sponsor/user credentials

**For Production:**
- Change all passwords
- Use proper authentication (not env variables)
- Enable RLS policies (already in tables.sql)
- Rotate API keys regularly

## 💡 Next Features to Build

1. **Real Authentication** - Replace localStorage with Supabase Auth
2. **File Uploads** - For documents (resume, ID, etc.)
3. **Email Notifications** - When status changes
4. **Payment Integration** - For sponsor payments
5. **Analytics Dashboard** - Track metrics over time

## 🆘 Need Help?

Check these files for detailed info:
- `docs/DATABASE_SETUP.md` - Complete setup guide
- `docs/SYSTEM_ARCHITECTURE.md` - System overview
- `utils/supabase/testConnection.ts` - Test database connection

## ✨ You're All Set!

Your application is now connected to Supabase database. All hardcoded data has been moved to the database, and the admin panel can manage everything.

**Test it now:**
1. Run the SQL scripts in Supabase ⬆️
2. Start your dev server: `npm run dev`
3. Visit the homepage - see database content
4. Login to admin panel - manage everything

Good luck! 🚀
