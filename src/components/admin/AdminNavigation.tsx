import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, BarChart3, Settings, Shield, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    title: 'Gerenciamento de Clientes',
    href: '/admin/clients',
    icon: Users,
    description: 'CRUD completo de usuários',
  },
  {
    title: 'Relatórios',
    href: '/admin/reports',
    icon: BarChart3,
    description: 'Gráficos e exportação',
  },
  {
    title: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
    description: 'Parâmetros globais',
  },
]

export function AdminNavigation() {
  return (
    <Card className="glass">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-lg">Admin Panel</h2>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
                    'hover:bg-primary/10 hover:shadow-sm',
                    isActive
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-none mb-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}

export default AdminNavigation
