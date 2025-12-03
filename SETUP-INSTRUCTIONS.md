# Relvo Landing - React Setup Instructions

## Quick Start (React Version)

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including React, Vite, Tailwind CSS, and Supabase.

### Step 2: Configure Supabase

#### A. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Fill in project details and wait for it to initialize

#### B. Create Database Table

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Paste and run this SQL:

```sql
CREATE TABLE early_birds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT DEFAULT 'landing_page'
);

ALTER TABLE early_birds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON early_birds
    FOR INSERT
    TO anon
    WITH CHECK (true);
```

4. Click "Run" (or press Ctrl/Cmd + Enter)

#### C. Get API Keys

1. Go to **Settings** (gear icon in sidebar)
2. Click **API**
3. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

#### D. Create Environment File

1. Copy the example file:

```bash
cp .env.example .env
```

2. Open `.env` in your editor
3. Replace the values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...your-actual-key
```

### Step 3: Run Development Server

```bash
npm run dev
```

The landing page will open at `http://localhost:3000`

### Step 4: Test the Form

1. Scroll to "Migra a Relvo" section
2. Enter an email and click "Unirme"
3. Check Supabase for the new entry:
   - Go to **Table Editor** > `early_birds`
   - You should see the email you entered

## Project Structure

```
relvo-landing/
├── src/
│   ├── components/        # React components
│   ├── config/           # Supabase config
│   ├── hooks/            # Custom React hooks
│   ├── App.jsx           # Main app
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index-react.html      # HTML template
├── package.json          # Dependencies
├── vite.config.js        # Vite config
├── tailwind.config.js    # Tailwind config
└── .env                  # Your credentials (create this)
```

## Common Issues

### Issue: `npm install` fails

**Solution:** Make sure you have Node.js 16+ installed:

```bash
node --version  # Should show v16.0.0 or higher
```

### Issue: Form shows error "Supabase no está configurado"

**Solution:** 
1. Check that `.env` file exists
2. Verify the values are correct (no quotes needed)
3. Restart the dev server: `Ctrl+C` then `npm run dev`

### Issue: Styles not loading

**Solution:**
1. Make sure `npm install` completed successfully
2. Restart the dev server
3. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: "Cannot find module 'react'"

**Solution:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## Build for Production

When ready to deploy:

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

Preview the production build:

```bash
npm run preview
```

## Next Steps

1. **Deploy:** Use Vercel, Netlify, or any static hosting
2. **Custom Domain:** Configure your domain in hosting settings
3. **Analytics:** Add Google Analytics or similar
4. **SEO:** Update meta tags in `index-react.html`

## Need Help?

Check the full documentation in `README-REACT.md`

