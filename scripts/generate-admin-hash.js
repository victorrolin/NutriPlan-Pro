// Script para gerar hash bcrypt e criar usuário admin
// Execute este script para ver o hash correto

const bcrypt = require("bcryptjs")

async function generateAdminHash() {
  const password = "admin123"
  const saltRounds = 10

  const hash = await bcrypt.hash(password, saltRounds)

  console.log("=".repeat(50))
  console.log('Hash bcrypt gerado para senha "admin123":')
  console.log("=".repeat(50))
  console.log(hash)
  console.log("=".repeat(50))
  console.log("\nSQL para atualizar no Supabase:")
  console.log("=".repeat(50))
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@fitplan.com';`)
  console.log("=".repeat(50))

  // Verificar se o hash funciona
  const isValid = await bcrypt.compare(password, hash)
  console.log(`\nVerificação: bcrypt.compare('admin123', hash) = ${isValid}`)
}

generateAdminHash()
