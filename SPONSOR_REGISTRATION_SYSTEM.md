# Sponsor Registration System

## Overview
Complete sponsor registration flow with eligibility checking, account creation, document upload, and **admin approval workflow**.

## Flow Steps

### 1. Eligibility Check
Sponsors must pass eligibility requirements:
- **Age**: Must be 21 years or older
- **Sponsor Type**: Individual, Organization, or Foundation
- **Financial Capability**: Must be able to sponsor at least one student ($200-$500)
- **Commitment Duration**: Must commit to supporting students (3-6 months minimum)
- **Motivation**: Must provide reason for sponsoring (minimum 50 characters)
- **Previous Experience**: Optional - have they sponsored before?

### 2. Eligibility Result
- **Eligible**: Shows success message and proceeds to registration
- **Not Eligible**: Shows reason for ineligibility and stops the process

### 3. Registration Form
Eligible sponsors must provide:

#### Personal Information
- Full Name
- Email Address
- Phone Number
- Age (from eligibility check)

#### Location Information
- Nationality (dropdown with ALL countries)
- Country of Residence (dropdown with ALL countries)
- City
- Address

#### Organization Details (if applicable)
- Organization Name (for organizations/foundations)

#### Identity Verification
- Upload ID Document (Passport, National ID, or Driver's License)
- Accepted formats: JPG, PNG, PDF (max 5MB)
- Image preview for uploaded documents

#### Account Security
- Password (minimum 8 characters)
- Confirm Password
- Show/hide password toggle with eye icon

### 4. Account Pending Approval
Upon successful registration:
1. Creates user in Supabase Auth
2. Uploads ID document to `sponsor-documents` storage bucket
3. Creates sponsor profile in `sponsor_users` table with:
   - All personal and location information
   - Organization details (if applicable)
   - ID document URL
   - Eligibility data (motivation, financial capability)
   - **Account Status: PENDING**
   - **Approval Status: PENDING**
4. Sends notification to all admins about new sponsor registration
5. Shows "Pending Approval" screen to sponsor

### 5. Admin Review Process
Admins can:
- View all pending sponsor applications
- Review sponsor details and documents
- **Approve** sponsor account → Sponsor can login
- **Reject** sponsor account → Sponsor cannot login
- Add admin notes and rejection reasons

### 6. Login Restrictions
- **Before Approval**: Sponsor CANNOT login
  - Login attempt shows: "Your sponsor account is pending approval"
- **After Approval**: Sponsor CAN login and access dashboard
- **If Rejected**: Login shows rejection message
- **If Suspended**: Login shows suspension message

## Components

### `SponsorEligibilityCheck.tsx`
Eligibility verification form with:
- Age input (minimum 21)
- Sponsor type selector (Individual/Organization/Foundation)
- Financial capability check
- Commitment duration selector
- Previous sponsorship experience
- Motivation textarea (minimum 50 characters)
- Real-time validation

### `CompleteSponsorRegistration.tsx`
Comprehensive registration form with:
- Multi-section layout (Personal, Location, Organization, Identity, Security)
- Country dropdowns (ALL countries, not restricted)
- File upload with preview
- Form validation
- Password strength requirements
- Supabase integration for auth and storage
- Pending approval notice

### `SponsorRegistrationFlow.tsx`
Main orchestrator component that manages:
- Eligibility check → Result → Registration → Pending approval
- Step transitions
- Eligibility state management
- Success handling with pending approval screen

### `SponsorLogin.tsx`
Login component with approval checking:
- Email and password authentication
- **Checks sponsor approval status before allowing login**
- Shows appropriate error messages based on account status
- Prevents login for pending/rejected/suspended accounts
- Link to registration for new sponsors

## Database Schema

### `sponsor_users` Table
```sql
CREATE TABLE sponsor_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    age INTEGER NOT NULL,
    nationality TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    organization TEXT,
    sponsor_type TEXT NOT NULL,
    id_document_url TEXT NOT NULL,
    eligibility_motivation TEXT NOT NULL,
    eligibility_financial TEXT NOT NULL,
    
    -- Account Status
    account_status TEXT DEFAULT 'pending',
    approval_status TEXT DEFAULT 'pending',
    
    -- Admin Review
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    rejection_reason TEXT,
    admin_notes TEXT,
    
    -- Sponsorship Stats
    total_sponsored INTEGER DEFAULT 0,
    active_sponsorships INTEGER DEFAULT 0,
    total_amount_sponsored NUMERIC(12, 2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    approved_at TIMESTAMP
);
```

### Storage Bucket
- **Name**: `sponsor-documents`
- **Public**: Yes (for viewing uploaded documents)
- **Policies**: Sponsors can upload/read own documents, admins can read all

## Admin Functions

### Approve Sponsor
```sql
SELECT approve_sponsor(
    sponsor_id UUID,
    admin_id UUID,
    notes TEXT DEFAULT NULL
);
```
- Sets account_status and approval_status to 'approved'
- Records admin who approved and timestamp
- Sends notification to sponsor
- Sponsor can now login

### Reject Sponsor
```sql
SELECT reject_sponsor(
    sponsor_id UUID,
    admin_id UUID,
    reason TEXT,
    notes TEXT DEFAULT NULL
);
```
- Sets account_status and approval_status to 'rejected'
- Records rejection reason
- Sends notification to sponsor
- Sponsor cannot login

## Security Features

### Row Level Security (RLS)
- Sponsors can only access their own data
- Admins can view all sponsor registrations
- Secure file upload with type and size validation
- Password hashing via Supabase Auth

### Login Protection
- Application-level check for approval status
- Automatic sign-out if not approved
- Clear error messages for different account states

## Account Status States

### `account_status` and `approval_status`
- **pending**: Waiting for admin review (DEFAULT)
- **approved**: Admin approved, can login
- **rejected**: Admin rejected, cannot login
- **suspended**: Account suspended, cannot login

## Notifications

### Admin Notifications
- New sponsor registration → Notifies all admins
- Includes sponsor name and link to review page

### Sponsor Notifications
- Account approved → Success notification with login instructions
- Account rejected → Error notification with reason

## Usage

```tsx
import { SponsorRegistrationFlow } from './components/sponsor/SponsorRegistrationFlow';
import { SponsorLogin } from './components/sponsor/SponsorLogin';

// Registration Flow
function RegisterPage() {
  const handleComplete = () => {
    // Show pending approval message
    console.log('Registration complete, pending approval');
  };

  return (
    <SponsorRegistrationFlow
      darkMode={true}
      onComplete={handleComplete}
    />
  );
}

// Login Page
function LoginPage() {
  const handleSuccess = (userId: string, email: string, name: string) => {
    // Redirect to sponsor dashboard
    console.log('Login successful:', { userId, email, name });
  };

  const handleRegister = () => {
    // Navigate to registration
  };

  return (
    <SponsorLogin
      darkMode={true}
      onSuccess={handleSuccess}
      onRegister={handleRegister}
    />
  );
}
```

## Database Setup

Run the following SQL files in order:
1. `database/tables.sql` - Creates main tables
2. `database/sponsor_registration.sql` - Creates sponsor_users table, storage bucket, and approval functions

## Validation Rules

### Age
- Must be 21 or older
- Validated on eligibility check

### Financial Capability
- Must answer "Yes" to having financial capability
- Validated on eligibility check

### Commitment Duration
- Cannot select "Cannot commit"
- Validated on eligibility check

### Motivation
- Minimum 50 characters
- Validated on eligibility check

### Password
- Minimum 8 characters
- Must match confirmation
- Validated on registration form

### File Upload
- Accepted formats: JPG, PNG, PDF
- Maximum size: 5MB
- Validated before upload

### Required Fields
All fields marked with * are required

## Admin Dashboard Integration

Admins should have access to:
- **Pending Sponsors View**: List of all pending sponsor applications
- **Sponsor Details**: View full sponsor profile and documents
- **Approve/Reject Actions**: Buttons to approve or reject with reason
- **Sponsor Management**: View all sponsors (approved, rejected, suspended)
- **Sponsorship Statistics**: Track total sponsors, active sponsorships, amounts

## Differences from Student Registration

| Feature | Student | Sponsor |
|---------|---------|---------|
| **Age Requirement** | 19-31 | 21+ |
| **Country Restriction** | Yes (excludes USA, Europe, etc.) | No (all countries) |
| **Education Check** | Yes (no Master's/PhD) | No |
| **Computer/Internet** | Yes | No |
| **Admin Approval** | No (auto-approved) | **Yes (required)** |
| **Login Before Approval** | Yes | **No** |
| **Organization Field** | No | Yes (optional) |
| **Motivation Required** | No | Yes (50+ chars) |

## Error Handling

### Registration Errors
- Form validation errors shown inline
- Authentication errors displayed in error banner
- File upload errors with specific messages
- Network errors caught and displayed

### Login Errors
- Invalid credentials
- Account pending approval
- Account rejected with reason
- Account suspended
- Not a sponsor account

## Future Enhancements
- Email verification
- SMS verification for phone numbers
- Document verification by admins
- Multi-language support
- Sponsor dashboard with sponsorship management
- Payment integration
- Sponsor-student matching system
- Progress tracking for sponsored students
