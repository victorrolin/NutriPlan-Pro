"use client"

import { useEffect, useState } from "react"
import { getSession } from "@/lib/session"
import { useRouter } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"
import { AuthService } from "@/lib/auth-service"

export default function AdminPage() {
  const [data, setData] = useState<{ users: any[], role: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const session = await getSession()
      if (!session) {
        router.push("/auth/login")
        return
      }
      if (session.role !== "admin") {
        router.push("/")
        return
      }

      const users = await AuthService.listUsers()
      setData({ users, role: session.role })
    }
    load()
  }, [router])

  if (!data) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>
  }

  return <AdminDashboard initialUsers={data.users} currentUserType={data.role} />
}
