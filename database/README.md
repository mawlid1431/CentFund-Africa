# CentFund Africa - Database Setup

This folder contains the complete database schema for the CentFund Africa platform, organized into 3 clean, maintainable files.

## 📁 File Structure

### **01_schema.sql** - Database Schema
Contains all tables, indexes, triggers, and functions:
- 16 tables (projects, users, students, sponsors, applications, etc.)
- Performance indexes
- Auto-update triggers
- Helper functions (quiz evaluation, sponsor management, notifications)
- Storage buckets configuration

### **02_security.sql** - Security & RLS Policies
Contains all security configurations:
- Row Level Security (RLS) policies for all tables
- Storage bucket policies (project-images, student-documents, sponsor-documents)
- Notification triggers
- Access control for different user roles (admin, student, sponsor)

### **03_seed.sql** - Sample Data
Contains test data for development:
- 4 sample projects (AWS, CCNA, IELTS, CompTIA A+)
- 4 success stories
- 4 testimonials
- 4 partner organizations
- 11 users (admins, sponsors, students)
- 60 quiz questions (15 per category)
- Sample applications

## 🚀 Quick Start

### Option 1: Run All Files (Recommended for fresh setup)

1. Open your Supabase SQL Editor
2. Run files in order:
   ```sql
   -- Step 1: Create schema
   -- Copy and paste 01_schema.sql, then click Run
   
   -- Step 2: Set up security
   -- Copy and paste 02_security.sql, then click Run
   
   -- Step 3: Add sample data
   -- Copy and paste 03_seed.sql, then click Run
   ```

### Option 2: Run Individual Files

If you only need specific parts:

- **Schema only**: Run `01_schema.sql`
- **Security only**: Run `02_security.sql` (requires schema)
- **Sample data only**: Run `03_seed.sql` (requires schema)

## 📋 What's Included

### Tables
1. **projects** - Certification programs
2. **team_members** - Team information
3. **success_stories** - Student success stories
4. **testimonials** - User testimonials
5. **partners** - Partner organizations
6. **users** - Admin and user accounts
7. **students** - Student registration data
8. **sponsor_users** - Sponsor registration data
9. **applications** - Student applications
10. **sponsors** - Legacy sponsor data
11. **quiz_questions** - Eligibility quiz questions
12. **quiz_attempts** - Quiz attempt history
13. **user_eligibility** - Student eligibility status
14. **application_history** - Application status changes
15. **sponsor_responses** - Sponsor decisions
16. **notifications** - User notifications

### Storage Buckets
- **project-images** - Project images (5MB limit)
- **student-documents** - Student ID documents (10MB limit)
- **sponsor-documents** - Sponsor documents (10MB limit)

### User Roles
- **admin** - Full system access
- **student_admin** - Manage students and applications
- **sponsor_admin** - Manage sponsors
- **applicant** - Student users
- **sponsor** - Sponsor users

## 🔐 Default Login Credentials

After running the seed file, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@centfundafrica.org | Admin@2024Secure! |
| Student Admin | student.admin@centfundafrica.org | StudentAdmin@2024! |
| Sponsor Admin | sponsor.admin@centfundafrica.org | SponsorAdmin@2024! |
| Sponsor | sponsor1@centfundafrica.org | Sponsor1@2024! |
| Student | applicant1@example.com | User1@2024! |

## 🔧 Key Features

### Automatic Notifications
- New student registration → Notify admins
- Quiz completion → Notify admins
- New application → Notify admins
- Application status change → Notify student
- Sponsor acceptance → Notify student
- Payment completion → Notify student

### Quiz System
- 40 questions per attempt (10 from each category)
- Pass score: 28/40 (70%)
- Categories: Grammar, Computer, Logic, Mathematics
- Randomized questions for each attempt

### Sponsor Workflow
- Registration with approval process
- Application assignment
- Accept/reject applications
- Payment confirmation
- Automatic status updates

## 📝 Notes

- All timestamps are in UTC with timezone support
- Passwords are hashed using bcrypt
- RLS policies ensure data security
- Indexes optimize query performance
- Triggers maintain data consistency

## 🆘 Troubleshooting

### If you get RLS errors:
1. Make sure you ran `02_security.sql` after `01_schema.sql`
2. Check that you're authenticated in Supabase
3. Verify your user role has the correct permissions

### If storage uploads fail:
1. Verify storage buckets exist in Supabase Storage
2. Check storage policies in `02_security.sql`
3. Ensure file size limits are not exceeded

### If functions don't work:
1. Make sure `01_schema.sql` ran completely
2. Check for any error messages in the SQL editor
3. Verify PostgreSQL extensions are enabled

## 🔄 Migration from Old Files

If you were using the old database files, this new structure consolidates:
- `tables.sql` → `01_schema.sql`
- `complete_setup.sql` → Split into all 3 files
- `student_registration.sql` → `01_schema.sql` + `02_security.sql`
- `sponsor_registration.sql` → `01_schema.sql` + `02_security.sql`
- `quiz_system.sql` → `01_schema.sql` + `03_seed.sql`
- `admin_notifications.sql` → `02_security.sql`
- All RLS fix files → `02_security.sql`
- `data.sql` → `03_seed.sql`

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the SQL comments in each file
3. Verify you ran files in the correct order
4. Check Supabase logs for detailed error messages
