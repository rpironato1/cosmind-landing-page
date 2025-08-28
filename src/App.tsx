import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Toaster } from '@/components/ui/sonner'

// Lazy load main components for optimal performance
const LandingPage = lazy(() => import('./LandingPage'))
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))
const AdvertisingSystem = lazy(
  () => import('./components/advertising/AdvertisingSystem')
)

const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-cosmic flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <h2 className="text-xl font-display font-semibold text-foreground">
        Carregando CosMind
      </h2>
      <p className="text-muted-foreground">
        Preparando sua experiência cósmica...
      </p>
    </motion.div>
  </div>
)

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Main Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Admin Dashboard Routes with Lazy Loading */}
            <Route path="/admin/*" element={<AdminDashboard />} />

            {/* Advertising System Routes with Lazy Loading */}
            <Route path="/advertising/*" element={<AdvertisingSystem />} />
          </Routes>
        </Suspense>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'oklch(1 0 0)',
              border: '1px solid oklch(0.9 0.05 290)',
              color: 'oklch(0.15 0 0)',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
