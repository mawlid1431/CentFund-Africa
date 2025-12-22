# Database Setup Guide

## 🚀 Quick Setup (Run These in Order)

### **Step 1: Open Supabase SQL Editor**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

---

### **Step 2: Run Migrations in Order**

#### **1. Create Main Tables** (Required First)
```sql
-- Copy and paste contents of: database/tables.sql
-- This creates: projects, team_members, users, applications, sponsors, etc.
```
Click **Run** or press `Ctrl+Enter`

---

#### **2. Create Student Registration System**
```sql
-- Copy and paste contents of: database/student_registration.sql
-- This creates: students table, storage bucket, RLS policies, triggers
```
Click **Run**

---

#### **3. Create Sponsor Registration System**
```sql
-- Copy and paste contents of: database/sponsor_registration.sql
-- This creates: sponsor_users table, storage bucket, RLS policies, triggers
```
Click **Run**

---

#### **4. Create Quiz System** (Optional but Recommended)
```sql
-- Copy and paste contents of: database/quiz_system.sql
-- This creates: quiz_questions, quiz_attempts, user_eligibility tables
```
Click **Run**

---

### **Step 3: Fix RLS Policies (If Getting Errors)**

If you get **"Row Level Security policy violation"** errors:

#### **Fix Student RLS**
```sql
-- Copy and paste contents of: database/fix_student_rls.sql
```
Click **Run**

#### **Fix Sponsor RLS**
```sql
-- Copy and paste contents of: database/fix_sponsor_rls.sql
```
Click **Run**

---

## 🔍 Verify Setup

### **Check Tables Exist**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected tables:**
- students
- sponsor_users
- quiz_questions
- quiz_attempts
- user_eligibility
- applications
- users
- notifications
- (and others from tables.sql)

---

### **Check Storage Buckets**
1. Go to **Storage** in Supabase Dashboard
2. Verify these buckets exist:
   - `student-documents`
   - `sponsor-documents`

If missing, create them:
- Click **New Bucket**
- Name: `student-documents` (or `sponsor-documents`)
- Public: **Yes** ✅
- Click **Create**

---

### **Check RLS Policies**
```sql
-- View all RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename IN ('students', 'sponsor_users')
ORDER BY tablename, policyname;
```

**Expected policies for `students`:**
- Students can create own profile
- Students can read own data
- Students can update own data
- Admins can read all students
- Admins can update students

---

### **Check Triggers**
```sql
-- View all triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('students', 'sponsor_users')
ORDER BY event_object_table, trigger_name;
```

**Expected triggers:**
- `update_students_updated_at` - Auto-update timestamp
- `trigger_notify_admin_new_student` - Send admin notification
- `trigger_grant_quiz_access` - Grant quiz access
- (Similar for sponsor_users)

---

## 🧪 Test Registration

### **Test Student Registration**
1. Go to your app
2. Click on a certification program
3. Click "Check Eligibility & Apply"
4. Fill eligibility form:
   - Age: 25
   - Country: Somalia
   - Education: High School
   - Computer: Yes
   - Internet: Yes
5. Click "Check Eligibility"
6. Should show "Congratulations! You're Eligible"
7. Click "New applicant?"
8. Fill registration form
9. Submit

**Check in Database:**
```sql
SELECT * FROM students ORDER BY created_at DESC LIMIT 1;
```

---

### **Test Admin Notification**
```sql
-- Check if admin was notified
SELECT * FROM notifications 
WHERE title = 'New Student Registration' 
ORDER BY created_at DESC 
LIMIT 1;
```

---

### **Test Quiz Access**
```sql
-- Check if quiz access was granted
SELECT * FROM user_eligibility 
ORDER BY created_at DESC 
LIMIT 1;
```

---

## ⚠️ Common Issues

### **Issue 1: RLS Policy Violation**
**Error:** `new row violates row-level security policy`

**Solution:**
```sql
-- Run: database/fix_student_rls.sql
-- OR temporarily disable RLS (NOT for production):
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
```

---

### **Issue 2: Storage Bucket Not Found**
**Error:** `Bucket not found: student-documents`

**Solution:**
1. Go to **Storage** in Supabase Dashboard
2. Click **New Bucket**
3. Name: `student-documents`
4. Public: Yes
5. Create

Then add policies:
```sql
-- Allow authenticated users to upload
CREATE POLICY "Students can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'student-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read
CREATE POLICY "Public can read student documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'student-documents');
```

---

### **Issue 3: Function Does Not Exist**
**Error:** `function update_updated_at_column() does not exist`

**Solution:**
Run `database/tables.sql` first - it creates this function.

---

### **Issue 4: Table Already Exists**
**Error:** `relation "students" already exists`

**Solution:**
Either:
1. Skip that migration (table already created)
2. Or drop and recreate:
```sql
DROP TABLE IF EXISTS students CASCADE;
-- Then run the migration again
```

---

## 🔄 Reset Everything (Development Only)

**⚠️ WARNING: This deletes ALL data!**

```sql
-- Drop all custom tables
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS sponsor_users CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS user_eligibility CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS sponsors CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- Delete storage buckets (do this in Dashboard)
-- Storage → student-documents → Delete
-- Storage → sponsor-documents → Delete

-- Delete all auth users (do this in Dashboard)
-- Authentication → Users → Select all → Delete
```

Then run all migrations again from Step 2.

---

## ✅ Setup Complete Checklist

- [ ] Ran `database/tables.sql`
- [ ] Ran `database/student_registration.sql`
- [ ] Ran `database/sponsor_registration.sql`
- [ ] Ran `database/quiz_system.sql`
- [ ] Fixed RLS policies if needed
- [ ] Verified tables exist
- [ ] Verified storage buckets exist
- [ ] Verified RLS policies exist
- [ ] Verified triggers exist
- [ ] Tested student registration
- [ ] Checked admin notification
- [ ] Checked quiz access granted
- [ ] `.env` file configured correctly
- [ ] Dev server running

---

## 🎉 You're Ready!

Your database is now set up and ready for:
- ✅ Student registration
- ✅ Sponsor registration
- ✅ Admin notifications
- ✅ Quiz system
- ✅ Application management

Start testing the registration flow!
