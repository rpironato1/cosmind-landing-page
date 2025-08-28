import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

// Lazy load advertising modules for performance optimization
const BannerManagement = lazy(() => import('./BannerManagement'))
const AdSlotManagement = lazy(() => import('./AdSlotManagement'))
const CampaignManagement = lazy(() => import('./CampaignManagement'))
const RevenueTracking = lazy(() => import('./RevenueTracking'))
const AdvertisingNavigation = lazy(() => import('./AdvertisingNavigation'))

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">
        Carregando módulo publicitário...
      </p>
    </motion.div>
  </div>
)

export function AdvertisingSystem() {
  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Sistema de Publicidade
          </h1>
          <p className="text-muted-foreground">
            Gerencie banners, slots de anúncios, campanhas e receita
            publicitária
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Advertising Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<LoadingSpinner />}>
              <AdvertisingNavigation />
            </Suspense>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-4">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/advertising/banners" replace />}
                />
                <Route path="/banners" element={<BannerManagement />} />
                <Route path="/slots" element={<AdSlotManagement />} />
                <Route path="/campaigns" element={<CampaignManagement />} />
                <Route path="/revenue" element={<RevenueTracking />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdvertisingSystem
