# Registration Systems Summary

## 🎓 Student Registration System

### Eligibility Requirements
- ✅ Age 19-31
- ✅ From eligible countries (excludes USA, Europe, China, Japan, Korea, Canada, Saudi Arabia)
- ✅ No Master's or PhD degree
- ✅ Has computer access
- ✅ Has internet access

### Registration Process
1. **Eligibility Check** → Pass requirements
2. **Account Choice** → Login or Register
3. **Complete Registration** → Fill all details + upload ID
4. **Auto-Approved** → Can login immediately

### Key Features
- Country dropdown with ~100 eligible countries
- Passport/National ID upload
- Password with show/hide toggle
- Data saved to `students` table
- **No admin approval needed**

---

## 💝 Sponsor Registration System

### Eligibility Requirements
- ✅ Age 21+
- ✅ Financial capability ($200-$500 per student)
- ✅ Commitment duration (3-6 months minimum)
- ✅ Motivation (50+ characters)
- ✅ Sponsor type (Individual/Organization/Foundation)

### Registration Process
1. **Eligibility Check** → Pass requirements
2. **Complete Registration** → Fill all details + upload ID
3. **Pending Approval** → Wait for admin review
4. **Admin Approves** → Can login
5. **Admin Rejects** → Cannot login

### Key Features
- Country dropdown with ALL countries (no restrictions)
- Organization field (optional)
- ID document upload
- Password with show/hide toggle
- Data saved to `sponsor_users` table
- **Admin approval REQUIRED before login**

---

## 🔐 Login Restrictions

### Student Login
- ✅ Can login immediately after registration
- ✅ No approval needed

### Sponsor Login
- ❌ **CANNOT login if status is "pending"**
- ❌ **CANNOT login if status is "rejected"**
- ❌ **CANNOT login if status is "suspended"**
- ✅ **CAN login only if status is "approved"**

---

## 📊 Database Tables

### `students` Table
```sql
- id (UUID, references auth.users)
- email, full_name, phone, date_of_birth
- nationality, resident_country, city, address
- education_level
- id_document_url
- eligibility_age, eligibility_country, eligibility_education
- registration_status (pending/approved/rejected)
```

### `sponsor_users` Table
```sql
- id (UUID, references auth.users)
- email, full_name, phone, age
- nationality, country, city, address
- organization (optional)
- sponsor_type (individual/organization/foundation)
- id_document_url
- eligibility_motivation, eligibility_financial
- account_status (pending/approved/rejected/suspended)
- approval_status (pending/approved/rejected)
- reviewed_by, reviewed_at, rejection_reason, admin_notes
- total_sponsored, active_sponsorships, total_amount_sponsored
```

---

## 🗂️ Storage Buckets

### `student-documents`
- Stores student ID documents (passport/national ID)
- Public read access
- Students can upload own documents

### `sponsor-documents`
- Stores sponsor ID documents
- Public read access
- Sponsors can upload own documents

---

## 👨‍💼 Admin Functions

### For Sponsors
```sql
-- Approve sponsor
SELECT approve_sponsor(sponsor_id, admin_id, notes);

-- Reject sponsor
SELECT reject_sponsor(sponsor_id, admin_id, reason, notes);
```

### Admin Notifications
- New sponsor registration → Notifies all admins
- Includes link to review pending sponsors

---

## 📁 Component Files

### Student Components
- `components/student/EligibilityCheck.tsx`
- `components/student/CompleteRegistration.tsx`
- `components/student/StudentRegistrationFlow.tsx`

### Sponsor Components
- `components/sponsor/SponsorEligibilityCheck.tsx`
- `components/sponsor/CompleteSponsorRegistration.tsx`
- `components/sponsor/SponsorRegistrationFlow.tsx`
- `components/sponsor/SponsorLogin.tsx`

### Database Files
- `database/student_registration.sql`
- `database/sponsor_registration.sql`

---

## 🚀 Quick Start

### 1. Run Database Migrations
```bash
# Run in Supabase SQL Editor
1. database/tables.sql
2. database/student_registration.sql
3. database/sponsor_registration.sql
```

### 2. Use Components

**Student Registration:**
```tsx
<StudentRegistrationFlow
  darkMode={true}
  onComplete={(userId, email, name) => {
    // Redirect to student dashboard
  }}
/>
```

**Sponsor Registration:**
```tsx
<SponsorRegistrationFlow
  darkMode={true}
  onComplete={() => {
    // Show pending approval message
  }}
/>
```

**Sponsor Login:**
```tsx
<SponsorLogin
  darkMode={true}
  onSuccess={(userId, email, name) => {
    // Redirect to sponsor dashboard
  }}
  onRegister={() => {
    // Navigate to registration
  }}
/>
```

---

## ✨ Key Differences

| Feature | Student | Sponsor |
|---------|---------|---------|
| Min Age | 19 | 21 |
| Max Age | 31 | No limit |
| Country Restrictions | Yes | No |
| Education Check | Yes | No |
| Computer/Internet Check | Yes | No |
| Motivation Required | No | Yes |
| Organization Field | No | Yes |
| Admin Approval | No | **Yes** |
| Can Login Before Approval | Yes | **No** |

---

## 📧 Notifications

### Students
- Registration confirmation (optional)

### Sponsors
- Account approved → Can login
- Account rejected → Reason provided

### Admins
- New sponsor registration → Review required
- Link to pending sponsors page

---

## 🔒 Security

- Row Level Security (RLS) enabled
- Password hashing via Supabase Auth
- File upload validation (type, size)
- Approval status checked on login
- Sponsors can only access own data
- Admins can access all data

---

## 📖 Documentation

- `STUDENT_REGISTRATION_SYSTEM.md` - Complete student system docs
- `SPONSOR_REGISTRATION_SYSTEM.md` - Complete sponsor system docs
- `REGISTRATION_SYSTEMS_SUMMARY.md` - This file (quick reference)
