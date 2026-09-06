# UniRide — University Transportation Management System

A modern, clean React landing page for **UniRide**, a university transportation management and bus booking system for **SLIIT Kandy**.

**Tagline:** *"Easy travel for university students."*

## Project Overview

UniRide is a real campus project designed to provide students with a simple, reliable way to:
- Book university buses
- Manage digital balance
- Travel with ease and confidence

## Part 1, 2 & 3: Complete Landing Page

This version includes:
- ✅ **Responsive Navbar** with mobile hamburger menu, sticky positioning, and smooth scrolling
- ✅ **Hero Section** with compelling headline, supporting text, and call-to-action buttons
- ✅ **Transportation Illustration** with subtle animations
- ✅ **How It Works Section** with 4-step process
- ✅ **Features Section** with 4 feature cards and trust statistics
- ✅ **Feedback Section** with 3 student testimonials and star ratings
- ✅ **Professional Footer** with navigation, support, and university sections
- ✅ **Professional Design** using the UniRide color system
- ✅ **Mobile-First Responsive** layout for desktop, tablet, and mobile devices
- ✅ **Smooth scrolling navigation** between all sections
- ✅ **Final polish** with consistent spacing, typography, and interactive effects

## Design System

### Color Palette
- **Primary Blue**: `#2563EB` — Main brand color
- **Dark Blue**: `#1E3A8A` — Emphasis and hover states
- **Orange Accent**: `#F59E0B` — Small accents only
- **Background**: `#F8FAFC` — Light neutral background
- **Text**: `#1E293B` (main), `#64748B` (secondary)
- **Border**: `#E2E8F0`

### Design Principles
- Simple, modern, clean, and trustworthy
- Plenty of whitespace
- Rounded cards with subtle shadows
- Clear visual hierarchy
- No excessive gradients, glassmorphism, or complicated animations

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Inline SVG components

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will start at `http://localhost:5173`

### Supabase Team Setup

UniRide uses one shared Supabase project for the whole team. Each teammate needs a local `.env` file, but `.env` must never be committed.

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a local environment file. In PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Fill `.env` with the shared `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the team lead or Supabase project settings.

4. Start the app and open `http://localhost:5173/admin`. The dashboard should show `Supabase connected`.

The Supabase Dashboard is shared separately from this Git repository. Database tables, columns, authentication settings, and Row Level Security policies must be created in the shared Supabase project so every teammate uses the same schema. Only the publishable key belongs in the frontend; never put a Supabase service-role key in `.env` or browser code.

## Project Structure

```
uni-ride/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                      # Navigation bar with mobile menu
│   │   ├── Hero.tsx                        # Hero section with CTA buttons
│   │   ├── HowItWorks.tsx                  # 4-step process section
│   │   ├── Features.tsx                    # 4 feature cards with stats
│   │   ├── Feedback.tsx                    # Student testimonials section
│   │   ├── Footer.tsx                      # Footer with navigation and links
│   │   └── TransportationIllustration.tsx  # SVG illustration with animations
│   ├── App.tsx                             # Main app component
│   ├── main.tsx                            # React entry point
│   └── index.css                           # Global styles and Tailwind directives
├── public/                                 # Static assets
├── index.html                              # HTML entry point
├── vite.config.ts                          # Vite configuration
├── tailwind.config.ts                      # Tailwind CSS configuration
├── postcss.config.js                       # PostCSS configuration
├── tsconfig.json                           # TypeScript configuration
└── package.json                            # Project dependencies
```

## Features

### Navbar
- Responsive sticky navigation
- Logo and brand name with tagline
- Navigation links: Home, How It Works, Features, Feedback
- Smooth scroll to sections
- Mobile hamburger menu (hamburger icon)
- Login button (visual only, no authentication yet)
- Clear hover states with smooth transitions

### Hero Section
- Main heading: "Your University Ride, Just a Few Clicks Away."
- Supporting text with value proposition
- Two call-to-action buttons: "Book a Ride" and "How It Works"
- Professional transportation-themed SVG illustration
- Subtle animations:
  - Bus with gentle bounce movement
  - Route path appearing smoothly
  - Location markers with floating animation
- Trust indicator showing student reviews
- Scroll indicator on desktop
- Full responsive design

