import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function setupAdmin() {
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Gerar hash bcrypt para a senha "admin123"
  const password = "admin123"
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  console.log("[v0] Hash gerado:", passwordHash)

  // Atualizar o admin com o hash correto
  const { error } = await supabase
    .from("users")
    .update({ password_hash: passwordHash })
    .eq("email", "admin@fitplan.com")

  if (error) {
    console.error("[v0] Erro ao atualizar:", error)
  } else {
    console.log("[v0] Admin atualizado com sucesso!")
    console.log("[v0] Email: admin@fitplan.com")
    console.log("[v0] Senha: admin123")
  }
}

setupAdmin()
