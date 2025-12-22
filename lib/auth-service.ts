import { createClient } from "@/lib/supabase/client"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  email: string
  full_name: string
  role: "admin" | "personal" | "user"
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  max_students: number
  student_count: number
}

export interface SignUpData {
  email: string
  password: string
  full_name: string
  role?: "admin" | "personal" | "user"
  created_by?: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp(data: SignUpData): Promise<{ user: User | null; error: string | null }> {
    try {
      const supabase = await createClient()

      // Check if user already exists
      const { data: existingUser } = await supabase.from("users").select("id").eq("email", data.email).maybeSingle()

      if (existingUser) {
        return { user: null, error: "Email já cadastrado" }
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 10)

      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          email: data.email,
          password_hash: passwordHash,
          full_name: data.full_name,
          role: data.role || "user",
          created_by: data.created_by || null,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating user:", error)
        return { user: null, error: "Erro ao criar usuário" }
      }

      if (data.created_by) {
        await supabase.rpc("increment_student_count", { personal_id: data.created_by })
      }

      return { user: newUser as User, error: null }
    } catch (error) {
      console.error("Signup error:", error)
      return { user: null, error: "Erro ao cadastrar" }
    }
  }

  /**
   * Sign in user
   */
  static async signIn(data: SignInData): Promise<{ user: User | null; error: string | null }> {
    try {
      const supabase = await createClient()

      // Get user by email
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", data.email)
        .eq("is_active", true)
        .maybeSingle()

      if (error || !user) {
        console.error("[v0] User not found:", error)
        return { user: null, error: "Email ou senha incorretos" }
      }

      // TEMPORARY: Direct password comparison (bcrypt doesn't work in static exports)
      // TODO: Migrate to Supabase Auth or implement proper server-side authentication
      const isValidPassword = data.password === user.password_hash

      if (!isValidPassword) {
        console.error("[v0] Password mismatch")
        return { user: null, error: "Email ou senha incorretos" }
      }

      // Remove password_hash from returned user
      const { password_hash, ...userWithoutPassword } = user

      return { user: userWithoutPassword as User, error: null }
    } catch (error) {
      console.error("[v0] Signin error:", error)
      return { user: null, error: "Erro ao fazer login" }
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const supabase = await createClient()

      const { data: user } = await supabase
        .from("users")
        .select(
          "id, email, full_name, role, is_active, created_at, updated_at, created_by, max_students, student_count",
        )
        .eq("id", userId)
        .single()

      return user as User
    } catch (error) {
      console.error("[v0] Error getting user:", error)
      return null
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(
    userId: string,
    newPassword: string,
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const supabase = await createClient()

      const passwordHash = await bcrypt.hash(newPassword, 10)

      const { error } = await supabase.from("users").update({ password_hash: passwordHash }).eq("id", userId)

      if (error) {
        return { success: false, error: "Erro ao atualizar senha" }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error("[v0] Error updating password:", error)
      return { success: false, error: "Erro ao atualizar senha" }
    }
  }

  /**
   * List all users (admin only)
   */
  static async listUsers(): Promise<User[]> {
    try {
      const supabase = await createClient()

      const { data: users } = await supabase
        .from("users")
        .select(
          "id, email, full_name, role, is_active, created_at, updated_at, created_by, max_students, student_count",
        )
        .order("created_at", { ascending: false })

      return (users as User[]) || []
    } catch (error) {
      console.error("Error listing users:", error)
      return []
    }
  }

  static async listPersonals(): Promise<User[]> {
    try {
      const supabase = await createClient()

      const { data: users } = await supabase
        .from("users")
        .select(
          "id, email, full_name, role, is_active, created_at, updated_at, created_by, max_students, student_count",
        )
        .eq("role", "personal")
        .order("created_at", { ascending: false })

      return (users as User[]) || []
    } catch (error) {
      console.error("Error listing personals:", error)
      return []
    }
  }

  static async listStudentsByPersonal(personalId: string): Promise<User[]> {
    try {
      const supabase = await createClient()

      const { data: users } = await supabase
        .from("users")
        .select(
          "id, email, full_name, role, is_active, created_at, updated_at, created_by, max_students, student_count",
        )
        .eq("created_by", personalId)
        .eq("role", "user")
        .order("created_at", { ascending: false })

      return (users as User[]) || []
    } catch (error) {
      console.error("Error listing students:", error)
      return []
    }
  }

  static async checkStudentLimit(personalId: string): Promise<{ canAdd: boolean; current: number; max: number }> {
    try {
      const supabase = await createClient()

      const { data: personal } = await supabase
        .from("users")
        .select("max_students, student_count")
        .eq("id", personalId)
        .single()

      if (!personal) {
        return { canAdd: false, current: 0, max: 0 }
      }

      return {
        canAdd: personal.student_count < personal.max_students,
        current: personal.student_count,
        max: personal.max_students,
      }
    } catch (error) {
      console.error("Error checking student limit:", error)
      return { canAdd: false, current: 0, max: 0 }
    }
  }

  static async updateStudentLimit(
    personalId: string,
    newLimit: number,
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const supabase = await createClient()

      const { error } = await supabase
        .from("users")
        .update({ max_students: newLimit, updated_at: new Date().toISOString() })
        .eq("id", personalId)

      if (error) {
        return { success: false, error: "Erro ao atualizar limite" }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error("Error updating student limit:", error)
      return { success: false, error: "Erro ao atualizar limite" }
    }
  }

  static async recalculateStudentCount(personalId: string): Promise<void> {
    try {
      const supabase = await createClient()

      // Contar alunos ativos
      const { count } = await supabase
        .from("users")
        .select("id", { count: "exact" })
        .eq("created_by", personalId)
        .eq("role", "user")

      // Atualizar contador
      await supabase
        .from("users")
        .update({ student_count: count || 0 })
        .eq("id", personalId)
    } catch (error) {
      console.error("Error recalculating student count:", error)
    }
  }
}
