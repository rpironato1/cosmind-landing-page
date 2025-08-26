import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Heart, Users, Star, Sparkles, Fire, Loader2, Coins } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface CompatibilityResult {
  overall: number
  emotional: number
  intellectual: number
  physical: number
  spiritual: number
  communication: number
  longTerm: number
  analysis: string
  strengths: string[]
  challenges: string[]
  advice: string[]
  bestAspects: string
  attentionAreas: string
  futureOutlook: string
  date: string
}

const zodiacSigns = [
  { value: 'aries', label: '♈ Áries', element: 'Fogo', quality: 'Cardeal' },
  { value: 'taurus', label: '♉ Touro', element: 'Terra', quality: 'Fixo' },
  { value: 'gemini', label: '♊ Gêmeos', element: 'Ar', quality: 'Mutável' },
  { value: 'cancer', label: '♋ Câncer', element: 'Água', quality: 'Cardeal' },
  { value: 'leo', label: '♌ Leão', element: 'Fogo', quality: 'Fixo' },
  { value: 'virgo', label: '♍ Virgem', element: 'Terra', quality: 'Mutável' },
  { value: 'libra', label: '♎ Libra', element: 'Ar', quality: 'Cardeal' },
  { value: 'scorpio', label: '♏ Escorpião', element: 'Água', quality: 'Fixo' },
  { value: 'sagittarius', label: '♐ Sagitário', element: 'Fogo', quality: 'Mutável' },
  { value: 'capricorn', label: '♑ Capricórnio', element: 'Terra', quality: 'Cardeal' },
  { value: 'aquarius', label: '♒ Aquário', element: 'Ar', quality: 'Fixo' },
  { value: 'pisces', label: '♓ Peixes', element: 'Água', quality: 'Mutável' }
]

