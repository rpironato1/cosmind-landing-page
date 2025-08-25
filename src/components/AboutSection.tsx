import { Card } from '@/components/ui/card'
import { CheckCircle, Target, Users, Lightbulb } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

export function AboutSection() {
  const values = [
    {
      icon: Target,
      title: 'Personalização',
      description: 'Cada jornada é única, desenvolvida especificamente para suas necessidades e objetivos pessoais.'
    },
    {
      icon: Users,
      title: 'Comunidade',
      description: 'Uma rede de apoio que conecta pessoas em jornadas similares de transformação e crescimento.'
    },
    {
      icon: Lightbulb,
      title: 'Inovação',
      description: 'Tecnologias de ponta que combinam inteligência artificial e ciência para resultados superiores.'
    },
    {
      icon: CheckCircle,
      title: 'Resultados',
      description: 'Metodologia comprovada com acompanhamento contínuo para garantir o sucesso da sua transformação.'
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
              Sobre a{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Cosmind
              </span>
            </h2>
            <p className="font-sans text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Somos pioneiros na integração entre bem-estar mental e estético, 
              oferecendo uma abordagem holística para sua transformação pessoal através de tecnologia avançada.
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
                Uma Nova Era do Cuidado Pessoal
              </h3>
              
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Na Cosmind, acreditamos que a verdadeira beleza começa de dentro para fora. 
                  Nossa plataforma combina terapia digital avançada com protocolos estéticos 
                  personalizados, criando uma experiência única de transformação.
                </p>
                
                <p>
                  Utilizamos inteligência artificial e análise comportamental para entender 
                  suas necessidades específicas, desenvolvendo um plano integrado que atende 
                  tanto sua saúde mental quanto seus objetivos estéticos.
                </p>
                
                <p>
                  Nosso time multidisciplinar de psicólogos, dermatologistas e especialistas 
                  em bem-estar trabalha em conjunto para garantir resultados duradouros e 
                  uma jornada de autodescoberta transformadora.
                </p>
              </div>
            </motion.div>

            {/* Right Content - Image Placeholder */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/20 rounded-3xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Lightbulb size={64} className="text-white" />
                  </div>
                  <h4 className="font-display font-semibold text-2xl text-foreground mb-4">
                    Tecnologia & Bem-estar
                  </h4>
                  <p className="text-muted-foreground">
                    Inovação a serviço da sua transformação pessoal
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