"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { QuestionCard } from "@/components/question-card"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import type { UserData, Question, AssessmentResult } from "@/types/assessment"
import { Footer } from "@/components/footer"
import { LoadingOverlay } from "./loading-overlay"
import { AppHeader } from "@/components/app-header"

const labelMap: Record<string, string> = {
  // Gênero
  male: "Masculino",
  female: "Feminino",
  other: "Prefiro não dizer",
  // Objetivo
  muscle: "Ganho de Massa",
  "weight-loss": "Emagrecimento",
  conditioning: "Condicionamento",
  strength: "Força",
  flexibility: "Flexibilidade",
  health: "Saúde Geral",
  // Experiência
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
  // Frequência
  "2": "2 dias",
  "3": "3 dias",
  "4": "4 dias",
  "5": "5 dias",
  "6": "6 dias",
  // Equipamentos
  dumbbells: "Halteres",
  barbells: "Barras",
  machines: "Máquinas",
  cables: "Cabos",
  bodyweight: "Peso Corporal",
  kettlebell: "Kettlebell",
  // Grupos Musculares
  chest: "Peito",
  back: "Costas",
  shoulders: "Ombros",
  arms: "Braços",
  legs: "Pernas",
  glutes: "Glúteos",
  core: "Abdômen",
  // Disponibilidade
  "30": "30 minutos",
  "45": "45 minutos",
  "60": "1 hora",
  "90": "1h30",
  // Nível de Atividade
  sedentary: "Sedentário",
  light: "Levemente Ativo",
  moderate: "Moderadamente Ativo",
  very: "Muito Ativo",
  athlete: "Atleta",
  // Biotipo
  ectomorph: "Ectomorfo",
  mesomorph: "Mesomorfo",
  endomorph: "Endomorfo",
  // Preferência de Treino
  short: "Curto e Intenso",
  moderate: "Moderado",
  long: "Longo e Moderado",
  // Horário
  morning: "Manhã",
  afternoon: "Tarde",
  evening: "Noite",
  flexible: "Flexível",
  // Dieta
  balanced: "Balanceada",
  lowCarb: "Low Carb",
  highProtein: "High Protein",
  vegetarian: "Vegetariana",
  vegan: "Vegana",
  // Experiência Prévia
  never: "Nunca Treinei",
  stopped: "Já Treinei (Parei)",
  active: "Treino Atualmente",
}

function translateToPortuguese(value: string | string[]): string | string[] {
  if (Array.isArray(value)) {
    return value.map((v) => labelMap[v] || v)
  }
  return labelMap[value] || value
}

