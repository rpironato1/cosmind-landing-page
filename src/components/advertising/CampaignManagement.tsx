import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Plus,
  Play,
  Pause,
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { useKV } from '@github/spark/hooks'

interface Campaign {
  id: string
  name: string
  advertiser: string
  type: 'banner' | 'native' | 'video' | 'popup'
  status: 'active' | 'paused' | 'scheduled' | 'completed'
  budget: number
  spent: number
  startDate: string
  endDate: string
  targetAudience: string[]
  objectives: string
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpm: number
  cpc: number
  dailyMetrics: Array<{
    date: string
    impressions: number
    clicks: number
    spent: number
  }>
}

// Mock data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Campanha Horóscopo Premium Q1',
    advertiser: 'CosMind',
    type: 'banner',
    status: 'active',
    budget: 5000,
    spent: 2340,
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    targetAudience: ['Áries', 'Leão', 'Sagitário'],
    objectives: 'Aumentar conversões para planos premium',
    impressions: 45200,
    clicks: 678,
    conversions: 34,
    ctr: 1.5,
    cpm: 2.8,
    cpc: 3.45,
    dailyMetrics: [
      { date: '2024-01-10', impressions: 1200, clicks: 18, spent: 45 },
      { date: '2024-01-11', impressions: 1450, clicks: 22, spent: 52 },
      { date: '2024-01-12', impressions: 1300, clicks: 19, spent: 48 },
      { date: '2024-01-13', impressions: 1580, clicks: 25, spent: 58 },
      { date: '2024-01-14', impressions: 1420, clicks: 21, spent: 51 },
    ],
  },
  {
    id: '2',
    name: 'Retargeting Compatibilidade',
    advertiser: 'Parceiro Místico',
    type: 'native',
    status: 'active',
    budget: 3000,
    spent: 1890,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    targetAudience: ['Gêmeos', 'Libra', 'Aquário'],
    objectives: 'Reengajar usuários que testaram compatibilidade',
    impressions: 28400,
    clicks: 425,
    conversions: 28,
    ctr: 1.9,
    cpm: 3.2,
    cpc: 4.44,
    dailyMetrics: [
      { date: '2024-01-10', impressions: 800, clicks: 15, spent: 32 },
      { date: '2024-01-11', impressions: 920, clicks: 18, spent: 38 },
      { date: '2024-01-12', impressions: 780, clicks: 14, spent: 29 },
      { date: '2024-01-13', impressions: 1100, clicks: 21, spent: 42 },
      { date: '2024-01-14', impressions: 950, clicks: 17, spent: 35 },
    ],
  },
  {
    id: '3',
    name: 'Lançamento Rituais Personalizados',
    advertiser: 'CosMind',
    type: 'video',
    status: 'scheduled',
    budget: 8000,
    spent: 0,
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    targetAudience: ['Câncer', 'Escorpião', 'Peixes'],
    objectives: 'Divulgar novo serviço de rituais personalizados',
    impressions: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
    cpm: 0,
    cpc: 0,
    dailyMetrics: [],
  },
]

