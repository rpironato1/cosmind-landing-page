import { Button } from '@/components/ui/button'
import {
  InstagramLogo,
  LinkedinLogo,
  TwitterLogo,
  EnvelopeSimple,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface FooterProps {
  onSectionClick: (section: string) => void
}

export function Footer({ onSectionClick }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const navigationLinks = [
    { label: 'Início', section: 'hero' },
    { label: 'Sobre', section: 'about' },
    { label: 'Horóscopo', section: 'horoscope' },
    { label: 'Histórico', section: 'history' },
    { label: 'Compatibilidade', section: 'compatibility' },
    { label: 'Rituais', section: 'ritual-generator' },
    { label: 'Carreira', section: 'career-astrology' },
    { label: 'Trânsitos', section: 'planetary-transits' },
    { label: 'Serviços', section: 'services' },
    { label: 'Tokens', section: 'tokens' },
    { label: 'Contato', section: 'contact' },
  ]

  const socialLinks = [
    { icon: InstagramLogo, href: '#', label: 'Instagram' },
    { icon: LinkedinLogo, href: '#', label: 'LinkedIn' },
    { icon: TwitterLogo, href: '#', label: 'Twitter' },
    { icon: EnvelopeSimple, href: 'mailto:contato@cosmind.ai', label: 'Email' },
  ]

  const services = [
    'Horóscopo Diário',
    'Compatibilidade Amorosa',
    'Mapa Astral Completo',
    'Consulta com IA Mística',
  ]

  return (
    <footer className="bg-gradient-to-br from-primary via-primary/90 to-accent text-white py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="font-display font-bold text-3xl mb-4">
                CosMind
              </div>
              <p className="text-white/80 leading-relaxed mb-6">
                Desvende os mistérios do cosmos com nossa inteligência
                artificial mística. Conecte-se às estrelas e descubra os
                segredos que o universo reserva para você.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                      aria-label={social.label}
                    >
                      <IconComponent size={20} />
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-sans font-semibold text-lg mb-6">
                Navegação
              </h3>
              <div className="space-y-3">
                {navigationLinks.map(link => (
                  <motion.button
                    key={link.section}
                    onClick={() => onSectionClick(link.section)}
                    whileHover={{ x: 4 }}
                    className="block text-white/80 hover:text-white transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-sans font-semibold text-lg mb-6">Serviços</h3>
              <div className="space-y-3">
                {services.map(service => (
                  <div key={service} className="text-white/80">
                    {service}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-sans font-semibold text-lg mb-6">
                Portal Cósmico
              </h3>
              <div className="space-y-3 text-white/80">
                <div>
                  <div className="font-medium text-white">
                    Atendimento Astral
                  </div>
                  <div>+55 (11) 99999-9999</div>
                </div>
                <div>
                  <div className="font-medium text-white">Email Cósmico</div>
                  <div>contato@cosmind.ai</div>
                </div>
                <div>
                  <div className="font-medium text-white">
                    Conexão Universal
                  </div>
                  <div>Portal Digital Global</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="border-t border-white/20 pt-12 mb-12"
          >
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="font-display font-semibold text-2xl mb-4">
                Receba Energias Cósmicas
              </h3>
              <p className="text-white/80 mb-6">
                Inscreva-se para receber horóscopo personalizado, dicas
                astrológicas e novidades sobre o universo místico.
              </p>
              <Button
                onClick={() => onSectionClick('contact')}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-medium px-8 py-3"
              >
                Inscrever-se
              </Button>
            </div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="border-t border-white/20 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-white/80 text-sm">
                © {currentYear} CosMind. Todos os direitos reservados.
                Conectado ao cosmos.
              </div>
              <div className="flex gap-6 text-sm">
                <button className="text-white/80 hover:text-white transition-colors duration-200">
                  Política de Privacidade
                </button>
                <button className="text-white/80 hover:text-white transition-colors duration-200">
                  Termos de Uso
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
