import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Flame,
  Moon,
  Star,
  Sparkles,
  Leaf,
  Heart,
  Coins,
  Loader2,
  Clock,
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface RitualStep {
  order: number
  title: string
  description: string
  duration: string
  materials?: string[]
  notes?: string
}

interface GeneratedRitual {
  id: string
  title: string
  purpose: string
  intention: string
  moonPhase: string
  difficulty: 'iniciante' | 'intermediário' | 'avançado'
  duration: string
  totalTime: string
  bestTime: string
  materials: string[]
  preparation: string
  steps: RitualStep[]
  closing: string
  aftercare: string[]
  warnings: string[]
  affirmations: string[]
  crystals: string[]
  herbs: string[]
  colors: string[]
  date: string
}

const ritualTypes = [
  {
    value: 'protection',
    label: '🛡️ Proteção',
    description: 'Rituais para proteção energética e espiritual',
  },
  {
    value: 'love',
    label: '💕 Amor',
    description: 'Atrair amor, fortalecer relacionamentos',
  },
  {
    value: 'prosperity',
    label: '💰 Prosperidade',
    description: 'Abundância financeira e profissional',
  },
  {
    value: 'healing',
    label: '🌿 Cura',
    description: 'Cura emocional, física e espiritual',
  },
  {
    value: 'wisdom',
    label: '🧠 Sabedoria',
    description: 'Clareza mental e intuição',
  },
  {
    value: 'manifestation',
    label: '✨ Manifestação',
    description: 'Materializar desejos e objetivos',
  },
  {
    value: 'cleansing',
    label: '🧹 Limpeza',
    description: 'Purificação energética de espaços e pessoas',
  },
  {
    value: 'communication',
    label: '🗣️ Comunicação',
    description: 'Melhorar relacionamentos e diálogo',
  },
  {
    value: 'creativity',
    label: '🎨 Criatividade',
    description: 'Despertar potencial criativo e artístico',
  },
  {
    value: 'strength',
    label: '💪 Força',
    description: 'Coragem, determinação e poder pessoal',
  },
]

const moonPhases = [
  {
    value: 'new',
    label: '🌑 Lua Nova',
    description: 'Novos começos, intenções, plantio de sementes',
  },
  {
    value: 'waxing',
    label: '🌒 Lua Crescente',
    description: 'Crescimento, atração, construção',
  },
  {
    value: 'full',
    label: '🌕 Lua Cheia',
    description: 'Manifestação, poder máximo, gratidão',
  },
  {
    value: 'waning',
    label: '🌘 Lua Minguante',
    description: 'Liberação, limpeza, banimento',
  },
  {
    value: 'any',
    label: '🌙 Qualquer Fase',
    description: 'Ritual adaptável a qualquer momento',
  },
]

const experience = [
  {
    value: 'beginner',
    label: 'Iniciante',
    description: 'Primeiro contato com rituais',
  },
  {
    value: 'intermediate',
    label: 'Intermediário',
    description: 'Já fiz alguns rituais',
  },
  {
    value: 'advanced',
    label: 'Avançado',
    description: 'Praticante experiente',
  },
]

interface RitualGeneratorProps {
  onSectionClick?: (section: string) => void
}

