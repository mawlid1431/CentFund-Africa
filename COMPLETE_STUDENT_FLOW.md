# Complete Student Registration & Application Flow

## Overview
This document describes the complete flow from student registration to quiz access and application submission.

---

## 🎓 **Student Journey**

### **Step 1: Eligibility Check**
**Location**: `ProjectDetailPage.tsx` → Eligibility Check Form

**Requirements**:
- ✅ Age: 19-31 years old
- ✅ Country: From eligible countries (dropdown with ~100 countries)
- ✅ Education: No Master's or PhD degree
- ✅ Computer Access: Yes
- ✅ Internet Access: Yes

**What Happens**:
- Student fills out eligibility form
- System validates all criteria
- If eligible → Shows "Congratulations! You're Eligible"
- If not eligible → Shows specific reason and stops

---

### **Step 2: Account Choice**
**Location**: `ProjectDetailPage.tsx` → Auth Step

**Two Options**:

#### **Option A: Already have an account?**
- Redirects to login page
- Student logs in with existing credentials
- Goes directly to dashboard

#### **Option B: New applicant?** ⭐
- Clicks "Create an account and complete your application"
- Redirects to Complete Registration Form

---

### **Step 3: Complete Registration**
**Location**: `CompleteRegistration.tsx`

**Form Fields**:

#### Personal Information
- Full Name *
- Email Address *
- Phone Number *
- Date of Birth *

#### Location Information
- Nationality * (dropdown with eligible countries)
- Country of Residence * (dropdown with eligible countries)
- City *
- Address *

#### Education Information
- Highest Level of Education * (High School, Associate, Bachelor's)

#### Identity Verification
- Upload Passport or National ID * (JPG, PNG, PDF, max 5MB)
- Image preview shown

#### Account Security
- Password * (minimum 8 characters)
- Confirm Password *
- Show/hide password toggles

**What Happens When Submitted**:

1. **Validates all fields**
   - Checks all required fields filled
   - Validates password match
   - Validates password length (8+ chars)
   - Validates file upload

2. **Creates Supabase Auth User**
   ```typescript
   supabase.auth.signUp({
     email,
     password,
     options: {
       data: { full_name, phone }
     }
   })
   ```

3. **Uploads ID Document**
   - Uploads to `student-documents` storage bucket
   - Path: `id-documents/{userId}_{timestamp}.{ext}`
   - Gets public URL

4. **Creates Student Profile in Database**
   ```sql
   INSERT INTO students (
     id, email, full_name, phone, date_of_birth,
     nationality, resident_country, city, address,
     education_level, id_document_url,
     eligibility_age, eligibility_country, eligibility_education,
     registration_status
   ) VALUES (...)
   ```

5. **Triggers Database Functions** (Automatic)
   
   **a) Admin Notification Trigger**
   ```sql
   -- Sends notification to all admins
   INSERT INTO notifications (user_id, title, message, type, link)
   SELECT id, 'New Student Registration', 
          'A new student "John Doe" has registered from Somalia.',
          'info', '/admin/students/pending'
   FROM users WHERE role IN ('admin', 'student_admin');
   ```
   
   **b) Quiz Access Trigger**
   ```sql
   -- Grants quiz access to new student
   INSERT INTO user_eligibility (user_id, quiz_passed, eligible_to_apply)
   VALUES (student_id, FALSE, FALSE);
   ```

6. **Success!**
   - Student account created
   - Data saved to database
   - Admin notified
   - Quiz access granted
   - Student can now login

---

### **Step 4: Student Logs In**
**Location**: Login Page

**What Happens**:
- Student enters email and password
- System authenticates via Supabase Auth
- Retrieves student profile from `students` table
- Checks quiz eligibility from `user_eligibility` table
- Redirects to Student Dashboard

---

### **Step 5: Student Dashboard**
**Location**: `StudentDashboard.tsx`

**Student Can See**:
- Welcome message with their name
- Profile information
- **Quiz Access Section** ⭐
  - "Take Eligibility Quiz" button
  - Quiz status: Not Started / In Progress / Passed / Failed
  - Number of attempts remaining
