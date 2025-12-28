const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Função para ler o arquivo .env
function loadEnv() {
  const envVars = { ...process.env }; // Começa com as variáveis do sistema
  const envPath = path.join(__dirname, '..', '.env');

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const parts = trimmed.split('=');
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && value) {
          envVars[key] = value.replace(/^["']|["']$/g, '');
        }
      }
    });
  } else {
    console.log("Aviso: Arquivo .env não encontrado, usando variáveis de ambiente do sistema.");
  }

  return envVars;
}

async function createAdmin() {
  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Erro: Variáveis NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontradas no .env");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const email = "admin@nutriplanpro.com";
  const password = "admin123";
  const fullName = "Administrador";

  console.log("Iniciando criação do admin...");

  // Gerar hash bcrypt
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Deletar admin existente se houver
  await supabase.from("nutri_users").delete().eq("email", email);

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
    .select();

  if (error) {
    console.error("Erro ao criar admin:", error);
  } else {
    console.log("✅ Admin criado com sucesso!");
    console.log("\nCredenciais de Acesso:");
    console.log("Email:", email);
    console.log("Senha:", password);
  }
}

createAdmin();
