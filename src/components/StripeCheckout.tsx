import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, 
  Star, 
  Crown, 
  Gift, 
  Lightning,
  Shield,
  Check,
  X
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

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

interface TokenPackage {
  id: string
  name: string
  tokens: number
  price: number
  originalPrice: number
  discount: number
  popular?: boolean
  description: string
  features: string[]
}

interface StripeCheckoutProps {
  isOpen: boolean
  onClose: () => void
  selectedPackage?: TokenPackage
  user: UserData | null
  onPurchaseComplete: (tokens: number) => void
}

interface PaymentMethod {
  type: 'card' | 'pix' | 'boleto'
  icon: React.ReactNode
  name: string
  description: string
}

interface TokenPurchase {
  id: string
  package: string
  tokens: number
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed'
}

const tokenPackages: TokenPackage[] = [
  {
    id: 'starter',
    name: 'Pacote Iniciante',
    tokens: 10,
    price: 9.90,
    originalPrice: 19.90,
    discount: 50,
    description: 'Perfeito para começar sua jornada cósmica',
    features: ['10 consultas completas', 'Horóscopo diário', 'Suporte básico']
  },
  {
    id: 'premium',
    name: 'Pacote Premium',
    tokens: 50,
    price: 39.90,
    originalPrice: 99.90,
    discount: 60,
    popular: true,
    description: 'Ideal para exploradores do cosmos',
    features: ['50 consultas completas', 'Análises avançadas', 'Suporte prioritário', 'Relatórios detalhados']
  },
  {
    id: 'cosmic',
    name: 'Pacote Cósmico',
    tokens: 150,
    price: 99.90,
    originalPrice: 299.90,
    discount: 67,
    description: 'Para os verdadeiros mestres da astrologia',
    features: ['150 consultas completas', 'Acesso total', 'Suporte VIP', 'Análises exclusivas', 'Consultor dedicado']
  }
]

const paymentMethods: PaymentMethod[] = [
  {
    type: 'card',
    icon: <CreditCard className="w-5 h-5" />,
    name: 'Cartão de Crédito',
    description: 'Aprovação instantânea'
  },
  {
    type: 'pix',
    icon: <Lightning className="w-5 h-5" />,
    name: 'PIX',
    description: 'Aprovação em até 1 hora'
  },
  {
    type: 'boleto',
    icon: <Shield className="w-5 h-5" />,
    name: 'Boleto Bancário',
    description: 'Aprovação em 1-2 dias úteis'
  }
]

