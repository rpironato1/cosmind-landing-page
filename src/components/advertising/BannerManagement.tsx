import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Image,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Upload,
  Copy,
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface Banner {
  id: string
  name: string
  imageUrl: string
  clickUrl: string
  dimensions: {
    width: number
    height: number
  }
  position: 'hero' | 'sidebar' | 'footer' | 'popup'
  status: 'active' | 'inactive' | 'scheduled'
  impressions: number
  clicks: number
  ctr: number
  startDate: string
  endDate: string
  device: 'all' | 'desktop' | 'mobile' | 'tablet'
}

// Standard banner dimensions
const standardDimensions = [
  { name: 'Banner Leaderboard', width: 728, height: 90 },
  { name: 'Banner Rectangle', width: 300, height: 250 },
  { name: 'Skyscraper', width: 160, height: 600 },
  { name: 'Mobile Banner', width: 320, height: 50 },
  { name: 'Square', width: 250, height: 250 },
  { name: 'Wide Skyscraper', width: 200, height: 600 },
]

// Mock data
const mockBanners: Banner[] = [
  {
    id: '1',
    name: 'Banner Horóscopo Premium',
    imageUrl: '/api/placeholder/728/90',
    clickUrl: 'https://cosmind.com.br/premium',
    dimensions: { width: 728, height: 90 },
    position: 'hero',
    status: 'active',
    impressions: 15420,
    clicks: 234,
    ctr: 1.52,
    startDate: '2024-01-01',
    endDate: '2024-02-01',
    device: 'all',
  },
  {
    id: '2',
    name: 'Sidebar Compatibilidade',
    imageUrl: '/api/placeholder/300/250',
    clickUrl: 'https://cosmind.com.br/compatibility',
    dimensions: { width: 300, height: 250 },
    position: 'sidebar',
    status: 'active',
    impressions: 8750,
    clicks: 145,
    ctr: 1.66,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    device: 'desktop',
  },
]

