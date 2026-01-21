# Burning Palms

Australian surf & street wear brand with a retro 70s vibe.

## Getting Started

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the site.

## Environment Variables (Vercel)

These variables **do not exist by default** in Vercel — you must create them under:
**Vercel → Project → Settings → Environment Variables**.

### Contact Form (Captcha + Email)

- **Captcha (Cloudflare Turnstile)**:
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (public site key)
  - `TURNSTILE_SECRET_KEY` (secret key)
- **Email delivery (Resend)**:
  - `RESEND_API_KEY`
  - `CONTACT_TO_EMAIL` (set this to `info@burningpalms.au`)
  - `CONTACT_FROM_EMAIL` (optional; must be a verified sender/domain in Resend)

### Build

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Google Fonts** - Inter & Bebas Neue (retro display font)

## Design System

### Colors (Retro 70s Australian Surf Palette)
- **Background**: Cream/off-white (#faf8f3)
- **Foreground**: Dark brown (#8b4513)
- **Accent Orange**: Burnt orange (#ff6b35)
- **Accent Yellow**: Golden yellow (#ffb347)
- **Accent Brown**: Sienna brown (#a0522d)
- **Accent Dark**: Dark brown (#5d4037)

### Typography
- **Display**: Bebas Neue (retro bold)
- **Body**: Inter (clean, readable)

## Project Structure

```
app/
  layout.tsx      # Root layout with metadata
  page.tsx        # Homepage
  globals.css     # Global styles and Tailwind config
public/           # Static assets (logo, images)
```

## Admin System

### Admin Login

The admin dashboard is available at `/admin/login`.

**Default Admin Credentials:**
- Email: `andrewmartinstarkey@gmail.com`
- Password: `15124353asS$`

### Admin Features

- **Dashboard**: Overview of content and statistics
- **Pages**: Create, edit, and manage website pages
- **Posts**: Blog post management (coming soon)
- **Settings**: Manage website settings (site title, description, etc.)
- **Media**: Media library for images and files (coming soon)

### Database

The project uses SQLite with Prisma ORM. The database file is located at `prisma/dev.db`.

To seed the database with the admin user:
```bash
npm run db:seed
```

To run migrations:
```bash
npx prisma migrate dev
```

## Next Steps

1. ✅ Logo added to public/ directory
2. ✅ Admin CMS system implemented
3. Set up Shopify integration
4. Create product pages
5. Add shopping cart functionality
6. Configure POD supplier integration
7. Enhance content editor with rich text capabilities
8. Add media upload functionality

## References

Design inspiration from:
- White Fox Boutique (modern e-commerce structure)
- Ghanda (surf culture aesthetic)
- Rip Curl (professional surf brand layout)
