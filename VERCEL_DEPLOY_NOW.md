# 🚀 Deploy to Vercel NOW - Quick Guide

## ✅ Your Project is Ready!

Everything is configured and tested. Follow these simple steps:

---

## 📋 Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

---

## 🌐 Step 2: Deploy on Vercel

### Option A: One-Click Deploy (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select: **`mawlid1431/CentFund-Africa`**
5. Click **"Import"**

### Option B: Vercel CLI (Advanced)

```bash
npm i -g vercel
vercel login
vercel
```

---

## ⚙️ Step 3: Configure Environment Variables

In Vercel dashboard, add these environment variables:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key-here
VITE_ADMIN_EMAIL = admin@centfundafrica.org
VITE_ADMIN_PASSWORD = YourSecurePassword123!
```

**Important:** Replace with your actual values!

---

## 🎯 Step 4: Deploy!

1. Click **"Deploy"** button
2. Wait 2-3 minutes for build
3. Your site will be live! 🎉

---

## 🔗 Your Live URLs

After deployment, you'll get:

- **Production:** `https://cent-fund-africa.vercel.app`
- **Admin Panel:** `https://cent-fund-africa.vercel.app/admin`

---

## ✅ Post-Deployment Checklist

Test these features:

- [ ] Homepage loads
- [ ] Projects page shows projects
- [ ] Images load correctly
- [ ] Admin login works (`/admin`)
- [ ] Can create/edit/delete projects
- [ ] Mobile responsive works

---

## 🐛 Troubleshooting

### Build Failed?
- Check build logs in Vercel dashboard
- Verify all env vars are added
- Make sure Supabase credentials are correct

### No Projects Showing?
- Verify Supabase database is set up
- Check that you ran `COPY_THIS_TO_SUPABASE.sql`
- Check browser console for errors

### Images Not Uploading?
- Run `FIX_STORAGE_POLICIES.sql` in Supabase
- Verify `project-images` bucket exists
- Check Supabase storage permissions

---

## 🎉 Success!

Your CentFund Africa website is now live!

**Next Steps:**
1. Share the URL with your team
2. Test all features thoroughly
3. Add your first real project
4. Set up custom domain (optional)

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Check:** `DEPLOYMENT_CHECKLIST.md` for detailed guide

---

**Deployment Time:** ~5 minutes
**Cost:** FREE (Vercel Hobby Plan)
**SSL:** Automatic HTTPS ✅
