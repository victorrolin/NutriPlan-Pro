"use client"

import type React from "react"
import { loginAction } from "@/app/auth/login/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Apple, Sparkles, Utensils, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/language-context"

export default function PersonalLoginPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await loginAction(email, password)

      if (!result.success) {
        setError(result.error || t('auth.login.error'))
        setIsLoading(false)
        return
      }

      // Verificar se é personal ou admin
      if (result.role !== "personal" && result.role !== "admin") {
        setError(t('auth.login.unauthorizedNutri'))
        setIsLoading(false)
        return
      }

      window.location.href = "/personal"
    } catch (error: unknown) {
      console.error("Login error:", error)
      setError(t('auth.login.error'))
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 relative">
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link href="/">
          <Button variant="ghost" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('auth.login.backToHome')}
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="relative">
              <Apple className="w-12 h-12 text-green-500" />
              <Sparkles className="w-6 h-6 text-green-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">NutriPlan Pro</h1>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Utensils className="w-5 h-5 text-green-400" />
            <p>{t('auth.login.nutriArea')}</p>
          </div>
        </div>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-white">{t('auth.login.nutriTitle')}</CardTitle>
            <CardDescription className="text-gray-400">{t('auth.login.nutriDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-gray-200">
                    {t('auth.login.emailLabel')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.login.emailPlaceholder')}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-gray-200">
                    {t('auth.login.passwordLabel')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('auth.login.passwordPlaceholder')}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-red-950/50 border-red-900">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.login.loading') : t('auth.login.button')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-sm text-gray-500 hover:text-green-400 transition-colors">
            {t('auth.login.backToPatient')}
          </Link>
        </div>
      </div>
    </div>
  )
}
