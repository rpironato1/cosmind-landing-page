import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Planet, Star, Moon, Sun, Sparkles, Clock } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface PlanetaryTransit {
  planet: string
  sign: string
  degree: number
  aspect: string
  influence: 'positive' | 'neutral' | 'challenging'
  intensity: number
  description: string
  duration: string
  icon: string
}

interface TransitAnalysis {
  currentDate: string
  majorTransits: PlanetaryTransit[]
  moonPhase: {
    phase: string
    illumination: number
    nextPhase: string
    influence: string
  }
  weeklyForecast: string
  lastUpdated: Date
}

interface PlanetaryTransitsProps {
  onSectionClick?: (section: string) => void
}

export function PlanetaryTransits({ onSectionClick }: PlanetaryTransitsProps = {}) {
  const [transitData, setTransitData] = useKV('planetary-transits', null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSign, setSelectedSign] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(false)

  const zodiacSigns = [
    '♈ Áries', '♉ Touro', '♊ Gêmeos', '♋ Câncer',
    '♌ Leão', '♍ Virgem', '♎ Libra', '♏ Escorpião',
    '♐ Sagitário', '♑ Capricórnio', '♒ Aquário', '♓ Peixes'
  ]

  const generateTransitAnalysis = async () => {
    setIsLoading(true)
    
    try {
      const today = new Date().toLocaleDateString('pt-BR')
      
      const prompt = spark.llmPrompt`
        Você é um astrólogo especialista em trânsitos planetários. Gere uma análise completa dos trânsitos atuais para ${today}.
        
        Inclua:
        1. Principais trânsitos planetários do momento (Marte, Vênus, Mercúrio, Júpiter, Saturno)
        2. Fase lunar atual e sua influência
        3. Aspectos importantes entre planetas
        4. Previsão semanal geral
        
        Retorne um JSON válido com a estrutura:
        {
          "majorTransits": [
            {
              "planet": "nome do planeta",
              "sign": "signo atual",
              "degree": número_grau,
              "aspect": "tipo de aspecto",
              "influence": "positive/neutral/challenging",
              "intensity": número_1_a_100,
              "description": "descrição da influência",
              "duration": "duração estimada",
              "icon": "emoji do planeta"
            }
          ],
          "moonPhase": {
            "phase": "fase atual",
            "illumination": número_0_a_100,
            "nextPhase": "próxima fase",
            "influence": "influência da lua"
          },
          "weeklyForecast": "previsão semanal geral"
        }
      `

      const response = await spark.llm(prompt, 'gpt-4o', true)
      const analysisData = JSON.parse(response)

      const newTransitData: TransitAnalysis = {
        currentDate: today,
        majorTransits: analysisData.majorTransits,
        moonPhase: analysisData.moonPhase,
        weeklyForecast: analysisData.weeklyForecast,
        lastUpdated: new Date()
      }

      setTransitData(newTransitData)
      toast.success('Análise de trânsitos atualizada! ✨')

    } catch (error) {
      console.error('Error generating transit analysis:', error)
      toast.error('Erro ao gerar análise de trânsitos. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-update transits daily
  useEffect(() => {
    const checkForUpdates = () => {
      if (!transitData) {
        generateTransitAnalysis()
        return
      }

      const lastUpdate = new Date(transitData.lastUpdated)
      const now = new Date()
      const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)

      // Update if more than 12 hours have passed
      if (hoursSinceUpdate > 12) {
        generateTransitAnalysis()
      }
    }

    checkForUpdates()
  }, [])

  const getInfluenceColor = (influence: string) => {
    switch (influence) {
      case 'positive': return 'text-green-600 bg-green-50'
      case 'challenging': return 'text-red-600 bg-red-50'
      default: return 'text-yellow-600 bg-yellow-50'
    }
  }

  const getInfluenceIcon = (influence: string) => {
    switch (influence) {
      case 'positive': return '✨'
      case 'challenging': return '⚡'
      default: return '🌟'
    }
  }

  const getPlanetIcon = (planet: string) => {
    const icons: Record<string, string> = {
      'Sol': '☉',
      'Lua': '☽',
      'Mercúrio': '☿',
      'Vênus': '♀',
      'Marte': '♂',
      'Júpiter': '♃',
      'Saturno': '♄',
      'Urano': '♅',
      'Netuno': '♆',
      'Plutão': '♇'
    }
    return icons[planet] || '🪐'
  }

  return (
    <section id="planetary-transits" className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Trânsitos{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Planetários
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Acompanhe os movimentos cósmicos em tempo real e suas influências energéticas
            </p>
            
            <Button
              onClick={generateTransitAnalysis}
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-accent"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Planet size={16} />
                  </motion.div>
                  Analisando Cosmos...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  Atualizar Trânsitos
                </>
              )}
            </Button>
          </motion.div>

          {transitData ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Moon Phase Card */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Moon size={24} className="text-primary" />
                      Fase Lunar
                    </CardTitle>
                    <CardDescription>Influência lunar atual</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🌙</div>
                      <h3 className="font-display text-xl mb-2">{transitData.moonPhase.phase}</h3>
                      <Progress value={transitData.moonPhase.illumination} className="mb-4" />
                      <p className="text-sm text-muted-foreground">
                        {transitData.moonPhase.illumination}% iluminada
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Próxima fase:</span>
                        <span>{transitData.moonPhase.nextPhase}</span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {transitData.moonPhase.influence}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Major Transits */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <Card className="h-full glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Planet size={24} className="text-accent" />
                      Trânsitos Principais
                    </CardTitle>
                    <CardDescription>Movimentos planetários influentes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transitData.majorTransits.slice(0, isExpanded ? undefined : 3).map((transit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-lg border border-border/50 bg-background/30"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getPlanetIcon(transit.planet)}</span>
                              <div>
                                <h4 className="font-medium flex items-center gap-2">
                                  {transit.planet} em {transit.sign}
                                  <Badge variant="outline" className={getInfluenceColor(transit.influence)}>
                                    {getInfluenceIcon(transit.influence)} {transit.influence}
                                  </Badge>
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {transit.degree}° • {transit.aspect}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Intensidade</div>
                              <div className="font-medium">{transit.intensity}%</div>
                            </div>
                          </div>
                          
                          <p className="text-sm leading-relaxed mb-2">
                            {transit.description}
                          </p>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock size={12} />
                            Duração: {transit.duration}
                          </div>
                        </motion.div>
                      ))}
                      
                      {transitData.majorTransits.length > 3 && (
                        <Button
                          variant="ghost"
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="w-full"
                        >
                          {isExpanded ? 'Ver Menos' : `Ver Mais ${transitData.majorTransits.length - 3} Trânsitos`}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Weekly Forecast */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="lg:col-span-3"
              >
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star size={24} className="text-accent" />
                      Previsão Semanal
                    </CardTitle>
                    <CardDescription>Tendências cósmicas para os próximos dias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed">
                      {transitData.weeklyForecast}
                    </p>
                    <div className="mt-4 text-xs text-muted-foreground">
                      Última atualização: {new Date(transitData.lastUpdated).toLocaleString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🪐</div>
              <h3 className="font-display text-2xl mb-4">Analisando os Céus</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Clique em "Atualizar Trânsitos" para revelar os movimentos planetários atuais 
                e suas influências cósmicas.
              </p>
            </motion.div>
          )}

          {/* Next Steps CTA */}
          {transitData && onSectionClick && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 text-center"
            >
              <div className="glass p-8 rounded-2xl max-w-2xl mx-auto">
                <h3 className="font-display font-semibold text-2xl mb-4">
                  Use o Timing Cósmico a Seu Favor
                </h3>
                <p className="text-muted-foreground mb-6">
                  Com base nos trânsitos atuais, explore como otimizar este momento
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => onSectionClick('career-astrology')}
                    className="bg-gradient-to-r from-primary to-accent text-white"
                  >
                    Orientação Profissional
                  </Button>
                  <Button
                    onClick={() => onSectionClick('horoscope')}
                    variant="outline"
                    className="border-primary/30 text-primary hover:bg-primary/5"
                  >
                    Horóscopo Personalizado
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}