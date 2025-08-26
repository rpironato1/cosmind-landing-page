import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Coins, Star, Sparkles, Crown, Check, User, Lock } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { StripeCheckout } from '@/components/StripeCheckout'

interface TokenShopProps {
  onSectionClick?: (section: string) => void
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

export function TokenShop({ onSectionClick }: TokenShopProps = {}) {
  const [currentUser] = useKV<UserData | null>('current-user', null)
  const [users, setUsers] = useKV<UserData[]>('cosmind-users', [])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)

  const tokenPackages = [
    {
      id: 'starter',
      name: 'Pacote Iniciante',
      tokens: 10,
      price: 9.90,
      originalPrice: 19.90,
      icon: Star,
      popular: false,
      features: [
        '10 consultas astrológicas',
        'Horóscopo diário por 1 semana',
        'Análise de compatibilidade básica',
        'Suporte por email'
      ],
      gradient: 'from-secondary to-primary/50'
    },
    {
      id: 'premium',
      name: 'Pacote Premium',
      tokens: 50,
      price: 39.90,
      originalPrice: 99.90,
      icon: Sparkles,
      popular: true,
      features: [
        '50 consultas astrológicas',
        'Horóscopo diário por 1 mês',
        'Mapa astral completo',
        'Análise de compatibilidade premium',
        'Chat com IA mística 24/7',
        'Relatórios personalizados'
      ],
      gradient: 'from-primary to-accent'
    },
    {
      id: 'cosmic',
      name: 'Pacote Cósmico',
      tokens: 150,
      price: 99.90,
      originalPrice: 299.90,
      icon: Crown,
      popular: false,
      features: [
        '150 consultas astrológicas',
        'Horóscopo diário por 3 meses',
        'Mapa astral completo + sinastria',
        'Previsões anuais detalhadas',
        'Chat prioritário com IA mística',
        'Relatórios exclusivos',
        'Consultoria personalizada',
        'Acesso a funcionalidades beta'
      ],
      gradient: 'from-accent to-primary/70'
    }
  ]

  const handlePurchase = (pkg: any) => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para comprar tokens')
      return
    }
    setSelectedPackage(pkg)
    setShowCheckout(true)
  }

  const handlePurchaseComplete = (tokens: number) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, tokens: currentUser.tokens + tokens }
      
      // Update users array
      setUsers(currentUsers => 
        currentUsers.map(u => u.id === currentUser.id ? updatedUser : u)
      )
    }
    setShowCheckout(false)
    setSelectedPackage(null)
  }
      
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Erro no pagamento. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <section id="tokens" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Loja de{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Tokens Cósmicos
              </span>
            </h2>
            <p className="font-sans text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Adquira tokens para desbloquear consultas ilimitadas com nossa IA mística 
              e mergulhe profundamente nos segredos do cosmos.
            </p>
            
            {/* Current Balance */}
            {currentUser ? (
              <motion.div 
                className="flex items-center justify-center gap-3 mt-8 glass p-4 rounded-2xl w-fit mx-auto"
                whileHover={{ scale: 1.05 }}
              >
                <Coins size={24} className="text-accent" />
                <span className="font-display font-semibold text-xl">
                  Saldo Atual: {currentUser.tokens} tokens
                </span>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center justify-center gap-3 mt-8 glass p-4 rounded-2xl w-fit mx-auto bg-muted/50"
                whileHover={{ scale: 1.05 }}
              >
                <Lock size={24} className="text-muted-foreground" />
                <span className="font-sans font-medium text-muted-foreground">
                  Faça login para ver seu saldo
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Packages Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {tokenPackages.map((pkg, index) => {
              const IconComponent = pkg.icon
              const savings = ((pkg.originalPrice - pkg.price) / pkg.originalPrice * 100).toFixed(0)
              
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="relative"
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 text-sm font-medium">
                        🌟 Mais Popular
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`p-8 h-full transition-all duration-300 hover:shadow-xl relative overflow-hidden ${
                    pkg.popular 
                      ? 'border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5' 
                      : 'border-border/50 bg-card/50 backdrop-blur-sm'
                  }`}>
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${pkg.gradient} opacity-5`} />
                    
                    <div className="relative z-10">
                      <CardHeader className="text-center pb-8">
                        {/* Icon */}
                        <div className={`w-20 h-20 bg-gradient-to-br ${pkg.gradient} rounded-3xl mx-auto mb-6 flex items-center justify-center`}>
                          <IconComponent size={40} className="text-white" />
                        </div>
                        
                        {/* Package Name */}
                        <CardTitle className="font-display text-2xl mb-2">
                          {pkg.name}
                        </CardTitle>
                        
                        {/* Tokens */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <Coins size={20} className="text-accent" />
                          <span className="font-bold text-3xl">{pkg.tokens}</span>
                          <span className="text-muted-foreground">tokens</span>
                        </div>
                        
                        {/* Pricing */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-3xl font-bold">R$ {pkg.price.toFixed(2)}</span>
                            <span className="text-lg text-muted-foreground line-through">
                              R$ {pkg.originalPrice.toFixed(2)}
                            </span>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {savings}% de desconto
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        {/* Features */}
                        <div className="space-y-3">
                          {pkg.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start gap-3">
                              <Check size={16} className="text-primary mt-1 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Purchase Button */}
                        <Button
                          onClick={() => handlePurchase(pkg)}
                          disabled={isProcessing || !currentUser}
                          className={`w-full py-3 font-medium transition-all duration-300 ${
                            pkg.popular
                              ? 'bg-gradient-to-r from-primary to-accent hover:shadow-lg'
                              : 'bg-gradient-to-r from-secondary to-primary/70'
                          }`}
                          size="lg"
                        >
                          {!currentUser ? (
                            <>
                              <User className="w-4 h-4 mr-2" />
                              Faça login para comprar
                            </>
                          ) : isProcessing ? (
                            'Processando...'
                          ) : (
                            'Adquirir Agora'
                          )}
                        </Button>
                        
                        {/* Value Proposition */}
                        <div className="text-center text-xs text-muted-foreground">
                          R$ {(pkg.price / pkg.tokens).toFixed(2)} por token
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
          
          {/* Additional Info */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-16 space-y-4"
          >
            <p className="text-muted-foreground">
              ✨ Tokens nunca expiram • 🔒 Pagamento 100% seguro • 💫 Satisfação garantida
            </p>
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <span>💳 Cartão de Crédito</span>
              <span>🏦 PIX</span>
              <span>💰 Boleto</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Stripe Checkout Modal */}
      {currentUser && (
        <StripeCheckout
          isOpen={showCheckout}
          onClose={() => {
            setShowCheckout(false)
            setSelectedPackage(null)
          }}
          selectedPackage={selectedPackage}
          user={currentUser}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}
    </section>
  )
}