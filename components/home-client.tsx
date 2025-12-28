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
          userId={session?.userId || ""}
          userName={session?.fullName || ""}
          onStartAssessment={() => setStep("assessment")}
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