### How It Works Section
- Clean section title: "How UniRide Works"
- Subtitle: "Getting your university ride is simple."
- 4-step process displayed as cards:
  1. **Login** — Sign in using your university account
  2. **Add Balance** — Add digital cash through university administration
  3. **Book Your Ride** — Select route and book available bus
  4. **Show Your Token** — Receive 4-digit booking token and show to conductor
- Each step includes:
  - Step number with orange accent background
  - Emoji icon (🔐, 💳, 🚌, 🎫)
  - Title and description
- Desktop: Horizontal layout with connecting arrows
- Mobile: Vertical stack with vertical connectors
- Hover effects on cards
- Bottom CTA: "Book Your First Ride"

### Features Section
- Clean section title: "Everything You Need for Easier Campus Travel"
- 4 feature cards showcasing key benefits:
  1. **Easy Booking** — Quick and convenient booking with just a few taps
  2. **Digital Balance** — Manage transportation balance in one place
  3. **Secure Token** — Simple 4-digit token for ride confirmation
  4. **Ride Management** — View and manage upcoming and previous rides
- Each card includes:
  - Icon (⚡, 💰, 🔒, 📋)
  - Title and description
  - Animated accent line on hover
- Trust statistics section with 4 metrics:
  - 2K+ Active Students
  - 15 Campus Routes
  - 24/7 Support
  - 99% Satisfaction
- Cards have subtle borders, hover effects with shadow
- Responsive: 1 column mobile, 2 columns tablet, 4 columns desktop

### Feedback Section
- Section title: "What Students Say About UniRide"
- Subtitle: "Hear from real SLIIT students about their UniRide experience."
- 3 student testimonial cards featuring:
  - Avatar circle with student initials (styled with gradient)
  - Student name and affiliation ("SLIIT Student")
  - Short feedback quote (italicized)
  - 5-star rating display (★★★★★)
- Sample testimonials from Kayla Andersen, James Mitchell, and Sophia Reyes
- Hover effects with border and shadow transitions
- Bottom CTA: "Get Started Today"
- Responsive: 1 column mobile, 2 columns tablet, 3 columns desktop

### Footer
- Professional dark footer with white text
- Brand section: UniRide logo, name, and tagline
- Four columns of navigation:
  - **Navigation**: Home, How It Works, Features, Feedback (with smooth scroll)
  - **Support**: Help, FAQ, Contact
  - **University**: SLIIT, Student Affairs, Transport
- Bottom section with:
  - Copyright notice: © 2026 UniRide — SLIIT Kandy
  - "Developed as a university project" subtitle
  - "All rights reserved" note
- Responsive: stacked mobile, multi-column desktop
- Subtle hover effects on footer links
- Clean design without oversizing

### Illustration
- Modern university bus
- Simple route path with animation
- Start and end location markers
- University building icon
- Passenger figure
- Directional arrow
- Subtle color scheme matching the design system

## Responsive Design

The page is fully responsive and works seamlessly on:
- **Mobile** (< 640px): Stacked layout, hamburger menu
- **Tablet** (640px - 1024px): Hybrid layout
- **Desktop** (> 1024px): Full-width optimized layout

## Completed Features

✅ **Part 1**: Navbar, Hero Section, Transportation Illustration  
✅ **Part 2**: How It Works Section, Features Section  
✅ **Part 3**: Feedback Section, Footer, Final Polish  

## Future Enhancements (Phase 4 & Beyond)

- Booking functionality and flow
- User authentication and login
- User dashboard and account management
- Digital balance/wallet management
- Ride history and management
- Conductor and admin interfaces
- Payment integration
- Backend API integration
- Database setup

## Code Quality

- **TypeScript** for type safety
- **Semantic HTML** for accessibility
- **Tailwind CSS** for utility-first styling
- **Component-based architecture** for maintainability
- **Mobile-first approach** for responsive design
- **Clean, readable code** suitable for team collaboration

## Notes for the Team

- All components are modular and reusable
- Avoid adding unnecessary external libraries
- Keep the design simple and professional
- Follow the UniRide color system and design principles
- Test on multiple devices during development
- Use semantic HTML elements for better accessibility

## License

© 2026 UniRide - SLIIT Kandy. All rights reserved.

---

**Built with ❤️ for university students by the UniRide team**
