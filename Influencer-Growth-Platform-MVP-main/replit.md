# Exclusive Influencer Network

## Overview
A referral-based influencer platform where users complete social media tasks to earn money. Features 6 membership tiers, KYC verification, and comprehensive admin controls.

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS with cyber-style theme
- **Routing**: React Router DOM v6
- **State Management**: React Context (AuthContext, DataStore, ThemeContext, CurrencyContext)

## Key Features
- 6 Membership Levels: Starter ($5), Bronze ($10), Silver ($20), Gold ($50), Platinum ($100), Diamond ($200)
- Referral-based signup with passcode validation (format: LEVEL-YEAR-RANDOM)
- KYC verification with ID document upload and admin approval
- 9 social media platforms for tasks (TikTok, Instagram, YouTube, Twitter, Snapchat, Facebook, Telegram, WhatsApp, Custom)
- Dark/light mode toggle with cyber-style design
- Admin dashboard with user management, task assignment, KYC approval
- 14 global currencies supported

## Project Structure
```
├── src/
│   ├── App.tsx              # Main app with routing
│   ├── index.tsx            # Entry point
│   ├── index.css            # Global styles, Tailwind, cyber theme
│   ├── components/          # Reusable UI components
│   │   ├── forms/           # MultiStepSignup wizard
│   │   └── ui/              # Buttons, modals, cards
│   ├── contexts/            # State management
│   │   ├── AuthContext.tsx  # Authentication
│   │   ├── DataStore.tsx    # Users, tasks, withdrawals
│   │   ├── ThemeContext.tsx # Dark/light mode
│   │   └── CurrencyContext.tsx # Currency conversion
│   ├── pages/               # Page components
│   │   ├── user/            # User dashboard, tasks, KYC
│   │   └── admin/           # Admin dashboard, management
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript definitions, MEMBERSHIP_TIERS
├── docs/
│   └── schema.sql           # Supabase database schema
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## Running the Application
- **Development**: `npm run dev` - Runs on port 5000
- **Build**: `npm run build` - Production build
- **Preview**: `npm run preview` - Preview production

## Test Credentials
- **Admin**: admin@exclusive.com / admin123
- **User**: john@example.com / password123

## Recent Changes
- January 25, 2026: Complete feature implementation
  - 6-tier membership system with proper pricing and rewards
  - Full KYC system with ID upload and admin approval/rejection
  - Passcode validation for referral-based signup
  - Cyber-style theme with Orbitron font, animations, dark/light toggle
  - Admin controls for user management, balance adjustment, task assignment
  - SQL schema generated for Supabase integration
