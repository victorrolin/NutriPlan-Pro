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
import { useLanguage } from "@/context/language-context"

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
    const { t } = useLanguage()
    const [open, setOpen] = useState(false)
    const [newLimit, setNewLimit] = useState(currentLimit)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleSave = async () => {
        if (newLimit < 0) {
            onError(t('dashboard.admin.messages.errorLimit'))
            return
        }

        setIsProcessing(true)

        const result = await AuthService.updateStudentLimit(personalId, newLimit)

        if (!result.success) {
            onError(result.error || t('dashboard.admin.messages.errorLimit'))
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
                    <DialogTitle className="text-white">{t('dialogs.limit.title')}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {t('dialogs.limit.description').replace('{name}', personalName)}
                        <br />
                        <span className="text-orange-400">
                            {t('dialogs.limit.current')
                                .replace('{count}', currentCount.toString())
                                .replace('{limit}', currentLimit.toString())}
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label className="text-gray-200">{t('dialogs.limit.label')}</Label>
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
                        {t('dashboard.common.cancel')}
                    </Button>
                    <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600" disabled={isProcessing}>
                        {isProcessing ? t('dialogs.password.saving') : t('dashboard.common.save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
