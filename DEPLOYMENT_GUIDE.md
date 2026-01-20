# Deployment Guide for burningpalms.au

This guide will walk you through deploying your Next.js website to the `burningpalms.au` domain and configuring Shopify integration.

## Prerequisites
- ✅ Domain: `burningpalms.au` (already registered with OnlyDomains)
- ✅ Shopify Store: `burning-palms.myshopify.com`
- ✅ Website: Next.js application (ready to deploy)

---

## Step 1: Choose a Hosting Provider

### Recommended: Vercel (Easiest for Next.js)
- Free tier available
- Automatic deployments from GitHub
- Built-in SSL certificates
- Optimized for Next.js

### Alternative Options:
- **Netlify** - Similar to Vercel, also good for Next.js
- **Railway** - Good for apps with databases
- **DigitalOcean App Platform** - More control
- **AWS/VPS** - Most control, more complex

---

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Quick Start)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy your project:**
   ```bash
   cd "/Users/starkers/Projects/Burning Palms"
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Confirm project settings
   - Wait for deployment to complete

5. **Add custom domain:**
   ```bash
   vercel domains add burningpalms.au
   vercel domains add www.burningpalms.au
   ```

### Option B: Deploy via GitHub (Recommended for Auto-Deployments)

1. **Push your code to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add these variables:
     ```
     SHOPIFY_STORE_DOMAIN=burning-palms.myshopify.com
     SHOPIFY_STOREFRONT_ACCESS_TOKEN=d7cbf469847fb5331de52718d4e9c8e9
     NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=burning-palms.myshopify.com
     DATABASE_URL=file:./dev.db (or your production database URL)
     NEXTAUTH_SECRET=<generate a random string>
     NEXTAUTH_URL=https://burningpalms.au
     ```

4. **Redeploy** after adding environment variables

---

## Step 3: Configure DNS Settings

### Current Setup (OnlyDomains)
- Nameservers: `ns1.onlydomains.com`, `ns2.onlydomains.com`, `ns3.onlydomains.com`

### Option A: Use OnlyDomains DNS (Keep Current Nameservers)

1. Go to OnlyDomains → Domain Info → DNS Settings
2. Click "EDIT ZONE RECORDS"
3. Add these DNS records:

   **Type A Record (Main Domain):**
   ```
   Type: A
   Name: @ (or leave blank for root domain)
   Value: [Vercel IP address - get from Vercel dashboard]
   TTL: 3600
   ```

   **Type CNAME Record (WWW):**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

   **Optional - Vercel will provide specific values:**
   After adding the domain in Vercel, they'll show you exact DNS records to add.

### Option B: Delegate to Vercel Nameservers (Simpler)

1. In Vercel Dashboard → Project Settings → Domains
2. Add `burningpalms.au` and `www.burningpalms.au`
3. Vercel will provide nameservers (e.g., `ns1.vercel-dns.com`)
4. In OnlyDomains → DNS Settings:
   - Select "Delegate to Your Name Servers"
   - Enter the Vercel nameservers provided

### Get DNS Records from Vercel:
After adding your domain in Vercel, go to:
- Project Settings → Domains → burningpalms.au
- Vercel will show you the exact DNS records needed

---

## Step 4: Configure Shopify Settings

### A. Update Shopify Store Domain Settings

1. **Go to Shopify Admin:**
   - Navigate to: `https://burning-palms.myshopify.com/admin`

2. **Settings → Domains:**
   - Click "Connect existing domain"
   - Enter: `burningpalms.au`
   - Follow Shopify's instructions (usually just verify ownership)

3. **Set Primary Domain:**
   - Make `burningpalms.au` your primary domain
   - This ensures Shopify checkout uses your custom domain

### B. Update Shopify Headless Settings

1. **Sales Channels → Headless → Your Storefront**
2. **Settings:**
   - Make sure your custom domain is allowed
   - Update any domain restrictions if needed

### C. Configure Checkout Domain

1. **Settings → Checkout:**
   - Ensure checkout uses your custom domain
   - This allows seamless checkout from your website

---

## Step 5: Update Your Website Code

### Environment Variables (Already Set, but verify):

**Production Environment Variables:**
```env
SHOPIFY_STORE_DOMAIN=burning-palms.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=d7cbf469847fb5331de52718d4e9c8e9
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=burning-palms.myshopify.com
NEXTAUTH_URL=https://burningpalms.au
```

**Important Notes:**
- ✅ Your Shopify Storefront API token works with your custom domain
- ✅ The `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` is used for client-side cart API calls
- ✅ Shopify checkout will use your custom domain once configured in Shopify

---

## Step 6: Database Setup (Production)

### Current: SQLite (Development)
For production, you'll need a proper database. Options:

1. **Vercel Postgres** (Recommended - Easy integration)
2. **Supabase** (Free tier available)
3. **PlanetScale** (MySQL compatible)
4. **Railway PostgreSQL**

### Migration Steps:

1. **Set up production database**
2. **Update `DATABASE_URL` environment variable in Vercel**
3. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```
4. **Seed database if needed:**
   ```bash
   npm run db:seed
   ```

---

## Step 7: Verify Everything Works

### Checklist:

- [ ] Website loads at `https://burningpalms.au`
- [ ] WWW redirect works: `https://www.burningpalms.au` → `https://burningpalms.au`
- [ ] SSL certificate is active (Vercel handles this automatically)
- [ ] Products display from Shopify
- [ ] Product pages work: `https://burningpalms.au/products/[product-handle]`
- [ ] "Add to Cart" redirects to Shopify checkout
- [ ] Checkout uses your custom domain
- [ ] Admin panel accessible: `https://burningpalms.au/admin`

---

## Troubleshooting

### Domain Not Loading:
1. **Check DNS propagation:** Use https://dnschecker.org
2. **Wait 24-48 hours** for DNS changes to propagate globally
3. **Verify DNS records** match Vercel's requirements exactly

### Shopify Products Not Showing:
1. **Check environment variables** in Vercel dashboard
2. **Verify Storefront API token** is correct
3. **Check products are published** in Shopify Admin
4. **Verify products are in Headless sales channel**

### Checkout Issues:
1. **Verify custom domain** is set as primary in Shopify
2. **Check Shopify domain settings** allow your custom domain
3. **Clear browser cache** and try again

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Shopify Custom Domains:** https://help.shopify.com/en/manual/domains
- **DNS Issues:** Contact OnlyDomains support

---

## Quick Start Commands

```bash
# Deploy to Vercel (first time)
npm i -g vercel
vercel login
vercel

# Add custom domain
vercel domains add burningpalms.au

# Deploy with production build
vercel --prod
```
