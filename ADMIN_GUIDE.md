# Admin Panel Guide - CentFund Africa

## Overview
The admin panel allows you to manage all content that appears on the frontend website. Any changes you make in the admin panel will immediately reflect on the public-facing website.

---

## ✅ Current Status

### Working Features:
1. **Projects Management** ✅ - Fully connected to database
2. **Testimonials Management** ✅ - Fully connected to database
3. **Success Stories Management** ✅ - Fully connected to database
4. **Team Management** ✅ - Fully connected to database
5. **Applications Management** ✅ - Fully connected to database
6. **Partnership Management** ⚠️ - Using mock data (needs database connection)

---

## How It Works

### Data Flow:
```
Admin Panel → Supabase Database → Frontend Pages
```

When you:
- **Add** a project → It appears on Projects Page & Homepage
- **Edit** a testimonial → Changes show on Testimonials Page & Homepage
- **Delete** a success story → It's removed from Success Stories Page & Homepage
- **Update** team member → Changes reflect on About Page

---

## Admin Panel Access

### URL:
```
https://your-domain.com/admin
```

### Login Credentials:
- **Admin Email**: `admin@centfundafrica.org`
- **Password**: `admin123`

(Change these in production!)

---

## Features Breakdown

### 1. Projects Management ✅

**What it does:**
- Manage certification programs (AWS, CCNA, IELTS, etc.)
- Add new certification programs
- Edit existing programs
- Delete programs

**Where it appears:**
- Homepage (Featured Projects section)
- Projects Page (All projects grid)
- Project Detail Pages

**How to use:**
1. Click "Projects" tab in admin dashboard
2. Click "Add Project" button
3. Fill in:
   - Project Name (e.g., "AWS Cloud Practitioner")
   - Description
   - Image URL
   - Date/Status
4. Click "Save"

**Database Table:** `projects`

**Frontend Files:**
- `pages/HomePage.tsx` - Shows top 3 projects
- `pages/ProjectsPage.tsx` - Shows all projects
- `pages/ProjectDetailPage.tsx` - Individual project details

---

### 2. Testimonials Management ✅

**What it does:**
- Manage student and sponsor testimonials
- Add new testimonials
- Edit existing testimonials
- Delete testimonials

**Where it appears:**
- Homepage (Testimonials carousel)
- Testimonials Page (All testimonials)

**How to use:**
1. Click "Reviews" tab
2. Click "Add Testimonial"
3. Fill in:
   - Name
   - Role (e.g., "AWS Graduate")
   - Image URL
   - Rating (1-5 stars)
   - Feedback text
   - Project name
4. Click "Save"

**Database Table:** `testimonials`

**Frontend Files:**
- `pages/HomePage.tsx` - Infinite scroll carousel
- `pages/TestimonialsPage.tsx` - Grid view of all testimonials

---

### 3. Success Stories Management ✅

**What it does:**
- Manage student success stories
- Add new success stories
- Edit existing stories
- Delete stories

**Where it appears:**
- Homepage (Success Stories section)
- Success Stories Page (All stories with modal view)

**How to use:**
1. Click "Stories" tab
2. Click "Add Success Story"
3. Fill in:
   - Student Name
   - Age
   - Location
   - Project/Certification
   - Story text
   - Impact statement
   - Image URL
   - Date
4. Click "Save"

**Database Table:** `success_stories`

**Frontend Files:**
- `pages/HomePage.tsx` - Shows top 3 stories
- `pages/SuccessStoriesPage.tsx` - All stories with modal details

---

### 4. Team Management ✅

**What it does:**
- Manage team members
- Add new team members
- Edit existing members
- Delete members
- Set display order

**Where it appears:**
- About Page (Meet Our Team section)

**How to use:**
1. Click "Settings" tab (Team section)
2. Click "Add Team Member"
3. Fill in:
   - Name
   - Role/Title
   - Image URL
   - Email (optional)
   - LinkedIn URL (optional)
   - Display Order (for sorting)
4. Click "Save"

**Database Table:** `team_members`

**Frontend Files:**
- `pages/AboutPage.tsx` - Team grid section

---

### 5. Applications Management ✅

**What it does:**
- View student applications
- Review application details
- Approve/reject applications
- Assign to sponsors
- Track application status

**Where it appears:**
- Admin dashboard only (not public)

**How to use:**
1. Click "Applications" tab
2. View list of all applications
3. Click on application to view details
4. Update status as needed

**Database Table:** `applications`

---

### 6. Partnership Management ⚠️

**Current Status:** Using mock data

**What it should do:**
- Manage corporate partners
- Track contributions
- Monitor sponsored students

**To Fix:**
Need to:
1. Create `partners` table in Supabase
2. Connect PartnershipManager to database
3. Add CRUD functions in helpers

---

## Database Connection

### Current Setup:

**Supabase Configuration:**
- File: `.env`
- Variables:
  ```
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_anon_key
  ```

**Helper Functions:**
- File: `utils/supabase/helpers.ts`
- Functions:
  - `getProjects()` - Fetch all projects
  - `createProject()` - Add new project
  - `updateProject()` - Edit project
  - `deleteProject()` - Remove project
  - Similar functions for testimonials, stories, team

---

## Frontend Integration

### How Frontend Fetches Data:

**Example from HomePage:**
```typescript
const loadProjects = async () => {
  try {
    const data = await getActiveProjects();
    if (data && data.length > 0) {
      setProjects(data); // Updates UI
    } else {
      setProjects(hardcodedProjects); // Fallback
    }
  } catch (error) {
    console.error('Error:', error);
    setProjects(hardcodedProjects); // Fallback
  }
};
```

