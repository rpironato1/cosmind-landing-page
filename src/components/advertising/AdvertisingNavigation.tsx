import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Image,
  Grid3X3,
  Calendar,
  TrendingUp,
  ChevronRight,
  Megaphone,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    title: 'Banners',
    href: '/advertising/banners',
    icon: Image,
    description: 'Dimensões padrão',
  },
  {
    title: 'Slots de Anúncios',
    href: '/advertising/slots',
    icon: Grid3X3,
    description: 'Espaços gerenciáveis',
  },
  {
    title: 'Campanhas',
    href: '/advertising/campaigns',
    icon: Calendar,
    description: 'Cronograma e métricas',
  },
  {
    title: 'Receita',
    href: '/advertising/revenue',
    icon: TrendingUp,
    description: 'Tracking de revenue',
  },
]

export function AdvertisingNavigation() {
  return (
    <Card className="glass">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Megaphone className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-lg">Publicidade</h2>
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

export default AdvertisingNavigation