const questions: Question[] = [
  {
    id: "name",
    title: "Qual o nome do aluno?",
    subtitle: "Vamos personalizar a experiência",
    type: "text",
    required: true,
  },
  {
    id: "age",
    title: "Qual a idade?",
    subtitle: "Isso nos ajuda a adequar a intensidade",
    type: "number",
    required: true,
  },
  {
    id: "gender",
    title: "Qual o gênero?",
    subtitle: "Para personalizar os exercícios",
    type: "card-select",
    options: [
      { id: "male", label: "Masculino", image: "/muscular-man-fitness-silhouette.jpg" },
      { id: "female", label: "Feminino", image: "/fit-woman-fitness-silhouette.jpg" },
      { id: "other", label: "Prefiro não dizer", image: "/gender-neutral-fitness-person-silhouette.jpg" },
    ],
  },
  {
    id: "weight",
    title: "Qual o peso atual (kg)?",
    subtitle: "Para calcular intensidade e progressão",
    type: "number",
    required: true,
  },
  {
    id: "height",
    title: "Qual a altura (cm)?",
    subtitle: "Para calcular IMC e adequar exercícios",
    type: "number",
    required: true,
  },
  {
    id: "activityLevel",
    title: "Qual seu nível de atividade atual?",
    subtitle: "Considerando todas as atividades do dia a dia",
    type: "card-select",
    options: [
      {
        id: "sedentary",
        label: "Sedentário",
        image: "/sedentary-lifestyle-couch.jpg",
        description: "Pouca ou nenhuma atividade",
      },
      {
        id: "light",
        label: "Levemente Ativo",
        image: "/light-activity-walking.jpg",
        description: "Atividade leve 1-3x/semana",
      },
      {
        id: "moderate",
        label: "Moderadamente Ativo",
        image: "/moderate-activity-jogging.jpg",
        description: "Exercício moderado 3-5x/semana",
      },
      {
        id: "very",
        label: "Muito Ativo",
        image: "/very-active-intense-training.jpg",
        description: "Exercício intenso 6-7x/semana",
      },
      {
        id: "athlete",
        label: "Atleta",
        image: "/athlete-professional-training.jpg",
        description: "Treinamento profissional",
      },
    ],
  },
  {
    id: "goal",
    title: "Qual o objetivo principal?",
    subtitle: "Escolha o foco do treino",
    type: "card-select",
    options: [
      {
        id: "muscle",
        label: "Ganho de Massa",
        image: "/bodybuilder-muscles-gym.jpg",
        description: "Hipertrofia muscular",
      },
      {
        id: "weight-loss",
        label: "Emagrecimento",
        image: "/weight-loss-transformation-fitness.jpg",
        description: "Perda de gordura",
      },
      {
        id: "conditioning",
        label: "Condicionamento",
        image: "/cardio-running-athlete.jpg",
        description: "Resistência cardio",
      },
      { id: "strength", label: "Força", image: "/powerlifting-deadlift-strength.jpg", description: "Força máxima" },
      {
        id: "flexibility",
        label: "Flexibilidade",
        image: "/yoga-stretching-flexibility.png",
        description: "Mobilidade",
      },
      {
        id: "health",
        label: "Saúde Geral",
        image: "/healthy-lifestyle-wellness-fitness.jpg",
        description: "Bem-estar",
      },
    ],
  },
  {
    id: "specificGoal",
    title: "Qual a meta específica?",
    subtitle: "Ex: Perder 5kg, ganhar 3kg de massa, correr 5km",
    type: "text",
  },
  {
    id: "previousTraining",
    title: "Você já treinou antes?",
    subtitle: "Experiência prévia com treinos",
    type: "card-select",
    options: [
      { id: "never", label: "Nunca Treinei", image: "/beginner-first-day-gym.jpg", description: "Primeira vez" },
      {
        id: "stopped",
        label: "Já Treinei (Parei)",
        image: "/comeback-fitness-return.jpg",
        description: "Retornando aos treinos",
      },
      {
        id: "active",
        label: "Treino Atualmente",
        image: "/active-training-current.jpg",
        description: "Ativo regularmente",
      },
    ],
  },
  {
    id: "experience",
    title: "Qual o nível de experiência?",
    subtitle: "Isso define a complexidade dos exercícios",
    type: "card-select",
    options: [
      { id: "beginner", label: "Iniciante", image: "/beginner-gym-first-time-workout.jpg", description: "0-6 meses" },
      {
        id: "intermediate",
        label: "Intermediário",
        image: "/intermediate-gym-training-workout.jpg",
        description: "6 meses - 2 anos",
      },
      {
        id: "advanced",
        label: "Avançado",
        image: "/advanced-athlete-professional-training.jpg",
        description: "2+ anos",
      },
    ],
  },
  {
    id: "bodyType",
    title: "Qual seu biotipo corporal?",
    subtitle: "Tipo físico predominante",
    type: "card-select",
    options: [
      {
        id: "ectomorph",
        label: "Ectomorfo",
        image: "/ectomorph-body-type.jpg",
        description: "Magro, dificuldade para ganhar peso",
      },
      {
        id: "mesomorph",
        label: "Mesomorfo",
        image: "/mesomorph-body-type.jpg",
        description: "Atlético, ganha massa facilmente",
      },
      {
        id: "endomorph",
        label: "Endomorfo",
        image: "/endomorph-body-type.jpg",
        description: "Estrutura maior, tende a acumular gordura",
      },
    ],
  },
  {
    id: "frequency",
    title: "Quantos dias por semana?",
    subtitle: "Disponibilidade para treinar",
    type: "card-select",
    options: [
      { id: "2", label: "2 dias", image: "/calendar-two-days-workout-schedule.jpg", description: "Treino full body" },
      { id: "3", label: "3 dias", image: "/calendar-three-days-workout-schedule.jpg", description: "ABC clássico" },
      { id: "4", label: "4 dias", image: "/calendar-four-days-workout-schedule.jpg", description: "Upper/Lower" },
      { id: "5", label: "5 dias", image: "/calendar-five-days-workout-schedule.jpg", description: "Push/Pull/Legs" },
      { id: "6", label: "6 dias", image: "/calendar-six-days-workout-schedule.jpg", description: "Alto volume" },
    ],
  },
  {
    id: "availability",
    title: "Quanto tempo por sessão?",
    subtitle: "Duração média de cada treino",
    type: "card-select",
    options: [
      { id: "30", label: "30 minutos", image: "/timer-30-minutes-workout.jpg" },
      { id: "45", label: "45 minutos", image: "/timer-45-minutes-workout.jpg" },
      { id: "60", label: "1 hora", image: "/timer-60-minutes-workout.jpg" },
      { id: "90", label: "1h30", image: "/timer-90-minutes-workout.jpg" },
    ],
  },
  {
    id: "trainingPreference",
    title: "Preferência de intensidade?",
    subtitle: "Estilo de treino que mais te motiva",
    type: "card-select",
    options: [
      {
        id: "short",
        label: "Curto e Intenso",
        image: "/hiit-intense-workout.jpg",
        description: "Alta intensidade, menos tempo",
      },
      {
        id: "moderate",
        label: "Moderado",
        image: "/moderate-intensity-workout.jpg",
        description: "Equilíbrio entre intensidade e volume",
      },
      {
        id: "long",
        label: "Longo e Moderado",
        image: "/long-moderate-workout.jpg",
        description: "Mais volume, intensidade controlada",
      },
    ],
  },
  {
    id: "preferredTime",
    title: "Horário preferido para treinar?",
    subtitle: "Quando você tem mais energia e disposição",
    type: "card-select",
    options: [
      { id: "morning", label: "Manhã", image: "/morning-workout-sunrise.jpg", description: "5h - 11h" },
      { id: "afternoon", label: "Tarde", image: "/afternoon-workout.jpg", description: "12h - 17h" },
      { id: "evening", label: "Noite", image: "/evening-workout-night.jpg", description: "18h - 22h" },
      { id: "flexible", label: "Flexível", image: "/flexible-schedule-workout.jpg", description: "Qualquer horário" },
    ],
  },
  {
    id: "equipment",
    title: "Quais equipamentos disponíveis?",
    subtitle: "Selecione todos que tiver acesso",
    type: "multi-select",
    options: [
      { id: "dumbbells", label: "Halteres", image: "/dumbbells-gym-equipment.jpg" },
      { id: "barbells", label: "Barras", image: "/barbell-gym-equipment.jpg" },
      { id: "machines", label: "Máquinas", image: "/gym-machines-equipment.jpg" },
      { id: "cables", label: "Cabos", image: "/cable-machine-gym.jpg" },
      { id: "bodyweight", label: "Peso Corporal", image: "/bodyweight-exercise-calisthenics.jpg" },
      { id: "kettlebell", label: "Kettlebell", image: "/kettlebell-gym-equipment.jpg" },
    ],
  },
  {
    id: "muscleGroups",
    title: "Quais grupos musculares focar?",
    subtitle: "Selecione as prioridades do aluno",
    type: "multi-select",
    options: [
      { id: "chest", label: "Peito", image: "/chest-muscles-anatomy.jpg" },
      { id: "back", label: "Costas", image: "/back-muscles-anatomy.jpg" },
      { id: "shoulders", label: "Ombros", image: "/shoulder-muscles-anatomy.jpg" },
      { id: "arms", label: "Braços", image: "/arm-muscles-biceps.jpg" },
      { id: "legs", label: "Pernas", image: "/leg-muscles-anatomy.jpg" },
      { id: "glutes", label: "Glúteos", image: "/glutes-muscles-fitness.jpg" },
      { id: "core", label: "Abdômen", image: "/core-abs-muscles.jpg" },
    ],
  },
  {
    id: "limitations",
    title: "Possui alguma limitação física?",
    subtitle: "Lesões, restrições médicas ou condições especiais",
    type: "text",
  },
  {
    id: "dietType",
    title: "Qual seu estilo alimentar?",
    subtitle: "Isso ajuda a complementar o treino",
    type: "card-select",
    options: [
      {
        id: "balanced",
        label: "Balanceada",
        image: "/balanced-diet-healthy-food.jpg",
        description: "Todos os grupos alimentares",
      },
      {
        id: "lowCarb",
        label: "Low Carb",
        image: "/low-carb-diet-food.jpg",
        description: "Redução de carboidratos",
      },
      {
        id: "highProtein",
        label: "High Protein",
        image: "/high-protein-diet-food.jpg",
        description: "Alta proteína",
      },
      {
        id: "vegetarian",
        label: "Vegetariana",
        image: "/vegetarian-diet-food.jpg",
        description: "Sem carnes",
      },
      { id: "vegan", label: "Vegana", image: "/vegan-diet-plant-based.jpg", description: "100% vegetal" },
      {
        id: "flexible",
        label: "Sem Restrições",
        image: "/flexible-diet-variety-food.jpg",
        description: "Como de tudo",
      },
    ],
  },
]

