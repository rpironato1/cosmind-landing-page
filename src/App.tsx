import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Toaster } from '@/components/ui/sonner'
import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/HeroSection'
import { AboutSection } from '@/components/AboutSection'
import { ServicesSection } from '@/components/ServicesSection'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'
import { SplashCursor } from '@/components/SplashCursor'

function App() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navHeight = 80
      const elementPosition = element.offsetTop - navHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  const scrollToContact = () => {
    scrollToSection('contact')
  }

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav')
      if (nav) {
        if (window.scrollY > 100) {
          nav.classList.add('backdrop-blur-xl')
        } else {
          nav.classList.remove('backdrop-blur-xl')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Navigation onSectionClick={scrollToSection} />
      
      <main>
        <HeroSection onCtaClick={scrollToContact} />
        <AboutSection />
        <ServicesSection onContactClick={scrollToContact} />
        <ContactSection />
      </main>
      
      <Footer onSectionClick={scrollToSection} />
      
      <SplashCursor />
      
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'oklch(1 0 0)',
            border: '1px solid oklch(0.9 0.05 290)',
            color: 'oklch(0.15 0 0)',
          },
        }}
      />
    </div>
  )
}

export default App