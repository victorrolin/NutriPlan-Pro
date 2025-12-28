"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Apple, ClipboardCheck, FileText, Sparkles, TrendingUp, Droplets, Target } from "lucide-react"
import { useLanguage } from "@/context/language-context"

interface PatientDashboardProps {
    userName: string
    onStartAssessment: () => void
    onViewDiet: () => void
}

export function PatientDashboard({ userName, onStartAssessment, onViewDiet }: PatientDashboardProps) {
    const { t } = useLanguage()

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {t('dashboard.patient.welcome').replace('{name}', userName)}
                </h2>
                <p className="text-gray-400">{t('dashboard.patient.subtitle')}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
                {/* Quick Actions */}
                <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ClipboardCheck className="w-32 h-32 text-green-500" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-green-500" />
                            {t('dashboard.patient.actions.title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Button
                            onClick={onStartAssessment}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-16 text-lg gap-3"
                        >
                            <ClipboardCheck className="w-6 h-6" />
                            <div className="text-left">
                                <div className="font-bold leading-tight">{t('dashboard.patient.actions.start')}</div>
                                <div className="text-xs font-normal opacity-80">{t('dashboard.patient.actions.startDesc')}</div>
                            </div>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={onViewDiet}
                            className="w-full border-gray-700 hover:bg-gray-800 h-16 text-lg gap-3 bg-transparent text-white"
                        >
                            <FileText className="w-6 h-6 text-orange-400" />
                            <div className="text-left">
                                <div className="font-bold leading-tight">{t('dashboard.patient.actions.view')}</div>
                                <div className="text-xs font-normal text-gray-400">{t('dashboard.patient.actions.viewDesc')}</div>
                            </div>
                        </Button>
                    </CardContent>
                </Card>

                {/* Tips & Info */}
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Apple className="w-5 h-5 text-orange-500" />
                            {t('dashboard.patient.tips.title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-gray-300">
                                <Droplets className="w-5 h-5 text-blue-400 shrink-0" />
                                <span className="text-sm">{t('dashboard.patient.tips.tip1')}</span>
                            </li>
                            <li className="flex gap-3 text-gray-300">
                                <TrendingUp className="w-5 h-5 text-green-400 shrink-0" />
                                <span className="text-sm">{t('dashboard.patient.tips.tip2')}</span>
                            </li>
                            <li className="flex gap-3 text-gray-300">
                                <Target className="w-5 h-5 text-red-400 shrink-0" />
                                <span className="text-sm">{t('dashboard.patient.tips.tip3')}</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Modern Stats/Cards */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {[
                    { label: "Hidratação", value: "3.5L", icon: Droplets, color: "text-blue-400" },
                    { label: "Objetivo", value: "Emagrecimento", icon: Target, color: "text-red-400" },
                    { label: "Consistência", value: "95%", icon: TrendingUp, color: "text-green-400" },
                    { label: "Plano Ativo", value: "IA v2.4", icon: Sparkles, color: "text-orange-400" },
                ].map((stat, i) => (
                    <Card key={i} className="bg-gray-950/50 border-gray-800 p-4">
                        <div className="flex flex-col items-center text-center gap-2">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            <div className="text-lg font-bold text-white">{stat.value}</div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500">{stat.label}</div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
