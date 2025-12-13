# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Ready
Make sure you have these values from Supabase:
- [ ] `VITE_SUPABASE_URL` - Your Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- [ ] `VITE_SUPABASE_SERVICE_ROLE_KEY` - Service role key (if needed)
- [ ] `VITE_ADMIN_EMAIL` - Admin email
- [ ] `VITE_ADMIN_PASSWORD` - Admin password

### 2. Database Setup Complete
- [ ] Ran `COPY_THIS_TO_SUPABASE.sql` in Supabase SQL Editor
- [ ] Ran `FIX_STORAGE_POLICIES.sql` for image uploads
- [ ] Verified `project-images` bucket exists
- [ ] Tested that projects show up in Supabase Table Editor

### 3. Code Ready
- [ ] All changes committed to Git
- [ ] Pushed to GitHub repository
- [ ] Build works locally (`npm run build`)
- [ ] Preview works locally (`npm run preview`)

### 4. Repository Updated
- [ ] Updated repository URL in package.json
- [ ] README.md is up to date
- [ ] .gitignore includes .env file

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin master
```

### Step 2: Deploy on Vercel

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `CentFund-Africa`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `dist` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key-here
   VITE_SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
   VITE_ADMIN_EMAIL = admin@yourdomain.com
   VITE_ADMIN_PASSWORD = your-secure-password
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `your-project.vercel.app`

---

## 🔧 Post-Deployment

### 1. Test Your Site
- [ ] Visit your Vercel URL
- [ ] Check homepage loads correctly
- [ ] Verify projects are showing
- [ ] Test navigation between pages
- [ ] Check images are loading
- [ ] Test responsive design on mobile

### 2. Test Admin Dashboard
- [ ] Go to `/admin` route
- [ ] Login with admin credentials
- [ ] Try creating a new project
- [ ] Upload an image
- [ ] Edit a project
- [ ] Delete a test project

### 3. Configure Custom Domain (Optional)
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `centfundafrica.org`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-30 minutes)

### 4. Update URLs
- [ ] Update donation links if needed
- [ ] Update social media links
- [ ] Update contact information
- [ ] Update README with live URL

---

## 🐛 Troubleshooting

### Build Fails
**Error:** "Build failed"
- Check build logs in Vercel dashboard
- Verify all dependencies are in package.json
- Try building locally: `npm run build`
- Check for TypeScript errors: `npm run lint`

### Environment Variables Not Working
**Error:** "Cannot read properties of undefined"
- Verify all env vars are added in Vercel
- Check variable names match exactly (case-sensitive)
- Redeploy after adding env vars

### Images Not Loading
**Error:** Images show broken
- Check Supabase storage policies
- Verify `project-images` bucket is public
- Check image URLs in database
- Run `FIX_STORAGE_POLICIES.sql` again

### Projects Not Showing
**Error:** Empty projects page
- Check Supabase connection
- Verify env vars are correct
- Check browser console for errors
- Verify RLS policies allow public read

### 404 on Routes
**Error:** Page not found on refresh
- Vercel should auto-configure with vercel.json
- Check that vercel.json has rewrites configured
- Verify framework preset is set to "Vite"

---

## 📊 Performance Optimization

After deployment, check performance:

1. **Lighthouse Score**
   - Open Chrome DevTools
   - Go to Lighthouse tab
   - Run audit
   - Aim for 90+ scores

2. **Vercel Analytics** (Optional)
   - Enable in Vercel Dashboard
   - Monitor page views and performance
   - Track Core Web Vitals

3. **Image Optimization**
   - Compress images before upload
   - Use WebP format when possible
   - Keep images under 500KB

---

## 🔒 Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] No sensitive keys in code
- [ ] Admin password is strong
- [ ] Supabase RLS policies are enabled
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] Service role key is not exposed to client

---

## 🎉 Success!

Your CentFund Africa website is now live!

**Next Steps:**
1. Share your Vercel URL with team
2. Test all features thoroughly
3. Set up custom domain (optional)
4. Monitor analytics and performance
5. Keep Supabase and dependencies updated

**Your Live URLs:**
- Production: `https://your-project.vercel.app`
- Admin: `https://your-project.vercel.app/admin`

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **GitHub Issues:** Open an issue in your repository

---

**Deployment Date:** _____________
**Deployed By:** _____________
**Vercel URL:** _____________
**Custom Domain:** _____________
