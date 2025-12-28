"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Utensils,
  UserPlus,
  Users,
  Shield,
  ShieldOff,
  Trash2,
  Key,
  LogOut,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Apple,
  ArrowLeft,
  AlertTriangle,
  TrendingUp,
  Activity,
  UserCheck,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { AuthService } from "@/lib/auth-service"
import { createClient } from "@/lib/supabase/client"
import { PasswordDialog } from "@/components/password-dialog"
import type { User } from "@/lib/auth-service"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"

interface PersonalDashboardProps {
  students: User[]
  currentUser: {
    id: string
    fullName: string
    email: string
    maxStudents: number
    studentCount: number
  }
}

export function PersonalDashboard({ students, currentUser }: PersonalDashboardProps) {
  const { t } = useLanguage()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // New student form
  const [newStudent, setNewStudent] = useState({
    email: "",
    password: "",
    full_name: "",
  })

  const limitPercentage = (currentUser.studentCount / currentUser.maxStudents) * 100
  const isAtLimit = currentUser.studentCount >= currentUser.maxStudents

  // Stats calculation
  const activeStudents = students.filter(s => s.is_active).length
  const newStudentsLast7d = students.filter(s => {
    const createdDate = new Date(s.created_at)
    const now = new Date()
    const diff = now.getTime() - createdDate.getTime()
    return diff <= 7 * 24 * 60 * 60 * 1000
  }).length

  const filteredStudents = students.filter(s =>
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateStudent = async () => {
    setError(null)
    setSuccess(null)
    setIsCreating(true)

    if (!newStudent.email || !newStudent.password || !newStudent.full_name) {
      setError(t('dashboard.personal.messages.fillAll'))
      setIsCreating(false)
      return
    }

    if (newStudent.password.length < 6) {
      setError(t('dashboard.personal.messages.passTooShort'))
      setIsCreating(false)
      return
    }

    const { user, error } = await AuthService.signUp({
      email: newStudent.email,
      password: newStudent.password,
      full_name: newStudent.full_name,
      role: "user",
      created_by: currentUser.id,
    })

    if (error) {
      setError(error)
      setIsCreating(false)
    } else {
      const supabase = await createClient()
      const { error: linkError } = await supabase.from("nutri_personal_students").insert({
        personal_id: currentUser.id,
        student_id: user?.id,
      })

      if (linkError) console.error("Error linking student:", linkError)

      setSuccess(t('dashboard.personal.messages.successCreated'))
      setNewStudent({ email: "", password: "", full_name: "" })
      setIsCreating(false)
      setTimeout(() => window.location.reload(), 1000)
    }
  }

  const handleToggleStatus = async (studentId: string, currentStatus: boolean) => {
    setError(null)
    setSuccess(null)
    try {
      const supabase = await createClient()
      const { error } = await supabase.from("nutri_users").update({ is_active: !currentStatus }).eq("id", studentId)
      if (error) setError(t('dashboard.personal.messages.errorUpdate'))
      else {
        setSuccess(currentStatus ? t('dashboard.personal.messages.successBlocked') : t('dashboard.personal.messages.successUnblocked'))
        setTimeout(() => window.location.reload(), 1000)
      }
    } catch (e) { setError(t('dashboard.personal.messages.errorUpdate')) }
  }

  const handleDelete = async (studentId: string) => {
    setError(null)
    setSuccess(null)
    try {
      const supabase = await createClient()
      const { error } = await supabase.from("nutri_users").delete().eq("id", studentId)
      if (error) setError(t('dashboard.personal.messages.errorDelete'))
      else {
        setSuccess(t('dashboard.personal.messages.successDelete'))
        setTimeout(() => window.location.reload(), 1000)
      }
    } catch (e) { setError(t('dashboard.personal.messages.errorDelete')) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">{t('dashboard.personal.header.back')}</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Utensils className="w-8 h-8 text-green-500" />
                <Sparkles className="w-4 h-4 text-green-400 absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">NutriPlan <span className="text-green-500">Pro</span></span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-white leading-none">{currentUser.fullName}</span>
              <span className="text-[10px] text-green-500 uppercase font-bold tracking-widest mt-1">Nutritionist</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center border border-white/10 shadow-lg">
              <span className="text-white font-bold">{currentUser.fullName[0]}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Alerts */}
        {error && <Alert variant="destructive" className="mb-6 bg-red-950/50 border-red-900"><AlertDescription>{error}</AlertDescription></Alert>}
        {success && <Alert className="mb-6 bg-green-950/50 border-green-900 text-green-400"><AlertDescription>{success}</AlertDescription></Alert>}

        {/* Top Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{t('dashboard.personal.stats.totalStudents')}</p>
                  <h3 className="text-3xl font-bold text-white mt-1">{currentUser.studentCount}</h3>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{t('dashboard.personal.stats.activeStudents')}</p>
                  <h3 className="text-3xl font-bold text-green-500 mt-1">{activeStudents}</h3>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <UserCheck className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{t('dashboard.personal.stats.newStudents')}</p>
                  <h3 className="text-3xl font-bold text-orange-500 mt-1">{newStudentsLast7d}</h3>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <Calendar className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{t('dashboard.personal.stats.growth')}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <h3 className="text-3xl font-bold text-white">+{((newStudentsLast7d / (currentUser.studentCount || 1)) * 100).toFixed(0)}%</h3>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <Activity className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Students Table */}
            <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-white text-xl flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    {t('dashboard.personal.studentsTable.title')}
                  </CardTitle>
                  <CardDescription className="text-gray-400">{t('dashboard.personal.studentsTable.description')}</CardDescription>
                </div>
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Buscar aluno..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-950/50 border-gray-800 pl-10 h-9"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">{t('dashboard.personal.studentsTable.empty')}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800 hover:bg-transparent">
                          <TableHead className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">{t('dashboard.common.name')}</TableHead>
                          <TableHead className="text-gray-400 uppercase text-[10px] font-bold tracking-widest hidden md:table-cell">{t('dashboard.common.email')}</TableHead>
                          <TableHead className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">{t('dashboard.common.status')}</TableHead>
                          <TableHead className="text-gray-400 uppercase text-[10px] font-bold tracking-widest text-right">{t('dashboard.common.actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student.id} className="border-gray-800 hover:bg-gray-800/20 transition-colors group">
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                  {student.full_name[0]}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-white">{student.full_name}</div>
                                  <div className="text-[10px] text-gray-500 md:hidden">{student.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-400 text-sm hidden md:table-cell">{student.email}</TableCell>
                            <TableCell>
                              <Badge className={student.is_active ? "bg-green-500/10 text-green-400 border-none px-2 py-0.5" : "bg-red-500/10 text-red-400 border-none px-2 py-0.5"}>
                                {student.is_active ? t('dashboard.common.active') : t('dashboard.common.blocked')}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <PasswordDialog userId={student.id} userName={student.full_name} onSuccess={() => setSuccess(t('dashboard.admin.messages.successPass'))} onError={setError} />
                                <Button variant="ghost" size="icon" className={student.is_active ? "text-yellow-500/50 hover:text-yellow-400 hover:bg-yellow-500/10" : "text-green-500/50 hover:text-green-400 hover:bg-green-500/10"} onClick={() => handleToggleStatus(student.id, student.is_active)}>
                                  {student.is_active ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild><Button variant="ghost" size="icon" className="text-red-500/50 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button></DialogTrigger>
                                  <DialogContent className="bg-gray-900 border-gray-800">
                                    <DialogHeader><DialogTitle className="text-white">{t('dashboard.personal.messages.deleteTitle')}</DialogTitle><DialogDescription className="text-gray-400">{t('dashboard.personal.messages.deleteConfirm').replace('{name}', student.full_name)}</DialogDescription></DialogHeader>
                                    <DialogFooter>
                                      <DialogClose asChild><Button variant="outline" className="border-gray-700 text-gray-300 bg-transparent">{t('dashboard.common.cancel')}</Button></DialogClose>
                                      <DialogClose asChild><Button variant="destructive" onClick={() => handleDelete(student.id)}>{t('dashboard.common.delete')}</Button></DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Limite Card */}
            <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  {t('dashboard.personal.limitCard.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('dashboard.personal.limitCard.panel')}</span>
                    <span className={`font-bold ${isAtLimit ? "text-red-500" : "text-green-500"}`}>{currentUser.studentCount} / {currentUser.maxStudents}</span>
                  </div>
                  <Progress value={limitPercentage} className={`h-2.5 ${isAtLimit ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"}`} />
                  {isAtLimit && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500 text-xs font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{t('dashboard.personal.limitCard.limitReached')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add Student Card */}
            <Card className={`bg-gray-900/40 border-gray-800 backdrop-blur-md transition-opacity duration-300 ${isAtLimit ? "opacity-50" : ""}`}>
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-500" />
                  {t('dashboard.personal.addStudent.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('dashboard.personal.addStudent.nameLabel')}</Label>
                  <Input
                    placeholder={t('dashboard.personal.addStudent.namePlaceholder')}
                    value={newStudent.full_name}
                    onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                    className="bg-gray-950/50 border-gray-800 text-white h-11"
                    disabled={isAtLimit}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('dashboard.personal.addStudent.emailLabel')}</Label>
                  <Input
                    type="email"
                    placeholder={t('dashboard.personal.addStudent.emailPlaceholder')}
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="bg-gray-950/50 border-gray-800 text-white h-11"
                    disabled={isAtLimit}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('dashboard.personal.addStudent.passwordLabel')}</Label>
                  <Input
                    type="password"
                    placeholder={t('dashboard.personal.addStudent.passwordPlaceholder')}
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                    className="bg-gray-950/50 border-gray-800 text-white h-11"
                    disabled={isAtLimit}
                  />
                </div>
                <Button onClick={handleCreateStudent} disabled={isCreating || isAtLimit} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-11 font-bold shadow-lg shadow-green-500/10">
                  {isCreating ? t('dashboard.personal.addStudent.loading') : t('dashboard.personal.addStudent.button')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
