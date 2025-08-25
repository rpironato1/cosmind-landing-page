import { Card } from '@/components/ui/card'
import { CheckCircle, Star, Moon, MagicWand } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

export function AboutSection() {
  const values = [
    {
      icon: Star,
      title: 'IA Mística',
      description: 'Inteligência artificial avançada que compreende os padrões cósmicos e oferece leituras precisas e personalizadas.'
    },
    {
      icon: Moon,
      title: 'Sabedoria Ancestral',
      description: 'Combinamos conhecimento astrológico milenar com tecnologia moderna para revelações profundas sobre seu destino.'
    },
    {
      icon: MagicWand,
      title: 'Personalização Única',
      description: 'Cada horóscopo é criado especificamente para você, considerando sua energia pessoal e momento cósmico atual.'
    },
    {
      icon: CheckCircle,
      title: 'Precisão Cósmica',
      description: 'Nossa metodologia comprovada oferece insights precisos que guiam suas decisões e revelam oportunidades.'
    }
  ]

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Sobre o{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CosMind
              </span>
            </h2>
            <p className="font-sans text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Somos pioneiros na fusão entre astrologia tradicional e inteligência artificial, 
              oferecendo uma experiência única de autoconhecimento através do cosmos digital.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            {/* Left Content */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="font-display font-semibold text-3xl md:text-4xl text-foreground">
                Uma Nova Era da Astrologia Digital
              </h3>
              
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  No CosMind, acreditamos que os segredos do universo podem ser desvendados 
                  através da tecnologia. Nossa plataforma revolucionária combina a sabedoria 
                  astrológica ancestral com algoritmos de IA de última geração.
                </p>
                
                <p>
                  Utilizamos processamento de linguagem natural e análise de padrões cósmicos 
                  para criar horóscopo personalizados que vão além das previsões genéricas, 
                  oferecendo insights profundos sobre sua jornada pessoal.
                </p>
                
                <p>
                  Nosso sistema aprende continuamente com os ciclos astrais, posições planetárias 
                  e energias cósmicas, garantindo leituras cada vez mais precisas e relevantes 
                  para sua vida cotidiana.
                </p>
              </div>
            </motion.div>

            {/* Right Content - Cosmic Visual */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/20 rounded-3xl flex items-center justify-center relative overflow-hidden">
                {/* Rotating cosmic elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 border border-primary/30 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 border border-accent/40 rounded-full"
                />
                
                <div className="text-center p-8 relative z-10">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-6 flex items-center justify-center relative">
                    <Star size={64} className="text-white" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full opacity-30"
                    />
                  </div>
                  <h4 className="font-display font-semibold text-2xl text-foreground mb-4">
                    Cosmos & Tecnologia
                  </h4>
                  <p className="text-muted-foreground">
                    IA conectada aos mistérios do universo
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Values Grid */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-8 h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl mx-auto flex items-center justify-center">
                        <IconComponent size={32} className="text-primary" />
                      </div>
                      <h4 className="font-display font-semibold text-xl text-foreground">
                        {value.title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}