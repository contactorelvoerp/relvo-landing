# Relvo Landing Page - React Version

Modern landing page built with React + Vite for Relvo, an AI-powered ERP that automates company accounting.

## 🚀 Features

- ⚡️ **Vite** - Lightning fast HMR
- ⚛️ **React 18** - Latest React features
- 🎨 **Tailwind CSS** - Utility-first CSS
- 🎭 **Glassmorphism** - Modern glass effects
- 🌓 **Dark/Light Mode** - Theme toggle
- ✨ **Animations** - Smooth animations and interactive effects
- 📱 **Responsive** - Mobile-first design
- 🔗 **Supabase** - Backend for early-bird signups
- 🎯 **Typewriter Effect** - Animated hero text
- 📊 **Collapsible Table** - Interactive pricing comparison

## 📋 Prerequisites

- Node.js 16+ (v18+ recommended)
- npm or yarn
- Supabase account (free tier works)

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Supabase

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run:

```sql
-- Create early_birds table
CREATE TABLE early_birds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT DEFAULT 'landing_page'
);

-- Enable Row Level Security
ALTER TABLE early_birds ENABLE ROW LEVEL SECURITY;

-- Allow public inserts
CREATE POLICY "Allow public inserts" ON early_birds
    FOR INSERT
    TO anon
    WITH CHECK (true);
```

4. Go to **Settings > API** and copy:
   - Project URL
   - anon/public key

5. Create `.env` file:

```bash
cp .env.example .env
```

6. Edit `.env` and add your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🖥️ Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`

## 🏗️ Build

Build for production:

```bash
npm run build
# or
yarn build
```

Preview production build:

```bash
npm run preview
# or
yarn preview
```

## 📁 Project Structure

```
relvo-landing-react/
├── src/
│   ├── components/
│   │   ├── AIAssistant.jsx    # AI chatbot section
│   │   ├── BackgroundLayers.jsx # Grid and glows
│   │   ├── EarlyBird.jsx      # Form with Supabase
│   │   ├── Footer.jsx         # Footer section
│   │   ├── Hero.jsx           # Hero with typewriter
│   │   ├── Navbar.jsx         # Navigation bar
│   │   ├── Pricing.jsx        # Pricing with table
│   │   ├── Solution.jsx       # Features section
│   │   └── Spotlight.jsx      # Mouse spotlight effect
│   ├── config/
│   │   └── supabase.js        # Supabase configuration
│   ├── hooks/
│   │   ├── useSpotlight.js    # Spotlight hook
│   │   ├── useTheme.js        # Theme toggle hook
│   │   └── useTypewriter.js   # Typewriter effect hook
│   ├── App.jsx                # Main app component
│   ├── index.css              # Global styles
│   └── main.jsx               # Entry point
├── index.html                 # HTML template
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
├── vite.config.js             # Vite configuration
└── .env                       # Environment variables (create this)
```

## 🎨 Customization

### Colors and Theme

Edit CSS variables in `src/index.css`:

```css
:root {
    --bg-main: #ffffff;
    --text-main: #0f172a;
    /* ... more variables */
}

body.dark {
    --bg-main: #030712;
    /* ... dark mode variables */
}
```

### Typewriter Speed

Adjust in `src/components/Hero.jsx`:

```jsx
const typewriterText = useTypewriter(phrases, {
    typeSpeed: 0.1,        // Typing speed (lower = faster)
    deleteSpeed: 200,      // Deleting speed
    delayAtEnd: 1,         // Pause at end of phrase
    delayBetweenPhrases: 1 // Pause between phrases
})
```

### Content

Edit component files in `src/components/` to change text, images, or structure.

## 🔒 Security

- Supabase `anon` key is safe for public use
- Row Level Security (RLS) is enabled
- Only inserts are allowed, no public reads
- Email validation on both client and server

## 🐛 Troubleshooting

### Form not submitting

1. Check `.env` has correct Supabase credentials
2. Verify `early_birds` table exists in Supabase
3. Check browser console for errors
4. Ensure RLS policies are set up correctly

### Styles not loading

1. Make sure Tailwind is configured properly
2. Run `npm run dev` to rebuild
3. Clear browser cache

### TypeScript errors

This project uses plain JavaScript. If you want TypeScript, rename `.jsx` files to `.tsx` and add type definitions.

## 📦 Technologies

- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
- [Supabase](https://supabase.com/) - Backend
- [PostCSS](https://postcss.org/) - CSS processing

## 📝 License

© 2024 Relvo Inc. All rights reserved.

## 🤝 Contributing

This is a private project. For issues or questions, contact the development team.

