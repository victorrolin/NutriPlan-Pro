import { AuthService } from "@/lib/auth-service"
import { createSession } from "@/lib/session"

export async function loginAction(email: string, password: string) {
  try {
    const { user, error } = await AuthService.signIn({ email, password })

    if (error || !user) {
      return { success: false, error: error || "Email ou senha incorretos" }
    }

    await createSession({
      userId: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      lastPdfUrl: user.last_pdf_url,
    })

    return { success: true, role: user.role }
  } catch (error: any) {
    console.error("Login Action Error:", error)
    return { success: false, error: `Erro no login: ${error?.message || JSON.stringify(error)}` }
  }
}