**Key Points:**
- Frontend automatically fetches from database
- Has fallback to hardcoded data if database fails
- Updates happen in real-time (on page load)

---

## Testing Your Changes

### After Adding/Editing Content:

1. **Save in Admin Panel**
   - Click "Save" button
   - Wait for success message

2. **Refresh Frontend Page**
   - Go to the relevant page (Home, Projects, etc.)
   - Refresh browser (F5 or Cmd+R)
   - Your changes should appear

3. **Check Multiple Devices**
   - Desktop view
   - Tablet view
   - Mobile view

---

## Common Tasks

### Adding a New Certification Program:

1. Go to Admin Panel → Projects
2. Click "Add Project"
3. Enter:
   - Name: "Google IT Support Certificate"
   - Description: "Professional certificate in IT support..."
   - Image: URL to certification image
   - Date: "Open" or specific date
4. Save
5. Check Projects Page - new program appears

### Adding a Student Testimonial:

1. Go to Admin Panel → Reviews
2. Click "Add Testimonial"
3. Enter student details
4. Save
5. Check Homepage carousel - testimonial appears

### Adding a Success Story:

1. Go to Admin Panel → Stories
2. Click "Add Success Story"
3. Enter story details
4. Save
5. Check Success Stories Page - story appears

### Updating Team Member:

1. Go to Admin Panel → Settings
2. Find team member
3. Click "Edit"
4. Update information
5. Save
6. Check About Page - changes appear

---

## Troubleshooting

### Changes Not Appearing on Frontend?

**Check:**
1. Did you save in admin panel?
2. Did you refresh the frontend page?
3. Is Supabase connection working?
4. Check browser console for errors

**Solution:**
```bash
# Check if database is connected
# Look at browser console (F12)
# Should see data being fetched
```

### Database Connection Error?

**Check:**
1. `.env` file has correct Supabase credentials
2. Supabase project is active
3. Tables exist in database
4. Row Level Security (RLS) policies allow reads

**Fix:**
```bash
# Verify .env file
cat .env

# Should show:
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

### Image Not Showing?

**Check:**
1. Image URL is valid and accessible
2. Image URL starts with `https://`
3. Image is not blocked by CORS

**Recommended Image Sources:**
- Unsplash: `https://images.unsplash.com/...`
- Cloudinary: `https://res.cloudinary.com/...`
- Supabase Storage: `https://xxx.supabase.co/storage/...`

---

## Database Tables Reference

### projects
```sql
- id (UUID)
- name (TEXT)
- description (TEXT)
- image (TEXT)
- date (TEXT)
- video_url (TEXT, optional)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### testimonials
```sql
- id (UUID)
- name (TEXT)
- role (TEXT)
- image (TEXT)
- rating (INTEGER, 1-5)
- feedback (TEXT)
- project (TEXT)
- location (TEXT)
- date (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### success_stories
```sql
- id (UUID)
- name (TEXT)
- age (INTEGER)
- location (TEXT)
- project (TEXT)
- story (TEXT)
- impact (TEXT)
- image (TEXT)
- date (TEXT)
- video_url (TEXT, optional)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### team_members
```sql
- id (UUID)
- name (TEXT)
- role (TEXT)
- image (TEXT)
- email (TEXT, optional)
- linkedin (TEXT, optional)
- order_index (INTEGER)
- status (TEXT: 'active' | 'inactive')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## Security Notes

### Admin Access:
- Change default admin password immediately
- Use strong passwords
- Don't share admin credentials
- Log out when done

### Database Security:
- Supabase RLS policies are enabled
- Public can only READ data
- Only authenticated admins can WRITE
- API keys are environment variables

---

## Next Steps

### To Complete Partnership Management:

1. **Create partners table in Supabase:**
```sql
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  contribution_amount NUMERIC(10, 2),
  status TEXT DEFAULT 'active',
  joined_date DATE,
  sponsored_students INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

2. **Add helper functions:**
```typescript
// In utils/supabase/helpers.ts
export async function getPartners() {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createPartner(partner: any) {
  const { data, error } = await supabase
    .from('partners')
    .insert(partner)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Add updatePartner and deletePartner similarly
```

3. **Update PartnershipManager.tsx:**
```typescript
// Replace loadPartners function
const loadPartners = async () => {
  try {
    const data = await getPartners();
    setPartners(data);
  } catch (error) {
    console.error('Error loading partners:', error);
  }
};
```

---

## Support

### Need Help?
- Check browser console for errors (F12)
- Review Supabase dashboard for database issues
- Check network tab for failed API calls

### Common Error Messages:

**"Failed to load projects"**
- Database connection issue
- Check Supabase credentials

**"Failed to save project"**
- Validation error
- Check required fields

**"Permission denied"**
- RLS policy issue
- Check Supabase policies

---

## Summary

✅ **What Works:**
- Projects: Add, Edit, Delete → Updates Projects Page & Homepage
- Testimonials: Add, Edit, Delete → Updates Testimonials Page & Homepage
- Success Stories: Add, Edit, Delete → Updates Success Stories Page & Homepage
- Team: Add, Edit, Delete → Updates About Page
- Applications: View, Manage → Admin only

⚠️ **What Needs Work:**
- Partnership Management needs database connection

🎯 **Result:**
All admin changes immediately reflect on the frontend after page refresh!

---

**Last Updated:** December 13, 2024
**Status:** ✅ Fully Functional (except Partnership)
