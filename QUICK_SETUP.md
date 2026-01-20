# Quick GitHub + Vercel Setup

Your code is committed and ready to push! Here are the quickest steps:

## Quick Setup (Choose One Method)

---

## Method 1: Re-authenticate GitHub CLI (Fastest)

1. **Re-authenticate GitHub CLI:**
   ```bash
   gh auth login -h github.com
   ```
   - Follow the prompts
   - Choose your preferred auth method (browser or token)
   - If browser: it will open a window for you to authorize
   - If token: generate one at https://github.com/settings/tokens

2. **Create repo and push:**
   ```bash
   cd "/Users/starkers/Projects/Burning Palms"
   gh repo create burning-palms --public --source=. --remote=origin --push
   ```
   
   Or if you prefer a private repo:
   ```bash
   gh repo create burning-palms --private --source=. --remote=origin --push
   ```

3. **Done!** Your code is now on GitHub.

---

## Method 2: Create Repo on GitHub Website (Manual)

1. **Create repository on GitHub:**
   - Go to: https://github.com/new
   - Repository name: `burning-palms`
   - Description: "Burning Palms website with Shopify integration"
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Copy the repository URL** (shown on GitHub after creation)
   - Example: `https://github.com/AMStarks/burning-palms.git`

3. **Connect and push:**
   ```bash
   cd "/Users/starkers/Projects/Burning Palms"
   git remote add origin https://github.com/AMStarks/burning-palms.git
   git branch -M main
   git push -u origin main
   ```

   Replace `AMStarks` with your actual GitHub username if different.

---

## Next: Connect to Vercel

After your code is on GitHub:

1. **Go to Vercel:**
   - Visit: https://vercel.com/login
   - Sign in with GitHub

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Find `burning-palms` in your repositories
   - Click "Import"

3. **Configure:**
   - Project Name: `burning-palms` (auto-filled)
   - Framework: Next.js (auto-detected)
   - **Add Environment Variables:**
     ```
     SHOPIFY_STORE_DOMAIN=burning-palms.myshopify.com
     SHOPIFY_STOREFRONT_ACCESS_TOKEN=d7cbf469847fb5331de52718d4e9c8e9
     NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=burning-palms.myshopify.com
     NEXTAUTH_URL=https://burningpalms.au
     DATABASE_URL=[set up production database - see below]
     NEXTAUTH_SECRET=[generate random string - see below]
     ```
   - Click "Deploy"

4. **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and use as `NEXTAUTH_SECRET` in Vercel.

5. **Set up Database:**
   - In Vercel → Your Project → Storage → Create Database (Postgres)
   - Or use Supabase/Railway/PlanetScale
   - Copy connection string → use as `DATABASE_URL`

---

## Quick Commands Reference

```bash
# Re-authenticate GitHub CLI
gh auth login -h github.com

# Create repo and push (after auth)
cd "/Users/starkers/Projects/Burning Palms"
gh repo create burning-palms --public --source=. --remote=origin --push

# OR manually (if using Method 2)
git remote add origin https://github.com/YOUR_USERNAME/burning-palms.git
git push -u origin main
```

---

## Need Help?

- **GitHub setup:** See `GITHUB_SETUP.md` for detailed instructions
- **Deployment:** See `DEPLOYMENT_GUIDE.md` for full deployment guide
- **Vercel docs:** https://vercel.com/docs
