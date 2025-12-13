# Database Setup Guide

## Overview
This guide will help you connect your CentFund Africa application to Supabase database and remove all hardcoded data.

## Step 1: Run Database Scripts in Supabase

1. **Login to Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project: `jwlpfmoohskipkcckaag`

2. **Run Tables Script**
   - Navigate to SQL Editor in the left sidebar
   - Click "New Query"
   - Copy the entire content from `database/tables.sql`
   - Paste it into the SQL editor
   - Click "Run" or press Ctrl+Enter
   - Wait for success message: "✅ All tables created successfully!"

3. **Run Data Script**
   - Click "New Query" again
   - Copy the entire content from `database/data.sql`
   - Paste it into the SQL editor
   - Click "Run" or press Ctrl+Enter
   - Wait for success message: "✅ Sample data inserted successfully!"

## Step 2: Verify Database Connection

Your `.env` file is already configured with:
```
VITE_SUPABASE_URL=https://jwlpfmoohskipkcckaag.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Test the Connection

Run your application:
```bash
npm run dev
```

The application will now:
- Load projects from database
- Load success stories from database
- Load testimonials from database
- Fall back to hardcoded data only if database fails

## What Data is Now in Database?

### Projects (4 Certification Programs)
- AWS Cloud Practitioner
- CCNA Networking Certification
- IELTS Certification
- CompTIA A+ Certification

### Success Stories (4 Stories)
- Amina Yusuf - AWS Cloud Practitioner
- Mohamed Abdi - CCNA Networking
- Fatima Hassan - IELTS
- Ibrahim Kamara - CompTIA A+

### Testimonials (4 Testimonials)
- Ahmed Ali - CCNA Graduate
- Halima Noor - AWS Certified
- John Mwangi - Investor & Sponsor
- Sarah Omondi - Corporate Sponsor

### Partners (4 Organizations)
- Tech Giants Foundation
- Global Education Alliance
- African Development Bank
- Skills for Tomorrow

### Users (11 Users)
- 3 Admins (admin, student_admin, sponsor_admin)
- 4 Sponsors (approved and ready)
- 4 Applicants (students)

### Applications (4 Student Applications)
- Various stages: pending, accepted_stage1, assigned_to_sponsor, pending_stage2

## Step 4: Admin Panel Access

The admin panel can now manage all database content:

### Admin Login
- Email: `admin@centfundafrica.org`
- Password: `Admin@2024Secure!`

### Features Available
- Manage Projects (Add/Edit/Delete)
- Manage Success Stories
- Manage Testimonials
- Manage Team Members
- View Applications
- Manage Sponsors

## Step 5: Remove Hardcoded Data (Optional)

Once you verify the database is working, you can remove hardcoded fallback data from:
- `pages/HomePage.tsx`
- `pages/ProjectsPage.tsx`
- `pages/SuccessStoriesPage.tsx`
- `pages/TestimonialsPage.tsx`
- `pages/SponsorDashboardPage.tsx`

## Troubleshooting

### Database Connection Issues
1. Check `.env` file has correct Supabase credentials
2. Verify Supabase project is active
3. Check browser console for errors

### No Data Showing
1. Verify you ran both SQL scripts (tables.sql then data.sql)
2. Check Supabase Table Editor to see if data exists
3. Check browser console for API errors

### RLS (Row Level Security) Issues
The tables.sql script already includes RLS policies for:
- Public read access to active content
- Admin full access
- User-specific access for applications and profiles

## Next Steps

1. ✅ Run database scripts in Supabase
2. ✅ Test the application
3. ✅ Login to admin panel
4. ✅ Add/edit content through admin interface
5. ✅ Remove hardcoded data once confident

## Database Schema

See `database/tables.sql` for complete schema including:
- 11 tables with relationships
- Indexes for performance
- Triggers for auto-updating timestamps
- Row Level Security policies
- Foreign key constraints

## Support

If you encounter issues:
1. Check Supabase logs in dashboard
2. Check browser console for errors
3. Verify environment variables are loaded
4. Test database connection in Supabase SQL editor
