import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Save,
  RefreshCw,
  Globe,
  Shield,
  Palette,
  Bell,
  Database,
  Key,
  Mail,
  DollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface SystemConfig {
  // Site Settings
  siteName: string
  siteDescription: string
  siteUrl: string
  maintenanceMode: boolean

  // Token Settings
  freeTokens: number
  tokenPackages: Array<{
    name: string
    tokens: number
    price: number
  }>

  // Email Settings
  emailEnabled: boolean
  smtpHost: string
  smtpPort: number
  smtpUser: string

  // Security Settings
  sessionTimeout: number
  maxLoginAttempts: number
  requireEmailVerification: boolean

  // AI Settings
  openaiApiKey: string
  maxRequestsPerUser: number

  // Notification Settings
  pushNotifications: boolean
  emailNotifications: boolean

  // Theme Settings
  primaryColor: string
  accentColor: string
}

const defaultConfig: SystemConfig = {
  siteName: 'CosMind - Portal Astrológico',
  siteDescription: 'Sua jornada cósmica personalizada com IA',
  siteUrl: 'https://cosmind.com.br',
  maintenanceMode: false,
  freeTokens: 5,
  tokenPackages: [
    { name: 'Pacote Iniciante', tokens: 10, price: 19.9 },
    { name: 'Pacote Explorador', tokens: 50, price: 79.9 },
    { name: 'Pacote Místico', tokens: 150, price: 199.9 },
  ],
  emailEnabled: true,
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUser: 'noreply@cosmind.com.br',
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  requireEmailVerification: true,
  openaiApiKey: '',
  maxRequestsPerUser: 100,
  pushNotifications: true,
  emailNotifications: true,
  primaryColor: '#8b5cf6',
  accentColor: '#f59e0b',
}

export function SystemConfiguration() {
  const [config, setConfig] = useKV<SystemConfig>(
    'system-config',
    defaultConfig
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Configurações salvas com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
    }
  }

  const updateConfig = (field: keyof SystemConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const updateTokenPackage = (index: number, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      tokenPackages: prev.tokenPackages.map((pkg, i) =>
        i === index ? { ...pkg, [field]: value } : pkg
      ),
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Configurações do Sistema
              </CardTitle>
              <CardDescription>
                Parâmetros globais e configurações da plataforma CosMind
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setConfig(defaultConfig)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Restaurar Padrão
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Configuration Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="ai">IA</TabsTrigger>
          <TabsTrigger value="theme">Tema</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nome do Site</Label>
                  <Input
                    id="siteName"
                    value={config.siteName}
                    onChange={e => updateConfig('siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">URL do Site</Label>
                  <Input
                    id="siteUrl"
                    value={config.siteUrl}
                    onChange={e => updateConfig('siteUrl', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Descrição do Site</Label>
                <Textarea
                  id="siteDescription"
                  value={config.siteDescription}
                  onChange={e =>
                    updateConfig('siteDescription', e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="maintenance">Modo de Manutenção</Label>
                  <p className="text-sm text-muted-foreground">
                    Habilita página de manutenção para todos os usuários
                  </p>
                </div>
                <Switch
                  id="maintenance"
                  checked={config.maintenanceMode}
                  onCheckedChange={checked =>
                    updateConfig('maintenanceMode', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Sistema de Tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="freeTokens">
                  Tokens Gratuitos (Novos Usuários)
                </Label>
                <Input
                  id="freeTokens"
                  type="number"
                  value={config.freeTokens}
                  onChange={e =>
                    updateConfig('freeTokens', parseInt(e.target.value))
                  }
                  className="w-32"
                />
              </div>

              <div className="space-y-4">
                <Label>Pacotes de Tokens</Label>
                {config.tokenPackages.map((pkg, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 p-4 border rounded-lg"
                  >
                    <div className="space-y-2">
                      <Label>Nome do Pacote</Label>
                      <Input
                        value={pkg.name}
                        onChange={e =>
                          updateTokenPackage(index, 'name', e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tokens</Label>
                      <Input
                        type="number"
                        value={pkg.tokens}
                        onChange={e =>
                          updateTokenPackage(
                            index,
                            'tokens',
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Preço (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={pkg.price}
                        onChange={e =>
                          updateTokenPackage(
                            index,
                            'price',
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Configurações de Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Email Habilitado</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite o envio de emails pelo sistema
                  </p>
                </div>
                <Switch
                  checked={config.emailEnabled}
                  onCheckedChange={checked =>
                    updateConfig('emailEnabled', checked)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">Host SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={config.smtpHost}
                    onChange={e => updateConfig('smtpHost', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Porta SMTP</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={config.smtpPort}
                    onChange={e =>
                      updateConfig('smtpPort', parseInt(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpUser">Usuário SMTP</Label>
                <Input
                  id="smtpUser"
                  value={config.smtpUser}
                  onChange={e => updateConfig('smtpUser', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Timeout de Sessão (minutos)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={config.sessionTimeout}
                    onChange={e =>
                      updateConfig('sessionTimeout', parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">
                    Máximo Tentativas de Login
                  </Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={config.maxLoginAttempts}
                    onChange={e =>
                      updateConfig('maxLoginAttempts', parseInt(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Verificação de Email Obrigatória</Label>
                  <p className="text-sm text-muted-foreground">
                    Usuários devem verificar email antes de usar a plataforma
                  </p>
                </div>
                <Switch
                  checked={config.requireEmailVerification}
                  onCheckedChange={checked =>
                    updateConfig('requireEmailVerification', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Configurações de IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openaiApiKey">Chave API OpenAI</Label>
                <Input
                  id="openaiApiKey"
                  type="password"
                  value={config.openaiApiKey}
                  onChange={e => updateConfig('openaiApiKey', e.target.value)}
                  placeholder="sk-..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxRequestsPerUser">
                  Máximo Requisições por Usuário/Dia
                </Label>
                <Input
                  id="maxRequestsPerUser"
                  type="number"
                  value={config.maxRequestsPerUser}
                  onChange={e =>
                    updateConfig('maxRequestsPerUser', parseInt(e.target.value))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Configurações de Tema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={e =>
                        updateConfig('primaryColor', e.target.value)
                      }
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={e =>
                        updateConfig('primaryColor', e.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Cor de Destaque</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={config.accentColor}
                      onChange={e =>
                        updateConfig('accentColor', e.target.value)
                      }
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.accentColor}
                      onChange={e =>
                        updateConfig('accentColor', e.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Notificações Push</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir notificações push no navegador
                    </p>
                  </div>
                  <Switch
                    checked={config.pushNotifications}
                    onCheckedChange={checked =>
                      updateConfig('pushNotifications', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar notificações por email aos usuários
                    </p>
                  </div>
                  <Switch
                    checked={config.emailNotifications}
                    onCheckedChange={checked =>
                      updateConfig('emailNotifications', checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

export default SystemConfiguration
