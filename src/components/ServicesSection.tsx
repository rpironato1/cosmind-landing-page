import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Brain,
  Star,
  Heart,
  UserCircle,
  ChartLine,
  Sparkles,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface ServicesProps {
  onContactClick: () => void
  onSectionClick: (section: string) => void
}

export function ServicesSection({
  onContactClick,
  onSectionClick,
}: ServicesProps) {
  const services = [
    {
      icon: Star,
      title: 'Horóscopo Diário',
      description:
        'Previsões personalizadas geradas por IA para cada dia, incluindo orientações sobre amor, trabalho, saúde e finanças.',
      features: [
        'Atualizado diariamente',
        'Personalização total',
        'Insights profundos',
      ],
      gradient: 'from-primary to-primary/70',
      section: 'horoscope',
    },
    {
      icon: Heart,
      title: 'Compatibilidade Amorosa',
      description:
        'Análise completa de compatibilidade entre signos com insights detalhados sobre relacionamentos e afinidades cósmicas.',
      features: [
        'Análise de sinastria',
        'Dicas de relacionamento',
        'Previsões românticas',
      ],
      gradient: 'from-accent to-accent/70',
      section: 'compatibility',
    },
    {
      icon: Sparkles,
      title: 'Mapa Astral Completo',
      description:
        'Interpretação detalhada do seu mapa natal com análise de planetas, casas astrológicas e aspectos planetários.',
      features: [
        'Mapa personalizado',
        'Interpretação profissional',
        'Insights de personalidade',
      ],
      gradient: 'from-secondary to-primary/50',
      section: 'horoscope',
    },
    {
      icon: Brain,
      title: 'Consulta com IA Mística',
      description:
        'Converse diretamente com nossa IA especializada em astrologia para tirar dúvidas e receber orientações específicas.',
      features: [
        'Chat em tempo real',
        'Respostas personalizadas',
        'Disponível 24/7',
      ],
      gradient: 'from-primary/70 to-accent/70',
      section: 'chat',
    },
    {
      icon: ChartLine,
      title: 'Previsões de Carreira',
      description:
        'Orientações astrológicas para decisões profissionais, timing ideal para mudanças e oportunidades de crescimento.',
      features: [
        'Timing profissional',
        'Orientação de carreira',
        'Análise de trânsitos',
      ],
      gradient: 'from-accent/70 to-secondary',
      section: 'career-astrology',
    },
    {
      icon: UserCircle,
      title: 'Perfil Cósmico Premium',
      description:
        'Análise completa da sua personalidade astrológica com relatórios detalhados sobre talentos, desafios e potenciais.',
      features: [
        'Relatório completo',
        'Análise psicológica',
        'Guia de desenvolvimento',
      ],
      gradient: 'from-primary to-secondary/70',
      section: 'horoscope',
    },
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
              Serviços{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Cósmicos
              </span>
            </h2>
            <p className="font-sans text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Uma gama completa de serviços astrológicos premium, powered by IA,
              para desvendar os mistérios do cosmos e guiar sua jornada de vida.
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
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center`}
                      >
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
                          <div
                            key={featureIndex}
                            className="flex items-center gap-3"
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                            <span className="text-sm text-muted-foreground font-medium">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="pt-4"
                      >
                        <Button
                          onClick={() => onSectionClick(service.section)}
                          className={`w-full bg-gradient-to-r ${service.gradient} text-white font-medium hover:shadow-lg transition-all duration-300`}
                        >
                          Experimentar Agora
                        </Button>
                      </motion.div>
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
              Pronto para Desvendar os{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Segredos do Cosmos?
              </span>
            </h3>
            <p className="font-sans text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Nossa IA mística está pronta para revelar os mistérios que as
              estrelas guardam sobre seu destino e futuro.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => onSectionClick('horoscope')}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-white font-medium px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Começar Jornada Cósmica
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
