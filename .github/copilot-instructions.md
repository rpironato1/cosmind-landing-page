# CosMind Landing Page - Copilot Instructions

## 🌟 Project Overview

CosMind is a premium astrology and horoscope platform that combines modern web technologies with mystical experiences. This landing page serves as the entry point for users to discover and engage with AI-powered astrological services.

### Core Purpose
- **Primary Goal**: Convert visitors into engaged users of the CosMind horoscope platform
- **Target Audience**: Astrology enthusiasts, spiritual seekers, and users interested in personalized cosmic insights
- **Business Model**: Token-based monetization with premium astrological features

## 🏗️ Architecture & Tech Stack

### Frontend Framework
- **React 19** with TypeScript for type safety
- **Vite** as build tool for fast development and optimized production builds
- **Tailwind CSS** for responsive, utility-first styling
- **Framer Motion** for smooth animations and cosmic visual effects

### Component Architecture
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (buttons, inputs, etc.)
│   ├── Navigation.tsx   # Site navigation
│   ├── HeroSection.tsx  # Landing hero area
│   ├── HoroscopeGenerator.tsx  # Core horoscope functionality
│   └── ...              # Feature-specific components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and configurations
└── styles/             # Global styles and themes
```

### Key Dependencies
- **@radix-ui/***: Accessible, unstyled UI primitives
- **lucide-react**: Modern icon library
- **class-variance-authority**: Type-safe component variants
- **zod**: Runtime type validation
- **react-hook-form**: Form state management

## 🧪 Testing Philosophy

### Testing Strategy (95% MCP Playwright + 5% Specialized Tools)
- **Unit Tests**: Vitest for pure functions and utilities
- **Component Tests**: Testing Library for React component behavior
- **E2E Tests**: Playwright for user flows and integration testing
- **Visual Tests**: Screenshot comparison for UI consistency
- **Performance Tests**: Lighthouse audits for web vitals

### Quality Gates
All code changes must pass:
```bash
npm run check:all  # Runs all quality checks in parallel
├── check:lint     # ESLint + Prettier
├── check:types    # TypeScript compilation
├── check:test     # Unit tests with coverage
├── check:e2e      # End-to-end tests
├── check:security # npm audit
└── check:bundle   # Bundle size analysis
```

## 🎨 Design System & UI Guidelines

### Component Patterns
- Use **compound components** for complex UI patterns
- Implement **variant-based styling** with class-variance-authority
- Follow **mobile-first responsive design**
- Maintain **consistent spacing** using Tailwind's scale

### Styling Conventions
```typescript
// Use cva for component variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        cosmic: "bg-gradient-to-r from-purple-600 to-blue-600"
      }
    }
  }
)
```

### Color Palette
- **Primary**: Purple/violet tones for cosmic theme
- **Secondary**: Deep blues and teals
- **Accent**: Gold/amber for premium features
- **Neutral**: Grays for text and backgrounds

## 🔮 Domain Knowledge

### Astrology Concepts
- **Zodiac Signs**: 12 astrological signs (Aries, Taurus, Gemini, etc.)
- **Houses**: 12 astrological houses representing life areas
- **Planets**: Celestial bodies influencing personality and events
- **Aspects**: Angular relationships between planets
- **Transits**: Current planetary movements affecting individuals

### Feature Categories
1. **Daily Horoscopes**: Personalized daily predictions
2. **Compatibility Analysis**: Relationship compatibility between signs
3. **Career Astrology**: Professional guidance based on birth charts
4. **Planetary Transits**: Current cosmic influences
5. **Ritual Generator**: Personalized spiritual practices

### User Journey
1. **Discovery**: Landing on hero section
2. **Engagement**: Trying free horoscope generator
3. **Conversion**: Purchasing tokens for premium features
4. **Retention**: Regular use of AI chat and personalized content

## 💻 Development Guidelines

### Code Style
- Use **TypeScript strictly** - no `any` types
- Implement **error boundaries** for React components
- Follow **React best practices** (hooks, context, state management)
- Use **descriptive variable names** related to astrology domain

### State Management
- **Local state**: useState for component-specific state
- **Form state**: react-hook-form for complex forms
- **Global state**: Context API for user authentication and tokens
- **Server state**: React Query for API data management

### Error Handling
```typescript
// Use error boundaries for component crashes
<ErrorBoundary fallback={<ErrorFallback />}>
  <HoroscopeGenerator />
