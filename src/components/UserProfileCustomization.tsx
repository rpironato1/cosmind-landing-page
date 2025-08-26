import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { UserCircle, Star, Heart, Brain, MapPin, Calendar, Clock, Sparkles } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface UserProfile {
  personalInfo: {
    name: string
    birthDate: string
    birthTime: string
    birthPlace: string
    zodiacSign: string
  }
  preferences: {
    favoriteTopics: string[]
    consultationStyle: 'mystical' | 'practical' | 'detailed' | 'brief'
    language: 'pt' | 'en' | 'es'
    notifications: boolean
  }
  astrologyInterests: {
    primaryFocus: string[]
    experienceLevel: 'beginner' | 'intermediate' | 'advanced'
    favoriteAspects: string[]
  }
  cosmicProfile: {
    moonSign: string
    risingSign: string
    venusSign: string
    marsSign: string
    dominantElement: string
    personalityTraits: string[]
  }
}

export function UserProfileCustomization() {
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useKV('user-profile', {
    personalInfo: {
      name: '',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
      zodiacSign: ''
    },
    preferences: {
      favoriteTopics: [],
      consultationStyle: 'mystical',
      language: 'pt',
      notifications: true
    },
    astrologyInterests: {
      primaryFocus: [],
      experienceLevel: 'beginner',
      favoriteAspects: []
    },
    cosmicProfile: {
      moonSign: '',
      risingSign: '',
      venusSign: '',
      marsSign: '',
      dominantElement: '',
      personalityTraits: []
    }
  })
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  const zodiacSigns = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ]

  const astrologyTopics = [
    'Horóscopo Diário', 'Compatibilidade Amorosa', 'Carreira & Finanças',
    'Mapa Astral', 'Trânsitos Planetários', 'Numerologia',
    'Tarô', 'Chakras & Energia', 'Meditação Cósmica'
  ]

  const astrologyAspects = [
    'Conjunção', 'Oposição', 'Trígono', 'Quadratura', 'Sextil',
    'Quincúncio', 'Semi-sextil', 'Semi-quadratura'
  ]

  const personalityTraits = [
    'Intuitivo', 'Analítico', 'Criativo', 'Prático', 'Espiritual',
    'Ambicioso', 'Empático', 'Independente', 'Comunicativo', 'Reservado'
  ]

  const generateCosmicProfile = async () => {
    if (!profile.personalInfo.birthDate || !profile.personalInfo.zodiacSign) {
      toast.error('Preencha sua data de nascimento e signo primeiro')
      return
    }

    setIsGeneratingProfile(true)

    try {
      const prompt = spark.llmPrompt`
        Com base nas informações astrológicas:
        - Data de nascimento: ${profile.personalInfo.birthDate}
        - Signo solar: ${profile.personalInfo.zodiacSign}
        - Local de nascimento: ${profile.personalInfo.birthPlace || 'não informado'}
        - Horário: ${profile.personalInfo.birthTime || 'não informado'}
        
        Gere um perfil cósmico completo incluindo:
        1. Signo lunar provável
        2. Ascendente estimado
        3. Vênus e Marte em signos
        4. Elemento dominante
        5. 5 traços de personalidade principais
        
        Retorne apenas um JSON válido com as chaves:
        moonSign, risingSign, venusSign, marsSign, dominantElement, personalityTraits (array)
      `

      const response = await spark.llm(prompt, 'gpt-4o', true)
      const cosmicData = JSON.parse(response)

      setProfile((current: UserProfile) => ({
        ...current,
        cosmicProfile: {
          ...current.cosmicProfile,
          ...cosmicData
        }
      }))

      toast.success('Perfil cósmico gerado com sucesso! ✨')

    } catch (error) {
      console.error('Error generating cosmic profile:', error)
      toast.error('Erro ao gerar perfil cósmico. Tente novamente.')
    } finally {
      setIsGeneratingProfile(false)
    }
  }

  const updateProfile = (section: keyof UserProfile, field: string, value: any) => {
    setProfile((current: UserProfile) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value
      }
    }))
  }

  const toggleArrayItem = (section: keyof UserProfile, field: string, item: string) => {
    setProfile((current: UserProfile) => {
      const currentArray = (current[section] as any)[field] || []
      const newArray = currentArray.includes(item)
        ? currentArray.filter((i: string) => i !== item)
        : [...currentArray, item]
      
      return {
        ...current,
        [section]: {
          ...current[section],
          [field]: newArray
        }
      }
    })
  }

  const saveProfile = () => {
    toast.success('Perfil salvo com sucesso! 🌟')
    setIsOpen(false)
  }

  const tabs = [
    { id: 'personal', label: 'Pessoal', icon: UserCircle },
    { id: 'preferences', label: 'Preferências', icon: Heart },
    { id: 'interests', label: 'Interesses', icon: Star },
    { id: 'cosmic', label: 'Perfil Cósmico', icon: Sparkles }
  ]

  return (
    <>
      {/* Profile Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <UserCircle size={20} />
        {!profile.personalInfo.name && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
        )}
      </Button>

      {/* Profile Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="h-full glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle size={24} className="text-primary" />
                    Perfil Cósmico Personalizado
                  </CardTitle>
                  <CardDescription>
                    Configure suas informações para consultas mais precisas e personalizadas
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row h-[600px]">
                    {/* Tabs */}
                    <div className="lg:w-64 p-6 border-r border-border/50">
                      <div className="space-y-2">
                        {tabs.map((tab) => {
                          const IconComponent = tab.icon
                          return (
                            <Button
                              key={tab.id}
                              variant={activeTab === tab.id ? "default" : "ghost"}
                              className="w-full justify-start"
                              onClick={() => setActiveTab(tab.id)}
                            >
                              <IconComponent size={16} className="mr-2" />
                              {tab.label}
                            </Button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                      <AnimatePresence mode="wait">
                        {activeTab === 'personal' && (
                          <motion.div
                            key="personal"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <h3 className="font-display text-xl mb-4">Informações Pessoais</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input
                                  id="name"
                                  value={profile.personalInfo.name}
                                  onChange={(e) => updateProfile('personalInfo', 'name', e.target.value)}
                                  placeholder="Seu nome"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="birthDate">Data de Nascimento</Label>
                                <Input
                                  id="birthDate"
                                  type="date"
                                  value={profile.personalInfo.birthDate}
                                  onChange={(e) => updateProfile('personalInfo', 'birthDate', e.target.value)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="birthTime">Horário de Nascimento</Label>
                                <Input
                                  id="birthTime"
                                  type="time"
                                  value={profile.personalInfo.birthTime}
                                  onChange={(e) => updateProfile('personalInfo', 'birthTime', e.target.value)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="zodiacSign">Signo Solar</Label>
                                <Select
                                  value={profile.personalInfo.zodiacSign}
                                  onValueChange={(value) => updateProfile('personalInfo', 'zodiacSign', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione seu signo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {zodiacSigns.map((sign) => (
                                      <SelectItem key={sign} value={sign}>
                                        {sign.charAt(0).toUpperCase() + sign.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="birthPlace">Local de Nascimento</Label>
                              <Input
                                id="birthPlace"
                                value={profile.personalInfo.birthPlace}
                                onChange={(e) => updateProfile('personalInfo', 'birthPlace', e.target.value)}
                                placeholder="Cidade, Estado, País"
                              />
                            </div>
                          </motion.div>
                        )}

                        {activeTab === 'preferences' && (
                          <motion.div
                            key="preferences"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <h3 className="font-display text-xl mb-4">Preferências de Consulta</h3>
                            
                            <div className="space-y-6">
                              <div className="space-y-3">
                                <Label>Tópicos de Interesse</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                  {astrologyTopics.map((topic) => (
                                    <Badge
                                      key={topic}
                                      variant={profile.preferences.favoriteTopics.includes(topic) ? "default" : "outline"}
                                      className="cursor-pointer justify-center p-2"
                                      onClick={() => toggleArrayItem('preferences', 'favoriteTopics', topic)}
                                    >
                                      {topic}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Estilo de Consulta</Label>
                                <Select
                                  value={profile.preferences.consultationStyle}
                                  onValueChange={(value) => updateProfile('preferences', 'consultationStyle', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="mystical">Místico e Espiritual</SelectItem>
                                    <SelectItem value="practical">Prático e Objetivo</SelectItem>
                                    <SelectItem value="detailed">Detalhado e Profundo</SelectItem>
                                    <SelectItem value="brief">Breve e Direto</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {activeTab === 'interests' && (
                          <motion.div
                            key="interests"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <h3 className="font-display text-xl mb-4">Interesses Astrológicos</h3>
                            
                            <div className="space-y-6">
                              <div className="space-y-2">
                                <Label>Nível de Experiência</Label>
                                <Select
                                  value={profile.astrologyInterests.experienceLevel}
                                  onValueChange={(value) => updateProfile('astrologyInterests', 'experienceLevel', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="beginner">Iniciante</SelectItem>
                                    <SelectItem value="intermediate">Intermediário</SelectItem>
                                    <SelectItem value="advanced">Avançado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-3">
                                <Label>Aspectos Astrológicos Favoritos</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                  {astrologyAspects.map((aspect) => (
                                    <Badge
                                      key={aspect}
                                      variant={profile.astrologyInterests.favoriteAspects.includes(aspect) ? "default" : "outline"}
                                      className="cursor-pointer justify-center p-2"
                                      onClick={() => toggleArrayItem('astrologyInterests', 'favoriteAspects', aspect)}
                                    >
                                      {aspect}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {activeTab === 'cosmic' && (
                          <motion.div
                            key="cosmic"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-display text-xl">Perfil Cósmico Avançado</h3>
                              <Button
                                onClick={generateCosmicProfile}
                                disabled={isGeneratingProfile}
                                variant="outline"
                                size="sm"
                              >
                                {isGeneratingProfile ? (
                                  <>
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      className="mr-2"
                                    >
                                      <Sparkles size={16} />
                                    </motion.div>
                                    Gerando...
                                  </>
                                ) : (
                                  <>
                                    <Brain size={16} className="mr-2" />
                                    Gerar com IA
                                  </>
                                )}
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Signo Lunar</Label>
                                <Select
                                  value={profile.cosmicProfile.moonSign}
                                  onValueChange={(value) => updateProfile('cosmicProfile', 'moonSign', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {zodiacSigns.map((sign) => (
                                      <SelectItem key={sign} value={sign}>
                                        {sign.charAt(0).toUpperCase() + sign.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Ascendente</Label>
                                <Select
                                  value={profile.cosmicProfile.risingSign}
                                  onValueChange={(value) => updateProfile('cosmicProfile', 'risingSign', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {zodiacSigns.map((sign) => (
                                      <SelectItem key={sign} value={sign}>
                                        {sign.charAt(0).toUpperCase() + sign.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <Label>Traços de Personalidade</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {personalityTraits.map((trait) => (
                                  <Badge
                                    key={trait}
                                    variant={profile.cosmicProfile.personalityTraits.includes(trait) ? "default" : "outline"}
                                    className="cursor-pointer justify-center p-2"
                                    onClick={() => toggleArrayItem('cosmicProfile', 'personalityTraits', trait)}
                                  >
                                    {trait}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="p-6 flex justify-between">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={saveProfile} className="bg-gradient-to-r from-primary to-accent">
                      <UserCircle size={16} className="mr-2" />
                      Salvar Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}