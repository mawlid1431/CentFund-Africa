# Application Management System Guide

## Overview
This system allows users to apply for certification sponsorship, admins to manage applications through multiple stages, and sponsors to review and support assigned applicants.

## User Credentials

### Admin Access
- **Email:** admin@centfundafrica.org
- **Password:** Admin@2024Secure!
- **Access URL:** `/admin`

### Sponsor Access (Example Accounts)
1. **Sponsor 1**
   - Email: sponsor1@centfundafrica.org
   - Password: Sponsor1@2024!
   - Name: John Smith

2. **Sponsor 2**
   - Email: sponsor2@centfundafrica.org
   - Password: Sponsor2@2024!
   - Name: Sarah Johnson

3. **Sponsor 3**
   - Email: sponsor3@centfundafrica.org
   - Password: Sponsor3@2024!
   - Name: Michael Brown

### User/Applicant Access (Example Accounts)
1. **User 1**
   - Email: applicant1@example.com
   - Password: User1@2024!

2. **User 2**
   - Email: applicant2@example.com
   - Password: User2@2024!

## Application Workflow

### Stage 1: Initial Application
1. **User Submits Application**
   - User fills out certification application form
   - Status: `pending`
   - Stage: 1

2. **Admin Reviews Application**
   - Admin can view all application details
   - Admin can see: personal info, education, certification details, documents
   - Admin can view submission date and time

3. **Admin Actions**
   - **Accept to Stage 1:** Changes status to `accepted_stage1`
   - **Reject:** Changes status to `rejected`

### Stage 2: Sponsor Assignment
1. **Admin Assigns Sponsor**
   - After accepting to Stage 1, admin can assign a sponsor
   - Admin sees list of active sponsors with their capacity
   - Status changes to `assigned_to_sponsor`

2. **Sponsor Reviews Application**
   - Sponsor logs in to their dashboard
   - Sponsor sees assigned applicant details
   - Sponsor can view all application information

3. **Sponsor Decision**
   - **Accept:** Sponsor agrees to support the applicant
   - **Payment Method Selection:**
     - **Pay Direct to Exam Center:** Sponsor pays directly
     - **Pay Through Us:** Sponsor pays through the platform
   
4. **Payment Process**
   - If "Pay Through Us" is selected:
     - Additional questions are asked
     - Agreement must be checked
   - If "Pay Direct" is selected:
     - Similar process with agreement

5. **Admin Moves to Stage 2**
   - Admin can move application to `pending_stage2`
   - Stage changes to 2

### Stage 3: Final Approval
1. **Admin Final Review**
   - Admin reviews Stage 2 status
   - Admin can see sponsor assignment and payment status

2. **Admin Actions**
   - **Accept Stage 2 (Final):** Changes status to `accepted_stage2`
   - **Reject:** Changes status to `rejected`

## Application Status Flow

```
pending → accepted_stage1 → assigned_to_sponsor → pending_stage2 → accepted_stage2
   ↓            ↓                    ↓                   ↓              ↓
rejected     rejected            rejected            rejected      COMPLETED
```

## Admin Features

### Application Management Dashboard
- **URL:** `/admin/applications`
- **Features:**
  - View all applications in a table
  - Search by name or email
  - Filter by status
  - View detailed application information
  - Change application status
  - Assign sponsors to applications
  - Track application progress through stages

### Statistics
- Total Applications
- Pending Applications
- Accepted Applications
- Rejected Applications

### Application Details View
Shows complete information including:
- Personal Information (name, email, phone, DOB, gender, nationality, address)
- Education Background (level, institution, field of study)
- Certification Details (name, cost, motivation, career goals, financial situation)
- Application Status (current status, stage, submission date/time)
- Documents (resume, ID)

### Admin Actions by Status
- **Pending:** Accept to Stage 1 or Reject
- **Accepted Stage 1:** Assign Sponsor or Move to Stage 2
- **Pending Stage 2:** Accept Stage 2 (Final) or Reject

## Sponsor Features

### Sponsor Dashboard
- View assigned applications
- See applicant details
- Accept or decline sponsorship
- Choose payment method
- Track sponsorship progress

### Sponsor Capacity
- Each sponsor has a maximum number of sponsorships
- Admin can see current capacity when assigning
- System prevents over-assignment

## Database Schema

### Tables
1. **applications** - Stores all application data
2. **users** - Stores user, admin, and sponsor accounts
3. **sponsors** - Stores sponsor-specific information
4. **sponsor_assignments** - Tracks sponsor-application assignments
5. **application_history** - Logs all status changes
6. **sponsor_payments** - Tracks payment information

## Setup Instructions

1. **Configure Supabase**
   - Update `.env` with your Supabase credentials
   - Run the SQL schema in `database/APPLICATION_SYSTEM_SCHEMA.sql`

2. **Create Admin Account**
   - Use the credentials from `.env`
   - Or create manually in Supabase

3. **Create Sponsor Accounts**
   - Use the credentials from `.env`
   - Or create manually in Supabase

4. **Test the System**
   - Create a test application as a user
   - Log in as admin to review
   - Assign to a sponsor
   - Log in as sponsor to review

## Security Notes

- All passwords should be changed in production
- Use environment variables for sensitive data
- Implement proper authentication and authorization
- Enable Row Level Security (RLS) in Supabase
- Validate all user inputs
- Sanitize data before display

## Support

For issues or questions, contact the development team.
