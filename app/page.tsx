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
        setSession(s)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-black text-white">Carregando...</div>
  }

  if (!session) {
    return <LandingPage />
  }

  return <HomeClient session={session} />
}
