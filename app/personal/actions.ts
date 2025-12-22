import { AuthService } from "@/lib/auth-service"
import { createClient } from "@/lib/supabase/client"
import { getSession } from "@/lib/session"

export async function createStudent(formData: {
  email: string
  password: string
  full_name: string
}) {
  const session = await getSession()

  if (!session || session.role !== "personal") {
    return { success: false, error: "Acesso negado" }
  }

  // Verificar limite de alunos
  const limitInfo = await AuthService.checkStudentLimit(session.userId)

  if (!limitInfo.canAdd) {
    return {
      success: false,
      error: `Limite de alunos atingido (${limitInfo.current}/${limitInfo.max}). Solicite aumento ao administrador.`,
    }
  }

  const { user, error } = await AuthService.signUp({
    email: formData.email,
    password: formData.password,
    full_name: formData.full_name,
    role: "user",
    created_by: session.userId,
  })

  if (error) {
    return { success: false, error }
  }

  // Atualizar contador de alunos
  await AuthService.recalculateStudentCount(session.userId)

  revalidatePath("/personal")
  return { success: true, error: null }
}

export async function toggleStudentStatus(studentId: string, isActive: boolean) {
  const session = await getSession()

  if (!session || session.role !== "personal") {
    return { success: false, error: "Acesso negado" }
  }

  try {
    const supabase = await createClient()

    // Verificar se o aluno pertence a este personal
    const { data: student } = await supabase.from("users").select("created_by").eq("id", studentId).single()

    if (!student || student.created_by !== session.userId) {
      return { success: false, error: "Aluno não encontrado" }
    }

    const { error } = await supabase
      .from("users")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", studentId)

    if (error) {
      return { success: false, error: "Erro ao atualizar aluno" }
    }

    // Revalidation handled by UI
    return { success: true, error: null }
  } catch (error) {
    console.error("Error toggling student status:", error)
    return { success: false, error: "Erro ao atualizar aluno" }
  }
}

export async function deleteStudent(studentId: string) {
  const session = await getSession()

  if (!session || session.role !== "personal") {
    return { success: false, error: "Acesso negado" }
  }

  try {
    const supabase = await createClient()

    // Verificar se o aluno pertence a este personal
    const { data: student } = await supabase.from("users").select("created_by").eq("id", studentId).single()

    if (!student || student.created_by !== session.userId) {
      return { success: false, error: "Aluno não encontrado" }
    }

    const { error } = await supabase.from("users").delete().eq("id", studentId)

    if (error) {
      return { success: false, error: "Erro ao excluir aluno" }
    }

    // Atualizar contador de alunos
    await AuthService.recalculateStudentCount(session.userId)

    // Revalidation handled by UI
    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting student:", error)
    return { success: false, error: "Erro ao excluir aluno" }
  }
}

export async function updateStudentPassword(studentId: string, newPassword: string) {
  const session = await getSession()

  if (!session || session.role !== "personal") {
    return { success: false, error: "Acesso negado" }
  }

  try {
    const supabase = await createClient()

    // Verificar se o aluno pertence a este personal
    const { data: student } = await supabase.from("users").select("created_by").eq("id", studentId).single()

    if (!student || student.created_by !== session.userId) {
      return { success: false, error: "Aluno não encontrado" }
    }

    const { success, error } = await AuthService.updatePassword(studentId, newPassword)

    if (!success) {
      return { success: false, error }
    }

    // Revalidation handled by UI
    return { success: true, error: null }
  } catch (error) {
    console.error("Error updating student password:", error)
    return { success: false, error: "Erro ao alterar senha" }
  }
}
