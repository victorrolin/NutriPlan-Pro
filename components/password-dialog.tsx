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
import { Key } from "lucide-react"
import { AuthService } from "@/lib/auth-service"
import { useLanguage } from "@/context/language-context"

interface PasswordDialogProps {
    userId: string
    userName: string
    onSuccess: () => void
    onError: (error: string) => void
}

export function PasswordDialog({ userId, userName, onSuccess, onError }: PasswordDialogProps) {
    const { t } = useLanguage()
    const [open, setOpen] = useState(false)
    const [password, setPassword] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)

    const handleSave = async () => {
        if (!password || password.length < 6) {
            onError(t('dashboard.personal.messages.passTooShort'))
            return
        }

        setIsProcessing(true)

        const { success, error } = await AuthService.updatePassword(userId, password)

        if (!success) {
            onError(error || t('dashboard.admin.messages.errorPass'))
            setIsProcessing(false)
        } else {
            onSuccess()
            setOpen(false)
            setPassword("")
            setIsProcessing(false)
            setTimeout(() => window.location.reload(), 1000)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen)
                if (!isOpen) {
                    setPassword("")
                }
            }}
        >
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                    <Key className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-white">{t('dialogs.password.title')}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {t('dialogs.password.description').replace('{name}', userName)}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label className="text-gray-200">{t('dialogs.password.label')}</Label>
                        <Input
                            type="password"
                            placeholder={t('dialogs.password.placeholder')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {isProcessing ? t('dialogs.password.saving') : t('dialogs.password.save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
