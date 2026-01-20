# Connecting Your Repository to Vercel

Since you already have Vercel linked to your GitHub account, here's how to connect your Burning Palms repository:

## Step 1: Make Sure Code is on GitHub

First, verify your code is pushed to GitHub:

### Check if repo exists:
```bash
cd "/Users/starkers/Projects/Burning Palms"
git remote -v
```

If you see a GitHub URL, your repo is already connected. If not, you need to:
1. Create a GitHub repository
2. Push your code to it

### If you need to create/push:
- Option 1: Use GitHub CLI (easiest)
  ```bash
  gh auth login -h github.com  # Choose SSH when prompted
  gh repo create burning-palms --public --source=. --remote=origin --push
  ```

- Option 2: Create on GitHub website, then:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/burning-palms.git
  git push -u origin main
  ```

---

## Step 2: Import Project in Vercel

Since Vercel is already linked to your GitHub:

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Make sure you're signed in

2. **Import Project:**
   - Click "Add New..." button (top right)
   - Select "Project"
   - You'll see a list of your GitHub repositories
   - Find `burning-palms` (or whatever you named it)
   - Click "Import" next to it

3. **Configure Project Settings:**
   - **Project Name:** `burning-palms` (auto-filled)
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)
   - **Development Command:** `npm run dev` (auto-filled)

4. **Click "Deploy"** - This will deploy with default settings first

---

## Step 3: Add Environment Variables

**Important:** Add these BEFORE or AFTER first deployment in Project Settings:

1. **Go to Project Settings:**
   - In your project dashboard → "Settings" tab
   - Click "Environment Variables" in the left sidebar

2. **Add These Variables:**
   
   Click "Add New" for each:
   
   ```
   Name: SHOPIFY_STORE_DOMAIN
   Value: burning-palms.myshopify.com
   Environment: Production, Preview, Development (select all)
   ```
   
   ```
   Name: SHOPIFY_STOREFRONT_ACCESS_TOKEN
   Value: d7cbf469847fb5331de52718d4e9c8e9
   Environment: Production, Preview, Development (select all)
   ```
   
   ```
   Name: NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
   Value: burning-palms.myshopify.com
   Environment: Production, Preview, Development (select all)
   ```
   
   ```
   Name: NEXTAUTH_URL
   Value: https://burningpalms.au
   Environment: Production
   Value: https://your-vercel-app.vercel.app (for Preview)
   Value: http://localhost:3000 (for Development)
   ```
   
   ```
   Name: NEXTAUTH_SECRET
   Value: [generate a random string - see below]
   Environment: Production, Preview, Development (select all)
   ```
   
   ```
   Name: DATABASE_URL
   Value: [set up production database - see below]
   Environment: Production, Preview, Development (select all)
   ```

3. **Save All Variables**
   - After adding each, click "Save"
   - After adding all, you'll need to redeploy

---

## Step 4: Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and use it as the value for `NEXTAUTH_SECRET` in Vercel.

---

## Step 5: Set Up Production Database

For production, you need a real database (not SQLite):

### Option A: Vercel Postgres (Easiest - Built In)

1. In Vercel Dashboard → Your Project
2. Go to "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a name (e.g., `burning-palms-db`)
6. Click "Create"
7. Vercel will automatically provide `DATABASE_URL` - **copy it**
8. Add it as environment variable in "Settings → Environment Variables"

### Option B: Supabase (Free Tier Available)

1. Go to: https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the "Connection string" (URI format)
5. Use it as `DATABASE_URL` in Vercel

### After Database is Set Up:

You'll need to run migrations in production:

1. **Via Vercel CLI:**
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

2. **Or via Vercel Dashboard:**
   - Go to your project → Settings → Build & Development Settings
   - Add "Build Command": `prisma generate && npm run build`
   - This will run migrations automatically

---

## Step 6: Redeploy After Adding Variables

After adding environment variables:

1. Go to "Deployments" tab
2. Find the latest deployment
3. Click the "..." menu → "Redeploy"
4. Or push a new commit to trigger auto-deploy

---

## Step 7: Add Custom Domain

1. **In Vercel Dashboard:**
   - Go to your project → "Settings" → "Domains"
   - Click "Add Domain"
   - Enter: `burningpalms.au`
   - Click "Add"
   - Vercel will show DNS configuration

2. **Update DNS in OnlyDomains:**
   - Go to OnlyDomains → Domain Info → DNS Settings
   - Use the DNS records Vercel provides
   - See `DEPLOYMENT_GUIDE.md` for detailed DNS setup

---

## Quick Checklist

- [ ] Code pushed to GitHub repository
- [ ] Repository imported in Vercel
- [ ] Environment variables added (all 6 variables)
- [ ] NEXTAUTH_SECRET generated and added
- [ ] Production database set up (Vercel Postgres or Supabase)
- [ ] DATABASE_URL added to environment variables
- [ ] Redeployed after adding variables
- [ ] Custom domain added (`burningpalms.au`)
- [ ] DNS configured in OnlyDomains

---

## Need Help?

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Project Settings:** https://vercel.com/dashboard → Your Project → Settings
- **Environment Variables:** Project Settings → Environment Variables
