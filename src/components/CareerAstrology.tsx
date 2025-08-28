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
import { Progress } from '@/components/ui/progress'
import {
  Briefcase,
  TrendUp,
  Target,
  Star,
  Users,
  Lightbulb,
  Coins,
  Loader2,
  Crown,
  Heart,
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface CareerAnalysis {
  id: string
  personalityProfile: {
    strengths: string[]
    challenges: string[]
    workStyle: string
    leadership: number
    creativity: number
    analytical: number
    social: number
    independence: number
  }
  careerPaths: {
    primary: string[]
    secondary: string[]
    emerging: string[]
  }
  currentCareerAnalysis: {
    compatibility: number
    strengths: string[]
    improvementAreas: string[]
    growthPotential: string
  }
  recommendations: {
    shortTerm: string[]
    longTerm: string[]
    skills: string[]
    networking: string[]
  }
  luckyPeriods: {
    bestMonths: string[]
    favorableDays: string[]
    planetaryInfluences: string
  }
  astrological: {
    ruling: string
    element: string
    modalityInfluence: string
    careerHouses: string
    beneficPlanets: string[]
  }
  detailedAnalysis: string
  date: string
}

const zodiacSigns = [
  { value: 'aries', label: '♈ Áries', ruling: 'Marte', element: 'Fogo' },
  { value: 'taurus', label: '♉ Touro', ruling: 'Vênus', element: 'Terra' },
  { value: 'gemini', label: '♊ Gêmeos', ruling: 'Mercúrio', element: 'Ar' },
  { value: 'cancer', label: '♋ Câncer', ruling: 'Lua', element: 'Água' },
  { value: 'leo', label: '♌ Leão', ruling: 'Sol', element: 'Fogo' },
  { value: 'virgo', label: '♍ Virgem', ruling: 'Mercúrio', element: 'Terra' },
  { value: 'libra', label: '♎ Libra', ruling: 'Vênus', element: 'Ar' },
  {
    value: 'scorpio',
    label: '♏ Escorpião',
    ruling: 'Plutão',
    element: 'Água',
  },
  {
    value: 'sagittarius',
    label: '♐ Sagitário',
    ruling: 'Júpiter',
    element: 'Fogo',
  },
  {
    value: 'capricorn',
    label: '♑ Capricórnio',
    ruling: 'Saturno',
    element: 'Terra',
  },
  { value: 'aquarius', label: '♒ Aquário', ruling: 'Urano', element: 'Ar' },
  { value: 'pisces', label: '♓ Peixes', ruling: 'Netuno', element: 'Água' },
]

const careerAreas = [
  {
    value: 'technology',
    label: '💻 Tecnologia',
    description: 'TI, software, inovação digital',
  },
  {
    value: 'healthcare',
    label: '🏥 Saúde',
    description: 'Medicina, terapias, bem-estar',
  },
  {
    value: 'business',
    label: '💼 Negócios',
    description: 'Administração, vendas, consultoria',
  },
  {
    value: 'creative',
    label: '🎨 Criativo',
    description: 'Arte, design, entretenimento',
  },
  {
    value: 'education',
    label: '📚 Educação',
    description: 'Ensino, pesquisa, desenvolvimento',
  },
  {
    value: 'finance',
    label: '💰 Finanças',
    description: 'Banking, investimentos, contabilidade',
  },
  {
    value: 'legal',
    label: '⚖️ Jurídico',
    description: 'Direito, advocacia, compliance',
  },
  {
    value: 'social',
    label: '🤝 Social',
    description: 'ONG, serviços sociais, política',
  },
  {
    value: 'science',
    label: '🔬 Ciências',
    description: 'Pesquisa, laboratório, inovação',
  },
  {
    value: 'sports',
    label: '🏃 Esportes',
    description: 'Atletismo, fitness, recreação',
  },
]

const careerSatisfaction = [
  { value: 'very-satisfied', label: 'Muito satisfeito', score: 90 },
  { value: 'satisfied', label: 'Satisfeito', score: 70 },
  { value: 'neutral', label: 'Neutro', score: 50 },
  { value: 'dissatisfied', label: 'Insatisfeito', score: 30 },
  { value: 'very-dissatisfied', label: 'Muito insatisfeito', score: 10 },
]

interface CareerAstrologyProps {
  onSectionClick?: (section: string) => void
}

export function CareerAstrology({ onSectionClick }: CareerAstrologyProps = {}) {
  const [selectedSign, setSelectedSign] = useState<string>('')
  const [currentRole, setCurrentRole] = useState<string>('')
  const [careerArea, setCareerArea] = useState<string>('')
  const [satisfaction, setSatisfaction] = useState<string>('')
  const [goals, setGoals] = useState<string>('')
  const [challenges, setChallenges] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null)
  const [tokens, setTokens] = useKV('user-tokens', 5)

  const analyzeCareer = async () => {
    if (!selectedSign || !currentRole || !careerArea || !satisfaction) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (tokens < 4) {
      toast.error(
        'Você precisa de pelo menos 4 tokens para análise de carreira'
      )
      return
    }

    setIsAnalyzing(true)

    try {
      const signData = zodiacSigns.find(sign => sign.value === selectedSign)
      const areaData = careerAreas.find(area => area.value === careerArea)
      const satisfactionData = careerSatisfaction.find(
        sat => sat.value === satisfaction
      )

      const prompt = spark.llmPrompt`
        Você é um astrólogo especialista em carreira e vocação profissional. Faça uma análise completa da carreira de uma pessoa com as seguintes informações:

        Signo: ${signData?.label} (Regente: ${signData?.ruling}, Elemento: ${signData?.element})
        Cargo Atual: ${currentRole}
        Área de Atuação: ${areaData?.label} - ${areaData?.description}
        Satisfação Atual: ${satisfactionData?.label} (${satisfactionData?.score}%)
        Objetivos: ${goals || 'Não especificados'}
        Desafios: ${challenges || 'Não especificados'}

        Analise considerando:
        1. Perfil de personalidade profissional baseado no signo
        2. Compatibilidade da carreira atual com o perfil astrológico
        3. Caminhos de carreira recomendados (primários, secundários, emergentes)
        4. Análise detalhada da situação atual
        5. Recomendações práticas de curto e longo prazo
        6. Períodos favoráveis e influências planetárias
        7. Aspectos astrológicos relevantes para carreira

        Seja específico, prático e use conhecimento astrológico tradicional.

        Retorne APENAS um JSON válido com as chaves:
        {
          "personalityProfile": {
            "strengths": ["array de pontos fortes"],
            "challenges": ["array de desafios"],
            "workStyle": "estilo de trabalho",
            "leadership": número_0_100,
            "creativity": número_0_100,
            "analytical": número_0_100,
            "social": número_0_100,
            "independence": número_0_100
          },
          "careerPaths": {
            "primary": ["carreiras primárias recomendadas"],
            "secondary": ["carreiras secundárias"],
            "emerging": ["tendências emergentes adequadas"]
          },
          "currentCareerAnalysis": {
            "compatibility": número_0_100,
            "strengths": ["pontos fortes na posição atual"],
            "improvementAreas": ["áreas para melhorar"],
            "growthPotential": "análise do potencial de crescimento"
          },
          "recommendations": {
            "shortTerm": ["recomendações curto prazo"],
            "longTerm": ["recomendações longo prazo"],
            "skills": ["habilidades a desenvolver"],
            "networking": ["estratégias de networking"]
          },
          "luckyPeriods": {
            "bestMonths": ["melhores meses do ano"],
            "favorableDays": ["dias da semana favoráveis"],
            "planetaryInfluences": "influências planetárias para carreira"
          },
          "astrological": {
            "ruling": "planeta regente e influência",
            "element": "elemento e características",
            "modalityInfluence": "modalidade e impacto",
            "careerHouses": "casas astrológicas relevantes",
            "beneficPlanets": ["planetas benéficos para carreira"]
          },
          "detailedAnalysis": "análise detalhada em 3-4 parágrafos"
        }
      `

      const response = await spark.llm(prompt, 'gpt-4o', true)
      const aiAnalysis = JSON.parse(response)

      const careerAnalysis: CareerAnalysis = {
        id: Date.now().toString(),
        personalityProfile: aiAnalysis.personalityProfile,
        careerPaths: aiAnalysis.careerPaths,
        currentCareerAnalysis: aiAnalysis.currentCareerAnalysis,
        recommendations: aiAnalysis.recommendations,
        luckyPeriods: aiAnalysis.luckyPeriods,
        astrological: aiAnalysis.astrological,
        detailedAnalysis: aiAnalysis.detailedAnalysis,
        date: new Date().toLocaleDateString('pt-BR'),
      }

      setAnalysis(careerAnalysis)
      setTokens(currentTokens => currentTokens - 4)
      toast.success('Análise de carreira concluída! 🌟')

      // Save to history
      const history = (await spark.kv.get('career-history')) || []
      await spark.kv.set('career-history', [...history, careerAnalysis])
    } catch (error) {
      console.error('Error analyzing career:', error)
      toast.error('Erro ao analisar carreira. Tente novamente.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getCompatibilityLevel = (score: number) => {
    if (score >= 80)
      return {
        label: 'Excelente',
        color: 'text-green-600 bg-green-50',
        emoji: '🌟',
      }
    if (score >= 65)
      return {
        label: 'Muito Boa',
        color: 'text-blue-600 bg-blue-50',
        emoji: '⭐',
      }
    if (score >= 50)
      return {
        label: 'Boa',
        color: 'text-yellow-600 bg-yellow-50',
        emoji: '✨',
      }
    if (score >= 35)
      return {
        label: 'Moderada',
        color: 'text-orange-600 bg-orange-50',
        emoji: '💫',
      }
    return { label: 'Baixa', color: 'text-red-600 bg-red-50', emoji: '⚡' }
  }

  const selectedSignData = zodiacSigns.find(sign => sign.value === selectedSign)

  return (
    <section
      id="career-astrology"
      className="py-24 bg-gradient-to-br from-secondary/5 to-primary/5"
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
              Astrologia{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Profissional
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Descubra sua vocação cósmica e otimize sua trajetória profissional
              através dos astros
            </p>

            {/* Token Info */}
            <motion.div
              className="flex items-center justify-center gap-3 mt-6 glass p-3 rounded-xl w-fit mx-auto"
              whileHover={{ scale: 1.05 }}
            >
              <Coins size={20} className="text-accent" />
              <span className="font-medium">
                {tokens} tokens • Análise custa 4 tokens
              </span>
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="font-display text-2xl flex items-center gap-2">
                  <Briefcase className="text-accent" />
                  Perfil Profissional
                </CardTitle>
                <CardDescription>
                  Forneça informações sobre sua carreira atual para análise
                  astrológica personalizada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sign">Signo *</Label>
                  <Select value={selectedSign} onValueChange={setSelectedSign}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Selecione seu signo" />
                    </SelectTrigger>
                    <SelectContent>
                      {zodiacSigns.map(sign => (
                        <SelectItem key={sign.value} value={sign.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{sign.label}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {sign.ruling} • {sign.element}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-role">Cargo/Função Atual *</Label>
                  <Input
                    id="current-role"
                    value={currentRole}
                    onChange={e => setCurrentRole(e.target.value)}
                    placeholder="Ex: Desenvolvedor, Gerente, Designer..."
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="career-area">Área de Atuação *</Label>
                  <Select value={careerArea} onValueChange={setCareerArea}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Selecione sua área" />
                    </SelectTrigger>
                    <SelectContent>
                      {careerAreas.map(area => (
                        <SelectItem key={area.value} value={area.value}>
                          <div className="flex flex-col">
                            <span>{area.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {area.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="satisfaction">Satisfação Atual *</Label>
                  <Select value={satisfaction} onValueChange={setSatisfaction}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Como se sente na carreira atual?" />
                    </SelectTrigger>
                    <SelectContent>
                      {careerSatisfaction.map(sat => (
                        <SelectItem key={sat.value} value={sat.value}>
                          {sat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals">
                    Objetivos Profissionais (opcional)
                  </Label>
                  <Textarea
                    id="goals"
                    value={goals}
                    onChange={e => setGoals(e.target.value)}
                    placeholder="Descreva seus objetivos e aspirações profissionais..."
                    className="bg-background/50 min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenges">Desafios Atuais (opcional)</Label>
                  <Textarea
                    id="challenges"
                    value={challenges}
                    onChange={e => setChallenges(e.target.value)}
                    placeholder="Quais desafios está enfrentando na carreira?"
                    className="bg-background/50 min-h-[80px]"
                  />
                </div>

                <Button
                  onClick={analyzeCareer}
                  disabled={
                    isAnalyzing ||
                    !selectedSign ||
                    !currentRole ||
                    !careerArea ||
                    !satisfaction ||
                    tokens < 4
                  }
                  className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analisando Carreira...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-4 w-4" />
                      Analisar Carreira (4 tokens)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Preview */}
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Career Compatibility */}
                  <Card className="glass border-accent/20">
                    <CardHeader className="text-center">
                      <div className="text-4xl mb-4">
                        {selectedSignData?.label.split(' ')[0]}
                      </div>
                      <CardTitle className="font-display text-2xl mb-2">
                        Compatibilidade Profissional
                      </CardTitle>
                      <div className="text-4xl font-bold text-accent mb-2">
                        {analysis.currentCareerAnalysis.compatibility}%
                      </div>
                      <Badge
                        className={
                          getCompatibilityLevel(
                            analysis.currentCareerAnalysis.compatibility
                          ).color
                        }
                      >
                        {
                          getCompatibilityLevel(
                            analysis.currentCareerAnalysis.compatibility
                          ).emoji
                        }{' '}
                        {
                          getCompatibilityLevel(
                            analysis.currentCareerAnalysis.compatibility
                          ).label
                        }
                      </Badge>
                    </CardHeader>
                  </Card>

                  {/* Personality Profile */}
                  <Card className="glass border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Star className="text-primary" />
                        Perfil de Personalidade
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        {
                          label: 'Liderança',
                          value: analysis.personalityProfile.leadership,
                          icon: Crown,
                        },
                        {
                          label: 'Criatividade',
                          value: analysis.personalityProfile.creativity,
                          icon: Lightbulb,
                        },
                        {
                          label: 'Análise',
                          value: analysis.personalityProfile.analytical,
                          icon: Target,
                        },
                        {
                          label: 'Social',
                          value: analysis.personalityProfile.social,
                          icon: Users,
                        },
                        {
                          label: 'Independência',
                          value: analysis.personalityProfile.independence,
                          icon: Star,
                        },
                      ].map((trait, index) => {
                        const IconComponent = trait.icon
                        return (
                          <motion.div
                            key={trait.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <IconComponent
                                  size={16}
                                  className="text-primary"
                                />
                                <span className="text-sm font-medium">
                                  {trait.label}
                                </span>
                              </div>
                              <span className="text-sm font-bold">
                                {trait.value}%
                              </span>
                            </div>
                            <Progress value={trait.value} className="h-2" />
                          </motion.div>
                        )
                      })}
                    </CardContent>
                  </Card>

                  {/* Career Paths Preview */}
                  <Card className="glass border-accent/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendUp className="text-accent" />
                        Caminhos Recomendados
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Carreiras Primárias:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {analysis.careerPaths.primary
                            .slice(0, 3)
                            .map((career, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                🎯 {career}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Tendências Emergentes:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {analysis.careerPaths.emerging
                            .slice(0, 2)
                            .map((career, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                🚀 {career}
                              </Badge>
                            ))}
                        </div>
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
                    <div className="text-6xl">💼</div>
                    <p className="text-muted-foreground max-w-xs">
                      Preencha suas informações profissionais para receber
                      análise astrológica personalizada
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Detailed Analysis */}
          {analysis && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Detailed Analysis */}
              <Card className="lg:col-span-2 glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="text-primary" />
                    Análise Detalhada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">{analysis.detailedAnalysis}</p>
                </CardContent>
              </Card>

              {/* Lucky Periods */}
              <Card className="glass border-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="text-accent" />
                    Períodos Favoráveis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Melhores Meses:</span>
                    <div className="text-xs text-muted-foreground">
                      {analysis.luckyPeriods.bestMonths.join(', ')}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">
                      Dias Favoráveis:
                    </span>
                    <div className="text-xs text-muted-foreground">
                      {analysis.luckyPeriods.favorableDays.join(', ')}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="lg:col-span-3 glass border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="text-accent" />
                    Recomendações Personalizadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm">Curto Prazo</h3>
                      {analysis.recommendations.shortTerm.map((rec, index) => (
                        <div
                          key={index}
                          className="text-xs p-2 bg-primary/10 rounded"
                        >
                          {rec}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium text-sm">Longo Prazo</h3>
                      {analysis.recommendations.longTerm.map((rec, index) => (
                        <div
                          key={index}
                          className="text-xs p-2 bg-accent/10 rounded"
                        >
                          {rec}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium text-sm">Habilidades</h3>
                      {analysis.recommendations.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="text-xs p-2 bg-secondary/30 rounded"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium text-sm">Networking</h3>
                      {analysis.recommendations.networking.map((net, index) => (
                        <div
                          key={index}
                          className="text-xs p-2 bg-muted/50 rounded"
                        >
                          {net}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-3 text-center text-xs text-muted-foreground">
                Análise realizada em {analysis.date} • Use estas orientações
                como guia em sua jornada profissional
              </div>

              {/* Next Steps CTA */}
              {onSectionClick && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="lg:col-span-3 mt-6"
                >
                  <div className="glass p-6 rounded-2xl text-center">
                    <h4 className="font-display font-semibold text-lg mb-3">
                      Potencialize sua Carreira
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => onSectionClick('planetary-transits')}
                        className="bg-gradient-to-r from-primary to-accent text-white"
                        size="sm"
                      >
                        Ver Timing Ideal
                      </Button>
                      <Button
                        onClick={() => onSectionClick('ritual-generator')}
                        variant="outline"
                        size="sm"
                        className="border-primary/30 text-primary hover:bg-primary/5"
                      >
                        Ritual de Sucesso
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
