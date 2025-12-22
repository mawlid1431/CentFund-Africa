# Student Registration System

## Overview
Complete student registration flow with eligibility checking, account creation, and document upload.

## Flow Steps

### 1. Eligibility Check
Students must pass eligibility requirements:
- **Age**: Must be between 19 and 31 years old
- **Country**: Must be from eligible countries (excludes USA, European countries, China, Japan, Korea, Canada, Saudi Arabia)
- **Education Level**: Cannot have Master's or PhD degree
- **Computer Access**: Must have access to a computer
- **Internet Access**: Must have reliable internet connection

### 2. Eligibility Result
- **Eligible**: Shows success message and proceeds to account choice
- **Not Eligible**: Shows reason for ineligibility and stops the process

### 3. Account Choice
After passing eligibility, students can:
- **Login**: If they already have an account
- **Register**: Create a new account (New Applicant)

### 4. Registration Form
New applicants must provide:

#### Personal Information
- Full Name
- Email Address
- Phone Number
- Date of Birth

#### Location Information
- Nationality (dropdown with eligible countries)
- Country of Residence (dropdown with eligible countries)
- City
- Address

#### Education Information
- Highest Level of Education (High School, Associate Degree, Bachelor's Degree)

#### Identity Verification
- Upload Passport or National ID (JPG, PNG, or PDF, max 5MB)
- Image preview for uploaded documents

#### Account Security
- Password (minimum 8 characters)
- Confirm Password
- Show/hide password toggle with eye icon

### 5. Data Storage
Upon successful registration:
1. Creates user in Supabase Auth
2. Uploads ID document to `student-documents` storage bucket
3. Creates student profile in `students` table with:
   - All personal information
   - Location details
   - Education level
   - ID document URL
   - Eligibility data from the check
   - Registration status (pending)

### 6. Success
- Shows success message
- Redirects to student dashboard

## Components

### `StudentRegistrationFlow.tsx`
Main orchestrator component that manages the entire flow:
- Handles step transitions
- Manages eligibility state
- Provides login functionality
- Coordinates registration process

### `EligibilityCheck.tsx`
Eligibility verification form with:
- Age input
- Country selector (eligible countries only)
- Education level dropdown
- Computer access radio buttons
- Internet access radio buttons
- Real-time validation

### `CompleteRegistration.tsx`
Comprehensive registration form with:
- Multi-section layout (Personal, Location, Education, Identity, Security)
- File upload with preview
- Form validation
- Password strength requirements
- Supabase integration for auth and storage

## Database Schema

### `students` Table
```sql
CREATE TABLE students (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    nationality TEXT NOT NULL,
    resident_country TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    education_level TEXT NOT NULL,
    id_document_url TEXT NOT NULL,
    eligibility_age TEXT NOT NULL,
    eligibility_country TEXT NOT NULL,
    eligibility_education TEXT NOT NULL,
    registration_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Bucket
- **Name**: `student-documents`
- **Public**: Yes (for viewing uploaded documents)
- **Policies**: Students can upload/read own documents, admins can read all

## Eligible Countries
The system includes all countries EXCEPT:
- USA
- All European countries
- China
- Japan
- North Korea / South Korea
- Canada
- Saudi Arabia

Total: ~100+ eligible countries from Africa, Asia, Latin America, Middle East, and Oceania.

## Security Features
- Row Level Security (RLS) enabled on students table
- Students can only access their own data
- Admins can view all student registrations
- Secure file upload with type and size validation
- Password hashing via Supabase Auth
- Email verification (optional, can be enabled in Supabase)

## Usage

```tsx
import { StudentRegistrationFlow } from './components/student/StudentRegistrationFlow';

function App() {
  const handleComplete = (userId: string, email: string, name: string) => {
    // Redirect to student dashboard
    console.log('Registration complete:', { userId, email, name });
  };

  return (
    <StudentRegistrationFlow
      darkMode={true}
      onComplete={handleComplete}
    />
  );
}
```

## Database Setup

Run the following SQL files in order:
1. `database/tables.sql` - Creates main tables
2. `database/student_registration.sql` - Creates students table and storage bucket

## Validation Rules

### Age
- Must be between 19 and 31 years old
- Validated on eligibility check

### Education
- Cannot be "Master's Degree" or "Doctorate (PhD)"
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
All fields marked with * are required:
- Full Name
- Email
- Phone
- Date of Birth
- Nationality
- Country of Residence
- City
- Address
- Education Level
- ID Document
- Password
- Confirm Password

## Error Handling
- Form validation errors shown inline
- Authentication errors displayed in error banner
- File upload errors with specific messages
- Network errors caught and displayed to user

## Future Enhancements
- Email verification
- SMS verification for phone numbers
- Document verification by admins
- Multi-language support
- Progress saving (draft applications)
- Document quality checking
