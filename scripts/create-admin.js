```javascript
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Função para ler o arquivo .env
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error("Erro: Arquivo .env não encontrado na raiz do projeto.");
    console.log("Certifique-se de que o arquivo .env existe em:", path.dirname(envPath));
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

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