export function BannerManagement() {
  const [banners, setBanners] = useKV<Banner[]>(
    'advertising-banners',
    mockBanners
  )
  const [isCreating, setIsCreating] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)

  const [newBanner, setNewBanner] = useState({
    name: '',
    imageUrl: '',
    clickUrl: '',
    dimensions: { width: 728, height: 90 },
    position: 'hero' as const,
    device: 'all' as const,
    startDate: '',
    endDate: '',
  })

  const handleCreateBanner = () => {
    const banner: Banner = {
      id: Date.now().toString(),
      ...newBanner,
      status: 'active',
      impressions: 0,
      clicks: 0,
      ctr: 0,
    }

    setBanners(prev => [...prev, banner])
    setIsCreating(false)
    setNewBanner({
      name: '',
      imageUrl: '',
      clickUrl: '',
      dimensions: { width: 728, height: 90 },
      position: 'hero',
      device: 'all',
      startDate: '',
      endDate: '',
    })
    toast.success('Banner criado com sucesso!')
  }

  const toggleBannerStatus = (id: string) => {
    setBanners(prev =>
      prev.map(banner =>
        banner.id === id
          ? {
              ...banner,
              status: banner.status === 'active' ? 'inactive' : 'active',
            }
          : banner
      )
    )
    toast.success('Status do banner atualizado!')
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop':
        return <Monitor className="w-4 h-4" />
      case 'mobile':
        return <Smartphone className="w-4 h-4" />
      case 'tablet':
        return <Tablet className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-500/10 text-green-500',
      inactive: 'bg-gray-500/10 text-gray-500',
      scheduled: 'bg-blue-500/10 text-blue-500',
    }
    return variants[status as keyof typeof variants] || variants.active
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
                <Image className="w-5 h-5 text-primary" />
                Gerenciamento de Banners
              </CardTitle>
              <CardDescription>
                Banners promocionais com dimensões padrão da indústria
              </CardDescription>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Banner
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Novo Banner</DialogTitle>
                  <DialogDescription>
                    Configure um novo banner publicitário para a plataforma
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bannerName">Nome do Banner</Label>
                      <Input
                        id="bannerName"
                        value={newBanner.name}
                        onChange={e =>
                          setNewBanner(prev => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Ex: Banner Horóscopo Premium"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clickUrl">URL de Destino</Label>
                      <Input
                        id="clickUrl"
                        value={newBanner.clickUrl}
                        onChange={e =>
                          setNewBanner(prev => ({
                            ...prev,
                            clickUrl: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL da Imagem</Label>
                    <div className="flex gap-2">
                      <Input
                        id="imageUrl"
                        value={newBanner.imageUrl}
                        onChange={e =>
                          setNewBanner(prev => ({
                            ...prev,
                            imageUrl: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                        className="flex-1"
                      />
                      <Button variant="outline">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Dimensões</Label>
                      <Select
                        value={`${newBanner.dimensions.width}x${newBanner.dimensions.height}`}
                        onValueChange={value => {
                          const [width, height] = value.split('x').map(Number)
                          setNewBanner(prev => ({
                            ...prev,
                            dimensions: { width, height },
                          }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {standardDimensions.map(dim => (
                            <SelectItem
                              key={`${dim.width}x${dim.height}`}
                              value={`${dim.width}x${dim.height}`}
                            >
                              {dim.name} ({dim.width}x{dim.height})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Posição</Label>
                      <Select
                        value={newBanner.position}
                        onValueChange={value =>
                          setNewBanner(prev => ({
                            ...prev,
                            position: value as any,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hero">Hero</SelectItem>
                          <SelectItem value="sidebar">Sidebar</SelectItem>
                          <SelectItem value="footer">Footer</SelectItem>
                          <SelectItem value="popup">Popup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Dispositivo</Label>
                      <Select
                        value={newBanner.device}
                        onValueChange={value =>
                          setNewBanner(prev => ({
                            ...prev,
                            device: value as any,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="desktop">Desktop</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                          <SelectItem value="tablet">Tablet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Data de Início</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newBanner.startDate}
                        onChange={e =>
                          setNewBanner(prev => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Data de Fim</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newBanner.endDate}
                        onChange={e =>
                          setNewBanner(prev => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreating(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateBanner}>Criar Banner</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {banners.map(banner => (
          <Card key={banner.id} className="glass">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Banner Preview */}
                <div className="relative">
                  <div
                    className="bg-muted/50 rounded-lg flex items-center justify-center border-2 border-dashed border-muted"
                    style={{
                      aspectRatio: `${banner.dimensions.width}/${banner.dimensions.height}`,
                      minHeight: '120px',
                    }}
                  >
                    {banner.imageUrl ? (
                      <img
                        src={banner.imageUrl}
                        alt={banner.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Image className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">
                          {banner.dimensions.width} x {banner.dimensions.height}
                        </p>
                      </div>
                    )}
                  </div>
                  <Badge
                    className={`absolute top-2 right-2 ${getStatusBadge(banner.status)}`}
                  >
                    {banner.status}
                  </Badge>
                </div>

                {/* Banner Info */}
                <div>
                  <h3 className="font-semibold text-lg">{banner.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    {getDeviceIcon(banner.device)}
                    <span>{banner.device}</span>
                    <span>•</span>
                    <span>{banner.position}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {banner.impressions.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Impressões</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-500">
                      {banner.clicks}
                    </p>
                    <p className="text-xs text-muted-foreground">Cliques</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-500">
                      {banner.ctr}%
                    </p>
                    <p className="text-xs text-muted-foreground">CTR</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={banner.clickUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={
                        banner.status === 'active' ? 'destructive' : 'default'
                      }
                      size="sm"
                      onClick={() => toggleBannerStatus(banner.id)}
                    >
                      {banner.status === 'active' ? 'Pausar' : 'Ativar'}
                    </Button>
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

      {banners.length === 0 && (
        <Card className="glass">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhum banner criado</h3>
              <p className="mb-4">
                Crie seu primeiro banner publicitário para começar
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Banner
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}

export default BannerManagement
