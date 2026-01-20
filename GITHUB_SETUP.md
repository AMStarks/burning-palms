# GitHub Setup for Vercel Connection

Your code is committed locally. Now let's push it to GitHub and connect to Vercel.

## Step 1: Create GitHub Repository

### Option A: Using GitHub Website (Easiest)

1. **Go to GitHub:**
   - Visit: https://github.com/new
   - Or click: https://github.com → "New" (green button) → "New repository"

2. **Create Repository:**
   - **Repository name:** `burning-palms` (or `burningpalms-website`)
   - **Description:** "Burning Palms website with Shopify integration"
   - **Visibility:** Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

3. **Copy the repository URL:**
   - GitHub will show you commands, but **copy the repository URL** first
   - It will look like: `https://github.com/YOUR_USERNAME/burning-palms.git`
   - Or: `git@github.com:YOUR_USERNAME/burning-palms.git`

4. **Connect your local repository:**
   ```bash
   cd "/Users/starkers/Projects/Burning Palms"
   git remote add origin https://github.com/YOUR_USERNAME/burning-palms.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your actual GitHub username.

### Option B: Using GitHub CLI (If Installed)

If you have GitHub CLI installed, you can do it all from terminal:

```bash
cd "/Users/starkers/Projects/Burning Palms"
gh repo create burning-palms --public --source=. --remote=origin --push
```

---

## Step 2: Push to GitHub

After adding the remote:

```bash
cd "/Users/starkers/Projects/Burning Palms"
git push -u origin main
```

If prompted for credentials:
- Use a **Personal Access Token** (not your password)
- Generate one at: https://github.com/settings/tokens
- Required scopes: `repo` (full control of private repositories)

---

## Step 3: Connect to Vercel

### Method A: Via Vercel Website (Recommended)

1. **Go to Vercel:**
   - Visit: https://vercel.com/login
   - Sign in with GitHub (if not already signed in)

2. **Import Project:**
   - Click "Add New..." → "Project"
   - You'll see your GitHub repositories
   - Click "Import" next to `burning-palms`

3. **Configure Project:**
   - **Project Name:** `burning-palms` (or keep default)
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (keep default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add these variables:
     ```
     SHOPIFY_STORE_DOMAIN=burning-palms.myshopify.com
     SHOPIFY_STOREFRONT_ACCESS_TOKEN=d7cbf469847fb5331de52718d4e9c8e9
     NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=burning-palms.myshopify.com
     NEXTAUTH_URL=https://burningpalms.au
     DATABASE_URL=[your production database URL - see below]
     NEXTAUTH_SECRET=[generate a random string - see below]
     ```
   - Click "Add" for each variable
   - Make sure they're set for **Production**, **Preview**, and **Development**

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (usually 2-3 minutes)

### Method B: Via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link to your GitHub repo
cd "/Users/starkers/Projects/Burning Palms"
vercel link

# Deploy
vercel --prod
```

---

## Step 4: Generate Required Secrets

### Generate NEXTAUTH_SECRET:

```bash
# Generate a random secret
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

Copy the generated string and add it to Vercel environment variables as `NEXTAUTH_SECRET`.

### Set up Production Database:

For production, you'll need a proper database. Options:

1. **Vercel Postgres** (Easiest - built into Vercel):
   - In Vercel Dashboard → Your Project → Storage
   - Click "Create Database" → "Postgres"
   - Vercel will provide the `DATABASE_URL` automatically

2. **Supabase** (Free tier available):
   - Go to: https://supabase.com
   - Create a project
   - Copy the connection string
   - Use as `DATABASE_URL`

3. **Railway** or **PlanetScale**:
   - Create a database
   - Copy connection string
   - Use as `DATABASE_URL`

After setting up the database:
```bash
# Run migrations in production
npx prisma migrate deploy
```

---

## Step 5: Add Custom Domain

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Click "Add Domain"
   - Enter: `burningpalms.au`
   - Click "Add"
   - Vercel will show DNS configuration

2. **Update DNS in OnlyDomains:**
   - Follow instructions from Vercel
   - See `DEPLOYMENT_GUIDE.md` for detailed DNS setup

---

## Quick Commands Summary

```bash
# 1. Add GitHub remote (replace YOUR_USERNAME)
cd "/Users/starkers/Projects/Burning Palms"
git remote add origin https://github.com/YOUR_USERNAME/burning-palms.git

# 2. Push to GitHub
git push -u origin main

# 3. Or use GitHub CLI (if installed)
gh repo create burning-palms --public --source=. --remote=origin --push
```

---

## Troubleshooting

### "Permission Denied" when pushing:
- Use Personal Access Token instead of password
- Generate token: https://github.com/settings/tokens
- Scope needed: `repo`

### "Repository not found":
- Check the repository name matches exactly
- Make sure you created the repo on GitHub first

### Build fails in Vercel:
- Check environment variables are set correctly
- Verify `DATABASE_URL` is set for production
- Check build logs in Vercel dashboard

---

## Next Steps After Setup

1. ✅ Code pushed to GitHub
2. ✅ Connected to Vercel
3. ⏭️ Add custom domain (`burningpalms.au`)
4. ⏭️ Set up production database
5. ⏭️ Configure Shopify domain settings
