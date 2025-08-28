import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Download,
  Calendar,
  Eye,
  MousePointer,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'
import { Badge } from '@/components/ui/badge'

// Mock revenue data
const revenueData = [
  {
    date: '2024-01-01',
    revenue: 145.8,
    impressions: 12400,
    clicks: 234,
    advertisers: 3,
  },
  {
    date: '2024-01-02',
    revenue: 198.5,
    impressions: 15600,
    clicks: 298,
    advertisers: 4,
  },
  {
    date: '2024-01-03',
    revenue: 167.2,
    impressions: 13200,
    clicks: 267,
    advertisers: 3,
  },
  {
    date: '2024-01-04',
    revenue: 234.9,
    impressions: 18700,
    clicks: 356,
    advertisers: 5,
  },
  {
    date: '2024-01-05',
    revenue: 189.4,
    impressions: 14800,
    clicks: 289,
    advertisers: 4,
  },
  {
    date: '2024-01-06',
    revenue: 267.8,
    impressions: 21200,
    clicks: 412,
    advertisers: 6,
  },
  {
    date: '2024-01-07',
    revenue: 198.6,
    impressions: 15900,
    clicks: 301,
    advertisers: 4,
  },
  {
    date: '2024-01-08',
    revenue: 245.3,
    impressions: 19400,
    clicks: 378,
    advertisers: 5,
  },
  {
    date: '2024-01-09',
    revenue: 189.7,
    impressions: 15100,
    clicks: 289,
    advertisers: 4,
  },
  {
    date: '2024-01-10',
    revenue: 278.4,
    impressions: 22100,
    clicks: 445,
    advertisers: 6,
  },
]

const revenueBySource = [
  {
    source: 'Banners Display',
    revenue: 1245.8,
    percentage: 35,
    color: '#8b5cf6',
  },
  {
    source: 'Anúncios Nativos',
    revenue: 967.5,
    percentage: 27,
    color: '#06b6d4',
  },
  { source: 'Pop-ups', revenue: 689.2, percentage: 19, color: '#f59e0b' },
  { source: 'Vídeo Ads', revenue: 534.7, percentage: 15, color: '#10b981' },
  { source: 'Mobile Banners', revenue: 178.9, percentage: 4, color: '#ef4444' },
]

const advertiserPerformance = [
  { name: 'CosMind', revenue: 1890.4, campaigns: 8, ctr: 2.1 },
  { name: 'Parceiro Místico', revenue: 1234.8, campaigns: 5, ctr: 1.8 },
  { name: 'Astro Premium', revenue: 967.5, campaigns: 6, ctr: 2.3 },
  { name: 'Tarot Digital', revenue: 756.3, campaigns: 4, ctr: 1.9 },
  { name: 'Esotérico Plus', revenue: 567.2, campaigns: 3, ctr: 1.6 },
]

export function RevenueTracking() {
  const [dateRange, setDateRange] = useState('30d')
  const [viewType, setViewType] = useState('daily')

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalImpressions = revenueData.reduce(
    (sum, item) => sum + item.impressions,
    0
  )
  const totalClicks = revenueData.reduce((sum, item) => sum + item.clicks, 0)
  const averageCTR = (totalClicks / totalImpressions) * 100
  const averageRPM = (totalRevenue / totalImpressions) * 1000

  const exportRevenueReport = () => {
    const reportData = {
      period: dateRange,
      totalRevenue,
      totalImpressions,
      totalClicks,
      averageCTR,
      averageRPM,
      revenueBySource,
      advertiserPerformance,
      dailyData: revenueData,
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-receita-${dateRange}.json`
    a.click()
    window.URL.revokeObjectURL(url)
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
                <TrendingUp className="w-5 h-5 text-primary" />
                Tracking de Receita
              </CardTitle>
              <CardDescription>
                Monitoramento e análise de receita publicitária em tempo real
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 dias</SelectItem>
                  <SelectItem value="30d">30 dias</SelectItem>
                  <SelectItem value="90d">90 dias</SelectItem>
                  <SelectItem value="1y">1 ano</SelectItem>
                </SelectContent>
              </Select>
              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportRevenueReport}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Receita Total
                </p>
                <p className="text-2xl font-bold">
                  R$ {totalRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18.2% vs período anterior
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  RPM Médio
                </p>
                <p className="text-2xl font-bold">R$ {averageRPM.toFixed(2)}</p>
                <p className="text-xs text-blue-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5.7% vs período anterior
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-500" />
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
                <p className="text-xs text-purple-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.4% vs período anterior
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-500" />
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
                <p className="text-xs text-orange-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.9% vs período anterior
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
                  CTR Médio
                </p>
                <p className="text-2xl font-bold">{averageCTR.toFixed(2)}%</p>
                <p className="text-xs text-pink-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.1% vs período anterior
                </p>
              </div>
              <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-pink-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            Evolução da Receita
          </CardTitle>
          <CardDescription>
            Tendência de receita, impressões e cliques ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={value =>
                  new Date(value).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                  })
                }
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === 'revenue' ? `R$ ${value}` : value.toLocaleString(),
                  name === 'revenue'
                    ? 'Receita'
                    : name === 'impressions'
                      ? 'Impressões'
                      : 'Cliques',
                ]}
                labelFormatter={value =>
                  new Date(value).toLocaleDateString('pt-BR')
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="impressions"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#f59e0b"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by Source */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Receita por Fonte
            </CardTitle>
            <CardDescription>
              Distribuição de receita por tipo de anúncio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="revenue"
                >
                  {revenueBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={value => [`R$ ${value}`, 'Receita']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {revenueBySource.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.source}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">
                      R$ {item.revenue.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Advertisers */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Performance por Anunciante
            </CardTitle>
            <CardDescription>
              Ranking de anunciantes por receita gerada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {advertiserPerformance.map((advertiser, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{advertiser.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {advertiser.campaigns} campanhas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      R$ {advertiser.revenue.toFixed(2)}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      CTR: {advertiser.ctr}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Hour Heatmap */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Receita por Hora do Dia
          </CardTitle>
          <CardDescription>
            Análise de performance por horário para otimização de campanhas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 24 }, (_, hour) => {
              const intensity = Math.random() * 100 // Simulated data
              return (
                <div
                  key={hour}
                  className="aspect-square rounded flex items-center justify-center text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: `hsl(var(--primary) / ${intensity * 0.01})`,
                    color: intensity > 50 ? 'white' : 'hsl(var(--foreground))',
                  }}
                  title={`${hour}:00 - R$ ${(intensity * 2).toFixed(2)}`}
                >
                  {hour}h
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>Menor receita</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary/10 rounded" />
              <div className="w-4 h-4 bg-primary/30 rounded" />
              <div className="w-4 h-4 bg-primary/60 rounded" />
              <div className="w-4 h-4 bg-primary rounded" />
            </div>
            <span>Maior receita</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default RevenueTracking
