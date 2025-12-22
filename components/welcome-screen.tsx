"use client"

import { Button } from "@/components/ui/button"
import { Bot, Brain, Sparkles, Zap, ChevronRight, Clock, Target, TrendingUp } from "lucide-react"
import { Footer } from "@/components/footer"

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('/gym-workout-dark-atmosphere.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-cyan-500/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />

        {/* Animated glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 md:w-96 h-64 md:h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/50 rounded-xl md:rounded-2xl blur-xl animate-pulse" />
              <div className="relative p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-primary/80 border border-primary/50 shadow-2xl shadow-primary/30">
                <Bot className="h-8 w-8 md:h-12 md:w-12 text-primary-foreground" />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/30 mb-4 md:mb-6">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary animate-pulse" />
            <span className="text-xs md:text-sm font-medium text-primary">Powered by Artificial Intelligence</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-foreground mb-3 md:mb-4 tracking-tight text-balance">
            Seu Personal Trainer
            <span className="block text-primary mt-1 md:mt-2">100% Inteligente</span>
          </h1>

          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3 md:mb-4 leading-relaxed px-2">
            Treinos personalizados criados por{" "}
            <span className="text-foreground font-semibold">Inteligência Artificial</span> em segundos.
          </p>

          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-6 md:mb-8 px-2">
            Responda algumas perguntas e nossa IA irá criar o treino perfeito para você.
          </p>

          <Button
            size="lg"
            onClick={onStart}
            className="text-base md:text-lg px-6 md:px-10 py-6 md:py-7 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            <Brain className="mr-2 h-5 w-5 md:h-6 md:w-6" />
            Criar Meu Treino com IA
            <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
          </Button>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 mt-8 md:mt-12 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              <span className="text-xs md:text-sm">
                Treino em <span className="text-foreground font-semibold">30 segundos</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              <span className="text-xs md:text-sm">
                <span className="text-foreground font-semibold">100%</span> personalizado
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              <span className="text-xs md:text-sm">
                Baseado em <span className="text-foreground font-semibold">ciência</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <h2 className="text-xl md:text-2xl font-bold text-center text-foreground mb-8 md:mb-12">
            Por que escolher um <span className="text-primary">Personal IA</span>?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="flex flex-col items-center text-center p-6 md:p-8 rounded-xl md:rounded-2xl bg-secondary/30 border border-border hover:border-primary/30 transition-colors">
              <div className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4 md:mb-5">
                <Brain className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3">IA Especializada</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Treinada com milhares de protocolos de treino e metodologias científicas
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 md:p-8 rounded-xl md:rounded-2xl bg-secondary/30 border border-border hover:border-primary/30 transition-colors">
              <div className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4 md:mb-5">
                <Zap className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3">Instantâneo</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Seu treino completo é gerado em segundos, pronto para começar
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 md:p-8 rounded-xl md:rounded-2xl bg-secondary/30 border border-border hover:border-primary/30 transition-colors">
              <div className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4 md:mb-5">
                <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3">Personalizado</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Cada treino é único, criado para seus objetivos e limitações
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
