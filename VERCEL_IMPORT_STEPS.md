# Step-by-Step: Import burning-palms to Vercel

## Issue
Vercel is currently connected to the "Telestai-Project" organization, so your personal repositories aren't showing.

---

## Step 1: Check Your GitHub Connection in Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard

2. **Check Account Settings:**
   - Click your profile icon (top right)
   - Go to "Settings" → "Git"
   - You should see your GitHub connections listed

---

## Step 2: Switch to Personal Account (if needed)

### Option A: Switch in the Import Screen

1. **On the "Import Git Repository" page:**
   - Look at the dropdown that says "Telestai-Project"
   - Click the dropdown
   - You should see options like:
     - Your personal account (e.g., "AMStarks")
     - "Telestai-Project" (organization)
   - Select your personal account (AMStarks)

2. **Search for your repo:**
   - After switching, use the "Search..." bar
   - Type: `burning-palms`
   - It should appear in the list

### Option B: Add GitHub Integration for Personal Account

If your personal account isn't in the dropdown:

1. **Go to Vercel Settings:**
   - Click profile icon → "Settings"
   - Go to "Git" tab

2. **Disconnect and Reconnect:**
   - If you see GitHub listed, you can:
     - Click "..." menu → "Disconnect"
     - Then click "Add Git Provider" → "GitHub"
     - Authenticate with your personal GitHub account

3. **Or keep both:**
   - You can have both organization and personal account connected
   - Make sure your personal GitHub account (AMStarks) is connected

---

## Step 3: Import the Repository

1. **Switch to your personal account** in the dropdown (as described above)

2. **Find burning-palms:**
   - Use the search bar to type "burning-palms"
   - Or scroll through your repositories
   - Look for "burning-palms" with today's date

3. **Click "Import"** next to the burning-palms repository

---

## Step 4: Configure Project

After clicking Import:

1. **Project Settings:**
   - **Project Name:** `burning-palms` (or keep default)
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `./` (keep default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)

2. **Environment Variables (Add After First Deploy):**
   - Click "Deploy" first to get the project started
   - Then add environment variables in Project Settings

3. **Click "Deploy"**

---

## Alternative: Use Git URL Method

If the repository still doesn't show:

1. **Copy your repository URL:**
   - Go to: https://github.com/AMStarks/burning-palms
   - Click the green "Code" button
   - Copy the HTTPS URL: `https://github.com/AMStarks/burning-palms.git`

2. **In Vercel:**
   - Use the "Enter a Git repository URL to deploy..." field at the top
   - Paste: `https://github.com/AMStarks/burning-palms.git`
   - Click "Continue"
   - Follow the prompts to configure

---

## Verify Repository is Public

Make sure the repository is public on GitHub:

1. **Go to:** https://github.com/AMStarks/burning-palms
2. **Check the top right:**
   - Should say "Public" (not "Private")
   - If it says "Private", change it:
     - Settings → General → Danger Zone → "Change visibility" → "Change to public"

---

## Troubleshooting

**Repository not showing:**
- Make sure you've switched to your personal account (not Telestai-Project)
- Refresh the page after switching accounts
- Verify repo is public on GitHub
- Try the Git URL method as alternative

**Wrong account:**
- Go to Vercel Settings → Git
- Disconnect incorrect GitHub connection
- Reconnect with your personal GitHub account

**Can't switch accounts:**
- You may need to disconnect the organization connection temporarily
- Or add your personal account as a separate GitHub integration

---

## Quick Checklist

- [ ] On Vercel import page, switch dropdown from "Telestai-Project" to your personal account
- [ ] Search for "burning-palms" in the repository list
- [ ] Verify repository is "Public" on GitHub
- [ ] Click "Import" next to burning-palms
- [ ] Configure project settings (mostly auto-filled)
- [ ] Click "Deploy"
- [ ] Add environment variables after first deployment
