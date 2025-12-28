"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { QuestionCard } from "@/components/question-card"
import { ArrowLeft, ArrowRight, Check, Loader2, Camera, X } from "lucide-react"
import type { UserData, Question, AssessmentResult } from "@/types/assessment"
import { Footer } from "@/components/footer"
import { LoadingOverlay } from "./loading-overlay"
import { useLanguage } from "@/context/language-context"

function translateValue(value: string | string[], labels: any): string | string[] {
  if (Array.isArray(value)) {
    return value.map((v) => labels[v] || v)
  }
  return labels[value] || value
}

async function sendToWebhook(data: UserData, currentLanguage: string, labels: any): Promise<{ success: boolean; pdfUrl?: string; error?: string }> {
  try {
    const payload = {
      name: data.name || "",
      age: data.age || "",
      gender: translateValue(data.gender || "", labels),
      weight: data.weight || "",
      height: data.height || "",
      activityLevel: translateValue(data.activityLevel || "", labels),
      goal: translateValue(data.goal || "", labels),
      bodyType: translateValue(data.bodyType || "", labels),
      dietType: translateValue(data.dietType || "", labels),
      mealFrequency: data.mealFrequency || "",
      waterIntake: data.waterIntake || "",
      allergies: data.allergies || "",
      dislikes: data.dislikes || "",
      healthConditions: data.healthConditions || "",
      supplements: data.supplements || "",
      sleepQuality: translateValue(data.sleepQuality || "", labels),
      stressLevel: translateValue(data.stressLevel || "", labels),
      cookingHabits: translateValue(data.cookingHabits || "", labels),
      digestion: data.digestion || "",
      specificGoal: data.specificGoal || "",
      photos: data.photos || {},
      language: currentLanguage,
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

    if (response.ok) {
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/pdf")) {
        const blob = await response.blob()
        const pdfUrl = URL.createObjectURL(blob)
        return { success: true, pdfUrl }
      }

      try {
        const responseText = await response.text()
        if (!responseText || responseText.trim() === "" || responseText === "{}") {
          return { success: false, error: "Empty response from server" }
        }
        const jsonData = JSON.parse(responseText)
        const data = Array.isArray(jsonData) ? jsonData[0] : jsonData
        if (data && (data.pdf_url || data.pdfUrl || data.url)) {
          return { success: true, pdfUrl: data.pdf_url || data.pdfUrl || data.url }
        }
        return { success: false, error: "PDF URL not found in response" }
      } catch (e) {
        return { success: false, error: "Error parsing server response" }
      }
    }
    return { success: false, error: `Server error: ${response.status}` }
  } catch (error) {
    return { success: false, error: "Connection error" }
  }
}

interface AssessmentFlowProps {
  userName: string
  onComplete: (result: AssessmentResult) => void
  onBack: () => void
}

