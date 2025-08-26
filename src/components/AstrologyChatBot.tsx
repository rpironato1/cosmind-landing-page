import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatCircle, PaperPlaneTilt, Robot, User, Sparkles, Star, Coins } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  tokensUsed?: number
}

export function AstrologyChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useKV('chat-history', [])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tokens, setTokens] = useKV('user-tokens', 5)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim()) return
    
    if (tokens <= 0) {
      toast.error('Você não possui tokens suficientes para conversar com a IA mística!')
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    }

    setMessages((current: ChatMessage[]) => [...current, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Create AI prompt for astrology chat
      const prompt = spark.llmPrompt`
        Você é uma IA mística especializada em astrologia, tarô e ciências esotéricas. 
        Responda à seguinte pergunta de forma envolvente, mística mas acessível:
        
        Pergunta do usuário: ${inputValue}
        
        Diretrizes:
        - Use linguagem mística e envolvente
        - Seja específico e útil
        - Inclua referências astrológicas quando relevante
        - Mantenha o tom místico mas informativo
        - Limite a resposta a 2-3 parágrafos
        - Use emojis esotéricos quando apropriado (✨🌙⭐🔮)
      `

      const response = await spark.llm(prompt, 'gpt-4o')

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
        tokensUsed: 1
      }

      setMessages((current: ChatMessage[]) => [...current, aiMessage])
      setTokens(currentTokens => currentTokens - 1)
      toast.success('Consulta realizada com sucesso! ✨')

    } catch (error) {
      console.error('Error in chat:', error)
      toast.error('Erro ao consultar a IA mística. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    toast.success('Histórico de conversa limpo')
  }

  const welcomeMessage = {
    id: 'welcome',
    content: '🔮 Olá! Sou sua IA mística pessoal. Posso ajudar com questões sobre astrologia, compatibilidade entre signos, interpretação de mapas astrais, tarô e muito mais. Como posso iluminar seu caminho hoje? ✨',
    isUser: false,
    timestamp: new Date()
  }

  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-300 relative"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChatCircle size={28} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Robot size={28} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Notification dot for new features */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="h-full flex flex-col glass border-primary/20 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                      <CardTitle className="font-display text-lg">IA Mística</CardTitle>
                      <p className="text-sm text-muted-foreground">Consultora Astrológica</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Coins size={12} className="mr-1" />
                      {tokens}
                    </Badge>
                    <Button
                      onClick={clearChat}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                    >
                      Limpar
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Area */}
                <ScrollArea className="flex-1 px-4">
                  <div className="space-y-4 pb-4">
                    <AnimatePresence>
                      {displayMessages.map((message: ChatMessage) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          {!message.isUser && (
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                              <Robot size={16} className="text-white" />
                            </div>
                          )}
                          
                          <div className={`max-w-[280px] p-3 rounded-xl ${
                            message.isUser 
                              ? 'bg-gradient-to-br from-primary to-accent text-white ml-8' 
                              : 'bg-secondary/50 text-foreground mr-8'
                          }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                            <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                              <span>
                                {message.timestamp.toLocaleTimeString('pt-BR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              {message.tokensUsed && (
                                <span className="flex items-center gap-1">
                                  <Coins size={10} />
                                  {message.tokensUsed}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {message.isUser && (
                            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                              <User size={16} className="text-foreground" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                          <Robot size={16} className="text-white" />
                        </div>
                        <div className="bg-secondary/50 p-3 rounded-xl">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t border-border/50">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Pergunte sobre astrologia, tarô, mapas astrais..."
                      disabled={isLoading || tokens <= 0}
                      className="flex-1 bg-background/50"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={isLoading || !inputValue.trim() || tokens <= 0}
                      size="sm"
                      className="bg-gradient-to-r from-primary to-accent"
                    >
                      <PaperPlaneTilt size={16} />
                    </Button>
                  </div>
                  
                  {tokens <= 0 && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Você precisa de tokens para conversar com a IA mística
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}