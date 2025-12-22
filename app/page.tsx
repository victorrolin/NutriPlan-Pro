"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/session"
import HomeClient from "@/components/home-client"

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const s = await getSession()
      if (!s) {
        router.push("/auth/login")
        return
      }
      setSession(s)
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>
  }

  return <HomeClient session={session} />
}
