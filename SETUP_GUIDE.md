# 🚀 CentFund Africa - Complete Setup Guide

This guide will walk you through setting up the CentFund Africa platform from scratch on your local machine.

---

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Step 1: Install Node.js](#-step-1-install-nodejs)
3. [Step 2: Choose Your IDE](#-step-2-choose-your-ide)
4. [Step 3: Get the Code](#-step-3-get-the-code)
5. [Step 4: Install Dependencies](#-step-4-install-dependencies)
6. [Step 5: Setup Supabase](#-step-5-setup-supabase)
7. [Step 6: Configure Environment Variables](#-step-6-configure-environment-variables)
8. [Step 7: Setup Database](#-step-7-setup-database)
9. [Step 8: Run the Application](#-step-8-run-the-application)
10. [Troubleshooting](#-troubleshooting)

---

## ✅ Prerequisites

Before you begin, make sure you have:
- A computer with Windows, macOS, or Linux
- Internet connection
- Basic knowledge of using terminal/command prompt
- A GitHub account (optional, for cloning)
- An email address (for Supabase account)

---

## 📥 Step 1: Install Node.js

Node.js is required to run this project. Follow the instructions for your operating system:

### Windows

1. **Download Node.js:**
   - Go to [https://nodejs.org](https://nodejs.org)
   - Download the **LTS (Long Term Support)** version (recommended)
   - Look for the version that says "Recommended for most users"

2. **Install Node.js:**
   - Run the downloaded `.msi` installer
   - Click "Next" through the installation wizard
   - Accept the license agreement
   - Keep the default installation path
   - Make sure "Add to PATH" is checked
   - Click "Install"

3. **Verify Installation:**
   - Open Command Prompt (search for "cmd" in Start menu)
   - Type the following commands:
   ```bash
   node --version
   npm --version
   ```
   - You should see version numbers (e.g., `v18.17.0` and `9.6.7`)

### macOS

1. **Download Node.js:**
   - Go to [https://nodejs.org](https://nodejs.org)
   - Download the **LTS version** for macOS

2. **Install Node.js:**
   - Open the downloaded `.pkg` file
   - Follow the installation wizard
   - Enter your password when prompted

3. **Verify Installation:**
   - Open Terminal (Applications → Utilities → Terminal)
   - Type:
   ```bash
   node --version
   npm --version
   ```

### Linux (Ubuntu/Debian)

1. **Install via Terminal:**
   ```bash
   # Update package list
   sudo apt update
   
   # Install Node.js and npm
   sudo apt install nodejs npm
   
   # Verify installation
   node --version
   npm --version
   ```

---

## 💻 Step 2: Choose Your IDE

An IDE (Integrated Development Environment) is where you'll write and edit code. Choose one:

### Option A: Visual Studio Code (Recommended)

**Why VS Code?**
- Free and open-source
- Excellent for React and TypeScript
- Great extensions available
- Built-in terminal

**Installation:**
1. Go to [https://code.visualstudio.com](https://code.visualstudio.com)
2. Download for your operating system
3. Install and open VS Code

**Recommended Extensions:**
- ESLint (for code quality)
- Prettier (for code formatting)
- Tailwind CSS IntelliSense (for styling)
- ES7+ React/Redux/React-Native snippets

### Option B: Other IDEs

- **WebStorm** - Powerful but paid (https://www.jetbrains.com/webstorm/)
- **Sublime Text** - Lightweight (https://www.sublimetext.com/)
- **Atom** - Simple and free (https://atom.io/)

---

## 📦 Step 3: Get the Code

You have two options to get the project code:

### Option A: Clone from GitHub (Recommended)

1. **Install Git (if not already installed):**
   - Windows: Download from [https://git-scm.com](https://git-scm.com)
   - macOS: Open Terminal and type `git --version` (it will prompt to install)
   - Linux: `sudo apt install git`

2. **Clone the Repository:**
   ```bash
   # Open terminal/command prompt
   # Navigate to where you want the project
   cd Desktop
   
   # Clone the repository
   git clone https://github.com/mawlid1431/CertFund-Africa.git
   
   # Navigate into the project folder
   cd CertFund-Africa
   ```

### Option B: Download ZIP

1. Go to the GitHub repository
2. Click the green "Code" button
3. Click "Download ZIP"
4. Extract the ZIP file to your desired location
5. Open terminal/command prompt and navigate to the extracted folder:
   ```bash
   cd path/to/CertFund-Africa
   ```

---

## 📚 Step 4: Install Dependencies

Now we'll install all the required packages for the project.

1. **Make sure you're in the project directory:**
   ```bash
   # You should see package.json when you list files
   ls        # macOS/Linux
   dir       # Windows
   ```

2. **Install all packages:**
   ```bash
   npm install
   ```

   This will:
   - Read the `package.json` file
   - Download all required packages
   - Install them in a `node_modules` folder
   - Create a `package-lock.json` file

3. **Wait for installation to complete:**
   - This may take 2-5 minutes depending on your internet speed
   - You'll see a progress bar and package names being installed
   - When done, you'll see a summary of installed packages

**What gets installed?**
- React (UI framework)
- TypeScript (type-safe JavaScript)
- Tailwind CSS (styling)
- Supabase (database client)
- React Router (navigation)
- And many more dependencies...

---

## 🗄️ Step 5: Setup Supabase

Supabase is your backend database. Let's set it up:

### 5.1 Create Supabase Account

1. **Go to Supabase:**
   - Visit [https://supabase.com](https://supabase.com)
   - Click "Start your project"

2. **Sign Up:**
   - Click "Sign Up"
   - Use GitHub, Google, or Email to sign up
   - Verify your email if required

3. **Create a New Project:**
   - Click "New Project"
   - Choose your organization (or create one)
   - Fill in project details:
     - **Name:** `centfund-africa` (or any name you like)
     - **Database Password:** Create a strong password (save this!)
     - **Region:** Choose closest to your location
     - **Pricing Plan:** Select "Free" (perfect for development)
   - Click "Create new project"
   - Wait 2-3 minutes for project to be ready

### 5.2 Get Your API Keys

1. **Navigate to Project Settings:**
   - In your Supabase dashboard, click the ⚙️ (Settings) icon in the sidebar
   - Click "API" in the settings menu

2. **Copy Your Credentials:**
   You'll need two things:

   **A. Project URL:**
   - Look for "Project URL" section
   - Copy the URL (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - Save this somewhere safe

   **B. Anon/Public Key:**
   - Scroll down to "Project API keys"
   - Find the `anon` `public` key
   - Click the copy icon
   - Save this somewhere safe

   **C. Service Role Key (Optional but recommended):**
   - In the same "Project API keys" section
   - Find the `service_role` `secret` key
   - Click the copy icon
   - ⚠️ **IMPORTANT:** Keep this secret! Never share it publicly

---

## 🔐 Step 6: Configure Environment Variables

Environment variables store sensitive information like API keys.

### 6.1 Create .env File

1. **In your project root folder, create a new file named `.env`:**

   **Using VS Code:**
   - Right-click in the file explorer
   - Select "New File"
   - Name it `.env` (exactly, with the dot at the start)

   **Using Terminal:**
   ```bash
   # macOS/Linux
   touch .env
   
   # Windows (Command Prompt)
   type nul > .env
   
   # Windows (PowerShell)
   New-Item .env
   ```

### 6.2 Add Your Credentials

1. **Open the `.env` file**

2. **Copy this template and paste it:**
   ```env
   # ============================================
   # SUPABASE CONFIGURATION
   # ============================================
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   
   # ============================================
   # ADMIN CREDENTIALS
   # ============================================
   VITE_ADMIN_EMAIL=admin@centfundafrica.org
   VITE_ADMIN_PASSWORD=Admin@2024Secure!
   ```

3. **Replace the placeholder values:**
   - Replace `your_supabase_url_here` with your Project URL from Step 5.2
   - Replace `your_supabase_anon_key_here` with your Anon key from Step 5.2
   - Replace `your_service_role_key_here` with your Service Role key from Step 5.2
   - You can keep the admin credentials as-is or change them

4. **Example of filled .env file:**
   ```env
   VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjc0ODAwMCwiZXhwIjoxOTQ4MzI0MDAwfQ.abcdefghijklmnopqrstuvwxyz123456789
   VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjMyNzQ4MDAwLCJleHAiOjE5NDgzMjQwMDB9.abcdefghijklmnopqrstuvwxyz987654321
   VITE_ADMIN_EMAIL=admin@centfundafrica.org
   VITE_ADMIN_PASSWORD=Admin@2024Secure!
   ```

5. **Save the file**

### 6.3 Security Check

⚠️ **IMPORTANT SECURITY NOTES:**
- Never commit the `.env` file to Git
- Never share your `.env` file publicly
- The `.env` file should already be in `.gitignore`
- Use different credentials for production

---

## 🗃️ Step 7: Setup Database

Now we'll create all the database tables and add sample data.

### 7.1 Access Supabase SQL Editor

1. **Go to your Supabase Dashboard:**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Click on your project

2. **Open SQL Editor:**
   - Click the 🗄️ "SQL Editor" icon in the left sidebar
   - Click "New query" button

### 7.2 Run Schema File (Create Tables)

1. **Open the schema file:**
   - In your project folder, navigate to `database/01_schema.sql`
   - Open it in your IDE or text editor

2. **Copy the entire file content:**
   - Press `Ctrl+A` (Windows/Linux) or `Cmd+A` (Mac) to select all
   - Press `Ctrl+C` (Windows/Linux) or `Cmd+C` (Mac) to copy

3. **Paste in Supabase SQL Editor:**
   - Go back to Supabase SQL Editor
   - Paste the copied content into the query editor
   - Click the "Run" button (or press `Ctrl+Enter`)

4. **Wait for completion:**
   - You'll see a success message at the bottom
   - This creates all 16 tables, indexes, triggers, and functions
   - Should take 5-10 seconds

### 7.3 Run Security File (Setup Permissions)

1. **Create a new query:**
   - Click "New query" in SQL Editor

2. **Open and copy `database/02_security.sql`:**
   - Open the file in your IDE
   - Copy all content (`Ctrl+A`, then `Ctrl+C`)

3. **Paste and run:**
   - Paste into Supabase SQL Editor
   - Click "Run"
   - Wait for success message
   - This sets up all security policies and permissions

### 7.4 Run Seed File (Add Sample Data)

1. **Create a new query:**
   - Click "New query" in SQL Editor

2. **Open and copy `database/03_seed.sql`:**
   - Open the file in your IDE
   - Copy all content

3. **Paste and run:**
   - Paste into Supabase SQL Editor
   - Click "Run"
   - Wait for success message
   - This adds sample projects, users, quiz questions, etc.

### 7.5 Verify Database Setup

1. **Check Tables:**
   - Click the 🗄️ "Table Editor" icon in Supabase sidebar
   - You should see 16 tables:
     - projects
     - team_members
     - success_stories
     - testimonials
     - partners
     - users
     - students
     - sponsor_users
     - applications
     - sponsors
     - quiz_questions
     - quiz_attempts
     - user_eligibility
     - application_history
     - sponsor_responses
     - notifications

2. **Check Sample Data:**
   - Click on "projects" table
   - You should see 4 sample projects (AWS, CCNA, IELTS, CompTIA A+)
   - Click on "users" table
   - You should see 11 sample users

3. **Check Storage:**
   - Click the 📁 "Storage" icon in Supabase sidebar
   - You should see 3 buckets:
     - project-images
     - student-documents
     - sponsor-documents

---

## 🎉 Step 8: Run the Application

You're almost there! Let's start the application.

### 8.1 Start Development Server

1. **Make sure you're in the project directory:**
   ```bash
   pwd    # macOS/Linux - shows current directory
   cd     # Windows - shows current directory
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Wait for the server to start:**
   - You'll see output like:
   ```
   VITE v6.0.1  ready in 500 ms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ➜  press h + enter to show help
   ```

### 8.2 Open in Browser

1. **Open your web browser** (Chrome, Firefox, Safari, Edge)

2. **Navigate to:**
   ```
   http://localhost:5173
   ```

3. **You should see the CentFund Africa homepage! 🎉**

### 8.3 Test the Application

**Test Public Pages:**
1. Browse the homepage
2. Click "Projects" to see all certification programs
3. Click on a project to view details
4. Check the About and Contact pages

**Test Admin Dashboard:**
1. Navigate to: `http://localhost:5173/admin`
2. Login with credentials from your `.env` file:
   - Email: `admin@centfundafrica.org`
   - Password: `Admin@2024Secure!`
3. You should see the admin dashboard
4. Try creating, editing, or viewing projects

**Test Student Registration:**
1. Navigate to: `http://localhost:5173/student/register`
2. Fill out the eligibility check
3. Complete registration form
4. Upload a sample ID document

**Test Sponsor Registration:**
1. Navigate to: `http://localhost:5173/sponsor/register`
2. Fill out the eligibility check
3. Complete registration form
4. Upload required documents

---

## 🐛 Troubleshooting

### Problem: "npm: command not found"

**Solution:**
- Node.js is not installed or not in PATH
- Reinstall Node.js from [nodejs.org](https://nodejs.org)
- Make sure to check "Add to PATH" during installation
- Restart your terminal/command prompt

### Problem: "Cannot find module" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json   # macOS/Linux
rmdir /s node_modules                   # Windows

# Reinstall dependencies
npm install
```

### Problem: Port 5173 already in use

**Solution:**
```bash
# Kill the process using port 5173
# macOS/Linux:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Or use a different port:
npm run dev -- --port 3000
```

### Problem: Supabase connection errors

**Solution:**
1. Check your `.env` file has correct values
2. Verify Supabase project is active (not paused)
3. Check API keys are copied correctly (no extra spaces)
4. Restart the development server:
   ```bash
   # Press Ctrl+C to stop
   # Then run again:
   npm run dev
   ```

### Problem: Database tables not showing

**Solution:**
1. Go to Supabase SQL Editor
2. Run each SQL file again in order:
   - `01_schema.sql`
   - `02_security.sql`
   - `03_seed.sql`
3. Check for error messages in SQL Editor
4. Verify you're in the correct Supabase project

### Problem: Images not uploading

**Solution:**
1. Check storage buckets exist in Supabase
2. Verify storage policies were created (run `02_security.sql` again)
3. Check file size (max 5MB for projects, 10MB for documents)
4. Check file type (only JPG, PNG, PDF allowed)

### Problem: "Module not found" for Supabase

**Solution:**
```bash
# Reinstall Supabase client
npm install @supabase/supabase-js
```

### Problem: TypeScript errors

**Solution:**
```bash
# Rebuild TypeScript
npm run build

# Or ignore and run anyway (dev mode)
npm run dev
```

### Problem: Blank page or white screen

**Solution:**
1. Open browser console (F12)
2. Check for error messages
3. Common fixes:
   ```bash
   # Clear cache and rebuild
   rm -rf .vite
   npm run dev
   ```

### Problem: Login not working

**Solution:**
1. Check `.env` file has admin credentials
2. Verify credentials match what you're entering
3. Check browser console for errors
4. Try clearing browser cache/cookies

---

## 🎓 Next Steps

Now that your application is running:

1. **Explore the codebase:**
   - `src/components/` - React components
   - `src/pages/` - Page components
   - `src/utils/supabase/` - Database helpers
   - `database/` - SQL files

2. **Customize the application:**
   - Update branding and colors in `tailwind.config.ts`
   - Modify content in page components
   - Add new features

3. **Learn more:**
   - Read the main `README.md` for detailed documentation
   - Check `database/README.md` for database info
   - Explore Supabase documentation: [supabase.com/docs](https://supabase.com/docs)

4. **Deploy to production:**
   - See deployment section in main README
   - Use Vercel, Netlify, or your preferred hosting
   - Remember to set environment variables in production

---

## 📞 Getting Help

If you're still stuck:

1. **Check the documentation:**
   - Main `README.md` file
   - `database/README.md` file
   - This setup guide

2. **Search for errors:**
   - Copy error message
   - Search on Google or Stack Overflow
   - Check GitHub issues

3. **Ask for help:**
   - Open an issue on GitHub
   - Include error messages and screenshots
   - Describe what you've tried

---

## ✅ Setup Checklist

Use this checklist to track your progress:

- [ ] Node.js installed and verified
- [ ] IDE installed (VS Code recommended)
- [ ] Project code downloaded/cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] API keys copied
- [ ] `.env` file created and configured
- [ ] Database schema created (`01_schema.sql`)
- [ ] Security policies setup (`02_security.sql`)
- [ ] Sample data added (`03_seed.sql`)
- [ ] Development server started (`npm run dev`)
- [ ] Application opens in browser
- [ ] Admin login works
- [ ] Sample data visible

---

**Congratulations! 🎉 You've successfully set up CentFund Africa!**

You're now ready to start developing and customizing the platform. Happy coding! 💻✨
