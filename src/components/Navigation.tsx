import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  List,
  X,
  User,
  Star,
  SignOut,
  Shield,
  Megaphone,
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { NotificationCenter } from '@/components/NotificationCenter'
import { UserProfileCustomization } from '@/components/UserProfileCustomization'
import { AuthModal } from '@/components/AuthModal'
import { UserDashboard } from '@/components/UserDashboard'
import { StripeCheckout } from '@/components/StripeCheckout'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'

interface NavigationProps {
  onSectionClick: (section: string) => void
}

interface UserData {
  id: string
  email: string
  name: string
  zodiacSign: string
  birthDate: string
  tokens: number
  createdAt: string
  isSubscribed: boolean
  subscriptionTier?: string
}

export function Navigation({ onSectionClick }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useKV<UserData | null>(
    'current-user',
    null
  )
  const [users, setUsers] = useKV<UserData[]>('cosmind-users', [])
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showTokenShop, setShowTokenShop] = useState(false)

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
    { label: 'Contato', section: 'contact' },
  ]

  const adminItems = [
    { label: 'Admin', href: '/admin', icon: Shield },
    { label: 'Publicidade', href: '/advertising', icon: Megaphone },
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

  const handleAuth = (user: UserData) => {
    setCurrentUser(user)
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsMenuOpen(false)
  }

  const handleTokenPurchase = (tokens: number) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        tokens: currentUser.tokens + tokens,
      }
      setCurrentUser(updatedUser)

      // Update user in users array
      setUsers(currentUsers =>
        currentUsers.map(u => (u.id === currentUser.id ? updatedUser : u))
      )
    }
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
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
            {navigationItems.map(item => (
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

            {/* Admin Navigation */}
            {adminItems.map(item => (
              <Link key={item.href} to={item.href}>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className="flex items-center gap-2 font-sans text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </motion.button>
              </Link>
            ))}

            {/* User Authentication */}
            <div className="flex items-center gap-4">
              <NotificationCenter />

              {currentUser ? (
                <>
                  {/* Token Display */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20"
                  >
                    <Star className="w-4 h-4 text-accent" weight="fill" />
                    <span className="text-sm font-medium">
                      {currentUser.tokens}
                    </span>
                  </motion.div>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">
                          {currentUser.name.split(' ')[0]}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setShowDashboard(true)}>
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowTokenShop(true)}>
                        <Star className="w-4 h-4 mr-2" />
                        Comprar Tokens
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600"
                      >
                        <SignOut className="w-4 h-4 mr-2" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-accent to-primary text-white font-medium px-6"
                >
                  Entrar
                </Button>
              )}
            </div>
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
                {navigationItems.map(item => (
                  <motion.button
                    key={item.section}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick(item.section)}
                    className="font-sans text-left py-2 text-foreground/80 hover:text-primary transition-colors duration-200"
                  >
                    {item.label}
                  </motion.button>
                ))}

                {/* Admin Mobile Navigation */}
                <div className="border-t border-border/30 pt-4">
                  {adminItems.map(item => (
                    <Link key={item.href} to={item.href}>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 font-sans text-left py-2 text-foreground/80 hover:text-primary transition-colors duration-200 w-full"
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </motion.button>
                    </Link>
                  ))}
                </div>

                {currentUser ? (
                  <>
                    <div className="flex items-center justify-between py-2 px-3 bg-accent/10 rounded-lg">
                      <span className="text-sm font-medium">
                        {currentUser.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        {currentUser.tokens}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => setShowDashboard(true)}
                      variant="outline"
                      className="justify-start"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button
                      onClick={() => setShowTokenShop(true)}
                      variant="outline"
                      className="justify-start"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Comprar Tokens
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="justify-start text-red-600"
                    >
                      <SignOut className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-gradient-to-r from-accent to-primary text-white font-medium mt-2"
                  >
                    Entrar / Cadastrar
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />

      {/* User Dashboard */}
      {showDashboard && currentUser && (
        <UserDashboard
          user={currentUser}
          onClose={() => setShowDashboard(false)}
          onOpenTokenShop={() => {
            setShowDashboard(false)
            setShowTokenShop(true)
          }}
        />
      )}

      {/* Token Shop */}
      {currentUser && (
        <StripeCheckout
          isOpen={showTokenShop}
          onClose={() => setShowTokenShop(false)}
          user={currentUser}
          onPurchaseComplete={handleTokenPurchase}
        />
      )}
    </motion.nav>
  )
}