async function sendToWebhook(data: UserData): Promise<{ success: boolean; pdfUrl?: string; error?: string }> {
  try {
    const payload = {
      name: data.name || "",
      age: data.age || "",
      gender: translateToPortuguese(data.gender || ""),
      weight: data.weight || "",
      height: data.height || "",
      activityLevel: translateToPortuguese(data.activityLevel || ""),
      goal: translateToPortuguese(data.goal || ""),
      specificGoal: data.specificGoal || "",
      previousTraining: translateToPortuguese(data.previousTraining || ""),
      experience: translateToPortuguese(data.experience || ""),
      bodyType: translateToPortuguese(data.bodyType || ""),
      frequency: translateToPortuguese(data.frequency || ""),
      availability: translateToPortuguese(data.availability || ""),
      trainingPreference: translateToPortuguese(data.trainingPreference || ""),
      preferredTime: translateToPortuguese(data.preferredTime || ""),
      equipment: translateToPortuguese(Array.isArray(data.equipment) ? data.equipment : []),
      muscleGroups: translateToPortuguese(Array.isArray(data.muscleGroups) ? data.muscleGroups : []),
      limitations: data.limitations || "",
      dietType: translateToPortuguese(data.dietType || ""),
      submittedAt: new Date().toISOString(),
    }

    console.log("[v0] Enviando dados para webhook:", payload)

    const response = await fetch("https://workspace.n8n.automatech.tech/webhook/perguntaspersonal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response OK:", response.ok)

    if (response.ok) {
      const contentType = response.headers.get("content-type")
      console.log("[v0] Content-Type:", contentType)

      if (contentType && contentType.includes("application/pdf")) {
        console.log("[v0] Resposta é PDF binário, criando blob...")
        const blob = await response.blob()
        console.log("[v0] Blob size:", blob.size, "bytes")
        const pdfUrl = URL.createObjectURL(blob)
        console.log("[v0] PDF URL criada:", pdfUrl)
        return { success: true, pdfUrl }
      }

      try {
        const responseText = await response.text()
        console.log("[v0] Response text:", responseText)

        if (!responseText || responseText.trim() === "" || responseText === "{}") {
          console.error("[v0] Webhook retornou resposta vazia")
          return {
            success: false,
            error: "O servidor processou os dados mas não retornou o PDF. Verifique a configuração do n8n.",
          }
        }

        const jsonData = JSON.parse(responseText)
        console.log("[v0] JSON parsed:", jsonData)

        const data = Array.isArray(jsonData) ? jsonData[0] : jsonData
        console.log("[v0] Data extracted:", data)

        if (data && data.pdf_url) {
          console.log("[v0] Encontrado pdf_url:", data.pdf_url)
          return { success: true, pdfUrl: data.pdf_url }
        }

        if (data && (data.pdfUrl || data.url)) {
          console.log("[v0] Encontrado pdfUrl/url:", data.pdfUrl || data.url)
          return { success: true, pdfUrl: data.pdfUrl || data.url }
        }

        console.warn("[v0] Nenhuma URL de PDF encontrada no JSON")
        return {
          success: false,
          error: "PDF não encontrado na resposta. Verifique se o n8n está retornando o campo 'pdf_url' corretamente.",
        }
      } catch (parseError) {
        console.error("[v0] Erro ao parsear JSON:", parseError)
        return { success: false, error: "Erro ao processar resposta do servidor." }
      }
    }

    console.error("[v0] Response não OK:", response.status)
    return { success: false, error: `Erro no servidor: ${response.status}` }
  } catch (error) {
    console.error("[v0] Erro ao enviar dados:", error)
    return { success: false, error: "Erro de conexão com o servidor. Verifique sua internet." }
  }
}

