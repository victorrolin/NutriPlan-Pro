"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar, Target, Apple, Activity, Loader2 } from "lucide-react"
import { DietPlanService, type DietPlan } from "@/lib/diet-plan-service"
import { useLanguage } from "@/context/language-context"
import { Badge } from "@/components/ui/badge"

interface DietPlanHistoryProps {
    userId: string
}

export function DietPlanHistory({ userId }: DietPlanHistoryProps) {
    const { t } = useLanguage()
    const [plans, setPlans] = useState<DietPlan[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadPlans()
    }, [userId])

    const loadPlans = async () => {
        setLoading(true)
        setError(null)

        const { plans: fetchedPlans, error: fetchError } = await DietPlanService.getUserPlans(userId)

        if (fetchError) {
            setError(fetchError)
        } else {
            setPlans(fetchedPlans)
        }

        setLoading(false)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleOpenPdf = (plan: DietPlan) => {
        // If we have base64 data, convert it to blob URL
        if (plan.pdf_data) {
            const { PdfStorageService } = require('@/lib/pdf-storage-service')
            const blobUrl = PdfStorageService.base64ToBlobUrl(plan.pdf_data)
            if (blobUrl) {
                window.open(blobUrl, '_blank')
                return
            }
        }

        // Fallback to pdf_url
        window.open(plan.pdf_url, '_blank')
    }

    if (loading) {
        return (
            <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="py-8 text-center">
                    <p className="text-red-400">{error}</p>
                    <Button onClick={loadPlans} variant="outline" className="mt-4">
                        Tentar Novamente
                    </Button>
                </CardContent>
            </Card>
        )
    }

    if (plans.length === 0) {
        return (
            <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-500" />
                        {t('dashboard.patient.planHistory.title') || 'Meus Planos Alimentares'}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        {t('dashboard.patient.planHistory.description') || 'Histórico de todos os seus planos gerados'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="py-12 text-center">
                    <FileText className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">
                        {t('dashboard.patient.planHistory.empty') || 'Você ainda não tem planos alimentares'}
                    </p>
                    <p className="text-gray-500 text-sm">
                        {t('dashboard.patient.planHistory.emptyHint') || 'Clique em "Iniciar Nova Avaliação" para gerar seu primeiro plano'}
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-500" />
                    {t('dashboard.patient.planHistory.title') || 'Meus Planos Alimentares'}
                </CardTitle>
                <CardDescription className="text-gray-400">
                    {t('dashboard.patient.planHistory.description') || 'Histórico de todos os seus planos gerados'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {plans.map((plan, index) => (
                    <Card
                        key={plan.id}
                        className="bg-gray-950/50 border-gray-800 hover:border-green-500/50 transition-all group"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    {/* Header */}
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                                            <FileText className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-bold text-lg">
                                                {plan.plan_name || `Plano ${index + 1}`}
                                            </h3>
                                            {index === 0 && (
                                                <Badge className="bg-green-500/20 text-green-400 border-none text-xs mt-1">
                                                    Mais Recente
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-400">{formatDate(plan.created_at)}</span>
                                        </div>
                                        {plan.goal && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Target className="w-4 h-4 text-orange-500" />
                                                <span className="text-gray-400 capitalize">{plan.goal}</span>
                                            </div>
                                        )}
                                        {plan.diet_type && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Apple className="w-4 h-4 text-green-500" />
                                                <span className="text-gray-400 capitalize">{plan.diet_type}</span>
                                            </div>
                                        )}
                                        {plan.activity_level && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Activity className="w-4 h-4 text-blue-500" />
                                                <span className="text-gray-400 capitalize">{plan.activity_level}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <Button
                                        onClick={() => handleOpenPdf(plan)}
                                        size="sm"
                                        className="bg-green-500 hover:bg-green-600 text-white"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Visualizar
                                    </Button>
                                    <Button
                                        onClick={() => handleOpenPdf(plan)}
                                        size="sm"
                                        variant="outline"
                                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Baixar
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}