- Available certifications (after passing quiz)
- Application status

---

### **Step 6: Take Eligibility Quiz** 📝
**Location**: Quiz Page (to be implemented)

**Quiz Details**:
- **40 questions** total
- **4 categories**:
  - Grammar (10 questions)
  - Computer Skills (10 questions)
  - Logic (10 questions)
  - Mathematics (10 questions)
- **Passing Score**: 70% (28/40 correct)
- **Time Limit**: 60 minutes
- **Attempts**: Unlimited (but tracked)

**What Happens**:
1. Student clicks "Take Quiz"
2. Quiz loads 40 random questions from `quiz_questions` table
3. Student answers all questions
4. System calculates score
5. Saves attempt to `quiz_attempts` table
6. Updates `user_eligibility` table:
   - If score ≥ 70%: `quiz_passed = TRUE`, `eligible_to_apply = TRUE`
   - If score < 70%: Can retake quiz

**Database Updates**:
```sql
-- Save quiz attempt
INSERT INTO quiz_attempts (
  user_id, score, total_questions, passed,
  time_taken_seconds, answers, attempt_number
) VALUES (...);

-- Update eligibility if passed
UPDATE user_eligibility
SET quiz_passed = TRUE,
    eligible_to_apply = TRUE,
    best_score = score,
    total_attempts = total_attempts + 1,
    last_attempt_at = NOW()
WHERE user_id = student_id;
```

---

### **Step 7: Apply for Certification** (After Passing Quiz)
**Location**: Application Form

**Requirements**:
- ✅ Student registered
- ✅ Quiz passed (score ≥ 70%)
- ✅ `eligible_to_apply = TRUE`

**Application Form Fields**:
- Certification selection
- Motivation letter
- Career goals
- Financial situation
- Additional documents (resume, transcripts)

**What Happens**:
1. Student fills application form
2. Submits application
3. Saves to `applications` table
4. Admin receives notification
5. Application status: "Pending Review"

---

## 👨‍💼 **Admin View**

### **Admin Dashboard**
**Location**: `AdminDashboard.tsx`

**Admin Can See**:

#### **1. New Student Registrations** 🔔
- Notification badge with count
- List of newly registered students
- Student details:
  - Name, Email, Phone
  - Country, City
  - Education Level
  - Registration Date
  - ID Document (view/download)
- Actions:
  - View full profile
  - Approve/Reject registration
  - Send message to student

#### **2. Quiz Results**
- List of students who took quiz
- Quiz scores and pass/fail status
- Number of attempts
- View detailed quiz answers

#### **3. Pending Applications**
- Students who passed quiz and applied
- Application details
- Review and approve/reject

#### **4. All Students**
- Complete list of registered students
- Filter by:
  - Registration status
  - Quiz status
  - Application status
  - Country
  - Education level
- Export to CSV

---

## 📊 **Database Tables**

### **1. `students` Table**
Stores student registration data
```sql
- id (UUID, references auth.users)
- email, full_name, phone, date_of_birth
- nationality, resident_country, city, address
- education_level
- id_document_url
- eligibility_age, eligibility_country, eligibility_education
- registration_status (pending/approved/rejected)
- created_at, updated_at
```

### **2. `user_eligibility` Table**
Tracks quiz access and eligibility
```sql
- id, user_id (references users)
- quiz_passed (BOOLEAN)
- best_score (INTEGER)
- total_attempts (INTEGER)
- last_attempt_at (TIMESTAMP)
- eligible_to_apply (BOOLEAN)
- created_at, updated_at
```

### **3. `quiz_attempts` Table**
Stores all quiz attempts
```sql
- id, user_id
- score, total_questions, passed
- time_taken_seconds
- answers (JSONB)
- attempt_number
- created_at
```

### **4. `quiz_questions` Table**
Stores quiz questions
```sql
- id, category, question
- option_a, option_b, option_c, option_d
- correct_answer
- difficulty, active
- created_at, updated_at
```

