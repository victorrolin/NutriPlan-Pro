import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function setupAdmin() {
  const supabase = createClient(supabaseUrl, supabaseKey)

  const email = "admin@nutriplanpro.com"
  console.log("Creating admin user with email:", email)

  const password = "admin123"
  // Hashing disabled at user request
  const passwordHash = password

  console.log("[v0] Hash gerado:", passwordHash)

  // Atualizar o admin com o hash correto
  const { error } = await supabase
    .from("nutri_users")
    .update({ password_hash: passwordHash })
    .eq("email", "admin@nutriplanpro.com")

  if (error) {
    console.error("[v0] Erro ao atualizar:", error)
  } else {
    console.log("[v0] Admin atualizado com sucesso!")
    console.log("[v0] Email: admin@nutriplanpro.com")
    console.log("[v0] Senha: admin123")
  }
}

setupAdmin()
