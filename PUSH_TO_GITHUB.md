# Push to GitHub - Manual Steps

Since `gh auth login` is interactive and needs to run in your terminal, please follow these steps:

## Step 1: Authenticate GitHub CLI (Run in Your Terminal)

Open your terminal (not through Cursor's tool) and run:

```bash
cd "/Users/starkers/Projects/Burning Palms"
gh auth login
```

**Follow the prompts:**
1. **What account do you want to log into?** → Choose "GitHub.com"
2. **What is your preferred protocol for Git operations?** → Choose "SSH" (recommended)
3. **Authenticate Git credential helper?** → Choose "Yes"
4. **How would you like to authenticate?** → Choose "Login with a web browser"
5. Press Enter - it will show a code and open your browser
6. Paste the code in the browser and authorize
7. Or choose "Paste an authentication token" if you prefer

## Step 2: Create Repository and Push

Once authentication is complete, run:

```bash
cd "/Users/starkers/Projects/Burning Palms"
gh repo create burning-palms --public --source=. --remote=origin --push
```

This will:
- Create a new public GitHub repository called `burning-palms`
- Add it as remote origin
- Push all your committed code

## Alternative: If Authentication Doesn't Work

If you prefer to skip GitHub CLI, create the repo manually:

1. **Go to GitHub:** https://github.com/new
2. **Repository name:** `burning-palms`
3. **Public** or **Private** (your choice)
4. **Do NOT** check "Initialize with README"
5. Click "Create repository"

Then run:
```bash
cd "/Users/starkers/Projects/Burning Palms"
git remote add origin https://github.com/YOUR_USERNAME/burning-palms.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## After Pushing

Once your code is on GitHub, Vercel will automatically see it (since you're already connected). Just go to:
1. https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Find `burning-palms` and click "Import"

Then add environment variables as described in `VERCEL_CONNECTION.md`.
