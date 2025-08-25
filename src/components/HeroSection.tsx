import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkle, Brain, Heart } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface HeroSectionProps {
  onCtaClick: () => void
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-cosmic relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-secondary/30 to-primary/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating Icons */}
          <div className="flex justify-center gap-8 mb-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="glass-dark p-4 rounded-2xl"
            >
              <Brain size={32} className="text-primary" />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="glass-dark p-4 rounded-2xl"
            >
              <Sparkle size={32} className="text-accent" />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="glass-dark p-4 rounded-2xl"
            >
              <Heart size={32} className="text-secondary" />
            </motion.div>
          </div>

          {/* Main Heading */}
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-tight mb-6"
          >
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Bem-estar
            </span>
            <br />
            <span className="text-foreground">
              Mental & Cosmético
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-sans text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Transforme sua mente e sua aparência através de tecnologias inovadoras. 
            Uma jornada personalizada que combina cuidados mentais e estéticos para o seu bem-estar completo.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onCtaClick}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-white font-medium px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Começar Jornada
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary/30 text-primary hover:bg-primary/5 font-medium px-8 py-4 text-lg rounded-xl glass backdrop-blur-sm"
              >
                Saiba Mais
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats or Trust Indicators */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { number: '1000+', label: 'Clientes Satisfeitos' },
              { number: '98%', label: 'Taxa de Sucesso' },
              { number: '24/7', label: 'Suporte Disponível' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="glass p-6 rounded-2xl text-center"
              >
                <div className="font-display font-bold text-3xl text-primary mb-2">
                  {stat.number}
                </div>
                <div className="font-sans text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}