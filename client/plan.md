# 🎯 Landing Page Plan: Quantitative Club of IIT Kharagpur

## 📋 Project Overview
Create a stunning, modern landing page for the Quantitative Club of IIT Kharagpur featuring interactive backgrounds, smooth animations, and engaging content sections. The design will use a green color scheme that matches the club's logo - a circular green emblem with a "Q" and financial chart line elements.

### 🎨 Brand Identity
- **Logo**: Green circular design with "Q" and chart line
- **Theme**: Financial/quantitative with green color palette
- **Style**: Professional, modern, data-driven aesthetic

## 🏗️ Technical Stack
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: GSAP v3 + Framer Motion
- **3D Graphics**: Three.js (for PixelBlast background)
- **UI Libraries**: Headless UI (for accessibility)
- **Icons**: Lucide React

## 🎨 Design System

### Color Palette
```css
Primary: #22C55E (Green 500 - matching logo)
Secondary: #16A34A (Green 600 - darker green)
Accent: #84CC16 (Lime 500 - chart line color)
Success: #10B981 (Emerald 500)
Dark: #0F172A (Slate 900)
Light: #F0FDF4 (Green 50)
Text: #1E293B (Slate 800)
Muted: #64748B (Slate 500)
Chart: #EAB308 (Yellow 500 - for financial charts)
```

### Typography
- **Headers**: Geist Sans (Bold, 700)
- **Body**: Geist Sans (Regular, 400)
- **Code/Numbers**: Geist Mono

## 📐 Page Structure & Sections

### 1. Hero Section (Introduction)
- **Background**: PixelBlast component with green interactive particles
- **Content**: 
  - Animated QC club logo (green circular design)
  - Tagline with typewriter effect
  - Call-to-action buttons with green accent
  - Floating mathematical symbols and chart lines animation
