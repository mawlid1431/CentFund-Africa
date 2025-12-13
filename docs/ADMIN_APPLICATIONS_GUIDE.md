# Admin Applications Management Guide

## Overview
The admin can now manage all applications through 4 main categories displayed as clickable cards.

## 4 Main Categories

### 1. 📚 Student Applicants (Blue Card)
**Purpose:** Manage students applying for certification sponsorship

**Features:**
- View all student applications
- See applicant details (personal info, education, certification needs)
- Accept or reject applications
- Move through stages (Stage 1 → Stage 2)
- Assign sponsors to accepted students
- Track application status and submission date/time

**Actions Available:**
- **Pending** → Accept to Stage 1 or Reject
- **Accepted Stage 1** → Assign Sponsor or Move to Stage 2
- **Pending Stage 2** → Accept Stage 2 (Final) or Reject

---

### 2. 💼 Becoming Sponsor (Purple Card)
**Purpose:** Manage applications from people/organizations wanting to become sponsors

**What You See:**
- Total number of sponsor applications
- Pending applications count
- Approved applications count

**Data Includes:**
- Applicant name and contact info
- Company/Organization details
- Sponsorship amount they want to contribute
- Motivation for becoming a sponsor
- Application status (pending/approved/rejected)

**Actions:**
- Review sponsor applications
- Approve or reject sponsor requests
- View full application details

---

### 3. 🏢 Active Sponsors (Green Card)
**Purpose:** View list of current active sponsors/partners

**What You See:**
- Total number of active sponsors
- List of approved sponsors
- Their sponsorship details
- Contact information
- Sponsorship type (full/partial)
- Amount contributed

**Information Displayed:**
- Sponsor name
- Organization
- Email and phone
- Sponsorship amount
- Status
- Date joined

---

### 4. 🏆 Completed (Orange Card)
**Purpose:** Track successfully completed applications

**Shows:**
- Number of students who completed both stages
- Successfully sponsored students
- Final approved applications

---

## How to Use

### Accessing the Dashboard
1. Go to `/admin`
2. Login with admin credentials
3. Click on "Applications" tab
4. You'll see 4 cards at the top

### Navigating Between Categories
- **Click on any card** to view that category
- The active card will be highlighted with a gradient background
- A checkmark appears on the selected card

### Managing Student Applications
1. Click the **"Student Applicants"** card (blue)
2. Use search and filters to find specific applications
3. Click **"View"** on any application to see full details
4. Take actions based on current status:
   - Pending → Accept or Reject
   - Accepted Stage 1 → Assign Sponsor
   - Pending Stage 2 → Final Approval

### Managing Sponsor Applications
1. Click the **"Becoming Sponsor"** card (purple)
2. View all people/organizations applying to be sponsors
3. Review their details and motivation
4. Approve or reject their application

### Viewing Active Sponsors
1. Click the **"Active Sponsors"** card (green)
2. See list of all approved sponsors
3. View their details and contribution amounts
4. Track their active sponsorships

---

## Data Sources

### Student Applications
- **Table:** `applications`
- **Includes:** Personal info, education, certification details, documents

### Sponsor Applications
- **Table:** `sponsors`
- **Status:** All (pending, approved, rejected)
- **Includes:** Name, organization, amount, type, documents

### Active Sponsors List
- **Table:** `sponsors`
- **Status:** Approved only
- **Shows:** Currently active partners

---

## Status Flow

### Student Application Flow:
```
Pending → Accepted Stage 1 → Assigned to Sponsor → Pending Stage 2 → Accepted Stage 2 (Completed)
   ↓            ↓                    ↓                   ↓
Rejected     Rejected            Rejected            Rejected
```

### Sponsor Application Flow:
```
Pending → Approved (Active Sponsor)
   ↓
Rejected
```

---

## Quick Stats

Each card shows:
- **Total count** (large number)
- **Pending count** (small text below)
- **Icon** representing the category
- **Color coding** for easy identification

---

## Tips

1. **Use Search:** Quickly find applications by name or email
2. **Use Filters:** Filter by status to focus on specific applications
3. **Click Cards:** Switch between categories by clicking the cards
4. **View Details:** Always click "View" to see complete information before making decisions
5. **Track Progress:** Monitor the "Completed" card to see success rate

---

## Color Coding

- 🔵 **Blue** - Student Applicants
- 🟣 **Purple** - Becoming Sponsor
- 🟢 **Green** - Active Sponsors
- 🟠 **Orange** - Completed

---

## Support

For issues or questions about the application management system, refer to:
- `docs/APPLICATION_SYSTEM_GUIDE.md` - Complete system documentation
- `docs/LOGIN_CREDENTIALS.md` - Login information
- `database/APPLICATION_SYSTEM_SCHEMA.sql` - Database structure