</ErrorBoundary>

// Implement proper error states in components
const { data, error, isLoading } = useHoroscope()
if (error) return <ErrorState message={error.message} />
```

### Performance Considerations
- **Lazy load** components below the fold
- **Optimize images** with proper formats and sizes
- **Bundle splitting** for feature-specific code
- **Memoization** for expensive calculations

## 🚀 Deployment & CI/CD

### Build Process
- **Vite production build** with optimizations
- **Type checking** before deployment
- **Bundle analysis** to prevent size bloat
- **Lighthouse audits** for performance validation

### Quality Assurance
- All tests must pass before merge
- Coverage thresholds enforced (80%+ for new code)
- Security audit must show 0 vulnerabilities
- Bundle size must stay under limits (500kB JS, 100kB CSS)

## 📁 File Organization

### Component Structure
```typescript
// components/HoroscopeGenerator/index.tsx
export { HoroscopeGenerator } from './HoroscopeGenerator'

// components/HoroscopeGenerator/HoroscopeGenerator.tsx
interface HoroscopeGeneratorProps {
  onGenerate?: (horoscope: Horoscope) => void
}

export function HoroscopeGenerator({ onGenerate }: HoroscopeGeneratorProps) {
  // Implementation
}
```

### Hook Patterns
```typescript
// hooks/use-horoscope.ts
export function useHoroscope(sign: ZodiacSign, date: Date) {
  return useQuery({
    queryKey: ['horoscope', sign, date],
    queryFn: () => fetchHoroscope(sign, date)
  })
}
```

### Utility Functions
```typescript
// lib/astrology.ts
export function calculateCompatibility(sign1: ZodiacSign, sign2: ZodiacSign): number {
  // Astrological compatibility logic
}
```

## 🎯 Best Practices

### When Writing Code
1. **Start with types** - Define interfaces before implementation
2. **Write tests first** for critical business logic
3. **Use semantic HTML** for accessibility
4. **Implement loading states** for better UX
5. **Handle edge cases** gracefully

### When Reviewing Code
1. **Verify accessibility** compliance
2. **Check responsive design** on multiple screen sizes
3. **Validate error handling** scenarios
4. **Ensure proper TypeScript** usage
5. **Test user flows** end-to-end

### When Adding Features
1. **Update tests** for new functionality
2. **Maintain bundle size** limits
3. **Follow design system** patterns
4. **Document new APIs** and components
5. **Consider mobile experience** first

## 🛡️ Security & Privacy

### Data Protection
- **No sensitive data** in localStorage
- **Secure API communications** with proper headers
- **Input validation** on all user inputs
- **XSS prevention** through proper sanitization

### User Privacy
- **Minimal data collection** - only what's necessary
- **Clear privacy policy** link in footer
- **GDPR compliance** for EU users
- **Secure token handling** for payments

## 🌙 Brand Voice & Content

### Tone of Voice
- **Mystical yet accessible** - magical but not intimidating
- **Empowering and positive** - focus on growth and insight
- **Professional with warmth** - trustworthy but friendly
- **Inclusive and welcoming** - for all spiritual journeys

### Content Guidelines
- Use **cosmic and celestial metaphors**
- Avoid **fear-based predictions**
- Emphasize **personal growth** and **self-discovery**
- Keep **language clear** and **jargon-free**

---

*These instructions help Copilot understand the CosMind project's architecture, domain, and development practices to provide more relevant and accurate assistance.*