- **Height**: 100vh
- **Interactions**: Mouse-following green particles, click ripples with lime accents
- **PixelBlast Config**: 
  - Primary color: #22C55E (Green 500)
  - Ripple effects with lime accent (#84CC16)
  - Interactive particles responding to mouse movement

### 2. Navigation Bar
- **Type**: Fixed/Sticky header with blur backdrop
- **Features**:
  - Smooth scroll to sections
  - Active section highlighting
  - Mobile hamburger menu
  - Logo with subtle hover animation
- **Links**: Home, About, What We Do, Our Work, Contact

### 3. "Who Are We" Section
- **Layout**: Split layout with image/illustration on left, content on right
- **Animations**: 
  - Fade-in on scroll
  - Counter animations for statistics
  - Parallax background elements
- **Content**:
  - Club mission and vision
  - Statistics (members, projects, achievements)
  - Team member cards with hover effects

### 4. "What We Do" Section  
- **Layout**: Grid of service cards with icons
- **Features**:
  - Hover animations with 3D tilt effects
  - Staggered entrance animations
  - Interactive card expansion
- **Content Areas**:
  - Quantitative Research
  - Financial Modeling
  - Data Science & Analytics
  - Algorithmic Trading
  - Machine Learning
  - Risk Management

### 5. "Our Work" Section
- **Layout**: Masonry/Grid gallery with project showcases
- **Features**:
  - Filterable portfolio
  - Modal lightbox for project details
  - Parallax scroll effects
  - Loading animations
- **Project Types**:
  - Research Papers
  - Trading Strategies
  - Data Visualizations
  - Competition Wins
  - Industry Collaborations

### 6. Footer
- **Design**: Multi-column layout with gradient background
- **Content**:
  - Contact information
  - Social media links
  - Quick links
  - Newsletter signup
  - Copyright and legal

## 🎪 Interactive Features

### Custom Cursor
- **Default**: Subtle circle with trailing effect
- **Hover States**: 
  - Expand on buttons/links
  - Text reveal on headings
  - Particle explosion on special elements
- **Implementation**: CSS transforms + GSAP

### Parallax Effects
- **Background Elements**: Different scroll speeds for depth
- **Text Elements**: Subtle parallax for engagement
- **Images**: Multi-layer parallax for 3D effect
- **Implementation**: GSAP ScrollTrigger

### Smooth Scrolling
- **Library**: Lenis for butter-smooth scroll
- **Features**: 
  - Momentum scrolling
  - Scroll anchoring
  - Progress indicators

## 🎬 Animation System

### Page Load Sequence
1. PixelBlast background initialization
2. Logo fade-in with scale animation
3. Tagline typewriter effect
4. Navigation bar slide-down
5. Call-to-action buttons bounce-in

### Scroll-Triggered Animations
- **Fade In**: Text blocks and images
- **Slide Up**: Cards and sections
- **Scale**: Icons and illustrations
- **Stagger**: Grid items and lists
- **Counter**: Number animations

### Micro-Interactions
- **Button Hovers**: Scale, glow, ripple effects
- **Card Hovers**: 3D tilt, shadow enhancement
- **Text Selection**: Custom highlight colors
- **Form Inputs**: Focus animations

## 📁 File Structure
```
src/
├── app/
│   ├── layout.tsx (Updated with new fonts, cursor)
│   ├── page.tsx (Main landing page)
│   └── globals.css (Updated with custom styles)
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── CustomCursor.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Navigation.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── WorkSection.tsx
│   │   └── Footer.tsx
│   └── animations/
│       ├── TextReveal.tsx
│       ├── CounterAnimation.tsx
│       ├── ParallaxContainer.tsx
│       └── ScrollProgress.tsx
├── hooks/
│   ├── useParallax.ts
│   ├── useSmoothScroll.ts
│   └── useIntersectionObserver.ts
├── lib/
│   ├── animations.ts (GSAP utilities)
│   ├── utils.ts
│   └── constants.ts
└── styles/
    └── components.css
```

## 🛠️ Development Phases

### Phase 1: Foundation (Days 1-2)
- [ ] Set up additional dependencies
- [ ] Create base components and layout
- [ ] Implement custom cursor
- [ ] Set up smooth scrolling
- [ ] Design system implementation

### Phase 2: Hero Section (Days 3-4)
- [ ] Integrate PixelBlast background with green color scheme
- [ ] Create animated hero content with QC logo
- [ ] Implement navigation bar with green accents
- [ ] Add scroll progress indicator

### Phase 3: Content Sections (Days 5-7)
- [ ] Build "Who Are We" section
- [ ] Create "What We Do" service cards
- [ ] Develop "Our Work" portfolio gallery
- [ ] Implement scroll-triggered animations

### Phase 4: Interactions & Polish (Days 8-9)
- [ ] Add parallax effects
- [ ] Implement micro-interactions
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Accessibility improvements

### Phase 5: Testing & Launch (Day 10)
- [ ] Cross-browser testing
- [ ] Performance auditing
- [ ] SEO optimization
- [ ] Final polish and deployment

## 📦 Additional Dependencies Needed
```json
{
  "framer-motion": "^11.0.0",
  "lenis": "^1.0.0",
  "lucide-react": "^0.400.0",
  "@headlessui/react": "^2.0.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

## 🎯 Key Performance Targets
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 90+ (Performance, Accessibility, SEO)

## 📱 Responsive Breakpoints
- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px  
- **Desktop**: 1025px - 1440px
- **Large Desktop**: 1441px+

## 🚀 Future Enhancements
- Dark/Light mode toggle
- Multi-language support
- Blog integration
- Member portal
- Event calendar
- Live chat integration

---

## 🎨 Visual References & Inspiration
- **Style**: Modern, clean, mathematical/data-driven aesthetic
- **Colors**: Professional with vibrant accents
- **Typography**: Technical but approachable
- **Animations**: Smooth, purposeful, not overwhelming
- **Layout**: Asymmetrical balance with lots of whitespace

This plan provides a comprehensive roadmap for creating a stunning, professional landing page that showcases the Quantitative Club's expertise while providing an engaging user experience.
