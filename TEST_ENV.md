# Environment Variables Test

## Issue: Sponsor login not working

### Steps to Debug:

1. **Restart your development server**
   ```bash
   npm run dev
   ```
   OR
   ```bash
   yarn dev
   ```

   ⚠️ **IMPORTANT:** Vite only loads `.env` variables when the dev server starts. You MUST restart the server after changing `.env` file!

2. **Check browser console**
   - Open browser DevTools (F12)
   - Go to `/admin`
   - Try logging in with sponsor credentials
   - Check console for debug logs showing:
     - Admin Email
     - Sponsor 1 Email
     - Entered Email

3. **Test Credentials:**
   ```
   Email: sponsor1@centfundafrica.org
   Password: Sponsor1@2024!
   ```

4. **If environment variables show as `undefined`:**
   - Make sure `.env` file is in the root directory (same level as `package.json`)
   - Restart the dev server
   - Clear browser cache
   - Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

5. **Check if `.env` file is being ignored:**
   - Make sure `.env` is NOT in `.gitignore` for local development
   - Verify file permissions

### Expected Behavior:
- Login with sponsor credentials → Redirects to `/sponsor-dashboard`
- Login with admin credentials → Stays on admin page
- Login with applicant credentials → Redirects to home page

### Common Issues:
1. **Dev server not restarted** - Most common issue!
2. **Typo in email or password**
3. **Extra spaces in `.env` file**
4. **`.env` file in wrong location**
