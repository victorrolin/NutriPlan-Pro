"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  User,
  AlertCircle,
  RefreshCw,
  Bot,
  Sparkles,
  FileText,
  CheckCircle2,
  ExternalLink,
  Download,
  XCircle,
  Salad,
  ChefHat,
  Moon,
  Zap,
  Activity,
  Droplets,
  Clock,
} from "lucide-react"
import type { UserData } from "@/types/assessment"
import { Footer } from "@/components/footer"
import { Browser } from "@capacitor/browser"
import { Share } from "@capacitor/share"
import { Filesystem, Directory } from "@capacitor/filesystem"
import { Capacitor } from "@capacitor/core"
import { useLanguage } from "@/context/language-context"

interface ResultsScreenProps {
  userData: UserData
  pdfUrl?: string
  error?: string
  onRestart: () => void
}

export function ResultsScreen({ userData, pdfUrl, error, onRestart }: ResultsScreenProps) {
  const { t } = useLanguage()

  const handleDownloadPdf = async () => {
    if (!pdfUrl) return

    try {
      if (!Capacitor.isNativePlatform()) {
        const isMobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobileBrowser) {
          window.open(pdfUrl, "_blank");
        } else {
          const link = document.createElement("a");
          link.href = pdfUrl;
          link.download = `NutriPlan_Pro_Plan_${Date.now()}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        return;
      }

      if (pdfUrl.startsWith("blob:")) {
        const response = await fetch(pdfUrl)
        const blob = await response.blob()

        const reader = new FileReader()
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const base64data = reader.result as string
            resolve(base64data.split(",")[1])
          }
        })
        reader.readAsDataURL(blob)
        const base64String = await base64Promise

        const fileName = `nutriplan-pro-${Date.now()}.pdf`
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64String,
          directory: Directory.Cache
        })

        await Share.share({
          title: "NutriPlan Pro",
          text: t('results.shareText') || "Confira meu novo plano alimentar personalizado!",
          url: savedFile.uri,
        })
        return
      }

      const canShare = await Share.canShare()
      if (canShare.value) {
        await Share.share({
          title: "NutriPlan Pro",
          url: pdfUrl,
        })
      } else {
        await Browser.open({ url: pdfUrl })
      }
    } catch (error) {
      console.error("[v0] Falha ao processar PDF:", error)
      window.open(pdfUrl, "_blank")
    }
  }

  const handleSaveToPermanent = async () => {
    if (!pdfUrl) return

    try {
      if (!Capacitor.isNativePlatform()) {
        handleDownloadPdf();
        return;
      }

      const response = await fetch(pdfUrl)
      const blob = await response.blob()

      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result as string
          resolve(base64data.split(",")[1])
        }
      })
      reader.readAsDataURL(blob)
      const base64String = await base64Promise

      const fileName = `NutriPlan_Pro_${Date.now()}.pdf`

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64String,
        directory: Directory.Documents
      })

      alert(`${t('results.saveSuccess') || "Plano salvo com sucesso!"}\n${fileName}`)
    } catch (error) {
      console.error("[v0] Falha ao baixar PDF:", error)
      alert(t('results.saveError') || "Erro ao salvar PDF.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-3 md:px-4 py-5 md:py-8">
          <div className="flex items-start md:items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-primary/50 rounded-lg md:rounded-xl blur-lg animate-pulse" />
              <div className="relative p-2.5 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br from-primary to-primary/80 border border-primary/50">
                <Bot className="h-6 w-6 md:h-8 md:w-8 text-primary-foreground" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-3xl font-bold text-foreground truncate">
                {error ? t('results.errorTitle') || "Ops!" : pdfUrl ? t('results.title') : t('results.waitingTitle') || "Dados Recebidos!"}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground truncate">
                {t('results.hello') || "Olá"} <span className="text-primary font-semibold">{userData.name}</span>,{" "}
                <span className="hidden sm:inline">
                  {error
                    ? t('results.checkError') || "verifique o erro abaixo"
                    : pdfUrl
                      ? t('results.aiReady') || "a IA criou seu plano alimentar personalizado!"
                      : t('results.aiAnalyzing') || "a IA está analisando seu perfil..."}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-3 md:mt-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs md:text-sm">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {t('results.badgeSent') || "Dados enviados"}
            </Badge>
            {error ? (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs md:text-sm">
                <XCircle className="h-3 w-3 mr-1" />
                {t('results.badgeError') || "Erro ao processar"}
              </Badge>
            ) : pdfUrl ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs md:text-sm">
                <FileText className="h-3 w-3 mr-1" />
                {t('results.badgePdfReady') || "PDF pronto!"}
              </Badge>
            ) : (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs md:text-sm">
                <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
                {t('results.badgeWaiting') || "Aguardando IA..."}
              </Badge>
            )}
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-gradient-to-r from-red-500/20 via-red-500/10 to-red-500/20 border-b border-red-500/30">
          <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 rounded-full bg-red-500/20">
                  <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-red-400" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm md:text-base text-foreground">{t('results.errorSubtitle') || "Erro ao gerar o plano"}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
              <Button onClick={onRestart} variant="outline" className="w-full sm:w-auto bg-transparent">
                <RefreshCw className="mr-2 h-4 w-4" />
                {t('results.tryAgain') || "Tentar Novamente"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {pdfUrl && !error && (
        <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 border-b border-green-500/30">
          <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 rounded-full bg-green-500/20">
                  <FileText className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm md:text-base text-foreground">{t('results.title')}</p>
                  <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                    {t('results.aiCreated') || "Criado pela nossa IA especialmente para você"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleDownloadPdf}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg h-auto py-4 flex-1"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  {t('results.share') || "Abrir/Enviar"}
                </Button>
                <Button
                  onClick={handleSaveToPermanent}
                  size="lg"
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 font-bold text-lg h-auto py-4 flex-1"
                >
                  <Download className="mr-2 h-5 w-5" />
                  {t('results.download') || "Baixar PDF"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-3 md:px-4 py-5 md:py-8 flex-1">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">{t('results.summary')}</h2>

          {/* Personal Info */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                {t('results.personalInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 md:gap-4">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">{t('registration.fields.name')}</p>
                <p className="font-semibold text-sm md:text-base text-foreground truncate">{userData.name}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">{t('results.age')}</p>
                <p className="font-semibold text-sm md:text-base text-foreground">{userData.age} {t('results.years')}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">{t('results.gender')}</p>
                <p className="font-semibold text-sm md:text-base text-foreground capitalize">{t(`labels.${userData.gender}`) || userData.gender}</p>
              </div>
            </CardContent>
          </Card>

          {/* Nutri Profile */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                <Salad className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                {t('results.nutriProfile')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="p-3 md:p-4 rounded-lg bg-secondary/50">
                  <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">{t('results.goal')}</p>
                  <p className="text-sm md:text-lg font-semibold text-primary">
                    {t(`labels.${userData.goal}`) || userData.goal}
                  </p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-secondary/50">
                  <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">{t('results.diet')}</p>
                  <p className="text-sm md:text-lg font-semibold text-foreground capitalize">
                    {t(`labels.${userData.dietType}`) || userData.dietType}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg bg-secondary/50">
                  <Activity className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">{t('results.activity')}</p>
                    <p className="font-semibold text-sm md:text-base text-foreground capitalize">
                      {t(`labels.${userData.activityLevel}`) || userData.activityLevel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg bg-secondary/50">
                  <Droplets className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">{t('results.water')}</p>
                    <p className="font-semibold text-sm md:text-base text-foreground">{userData.waterIntake} {t('results.liters')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences & Habits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                  <ChefHat className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  {t('results.preferences')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">{t('results.allergies')}</p>
                  <p className="text-sm text-foreground">{userData.allergies || "Nenhuma"}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">{t('results.meals')}</p>
                    <p className="text-sm text-foreground font-semibold">{userData.mealFrequency}x</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">{t('results.cooking')}</p>
                    <p className="text-sm text-foreground capitalize">{t(`labels.${userData.cookingHabits}`) || userData.cookingHabits}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                  <Moon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  {t('results.sleep')} / {t('results.stress')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded bg-secondary/30">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{t('results.sleep')}</span>
                  </div>
                  <Badge variant="outline" className="capitalize">{t(`labels.${userData.sleepQuality}`) || userData.sleepQuality}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-secondary/30">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{t('results.stress')}</span>
                  </div>
                  <Badge variant="outline" className="capitalize">{t(`labels.${userData.stressLevel}`) || userData.stressLevel}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Salud Digestiva & Obs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                  <Zap className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  {t('results.digestion')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground italic">"{userData.digestion || t('common.loading')}"</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  {t('results.health')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">{userData.healthConditions || "Nenhuma registrada"}</p>
              </CardContent>
            </Card>
          </div>

          {userData.specificGoal && (
            <Card className="bg-card border-border border-l-4 border-l-primary">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  {t('results.obs')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-foreground italic">"{userData.specificGoal}"</p>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4 md:pt-6">
            <Button
              size="lg"
              variant="outline"
              onClick={onRestart}
              className="border-border text-foreground hover:bg-secondary bg-transparent w-full sm:w-auto px-10"
            >
              <RefreshCw className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              {t('common.start')}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
