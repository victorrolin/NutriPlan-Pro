"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dumbbell,
  Target,
  Calendar,
  Clock,
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
} from "lucide-react"
import type { UserData } from "@/types/assessment"
import { Footer } from "@/components/footer"
import { Browser } from "@capacitor/browser"
import { Share } from "@capacitor/share"
import { Filesystem, Directory } from "@capacitor/filesystem"
import { Capacitor } from "@capacitor/core"

interface ResultsScreenProps {
  userData: UserData
  pdfUrl?: string // Adicionado prop para URL do PDF
  error?: string // Adicionado prop de erro
  onRestart: () => void
}

const goalLabels: Record<string, string> = {
  muscle: "Ganho de Massa",
  "weight-loss": "Emagrecimento",
  conditioning: "Condicionamento",
  strength: "Força",
  flexibility: "Flexibilidade",
  health: "Saúde Geral",
}

const experienceLabels: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
}

const equipmentLabels: Record<string, string> = {
  dumbbells: "Halteres",
  barbells: "Barras",
  machines: "Máquinas",
  cables: "Cabos",
  bodyweight: "Peso Corporal",
  kettlebell: "Kettlebell",
}

const muscleLabels: Record<string, string> = {
  chest: "Peito",
  back: "Costas",
  shoulders: "Ombros",
  arms: "Braços",
  legs: "Pernas",
  glutes: "Glúteos",
  core: "Abdômen",
}

