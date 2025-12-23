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
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  UserCog,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { AuthService } from "@/lib/auth-service"
import type { User } from "@/lib/auth-service"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/client"

interface AdminDashboardProps {
  users: User[]
  currentUserId: string
}

export function AdminDashboard({ users, currentUserId }: AdminDashboardProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const personalTrainers = users.filter((u) => u.role === "personal")
  const students = users.filter((u) => u.role === "user")
  const admins = users.filter((u) => u.role === "admin")

  // New user form - Incluindo personal como opção
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "user" as "admin" | "personal" | "user",
  })

  // Password change
  const [passwordChange, setPasswordChange] = useState({
    userId: "",
    newPassword: "",
  })

  const [limitChange, setLimitChange] = useState({
    personalId: "",
    newLimit: 100,
  })

  const [passwordDialogOpen, setPasswordDialogOpen] = useState<string | null>(null)
  const [limitDialogOpen, setLimitDialogOpen] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCreateUser = async () => {
    setError(null)
    setSuccess(null)
    setIsCreating(true)

    if (!newUser.email || !newUser.password || !newUser.full_name) {
      setError("Preencha todos os campos")
      setIsCreating(false)
      return
    }

    if (newUser.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres")
      setIsCreating(false)
      return
    }

    const { user, error } = await AuthService.signUp({
      email: newUser.email,
      password: newUser.password,
      full_name: newUser.full_name,
      role: newUser.role,
    })

    if (error) {
      setError(error)
      setIsCreating(false)
    } else {
      setSuccess("Usuário criado com sucesso!")
      setNewUser({ email: "", password: "", full_name: "", role: "user" })
      setIsCreating(false)
      // Reload page to refresh user list
      setTimeout(() => window.location.reload(), 1000)
    }
  }

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    setError(null)
    setSuccess(null)

    try {
      const supabase = await createClient()
      const { error } = await supabase
        .from("users")
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq("id", userId)

      if (error) {
        setError("Erro ao atualizar usuário")
      } else {
        setSuccess(currentStatus ? "Usuário bloqueado" : "Usuário desbloqueado")
        setTimeout(() => window.location.reload(), 1000)
      }
    } catch (error) {
      setError("Erro ao atualizar usuário")
    }
  }

  const handleDelete = async (userId: string) => {
    setError(null)
    setSuccess(null)
    setIsProcessing(true)

    try {
      const supabase = await createClient()
      const { error } = await supabase.from("users").delete().eq("id", userId)

      if (error) {
        setError("Erro ao excluir usuário")
        setIsProcessing(false)
      } else {
        setSuccess("Usuário excluído com sucesso")
        setDeleteDialogOpen(null)
        setIsProcessing(false)
        setTimeout(() => window.location.reload(), 1000)
      }
    } catch (error) {
      setError("Erro ao excluir usuário")
      setIsProcessing(false)
    }
  }

  const handlePasswordChange = async (userId: string, password: string) => {
    setError(null)
    setSuccess(null)
    setIsProcessing(true)

    if (!password || password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres")
      setIsProcessing(false)
      return
    }

    const { success, error } = await AuthService.updatePassword(userId, password)

    if (!success) {
      setError(error || "Erro ao alterar senha")
      setIsProcessing(false)
    } else {
      setSuccess("Senha alterada com sucesso")
      setPasswordDialogOpen(null)
      setPasswordChange({ userId: "", newPassword: "" })
      setIsProcessing(false)
      setTimeout(() => window.location.reload(), 1000)
    }
  }

  const handleLimitChange = async (personalId: string, newLimit: number) => {
    setError(null)
    setSuccess(null)
    setIsProcessing(true)

    if (newLimit < 0) {
      setError("O limite deve ser maior ou igual a zero")
      setIsProcessing(false)
      return
    }

    const result = await AuthService.updateStudentLimit(personalId, newLimit)

    if (!result.success) {
      setError(result.error || "Erro ao alterar limite")
      setIsProcessing(false)
    } else {
      setSuccess("Limite de alunos alterado com sucesso")
      setLimitDialogOpen(null)
      setLimitChange({ personalId: "", newLimit: 100 })
      setIsProcessing(false)
      setTimeout(() => window.location.reload(), 1000)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500/20 text-purple-400">Admin</Badge>
      case "personal":
        return <Badge className="bg-orange-500/20 text-orange-400">Personal</Badge>
      default:
        return <Badge className="bg-gray-700 text-gray-300">Aluno</Badge>
    }
  }

  const UserTable = ({ userList, showLimit = false }: { userList: User[]; showLimit?: boolean }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 hover:bg-gray-800/50">
            <TableHead className="text-gray-400">Nome</TableHead>
            <TableHead className="text-gray-400">Email</TableHead>
            <TableHead className="text-gray-400">Tipo</TableHead>
            {showLimit && <TableHead className="text-gray-400">Alunos</TableHead>}
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Criado em</TableHead>
            <TableHead className="text-gray-400 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.map((user) => (
            <TableRow key={user.id} className="border-gray-800 hover:bg-gray-800/30">
              <TableCell className="text-white font-medium">
                {user.full_name}
                {user.id === currentUserId && (
                  <Badge variant="outline" className="ml-2 text-orange-500 border-orange-500">
                    Você
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-gray-300">{user.email}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              {showLimit && (
                <TableCell className="text-gray-300">
                  <span className={user.student_count >= user.max_students ? "text-red-400" : "text-green-400"}>
                    {user.student_count}/{user.max_students}
                  </span>
                </TableCell>
              )}
              <TableCell>
                <Badge className={user.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                  {user.is_active ? "Ativo" : "Bloqueado"}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-400">{new Date(user.created_at).toLocaleDateString("pt-BR")}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Dialog
                    open={passwordDialogOpen === user.id}
                    onOpenChange={(open) => {
                      if (open) {
                        setPasswordDialogOpen(user.id)
                        setPasswordChange({ userId: user.id, newPassword: "" })
                      } else {
                        setPasswordDialogOpen(null)
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
                        <DialogTitle className="text-white">Alterar Senha</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Defina uma nova senha para {user.full_name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label className="text-gray-200">Nova Senha</Label>
                          <Input
                            type="password"
                            placeholder="Min. 6 caracteres"
                            value={passwordChange.newPassword}
                            onChange={(e) => setPasswordChange({ userId: user.id, newPassword: e.target.value })}
                            className="bg-gray-800/50 border-gray-700 text-white"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300 bg-transparent"
                          onClick={() => setPasswordDialogOpen(null)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={() => handlePasswordChange(user.id, passwordChange.newPassword)}
                          className="bg-orange-500 hover:bg-orange-600"
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Salvando..." : "Salvar"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {user.role === "personal" && (
                    <Dialog
                      open={limitDialogOpen === user.id}
                      onOpenChange={(open) => {
                        if (open) {
                          setLimitDialogOpen(user.id)
                          setLimitChange({ personalId: user.id, newLimit: user.max_students })
                        } else {
                          setLimitDialogOpen(null)
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-800">
                        <DialogHeader>
                          <DialogTitle className="text-white">Alterar Limite de Alunos</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Defina o limite máximo de alunos para {user.full_name}
                            <br />
                            <span className="text-orange-400">
                              Atual: {user.student_count}/{user.max_students} alunos
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
                              value={limitChange.newLimit}
                              onChange={(e) =>
                                setLimitChange({ personalId: user.id, newLimit: Number.parseInt(e.target.value) || 0 })
                              }
                              className="bg-gray-800/50 border-gray-700 text-white"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300 bg-transparent"
                            onClick={() => setLimitDialogOpen(null)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => handleLimitChange(user.id, limitChange.newLimit)}
                            className="bg-orange-500 hover:bg-orange-600"
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Salvando..." : "Salvar"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* Toggle Status */}
                  {user.id !== currentUserId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={
                        user.is_active
                          ? "text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                          : "text-green-500 hover:text-green-400 hover:bg-green-500/10"
                      }
                      onClick={() => handleToggleStatus(user.id, user.is_active)}
                      title={user.is_active ? "Bloquear" : "Desbloquear"}
                    >
                      {user.is_active ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    </Button>
                  )}

                  {user.id !== currentUserId && (
                    <Dialog
                      open={deleteDialogOpen === user.id}
                      onOpenChange={(open) => setDeleteDialogOpen(open ? user.id : null)}
                    >
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
                          <DialogTitle className="text-white">Excluir Usuário</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Tem certeza que deseja excluir {user.full_name}? Esta ação não pode ser desfeita.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            className="border-gray-700 text-gray-300 bg-transparent"
                            onClick={() => setDeleteDialogOpen(null)}
                          >
                            Cancelar
                          </Button>
                          <Button variant="destructive" onClick={() => handleDelete(user.id)} disabled={isProcessing}>
                            {isProcessing ? "Excluindo..." : "Excluir"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

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
              <span className="text-xl font-bold text-white">Painel Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-purple-400">
              <Shield className="w-4 h-4" />
              <span>{admins.length} Admins</span>
            </div>
            <div className="flex items-center gap-2 text-orange-400">
              <UserCog className="w-4 h-4" />
              <span>{personalTrainers.length} Personais</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span>{students.length} Alunos</span>
            </div>
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

        {/* Add User Card */}
        <Card className="bg-gray-900/50 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-orange-500" />
              Adicionar Novo Usuário
            </CardTitle>
            <CardDescription className="text-gray-400">Cadastre admins, personal trainers ou alunos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="grid gap-2">
                <Label className="text-gray-200">Nome Completo</Label>
                <Input
                  placeholder="Nome do usuário"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-200">Email</Label>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-200">Senha</Label>
                <Input
                  type="password"
                  placeholder="Min. 6 caracteres"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-200">Tipo</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: "admin" | "personal" | "user") => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="user">Aluno</SelectItem>
                    <SelectItem value="personal">Personal Trainer</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleCreateUser}
                  disabled={isCreating}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isCreating ? "Criando..." : "Criar Usuário"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Tabs */}
        <Card className="bg-gray-900/50 border-gray-800">
          <Tabs defaultValue="personals" className="w-full">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-white">Gerenciar Usuários</CardTitle>
                <TabsList className="bg-gray-800 border-gray-700">
                  <TabsTrigger value="personals" className="data-[state=active]:bg-orange-500">
                    Personal Trainers
                  </TabsTrigger>
                  <TabsTrigger value="students" className="data-[state=active]:bg-orange-500">
                    Alunos
                  </TabsTrigger>
                  <TabsTrigger value="admins" className="data-[state=active]:bg-orange-500">
                    Administradores
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="personals" className="mt-0">
                {personalTrainers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <UserCog className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum personal trainer cadastrado</p>
                  </div>
                ) : (
                  <UserTable userList={personalTrainers} showLimit={true} />
                )}
              </TabsContent>
              <TabsContent value="students" className="mt-0">
                {students.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum aluno cadastrado</p>
                  </div>
                ) : (
                  <UserTable userList={students} />
                )}
              </TabsContent>
              <TabsContent value="admins" className="mt-0">
                {admins.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum administrador cadastrado</p>
                  </div>
                ) : (
                  <UserTable userList={admins} />
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
