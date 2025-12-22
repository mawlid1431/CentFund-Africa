# Troubleshooting Guide

## Common Issues and Solutions

---

## 🚫 **Error: 429 Too Many Requests**

### **Error Message:**
```
AuthApiError: For security purposes, you can only request this after 29 seconds.
```

### **What It Means:**
Supabase has rate limiting to prevent abuse. You're trying to create accounts too quickly.

### **Solutions:**

#### **1. Wait 30 Seconds (Quick Fix)**
Simply wait 30 seconds between registration attempts.

#### **2. Disable Rate Limiting in Development (Recommended)**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Rate Limits**
4. Adjust or disable rate limits for development:
   - **Sign up**: Increase from default (e.g., 10 per hour → 100 per hour)
   - **Sign in**: Increase if needed
5. **Important**: Re-enable strict limits before production!

#### **3. Use Different Emails**
Each test registration needs a unique email address.

#### **4. Clear Test Data**
Delete test users from Supabase:
1. Go to **Authentication** → **Users**
2. Delete test accounts
3. Try registering again

---

## 📧 **Error: User Already Registered**

### **Error Message:**
```
User already registered
```

### **What It Means:**
The email address is already in use.

### **Solutions:**
1. Use a different email address
2. Login with existing account instead
3. Delete the existing user from Supabase Dashboard

---

## 📁 **Error: Storage Bucket Not Found**

### **Error Message:**
```
Bucket not found: student-documents
```

### **What It Means:**
The storage bucket hasn't been created yet.

### **Solutions:**
1. Run the database migration:
   ```sql
   -- In Supabase SQL Editor
   -- Run: database/student_registration.sql
   ```
2. Or manually create bucket:
   - Go to **Storage** in Supabase Dashboard
   - Click **New Bucket**
   - Name: `student-documents`
   - Public: Yes
   - Run the storage policies from the SQL file

---

## 🔐 **Error: Row Level Security Policy Violation**

### **Error Message:**
```
new row violates row-level security policy
```

### **What It Means:**
RLS policies are blocking the insert/update.

### **Solutions:**
1. Check if RLS policies are created:
   ```sql
   -- Run in Supabase SQL Editor
   SELECT * FROM pg_policies WHERE tablename = 'students';
   ```
2. Re-run the migration file:
   ```sql
   -- database/student_registration.sql
   ```
3. Temporarily disable RLS for testing (NOT for production):
   ```sql
   ALTER TABLE students DISABLE ROW LEVEL SECURITY;
   ```

---

## 🗄️ **Error: Table Does Not Exist**

### **Error Message:**
```
relation "students" does not exist
```

### **What It Means:**
The database tables haven't been created.

### **Solutions:**
Run migrations in order:
1. `database/tables.sql` - Creates main tables
2. `database/student_registration.sql` - Creates students table
3. `database/sponsor_registration.sql` - Creates sponsor_users table
4. `database/quiz_system.sql` - Creates quiz tables

---

## 🔑 **Error: Invalid API Key**

### **Error Message:**
```
Invalid API key
```

### **What It Means:**
Supabase credentials in `.env` are incorrect or missing.

### **Solutions:**
1. Check `.env` file exists in project root
2. Verify credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Get correct values from Supabase Dashboard:
   - Go to **Settings** → **API**
   - Copy **Project URL** and **anon public** key
4. Restart dev server after updating `.env`

---

## 🖼️ **Error: File Upload Failed**

### **Error Message:**
```
Failed to upload file
```

### **What It Means:**
File upload to storage bucket failed.

### **Solutions:**
1. Check file size (max 5MB)
2. Check file type (JPG, PNG, PDF only)
3. Verify storage bucket exists
4. Check storage policies allow uploads
5. Check internet connection

---

## 🔄 **Error: CORS Policy**

### **Error Message:**
```
Access to fetch blocked by CORS policy
```

### **What It Means:**
Cross-Origin Resource Sharing issue with Supabase.

### **Solutions:**
1. Check Supabase URL in `.env` is correct
2. Verify you're using the correct anon key
3. Check if Supabase project is active
4. Clear browser cache and cookies
5. Try in incognito/private mode

---

## 🎯 **Development Best Practices**

### **Testing Registrations**
1. Use temporary email services:
   - [Temp Mail](https://temp-mail.org/)
   - [10 Minute Mail](https://10minutemail.com/)
2. Use email aliases:
   - Gmail: `youremail+test1@gmail.com`
   - Outlook: `youremail+test1@outlook.com`
3. Delete test users regularly

### **Database Testing**
1. Use separate Supabase project for development
2. Keep production data separate
3. Backup before testing migrations
4. Use transactions for testing:
   ```sql
   BEGIN;
   -- Your test queries
   ROLLBACK; -- Undo changes
   ```

### **Rate Limiting**
1. Increase limits in development
2. Use strict limits in production
3. Implement client-side rate limiting
4. Add loading states to prevent double-clicks

---

## 📊 **Checking Database State**

### **View All Students**
```sql
SELECT * FROM students ORDER BY created_at DESC;
```

### **View Quiz Eligibility**
```sql
SELECT s.full_name, s.email, ue.quiz_passed, ue.best_score, ue.total_attempts
FROM students s
LEFT JOIN user_eligibility ue ON s.id = ue.user_id
ORDER BY s.created_at DESC;
```

### **View Admin Notifications**
```sql
SELECT * FROM notifications 
WHERE type = 'info' 
ORDER BY created_at DESC 
LIMIT 10;
```

### **View Pending Sponsors**
```sql
SELECT * FROM sponsor_users 
WHERE approval_status = 'pending' 
ORDER BY created_at DESC;
```

---

## 🔧 **Reset Everything (Development Only)**

### **⚠️ WARNING: This deletes ALL data!**

```sql
-- Delete all students
DELETE FROM students;

-- Delete all sponsors
DELETE FROM sponsor_users;

-- Delete all quiz attempts
DELETE FROM quiz_attempts;

-- Delete all eligibility records
DELETE FROM user_eligibility;

-- Delete all notifications
DELETE FROM notifications;

-- Delete all auth users (Supabase Dashboard)
-- Go to Authentication → Users → Delete all
```

---

## 📞 **Getting Help**

### **Check Logs**
1. **Browser Console**: F12 → Console tab
2. **Network Tab**: F12 → Network tab
3. **Supabase Logs**: Dashboard → Logs

### **Common Log Locations**
- Registration errors: `CompleteRegistration.tsx:175`
- Login errors: `SponsorLogin.tsx:69`
- Database errors: Supabase Dashboard → Logs

### **Useful Commands**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

---

## ✅ **Verification Checklist**

Before reporting an issue, verify:

- [ ] `.env` file exists with correct credentials
- [ ] Database migrations have been run
- [ ] Storage buckets are created
- [ ] RLS policies are in place
- [ ] Dev server is running
- [ ] Browser console shows no errors
- [ ] Supabase project is active
- [ ] Internet connection is stable
- [ ] Using unique email addresses
- [ ] Waiting 30 seconds between signups
- [ ] File uploads are under 5MB
- [ ] Using supported file types (JPG, PNG, PDF)

---

## 🎓 **Learning Resources**

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
