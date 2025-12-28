"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/session"
import HomeClient from "@/components/home-client"
import { LandingPage } from "@/components/landing-page"

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const s = await getSession()
      if (s) {
        if (s.role === "personal") {
          router.push("/personal")
          return
        }
        if (s.role === "admin") {
          router.push("/admin")
          return
        }
        setSession(s)
      }
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium animate-pulse">NutriPlan Pro...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <LandingPage />
  }

  return <HomeClient session={session} />
}
