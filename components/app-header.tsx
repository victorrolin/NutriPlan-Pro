"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Bot, Settings, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { SessionData } from "@/lib/session"
import { deleteSession } from "@/lib/session"

interface AppHeaderProps {
  session: SessionData | null
}

export function AppHeader({ session }: AppHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await deleteSession()
    window.location.href = "/auth/login/"
  }

  if (!session) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 md:h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1.5 md:p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
            <Bot className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-foreground">NutriPlan Pro</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Nutricionista IA</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm text-foreground font-medium">{session.fullName}</span>
            <span className="text-xs text-muted-foreground">{session.email}</span>
          </div>

          {session.role === "personal" && (
            <Link href="/personal">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30 bg-transparent"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Meus Alunos</span>
              </Button>
            </Link>
          )}

          {session.role === "admin" && (
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30 bg-transparent"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 bg-transparent"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
