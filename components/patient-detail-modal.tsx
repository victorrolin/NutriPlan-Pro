"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DietPlanHistory } from "@/components/diet-plan-history"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, User } from "lucide-react"

interface Patient {
    id: string
    full_name: string
    email: string
    created_at: string
}

interface PatientDetailModalProps {
    patient: Patient | null
    isOpen: boolean
    onClose: () => void
}

export function PatientDetailModal({ patient, isOpen, onClose }: PatientDetailModalProps) {
    if (!patient) return null

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                        <User className="w-6 h-6 text-green-500" />
                        {patient.full_name}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Histórico completo de planos alimentares
                    </DialogDescription>
                </DialogHeader>

                {/* Patient Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Mail className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm text-white font-medium">{patient.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Calendar className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Cadastrado em</p>
                            <p className="text-sm text-white font-medium">{formatDate(patient.created_at)}</p>
                        </div>
                    </div>
                </div>

                {/* PDF History */}
                <div className="py-4">
                    <DietPlanHistory userId={patient.id} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
