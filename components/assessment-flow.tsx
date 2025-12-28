"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { QuestionCard } from "@/components/question-card"
import { ArrowLeft, ArrowRight, Check, Loader2, Camera, Upload, X } from "lucide-react"
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
  muscle: "Hipertrofia",
  "weight-loss": "Emagrecimento",
  conditioning: "Performance",
  strength: "Força",
  flexibility: "Reeducação",
  health: "Saúde e Energia",
  // Atividade
  sedentary: "Sedentário",
  light: "Leve",
  "moderate-activity": "Moderado",
  very: "Muito Ativo",
  athlete: "Atleta de Elite",
  // Biotipo
  ectomorph: "Ectomorfo",
  mesomorph: "Mesomorfo",
  endomorph: "Endomorfo",
  // Dieta
  balanced: "Balanceada",
  lowCarb: "Low Carb",
  highProtein: "Alta Proteína",
  vegetarian: "Vegetariana",
  vegan: "Vegana",
  // Sono e Estresse
  good: "Excelente",
  moderate: "Moderado",
  poor: "Ruim",
  low: "Baixo",
  high: "Alto",
  // Hábitos
  always: "Sempre",
  sometimes: "Às vezes",
  never: "Raramente",
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
    title: "Qual o seu nome?",
    subtitle: "Vamos começar sua transformação",
    type: "text",
    required: true,
  },
  {
    id: "age",
    title: "Qual sua idade?",
    subtitle: "Importante para o cálculo metabólico",
    type: "number",
    required: true,
  },
  {
    id: "gender",
    title: "Qual seu gênero?",
    subtitle: "Para personalizar suas necessidades",
    type: "card-select",
    options: [
      { id: "male", label: "Masculino", image: "/muscular-man-fitness-silhouette.jpg" },
      { id: "female", label: "Feminino", image: "/fit-woman-fitness-silhouette.jpg" },
      { id: "other", label: "Prefiro não dizer", image: "/gender-neutral-fitness-person-silhouette.jpg" },
    ],
  },
  {
    id: "weight",
    title: "Qual seu peso atual (kg)?",
    subtitle: "Precisão é a chave do sucesso",
    type: "number",
    required: true,
  },
  {
    id: "height",
    title: "Qual sua altura (cm)?",
    subtitle: "Para calcularmos seu IMC",
    type: "number",
    required: true,
  },
  {
    id: "bodyType",
    title: "Qual seu biotipo corporal?",
    subtitle: "Como você descreveria sua estrutura?",
    type: "card-select",
    options: [
      { id: "ectomorph", label: "Ectomorfo", image: "/ectomorph-body-type.jpg", description: "Magro, dificuldade em ganhar peso" },
      { id: "mesomorph", label: "Mesomorfo", image: "/mesomorph-body-type.jpg", description: "Atlético, fácil ganho de massa" },
      { id: "endomorph", label: "Endomorfo", image: "/endomorph-body-type.jpg", description: "Largo, facilidade em acumular gordura" },
    ],
  },
  {
    id: "activityLevel",
    title: "Seu nível de atividade diária?",
    subtitle: "Incluindo trabalho e exercícios",
    type: "card-select",
    options: [
      { id: "sedentary", label: "Sedentário", image: "/sedentary-lifestyle-couch.jpg", description: "Trabalho sentado, pouco movimento" },
      { id: "light", label: "Levemente Ativo", image: "/light-activity-walking.jpg", description: "Caminhadas leves ou 1-2x treino" },
      { id: "moderate-activity", label: "Moderado", image: "/moderate-activity-jogging.jpg", description: "Treino regular 3-5x por semana" },
      { id: "very", label: "Muito Ativo", image: "/very-active-intense-training.jpg", description: "Treino intenso diariamente" },
      { id: "athlete", label: "Atleta de Elite", image: "/athlete-professional-training.jpg", description: "Treino profissional" },
    ],
  },
  {
    id: "goal",
    title: "Qual seu objetivo principal?",
    subtitle: "Onde quer chegar?",
    type: "card-select",
    options: [
      { id: "weight-loss", label: "Emagrecimento", image: "/weight-loss-transformation-fitness.jpg", description: "Redução de gordura" },
      { id: "muscle", label: "Hipertrofia", image: "/bodybuilder-muscles-gym.jpg", description: "Ganho de massa muscular" },
      { id: "health", label: "Saúde e Energia", image: "/healthy-lifestyle-wellness-fitness.jpg", description: "Vitalidade no dia a dia" },
      { id: "conditioning", label: "Performance", image: "/cardio-running-athlete.jpg", description: "Desempenho esportivo" },
      { id: "flexibility", label: "Reeducação", image: "/balanced-diet-healthy-food.jpg", description: "Melhores hábitos" },
    ],
  },
  {
    id: "dietType",
    title: "Qual sua preferência alimentar?",
    subtitle: "Respeitamos seu estilo de vida",
    type: "card-select",
    options: [
      { id: "balanced", label: "Balanceada", image: "/balanced-diet-healthy-food.jpg", description: "Sem restrições específicas" },
      { id: "lowCarb", label: "Low Carb", image: "/low-carb-diet-food.jpg", description: "Redução de carboidratos" },
      { id: "vegetarian", label: "Vegetariana", image: "/vegetarian-diet-food.jpg", description: "Sem carne animal" },
      { id: "vegan", label: "Vegana", image: "/vegan-diet-plant-based.jpg", description: "100% à base de plantas" },
      { id: "highProtein", label: "Alta Proteína", image: "/high-protein-diet-food.jpg", description: "Foco em construção muscular" },
    ],
  },
  {
    id: "mealFrequency",
    title: "Quantas refeições faz por dia?",
    subtitle: "Conte tudo, inclusive lanches",
    type: "number",
    required: true,
  },
  {
    id: "waterIntake",
    title: "Consumo diário de água (Litros)?",
    subtitle: "Aproximadamente",
    type: "number",
    required: true,
  },
  {
    id: "allergies",
    title: "Possui alergias ou intolerâncias?",
    subtitle: "Ex: Lactose, Glúten, Castanhas, Frutos do mar",
    type: "text",
  },
  {
    id: "dislikes",
    title: "Alimentos que você não come?",
    subtitle: "Aquilo que você simplesmente detesta",
    type: "text",
  },
  {
    id: "healthConditions",
    title: "Alguma condição de saúde?",
    subtitle: "Diabetes, Gastrite, Pressão Alta, etc.",
    type: "text",
  },
  {
    id: "supplements",
    title: "Usa suplementos ou remédios?",
    subtitle: "Whey, Creatina, Vitaminas, etc.",
    type: "text",
  },
  {
    id: "sleepQuality",
    title: "Como você avalia seu sono?",
    subtitle: "A qualidade do descanso",
    type: "card-select",
    options: [
      { id: "good", label: "Excelente", image: "/timer-60-minutes-workout.jpg", description: "Acordo descansado" },
      { id: "moderate", label: "Médio", image: "/timer-45-minutes-workout.jpg", description: "Sono interrompido às vezes" },
      { id: "poor", label: "Ruim", image: "/timer-30-minutes-workout.jpg", description: "Sempre cansado" },
    ],
  },
  {
    id: "stressLevel",
    title: "Como está seu nível de estresse?",
    subtitle: "No trabalho e na vida pessoal",
    type: "card-select",
    options: [
      { id: "low", label: "Baixo", image: "/yoga-stretching-flexibility.jpg", description: "Me sinto tranquilo" },
      { id: "moderate", label: "Moderado", image: "/moderate-intensity-workout.jpg", description: "Alguns dias tensos" },
      { id: "high", label: "Alto", image: "/hiit-intense-workout.jpg", description: "Muito estressado" },
    ],
  },
  {
    id: "cookingHabits",
    title: "Com que frequência você cozinha?",
    subtitle: "Isso ajuda na viabilidade do plano",
    type: "card-select",
    options: [
      { id: "always", label: "Sempre", image: "/flexible-diet-variety-food.jpg", description: "Prepararo minhas refeições" },
      { id: "sometimes", label: "Às vezes", image: "/comeback-fitness-return.jpg", description: "Cozinho mas também como fora" },
      { id: "never", label: "Raramente", image: "/sedentary-lifestyle-couch.jpg", description: "Peço delivery ou como fora" },
    ],
  },
  {
    id: "digestion",
    title: "Como está sua digestão?",
    subtitle: "Regularidade, inchaço, azia, etc.",
    type: "text",
  },
  {
    id: "specificGoal",
    title: "Algum detalhe adicional?",
    subtitle: "O que mais a IA deve saber?",
    type: "text",
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
      bodyType: translateToPortuguese(data.bodyType || ""),
      dietType: translateToPortuguese(data.dietType || ""),
      mealFrequency: data.mealFrequency || "",
      waterIntake: data.waterIntake || "",
      allergies: data.allergies || "",
      dislikes: data.dislikes || "",
      healthConditions: data.healthConditions || "",
      supplements: data.supplements || "",
      sleepQuality: translateToPortuguese(data.sleepQuality || ""),
      stressLevel: translateToPortuguese(data.stressLevel || ""),
      cookingHabits: translateToPortuguese(data.cookingHabits || ""),
      digestion: data.digestion || "",
      specificGoal: data.specificGoal || "",
      photos: data.photos || {},
      submittedAt: new Date().toISOString(),
      source: "nutriplan_pro_anamnese",
    }

    console.log("[v0] Enviando dados para webhook:", payload)

    const response = await fetch("https://workspace.n8n.automatech.tech/webhook/perguntasnutri", {
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
    bodyType: "",
    dietType: "",
    mealFrequency: "",
    waterIntake: "",
    allergies: "",
    dislikes: "",
    healthConditions: "",
    supplements: "",
    sleepQuality: "",
    stressLevel: "",
    cookingHabits: "",
    digestion: "",
    specificGoal: "",
    photos: {
      front: "",
      side: "",
      back: "",
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  const handleAnswer = (value: any) => {
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
        bodyType: answers.bodyType || "",
        dietType: answers.dietType || "",
        mealFrequency: answers.mealFrequency || "",
        waterIntake: answers.waterIntake || "",
        allergies: answers.allergies || "",
        dislikes: answers.dislikes || "",
        healthConditions: answers.healthConditions || "",
        supplements: answers.supplements || "",
        sleepQuality: answers.sleepQuality || "",
        stressLevel: answers.stressLevel || "",
        cookingHabits: answers.cookingHabits || "",
        digestion: answers.digestion || "",
        specificGoal: answers.specificGoal || "",
        photos: answers.photos,
        // Mantendo compatibilidade com campos antigos se necessário
        experience: "",
        previousTraining: "",
        frequency: "",
        equipment: [],
        muscleGroups: [],
        limitations: "",
        availability: "",
        trainingPreference: "",
        preferredTime: "",
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

          {/* Text Input - Generic rendering to fix missing inputs */}
          {currentQuestion.type === "text" && (
            <div className="max-w-xl mx-auto">
              {currentQuestion.id === "specificGoal" || currentQuestion.id === "digestion" ? (
                <Textarea
                  placeholder={
                    currentQuestion.id === "digestion"
                      ? "Frequência, inchaço, azia ou qualquer desconforto..."
                      : "Ex: Mais disposição, melhorar exames, performance esportiva..."
                  }
                  value={(currentValue as string) || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="min-h-28 md:min-h-32 bg-card border-border text-foreground text-base"
                />
              ) : (
                <Input
                  placeholder={
                    currentQuestion.id === "name"
                      ? "Seu nome completo"
                      : currentQuestion.id === "allergies"
                        ? "Ex: Lactose, Glúten, Castanhas..."
                        : currentQuestion.id === "dislikes"
                          ? "Fígado, coentro, carne vermelha..."
                          : currentQuestion.id === "healthConditions"
                            ? "Diabetes, Tireoide, Anemia..."
                            : currentQuestion.id === "supplements"
                              ? "Vitaminas, Creatina, Whey..."
                              : "Sua resposta..."
                  }
                  value={(currentValue as string) || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="h-12 md:h-14 bg-card border-border text-foreground text-base md:text-lg px-4"
                />
              )}
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
                      : currentQuestion.id === "height"
                        ? "Digite a altura em cm"
                        : currentQuestion.id === "mealFrequency"
                          ? "Quantidade de refeições"
                          : "Quantidade em litros (água)"
                }
                value={(currentValue as string) || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="h-12 md:h-14 bg-card border-border text-foreground text-base md:text-lg px-4"
                min={
                  currentQuestion.id === "age"
                    ? "10"
                    : currentQuestion.id === "weight"
                      ? "30"
                      : currentQuestion.id === "height"
                        ? "100"
                        : "1"
                }
                max={
                  currentQuestion.id === "age"
                    ? "100"
                    : currentQuestion.id === "weight"
                      ? "300"
                      : currentQuestion.id === "height"
                        ? "250"
                        : "20"
                }
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

          {/* Photo Upload */}
          {currentQuestion.type === "photo-upload" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {["front", "side", "back"].map((type) => (
                <div key={type} className="flex flex-col gap-3">
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground text-center">
                    {type === "front" ? "Frente" : type === "side" ? "Lado" : "Costas"}
                  </span>

                  <div className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-border overflow-hidden bg-card hover:border-primary/50 transition-colors group">
                    {(answers.photos as any)?.[type] ? (
                      <>
                        <img
                          src={(answers.photos as any)[type]}
                          className="w-full h-full object-cover"
                          alt={type}
                        />
                        <button
                          onClick={() => {
                            const newPhotos = { ...(answers.photos || {}) }
                            delete (newPhotos as any)[type]
                            handleAnswer(newPhotos)
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4 text-center">
                        <div className="p-3 rounded-full bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform">
                          <Camera className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium">Carregar Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                const base64String = reader.result as string
                                const newPhotos = { ...(answers.photos || {}), [type]: base64String }
                                handleAnswer(newPhotos)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
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
