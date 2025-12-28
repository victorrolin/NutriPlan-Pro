import { AuthService } from "@/lib/auth-service"
import { createClient } from "@/lib/supabase/client"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function getUsers() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    return { users: [], error: "Acesso negado" }
  }

  const users = await AuthService.listUsers()
  return { users, error: null }
}

export async function createUser(formData: {
  email: string
  password: string
  full_name: string
  role: "admin" | "personal" | "user"
}) {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    return { success: false, error: "Acesso negado" }
  }

  const { user, error } = await AuthService.signUp({
    email: formData.email,
    password: formData.password,
    full_name: formData.full_name,
    role: formData.role,
  })

  if (error) {
    return { success: false, error }
  }

  revalidatePath("/admin")
  return { success: true, error: null }
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    return { success: false, error: "Acesso negado" }
  }

  // Prevent admin from blocking themselves
  if (userId === session.userId) {
    return { success: false, error: "Você não pode bloquear sua própria conta" }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("nutri_users")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (error) {
      return { success: false, error: "Erro ao atualizar usuário" }
    }

    // revalidatePath("/admin")
    return { success: true, error: null }
  } catch (error) {
    console.error("Error toggling user status:", error)
    return { success: false, error: "Erro ao atualizar usuário" }
  }
}

export async function deleteUser(userId: string) {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    return { success: false, error: "Acesso negado" }
  }

  // Prevent admin from deleting themselves
  if (userId === session.userId) {
    return { success: false, error: "Você não pode excluir sua própria conta" }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.from("nutri_users").delete().eq("id", userId)

    if (error) {
      return { success: false, error: "Erro ao excluir usuário" }
    }

    // revalidatePath("/admin")
    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Erro ao excluir usuário" }
  }
}

export async function updateUserPassword(userId: string, newPassword: string) {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    return { success: false, error: "Acesso negado" }
  }

  const { success, error } = await AuthService.updatePassword(userId, newPassword)

  if (!success) {
    return { success: false, error }
  }

  // revalidatePath("/admin")
  return { success: true, error: null }
}

export async function updatePersonalLimit(personalId: string, newLimit: number) {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    return { success: false, error: "Acesso negado" }
  }

  const result = await AuthService.updateStudentLimit(personalId, newLimit)

  if (!result.success) {
    return { success: false, error: result.error }
  }

  // revalidatePath("/admin")
  return { success: true, error: null }
}

export async function getPersonals() {
  const session = await getSession()

  if (!session || session.role !== "admin") {
    return { users: [], error: "Acesso negado" }
  }

  const users = await AuthService.listPersonals()
  return { users, error: null }
}
