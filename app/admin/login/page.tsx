"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getSession } from "@/lib/session"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Apple, Shield, AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import { loginAction } from "@/app/auth/login/actions"
import Link from "next/link"
import { useLanguage } from "@/context/language-context"

export default function AdminLoginPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      const session = await getSession()
      if (session && session.role === "admin") {
        router.push("/admin")
      }
    }
    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await loginAction(email, password)

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      if (result.success) {
        // Verifica se é admin antes de redirecionar
        if (result.role !== "admin") {
          setError(t('auth.login.unauthorizedAdmin'))
          setIsLoading(false)
          return
        }
        window.location.href = "/admin"
      }
    } catch (err: any) {
      console.error("Login Page Error:", err)
      setError(`${t('auth.login.error')}: ${err?.message || JSON.stringify(err)}`)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Apple className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-primary">NutriPlan Pro</h1>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-5 w-5" />
            <p>{t('auth.login.adminArea')}</p>
          </div>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl">{t('auth.login.adminTitle')}</CardTitle>
            <CardDescription>{t('auth.login.adminDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.login.emailLabel')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@nutriplanpro.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.login.passwordLabel')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('auth.login.loading')}
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    {t('auth.login.button')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