export function ResultsScreen({ userData, pdfUrl, error, onRestart }: ResultsScreenProps) {
  const handleDownloadPdf = async () => {
    if (!pdfUrl) return

    try {
      // Se estiver no Navegador (PC ou Mobile Browser), faz download padrão
      if (!Capacitor.isNativePlatform()) {
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = `Meu_Treino_FitPlan_Pro_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // Se estiver no APK (Android), usa a lógica de Filesystem/Share
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

        const fileName = `meu-treino-${Date.now()}.pdf`
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64String,
          directory: Directory.Cache
        })

        await Share.share({
          title: "Meu Treino FitPlan Pro",
          text: "Confira meu novo treino personalizado!",
          url: savedFile.uri,
        })
        return
      }

      const canShare = await Share.canShare()
      if (canShare.value) {
        await Share.share({
          title: "Meu Treino FitPlan Pro",
          url: pdfUrl,
        })
      } else {
        await Browser.open({ url: pdfUrl })
      }
    } catch (error) {
      console.error("[v0] Falha ao processar PDF:", error)
      // Fallback final: tenta abrir em uma nova aba
      window.open(pdfUrl, "_blank")
    }
  }

  const handleSaveToPermanent = async () => {
    if (!pdfUrl) return

    try {
      // Se estiver no Navegador, o comportamento do botão é similar ao download padrão
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

      const fileName = `Treino_FitPlan_Pro_${Date.now()}.pdf`

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64String,
        directory: Directory.Documents
      })

      alert(`Treino salvo com sucesso em Seus Documentos!\nNome: ${fileName}`)
    } catch (error) {
      console.error("[v0] Falha ao baixar PDF:", error)
      alert("Não foi possível salvar o arquivo permanentemente. Tente a opção de Compartilhar.")
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
                {error ? "Ops! Houve um problema" : pdfUrl ? "Seu Treino Está Pronto!" : "Dados Recebidos!"}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground truncate">
                Olá <span className="text-primary font-semibold">{userData.name}</span>,{" "}
                <span className="hidden sm:inline">
                  {error
                    ? "verifique o erro abaixo"
                    : pdfUrl
                      ? "a IA criou seu treino personalizado!"
                      : "a IA está analisando seu perfil..."}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-3 md:mt-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs md:text-sm">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Dados enviados
            </Badge>
            {error ? (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs md:text-sm">
                <XCircle className="h-3 w-3 mr-1" />
                Erro ao processar
              </Badge>
            ) : pdfUrl ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs md:text-sm">
                <FileText className="h-3 w-3 mr-1" />
                PDF pronto!
              </Badge>
            ) : (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs md:text-sm">
                <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
                Aguardando IA...
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
                  <p className="font-bold text-sm md:text-base text-foreground">Erro ao gerar o treino</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
              <div className="text-xs md:text-sm text-center text-muted-foreground bg-card/50 p-3 rounded-lg max-w-2xl">
                <p className="font-semibold mb-2">Como resolver:</p>
                <ul className="text-left space-y-1">
                  <li>• Verifique se o nó "Respond to Webhook" no n8n está configurado corretamente</li>
                  <li>• Certifique-se de que o workflow está retornando o campo "pdf_url" ou o PDF binário</li>
                  <li>• Teste o workflow manualmente no n8n para confirmar que está funcionando</li>
                </ul>
              </div>
              <Button onClick={onRestart} variant="outline" className="w-full sm:w-auto bg-transparent">
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
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
                  <p className="font-bold text-sm md:text-base text-foreground">Treino personalizado pronto!</p>
                  <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                    Criado pela nossa IA especialmente para você
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
                  Abrir/Enviar
                </Button>
                <Button
                  onClick={handleSaveToPermanent}
                  size="lg"
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 font-bold text-lg h-auto py-4 flex-1"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Baixar PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!pdfUrl && !error && (
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-cyan-500/10 border-b border-border">
          <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
            <div className="flex items-center justify-center gap-2 md:gap-4 text-center">
              <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-primary animate-pulse flex-shrink-0" />
              <p className="text-sm md:text-base text-foreground">
                <span className="font-bold">Nossa IA está criando seu treino.</span>
                <span className="text-muted-foreground ml-1 hidden sm:inline">Você receberá em instantes!</span>
              </p>
              <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-primary animate-pulse flex-shrink-0" />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-3 md:px-4 py-5 md:py-8 flex-1">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">Resumo do seu perfil:</h2>

          {/* Personal Info */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 md:gap-4">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Nome</p>
                <p className="font-semibold text-sm md:text-base text-foreground truncate">{userData.name}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Idade</p>
                <p className="font-semibold text-sm md:text-base text-foreground">{userData.age} anos</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Gênero</p>
                <p className="font-semibold text-sm md:text-base text-foreground capitalize">{userData.gender}</p>
              </div>
            </CardContent>
          </Card>

          {/* Training Profile */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                Perfil de Treino
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="p-3 md:p-4 rounded-lg bg-secondary/50">
                  <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Objetivo</p>
                  <p className="text-sm md:text-lg font-semibold text-primary">
                    {goalLabels[userData.goal] || userData.goal}
                  </p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-secondary/50">
                  <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Experiência</p>
                  <p className="text-sm md:text-lg font-semibold text-foreground">
                    {experienceLabels[userData.experience] || userData.experience}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg bg-secondary/50">
                  <Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">Frequência</p>
                    <p className="font-semibold text-sm md:text-base text-foreground">{userData.frequency}x/semana</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg bg-secondary/50">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">Duração</p>
                    <p className="font-semibold text-sm md:text-base text-foreground">{userData.availability}min</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment & Focus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                  <Dumbbell className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Equipamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {userData.equipment?.map((eq) => (
                    <Badge
                      key={eq}
                      variant="secondary"
                      className="bg-secondary text-secondary-foreground text-xs md:text-sm"
                    >
                      {equipmentLabels[eq] || eq}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                  <Target className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Grupos Musculares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {userData.muscleGroups?.map((muscle) => (
                    <Badge key={muscle} className="bg-primary/20 text-primary border-primary/30 text-xs md:text-sm">
                      {muscleLabels[muscle] || muscle}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Limitações */}
          {userData.limitations && (
            <Card className="bg-card border-border border-l-4 border-l-accent">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-foreground text-base md:text-lg">
                  <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                  Limitações e Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-foreground">{userData.limitations}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4 md:pt-6">
            {pdfUrl && (
              <Button
                onClick={handleDownloadPdf}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto font-bold text-lg h-auto py-4"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Abrir Treino em PDF
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              onClick={onRestart}
              className="border-border text-foreground hover:bg-secondary bg-transparent w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Nova Avaliação
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
