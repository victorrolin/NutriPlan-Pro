"use client"

import { useState } from "react"
import { WelcomeScreen } from "@/components/welcome-screen"
import { AssessmentFlow } from "@/components/assessment-flow"
import { ResultsScreen } from "@/components/results-screen"
import { AppHeader } from "@/components/app-header"
import type { AssessmentResult } from "@/types/assessment"
import type { SessionData } from "@/lib/session"

interface HomeClientProps {
  session: SessionData | null
}

export default function HomeClient({ session }: HomeClientProps) {
  const [step, setStep] = useState<"welcome" | "assessment" | "results">("welcome")
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)

  const handleStart = () => setStep("assessment")

  const handleComplete = (result: AssessmentResult) => {
    setAssessmentResult(result)
    setStep("results")
  }

  const handleRestart = () => {
    setAssessmentResult(null)
    setStep("welcome")
  }

  return (
    <main className="min-h-screen bg-background">
      {session && <AppHeader session={session} />}
      {step === "welcome" && <WelcomeScreen onStart={handleStart} />}
      {step === "assessment" && <AssessmentFlow onComplete={handleComplete} />}
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
