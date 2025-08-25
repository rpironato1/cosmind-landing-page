import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, Sparkle, Heart, UserCircle, ChartLine, Shield } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface ServicesProps {
  onContactClick: () => void
}

export function ServicesSection({ onContactClick }: ServicesProps) {
  const services = [
    {
      icon: Brain,
      title: 'Terapia Digital',
      description: 'Sessões personalizadas com IA avançada para cuidado da saúde mental, incluindo técnicas de mindfulness e terapia cognitivo-comportamental.',
      features: ['Disponível 24/7', 'Totalmente personalizada', 'Privacidade garantida'],
      gradient: 'from-primary to-primary/70'
    },
    {
      icon: Sparkle,
      title: 'Protocolos Estéticos',
      description: 'Tratamentos personalizados baseados em análise de pele e objetivos individuais, com acompanhamento profissional especializado.',
      features: ['Análise por IA', 'Resultados mensuráveis', 'Produtos premium'],
      gradient: 'from-accent to-accent/70'
    },
    {
      icon: Heart,
      title: 'Wellness Integrado',
      description: 'Programa completo que une cuidados mentais e físicos, criando uma rotina de bem-estar sustentável e transformadora.',
      features: ['Abordagem holística', 'Rotinas personalizadas', 'Suporte contínuo'],
      gradient: 'from-secondary to-primary/50'
    },
    {
      icon: UserCircle,
      title: 'Coaching Pessoal',
      description: 'Acompanhamento individualizado com coaches especializados em transformação pessoal e desenvolvimento de autoestima.',
      features: ['Mentoria 1:1', 'Planos personalizados', 'Objetivos claros'],
      gradient: 'from-primary/70 to-accent/70'
    },
    {
      icon: ChartLine,
      title: 'Análise Avançada',
      description: 'Monitoramento detalhado do seu progresso com métricas precisas e insights para otimizar sua jornada de transformação.',
      features: ['Relatórios detalhados', 'Insights em tempo real', 'Ajustes inteligentes'],
      gradient: 'from-accent/70 to-secondary'
    },
    {
      icon: Shield,
      title: 'Suporte Premium',
      description: 'Atendimento especializado com profissionais qualificados, garantindo apoio completo durante toda sua jornada.',
      features: ['Atendimento prioritário', 'Especialistas dedicados', 'Emergência 24h'],
      gradient: 'from-primary to-secondary/70'
    }
  ]

  return (
    <section id="services" className="py-24 bg-gradient-cosmic">
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
              Nossos{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Serviços
              </span>
            </h2>
            <p className="font-sans text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Uma gama completa de soluções integradas para sua transformação pessoal, 
              combinando tecnologia de ponta com cuidado humano especializado.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="h-full"
                >
                  <Card className="p-8 h-full bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                    <div className="space-y-6">
                      {/* Icon */}
                      <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center`}>
                        <IconComponent size={32} className="text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-4">
                        <h3 className="font-display font-semibold text-2xl text-foreground">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                            <span className="text-sm text-muted-foreground font-medium">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center glass p-12 rounded-3xl"
          >
            <h3 className="font-display font-semibold text-3xl md:text-4xl text-foreground mb-6">
              Pronto para Começar sua{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Transformação?
              </span>
            </h3>
            <p className="font-sans text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Nossa equipe está pronta para criar um plano personalizado que atenda 
              suas necessidades específicas e objetivos de bem-estar.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onContactClick}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-white font-medium px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Agendar Consulta Gratuita
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}