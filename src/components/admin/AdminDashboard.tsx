import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

// Lazy load admin modules for performance optimization
const ClientManagement = lazy(() => import('./ClientManagement'))
const ReportsManagement = lazy(() => import('./ReportsManagement'))
const SystemConfiguration = lazy(() => import('./SystemConfiguration'))
const AdminNavigation = lazy(() => import('./AdminNavigation'))

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Carregando módulo...</p>
    </motion.div>
  </div>
)

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Dashboard Administrativo
          </h1>
          <p className="text-muted-foreground">
            Gerencie clientes, relatórios e configurações do sistema CosMind
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Admin Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<LoadingSpinner />}>
              <AdminNavigation />
            </Suspense>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-4">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/admin/clients" replace />}
                />
                <Route path="/clients" element={<ClientManagement />} />
                <Route path="/reports" element={<ReportsManagement />} />
                <Route path="/settings" element={<SystemConfiguration />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminDashboard
