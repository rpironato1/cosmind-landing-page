import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Filter,
  Download,
  UserCheck,
  Crown,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { useKV } from '@github/spark/hooks'

interface ClientData {
  id: string
  name: string
  email: string
  zodiacSign: string
  tokens: number
  totalSpent: number
  isSubscribed: boolean
  subscriptionTier?: string
  lastActivity: string
  joinDate: string
  status: 'active' | 'inactive' | 'suspended'
}

// Mock data for demonstration
const mockClients: ClientData[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@example.com',
    zodiacSign: 'Áries',
    tokens: 25,
    totalSpent: 150.0,
    isSubscribed: true,
    subscriptionTier: 'Premium',
    lastActivity: '2024-01-15',
    joinDate: '2023-06-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@example.com',
    zodiacSign: 'Leão',
    tokens: 5,
    totalSpent: 50.0,
    isSubscribed: false,
    lastActivity: '2024-01-10',
    joinDate: '2023-08-20',
    status: 'active',
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana@example.com',
    zodiacSign: 'Virgem',
    tokens: 100,
    totalSpent: 300.0,
    isSubscribed: true,
    subscriptionTier: 'Premium Plus',
    lastActivity: '2024-01-14',
    joinDate: '2023-03-10',
    status: 'active',
  },
]

export function ClientManagement() {
  const [clients, setClients] = useKV<ClientData[]>(
    'admin-clients',
    mockClients
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all')

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || client.status === statusFilter
    const matchesSubscription =
      subscriptionFilter === 'all' ||
      (subscriptionFilter === 'subscribed' && client.isSubscribed) ||
      (subscriptionFilter === 'free' && !client.isSubscribed)

    return matchesSearch && matchesStatus && matchesSubscription
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-500/10 text-green-500',
      inactive: 'bg-yellow-500/10 text-yellow-500',
      suspended: 'bg-red-500/10 text-red-500',
    }
    return variants[status as keyof typeof variants] || variants.active
  }

  const exportClients = () => {
    const csvContent = [
      [
        'Nome',
        'Email',
        'Signo',
        'Tokens',
        'Total Gasto',
        'Assinante',
        'Status',
      ].join(','),
      ...filteredClients.map(client =>
        [
          client.name,
          client.email,
          client.zodiacSign,
          client.tokens,
          client.totalSpent,
          client.isSubscribed ? 'Sim' : 'Não',
          client.status,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'clientes-cosmind.csv'
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
                <Users className="w-5 h-5 text-primary" />
                Gerenciamento de Clientes
              </CardTitle>
              <CardDescription>
                CRUD completo para administração de usuários da plataforma
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportClients}>
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                    <DialogDescription>
                      Criar uma nova conta de cliente no sistema
                    </DialogDescription>
                  </DialogHeader>
                  {/* Add client form would go here */}
                  <p className="text-sm text-muted-foreground">
                    Formulário de criação de cliente seria implementado aqui
                  </p>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={subscriptionFilter}
              onValueChange={setSubscriptionFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Assinatura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="subscribed">Assinantes</SelectItem>
                <SelectItem value="free">Gratuitos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Client Table */}
      <Card className="glass">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Signo</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Total Gasto</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map(client => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {client.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{client.zodiacSign}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-accent" />
                      {client.tokens}
                    </div>
                  </TableCell>
                  <TableCell>R$ {client.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>
                    {client.isSubscribed ? (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">
                        <Crown className="w-3 h-3 mr-1" />
                        {client.subscriptionTier}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Gratuito</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(client.status)}>
                      {client.status === 'active' && (
                        <UserCheck className="w-3 h-3 mr-1" />
                      )}
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(client.lastActivity).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredClients.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum cliente encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ClientManagement