export function CampaignManagement() {
  const [campaigns, setCampaigns] = useKV<Campaign[]>(
    'advertising-campaigns',
    mockCampaigns
  )
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign>(
    campaigns[0]
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500'
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-500'
      case 'completed':
        return 'bg-gray-500/10 text-gray-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'banner':
        return '🖼️'
      case 'native':
        return '📄'
      case 'video':
        return '🎥'
      case 'popup':
        return '🪟'
      default:
        return '📢'
    }
  }

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(prev =>
      prev.map(campaign =>
        campaign.id === id
          ? {
              ...campaign,
              status: campaign.status === 'active' ? 'paused' : 'active',
            }
          : campaign
      )
    )
  }

  const totalBudget = campaigns.reduce(
    (sum, campaign) => sum + campaign.budget,
    0
  )
  const totalSpent = campaigns.reduce(
    (sum, campaign) => sum + campaign.spent,
    0
  )
  const totalImpressions = campaigns.reduce(
    (sum, campaign) => sum + campaign.impressions,
    0
  )
  const totalClicks = campaigns.reduce(
    (sum, campaign) => sum + campaign.clicks,
    0
  )

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
                <Calendar className="w-5 h-5 text-primary" />
                Gestão de Campanhas
              </CardTitle>
              <CardDescription>
                Cronograma, métricas e otimização de campanhas publicitárias
              </CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Campanha
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
                  Orçamento Total
                </p>
                <p className="text-2xl font-bold">
                  R$ {totalBudget.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Gasto: R$ {totalSpent.toLocaleString()} (
                  {((totalSpent / totalBudget) * 100).toFixed(1)}%)
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-500" />
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
                <p className="text-xs text-green-500">
                  +12.5% vs período anterior
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-500" />
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
                <p className="text-2xl font-bold">
                  {totalClicks.toLocaleString()}
                </p>
                <p className="text-xs text-orange-500">
                  CTR: {((totalClicks / totalImpressions) * 100).toFixed(2)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                <MousePointer className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Campanhas Ativas
                </p>
                <p className="text-2xl font-bold">
                  {campaigns.filter(c => c.status === 'active').length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Total: {campaigns.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Campaign List */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Campanhas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {campaigns.map(campaign => (
                  <div
                    key={campaign.id}
                    className={`p-4 cursor-pointer transition-colors border-l-4 ${
                      selectedCampaign.id === campaign.id
                        ? 'bg-primary/10 border-primary'
                        : 'border-transparent hover:bg-muted/30'
                    }`}
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getTypeIcon(campaign.type)}
                        </span>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation()
                          toggleCampaignStatus(campaign.id)
                        }}
                        disabled={
                          campaign.status === 'completed' ||
                          campaign.status === 'scheduled'
                        }
                      >
                        {campaign.status === 'active' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <h3 className="font-medium text-sm mb-1">
                      {campaign.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {campaign.advertiser}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Orçamento</span>
                        <span>R$ {campaign.budget.toLocaleString()}</span>
                      </div>
                      <Progress
                        value={(campaign.spent / campaign.budget) * 100}
                        className="h-1"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Gasto: R$ {campaign.spent.toLocaleString()}</span>
                        <span>
                          {new Date(campaign.endDate).toLocaleDateString(
                            'pt-BR'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Overview */}
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">
                      {getTypeIcon(selectedCampaign.type)}
                    </span>
                    {selectedCampaign.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedCampaign.advertiser} •{' '}
                    {selectedCampaign.objectives}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(selectedCampaign.status)}>
                  {selectedCampaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {selectedCampaign.impressions.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Impressões</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">
                    {selectedCampaign.clicks.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Cliques</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-500">
                    {selectedCampaign.ctr.toFixed(2)}%
                  </p>
                  <p className="text-sm text-muted-foreground">CTR</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-500">
                    {selectedCampaign.conversions}
                  </p>
                  <p className="text-sm text-muted-foreground">Conversões</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Orçamento & Gastos</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Orçamento Total</span>
                      <span className="font-medium">
                        R$ {selectedCampaign.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gasto</span>
                      <span className="font-medium">
                        R$ {selectedCampaign.spent.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={
                        (selectedCampaign.spent / selectedCampaign.budget) * 100
                      }
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Restante</span>
                      <span>
                        R${' '}
                        {(
                          selectedCampaign.budget - selectedCampaign.spent
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Período & Audiência</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Início</span>
                      <span>
                        {new Date(
                          selectedCampaign.startDate
                        ).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fim</span>
                      <span>
                        {new Date(selectedCampaign.endDate).toLocaleDateString(
                          'pt-BR'
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Audiência:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedCampaign.targetAudience.map(
                          (audience, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {audience}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          {selectedCampaign.dailyMetrics.length > 0 && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Diária
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={selectedCampaign.dailyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'spent' ? `R$ ${value}` : value,
                        name === 'impressions'
                          ? 'Impressões'
                          : name === 'clicks'
                            ? 'Cliques'
                            : 'Gasto',
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="impressions"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default CampaignManagement
