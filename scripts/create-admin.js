require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontradas.");
        console.log("Certifique-se de que o arquivo .env existe nesta pasta.");
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