export function StripeCheckout({ isOpen, onClose, selectedPackage, user, onPurchaseComplete }: StripeCheckoutProps) {
  const [tokenPurchases, setTokenPurchases] = useKV<TokenPurchase[]>(`purchases-${user?.id || 'guest'}`, [])
  const [currentPackage, setCurrentPackage] = useState<TokenPackage | null>(selectedPackage || null)
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'pix' | 'boleto'>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'package' | 'payment' | 'checkout'>('package')
  
  // Early return if user is null
  if (!user) {
    return null
  }
  
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    cpf: ''
  })

  const handlePackageSelect = (pkg: TokenPackage) => {
    setCurrentPackage(pkg)
    setStep('payment')
  }

  const handlePaymentSelect = (method: 'card' | 'pix' | 'boleto') => {
    setSelectedPayment(method)
    setStep('checkout')
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const processPayment = async () => {
    if (!currentPackage) return
    
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create purchase record
      const purchase: TokenPurchase = {
        id: Date.now().toString(),
        package: currentPackage.name,
        tokens: currentPackage.tokens,
        amount: currentPackage.price,
        date: new Date().toISOString(),
        status: 'completed'
      }
      
      setTokenPurchases(currentPurchases => [...currentPurchases, purchase])
      
      // Update user tokens
      onPurchaseComplete(currentPackage.tokens)
      
      toast.success(`Compra realizada com sucesso! +${currentPackage.tokens} tokens adicionados! ✨`)
      onClose()
      
    } catch (error) {
      toast.error('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderPackageSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-display font-semibold mb-2">Escolha seu Pacote Cósmico</h3>
        <p className="text-muted-foreground">Selecione o pacote que melhor atende suas necessidades místicas</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tokenPackages.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${pkg.popular ? 'ring-2 ring-accent' : ''}`}
            onClick={() => handlePackageSelect(pkg)}
          >
            <CardHeader className="text-center">
              {pkg.popular && (
                <Badge className="mx-auto mb-2 bg-accent text-accent-foreground">
                  <Crown className="w-3 h-3 mr-1" />
                  Mais Popular
                </Badge>
              )}
              <CardTitle className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                {pkg.name}
              </CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <div className="text-3xl font-bold text-accent">R$ {pkg.price.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground line-through">
                  R$ {pkg.originalPrice.toFixed(2)}
                </div>
                <Badge variant="secondary" className="mt-1">
                  {pkg.discount}% OFF
                </Badge>
              </div>
              
              <div className="space-y-2 mb-6">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                <Gift className="w-4 h-4 mr-2" />
                {pkg.tokens} Tokens
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderPaymentSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-display font-semibold mb-2">Escolha a Forma de Pagamento</h3>
        <p className="text-muted-foreground">Como você gostaria de pagar?</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {paymentMethods.map((method) => (
          <Card 
            key={method.type}
            className="cursor-pointer transition-all hover:shadow-lg"
            onClick={() => handlePaymentSelect(method.type)}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="text-primary">
                {method.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{method.name}</h4>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
              <Button variant="outline" size="sm">
                Selecionar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderCheckout = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-display font-semibold mb-2">Finalizar Compra</h3>
        <p className="text-muted-foreground">Complete os dados para processar seu pagamento</p>
      </div>
      
      {/* Order Summary */}
      {currentPackage && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span>{currentPackage.name}</span>
              <span>{currentPackage.tokens} tokens</span>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span>R$ {currentPackage.price.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Payment Form */}
      {selectedPayment === 'card' && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Cartão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Número do Cartão</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={cardData.number}
                onChange={(e) => setCardData(prev => ({ 
                  ...prev, 
                  number: formatCardNumber(e.target.value) 
                }))}
                maxLength={19}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="card-name">Nome no Cartão</Label>
              <Input
                id="card-name"
                placeholder="João Silva"
                value={cardData.name}
                onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="card-expiry">Validade</Label>
                <Input
                  id="card-expiry"
                  placeholder="MM/AA"
                  value={cardData.expiry}
                  onChange={(e) => setCardData(prev => ({ 
                    ...prev, 
                    expiry: formatExpiry(e.target.value) 
                  }))}
                  maxLength={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="card-cvv">CVV</Label>
                <Input
                  id="card-cvv"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={(e) => setCardData(prev => ({ 
                    ...prev, 
                    cvv: e.target.value.replace(/\D/g, '') 
                  }))}
                  maxLength={4}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="card-cpf">CPF</Label>
              <Input
                id="card-cpf"
                placeholder="000.000.000-00"
                value={cardData.cpf}
                onChange={(e) => setCardData(prev => ({ ...prev, cpf: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      {selectedPayment === 'pix' && (
        <Card>
          <CardContent className="text-center py-8">
            <Lightning className="w-16 h-16 mx-auto mb-4 text-accent" />
            <h4 className="text-lg font-medium mb-2">Pagamento via PIX</h4>
            <p className="text-muted-foreground mb-4">
              Após confirmar, você receberá o código PIX para pagamento
            </p>
            <Badge variant="secondary">Aprovação em até 1 hora</Badge>
          </CardContent>
        </Card>
      )}
      
      {selectedPayment === 'boleto' && (
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h4 className="text-lg font-medium mb-2">Boleto Bancário</h4>
            <p className="text-muted-foreground mb-4">
              Após confirmar, você receberá o boleto para pagamento
            </p>
            <Badge variant="secondary">Aprovação em 1-2 dias úteis</Badge>
          </CardContent>
        </Card>
      )}
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setStep('payment')} className="flex-1">
          Voltar
        </Button>
        <Button onClick={processPayment} disabled={isProcessing} className="flex-1">
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
            />
          ) : (
            <CreditCard className="w-4 h-4 mr-2" />
          )}
          {isProcessing ? 'Processando...' : 'Finalizar Compra'}
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-center flex items-center justify-center gap-2">
            <Star className="text-accent" weight="fill" />
            Loja de Tokens Cósmicos
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[70vh] overflow-y-auto">
          {step === 'package' && renderPackageSelection()}
          {step === 'payment' && renderPaymentSelection()}
          {step === 'checkout' && renderCheckout()}
        </div>
      </DialogContent>
    </Dialog>
  )
}