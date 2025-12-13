# 🚀 Installation Guide

## Prerequisites

- Node.js 18+ and npm 9+
- Supabase account
- Git

## Installation Steps

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd centfund-africa-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your Supabase credentials
```

### 4. Database Setup
```bash
# Run the SQL schema in Supabase SQL Editor
# See docs/database/SETUP.md for details
```

### 5. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:5173

## Verification

- [ ] App loads without errors
- [ ] Homepage shows projects
- [ ] Admin dashboard accessible
- [ ] Database connected

## Next Steps

- [Quick Start Guide](./QUICK_START.md)
- [Database Setup](../database/SETUP.md)
- [Admin Guide](../admin/DASHBOARD.md)
