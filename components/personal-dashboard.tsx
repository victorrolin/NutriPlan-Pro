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
  Users,
  UserPlus,
  Shield,
  ShieldOff,
  Trash2,
  Key,
  ArrowLeft,
  Dumbbell,
  Sparkles,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { AuthService } from "@/lib/auth-service"
import { createClient } from "@/lib/supabase/client"
import { PasswordDialog } from "@/components/password-dialog"
import type { User } from "@/lib/auth-service"
import { Footer } from "@/components/footer"

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
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // New student form
  const [newStudent, setNewStudent] = useState({
    email: "",
    password: "",
    full_name: "",
  })

  // Password change
  const [passwordChange, setPasswordChange] = useState({
    studentId: "",
    newPassword: "",
  })

  const limitPercentage = (currentUser.studentCount / currentUser.maxStudents) * 100
  const isAtLimit = currentUser.studentCount >= currentUser.maxStudents

  const handleCreateStudent = async () => {
    setError(null)
    setSuccess(null)
    setIsCreating(true)

    if (!newStudent.email || !newStudent.password || !newStudent.full_name) {
      setError("Preencha todos os campos")
      setIsCreating(false)
      return
    }

    if (newStudent.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres")
      setIsCreating(false)
      return
    }

    const { user, error } = await AuthService.signUp({
      email: newStudent.email,
      password: newStudent.password,
      full_name: newStudent.full_name,
      role: "user",
    })

    if (error) {
      setError(error)
      setIsCreating(false)
    } else {
      // Registrar vínculo com o personal
      const supabase = await createClient()
      const { error: linkError } = await supabase.from("personal_students").insert({
        personal_id: currentUser.id,
        student_id: user?.id,
      })

      if (linkError) {
        console.error("Error linking student:", linkError)
        // Mesmo com erro no link, o usuário foi criado. Idealmente deveríamos tratar isso.
      }

      setSuccess("Aluno criado com sucesso!")
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
      const { error } = await supabase
        .from("users")
        .update({ is_active: !currentStatus })
        .eq("id", studentId)

      if (error) {
        setError("Erro ao atualizar aluno")
      } else {
        setSuccess(currentStatus ? "Aluno bloqueado" : "Aluno desbloqueado")
        setTimeout(() => window.location.reload(), 1000)
      }
    } catch (error) {
      setError("Erro ao atualizar aluno")
    }
  }

  const handleDelete = async (studentId: string) => {
    setError(null)
    setSuccess(null)

    try {
      const supabase = await createClient()
      const { error } = await supabase.from("users").delete().eq("id", studentId)

      if (error) {
        setError("Erro ao excluir aluno")
      } else {
        setSuccess("Aluno excluído com sucesso")
        setTimeout(() => window.location.reload(), 1000)
      }
    } catch (error) {
      setError("Erro ao excluir aluno")
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Voltar</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Dumbbell className="w-8 h-8 text-orange-500" />
                <Sparkles className="w-4 h-4 text-orange-400 absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-bold text-white">Meus Alunos</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-5 h-5" />
            <span>{currentUser.studentCount} alunos</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-950/50 border-red-900">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-950/50 border-green-900 text-green-400">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Limite Card */}
        <Card className="bg-gray-900/50 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Limite de Alunos
            </CardTitle>
            <CardDescription className="text-gray-400">
              Você pode cadastrar até {currentUser.maxStudents} alunos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Alunos cadastrados</span>
                <span className={isAtLimit ? "text-red-400" : "text-green-400"}>
                  {currentUser.studentCount} / {currentUser.maxStudents}
                </span>
              </div>
              <Progress
                value={limitPercentage}
                className={`h-2 ${isAtLimit ? "[&>div]:bg-red-500" : "[&>div]:bg-orange-500"}`}
              />
              {isAtLimit && (
                <div className="flex items-center gap-2 text-yellow-500 text-sm mt-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Limite atingido. Solicite aumento ao administrador.</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Student Card */}
        <Card className={`bg-gray-900/50 border-gray-800 mb-8 ${isAtLimit ? "opacity-50" : ""}`}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-orange-500" />
              Adicionar Novo Aluno
            </CardTitle>
            <CardDescription className="text-gray-400">Cadastre um novo aluno para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="grid gap-2">
                <Label className="text-gray-200">Nome Completo</Label>
                <Input
                  placeholder="Nome do aluno"
                  value={newStudent.full_name}
                  onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                  className="bg-gray-800/50 border-gray-700 text-white"
                  disabled={isAtLimit}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-200">Email</Label>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="bg-gray-800/50 border-gray-700 text-white"
                  disabled={isAtLimit}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-200">Senha</Label>
                <Input
                  type="password"
                  placeholder="Min. 6 caracteres"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  className="bg-gray-800/50 border-gray-700 text-white"
                  disabled={isAtLimit}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleCreateStudent}
                  disabled={isCreating || isAtLimit}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
                >
                  {isCreating ? "Criando..." : "Criar Aluno"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Meus Alunos
            </CardTitle>
            <CardDescription className="text-gray-400">Gerencie os acessos dos seus alunos</CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-8 text-gray-400">Você ainda não tem alunos cadastrados</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-gray-800/50">
                      <TableHead className="text-gray-400">Nome</TableHead>
                      <TableHead className="text-gray-400">Email</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Criado em</TableHead>
                      <TableHead className="text-gray-400 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id} className="border-gray-800 hover:bg-gray-800/30">
                        <TableCell className="text-white font-medium">{student.full_name}</TableCell>
                        <TableCell className="text-gray-300">{student.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              student.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            }
                          >
                            {student.is_active ? "Ativo" : "Bloqueado"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(student.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Change Password */}
                            <PasswordDialog
                              userId={student.id}
                              userName={student.full_name}
                              onSuccess={() => setSuccess("Senha alterada com sucesso")}
                              onError={(error) => setError(error)}
                            />

                            {/* Toggle Status */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className={
                                student.is_active
                                  ? "text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                                  : "text-green-500 hover:text-green-400 hover:bg-green-500/10"
                              }
                              onClick={() => handleToggleStatus(student.id, student.is_active)}
                              title={student.is_active ? "Bloquear" : "Desbloquear"}
                            >
                              {student.is_active ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                            </Button>

                            {/* Delete */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-gray-900 border-gray-800">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Excluir Aluno</DialogTitle>
                                  <DialogDescription className="text-gray-400">
                                    Tem certeza que deseja excluir {student.full_name}? Esta ação não pode ser desfeita.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline" className="border-gray-700 text-gray-300 bg-transparent">
                                      Cancelar
                                    </Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button variant="destructive" onClick={() => handleDelete(student.id)}>
                                      Excluir
                                    </Button>
                                  </DialogClose>
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
      </main>

      <Footer />
    </div>
  )
}
