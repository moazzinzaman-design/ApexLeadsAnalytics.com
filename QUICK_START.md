# 🚀 Apex Leads Analytics - Quick Start Guide

## Prerequisites

Before running the project, ensure you have:
- **Node.js** 18.x or later installed
- **npm** or **yarn** package manager
- A **Supabase** account (free tier works)

---

## Step 1: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to **SQL Editor** in the left sidebar
3. Copy the contents of `supabase/schema.sql`
4. Paste and run the SQL script
5. Go to **Settings → API** and copy:
   - Project URL
   - `service_role` key (or create a new anon key)

---

## Step 2: Configure Environment Variables

1. Create a copy of `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. (Optional) Add WhatsApp credentials for notifications:
   ```
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
   WHATSAPP_ACCESS_TOKEN=your_access_token
   ADMIN_WHATSAPP_NUMBER=+447711776530
   ```

---

## Step 3: Install Dependencies

```bash
npm install
```

---

## Step 4: Run Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**

---

## Step 5: Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
apex-leads-analytics/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── search/        # Edge search API
│   │   └── leads/         # Lead submission API
│   ├── directory/         # Professional directory page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── SearchHero.tsx
│   ├── DirectoryGrid.tsx
│   ├── ProCard.tsx
│   ├── VerifiedBadge.tsx
│   └── LeadCaptureForm.tsx
├── lib/
│   ├── supabase.ts        # Supabase client
│   └── whatsapp.ts        # WhatsApp notifications
├── types/
│   └── index.ts           # TypeScript types
├── supabase/
│   └── schema.sql         # Database schema
└── tailwind.config.ts     # Tailwind config
```

---

## Key Features Implemented

✅ **Search Hero** - Service & location search bar  
✅ **Directory Grid** - Professional cards with filters  
✅ **Pro Cards** - Profile display with ratings, pricing, verification  
✅ **Lead Capture Form** - Modal for client inquiries  
✅ **Verified Badge** - Visual verification indicator  
✅ **Edge Search API** - Proximity-based search with Haversine formula  
✅ **WhatsApp Integration** - Notification system ready  

---

## Next Steps (Optional)

1. **Add Profile Pages**: Create `app/directory/[id]/page.tsx`
2. **Add Authentication**: Implement user login/signup with Supabase Auth
3. **Add Dashboard**: Create pro dashboard for lead management
4. **WhatsApp Setup**: Configure WhatsApp Business API for notifications

---

## Deployment

Deploy to Vercel with one click:

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/apex-leads-analytics)

Or manually:
```bash
npm i -g vercel
vercel
```

---

## Support

For questions or issues:
- Email: moazzin.zaman@outlook.com
- WhatsApp: +44 7456522980

---

**Built with ❤️ by Moazzin Zaman**

