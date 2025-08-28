import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Grid3X3,
  Plus,
  Settings,
  BarChart3,
  Monitor,
  Smartphone,
  Eye,
  Edit3,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useKV } from '@github/spark/hooks'

interface AdSlot {
  id: string
  name: string
  position: 'header' | 'sidebar' | 'footer' | 'content' | 'popup'
  dimensions: {
    width: number
    height: number
  }
  status: 'active' | 'inactive' | 'reserved'
  currentAd?: {
    name: string
    advertiser: string
    revenue: number
  }
  impressionsToday: number
  clicksToday: number
  fillRate: number
  avgCPM: number
  device: 'all' | 'desktop' | 'mobile'
}

// Mock data
const mockAdSlots: AdSlot[] = [
  {
    id: '1',
    name: 'Header Principal',
    position: 'header',
    dimensions: { width: 728, height: 90 },
    status: 'active',
    currentAd: {
      name: 'Campanha Horóscopo Premium',
      advertiser: 'CosMind',
      revenue: 45.8,
    },
    impressionsToday: 2340,
    clicksToday: 34,
    fillRate: 89,
    avgCPM: 2.5,
    device: 'all',
  },
  {
    id: '2',
    name: 'Sidebar Direita',
    position: 'sidebar',
    dimensions: { width: 300, height: 250 },
    status: 'active',
    currentAd: {
      name: 'Anúncio Compatibilidade',
      advertiser: 'Parceiro Místico',
      revenue: 23.4,
    },
    impressionsToday: 1560,
    clicksToday: 18,
    fillRate: 76,
    avgCPM: 1.8,
    device: 'desktop',
  },
  {
    id: '3',
    name: 'Mobile Banner',
    position: 'content',
    dimensions: { width: 320, height: 50 },
    status: 'active',
    impressionsToday: 4200,
    clicksToday: 67,
    fillRate: 94,
    avgCPM: 1.2,
    device: 'mobile',
  },
  {
    id: '4',
    name: 'Footer Banner',
    position: 'footer',
    dimensions: { width: 728, height: 90 },
    status: 'inactive',
    impressionsToday: 0,
    clicksToday: 0,
    fillRate: 0,
    avgCPM: 0,
    device: 'all',
  },
]

export function AdSlotManagement() {
  const [adSlots, setAdSlots] = useKV<AdSlot[]>(
    'advertising-slots',
    mockAdSlots
  )
  const [selectedSlot, setSelectedSlot] = useState<AdSlot | null>(null)

  const getPositionIcon = (position: string) => {
    switch (position) {
      case 'header':
        return '🔝'
      case 'sidebar':
        return '📋'
      case 'footer':
        return '🔻'
      case 'content':
        return '📄'
      case 'popup':
        return '🪟'
      default:
        return '📍'
    }
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop':
        return <Monitor className="w-4 h-4" />
      case 'mobile':
        return <Smartphone className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500'
      case 'inactive':
        return 'bg-gray-500/10 text-gray-500'
      case 'reserved':
        return 'bg-orange-500/10 text-orange-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  const totalRevenue = adSlots.reduce(
    (sum, slot) => sum + (slot.currentAd?.revenue || 0),
    0
  )

  const totalImpressions = adSlots.reduce(
    (sum, slot) => sum + slot.impressionsToday,
    0
  )

  const totalClicks = adSlots.reduce((sum, slot) => sum + slot.clicksToday, 0)

  const avgFillRate =
    adSlots.length > 0
      ? adSlots.reduce((sum, slot) => sum + slot.fillRate, 0) / adSlots.length
      : 0

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
                <Grid3X3 className="w-5 h-5 text-primary" />
                Slots de Anúncios
              </CardTitle>
              <CardDescription>
                Espaços publicitários gerenciáveis na plataforma
              </CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Slot
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Receita Hoje
                </p>
                <p className="text-2xl font-bold">
                  R$ {totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Impressões
                </p>
                <p className="text-2xl font-bold">
                  {totalImpressions.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cliques
                </p>
                <p className="text-2xl font-bold">{totalClicks}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Grid3X3 className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Fill Rate Médio
                </p>
                <p className="text-2xl font-bold">{avgFillRate.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ad Slots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {adSlots.map(slot => (
          <Card key={slot.id} className="glass">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Slot Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getPositionIcon(slot.position)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{slot.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {getDeviceIcon(slot.device)}
                        <span>
                          {slot.dimensions.width} x {slot.dimensions.height}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(slot.status)}>
                    {slot.status}
                  </Badge>
                </div>

                {/* Current Ad Info */}
                {slot.currentAd && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">
                        {slot.currentAd.name}
                      </p>
                      <p className="text-sm text-green-500 font-medium">
                        R$ {slot.currentAd.revenue.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Por: {slot.currentAd.advertiser}
                    </p>
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">
                      {slot.impressionsToday.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Impressões</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-500">
                      {slot.clicksToday}
                    </p>
                    <p className="text-xs text-muted-foreground">Cliques</p>
                  </div>
                </div>

                {/* Fill Rate */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Fill Rate</span>
                    <span className="font-medium">{slot.fillRate}%</span>
                  </div>
                  <Progress value={slot.fillRate} className="h-2" />
                </div>

                {/* Additional Metrics */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">CPM Médio</span>
                  <span className="font-medium">
                    R$ {slot.avgCPM.toFixed(2)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Configurar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Configurar Slot: {slot.name}
                          </DialogTitle>
                          <DialogDescription>
                            Ajuste as configurações do slot publicitário
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Configurações do slot seriam implementadas aqui
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Slot Layout Preview */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Layout dos Slots na Página</CardTitle>
          <CardDescription>
            Visualização da distribuição dos slots publicitários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted rounded-lg p-4 space-y-4">
            {/* Header */}
            <div className="h-16 bg-muted/30 rounded flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                🔝 Header Principal (728x90)
              </span>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3 h-40 bg-muted/20 rounded flex items-center justify-center">
                <span className="text-sm text-muted-foreground">
                  📄 Conteúdo Principal
                </span>
              </div>
              <div className="h-40 bg-muted/30 rounded flex items-center justify-center">
                <span className="text-xs text-muted-foreground text-center">
                  📋 Sidebar
                  <br />
                  Direita
                  <br />
                  (300x250)
                </span>
              </div>
            </div>

            {/* Mobile Banner */}
            <div className="h-12 bg-muted/30 rounded flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                📱 Mobile Banner (320x50)
              </span>
            </div>

            {/* Footer */}
            <div className="h-16 bg-muted/30 rounded flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                🔻 Footer Banner (728x90)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default AdSlotManagement
