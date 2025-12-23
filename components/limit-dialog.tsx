"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { AuthService } from "@/lib/auth-service"

interface LimitDialogProps {
    personalId: string
    personalName: string
    currentLimit: number
    currentCount: number
    onSuccess: () => void
    onError: (error: string) => void
}

export function LimitDialog({
    personalId,
    personalName,
    currentLimit,
    currentCount,
    onSuccess,
    onError,
}: LimitDialogProps) {
    const [open, setOpen] = useState(false)
    const [newLimit, setNewLimit] = useState(currentLimit)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleSave = async () => {
        if (newLimit < 0) {
            onError("O limite deve ser maior ou igual a zero")
            return
        }

        setIsProcessing(true)

        const result = await AuthService.updateStudentLimit(personalId, newLimit)

        if (!result.success) {
            onError(result.error || "Erro ao alterar limite")
            setIsProcessing(false)
        } else {
            onSuccess()
            setOpen(false)
            setIsProcessing(false)
            setTimeout(() => window.location.reload(), 1000)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen)
                if (isOpen) {
                    setNewLimit(currentLimit)
                }
            }}
        >
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                    <Plus className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-white">Alterar Limite de Alunos</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Defina o limite máximo de alunos para {personalName}
                        <br />
                        <span className="text-orange-400">
                            Atual: {currentCount}/{currentLimit} alunos
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label className="text-gray-200">Novo Limite</Label>
                        <Input
                            type="number"
                            min="0"
                            step="100"
                            value={newLimit}
                            onChange={(e) => setNewLimit(Number.parseInt(e.target.value) || 0)}
                            className="bg-gray-800/50 border-gray-700 text-white"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        className="border-gray-700 text-gray-300 bg-transparent"
                        onClick={() => setOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600" disabled={isProcessing}>
                        {isProcessing ? "Salvando..." : "Salvar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
