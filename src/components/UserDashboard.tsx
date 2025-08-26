import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Star, 
  Clock, 
  CreditCard, 
  Gift, 
  TrendUp,
  Calendar,
  Crown,
  Sparkle,
  Lightning,
  Heart,
  Shield
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useKV } from '@github/spark/hooks'

interface UserDashboardProps {
  user: UserData
  onClose: () => void
  onOpenTokenShop: () => void
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

interface UserActivity {
  id: string
  type: 'horoscope' | 'compatibility' | 'ritual' | 'career' | 'transit'
  title: string
  date: string
  tokensUsed: number
}

interface TokenPurchase {
  id: string
  package: string
  tokens: number
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed'
}

export function UserDashboard({ user, onClose, onOpenTokenShop }: UserDashboardProps) {
  const [userActivity, setUserActivity] = useKV<UserActivity[]>(`activity-${user.id}`, [])
  const [tokenPurchases, setTokenPurchases] = useKV<TokenPurchase[]>(`purchases-${user.id}`, [])
  const [activeTab, setActiveTab] = useState('overview')

  const memberSince = new Date(user.createdAt).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  })

  const totalTokensUsed = userActivity.reduce((sum, activity) => sum + activity.tokensUsed, 0)
  const totalSpent = tokenPurchases.reduce((sum, purchase) => 
    purchase.status === 'completed' ? sum + purchase.amount : sum, 0
  )

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'horoscope': return <Star className="w-4 h-4" />
      case 'compatibility': return <Heart className="w-4 h-4" />
      case 'ritual': return <Sparkle className="w-4 h-4" />
      case 'career': return <TrendUp className="w-4 h-4" />
      case 'transit': return <Lightning className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'horoscope': return 'bg-primary/10 text-primary'
      case 'compatibility': return 'bg-pink-500/10 text-pink-500'
      case 'ritual': return 'bg-purple-500/10 text-purple-500'
      case 'career': return 'bg-green-500/10 text-green-500'
      case 'transit': return 'bg-orange-500/10 text-orange-500'
      default: return 'bg-primary/10 text-primary'
    }
  }

  const getSubscriptionLevel = () => {
    if (user.isSubscribed) {
      return {
        level: 'Premium',
        color: 'bg-gradient-to-r from-amber-500 to-orange-500',
        icon: <Crown className="w-4 h-4" />,
        benefits: ['Consultas ilimitadas', 'Suporte prioritário', 'Análises exclusivas']
      }
    } else if (user.tokens > 50) {
      return {
        level: 'Explorador',
        color: 'bg-gradient-to-r from-blue-500 to-purple-500',
        icon: <Star className="w-4 h-4" />,
        benefits: ['Acesso a recursos avançados', 'Análises detalhadas']
      }
    } else {
      return {
        level: 'Iniciante',
        color: 'bg-gradient-to-r from-gray-400 to-gray-500',
        icon: <User className="w-4 h-4" />,
        benefits: ['Horóscopo básico', 'Recursos limitados']
      }
    }
  }

  const subscriptionInfo = getSubscriptionLevel()

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-cosmic p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-semibold">{user.name}</h2>
                <p className="text-muted-foreground">{user.zodiacSign} • Membro desde {memberSince}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* User Level Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white ${subscriptionInfo.color}`}>
            {subscriptionInfo.icon}
            <span className="font-medium">{subscriptionInfo.level}</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="activity">Atividades</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="subscription">Assinatura</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tokens Disponíveis</CardTitle>
                    <Star className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.tokens}</div>
                    <p className="text-xs text-muted-foreground">
                      Créditos para consultas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Consultas Realizadas</CardTitle>
                    <Clock className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userActivity.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Total de análises
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tokens Utilizados</CardTitle>
                    <TrendUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalTokensUsed}</div>
                    <p className="text-xs text-muted-foreground">
                      Créditos consumidos
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>Suas últimas consultas astrológicas</CardDescription>
                </CardHeader>
                <CardContent>
                  {userActivity.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma consulta realizada ainda</p>
                      <p className="text-sm">Explore nossos serviços místicos!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userActivity.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                              {getActivityIcon(activity.type)}
                            </div>
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(activity.date).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">{activity.tokensUsed} tokens</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico Completo</CardTitle>
                  <CardDescription>Todas as suas consultas astrológicas</CardDescription>
                </CardHeader>
                <CardContent>
                  {userActivity.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Nenhuma atividade encontrada</h3>
                      <p>Comece sua jornada cósmica realizando sua primeira consulta!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${getActivityColor(activity.type)}`}>
                              {getActivityIcon(activity.type)}
                            </div>
                            <div>
                              <h4 className="font-medium">{activity.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(activity.date).toLocaleDateString('pt-BR', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="mb-1">
                              {activity.tokensUsed} tokens
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tokens" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-accent" />
                      Saldo Atual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-accent mb-2">{user.tokens}</div>
                    <p className="text-muted-foreground mb-4">Tokens disponíveis para consultas</p>
                    <Button onClick={onOpenTokenShop} className="w-full">
                      <Gift className="w-4 h-4 mr-2" />
                      Comprar Mais Tokens
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendUp className="w-5 h-5 text-green-500" />
                      Estatísticas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total gasto:</span>
                      <span className="font-medium">R$ {totalSpent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tokens utilizados:</span>
                      <span className="font-medium">{totalTokensUsed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compras realizadas:</span>
                      <span className="font-medium">{tokenPurchases.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Purchase History */}
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Compras</CardTitle>
                  <CardDescription>Suas transações de tokens</CardDescription>
                </CardHeader>
                <CardContent>
                  {tokenPurchases.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma compra realizada ainda</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tokenPurchases.map((purchase) => (
                        <div key={purchase.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{purchase.package}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(purchase.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">R$ {purchase.amount.toFixed(2)}</p>
                            <Badge 
                              variant={purchase.status === 'completed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {purchase.status === 'completed' ? 'Concluído' : 'Pendente'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {subscriptionInfo.icon}
                    Status da Assinatura
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`px-4 py-2 rounded-full text-white ${subscriptionInfo.color}`}>
                      {subscriptionInfo.level}
                    </div>
                    {user.isSubscribed && (
                      <Badge variant="default" className="bg-green-500">
                        <Shield className="w-3 h-3 mr-1" />
                        Ativo
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <h4 className="font-medium">Benefícios inclusos:</h4>
                    <ul className="space-y-1">
                      {subscriptionInfo.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Star className="w-3 h-3 text-accent" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {!user.isSubscribed && (
                    <Button className="w-full" onClick={onOpenTokenShop}>
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade para Premium
                    </Button>
                  )}
                </CardContent>
              </Card>

              {user.isSubscribed && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gerenciar Assinatura</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Plano atual:</span>
                      <Badge variant="default">{user.subscriptionTier || 'Premium'}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Próxima cobrança:</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <Button variant="outline" className="w-full">
                      Alterar Plano
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}