export function AssessmentFlow({ userName, onComplete, onBack }: AssessmentFlowProps) {
  const { t, language } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    photos: { front: "", side: "", back: "" },
  })

  const questions: Question[] = [
    {
      id: "name",
      title: t('assessment.questions.name.title'),
      subtitle: t('assessment.questions.name.subtitle'),
      type: "text",
      required: true,
    },
    {
      id: "age",
      title: t('assessment.questions.age.title'),
      subtitle: t('assessment.questions.age.subtitle'),
      type: "number",
      required: true,
    },
    {
      id: "gender",
      title: t('assessment.questions.gender.title'),
      subtitle: t('assessment.questions.gender.subtitle'),
      type: "card-select",
      options: [
        { id: "male", label: t('labels.male'), image: "/muscular-man-fitness-silhouette.jpg" },
        { id: "female", label: t('labels.female'), image: "/fit-woman-fitness-silhouette.jpg" },
        { id: "other", label: t('labels.other'), image: "/gender-neutral-fitness-person-silhouette.jpg" },
      ],
    },
    {
      id: "weight",
      title: t('assessment.questions.weight.title'),
      subtitle: t('assessment.questions.weight.subtitle'),
      type: "number",
      required: true,
    },
    {
      id: "height",
      title: t('assessment.questions.height.title'),
      subtitle: t('assessment.questions.height.subtitle'),
      type: "number",
      required: true,
    },
    {
      id: "bodyType",
      title: t('assessment.questions.bodyType.title'),
      subtitle: t('assessment.questions.bodyType.subtitle'),
      type: "card-select",
      options: [
        { id: "ectomorph", label: t('labels.ectomorph'), image: "/ectomorph-body-type.jpg", description: t('assessment.questions.bodyType.ectomorph') },
        { id: "mesomorph", label: t('labels.mesomorph'), image: "/mesomorph-body-type.jpg", description: t('assessment.questions.bodyType.mesomorph') },
        { id: "endomorph", label: t('labels.endomorph'), image: "/endomorph-body-type.jpg", description: t('assessment.questions.bodyType.endomorph') },
      ],
    },
    {
      id: "activityLevel",
      title: t('assessment.questions.activity.title'),
      subtitle: t('assessment.questions.activity.subtitle'),
      type: "card-select",
      options: [
        { id: "sedentary", label: t('labels.sedentary'), image: "/sedentary-lifestyle-couch.jpg", description: t('assessment.questions.activity.sedentary') },
        { id: "light", label: t('labels.light'), image: "/light-activity-walking.jpg", description: t('assessment.questions.activity.light') },
        { id: "moderate-activity", label: t('labels.moderate-activity'), image: "/moderate-activity-jogging.jpg", description: t('assessment.questions.activity.moderate') },
        { id: "very", label: t('labels.very'), image: "/very-active-intense-training.jpg", description: t('assessment.questions.activity.very') },
        { id: "athlete", label: t('labels.athlete'), image: "/athlete-professional-training.jpg", description: t('assessment.questions.activity.athlete') },
      ],
    },
    {
      id: "goal",
      title: t('assessment.questions.goal.title'),
      subtitle: t('assessment.questions.goal.subtitle'),
      type: "card-select",
      options: [
        { id: "weight-loss", label: t('labels.weight-loss'), image: "/weight-loss-transformation-fitness.jpg", description: t('assessment.questions.goal.weight-loss') },
        { id: "muscle", label: t('labels.muscle'), image: "/bodybuilder-muscles-gym.jpg", description: t('assessment.questions.goal.muscle') },
        { id: "health", label: t('labels.health'), image: "/healthy-lifestyle-wellness-fitness.jpg", description: t('assessment.questions.goal.health') },
        { id: "conditioning", label: t('labels.conditioning'), image: "/cardio-running-athlete.jpg", description: t('assessment.questions.goal.conditioning') },
        { id: "flexibility", label: t('labels.flexibility'), image: "/balanced-diet-healthy-food.jpg", description: t('assessment.questions.goal.reeducation') },
      ],
    },
    {
      id: "dietType",
      title: t('assessment.questions.diet.title'),
      subtitle: t('assessment.questions.diet.subtitle'),
      type: "card-select",
      options: [
        { id: "balanced", label: t('labels.balanced'), image: "/balanced-diet-healthy-food.jpg", description: t('assessment.questions.diet.balanced') },
        { id: "lowCarb", label: t('labels.lowCarb'), image: "/low-carb-diet-food.jpg", description: t('assessment.questions.diet.lowCarb') },
        { id: "vegetarian", label: t('labels.vegetarian'), image: "/vegetarian-diet-food.jpg", description: t('assessment.questions.diet.vegetarian') },
        { id: "vegan", label: t('labels.vegan'), image: "/vegan-diet-plant-based.jpg", description: t('assessment.questions.diet.vegan') },
        { id: "highProtein", label: t('labels.highProtein'), image: "/high-protein-diet-food.jpg", description: t('assessment.questions.diet.highProtein') },
      ],
    },
    {
      id: "mealFrequency",
      title: t('assessment.questions.meals.title'),
      subtitle: t('assessment.questions.meals.subtitle'),
      type: "number",
      required: true,
    },
    {
      id: "waterIntake",
      title: t('assessment.questions.water.title'),
      subtitle: t('assessment.questions.water.subtitle'),
      type: "number",
      required: true,
    },
    {
      id: "allergies",
      title: t('assessment.questions.allergies.title'),
      subtitle: t('assessment.questions.allergies.subtitle'),
      type: "text",
    },
    {
      id: "dislikes",
      title: t('assessment.questions.dislikes.title'),
      subtitle: t('assessment.questions.dislikes.subtitle'),
      type: "text",
    },
    {
      id: "healthConditions",
      title: t('assessment.questions.health.title'),
      subtitle: t('assessment.questions.health.subtitle'),
      type: "text",
    },
    {
      id: "supplements",
      title: t('assessment.questions.supplements.title'),
      subtitle: t('assessment.questions.supplements.subtitle'),
      type: "text",
    },
    {
      id: "sleepQuality",
      title: t('assessment.questions.sleep.title'),
      subtitle: t('assessment.questions.sleep.subtitle'),
      type: "card-select",
      options: [
        { id: "good", label: t('labels.good'), image: "/sleep-good.png", description: t('assessment.questions.sleep.good') },
        { id: "moderate", label: t('labels.moderate'), image: "/sleep-moderate.png", description: t('assessment.questions.sleep.moderate') },
        { id: "poor", label: t('labels.poor'), image: "/sleep-poor.png", description: t('assessment.questions.sleep.poor') },
      ],
    },
    {
      id: "stressLevel",
      title: t('assessment.questions.stress.title'),
      subtitle: t('assessment.questions.stress.subtitle'),
      type: "card-select",
      options: [
        { id: "low", label: t('labels.low'), image: "/stress-low.png", description: t('assessment.questions.stress.low') },
        { id: "moderate", label: t('labels.moderate'), image: "/moderate-activity-jogging.jpg", description: t('assessment.questions.stress.moderate') },
        { id: "high", label: t('labels.high'), image: "/stress-high.png", description: t('assessment.questions.stress.high') },
      ],
    },
    {
      id: "cookingHabits",
      title: t('assessment.questions.cooking.title'),
      subtitle: t('assessment.questions.cooking.subtitle'),
      type: "card-select",
      options: [
        { id: "always", label: t('labels.always'), image: "/cooking-always.png", description: t('assessment.questions.cooking.always') },
        { id: "sometimes", label: t('labels.sometimes'), image: "/cooking-sometimes.png", description: t('assessment.questions.cooking.sometimes') },
        { id: "never", label: t('labels.never'), image: "/sedentary-lifestyle-couch.jpg", description: t('assessment.questions.cooking.never') },
      ],
    },
    {
      id: "digestion",
      title: t('assessment.questions.digestion.title'),
      subtitle: t('assessment.questions.digestion.subtitle'),
      type: "text",
    },
    {
      id: "specificGoal",
      title: t('assessment.questions.extra.title'),
      subtitle: t('assessment.questions.extra.subtitle'),
      type: "text",
    },
  ]

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

      const locales = require("@/lib/locales.json")
      const labels = locales[language].labels
      const result = await sendToWebhook(userData, language, labels)
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
              <span className="hidden sm:inline">{t('common.back')}</span>
            </Button>
            <span className="text-xs md:text-sm text-muted-foreground">
              {currentIndex + 1} {t('assessment.header.step')} {questions.length}
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

          {currentQuestion.type === "text" && (
            <div className="max-w-xl mx-auto">
              {currentQuestion.id === "specificGoal" || currentQuestion.id === "digestion" ? (
                <Textarea
                  placeholder={
                    currentQuestion.id === "digestion"
                      ? t('assessment.questions.digestion.placeholder')
                      : t('assessment.questions.extra.placeholder')
                  }
                  value={(currentValue as string) || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="min-h-28 md:min-h-32 bg-card border-border text-foreground text-base"
                />
              ) : (
                <Input
                  placeholder={
                    currentQuestion.id === "name"
                      ? t('assessment.questions.name.placeholder')
                      : currentQuestion.id === "allergies"
                        ? t('assessment.questions.allergies.placeholder')
                        : currentQuestion.id === "dislikes"
                          ? t('assessment.questions.dislikes.placeholder')
                          : currentQuestion.id === "healthConditions"
                            ? t('assessment.questions.health.placeholder')
                            : currentQuestion.id === "supplements"
                              ? t('assessment.questions.supplements.placeholder')
                              : t('common.loading')
                  }
                  value={(currentValue as string) || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="h-12 md:h-14 bg-card border-border text-foreground text-base md:text-lg px-4"
                />
              )}
            </div>
          )}

          {currentQuestion.type === "number" && (
            <div className="max-w-xl mx-auto">
              <Input
                type="number"
                placeholder={
                  currentQuestion.id === "age"
                    ? t('assessment.questions.age.placeholder')
                    : currentQuestion.id === "weight"
                      ? t('assessment.questions.weight.placeholder')
                      : currentQuestion.id === "height"
                        ? t('assessment.questions.height.placeholder')
                        : currentQuestion.id === "mealFrequency"
                          ? t('assessment.questions.meals.placeholder')
                          : t('assessment.questions.water.placeholder')
                }
                value={(currentValue as string) || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="h-12 md:h-14 bg-card border-border text-foreground text-base md:text-lg px-4"
                min={
                  currentQuestion.id === "age" ? "10" :
                    currentQuestion.id === "weight" ? "30" :
                      currentQuestion.id === "height" ? "100" : "1"
                }
                max={
                  currentQuestion.id === "age" ? "100" :
                    currentQuestion.id === "weight" ? "300" :
                      currentQuestion.id === "height" ? "250" : "20"
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

          {currentQuestion.type === "photo-upload" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {["front", "side", "back"].map((type) => (
                <div key={type} className="flex flex-col gap-3">
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground text-center">
                    {type === "front" ? t('assessment.photo.front') : type === "side" ? t('assessment.photo.side') : t('assessment.photo.back')}
                  </span>
                  <div className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-border overflow-hidden bg-card hover:border-primary/50 transition-colors group">
                    {(answers.photos as any)?.[type] ? (
                      <>
                        <img src={(answers.photos as any)[type]} className="w-full h-full object-cover" alt={type} />
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
                        <span className="text-sm font-medium">{t('assessment.photo.upload')}</span>
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
                  <span className="hidden sm:inline">{t('common.sending')}</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : currentIndex === questions.length - 1 ? (
                <>
                  <Check className="mr-1.5 md:mr-2 h-4 w-4" />
                  {t('common.finish')}
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">{t('common.next')}</span>
                  <span className="sm:hidden">{t('common.next')}</span>
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