export function RitualGenerator({ onSectionClick }: RitualGeneratorProps = {}) {
  const [ritualType, setRitualType] = useState<string>('')
  const [moonPhase, setMoonPhase] = useState<string>('')
  const [userExperience, setUserExperience] = useState<string>('')
  const [specificIntention, setSpecificIntention] = useState<string>('')
  const [availableTime, setAvailableTime] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRitual, setGeneratedRitual] =
    useState<GeneratedRitual | null>(null)
  const [tokens, setTokens] = useKV('user-tokens', 5)

  const generateRitual = async () => {
    if (!ritualType || !moonPhase || !userExperience) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (tokens < 2) {
      toast.error(
        'Você precisa de pelo menos 2 tokens para gerar um ritual personalizado'
      )
      return
    }

    setIsGenerating(true)

    try {
      const selectedType = ritualTypes.find(t => t.value === ritualType)
      const selectedPhase = moonPhases.find(p => p.value === moonPhase)
      const selectedExp = experience.find(e => e.value === userExperience)

      const prompt = spark.llmPrompt`
        Você é um especialista em rituais místicos e práticas esotéricas. Crie um ritual personalizado completo com os seguintes parâmetros:

        Tipo: ${selectedType?.label} - ${selectedType?.description}
        Fase Lunar: ${selectedPhase?.label} - ${selectedPhase?.description}
        Experiência: ${selectedExp?.label} - ${selectedExp?.description}
        Intenção Específica: ${specificIntention || 'Não especificada'}
        Tempo Disponível: ${availableTime || 'Flexível'}

        O ritual deve incluir:

        1. Título criativo e inspirador
        2. Propósito claro e objetivo
        3. Dificuldade apropriada para o nível
        4. Lista completa de materiais necessários
        5. Preparação detalhada
        6. Passos sequenciais numerados (4-8 passos)
        7. Ritual de fechamento
        8. Cuidados pós-ritual
        9. Avisos importantes
        10. Afirmações poderosas
        11. Cristais recomendados
        12. Ervas apropriadas
        13. Cores significativas
        14. Melhor horário para realização
        15. Duração estimada

        Seja específico, prático e respeite tradições místicas. Use linguagem envolvente mas clara.

        Retorne APENAS um JSON válido com as chaves: title, purpose, intention, difficulty, duration, totalTime, bestTime, materials (array), preparation, steps (array com order, title, description, duration, materials?, notes?), closing, aftercare (array), warnings (array), affirmations (array), crystals (array), herbs (array), colors (array).
      `

      const response = await spark.llm(prompt, 'gpt-4o', true)
      const aiRitual = JSON.parse(response)

      const newRitual: GeneratedRitual = {
        id: Date.now().toString(),
        title: aiRitual.title,
        purpose: aiRitual.purpose,
        intention: specificIntention || aiRitual.intention,
        moonPhase: selectedPhase?.label || '',
        difficulty: aiRitual.difficulty,
        duration: aiRitual.duration,
        totalTime: aiRitual.totalTime,
        bestTime: aiRitual.bestTime,
        materials: aiRitual.materials,
        preparation: aiRitual.preparation,
        steps: aiRitual.steps,
        closing: aiRitual.closing,
        aftercare: aiRitual.aftercare,
        warnings: aiRitual.warnings,
        affirmations: aiRitual.affirmations,
        crystals: aiRitual.crystals,
        herbs: aiRitual.herbs,
        colors: aiRitual.colors,
        date: new Date().toLocaleDateString('pt-BR'),
      }

      setGeneratedRitual(newRitual)
      setTokens(currentTokens => currentTokens - 2)
      toast.success('Ritual personalizado criado com sucesso! ✨')

      // Save to history
      const history = (await spark.kv.get('ritual-history')) || []
      await spark.kv.set('ritual-history', [...history, newRitual])
    } catch (error) {
      console.error('Error generating ritual:', error)
      toast.error('Erro ao gerar ritual. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'iniciante':
        return 'text-green-600 bg-green-50'
      case 'intermediário':
        return 'text-yellow-600 bg-yellow-50'
      case 'avançado':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'iniciante':
        return '🌱'
      case 'intermediário':
        return '🌿'
      case 'avançado':
        return '🌳'
      default:
        return '⭐'
    }
  }

  return (
    <section
      id="ritual-generator"
      className="py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              Gerador de{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Rituais Místicos
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Crie rituais personalizados com base em suas necessidades
              específicas, fase lunar e nível de experiência
            </p>

            {/* Token Info */}
            <motion.div
              className="flex items-center justify-center gap-3 mt-6 glass p-3 rounded-xl w-fit mx-auto"
              whileHover={{ scale: 1.05 }}
            >
              <Coins size={20} className="text-accent" />
              <span className="font-medium">
                {tokens} tokens • Ritual custa 2 tokens
              </span>
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="font-display text-2xl flex items-center gap-2">
                  <Flame className="text-accent" />
                  Configuração do Ritual
                </CardTitle>
                <CardDescription>
                  Defina os parâmetros para criar seu ritual místico
                  personalizado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="ritual-type">Propósito do Ritual *</Label>
                  <Select value={ritualType} onValueChange={setRitualType}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Selecione o tipo de ritual" />
                    </SelectTrigger>
                    <SelectContent>
                      {ritualTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span>{type.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {type.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="moon-phase">Fase Lunar *</Label>
                  <Select value={moonPhase} onValueChange={setMoonPhase}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Selecione a fase lunar" />
                    </SelectTrigger>
                    <SelectContent>
                      {moonPhases.map(phase => (
                        <SelectItem key={phase.value} value={phase.value}>
                          <div className="flex flex-col">
                            <span>{phase.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {phase.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Nível de Experiência *</Label>
                  <Select
                    value={userExperience}
                    onValueChange={setUserExperience}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Seu nível de experiência" />
                    </SelectTrigger>
                    <SelectContent>
                      {experience.map(exp => (
                        <SelectItem key={exp.value} value={exp.value}>
                          <div className="flex flex-col">
                            <span>{exp.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {exp.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intention">
                    Intenção Específica (opcional)
                  </Label>
                  <Textarea
                    id="intention"
                    value={specificIntention}
                    onChange={e => setSpecificIntention(e.target.value)}
                    placeholder="Descreva sua intenção específica para este ritual..."
                    className="bg-background/50 min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Tempo Disponível (opcional)</Label>
                  <Input
                    id="time"
                    value={availableTime}
                    onChange={e => setAvailableTime(e.target.value)}
                    placeholder="Ex: 30 minutos, 1 hora, flexível"
                    className="bg-background/50"
                  />
                </div>

                <Button
                  onClick={generateRitual}
                  disabled={
                    isGenerating ||
                    !ritualType ||
                    !moonPhase ||
                    !userExperience ||
                    tokens < 2
                  }
                  className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando Ritual Místico...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Gerar Ritual (2 tokens)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Ritual Preview */}
            <AnimatePresence mode="wait">
              {generatedRitual ? (
                <motion.div
                  key="ritual"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Ritual Header */}
                  <Card className="glass border-accent/20">
                    <CardHeader className="text-center">
                      <div className="text-4xl mb-4">🔮</div>
                      <CardTitle className="font-display text-2xl mb-2">
                        {generatedRitual.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {generatedRitual.purpose}
                      </CardDescription>
                      <div className="flex justify-center gap-2 mt-4">
                        <Badge
                          className={getDifficultyColor(
                            generatedRitual.difficulty
                          )}
                        >
                          {getDifficultyIcon(generatedRitual.difficulty)}{' '}
                          {generatedRitual.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          <Clock size={12} className="mr-1" />
                          {generatedRitual.totalTime}
                        </Badge>
                        <Badge variant="outline">
                          {generatedRitual.moonPhase}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Quick Info */}
                  <Card className="glass border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Informações Rápidas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Melhor Horário:
                          </span>
                          <div className="font-medium">
                            {generatedRitual.bestTime}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Duração:
                          </span>
                          <div className="font-medium">
                            {generatedRitual.duration}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <span className="text-muted-foreground text-sm">
                          Cristais:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {generatedRitual.crystals
                            .slice(0, 3)
                            .map((crystal, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                💎 {crystal}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-muted-foreground text-sm">
                          Ervas:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {generatedRitual.herbs
                            .slice(0, 3)
                            .map((herb, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                🌿 {herb}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Materials Preview */}
                  <Card className="glass border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Leaf className="text-primary" />
                        Materiais Necessários
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-2">
                        {generatedRitual.materials
                          .slice(0, 5)
                          .map((material, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <div className="w-2 h-2 bg-accent rounded-full"></div>
                              <span>{material}</span>
                            </div>
                          ))}
                        {generatedRitual.materials.length > 5 && (
                          <div className="text-sm text-muted-foreground">
                            + {generatedRitual.materials.length - 5} materiais
                            adicionais
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center h-full min-h-[400px]"
                >
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🔮</div>
                    <p className="text-muted-foreground max-w-xs">
                      Configure os parâmetros para gerar seu ritual místico
                      personalizado
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Full Ritual Details */}
          {generatedRitual && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 space-y-8"
            >
              {/* Preparation */}
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="text-primary" />
                    Preparação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">
                    {generatedRitual.preparation}
                  </p>
                </CardContent>
              </Card>

              {/* Ritual Steps */}
              <Card className="glass border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="text-accent" />
                    Passos do Ritual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {generatedRitual.steps.map((step, index) => (
                    <motion.div
                      key={step.order}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-4 bg-secondary/20 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {step.order}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-medium text-lg">{step.title}</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {step.duration}
                          </span>
                          {step.materials && step.materials.length > 0 && (
                            <span className="text-muted-foreground">
                              Materiais: {step.materials.join(', ')}
                            </span>
                          )}
                        </div>
                        {step.notes && (
                          <div className="text-xs text-accent bg-accent/10 p-2 rounded">
                            💡 {step.notes}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Closing & Aftercare */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Moon className="text-primary" />
                      Fechamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-sm">
                      {generatedRitual.closing}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass border-accent/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="text-accent" />
                      Cuidados Pós-Ritual
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {generatedRitual.aftercare.map((care, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <div className="text-accent mt-1">•</div>
                        <span>{care}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Affirmations & Warnings */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass border-accent/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="text-accent" />
                      Afirmações Poderosas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {generatedRitual.affirmations.map((affirmation, index) => (
                      <div key={index} className="p-3 bg-accent/10 rounded-lg">
                        <p className="text-sm italic">"{affirmation}"</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="text-primary" />
                      Avisos Importantes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {generatedRitual.warnings.map((warning, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <div className="text-yellow-600 mt-1">⚠️</div>
                        <span>{warning}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                Ritual criado em {generatedRitual.date} • Use com respeito e
                intenção positiva
              </div>

              {/* Next Steps CTA */}
              {onSectionClick && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mt-8"
                >
                  <div className="glass p-6 rounded-2xl">
                    <h4 className="font-display font-semibold text-lg mb-3">
                      Continue sua Prática Espiritual
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => onSectionClick('compatibility')}
                        variant="outline"
                        size="sm"
                        className="border-primary/30 text-primary hover:bg-primary/5"
                      >
                        Analisar Compatibilidade
                      </Button>
                      <Button
                        onClick={() => onSectionClick('planetary-transits')}
                        variant="outline"
                        size="sm"
                        className="border-accent/30 text-accent hover:bg-accent/5"
                      >
                        Ver Trânsitos Planetários
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
