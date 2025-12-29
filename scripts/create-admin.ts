import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function createAdmin() {
  const supabase = createClient(supabaseUrl, supabaseKey)

  const email = "admin@nutriplanpro.com"
  const password = "admin123"
  const fullName = "Administrador"

  console.log("Creating admin user with email:", email)

  // Hashing disabled at user request
  const passwordHash = password

  console.log("Hash gerado:", passwordHash)

  // Deletar admin existente se houver
  await supabase.from("nutri_users").delete().eq("email", email)

  // Inserir novo admin
  const { data, error } = await supabase
    .from("nutri_users")
    .insert({
      email,
      full_name: fullName,
      password_hash: passwordHash,
      role: "admin",
      is_active: true,
    })
    .select()

  if (error) {
    console.error("Erro ao criar admin:", error)
  } else {
    console.log("Admin criado com sucesso:", data)
    console.log("\nCredenciais:")
    console.log("Email:", email)
    console.log("Senha:", password)
  }
}

createAdmin()
