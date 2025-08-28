import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Star, Heart, Trash2, Eye } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface HoroscopeHistoryItem {
  sign: string
  date: string
  reading: string
  mood: string
  lucky_numbers: number[]
  compatibility: string
}

export function HoroscopeHistory() {
  const [history, setHistory] = useKV('horoscope-history', [])
  const [selectedReading, setSelectedReading] =
    useState<HoroscopeHistoryItem | null>(null)
  const [showFullHistory, setShowFullHistory] = useState(false)

  const zodiacSigns = [
    { value: 'aries', label: '♈ Áries' },
    { value: 'taurus', label: '♉ Touro' },
    { value: 'gemini', label: '♊ Gêmeos' },
    { value: 'cancer', label: '♋ Câncer' },
    { value: 'leo', label: '♌ Leão' },
    { value: 'virgo', label: '♍ Virgem' },
    { value: 'libra', label: '♎ Libra' },
    { value: 'scorpio', label: '♏ Escorpião' },
    { value: 'sagittarius', label: '♐ Sagitário' },
    { value: 'capricorn', label: '♑ Capricórnio' },
    { value: 'aquarius', label: '♒ Aquário' },
    { value: 'pisces', label: '♓ Peixes' },
  ]

  const getSignEmoji = (sign: string) => {
    const signData = zodiacSigns.find(s => s.value === sign)
    return signData ? signData.label.split(' ')[0] : '⭐'
  }

  const clearHistory = async () => {
    setHistory([])
    setSelectedReading(null)
    toast.success('Histórico limpo com sucesso')
  }

  const deleteReading = async (index: number) => {
    setHistory((currentHistory: HoroscopeHistoryItem[]) =>
      currentHistory.filter((_, i) => i !== index)
    )
    if (selectedReading) {
      setSelectedReading(null)
    }
    toast.success('Leitura removida')
  }

  const displayedHistory = showFullHistory ? history : history.slice(0, 3)

  if (!history || history.length === 0) {
    return (
      <section
        id="history"
        className="py-16 bg-gradient-to-br from-secondary/10 to-primary/5"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="text-6xl">📜</div>
              <h3 className="font-display font-semibold text-2xl text-foreground">
                Nenhum Horóscopo Ainda
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Você ainda não consultou os astros. Que tal gerar seu primeiro
                horóscopo personalizado e começar sua jornada de
                autoconhecimento cósmico?
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-secondary/10 to-primary/5">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Seu{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Histórico Cósmico
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Reveja suas consultas astrológicas anteriores e acompanhe sua
              jornada de autoconhecimento
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <Badge variant="secondary" className="px-4 py-2">
                <Clock size={16} className="mr-2" />
                {history.length} consulta{history.length !== 1 ? 's' : ''}{' '}
                realizada{history.length !== 1 ? 's' : ''}
              </Badge>

              {history.length > 0 && (
                <Button
                  onClick={clearHistory}
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <Trash2 size={16} className="mr-2" />
                  Limpar Histórico
                </Button>
              )}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* History List */}
            <div className="space-y-6">
              <h3 className="font-display font-semibold text-xl">
                Consultas Recentes
              </h3>

              <div className="space-y-4">
                <AnimatePresence>
                  {displayedHistory.map(
                    (reading: HoroscopeHistoryItem, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card
                          className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
                            selectedReading === reading
                              ? 'border-primary bg-primary/5'
                              : 'border-border/50 hover:border-primary/30'
                          }`}
                          onClick={() => setSelectedReading(reading)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">
                                {getSignEmoji(reading.sign)}
                              </div>
                              <div>
                                <div className="font-medium text-foreground">
                                  {reading.date}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {reading.mood}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                onClick={e => {
                                  e.stopPropagation()
                                  setSelectedReading(reading)
                                }}
                                variant="ghost"
                                size="sm"
                              >
                                <Eye size={16} />
                              </Button>
                              <Button
                                onClick={e => {
                                  e.stopPropagation()
                                  deleteReading(index)
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )
                  )}
                </AnimatePresence>
              </div>

              {history.length > 3 && (
                <Button
                  onClick={() => setShowFullHistory(!showFullHistory)}
                  variant="outline"
                  className="w-full"
                >
                  {showFullHistory
                    ? 'Ver Menos'
                    : `Ver Todas (${history.length - 3} mais)`}
                </Button>
              )}
            </div>

            {/* Selected Reading Details */}
            <div className="space-y-6">
              <h3 className="font-display font-semibold text-xl">
                Detalhes da Consulta
              </h3>

              <AnimatePresence mode="wait">
                {selectedReading ? (
                  <motion.div
                    key="reading"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6">
                      <CardHeader className="text-center px-0 pt-0">
                        <div className="text-4xl mb-2">
                          {getSignEmoji(selectedReading.sign)}
                        </div>
                        <CardTitle className="font-display text-xl">
                          Consulta de {selectedReading.date}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="px-0 space-y-6">
                        <div className="prose prose-sm max-w-none">
                          <p className="text-foreground leading-relaxed">
                            {selectedReading.reading}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                            <Heart className="text-primary" size={20} />
                            <div>
                              <div className="font-medium text-sm">
                                Energia do Dia
                              </div>
                              <div className="text-muted-foreground text-sm">
                                {selectedReading.mood}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
                            <Star className="text-accent" size={20} />
                            <div>
                              <div className="font-medium text-sm">
                                Números da Sorte
                              </div>
                              <div className="flex gap-2 mt-1">
                                {selectedReading.lucky_numbers.map(
                                  (num, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="bg-accent/20"
                                    >
                                      {num}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-primary/20 rounded-lg">
                            <Heart className="text-primary" size={20} />
                            <div>
                              <div className="font-medium text-sm">
                                Compatibilidade
                              </div>
                              <div className="text-muted-foreground text-sm">
                                {selectedReading.compatibility}
                              </div>
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
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center h-full min-h-[400px]"
                  >
                    <div className="text-center space-y-4">
                      <div className="text-6xl">✨</div>
                      <p className="text-muted-foreground">
                        Selecione uma consulta ao lado para ver os detalhes
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
