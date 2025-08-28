import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Phone,
  EnvelopeSimple,
  MapPin,
  PaperPlaneTilt,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

interface ContactForm {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

interface ContactSectionProps {
  onSectionClick?: (section: string) => void
}

export function ContactSection({ onSectionClick }: ContactSectionProps = {}) {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contacts, setContacts] = useKV('cosmind-contacts', [])

  const contactInfo = [
    {
      icon: Phone,
      title: 'Atendimento Cósmico',
      content: '+55 (11) 99999-9999',
      subtitle: 'Suporte místico 24/7',
    },
    {
      icon: EnvelopeSimple,
      title: 'Email Astral',
      content: 'contato@cosmind.ai',
      subtitle: 'Resposta em até 2h',
    },
    {
      icon: MapPin,
      title: 'Portal Digital',
      content: 'Conexão Global',
      subtitle: 'Atendimento online universal',
    },
  ]

  const services = [
    'Horóscopo Diário',
    'Compatibilidade Amorosa',
    'Mapa Astral Completo',
    'Consulta com IA Mística',
    'Previsões de Carreira',
    'Perfil Cósmico Premium',
  ]

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Por favor, informe seu nome')
      return false
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Por favor, informe um email válido')
      return false
    }

    if (!formData.message.trim()) {
      toast.error('Por favor, descreva como podemos ajudá-lo')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const newContact = {
        ...formData,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: 'pending',
      }

      setContacts((currentContacts: any[]) => [...currentContacts, newContact])

      toast.success(
        'Mensagem enviada com sucesso! Entraremos em contato em breve.'
      )

      // Navigate to horoscope after successful submission
      if (onSectionClick) {
        setTimeout(() => {
          onSectionClick('horoscope')
        }, 2000)
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      })
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-background">
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
              Entre em{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Contato
              </span>
            </h2>
            <p className="font-sans text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Conecte-se conosco e descubra como nossa IA mística pode
              transformar sua jornada de autoconhecimento através do cosmos
              digital.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50">
                <h3 className="font-display font-semibold text-2xl text-foreground mb-6">
                  Conecte-se ao Cosmos
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-foreground"
                      >
                        Nome *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={e =>
                          handleInputChange('name', e.target.value)
                        }
                        placeholder="Seu nome completo"
                        className="border-border/50 focus:border-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={e =>
                          handleInputChange('email', e.target.value)
                        }
                        placeholder="seu@email.com"
                        className="border-border/50 focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium text-foreground"
                      >
                        Telefone
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={e =>
                          handleInputChange('phone', e.target.value)
                        }
                        placeholder="(11) 99999-9999"
                        className="border-border/50 focus:border-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="service"
                        className="text-sm font-medium text-foreground"
                      >
                        Serviço de Interesse
                      </Label>
                      <select
                        id="service"
                        value={formData.service}
                        onChange={e =>
                          handleInputChange('service', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-border/50 rounded-md bg-background text-foreground focus:border-primary/50 focus:outline-none"
                      >
                        <option value="">Selecione um serviço</option>
                        {services.map(service => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-sm font-medium text-foreground"
                    >
                      Mensagem *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={e =>
                        handleInputChange('message', e.target.value)
                      }
                      placeholder="Como podemos ajudá-lo em sua jornada cósmica?"
                      rows={5}
                      className="border-border/50 focus:border-primary/50 resize-none"
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-primary to-accent text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSubmitting ? (
                        'Enviando...'
                      ) : (
                        <>
                          Enviar Mensagem
                          <PaperPlaneTilt size={20} className="ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="font-display font-semibold text-2xl text-foreground mb-6">
                  Canais de Conexão Cósmica
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Nossa equipe de especialistas cósmicos está sempre disponível
                  para guiá-lo. Conecte-se através dos portais abaixo ou inicie
                  sua consulta astral gratuita.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ x: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                            <IconComponent size={24} className="text-primary" />
                          </div>
                          <div>
                            <h4 className="font-sans font-semibold text-foreground mb-1">
                              {info.title}
                            </h4>
                            <p className="text-foreground font-medium">
                              {info.content}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {info.subtitle}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
