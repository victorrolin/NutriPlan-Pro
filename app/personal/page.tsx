"use client"

import { useEffect, useState } from "react"
import { getSession } from "@/lib/session"
import { useRouter } from "next/navigation"
import { PersonalDashboard } from "@/components/personal-dashboard"
import { AuthService } from "@/lib/auth-service"

export default function PersonalPage() {
  const [data, setData] = useState<{ students: any[], currentUser: any } | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const session = await getSession()
      if (!session) {
        router.push("/auth/login")
        return
      }
      if (session.role !== "personal") {
        router.push("/")
        return
      }

      const students = await AuthService.listStudentsByPersonal(session.userId)
      const limitInfo = await AuthService.checkStudentLimit(session.userId)

      setData({
        students,
        currentUser: {
          id: session.userId,
          fullName: session.fullName,
          email: session.email,
          maxStudents: limitInfo.max,
          studentCount: limitInfo.current,
        }
      })
    }
    load()
  }, [router])

  if (!data) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>
  }

  return <PersonalDashboard students={data.students} currentUser={data.currentUser} />
}
