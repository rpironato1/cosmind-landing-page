import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Bell, BellSlash, Clock, Star, Sun, Moon } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface NotificationSettings {
  dailyHoroscope: boolean
  loveCompatibility: boolean
  careerGuidance: boolean
  lunarTransits: boolean
  preferredTime: string
}

interface DailyNotification {
  id: string
  title: string
  content: string
  type: 'horoscope' | 'love' | 'career' | 'lunar'
  timestamp: Date
  read: boolean
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useKV('notification-settings', {
    dailyHoroscope: true,
    loveCompatibility: false,
    careerGuidance: false,
    lunarTransits: false,
    preferredTime: '08:00'
  })
  const [notifications, setNotifications] = useKV('daily-notifications', [])
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    const unreadCount = notifications.filter((n: DailyNotification) => !n.read).length
    setHasUnread(unreadCount > 0)
  }, [notifications])

  const updateSetting = (key: keyof NotificationSettings, value: boolean | string) => {
    setSettings((current: NotificationSettings) => ({
      ...current,
      [key]: value
    }))
    toast.success('Configurações de notificação atualizadas ✨')
  }

  const generateDailyNotifications = async () => {
    if (!settings.dailyHoroscope) return

    try {
      const today = new Date().toLocaleDateString('pt-BR')
      
      // Check if we already have notifications for today
      const todayNotifications = notifications.filter((n: DailyNotification) => 
        new Date(n.timestamp).toLocaleDateString('pt-BR') === today
      )
      
      if (todayNotifications.length > 0) return

      const prompt = spark.llmPrompt`
        Gere uma notificação de horóscopo diário para hoje (${today}).
        Inclua:
        - Uma mensagem inspiradora geral
        - Dica do dia
        - Energia cósmica dominante
        
        Mantenha o tom místico e inspirador, máximo 100 palavras.
        Retorne apenas um objeto JSON com as chaves: title, content
      `

      const response = await spark.llm(prompt, 'gpt-4o', true)
      const notificationData = JSON.parse(response)

      const newNotification: DailyNotification = {
        id: Date.now().toString(),
        title: notificationData.title,
        content: notificationData.content,
        type: 'horoscope',
        timestamp: new Date(),
        read: false
      }

      setNotifications((current: DailyNotification[]) => [newNotification, ...current])
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notificationData.title, {
          body: notificationData.content,
          icon: '/favicon.ico'
        })
      }

    } catch (error) {
      console.error('Error generating daily notification:', error)
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        toast.success('Notificações habilitadas! Você receberá seus horóscops diários.')
        // Generate initial notification
        generateDailyNotifications()
      } else {
        toast.error('Permissão negada. Você pode ativar nas configurações do navegador.')
      }
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((current: DailyNotification[]) =>
      current.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications((current: DailyNotification[]) =>
      current.map(n => ({ ...n, read: true }))
    )
  }

  const clearNotifications = () => {
    setNotifications([])
    toast.success('Notificações limpas')
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'horoscope': return <Star size={16} className="text-primary" />
      case 'love': return <Sun size={16} className="text-accent" />
      case 'career': return <Clock size={16} className="text-secondary" />
      case 'lunar': return <Moon size={16} className="text-primary" />
      default: return <Bell size={16} className="text-muted-foreground" />
    }
  }

  // Check for daily notifications on load
  useEffect(() => {
    if (settings.dailyHoroscope) {
      generateDailyNotifications()
    }
  }, [settings.dailyHoroscope])

  return (
    <>
      {/* Notification Bell Icon */}
      <motion.div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Bell size={20} />
          {hasUnread && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
            />
          )}
        </Button>

        {/* Notification Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-96 max-w-[90vw] z-50"
            >
              <Card className="glass border-primary/20 shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Central de Notificações</CardTitle>
                      <CardDescription>Configurações e notificações cósmicas</CardDescription>
                    </div>
                    {notifications.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        Marcar todas como lidas
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Notification Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Configurações</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star size={16} className="text-primary" />
                          <span className="text-sm">Horóscopo Diário</span>
                        </div>
                        <Switch
                          checked={settings.dailyHoroscope}
                          onCheckedChange={(checked) => updateSetting('dailyHoroscope', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sun size={16} className="text-accent" />
                          <span className="text-sm">Compatibilidade Amorosa</span>
                        </div>
                        <Switch
                          checked={settings.loveCompatibility}
                          onCheckedChange={(checked) => updateSetting('loveCompatibility', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-secondary" />
                          <span className="text-sm">Orientações de Carreira</span>
                        </div>
                        <Switch
                          checked={settings.careerGuidance}
                          onCheckedChange={(checked) => updateSetting('careerGuidance', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Moon size={16} className="text-primary" />
                          <span className="text-sm">Trânsitos Lunares</span>
                        </div>
                        <Switch
                          checked={settings.lunarTransits}
                          onCheckedChange={(checked) => updateSetting('lunarTransits', checked)}
                        />
                      </div>
                    </div>

                    {/* Browser Notification Permission */}
                    {Notification.permission === 'default' && (
                      <Button
                        onClick={requestNotificationPermission}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Bell size={16} className="mr-2" />
                        Permitir Notificações do Navegador
                      </Button>
                    )}

                    {Notification.permission === 'denied' && (
                      <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-lg">
                        <BellSlash size={16} className="text-destructive" />
                        <span className="text-xs text-destructive">
                          Notificações bloqueadas. Ative nas configurações do navegador.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Recent Notifications */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Notificações Recentes</h4>
                      {notifications.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearNotifications}
                          className="text-xs text-muted-foreground"
                        >
                          Limpar
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Bell size={24} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Nenhuma notificação ainda</p>
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((notification: DailyNotification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              notification.read 
                                ? 'bg-background/50 border-border/50' 
                                : 'bg-primary/5 border-primary/20'
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-medium text-sm truncate">
                                    {notification.title}
                                  </h5>
                                  {!notification.read && (
                                    <Badge variant="secondary" className="text-xs">
                                      Nova
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {notification.content}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(notification.timestamp).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}