### **5. `applications` Table**
Stores certification applications
```sql
- id, applicant_id (references users)
- certification_name, certification_provider
- motivation_letter, career_goals
- status (pending/under_review/accepted/rejected)
- created_at, updated_at
```

### **6. `notifications` Table**
Stores admin notifications
```sql
- id, user_id (admin)
- title, message, type
- read (BOOLEAN)
- link
- created_at
```

---

## 🔄 **Complete Flow Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                    STUDENT REGISTRATION FLOW                 │
└─────────────────────────────────────────────────────────────┘

1. Click "Apply Now" on Certification Program
   ↓
2. Fill Eligibility Check Form
   - Age: 19-31 ✅
   - Country: Eligible ✅
   - Education: No Master's ✅
   - Computer: Yes ✅
   - Internet: Yes ✅
   ↓
3. Pass Eligibility → "Congratulations! You're Eligible"
   ↓
4. Choose: Login OR Create Account
   ↓
5. [NEW APPLICANT] Complete Registration Form
   - Personal Info
   - Location Info
   - Education
   - Upload ID
   - Password
   ↓
6. Submit Registration
   ↓
   ├─→ Create Auth User (Supabase)
   ├─→ Upload ID Document (Storage)
   ├─→ Save to students table (Database)
   ├─→ Trigger: Notify Admins 🔔
   └─→ Trigger: Grant Quiz Access 📝
   ↓
7. Registration Success! → Can Login
   ↓
8. Student Logs In → Student Dashboard
   ↓
9. See "Take Eligibility Quiz" Button
   ↓
10. Take Quiz (40 questions, 4 categories)
    ↓
    ├─→ Score ≥ 70% → PASS ✅
    │   └─→ eligible_to_apply = TRUE
    │       └─→ Can Apply for Certifications
    │
    └─→ Score < 70% → FAIL ❌
        └─→ Can Retake Quiz
        
11. [AFTER PASSING QUIZ] Apply for Certification
    ↓
12. Admin Reviews Application
    ↓
13. Approved → Student Gets Certification Funding! 🎉
```

---

## 🔐 **Security Features**

1. **Row Level Security (RLS)**
   - Students can only access their own data
   - Admins can access all student data

2. **Password Security**
   - Minimum 8 characters
   - Hashed by Supabase Auth
   - Never stored in plain text

3. **File Upload Security**
   - Type validation (JPG, PNG, PDF only)
   - Size limit (5MB max)
   - Stored in secure bucket
   - Public URL for viewing

4. **Quiz Security**
   - Questions randomized
   - Answers stored encrypted
   - Time tracking
   - Attempt tracking

---

## 📧 **Notifications**

### **Admin Notifications**
- New student registration
- Student passed quiz
- New application submitted
- Application status changes

### **Student Notifications** (Future)
- Registration approved
- Quiz results
- Application status updates
- Messages from admin

---

## 🚀 **Next Steps**

1. ✅ Student registration → **DONE**
2. ✅ Admin notifications → **DONE**
3. ✅ Quiz access granted → **DONE**
4. 🔨 Build Quiz UI component
5. 🔨 Build Admin student management page
6. 🔨 Build Application form
7. 🔨 Build Sponsor matching system

---

## 📝 **Summary**

**What's Working Now**:
- ✅ Eligibility check with age 19-31
- ✅ Country dropdown with eligible countries
- ✅ Complete registration form
- ✅ Data saved to database
- ✅ Admin notifications sent
- ✅ Quiz access automatically granted
- ✅ Student can login

**What Student Gets**:
- ✅ Account created
- ✅ Profile saved
- ✅ Quiz access
- ✅ Can login and see dashboard

**What Admin Gets**:
- ✅ Notification of new student
- ✅ Can view student details
- ✅ Can see quiz eligibility status
- ✅ Can manage students

**Student Must Do Before Applying**:
1. Register account ✅
2. Login ✅
3. **Take eligibility quiz** 📝
4. **Pass with 70%+ score** ✅
5. Then can apply for certifications ✅