export function CompatibilityAnalyzer() {
  const [person1Sign, setPerson1Sign] = useState<string>('')
  const [person2Sign, setPerson2Sign] = useState<string>('')
  const [person1Name, setPerson1Name] = useState<string>('')
  const [person2Name, setPerson2Name] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<CompatibilityResult | null>(null)
  const [tokens, setTokens] = useKV('user-tokens', 5)

  const analyzeCompatibility = async () => {
    if (!person1Sign || !person2Sign || !person1Name || !person2Name) {
      toast.error('Por favor, preencha todos os campos')
      return
    }

    if (tokens < 3) {
      toast.error('Você precisa de pelo menos 3 tokens para análise de compatibilidade')
      return
    }

    setIsAnalyzing(true)

    try {
      const person1Data = zodiacSigns.find(sign => sign.value === person1Sign)
      const person2Data = zodiacSigns.find(sign => sign.value === person2Sign)
      
      const prompt = spark.llmPrompt`
        Você é um astrólogo especialista em análise de compatibilidade amorosa. Faça uma análise completa e detalhada da compatibilidade entre ${person1Name} (${person1Data?.label}) e ${person2Name} (${person2Data?.label}).

        Analise os seguintes aspectos com percentuais específicos (0-100):
        1. Compatibilidade Geral
        2. Conexão Emocional
        3. Sintonia Intelectual
        4. Atração Física
        5. Afinidade Espiritual
        6. Comunicação
        7. Potencial de Longo Prazo

        Inclua também:
        - Análise detalhada da dinâmica do relacionamento (2-3 parágrafos)
        - 3-4 principais pontos fortes da relação
        - 3-4 principais desafios a superar
        - 3-4 conselhos práticos para fortalecer a relação
        - Melhor aspecto da compatibilidade
        - Área que requer atenção especial
        - Perspectiva futura do relacionamento

        Considere elementos, qualidades astrológicas, regências planetárias e aspectos entre os signos.

        Retorne APENAS um JSON válido com as chaves: overall, emotional, intellectual, physical, spiritual, communication, longTerm, analysis, strengths (array), challenges (array), advice (array), bestAspects, attentionAreas, futureOutlook.
      `

      const response = await spark.llm(prompt, 'gpt-4o', true)
      const aiResult = JSON.parse(response)

      const compatibilityResult: CompatibilityResult = {
        overall: aiResult.overall,
        emotional: aiResult.emotional,
        intellectual: aiResult.intellectual,
        physical: aiResult.physical,
        spiritual: aiResult.spiritual,
        communication: aiResult.communication,
        longTerm: aiResult.longTerm,
        analysis: aiResult.analysis,
        strengths: aiResult.strengths,
        challenges: aiResult.challenges,
        advice: aiResult.advice,
        bestAspects: aiResult.bestAspects,
        attentionAreas: aiResult.attentionAreas,
        futureOutlook: aiResult.futureOutlook,
        date: new Date().toLocaleDateString('pt-BR')
      }

      setResult(compatibilityResult)
      setTokens(currentTokens => currentTokens - 3)
      toast.success('Análise de compatibilidade concluída! 💕')

      // Save to history
      const history = await spark.kv.get('compatibility-history') || []
      await spark.kv.set('compatibility-history', [...history, {
        ...compatibilityResult,
        person1: { name: person1Name, sign: person1Sign },
        person2: { name: person2Name, sign: person2Sign }
      }])

    } catch (error) {
      console.error('Error analyzing compatibility:', error)
      toast.error('Erro ao analisar compatibilidade. Tente novamente.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getCompatibilityLevel = (score: number) => {
    if (score >= 80) return { label: 'Excelente', color: 'text-green-600 bg-green-50', emoji: '💚' }
    if (score >= 65) return { label: 'Muito Boa', color: 'text-blue-600 bg-blue-50', emoji: '💙' }
    if (score >= 50) return { label: 'Boa', color: 'text-yellow-600 bg-yellow-50', emoji: '💛' }
    if (score >= 35) return { label: 'Moderada', color: 'text-orange-600 bg-orange-50', emoji: '🧡' }
    return { label: 'Desafiadora', color: 'text-red-600 bg-red-50', emoji: '❤️' }
  }

  const person1Data = zodiacSigns.find(sign => sign.value === person1Sign)
  const person2Data = zodiacSigns.find(sign => sign.value === person2Sign)

  return (
    <section id="compatibility" className="py-24 bg-gradient-to-br from-accent/5 to-primary/10">
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
              Análise de{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Compatibilidade
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Descubra a sintonia cósmica entre vocês através de uma análise astrológica profunda e personalizada
            </p>
            
            {/* Token Info */}
            <motion.div 
              className="flex items-center justify-center gap-3 mt-6 glass p-3 rounded-xl w-fit mx-auto"
              whileHover={{ scale: 1.05 }}
            >
              <Coins size={20} className="text-accent" />
              <span className="font-medium">{tokens} tokens • Análise custa 3 tokens</span>
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="font-display text-2xl flex items-center gap-2">
                  <Heart className="text-accent" />
                  Dados do Casal
                </CardTitle>
                <CardDescription>
                  Preencha as informações para uma análise detalhada de compatibilidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Person 1 */}
                <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    <Users className="text-primary" size={20} />
                    Primeira Pessoa
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="person1-name">Nome</Label>
                      <Input
                        id="person1-name"
                        value={person1Name}
                        onChange={(e) => setPerson1Name(e.target.value)}
                        placeholder="Nome da primeira pessoa"
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="person1-sign">Signo</Label>
                      <Select value={person1Sign} onValueChange={setPerson1Sign}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Signo" />
                        </SelectTrigger>
                        <SelectContent>
                          {zodiacSigns.map((sign) => (
                            <SelectItem key={sign.value} value={sign.value}>
                              {sign.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {person1Data && (
                    <div className="flex gap-2">
                      <Badge variant="outline">{person1Data.element}</Badge>
                      <Badge variant="outline">{person1Data.quality}</Badge>
                    </div>
                  )}
                </div>

                {/* Person 2 */}
                <div className="space-y-4 p-4 bg-accent/20 rounded-lg">
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    <Heart className="text-accent" size={20} />
                    Segunda Pessoa
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="person2-name">Nome</Label>
                      <Input
                        id="person2-name"
                        value={person2Name}
                        onChange={(e) => setPerson2Name(e.target.value)}
                        placeholder="Nome da segunda pessoa"
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="person2-sign">Signo</Label>
                      <Select value={person2Sign} onValueChange={setPerson2Sign}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Signo" />
                        </SelectTrigger>
                        <SelectContent>
                          {zodiacSigns.map((sign) => (
                            <SelectItem key={sign.value} value={sign.value}>
                              {sign.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {person2Data && (
                    <div className="flex gap-2">
                      <Badge variant="outline">{person2Data.element}</Badge>
                      <Badge variant="outline">{person2Data.quality}</Badge>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={analyzeCompatibility}
                  disabled={isAnalyzing || !person1Sign || !person2Sign || !person1Name || !person2Name || tokens < 3}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analisando Compatibilidade...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analisar Compatibilidade (3 tokens)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Overall Compatibility */}
                  <Card className="glass border-accent/20">
                    <CardHeader className="text-center">
                      <div className="flex justify-center items-center gap-4 mb-4">
                        <div className="text-2xl">{person1Data?.label.split(' ')[0]}</div>
                        <Heart className="text-accent" size={24} />
                        <div className="text-2xl">{person2Data?.label.split(' ')[0]}</div>
                      </div>
                      <CardTitle className="font-display text-2xl">
                        Compatibilidade Geral
                      </CardTitle>
                      <div className="text-4xl font-bold text-accent">
                        {result.overall}%
                      </div>
                      <Badge className={getCompatibilityLevel(result.overall).color}>
                        {getCompatibilityLevel(result.overall).emoji} {getCompatibilityLevel(result.overall).label}
                      </Badge>
                    </CardHeader>
                  </Card>

                  {/* Detailed Scores */}
                  <Card className="glass border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Análise Detalhada</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { label: 'Conexão Emocional', value: result.emotional, icon: Heart },
                        { label: 'Sintonia Intelectual', value: result.intellectual, icon: Star },
                        { label: 'Atração Física', value: result.physical, icon: Fire },
                        { label: 'Afinidade Espiritual', value: result.spiritual, icon: Sparkles },
                        { label: 'Comunicação', value: result.communication, icon: Users },
                        { label: 'Potencial de Longo Prazo', value: result.longTerm, icon: Heart }
                      ].map((item, index) => {
                        const IconComponent = item.icon
                        return (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <IconComponent size={16} className="text-primary" />
                                <span className="text-sm font-medium">{item.label}</span>
                              </div>
                              <span className="text-sm font-bold">{item.value}%</span>
                            </div>
                            <Progress value={item.value} className="h-2" />
                          </motion.div>
                        )
                      })}
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
                    <div className="text-6xl">💕</div>
                    <p className="text-muted-foreground max-w-xs">
                      Preencha os dados do casal para descobrir a compatibilidade astrológica
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Detailed Analysis */}
          {result && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Analysis */}
              <Card className="lg:col-span-2 glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="text-primary" />
                    Análise Detalhada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-foreground">{result.analysis}</p>
                </CardContent>
              </Card>

              {/* Quick Insights */}
              <div className="space-y-6">
                <Card className="glass border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Pontos Fortes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="text-green-600 mt-1">✓</div>
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Desafios</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.challenges.map((challenge, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="text-yellow-600 mt-1">⚠️</div>
                        <span className="text-sm">{challenge}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Advice */}
              <Card className="lg:col-span-3 glass border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-accent" />
                    Conselhos para Fortalecer a Relação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {result.advice.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg">
                        <div className="text-accent text-xl">💡</div>
                        <span className="text-sm leading-relaxed">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Future Outlook */}
              <Card className="lg:col-span-3 glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="text-primary" />
                    Perspectiva Futura
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">{result.futureOutlook}</p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    Análise realizada em {result.date}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}