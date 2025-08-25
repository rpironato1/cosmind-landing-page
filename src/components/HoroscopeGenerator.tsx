import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Star, Heart, Coins } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface HoroscopeData {
  sign: string
  date: string
  reading: string
  mood: string
  lucky_numbers: number[]
  compatibility: string
}

const zodiacSigns = [
  { value: 'aries', label: '♈ Áries', dates: '21/03 - 19/04' },
  { value: 'taurus', label: '♉ Touro', dates: '20/04 - 20/05' },
  { value: 'gemini', label: '♊ Gêmeos', dates: '21/05 - 20/06' },
  { value: 'cancer', label: '♋ Câncer', dates: '21/06 - 22/07' },
  { value: 'leo', label: '♌ Leão', dates: '23/07 - 22/08' },
  { value: 'virgo', label: '♍ Virgem', dates: '23/08 - 22/09' },
  { value: 'libra', label: '♎ Libra', dates: '23/09 - 22/10' },
  { value: 'scorpio', label: '♏ Escorpião', dates: '23/10 - 21/11' },
  { value: 'sagittarius', label: '♐ Sagitário', dates: '22/11 - 21/12' },
  { value: 'capricorn', label: '♑ Capricórnio', dates: '22/12 - 19/01' },
  { value: 'aquarius', label: '♒ Aquário', dates: '20/01 - 18/02' },
  { value: 'pisces', label: '♓ Peixes', dates: '19/02 - 20/03' }
]

export function HoroscopeGenerator() {
  const [selectedSign, setSelectedSign] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [birthDate, setBirthDate] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null)
  const [tokens, setTokens] = useKV('user-tokens', 5) // Start with 5 free tokens

  const generateHoroscope = async () => {
    if (!selectedSign || !userName) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (tokens <= 0) {
      toast.error('Você não possui tokens suficientes. Adquira mais tokens para continuar!')
      return
    }

    setIsGenerating(true)

    try {
      // Simulate AI horoscope generation
      const today = new Date().toLocaleDateString('pt-BR')
      const selectedSignData = zodiacSigns.find(sign => sign.value === selectedSign)
      
      // Create prompt for AI generation
      const prompt = spark.llmPrompt`
        Você é um astrólogo místico especialista. Gere um horóscopo personalizado para ${userName}, 
        do signo ${selectedSignData?.label}, para o dia ${today}.
        
        O horóscopo deve incluir:
        - Uma previsão detalhada e envolvente (2-3 parágrafos)
        - Humor/energia do dia 
        - 3 números da sorte
        - Signo mais compatível hoje
        
        Use linguagem mística mas acessível, seja específico e inspirador.
        Retorne APENAS um JSON válido com as chaves: reading, mood, lucky_numbers (array), compatibility.
      `

      const response = await spark.llm(prompt, 'gpt-4o', true)
      const aiHoroscope = JSON.parse(response)

      const newHoroscope: HoroscopeData = {
        sign: selectedSign,
        date: today,
        reading: aiHoroscope.reading,
        mood: aiHoroscope.mood,
        lucky_numbers: aiHoroscope.lucky_numbers,
        compatibility: aiHoroscope.compatibility
      }

      setHoroscope(newHoroscope)
      setTokens(currentTokens => currentTokens - 1)
      toast.success('Horóscopo gerado com sucesso! ✨')

      // Save to history
      const history = await spark.kv.get('horoscope-history') || []
      await spark.kv.set('horoscope-history', [...history, newHoroscope])

    } catch (error) {
      console.error('Error generating horoscope:', error)
      toast.error('Erro ao consultar os astros. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const selectedSignData = zodiacSigns.find(sign => sign.value === selectedSign)

  return (
    <section id="horoscope" className="py-24 bg-gradient-cosmic">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Consulte os Astros
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra o que as estrelas reservam para você hoje com nosso horóscopo personalizado por IA
            </p>
            
            {/* Token Counter */}
            <motion.div 
              className="flex items-center justify-center gap-2 mt-6 glass p-3 rounded-xl w-fit mx-auto"
              whileHover={{ scale: 1.05 }}
            >
              <Coins size={20} className="text-accent" />
              <span className="font-medium">{tokens} tokens restantes</span>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Seus Dados Cósmicos</CardTitle>
                <CardDescription>Preencha as informações para uma leitura personalizada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite seu nome"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sign">Signo *</Label>
                  <Select value={selectedSign} onValueChange={setSelectedSign}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Selecione seu signo" />
                    </SelectTrigger>
                    <SelectContent>
                      {zodiacSigns.map((sign) => (
                        <SelectItem key={sign.value} value={sign.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{sign.label}</span>
                            <span className="text-xs text-muted-foreground ml-2">{sign.dates}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth-date">Data de Nascimento (opcional)</Label>
                  <Input
                    id="birth-date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <Button 
                  onClick={generateHoroscope}
                  disabled={isGenerating || !selectedSign || !userName || tokens <= 0}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Consultando os Astros...
                    </>
                  ) : (
                    <>
                      <Star className="mr-2 h-4 w-4" />
                      Gerar Horóscopo (1 token)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Horoscope */}
            <AnimatePresence mode="wait">
              {horoscope ? (
                <motion.div
                  key="horoscope"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="glass border-accent/20 h-fit">
                    <CardHeader className="text-center">
                      <div className="text-4xl mb-2">
                        {selectedSignData?.label.split(' ')[0]}
                      </div>
                      <CardTitle className="font-display text-2xl">
                        Horóscopo de {userName}
                      </CardTitle>
                      <CardDescription>{horoscope.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-foreground leading-relaxed">{horoscope.reading}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                          <Heart className="text-primary" size={20} />
                          <div>
                            <div className="font-medium text-sm">Energia do Dia</div>
                            <div className="text-muted-foreground text-sm">{horoscope.mood}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
                          <Star className="text-accent" size={20} />
                          <div>
                            <div className="font-medium text-sm">Números da Sorte</div>
                            <div className="flex gap-2 mt-1">
                              {horoscope.lucky_numbers.map((num, index) => (
                                <Badge key={index} variant="secondary" className="bg-accent/20">
                                  {num}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-primary/20 rounded-lg">
                          <Heart className="text-primary" size={20} />
                          <div>
                            <div className="font-medium text-sm">Compatibilidade</div>
                            <div className="text-muted-foreground text-sm">{horoscope.compatibility}</div>
                          </div>
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
                    <div className="text-6xl">✨</div>
                    <p className="text-muted-foreground">
                      Preencha os dados ao lado para receber sua leitura cósmica personalizada
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}