# Production Deployment Guide for Backend

## Changes Made for Production Ready

### 1. ✅ config.js

- ✓ PORT now uses `process.env.PORT || 3001`
- ✓ MONGODB_URL now uses environment variable for Atlas connection
- ✓ JWT_SECRET requires environment variable (no hardcoded default)

### 2. ✅ index.js

- ✓ CORS now configured with specific allowed origins
- ✓ Supports both development and production frontend URLs
- ✓ Added `/health` endpoint for server monitoring
- ✓ Updated root `/` endpoint to return JSON
- ✓ Proper error handling middleware
- ✓ Process exits if database connection fails
- ✓ Environment-aware error messages

### 3. ✅ .gitignore

- ✓ node_modules/ - Installed locally, not committed
- ✓ .env - Never commit secrets
- ✓ public/uploads/ - User files not in repo
- ✓ IDE configs, logs, build files

### 4. ✅ .env.example

- ✓ Template for environment variables
- ✓ Instructions for each variable
- ✓ Safe to commit (no actual secrets)

---

## Deployment Steps

### Step 1: Prepare Code

```bash
cd backend_only
git add .
git commit -m "Production ready - environment variables and CORS"
git push
```

### Step 2: Create .env File on Render

**Do NOT create .env locally and commit it!**

Instead, set variables in Render dashboard:

### Step 3: Required Environment Variables on Render

```
PORT=3001
NODE_ENV=production
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/jobportal?retryWrites=true&w=majority
JWT_SECRET=<generate-strong-key>
FRONTEND_URL=<your-frontend-url-after-deployment>
```

### Step 4: Generate Strong JWT_SECRET

Run locally:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste in Render environment variables.

### Step 5: MongoDB Atlas Setup

1. Create cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user with strong password
3. Whitelist "0.0.0.0/0" for Render (or whitelist Render IP)
4. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/jobportal?retryWrites=true&w=majority
   ```

### Step 6: Deploy on Render

1. Connect GitHub repository
2. Set Build Command: `npm install`
3. Set Start Command: `node index.js`
4. Add all environment variables
5. Deploy!

---

## Testing Deployment

### Check Server Health

```bash
curl https://your-backend-url.onrender.com/health
# Should return: { "status": "OK", "timestamp": "..." }
```

### Check Root Endpoint

```bash
curl https://your-backend-url.onrender.com/
# Should return JSON with status
```

### Test API

```bash
curl https://your-backend-url.onrender.com/api/jobs
# Should return job listings
```

---

## Security Checklist

- [ ] Never commit .env file
- [ ] JWT_SECRET is strong (generated with crypto)
- [ ] MongoDB credentials in environment variables only
- [ ] CORS origins restricted to known frontend URLs
- [ ] NODE_ENV set to "production"
- [ ] Error messages don't expose sensitive info
- [ ] All console.log statements appropriate for production
- [ ] No hardcoded database URLs
- [ ] No hardcoded API keys anywhere in code

---

## Common Production Issues & Fixes

### Issue: "CORS error - origin not allowed"

**Fix:** Add frontend URL to FRONTEND_URL environment variable in Render

### Issue: "Cannot connect to database"

**Fix:**

1. Check MONGODB_URL is correct
2. Check MongoDB Atlas IP whitelist includes "0.0.0.0/0"
3. Verify username and password in connection string

### Issue: "Invalid JWT Secret"

**Fix:** Regenerate JWT_SECRET using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Issue: "Service goes to sleep after inactivity"

**Fix:** Upgrade to paid Render plan or use keep-alive service

---

## Monitoring

### View Logs on Render

- Dashboard → Your Service → Logs tab
- Shows all console.log output and errors
- Use ✓ and ✗ symbols for easy debugging

### Monitor Database

- MongoDB Atlas → Monitoring tab
- Check connection count, operations, storage
- Set up alerts for abnormal activity

---

## Scaling for Production

### If Traffic Increases:

1. Upgrade Render plan (add more CPU/RAM)
2. Enable database read replicas in MongoDB
3. Implement caching (Redis)
4. Add load balancing

### Database Optimization:

1. Add indexes to frequently queried fields
2. Monitor slow queries
3. Archive old data
4. Regular backups enabled

---

## Next Steps

1. ✅ Backend is now production-ready
2. Update frontend API URLs to use Render backend URL
3. Deploy frontend (Vercel, Netlify, or Render)
4. Test full application flow in production
5. Set up monitoring and alerts

---

## Support

Check Render logs for errors:

- Navigate to Service in Render dashboard
- Click "Logs" tab
- Search for error messages
- Use timestamps to correlate with actions

For more help: [Render Docs](https://render.com/docs)
