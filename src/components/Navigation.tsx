import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { List, X } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { NotificationCenter } from '@/components/NotificationCenter'
import { UserProfileCustomization } from '@/components/UserProfileCustomization'

interface NavigationProps {
  onSectionClick: (section: string) => void
}

export function Navigation({ onSectionClick }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    { label: 'Início', section: 'hero' },
    { label: 'Sobre', section: 'about' },
    { label: 'Horóscopo', section: 'horoscope' },
    { label: 'Histórico', section: 'history' },
    { label: 'Compatibilidade', section: 'compatibility' },
    { label: 'Rituais', section: 'ritual-generator' },
    { label: 'Carreira', section: 'career-astrology' },
    { label: 'Trânsitos', section: 'planetary-transits' },
    { label: 'Serviços', section: 'services' },
    { label: 'Tokens', section: 'tokens' },
    { label: 'Contato', section: 'contact' }
  ]

  const handleNavClick = (section: string) => {
    if (section === 'chat') {
      // Trigger chat bot opening by dispatching a custom event
      window.dispatchEvent(new CustomEvent('openChatBot'))
    } else {
      onSectionClick(section)
    }
    setIsMenuOpen(false)
  }

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="font-display font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer"
            onClick={() => handleNavClick('hero')}
          >
            CosMind
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigationItems.map((item) => (
              <motion.button
                key={item.section}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={() => handleNavClick(item.section)}
                className="font-sans text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </motion.button>
            ))}
            <Button 
              onClick={() => handleNavClick('contact')}
              className="bg-gradient-to-r from-accent to-primary text-white font-medium px-6"
            >
              Começar Agora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <List size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 py-4 border-t border-border/50"
            >
              <div className="flex flex-col gap-4">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.section}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick(item.section)}
                    className="font-sans text-left py-2 text-foreground/80 hover:text-primary transition-colors duration-200"
                  >
                    {item.label}
                  </motion.button>
                ))}
                <Button 
                  onClick={() => handleNavClick('contact')}
                  className="bg-gradient-to-r from-accent to-primary text-white font-medium mt-2"
                >
                  Começar Agora
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}