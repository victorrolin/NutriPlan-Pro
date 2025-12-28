"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  ShieldOff,
  UserPlus,
  Users,
  Search,
  Trash2,
  Settings,
  ShieldCheck,
  Apple,
  Utensils,
  LayoutDashboard,
  LogOut,
  Key,
  ShieldAlert,
  UserCheck,
  UserCog
} from "lucide-react"
import { AuthService } from "@/lib/auth-service"
import type { User } from "@/lib/auth-service"
import { createClient } from "@/lib/supabase/client"
import { PasswordDialog } from "@/components/password-dialog"
import { LimitDialog } from "@/components/limit-dialog"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"

interface AdminDashboardProps {
  initialUsers: User[]
  currentUserType: string
}

export function AdminDashboard({ initialUsers, currentUserType }: AdminDashboardProps) {
  const { t } = useLanguage()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // New user form
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "user" as "admin" | "personal" | "user",
  })

  const filteredByRole = (role: string) => users.filter((u) => u.role === role)

  const handleCreateUser = async () => {
    setError(null)
    setSuccess(null)
    setIsCreating(true)

    if (!newUser.email || !newUser.password || !newUser.full_name) {
      setError(t('dashboard.personal.messages.fillAll'))
      setIsCreating(false)
      return
    }

    const { user, error } = await AuthService.signUp(newUser)
    if (error) { setError(error); setIsCreating(false); }
    else {
      setSuccess(t('dashboard.admin.messages.successCreated'))
      setNewUser({ email: "", password: "", full_name: "", role: "user" })
      setIsCreating(false)
      setTimeout(() => window.location.reload(), 1000)
    }
  }

  const handleLogout = async () => {
    await AuthService.logout()
    window.location.href = "/"
  }

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    setError(null); setSuccess(null);
    try {
      const supabase = await createClient()
      const { error } = await supabase.from("nutri_users").update({ is_active: !currentStatus }).eq("id", userId)
      if (error) setError(t('dashboard.admin.messages.errorUpdate'))
      else {
        setSuccess(currentStatus ? t('dashboard.admin.messages.successBlocked') : t('dashboard.admin.messages.successUnblocked'))
        setTimeout(() => window.location.reload(), 1000)
      }
    } catch (e) { setError(t('dashboard.admin.messages.errorUpdate')) }
  }

  const handleDelete = async (userId: string) => {
    setError(null); setSuccess(null);
    try {
      const supabase = await createClient()
      const { error } = await supabase.from("nutri_users").delete().eq("id", userId)
      if (error) setError(t('dashboard.admin.messages.errorDelete'))
      else {
        setSuccess(t('dashboard.admin.messages.successDelete'))
        setTimeout(() => window.location.reload(), 1000)
      }
    } catch (e) { setError(t('dashboard.admin.messages.errorDelete')) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-orange-500" />
            <span className="text-xl font-bold text-white tracking-tight">NutriPlan <span className="text-orange-500">Admin</span></span>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden lg:flex items-center gap-6 border-r border-gray-800 pr-6 mr-6">
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{t('dashboard.admin.header.admins')}</p>
                <p className="text-lg font-bold text-white leading-none mt-1">{filteredByRole("admin").length}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{t('dashboard.admin.header.nutris')}</p>
                <p className="text-lg font-bold text-white leading-none mt-1">{filteredByRole("personal").length}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{t('dashboard.admin.header.students')}</p>
                <p className="text-lg font-bold text-white leading-none mt-1">{filteredByRole("user").length}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>

            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center border border-white/10 shadow-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && <Alert variant="destructive" className="mb-6 bg-red-950/50 border-red-900"><AlertDescription>{error}</AlertDescription></Alert>}
        {success && <Alert className="mb-6 bg-green-950/50 border-green-900 text-green-400"><AlertDescription>{success}</AlertDescription></Alert>}

        {/* System Stats Row */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-xl"><UserCog className="w-6 h-6 text-orange-500" /></div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Geral</p>
                <p className="text-2xl font-bold text-white">{users.length} Usuários</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl"><UserCheck className="w-6 h-6 text-green-500" /></div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Status</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.is_active).length} Ativos</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl"><ShieldAlert className="w-6 h-6 text-red-500" /></div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Segurança</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => !u.is_active).length} Bloqueados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add User Card */}
        <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-orange-500" />
              {t('dashboard.admin.addUser.title')}
            </CardTitle>
            <CardDescription className="text-gray-400">{t('dashboard.admin.addUser.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="grid gap-2"><Label className="text-gray-400 text-[10px] uppercase font-bold">{t('dashboard.personal.addStudent.nameLabel')}</Label><Input placeholder={t('dashboard.personal.addStudent.namePlaceholder')} value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} className="bg-gray-950/50 border-gray-800 text-white" /></div>
              <div className="grid gap-2"><Label className="text-gray-400 text-[10px] uppercase font-bold">{t('dashboard.personal.addStudent.emailLabel')}</Label><Input type="email" placeholder={t('dashboard.personal.addStudent.emailPlaceholder')} value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="bg-gray-950/50 border-gray-800 text-white" /></div>
              <div className="grid gap-2"><Label className="text-gray-400 text-[10px] uppercase font-bold">{t('dashboard.personal.addStudent.passwordLabel')}</Label><Input type="password" placeholder={t('dashboard.personal.addStudent.passwordPlaceholder')} value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="bg-gray-950/50 border-gray-800 text-white" /></div>
              <div className="grid gap-2"><Label className="text-gray-400 text-[10px] uppercase font-bold">{t('dashboard.admin.addUser.typeLabel')}</Label>
                <Select value={newUser.role} onValueChange={(value: "admin" | "personal" | "user") => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger className="bg-gray-950/50 border-gray-800 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    <SelectItem value="user">{t('dashboard.admin.addUser.roles.patient')}</SelectItem>
                    <SelectItem value="personal">{t('dashboard.admin.addUser.roles.nutri')}</SelectItem>
                    <SelectItem value="admin">{t('dashboard.admin.addUser.roles.admin')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end"><Button onClick={handleCreateUser} disabled={isCreating} className="w-full bg-orange-600 hover:bg-orange-700 font-bold shadow-lg shadow-orange-600/10 transition-transform active:scale-95">{isCreating ? t('dashboard.admin.addUser.loading') : t('dashboard.admin.addUser.button')}</Button></div>
            </div>
          </CardContent>
        </Card>

        {/* Users Management */}
        <Tabs defaultValue="personal" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <TabsList className="bg-gray-900/50 border border-gray-800 p-1">
              <TabsTrigger value="personal" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white uppercase text-[10px] font-bold tracking-widest px-6">{t('dashboard.admin.tabs.nutris')}</TabsTrigger>
              <TabsTrigger value="user" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white uppercase text-[10px] font-bold tracking-widest px-6">{t('dashboard.admin.tabs.patients')}</TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white uppercase text-[10px] font-bold tracking-widest px-6">{t('dashboard.admin.tabs.admins')}</TabsTrigger>
            </TabsList>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" /><Input placeholder="Pesquisar..." className="pl-10 bg-gray-950/50 border-gray-800 text-white w-full md:w-64" onChange={(e) => { const term = e.target.value.toLowerCase(); setUsers(initialUsers.filter((u) => u.full_name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term))) }} /></div>
          </div>
          <TabsContent value="personal" className="m-0"><UserTable users={filteredByRole("personal")} emptyMessage={t('dashboard.admin.empty.nutris')} onToggleStatus={handleToggleStatus} onDelete={handleDelete} onSuccess={setSuccess} onError={setError} t={t} /></TabsContent>
          <TabsContent value="user" className="m-0"><UserTable users={filteredByRole("user")} emptyMessage={t('dashboard.admin.empty.patients')} onToggleStatus={handleToggleStatus} onDelete={handleDelete} onSuccess={setSuccess} onError={setError} t={t} /></TabsContent>
          <TabsContent value="admin" className="m-0"><UserTable users={filteredByRole("admin")} emptyMessage={t('dashboard.admin.empty.admins')} onToggleStatus={handleToggleStatus} onDelete={handleDelete} onSuccess={setSuccess} onError={setError} t={t} /></TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}

function UserTable({ users, emptyMessage, onToggleStatus, onDelete, onSuccess, onError, t }: any) {
  return (
    <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md overflow-hidden">
      {users.length === 0 ? <div className="text-center py-12 text-gray-400">{emptyMessage}</div> : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow className="border-gray-800 hover:bg-transparent"><TableHead className="text-gray-400 uppercase text-[10px] font-bold tracking-widest pl-6">{t('dashboard.common.name')}</TableHead><TableHead className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">{t('dashboard.common.email')}</TableHead><TableHead className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">{t('dashboard.common.status')}</TableHead><TableHead className="text-gray-400 uppercase text-[10px] font-bold tracking-widest text-right pr-6">{t('dashboard.common.actions')}</TableHead></TableRow></TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id} className="border-gray-800 hover:bg-gray-800/20 transition-colors group">
                  <TableCell className="py-4 pl-6"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-orange-600 group-hover:text-white transition-colors">{user.full_name[0]}</div><div className="text-sm font-bold text-white">{user.full_name}</div></div></TableCell>
                  <TableCell className="text-gray-400 text-sm">{user.email}</TableCell>
                  <TableCell><Badge className={user.is_active ? "bg-green-500/10 text-green-400 border-none px-2 py-0.5" : "bg-red-500/10 text-red-400 border-none px-2 py-0.5"}>{user.is_active ? t('dashboard.common.active') : t('dashboard.common.blocked')}</Badge></TableCell>
                  <TableCell className="text-right pr-6"><div className="flex items-center justify-end gap-1">{user.role === "personal" && <LimitDialog personalId={user.id} personalName={user.full_name} currentLimit={user.max_students || 0} currentCount={user.student_count || 0} onSuccess={() => onSuccess(t('dashboard.admin.messages.successLimit'))} onError={onError} />}<PasswordDialog userId={user.id} userName={user.full_name} onSuccess={() => onSuccess(t('dashboard.admin.messages.successPass'))} onError={onError} /><Button variant="ghost" size="icon" className={user.is_active ? "text-yellow-500/50 hover:text-yellow-400 hover:bg-yellow-500/10" : "text-green-500/50 hover:text-green-400 hover:bg-green-500/10"} onClick={() => onToggleStatus(user.id, user.is_active)}>{user.is_active ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}</Button><Dialog><DialogTrigger asChild><Button variant="ghost" size="icon" className="text-red-500/50 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button></DialogTrigger><DialogContent className="bg-gray-900 border-gray-800"><DialogHeader><DialogTitle className="text-white">{t('dashboard.admin.messages.deleteTitle')}</DialogTitle><DialogDescription className="text-gray-400">{t('dashboard.admin.messages.deleteConfirm').replace('{name}', user.full_name)}</DialogDescription></DialogHeader><DialogFooter><DialogClose asChild><Button variant="outline" className="border-gray-700 text-gray-300 bg-transparent">{t('dashboard.common.cancel')}</Button></DialogClose><DialogClose asChild><Button variant="destructive" onClick={() => onDelete(user.id)}>{t('dashboard.common.delete')}</Button></DialogClose></DialogFooter></DialogContent></Dialog></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  )
}