interface AssessmentFlowProps {
  userName: string
  onComplete: (result: AssessmentResult) => void
  onBack: () => void
}

export function AssessmentFlow({ userName, onComplete, onBack }: AssessmentFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Partial<UserData>>({
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    activityLevel: "",
    goal: "",
    specificGoal: "",
    previousTraining: "",
    experience: "",
    bodyType: "",
    frequency: "",
    availability: "",
    trainingPreference: "",
    preferredTime: "",
    equipment: [],
    muscleGroups: [],
    limitations: "",
    dietType: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  const handleAnswer = (value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setIsSubmitting(true)
      const userData: UserData = {
        name: answers.name || "",
        age: answers.age || "",
        gender: answers.gender || "",
        weight: answers.weight || "",
        height: answers.height || "",
        activityLevel: answers.activityLevel || "",
        goal: answers.goal || "",
        specificGoal: answers.specificGoal || "",
        previousTraining: answers.previousTraining || "",
        experience: answers.experience || "",
        bodyType: answers.bodyType || "",
        frequency: answers.frequency || "",
        availability: answers.availability || "",
        trainingPreference: answers.trainingPreference || "",
        preferredTime: answers.preferredTime || "",
        equipment: answers.equipment || [],
        muscleGroups: answers.muscleGroups || [],
        limitations: answers.limitations || "",
        dietType: answers.dietType || "",
      }

      const result = await sendToWebhook(userData)

      setIsSubmitting(false)

      onComplete({ userData, pdfUrl: result.pdfUrl, error: result.error })
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    } else {
      onBack()
    }
  }

  const currentValue = answers[currentQuestion.id]
  const isAnswered = currentQuestion.type === "multi-select" ? (currentValue as string[])?.length > 0 : !!currentValue

  const canProceed = currentQuestion.required ? isAnswered : true

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {isSubmitting && <LoadingOverlay userName={answers.name || userName} />}

      <AppHeader onLogout={onBack} />
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="text-muted-foreground h-8 px-2 md:px-3"
            >
              <ArrowLeft className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            <span className="text-xs md:text-sm text-muted-foreground">
              {currentIndex + 1} de {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-1.5 md:h-2" />
        </div>
      </header>

      <div className="flex-1 container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-5 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold text-foreground mb-1.5 md:mb-2">{currentQuestion.title}</h2>
            <p className="text-sm md:text-base text-muted-foreground">{currentQuestion.subtitle}</p>
          </div>

          {/* Text Input */}
          {currentQuestion.type === "text" && currentQuestion.id === "limitations" && (
            <div className="max-w-xl mx-auto">
              <Textarea
                placeholder="Descreva qualquer limitação física, lesão ou condição especial (opcional)"
                value={(currentValue as string) || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="min-h-28 md:min-h-32 bg-card border-border text-foreground text-base"
              />
            </div>
          )}

          {currentQuestion.type === "text" && currentQuestion.id === "name" && (
            <div className="max-w-xl mx-auto">
              <Input
                placeholder="Digite o nome do aluno"
                value={(currentValue as string) || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="h-12 md:h-14 bg-card border-border text-foreground text-base md:text-lg px-4"
              />
            </div>
          )}

          {currentQuestion.type === "text" && currentQuestion.id === "specificGoal" && (
            <div className="max-w-xl mx-auto">
              <Input
                placeholder="Ex: Perder 5kg, ganhar 3kg de massa, correr 5km"
                value={(currentValue as string) || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="h-12 md:h-14 bg-card border-border text-foreground text-base md:text-lg px-4"
              />
            </div>
          )}

          {/* Numeric Input */}
          {currentQuestion.type === "number" && (
            <div className="max-w-xl mx-auto">
              <Input
                type="number"
                placeholder={
                  currentQuestion.id === "age"
                    ? "Digite a idade"
                    : currentQuestion.id === "weight"
                      ? "Digite o peso em kg"
                      : "Digite a altura em cm"
                }
                value={(currentValue as string) || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="h-12 md:h-14 bg-card border-border text-foreground text-base md:text-lg px-4"
                min={currentQuestion.id === "age" ? "10" : currentQuestion.id === "weight" ? "30" : "100"}
                max={currentQuestion.id === "age" ? "100" : currentQuestion.id === "weight" ? "300" : "250"}
              />
            </div>
          )}

          {currentQuestion.type === "card-select" && currentQuestion.options && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-4">
              {currentQuestion.options.map((option) => (
                <QuestionCard
                  key={option.id}
                  option={option}
                  selected={currentValue === option.id}
                  onClick={() => handleAnswer(option.id)}
                />
              ))}
            </div>
          )}

          {currentQuestion.type === "multi-select" && currentQuestion.options && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4">
              {currentQuestion.options.map((option) => (
                <QuestionCard
                  key={option.id}
                  option={option}
                  selected={(currentValue as string[])?.includes(option.id)}
                  onClick={() => {
                    const current = (currentValue as string[]) || []
                    const updated = current.includes(option.id)
                      ? current.filter((id) => id !== option.id)
                      : [...current, option.id]
                    handleAnswer(updated)
                  }}
                  multiSelect
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="max-w-4xl mx-auto flex justify-end">
            <Button
              onClick={handleNext}
              disabled={(!canProceed && currentQuestion.required) || isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 h-10 md:h-11"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Enviando...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : currentIndex === questions.length - 1 ? (
                <>
                  <Check className="mr-1.5 md:mr-2 h-4 w-4" />
                  Finalizar
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Próxima</span>
                  <span className="sm:hidden">Próx</span>
                  <ArrowRight className="ml-1.5 md:ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
        <Footer />
      </footer>
    </div>
  )
}
