"use client"

import { useState } from "react"
import { AssessmentFlow } from "@/components/assessment-flow"
import { ResultsScreen } from "@/components/results-screen"
import { AppHeader } from "@/components/app-header"
import { PatientDashboard } from "@/components/patient-dashboard"
import type { AssessmentResult } from "@/types/assessment"
import type { SessionData } from "@/lib/session"

interface HomeClientProps {
  session: SessionData | null
}

export default function HomeClient({ session }: HomeClientProps) {
  const [step, setStep] = useState<"dashboard" | "assessment" | "results">("dashboard")
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)

  const handleComplete = (result: AssessmentResult) => {
    setAssessmentResult(result)
    setStep("results")
  }

  const handleRestart = () => {
    setAssessmentResult(null)
    setStep("dashboard")
  }

  return (
    <main className="min-h-screen bg-background">
      {session && <AppHeader session={session} />}

      {step === "dashboard" && (
        <PatientDashboard
          userName={session?.fullName || ""}
          onStartAssessment={() => setStep("assessment")}
          onViewDiet={() => {
            // Se houver resultado em memória, mostra
            if (assessmentResult) {
              setStep("results")
              return
            }
            // Se não houver resultado em memória, mas houver PDF salvo na sessão, cria um resultado mínimo
            if (session?.lastPdfUrl) {
              setAssessmentResult({
                userData: {
                  name: session.fullName,
                  email: session.email,
                  age: "0",
                  gender: "male",
                  weight: "0",
                  height: "0",
                  bodyType: "mesomorph",
                  activityLevel: "moderate",
                  goal: "health",
                  dietPreference: "balanced",
                  allergies: "",
                  healthConditions: "",
                  supplements: "",
                  mealsPerDay: "3",
                  waterIntake: "2",
                  sleepQuality: "good",
                  stressLevel: "moderate",
                  cookingHabits: "sometimes",
                  digestion: "",
                  specificGoal: ""
                },
                pdfUrl: session.lastPdfUrl,
                error: undefined
              })
              setStep("results")
            }
          }}
        />
      )}

      {step === "assessment" && (
        <AssessmentFlow
          userId={session?.userId || ""}
          userName={session?.fullName || ""}
          onComplete={handleComplete}
          onBack={handleRestart}
        />
      )}
      {step === "results" && assessmentResult && (
        <ResultsScreen
          userData={assessmentResult.userData}
          pdfUrl={assessmentResult.pdfUrl}
          error={assessmentResult.error}
          onRestart={handleRestart}
        />
      )}
    </main>
  )
}
