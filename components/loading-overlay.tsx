"use client"

import { useEffect, useState } from "react"
import { Dumbbell, Brain, FileText, Sparkles } from "lucide-react"

const loadingSteps = [
  {
    icon: Brain,
    title: "Analisando seu perfil...",
    description: "Nossa IA está processando suas informações",
  },
  {
    icon: Dumbbell,
    title: "Selecionando exercícios...",
    description: "Escolhendo os melhores exercícios para seus objetivos",
  },
  {
    icon: Sparkles,
    title: "Personalizando seu treino...",
    description: "Ajustando séries, repetições e descanso",
  },
  {
    icon: FileText,
    title: "Gerando seu PDF...",
    description: "Preparando seu plano de treino completo",
  },
]

interface LoadingOverlayProps {
  userName?: string
}

export function LoadingOverlay({ userName }: LoadingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Avança para próximo step a cada 3 segundos
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev))
    }, 3000)

    // Atualiza o progresso gradualmente
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        return prev + Math.random() * 2
      })
    }, 200)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [])

  const CurrentIcon = loadingSteps[currentStep].icon

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 text-center">
        {/* Logo animado */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center animate-pulse">
            <CurrentIcon className="w-12 h-12 text-primary animate-bounce" />
          </div>
          {/* Círculos de glow animados */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-primary/20 animate-ping" />
          </div>
        </div>

        {/* Saudação personalizada */}
        {userName && (
          <p className="text-muted-foreground mb-2 text-sm">
            Olá, <span className="text-primary font-semibold">{userName}</span>!
          </p>
        )}

        {/* Título do step atual */}
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 transition-all duration-500">
          {loadingSteps[currentStep].title}
        </h2>

        {/* Descrição do step */}
        <p className="text-muted-foreground mb-8 transition-all duration-500">
          {loadingSteps[currentStep].description}
        </p>

        {/* Barra de progresso */}
        <div className="w-full bg-muted rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Indicadores de steps */}
        <div className="flex justify-center gap-2 mb-6">
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStep ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Mensagem de aguarde */}
        <p className="text-xs text-muted-foreground animate-pulse">
          Isso pode levar alguns segundos. Por favor, aguarde...
        </p>
      </div>
    </div>
  )
}
