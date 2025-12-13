# Login Credentials Guide

## Unified Login System

All users (Admin, Sponsors, and Applicants) can log in at `/admin` using their credentials stored in the `.env` file.

## How It Works

1. **Go to `/admin`**
2. **Enter your email and password**
3. **System automatically detects your user type and redirects you:**
   - **Admin** → Stays on Admin Dashboard
   - **Sponsor** → Redirects to Sponsor Dashboard (`/sponsor-dashboard`)
   - **Applicant** → Redirects to Home Page

---

## Login Credentials

### 🔐 Admin Access
**Email:** `admin@centfundafrica.org`  
**Password:** `Admin@2024Secure!`  
**Access:** Full admin dashboard with application management

---

### 💼 Sponsor Access

#### Sponsor 1
**Email:** `sponsor1@centfundafrica.org`  
**Password:** `Sponsor1@2024!`  
**Name:** John Smith

#### Sponsor 2
**Email:** `sponsor2@centfundafrica.org`  
**Password:** `Sponsor2@2024!`  
**Name:** Sarah Johnson

#### Sponsor 3
**Email:** `sponsor3@centfundafrica.org`  
**Password:** `Sponsor3@2024!`  
**Name:** Michael Brown

**Access:** Sponsor dashboard to view and manage assigned applications

---

### 👤 Applicant/User Access

#### User 1
**Email:** `applicant1@example.com`  
**Password:** `User1@2024!`

#### User 2
**Email:** `applicant2@example.com`  
**Password:** `User2@2024!`

**Access:** View application status and submit applications

---

## Testing the System

### Test Admin Login:
1. Go to `/admin`
2. Login with: `admin@centfundafrica.org` / `Admin@2024Secure!`
3. You'll see the Admin Dashboard with Applications tab

### Test Sponsor Login:
1. Go to `/admin`
2. Login with: `sponsor1@centfundafrica.org` / `Sponsor1@2024!`
3. You'll be redirected to Sponsor Dashboard

### Test Applicant Login:
1. Go to `/admin`
2. Login with: `applicant1@example.com` / `User1@2024!`
3. You'll be redirected to the home page

---

## Security Notes

⚠️ **Important for Production:**
- Change all default passwords
- Use a proper authentication system (Supabase Auth, Auth0, etc.)
- Never commit `.env` file to version control
- Use environment-specific credentials
- Implement proper session management
- Add rate limiting to prevent brute force attacks

---

## User Type Detection

The system automatically detects user type based on credentials:
- Checks if email/password matches admin credentials
- Checks if email/password matches any sponsor credentials
- Checks if email/password matches any applicant credentials
- Stores user type in localStorage for session management

---

## Logout

All user types can logout using the logout button in their respective dashboards. This will:
- Clear authentication token
- Clear user type
- Clear user email and name
- Redirect to login page
